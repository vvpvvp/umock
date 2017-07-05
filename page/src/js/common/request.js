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
    getLocation() {
      return Ajax.get('/location');
    },
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
      return Ajax.get(`/swagger`, {url});
    },
    editProject(project){
      if (project.id) {
        return Ajax.postJson(`/project/${project.id}`, project);
      } else {
        return Ajax.postJson(`/project`, project);
      }
    },
    delete(id){
      return Ajax.delete(`/project/${id}`);
    }
  }
};

module.exports = Request;
