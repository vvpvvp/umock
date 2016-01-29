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
			projectStart:"/api/",
			mocksets: []
		},
		computed: {
			mocksetObjects: function() {
				// `this` 指向 vm 实例
				return toObject(this.mocksets, "_id", true);
			}
		},
		methods: {
			active: function(event) {
				changeStatus(event, true);
			},
			disactive: function(event) {
				changeStatus(event, false);
			}
		}
	});

	function changeStatus(event, active) {
		var button = $(event.target);
		var num = button.data('id');
		var content = v_list.mocksets[num];
		$.post("/umock/" + content._id, {
			_id: content._id,
			active: active
		});
		content.active = active;
	}

	getList();

	var v_edit = new Vue({
		el: '#editModal',
		data: {
			num: 0,
			_id: "",
			url: "",
			result: "",
			param: "",
			respParam: "",
			type: "",
			desc: "",
			active: true
		},
		methods: {
			edit: function(event) {
				var vm = this;
				Vue.nextTick(function() {
					vm.result = JSON.stringify(editor.get());
					var param = {};
					model(param, vm);
					if (valid(param) === false) return false;
					if (vm.editType == "create") {
						$.post("/umock", param)
							.done(function(result) {
								if (result.result == "ok") {
									v_list.mocksets.push(result.content);
									editModal.modal("hide");
								} else {
									alert("出错！");
								}
							})
					} else {
						var param = {};
						model(param, vm);
						$.post("/umock/" + param._id, param)
							.done(function(result) {
								if (result.result == "ok") {
									model(v_list.mocksets[vm.num], param);
									editModal.modal("hide");
								} else {
									alert("出错！");
								}
							})
					}

				});
			}
		}
	});

	function valid(param) {
		if (param.url === "" || param.result === "" || param.type === "") {
			alert("参数不全");
			return false;
		} else if (param.url.indexOf("\/") !== 0) {
			alert("url必须以/开头");
			return false;
		} else if (param.url.indexOf("/umock") != -1) {
			alert("url不能以/umock开头，与现在的url冲突");
			return false;
		}else if(param.url.indexOf(v_list.projectStart)!=0){
			alert("url必须以/api为开头！");
			return false;
		}
		return true;
	}

	function emptyEdit() {
		v_edit.num = 0;
		v_edit._id = "";
		v_edit.url = "";
		v_edit.desc = "";
		v_edit.result = "";
		v_edit.respParam = "";
		v_edit.param = "";
		v_edit.type = "";
		v_edit.active = true;
		editor.set({});
	}

	function model(toO, fromO) {
		toO._id = fromO._id;
		toO.url = fromO.url;
		toO.result = fromO.result;
		toO.desc = fromO.desc;
		toO.type = fromO.type;
		toO.param = fromO.param;
		toO.respParam = fromO.respParam;
		if (fromO.active != undefined) toO.active = fromO.active;
	}

	editModal.on('shown.bs.modal', function(event) {
		var button = $(event.relatedTarget);
		var type = button.data('type');
		if (type == "create") {
			v_edit.editType = "create";
		} else {
			var num = button.data('id');
			var content = v_list.mocksets[num];
			v_edit.num = num;
			model(v_edit, content);
			// v_edit.result = content.result;
			editor.set(JSON.parse(v_edit.result));
			v_edit.editType = "edit";
		}
	}).on("hide.bs.modal", function() {
		emptyEdit();
	});

	var v_delete = new Vue({
		el: '#confirmModal',
		data: {
			num: 0,
			_id: ""
		},
		methods: {
			delete: function(argument) {
				var vm = this;
				$.ajax({
						url: "/umock/" + vm._id,
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
		v_delete._id = content._id;
	});

	function getList() {
		$.get("/umock/list")
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