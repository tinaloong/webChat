 
	window.onload = function(){
		var chat = new Chat();
		chat.init();
	}

	var Chat = function(){
		this.socket = null;    // 定义一个socket对象；
	}


	Chat.prototype = {
		// body...
		init :  function(){
			var that = this;
			this.socket = io.connect();
			this.socket.on('connect', function() {
            	console.log('mmmmmm');
            	document.getElementById('loginWrap').style.display = 'block';
            	document.getElementById('loginIpt').focus();
        	});

			this.socket.on('system', function(name, status){
				var msg = name +status;
				that._displayMsg('system', msg, 'red');
			});

			this.socket.on('loginSuccess', function(){
				document.getElementById('loginWrap').style.display = 'none';
				
			});

			this.socket.on('existName', function(){
				alert("name is in use!");
			});

			this.socket.on('newMsg', function(name, content){
				that._displayMsg(name, content, 'gray');
			});

			//绑定事件
			document.getElementById('loginBtn').addEventListener('click',function(){
				var name = document.getElementById('loginIpt').value;

				if(name.trim() != ""){
					that.socket.emit('login', name);
					console.log('name==='+name);
				}else{
					alert('fill in name please!');
				}
			});

			document.getElementById('sendBtn').addEventListener('click',function(){
				var content = document.getElementById('sendContent').value,
				color = document.getElementById('colorStyle').value;
				if (content.trim() != "") {

					that.socket.emit('newMsg', content);
					document.getElementById('sendContent').value = "";
					document.getElementById('sendContent').focus();
					that._displayMsg('me', content, color);
				};
			});	

			document.getElementById('emoji').addEventListener('click', function(event){
				document.getElementById('emojiWraper').style.display = 'block';
				
				event.stopPropagation();

			},false);                                           //冒泡， 并且不往上传递冒泡
			document.body.addEventListener('click', function(event){
				var emojiWraper = document.getElementById('emojiWraper');
				if(event.target != emojiWraper){
					document.getElementById('emojiWraper').style.display = 'none';
				}
		
			});
			document.getElementById('emojiWraper').addEventListener('click', function(event){
				var target = event.target;
				if(target.nodeName.toLowerCase() == 'img'){
					document.getElementById('sendContent').value += '[emoji:' + target.title + ']';
					document.getElementById('sendContent').focus();
				}
			});
			document.getElementById('sendContent').addEventListener('keydown', function(e){

				    var theEvent = e || window.event;    
    				var code = theEvent.keyCode || theEvent.which || theEvent.charCode;      //兼容性 
    				if (code == 13) {    
      				  //回车执行查询
            			document.getElementById('sendBtn').click();
       				} 

			});


			this._initEmoji();

		},


		//通用函数
		_displayMsg : function(name, msg, color){

			msg = this._showEmoji(msg);
			var content = document.getElementById('chat-content');
			var newMsg = document.createElement('p');
			newMsg.innerHTML='<span style="color:'+color+'">'+name+':'+msg+'</span>';
			content.appendChild(newMsg);
			content.scrollTop = content.scrollHeight;  //定位到哪里 scroll

		},

		_initEmoji : function(){

			var dfrg = document.createDocumentFragment();
			for(var i = 1; i < 70; i++){
				var img = document.createElement('img');
				img.src = '../img/emoji/' + i + '.gif';
				img.title = i;
				dfrg.appendChild(img);
			}
			document.getElementById('emojiWraper').appendChild(dfrg);

		},
		_showEmoji : function(msg){
			var reg = /\[emoji:\d+\]/g, match, emojiIndex, result = msg;    // 正则表达式 循环匹配 reg = //g; reg.exec('');

			console.log('before==='+msg);
			while(match = reg.exec(msg)){    
				console.log('match==='+match);
				emojiIndex = match[0].slice(7, -1);                         //slice  循环切割
				result = result.replace(match[0], '<img class="emoji" src = "../img/emoji/'+emojiIndex+'.gif">');
			}
			console.log('result===='+result);
			return result;
		}




	};