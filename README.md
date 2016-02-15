# UMock
##服务器端的Mock Server  
综合配置众多后台服务的反向代理，可以集成不同的后台，可以让前端统一访问接口。  
并且通过配置mock返回的数据，统一开发流程。  
并且可以修改原本返回的数据，解决开发中的数据需求。  
##安装
###npm安装
下载
```
npm install umock
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
./bin/umock
```
##命令参数
设置端口号
```
umock -p 9000
```
设置配置文件
```
umock -f /配置文件地址
```
##配置文件：  
位置：默认当前项目根目录下面的umock.js，或者根据-f 配置文件地址  
配置：参照umock.bak.js文件
```javascript
'use strict';
const config = {
	//mongo地址以及数据库
	'mongo': {
		'uri': 'mongodb://hg014:20017/mock'
	},
	//服务启动的端口号
	'port': 20111
};
module.exports = config;
```
##备注
端口号默认为8000，-p命令设置优先级最大，其次是在配置文件中设置

##BASE:  
* [JQuery](http://jquery.com/)
* [Bootstrap](http://v3.bootcss.com/)
* [Vue](http://cn.vuejs.org/)
* [Mongo](https://www.mongodb.org/)

