// QcPlayer -- Html5 Music Player
// ele - html dom
function QcPlayer(ele){
	this.player = document.createElement('audio');
	this.list = [];
	this.muted = false;
	this.volume = 0.8;
	this.playRate = 0;
	this.uri = '';
	this.init(ele,this.player);

	Object.defineProperty(this,'author',{
		get: function(){
			return '濯清尘 2017';
		}
	});
}

QcPlayer.prototype.loadList = function(list){
	var _list = this.list;
	_list.items = list;
	_list.index = 0;
	_list.count = list.length;
	
	var listDom = document.querySelector('.qc_list');
	var lis = [];
	for(var i in list){
		lis[i] = document.createElement('li');
		lis[i].innerHTML = list[i].title;
		lis[i].setAttribute('data-id',i);
		listDom.appendChild(lis[i]);
	}
	var _this = this;
	listDom.addEventListener('click',function(e){
		if (e.target.tagName==='LI') {
			_list.index = e.target.dataset.id;
			_this.load(_list.items[_list.index]);
			_this.play();			
		}
	});

	this.player.onloadstart = function(){
		for (var i in lis) {
			if (parseInt(i)==_list.index) {
				lis[i].setAttribute('class','active');
			} else {
				lis[i].removeAttribute('class');
			}
		}
	}

	this.load(list[0]);
}

QcPlayer.prototype.next = function(){
	var _list = this.list;
	_list.index = ++_list.index>_list.count-1?0:_list.index;
	this.load(_list.items[_list.index]);
}

QcPlayer.prototype.prev = function(){
	var _list = this.list;
	_list.index = --_list.index<0?_list.count-1:_list.index;
	this.load(_list.items[_list.index]);
}

QcPlayer.prototype.load = function(audio){

	if (this.uri===audio.uri) {
		return this.play();  // 如果点选当前曲目,继续播放
	}

	//  重置加载
    this.uri = audio.uri;
	this.player.src = this.uri;
	this.title = audio.title;
	this.player.load();

	var _this = this;

	this.player.ondurationchange = function(){
		_this.info.title.innerHTML = _this.title;
		_this.info.fulltime.innerHTML = secondsToString(_this.player.duration);	
		_this._timeWatch();
	}

	this.player.ontimeupdate = function(){
		_this.info.curtime.innerHTML = secondsToString(_this.player.currentTime);
		if (_this.playRating) {
			return; 
		} 
		_this.playRate = _this.player.currentTime/_this.player.duration;
		_this._barChange();
		if (_this.player.ended) {
			_this.stop();
		}
	}
	
}

QcPlayer.prototype._timeWatch = function(){
	var _this = this;
	this.bar.duration.onmousedown = function(e){	
		e.preventDefault();
		if (e.target===_this.bar.duration_handle) {
			return;
		}
		_this.playRate = (e.clientX-this.offsetLeft)/this.offsetWidth;

		_this.player.currentTime = _this.player.duration*_this.playRate;
	}

	this.bar.duration_handle.onmousedown = function(e){
		e.preventDefault();
		e.stopPropagation();
		_this.playRating = true;
		var handleX = e.offsetX-6; //修正控制点位置偏差
		var moveDurHandle = function(e){
			e.preventDefault();
			var durX = e.clientX-_this.bar.duration.offsetLeft-handleX;
			var max = _this.bar.duration.offsetWidth;
			if(durX>max){
				durX = max;
			} else if(durX<0){
				durX = 0;
			}
			_this.playRate = durX/max;
			_this._barChange();
		}

		var finishDurHandle = function(e){
			e.preventDefault();
			_this.player.currentTime = _this.player.duration*_this.playRate;
			_this.playRating = false;
			window.removeEventListener('mousemove',moveDurHandle);
			window.removeEventListener('mouseup',finishDurHandle);
			window.onmousemove = null;
			window.onmouseup = null;	
		}

		window.addEventListener('mousemove',moveDurHandle);
		window.addEventListener('mouseup',finishDurHandle);
	}

}



QcPlayer.prototype.play = function(){
	if (!this.uri||!this.player.paused) {
		return;
	}
	this.player.play();
	this.control.play.className = 'button_pause';
}

QcPlayer.prototype.pause = function(){
	if (!this.uri||this.player.paused) {
		return;
	}
	this.player.pause();
	this.control.play.className = 'button_play';
}

QcPlayer.prototype.stop = function(){
	this.playRate = 0;
	this.control.play.className = 'button_play';
	this._barChange();
}

QcPlayer.prototype._barChange = function(){
	this.bar.duration_cur.style.width = this.playRate*100+'%';
	this.bar.duration_handle.style.left = this.playRate*100+'%';
}

QcPlayer.prototype.init = function(ele,player){
	var eles = [];
	var _this = this;
	_this.info = [];
	_this.bar = [];
	_this.control = [];

	// 曲目信息
	eles.audio_title = document.createElement('p');
	eles.audio_title.className = 'audio_title';
	eles.audio_title.innerHTML = _this.title;
	_this.info.title = eles.audio_title;

	// 时间信息
	eles.time = document.createElement('div');
	var fulltime_text = document.createElement('span');
	fulltime_text.className = 'time_text';
	fulltime_text.innerHTML = '00:00';
	var spit_text = document.createElement('span');
	spit_text.className = 'time_text';
	spit_text.innerHTML = ' / ';
	var curtime_text = document.createElement('span');
	curtime_text.className = 'time_text';
	curtime_text.innerHTML = '00:00';
	eles.time.appendChild(curtime_text);
	eles.time.appendChild(spit_text);
	eles.time.appendChild(fulltime_text);
	_this.info.curtime = curtime_text;
	_this.info.fulltime = fulltime_text;

	// 进度条
	eles.duration = document.createElement('div');
	eles.duration.className = 'control_bar';
	var duration_back = document.createElement('div');
	duration_back.className = 'control_bar_back';
	var duration_cur = document.createElement('div');
	duration_cur.className = 'control_bar_cur';
	var duration_handle = document.createElement('div');
	duration_handle.className = 'control_bar_handle';
	eles.duration.appendChild(duration_back);
	eles.duration.appendChild(duration_cur);
	eles.duration.appendChild(duration_handle);
	_this.bar.duration = eles.duration;
	_this.bar.duration_cur = duration_cur;
	_this.bar.duration_handle = duration_handle;

	// Buttons
	eles.btns = document.createElement('div');
	eles.btns.className = 'control_buttons';
	var play = document.createElement('div');
	play.className = 'button_play';
	var prev = document.createElement('div');
	prev.className = 'button_prev';
	var next = document.createElement('div');
	next.className = 'button_next';
	
	var buttons = [prev,play,next];
	for (var i in buttons) {
		eles.btns.appendChild(buttons[i]);
	}
	_this.control.play = play;

	// 音量条
	eles.volume = document.createElement('div');
	eles.volume.className = 'control_volume';
	var muted = document.createElement('div');
	muted.className = 'volume_muted';
	var volume_bar = document.createElement('div');
	volume_bar.className = 'control_bar';
	volume_bar.style.width = '60px';
	var volume_back = document.createElement('div');
	volume_back.className = 'control_bar_back';
	var volume_cur = document.createElement('div');
	volume_cur.className = 'control_bar_cur';
	var volume_handle = document.createElement('div');
	volume_handle.className = 'control_bar_handle';
	volume_handle.setAttribute('hidden','hidden');
	volume_bar.appendChild(volume_back);
	volume_bar.appendChild(volume_cur);
	volume_bar.appendChild(volume_handle);
	eles.volume.appendChild(muted);
	eles.volume.appendChild(volume_bar);
	

	for (var i in eles) {
		ele.appendChild(eles[i]);
	}

	function vol_barChange(){
		volume_cur.style.width = _this.volume*100+'%';
		volume_handle.style.left = _this.volume*100+'%';
		_this.player.volume = _this.volume;
	}

	vol_barChange();

	play.onclick = function(e){
		e.preventDefault();	
		
		if (_this.player.paused) {
			_this.play();
		} else {
			_this.pause();
		}
	}

	next.onclick = function(){
		_this.next();
		_this.play();
	}
	prev.onclick = function(){
		_this.prev();
		_this.play();
	}

	muted.onclick = function(){
		_this.muted = !_this.muted;
		_this.player.muted = _this.muted;
		if (_this.muted) {
			muted.className = 'volume_muted active';
			volume_cur.style.width = 0;
			volume_handle.style.left = 0;
		} else {
			muted.className = 'volume_muted';
			volume_cur.style.width = _this.volume*100+'%';
			volume_handle.style.left = _this.volume*100+'%';
		}
	}

	var setVol = function(){
		_this.player.volume = _this.volume;
		volume_cur.style.width = _this.volume*100+'%';
		volume_handle.style.left = _this.volume*100+'%';
		if (_this.volume===0) {
			muted.className = 'volume_muted active';
		} else {
			muted.className = 'volume_muted';
		}
	}

	var isVoling = false;

	volume_bar.onmouseover = function(e){
		volume_handle.removeAttribute('hidden');
	}
	volume_bar.onmouseout = function(e){
		if (isVoling) {
			return;
		}
		volume_handle.setAttribute('hidden','hidden');
	}


	volume_bar.onmousedown = function(e){	
		e.preventDefault();
		if (e.target===volume_handle) {
			return;
		}
		_this.volume = (e.clientX-this.offsetLeft)/this.offsetWidth;
		vol_barChange();
	}

	volume_handle.onmousedown = function(e){
		e.preventDefault();
		var handleX = e.offsetX-6;  //修正控制点位置偏差
		isVoling = true;
		var moveVolHandle = function(e){
			e.preventDefault();		
			var volX = e.clientX-volume_bar.offsetLeft-handleX;
			var max = volume_bar.offsetWidth;
			if(volX>max){
				volX = max;
			} else if(volX<0){
				volX = 0;
			}
			_this.volume = volX/max;
			vol_barChange();
		}

		var finishVolHandle = function(e){
			isVoling = false;
			volume_handle.setAttribute('hidden','hidden');
			window.removeEventListener('mousemove',moveVolHandle);
			window.removeEventListener('mouseup',finishVolHandle);
			window.onmousemove = null;
			window.onmouseup = null;
		}

		window.addEventListener('mousemove',moveVolHandle);
		window.addEventListener('mouseup',finishVolHandle);

	}

	

}


function secondsToString(seconds){
	var cur_time = Math.round(seconds);
	var cur_minutes = Math.floor(cur_time/60)<10?'0'+Math.floor(cur_time/60).toString():Math.floor(cur_time/60).toString();
	var cur_seconds = cur_time%60<10?'0'+(cur_time%60).toString():cur_time%60;
	return cur_minutes+':'+cur_seconds;
}