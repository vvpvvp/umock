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
###git安装
下载
```
git clone https://github.com/vvpvvp/umock.git
```
##参数
设置端口号
```
umock -p 9000
```
*端口号默认为8000，-p命令优先级更大，其次文件配置*

##项目配置
使用umock.js文件进行配置。
如果执行的命令在当前目录下，默认识别umock.js文件，或者使用命令-f识别。
###使用MySQL存储配置数据
执行
```
npm install mysql
```
在配置文件umock.js中
```json
const config = {
	'mysql': {
	'connectionLimit' : 20,
	   'host': 'localhost',
	   'user':"root",
	   'password':"root",
	   "database":"mock"
	}
};
module.exports = config;
```
###使用Mongo存储配置数据
执行
```
npm install mongoose
```
在配置文件umock.js中
```json
const config = {
    'mongo': {
    	'uri' : uri
    }

};
module.exports = config;
```

###使用本地存储配置数据
执行
```
npm install pouchdb
```
在配置文件umock.js中
```json
const config = {
    'pouchdb': {}

};
module.exports = config;
```

*具体配置参照umock.bak.js*


##启动
```javascript
//github本地安装，需要在根目录下添加umock.js
npm install
npm run start

//全局安装启动
umock -p 端口号 -f 配置文件
```
##访问
```
http://localhost:端口号
```

##界面
**不同后台项目列表**  
![项目列表](https://raw.githubusercontent.com/vvpvvp/umock/master/screen/project.png)

**编辑项目信息**  
![编辑项目信息](https://raw.githubusercontent.com/vvpvvp/umock/master/screen/projectedit.png)

**项目中配置的url列表**  
![项目中配置的url列表](https://raw.githubusercontent.com/vvpvvp/umock/master/screen/mockset.png)

**配置url**  
![配置url](https://raw.githubusercontent.com/vvpvvp/umock/master/screen/mocksetedit.png)

##Dependencies:  
* [JQuery](http://jquery.com/)
* [Bootstrap](http://v3.bootcss.com/)
* [Vue](http://cn.vuejs.org/)
* [Mongo](https://www.mongodb.org/)
* [Pouchdb](https://pouchdb.com/)


