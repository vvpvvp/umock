$(function(argument) {
	var v_project = new Vue({
		el: '#projectModal',
		data: getEmptyObject(),
		methods: {
			edit: function(event) {
				var vm = this;
				Vue.nextTick(function() {
					var param = {};
					model(param, vm);
					if (valid(param) === false) return false;
					if (vm.editType == "create") {
						$.post("/umock/project", param)
							.done(function(result) {
								if (result.result == "ok") {
									window.location.reload();
								} else {
									alert("出错！");
								}
							})
					} else {
						var param = {};
						model(param, vm);
						$.post("/umock/project/" + param._id, param)
							.done(function(result) {
								if (result.result == "ok") {
									window.location.reload();
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
		if (param.name === "" || param.beginPath === "" || param.proxy === "") {
			alert("参数不全");
			return false;
		} else if (param.beginPath.indexOf("\/") !== 0) {
			alert("url必须以/开头");
			return false;
		} else if (param.beginPath.indexOf("/umock") != -1) {
			alert("url不能以/umock开头，与现在的url冲突");
			return false;
		}
		return true;
	}

	function emptyEdit() {
		$.extend(v_project,getEmptyObject());
	}

	function getEmptyObject () {
		return {
			num:0,
			_id:"",
			name:"",
			desc:"",
			beginPath:"",
			proxy:"",
		}
	}

	function model(toO, fromO) {
		toO._id = fromO._id;
		toO.name = fromO.name;
		toO.beginPath = fromO.beginPath;
		toO.desc = fromO.desc;
		toO.proxy = fromO.proxy;
	}

	var projectModal = $('#projectModal');
	projectModal.on('shown.bs.modal', function(event) {
		var button = $(event.relatedTarget);
		var type = button.data('type');
		if (type == "create") {
			v_project.editType = "create";
		} else {
			var num = button.data('id');
			var content = v_list.mocksets[num];
			v_project.num = num;
			model(v_project, content);
			// v_project.result = content.result;
			editor.set(JSON.parse(v_project.result));
			v_project.editType = "edit";
		}
	}).on("hide.bs.modal", function() {
		emptyEdit();
	});

	// var v_delete = new Vue({
	// 	el: '#confirmModal',
	// 	data: {
	// 		num: 0,
	// 		_id: ""
	// 	},
	// 	methods: {
	// 		delete: function(argument) {
	// 			var vm = this;
	// 			$.ajax({
	// 					url: "/umock/" + vm._id,
	// 					type: "delete"
	// 				})
	// 				.done(function(result) {
	// 					if (result.result == "ok") {
	// 						v_list.mocksets.splice(vm.num, 1);
	// 						$("#confirmModal").modal("hide");
	// 					}
	// 				})
	// 		}
	// 	}
	// });



	// $("#confirmModal").on('shown.bs.modal', function(event) {
	// 	var button = $(event.relatedTarget);
	// 	var num = button.data('id');
	// 	v_delete.num = num;
	// 	var content = v_list.mocksets[num];
	// 	v_delete._id = content._id;
	// });

});