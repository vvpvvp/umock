import Ajax from './ajax';

const Request = {
  Home: {
  },
  Login: {
    login(param){
      return Ajax.postJson("/agent/login", param);
    },
    logout(param){
      return Ajax.post("/logout", param);
    }
  },
  Project: {
    list(){
      return Ajax.get('/project/list');
    },
    getProject(id){
      return Ajax.get(`/project/${id}`);
    },
    pathList(id){
      return Ajax.get(`/list/${id}`);
    },
    swagger(url){
      return Ajax.get(url);
    },
  }
};

module.exports = Request;
