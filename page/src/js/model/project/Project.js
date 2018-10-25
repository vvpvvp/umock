function toObject(proxys) {
  try {
    return JSON.parse(proxys || '[]');
  } catch (error) {
    return [];
  }
}

class Project extends Model {

  parse(data) {
    let element = super.parse(data);
    if (Utils.isArray(element)) {
      element.forEach((item) => {
        item.proxys = toObject(item.proxys);
      });
    } else {
      element.proxys = toObject(element.proxys);
    }
    log(element)
    return element;
  }

  dispose(data) {
    let proxys = data.proxys;
    let element = super.dispose(data);
    try {
      element.proxys = JSON.stringify(proxys || []);
    } catch (error) {
      element.proxys = '[]';
    }
    return element;
  }
}

export default new Project({
  id: 24,
  name: "",
  uniqueKey: "",
  identification: 0,
  summary: "",
  swagger: "",
  proxy: "",
  proxys: '',
  modifyTime: {
    type: Model.DATE
  },
  rewritePath: ''
})