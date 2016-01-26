$(function() {
	var editModal = $('#editModal');

	function toObject(list, idName, hasNum) {
		hasNum = hasNum === undefined ? false : hasNum;
		idName = idName === undefined ? "id" : idName;
		var listO = {};
		list.forEach(function(n, i) {
			listO[n[idName]] = n;
			if (hasNum) {
				listO[n[idName]].count = i;
			}
		});
		return listO;
	}

	/* body... */
	var v_list = new Vue({
		el: '#mockList',
		data: {
			mocksets: []
		},
		computed: {
			mocksetObjects: function() {
				// `this` 指向 vm 实例
				return toObject(this.mocksets, "_id", true);
			}
		}
	});

	getList();

	var v_edit = new Vue({
		el: '#editModal',
		data: {
			num: 0,
			id: "",
			url: "",
			result: "",
			type: ""
		},
		methods: {
			edit: function(event) {
				var vm = this;
				// 方法内 `this` 指向 vm
				// alert('Hello ' + this.name + '!')
				// // `event` 是原生 DOM 事件
				// alert(event.target.tagName)
				this.result = JSON.stringify(editor.get());
				if (this.type == "create") {
					$.post("/server", {
							url: this.url,
							result: this.result
						})
						.done(function(result) {
							if (result.result == "ok") {
								v_list.mocksets.push(result.content);
								emptyEdit();
								editModal.modal("hide");
							} else {
								alert("可能存在重复URL");
							}
						})
				} else {
					var param = {
						url: this.url,
						result: this.result
					};
					$.post("/server/" + this.id, param)
						.done(function(result) {
							if (result.result == "ok") {
								v_list.mocksets[vm.num].url = param.url;
								v_list.mocksets[vm.num].result = param.result;
								emptyEdit();
								editModal.modal("hide");
							} else {
								alert("可能存在重复URL");
							}
						})
				}
			}
		}
	});

	function emptyEdit() {
		v_edit.num = 0;
		v_edit.id = "";
		v_edit.url = "";
		v_edit.result = "";
		v_edit.type = "";
	}

	editModal.on('shown.bs.modal', function(event) {
		var button = $(event.relatedTarget);
		var type = button.data('type');
		if (type == "create") {
			v_edit.url = "";
			// v_edit.result = "";
			editor.set({});
			v_edit.type = "create";
		} else {
			var num = button.data('id');
			var content = v_list.mocksets[num];
			v_edit.id = content._id;
			v_edit.num = num;
			v_edit.url = content.url;
			// v_edit.result = content.result;
			editor.set(JSON.parse(content.result));
			v_edit.type = "edit";
		}
	});

	var v_delete = new Vue({
		el: '#confirmModal',
		data: {
			num: 0,
			id: ""
		},
		methods: {
			delete: function(argument) {
				var vm = this;
				$.ajax({
						url: "/server/" + vm.id,
						type: "delete"
					})
					.done(function(result) {
						if (result.result == "ok") {
							v_list.mocksets.splice(vm.num, 1);
							$("#confirmModal").modal("hide");
						}
					})
			}
		}
	});



	$("#confirmModal").on('shown.bs.modal', function(event) {
		var button = $(event.relatedTarget);
		var num = button.data('id');
		v_delete.num = num;
		var content = v_list.mocksets[num];
		v_delete.id = content._id;
	});

	function getList() {
		$.get("/server/list")
			.done(function(result) {
				if (result.result == "ok") {
					v_list.mocksets = result.content;
				}
			})
	}

	var container = document.getElementById('jsoneditor');

	var options = {
		mode: 'code',
		modes: ['code', 'form', 'text', 'tree', 'view'], // allowed modes
		onError: function(err) {
			alert(err.toString());
		},
		onModeChange: function(newMode, oldMode) {
			console.log('Mode switched from', oldMode, 'to', newMode);
		}
	};

	var editor = new JSONEditor(container, options, {});
})