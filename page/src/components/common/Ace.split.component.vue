<template>
  <div
  ref="editor"
  :id="getId"
  :style="divStyle"
  :class="className"
  >
  </div>  
</template>

<script>
  import ace from 'brace';
  import isEqual from 'lodash/isequal';
  import get from 'lodash/get';
  

  import { editorOptions } from 'js/editorOptions';
  import propsValue from 'js/props';
  import 'brace/theme/monokai';
  import 'brace/mode/markdown';

  import 'brace/ext/split';
  import 'brace/ext/language_tools';

  const { Range } = ace.acequire('ace/range');
  const { Split } = ace.acequire('ace/split');

  export default {
    props: propsValue,
    computed: {
      divStyle() {
        const { width, height, style } = this.$props;
        const divStyle = { width, height, ...style };
        return divStyle;
      },
      getId() {
        const { name } = this.$props;
        return name;
      }
    },
    watch: {
      'orientation': function(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.editor.env.split.setOrientation(newVal === 'below'
            ?
              this.editor.env.split.BELOW
            :
              this.editor.env.split.BESIDE);
        }
      },
      'splits': function(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.editor.env.split.setSplits(newVal)
        };
      },
      'mode': function(newVal, oldVal) {
        this.editor.env.split.forEach((editor, index) => {
          if (newVal !== oldVal) {
            editor.getSession().setMode('ace/mode/' + newVal);
          }
        });
      },
      'keyboardHandler': function(newVal, oldVal) {
        this.editor.env.split.forEach((editor, index) => {
          if (newVal !== oldVal) {
            if (newVal) {
              editor.setKeyboardHandler('ace/keyboard/' + newVal);
            } else {
              editor.setKeyboardHandler(null);
            }
          }
        });
      },
      'fontSize': function(newVal, oldVal) {
        this.editor.env.split.forEach((editor, index) => {
          if (newVal !== oldVal) {
            editor.setFontSize(newVal);
          }
        });
      },
      'wrapEnabled': function(newVal, oldVal) {
        this.editor.env.split.forEach((editor, index) => {
          if (newVal !== oldVal) {
            editor.getSession().setUseWrapMode(newVal);
          }
        });
      },
      'showPrintMargin': function(newVal, oldVal) {
        this.editor.env.split.forEach((editor, index) => {
          if (newVal !== oldVal) {
            editor.setShowPrintMargin(newVal);
          }
        });
      },
      'showGutter': function(newVal, oldVal) {
        this.editor.env.split.forEach((editor, index) => {
          if (newVal !== oldVal) {
            editor.renderer.setShowGutter(newVal);
          }
        });
      },
      'setOptions': function(newVal, oldVal) {
        this.editor.env.split.forEach((editor, index) => {
          for (let i = 0; i < editorOptions.length; i++) {
            const option = editorOptions[i];
            if (newVal[option] !== oldVal[option]) {
              editor.setOption(option, newVal[option]);
            }
          }
          if (!isEqual(newVal, oldVal)) {
            this.handleOptions(newVal, editor);
          }
        });
      },
      'value': function(newVal, oldVal) {
        this.editor.env.split.forEach((editor, index) => {
          const nextValue = get(newVal, index, '')
          if (editor.getValue() !== nextValue) {
            // editor.setValue is a synchronous function call, change event is emitted before setValue return.
            this.silent = true;
            const pos = editor.session.selection.toJSON();
            editor.setValue(nextValue, this.$props.cursorStart);
            editor.session.selection.fromJSON(pos);
            this.silent = false;
          }
        });
      },
      'annotations': function(newVal, oldVal) {
        this.editor.env.split.forEach((editor, index) => {
          const newAnnotations = get(newVal, index, [])
          const oldAnnotations = get(oldVal, index, [])
          if (!isEqual(newAnnotations, oldAnnotations)) {
            editor.getSession().setAnnotations(newAnnotations);
          }
        });
      },
      'markers': function(newVal, oldVal) {
        this.editor.env.split.forEach((editor, index) => {
          const newMarkers = get(newVal, index, [])
          const oldMarkers = get(oldVal, index, [])
          if (!isEqual(newMarkers, oldMarkers) && Array.isArray(newMarkers)) {
            this.handleMarkers(newMarkers, editor);
          }
        });
      },
      'theme': function(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.editor.env.split.setTheme('ace/theme/' + newVal);
        }
      },
      'focus': function(newVal, oldVal) {
        if (newVal && !oldVal) {
          this.splitEditor.focus();
        }
      },
      'height': function(newVal, oldVal) {
        if(newVal !== oldVal) {
          this.editor.resize();
        }
      },
      'width': function(newVal, oldVal) {
        if(newVal !== oldVal) {
          this.editor.resize();
        }
      },
    },
    mounted() {
      const {
        onBeforeLoad,
        mode,
        focus,
        theme,
        fontSize,
        value,
        defaultValue,
        cursorStart,
        showGutter,
        wrapEnabled,
        showPrintMargin,
        scrollMargin,
        keyboardHandler,
        onLoad,
        commands,
        annotations,
        markers,
        splits,
        name,
      } = this.$props;

      this.editor = ace.edit(this.$refs.editor);

      if (onBeforeLoad) {
        onBeforeLoad(ace);
      }

      const editorProps = Object.keys(this.$props.editorProps);

      const split = new Split(this.editor.container,`ace/theme/${theme}`, splits);
      this.editor.env.split = split;

      this.splitEditor = split.getEditor(0);
      this.split = split;

      // in a split scenario we don't want a print margin for the entire application
      this.editor.setShowPrintMargin(false);
      this.editor.renderer.setShowGutter(false);
      // get a list of possible options to avoid 'misspelled option errors'
      const availableOptions = this.splitEditor.$options;
      split.forEach((editor, index) => {
        for (let i = 0; i < editorProps.length; i++) {
          editor[editorProps[i]] = this.$props.editorProps[editorProps[i]];
        }
        const defaultValueForEditor = get(defaultValue, index)
        const valueForEditor = get(value, index, '')
        editor.setTheme(`ace/theme/${theme}`);
        editor.renderer.setScrollMargin(scrollMargin[0], scrollMargin[1], scrollMargin[2], scrollMargin[3])
        editor.getSession().setMode(`ace/mode/${mode}`);
        editor.setFontSize(fontSize);
        editor.renderer.setShowGutter(showGutter);
        editor.getSession().setUseWrapMode(wrapEnabled);
        editor.setShowPrintMargin(showPrintMargin);
        editor.on('focus', this.onFocusUpdate);
        editor.on('blur', this.onBlurUpdate);
        editor.on('input', this.onInputUpdate);
        editor.on('copy', this.onCopyUpdate);
        editor.on('paste', this.onPasteUpdate);
        editor.on('change', this.onChangeUpdate);
        editor.getSession().selection.on('changeSelection', this.selectionChange);
        editor.getSession().selection.on('changeCursor', this.cursorChange);
        editor.session.on('changeScrollTop', this.onScrollUpdate);
        editor.setValue(defaultValueForEditor === undefined ? valueForEditor : defaultValueForEditor, cursorStart);
        const newAnnotations = get(annotations, index, [])
        const newMarkers = get(markers, index, [])
        editor.getSession().setAnnotations(newAnnotations);
        if(newMarkers && newMarkers.length > 0){
          this.handleMarkers(newMarkers,editor);
        }

        for (let i = 0; i < editorOptions.length; i++) {
          const option = editorOptions[i];
          if (availableOptions.hasOwnProperty(option)) {
            editor.setOption(option, this.$props[option]);
          } else if (this.$props[option]) {
            console.warn(`VueAce: editor option ${option} was activated but not found. Did you need to import a related tool or did you possibly mispell the option?`)
          }
        }
        this.handleOptions(this.$props, editor);

        if (Array.isArray(commands)) {
          commands.forEach((command) => {
            if(typeof command.exec == 'string') {
              editor.commands.bindKey(command.bindKey, command.exec);
            }
            else {
              editor.commands.addCommand(command);
            }
          });
        }

        if (keyboardHandler) {
          editor.setKeyboardHandler('ace/keyboard/' + keyboardHandler);
        }
      })

      if (focus) {
        this.splitEditor.focus();
      }

      const sp = this.editor.env.split;
      sp.setOrientation( this.$props.orientation === 'below' ? sp.BELOW : sp.BESIDE);
      sp.resize(true)
      if (onLoad) {
        onLoad(sp);
      }
    },
    methods: {
      onChangeUpdate(event) {
        if (this.$props.onChange && !this.silent) {
          let value = []
          this.editor.env.split.forEach((editor) => {
            value.push(editor.getValue())
          })
          this.$props.onChange(value, event);
        }
      },
      selectionChange(event) {
        if (this.$props.onSelectionChange) {
          let value = []
          this.editor.env.split.forEach((editor) => {
            value.push(editor.getSelection())
          })
          this.$props.onSelectionChange(value, event);
        }
      },
      cursorChange(event) {
        if(this.$props.onCursorChange) {
          let value = []
          this.editor.env.split.forEach((editor) => {
            value.push(editor.getSelection())
          })
          this.$props.onCursorChange(value, event)
        }
      },
      onFocusUpdate(event) {
        if (this.$props.onFocus) {
          this.$props.onFocus(event);
        }
      },
      onInputUpdate(event) {
        if (this.$props.onInput) {
          this.$props.onInput(event);
        }
      },
      onBlurUpdate(event) {
        if (this.$props.onBlur) {
          this.$props.onBlur(event);
        }
      },
      onCopyUpdate(text) {
        if (this.$props.onCopy) {
          this.$props.onCopy(text);
        }
      },
      onPasteUpdate(text) {
        if (this.$props.onPaste) {
          this.$props.onPaste(text);
        }
      },
      onScrollUpdate() {
        if (this.$props.onScroll) {
          this.$props.onScroll(this.editor);
        }
      },
      handleOptions(props, editor) {
        const setOptions = Object.keys(props.setOptions);
        for (let y = 0; y < setOptions.length; y++) {
          editor.setOption(setOptions[y], props.setOptions[setOptions[y]]);
        }
      },
      handleMarkers(markers, editor) {
        // remove foreground markers
        let currentMarkers = editor.getSession().getMarkers(true);
        for (const i in currentMarkers) {
          if (currentMarkers.hasOwnProperty(i)) {
            editor.getSession().removeMarker(currentMarkers[i].id);
          }
        }
        // remove background markers
        currentMarkers = editor.getSession().getMarkers(false);
        for (const i in currentMarkers) {
          if (currentMarkers.hasOwnProperty(i)) {
            editor.getSession().removeMarker(currentMarkers[i].id);
          }
        }
        // add new markers
        markers.forEach(({ startRow, startCol, endRow, endCol, className, type, inFront = false }) => {
          const range = new Range(startRow, startCol, endRow, endCol);
          editor.getSession().addMarker(range, className, type, inFront);
        });
      },
    },
    destroyed() {
      this.editor.destroy();
      this.editor = null;
    }
  }
</script>
