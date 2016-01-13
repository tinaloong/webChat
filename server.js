var http = require('http');
var socketio = require('socket.io');
var express = require('express');


	var app = express();   // express 是一个 node 框架，他的实例用来定义 监听端口之后的毁掉函数
	                       //   1.将html 代码和后台代码分离 中间件 response request 对象
	                       //   2.路由管理,执行不同的http请求 post get delete 方法
	                       //   3.通过向模板递交参数来动态渲染HTML页面 文件上传和cookie
	var server = http.createServer(app);
	var io = socketio.listen(server); 
	server.listen(8081);


	app.use('/', express.static(__dirname + '/source'));

	//当用户发送

	var  user = [];        // 当有新的用户登陆的时候，将用户存在user列表中 1.统计线上的人数，2.线上用户不能重名
	io.sockets.on('connection', function(socket){
		console.log('hhhhhh');
		socket.on('login', function(name){
			console.log('login already!!!');

			console.log('user' + user);
			if(user.indexOf(name)>-1){

				console.log('name is in user');
				socket.emit('existName');
			}else{
				socket.userIndex = user.length;
				socket.username = name;
				user.push(name);
				io.sockets.emit('system', name, 'login');
				socket.emit('loginSuccess');
			}
		});

		socket.on('disconnect', function(){

				io.sockets.emit('system', socket.username, 'logout');

		});

		socket.on('newMsg', function(content){
			console.log('newMsg==' + content);
			socket.broadcast.emit('newMsg', socket.username, content);
		});

	});