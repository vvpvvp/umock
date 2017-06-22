import VueRouter from 'vue-router';

const initRouter = ()=>{
  const routerParam = {
    mode: 'history',
    routes: [{
      path: '/',
      name: 'index',
      component: (resolve) => require(['components/project/project-list'], resolve)
    },{
      path: '/:id',
      name: 'detail',
      component: (resolve) => require(['components/project/project-detail'], resolve)
    }]
  };

  let router = new VueRouter(routerParam);

  router.beforeEach((to, from, next) => {
    HeyUI.$LoadingBar.start();
    // if (titleConfig[to.name]) {
    //   document.title = titleConfig[to.name] + ' - 应用';
    // } else {
      document.title = 'UMock';
    // }
    next();
  })
  router.afterEach(() => {
    HeyUI.$LoadingBar.success();
    // Vue.nextTick(() => {
    //   $('.app-body').scrollTop(0);
    // });
  });
  return router;
}

export default initRouter;
