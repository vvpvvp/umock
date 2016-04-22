# umock
##服务器端的Mock Server  
- 综合配置众多后台服务的反向代理，集成不同的后台，让前端统一访问接口。  
- 通过配置mock返回的数据，统一开发流程。  
- 修改后台返回的数据，解决开发中的数据需求。  

##安装
###npm安装
```
npm install -g umock
```
启动
```
umock
```
###git安装
下载
```
git clone https://github.com/vvpvvp/umock.git
```
启动
```
npm run start
```
##访问
```
http://localhost:8000
```

##参数
设置端口号
```
umock -p 9000
```
##备注
端口号默认为8000，-p命令优先级更大

##Dependencies:  
* [JQuery](http://jquery.com/)
* [Bootstrap](http://v3.bootcss.com/)
* [Vue](http://cn.vuejs.org/)
* [Mongo](https://www.mongodb.org/)
* [Pouchdb](https://pouchdb.com/)
