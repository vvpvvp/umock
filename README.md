# umock
## 服务器端的Mock Server
- 综合配置众多后台服务的反向代理，集成不同的后台，前端任意调用不同的后台调试。
- 通过swagger统一接口数据，并且可以随意备注。  
- 标注接口开发状态与归属人员，方便可以追踪开发状态。
- mock数据，开发前期协作利器。
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

## 在线版本

[http://umock.ch-un.com](http://umock.ch-un.com/)

## Dependencies:  
* [Vue](http://cn.vuejs.org/)
* [HeyUI](http://www.heyui.top/)


