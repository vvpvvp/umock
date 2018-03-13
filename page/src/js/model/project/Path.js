export default new Model({
  url: '',
  desc: '',
  result: '',
  dataHandler: {
    type: Model.STRING,
    default: "over"
  }, //over覆盖,overlying叠加
  type: {
    type: Model.STRING,
    default: "GET"
  },
  isreg: { type: Model.BOOLEAN, default: false },
  param: '',
  respParam: '',
  menuId: '',
  projectId: '',
  active: {
    type: Model.BOOLEAN,
    default: true
  },
  show: {
    type: Model.BOOLEAN,
    default: false
  }
})
