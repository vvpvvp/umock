export default new Model({
  id: 0,
  url: '',
  desc: '',
  result: '',
  dataHandler: '', //over覆盖,overlying叠加
  type: {
    type: Model.STRING,
    default: "get"
  },
  summary: '',
  isreg: { type: Model.BOOLEAN, default: false },
  tags: '',
  projectId: '',
  active: {
    type: Number,
    default: 1
  }
})
