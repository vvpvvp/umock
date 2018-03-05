# umock
## 服务器端的Mock Server
- 综合配置众多后台服务的反向代理，集成不同的后台，前端任意调用不同的后台调试。
- 通过解析swagger.json统一接口数据展示。
- 对每个接口可以设定测试数据，随时完成API调试。
- mock数据，开发前期协作利器。
- 中间拦截，修改返回数据，前后端彻底分离开发。


## 安装
### npm安装
```
npm install -g umock
```
### git安装
下载
```
git clone https://github.com/vvpvvp/umock.git
```
## 参数
设置端口号
```
umock -p 9000
```
*端口号默认为8000，-p命令优先级更大，其次文件配置*

## 项目配置
使用umock.js文件进行配置。
如果执行的命令在当前目录下，默认识别umock.js文件，或者使用命令-f识别。
### 使用MySQL存储配置数据
执行
```
npm install mysql
```
在配置文件umock.js中
```json
const config = {
	"mysql": {
		"connectionLimit" : 20,
		"host": "localhost",
		"user":"root",
		"password":"root",
		"database":"mock"
	}
};
module.exports = config;
```
*数据库初始化，使用文件mock.sql*

## 启动

```javascript
//github本地安装，需要在根目录下添加umock.js
npm install
npm run start

//全局安装启动
umock -p 端口号 -f 配置文件
```

推荐安装[nodemon](https://www.npmjs.com/package/nodemon)，如果安装了nodemon，则执行：

```javascript
npm run server
```

## 访问
```
http://localhost:端口号
```
### Demo
#### 配置
这里我们使用Swagger的官方demo进行配置:    
<img width="500" src="http://p3mm4te0u.bkt.clouddn.com//demo/1518494340627.jpg"/>
#### 详情
在详情页，可以查看该Swagger返回的接口说明，具体请访问 [http://umock.ch-un.com/server/5](http://umock.ch-un.com/server/2)
#### 反向代理
umock本身就是一个数据mock的服务器，通过访问umock,添加author的Header，即可反向代理至任何后端。  
<img width="500" src="http://p3mm4te0u.bkt.clouddn.com//demo/1518494327259.jpg"/> 

## 在线版本

[http://umock.ch-un.com](http://umock.ch-un.com/)

## Dependencies:  
* [Vue](http://cn.vuejs.org/)
* [HeyUI](http://www.heyui.top/)


