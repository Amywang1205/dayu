/*获取页面元素*/
var $mediaBg = $('#media_bg'),
	$mask = $('.mask'),
	$sign = $('.sign'),
	$signIn = $('.sign_in'),
	$signUp = $('.sign_up'),
	$logout = $('.logout'),
	$signBox = $('.sign_box'),
	$yesBtn = $('.sign_box .yes'),
	$noBtn = $('.sign_box .no'),
	$play = $('.play'),
	$controls = $('.controls');

/*设置视频居中*/
//获取可视区域的宽高
var clientW = window.innerWidth,
	clientH = window.innerHeight;


console.dir($mediaBg[0]);
init();
$mediaBg.on(
	'loadeddata',	
	function(){
		var h = $mediaBg.height(),
		l = (h / clientH * clientW - clientW) / 2;
		$mediaBg.css({
			height: clientH,
			left: l
		});
		$mediaBg[0].volume = 0;
	}
);
/*登录退出按钮*/
$logout.click(
	function() {
		localStorage.removeItem('username');
		$('.not_login').show();
		$('.login').hide();
		$('.parts').html('');
	}
)
console.dir(localStorage);
/*点击屏幕播放按钮*/
$play.click(
	function(){
		$mask.fadeOut();
		$sign.fadeOut();
		$(this).fadeOut();
		$mediaBg[0].volume = 1;
		$mediaBg[0].currentTime = 0;
		$controls.animate({
			height: 50
		});
		$('.bubble').hide();
	}
);
/*登录检测*/
{
	let $username = $('#username'),
		$password = $('#password');
	/*登录按钮*/
	$signIn.click(
		function() {
			$mask.addClass('sign_mask');
			$signBox.slideDown();
			$username[0].focus();
		}
	);
	$signUp.click(
		function(){
			window.location.href = 'http://localhost:9999/sign';
		}
	);
	$yesBtn.click(
		function(){
			let name = $username.val(),
				pw = $password.val();
			$.ajax({
				type: 'post',
				url: '/logoin',
				data: {
					name : name.toLocaleLowerCase(),
					pw : pw
				},
				dataType: 'json',
				success: function(result){
					if(result == 0){
						setMsg($password,'用户名或密码错误');
						$password
						.parent('.item')
						.addClass('error');
						$username
						.parent('.item')
						.addClass('error');
					}else{
						logoin(name);
					}
				}
			});
		}
	);
	$noBtn.click(
		function() {
			$signBox.slideUp(function(){
				$mask.removeClass('sign_mask');	
			});		
		}
	);
	$username.focus(
		function() {
			$(this).addClass('active');
		}
	);
	$username.blur(
		function(){
			$(this).removeClass('active');
			let val = $(this).val();
			if(!val){
				setMsg($(this),'*用户名不可以为空哦','addClass')
			}else{
				setMsg($(this),'','removeClass');
			};
		}
	);
	$username.change(
		function(){
			let val = $(this).val().toLocaleLowerCase();
			if(!val) return;
			$.ajax({
				type: 'get',
				url: '/check',
				data: {
					name : val.toLocaleLowerCase()
				},
				dataType: 'json',
				success: function(result){
					if(result == '0'){
						setMsg($username,'*该用户不存在','addClass');	
					}else{
						setMsg($username,'','removeClass');	
					}
				}
			});
		}
	);
	$password.focus(
		function() {
			$(this).addClass('active');
		}
	);
	$password.blur(
		function(){
			$(this).removeClass('active');
			let val = $(this).val();
			if(!val){
				setMsg($(this),'*密码不可以为空哦','addClass');
				return;
			}else{
				setMsg($(this),'','removeClass');
			}
		}
	);
	function setMsg(obj,str,fn){
		obj
		.next('.msg')
		.html(str);
		if(!fn) return;
		obj
		.parent('.item')
		[fn]('error');
	}
}
/*视频控件*/
{
	class MediaControl{
		constructor(obj,mediaObj) {
			//此处都为jq对象
			this.playBtn = obj.find('.con_play');
			this.pauseBtn = obj.find('.con_pause');
			this.progress = obj.find('.progress');
			this.progressBar = obj.find('.progress .bar');
			this.volume = obj.find('.volume');
			this.t = obj.find('.t');
			this.back = obj.find('.back');
			this.timer = null;
			this.obj = obj;
			//此处为js原生对象
			this.video = mediaObj;
			this.init();
			this.play();
			this.pause();
			this.running();
			this.clickProgressBar();
			this.hoverProgressBar();
			this.setVolume();
			this.clickBackBtn();
		}
		init(){
			this.video.currentTime = 0;
			this.progressBar.css('width',0);
			setTimeout(() => {
				let totalTime = this.video.duration;
				this.t.html('00:00/' + parseInt(totalTime / 60) + ':' + Math.round(totalTime % 60));
			},30);
		}
		play(){
			this.pauseBtn.on(
				'click',
				() => {
					this.pauseBtn.hide();
					this.playBtn.show();
					this.video.play();
				}
			);
		}
		pause(){
			this.playBtn.on(
				'click',
				() => {
					clearInterval(this.timer);
					this.playBtn.hide();
					this.pauseBtn.show();
					this.video.pause();
				}
			);
		}
		running(){
			let len = parseInt(this.progress.width()),
				total,
				totalTime,
				current,
				currentTime,
				w;
			this.timer = setInterval(() => {
				total = this.video.duration;
				totalTime = this.getTime(total);
				current = this.video.currentTime,
				currentTime = this.getTime(current),
				w = parseInt(current / total * len);
				this.progressBar.css(
					{
						width: w
					}
				);
				this.t.html(currentTime.min + ':' + currentTime.sec +'/' + totalTime.min + ':' + totalTime.sec);
				if(len === w){
					this.playBtn.hide();
					this.pauseBtn.show();
				}
			},1000);	
		}
		clickProgressBar(){
			this.progress.on(
				'click',
				e => {
					let point = e.pageX - this.progress.position().left,
						total = this.video.duration,
						len = this.progress.width();
					this.video.currentTime = point / len * total;
					this.progressBar.css('width',point);
				}
			);
		}
		hoverProgressBar(){
			let $barTime = $('.bar_time');
			let setBarTime = (e) => {
				let point = e.pageX - this.progress.position().left,
					total = this.video.duration,
					len = this.progress.width(),
					t = this.getTime(point/len * total);
				$barTime.html(t.min + ':' + t.sec)
				.css({
					left: e.pageX - $barTime.width()/2,
					top: 3, 
				});
			}
			this.progress.on(
				'mouseover',
				e => {
					$barTime.animate({
						opacity: 1
					},300);
					setBarTime(e);
				}
			);
			this.progress.on(
				'mousemove',
				e => {
					setBarTime(e);
				}
			);
			this.progress.on(
				'mouseout',
				() => {
					console.log(1);
					$barTime.animate({
						opacity: 0
					});
				}
			);
		}
		setVolume(){
			this.volume.click(() => {
				let p;
				if(this.video.volume){
					this.video.volume = 0;
					p = '-28px';
				}else{
					this.video.volume = 1;
					p = 0;
				}	
				this.volume.css('background-position-y',p);
			});
		}
		clickBackBtn(){
			this.back.click(() => {
				$play.fadeIn();
				$mask.fadeIn();
				$sign.fadeIn();
				$(this).fadeIn();
				$mediaBg[0].volume = 0;
				this.obj.animate({
					height: 0
				});
				new  Bubble('影视信息','/infos');
				new Bubble('评论区','/comments');   
	  			moving();
			});
		}
		getTime(time){
			let min = toTwo(parseInt(time / 60)),
				sec = toTwo(Math.round(time % 60));
			return {
				min : min,
				sec : sec
			}
		}
	}
	new MediaControl($controls,$mediaBg[0]);
}

/*泡泡*/
class Bubble {
	constructor(name,url) {
		this.create(name,url);
	}
	create(name,url){
		let l = Math.ceil(Math.random() * (clientW - 200)),
			t = Math.ceil(Math.random() * (clientH - 200));
		let str = `<div class="bubble" style="left: ${l}px;top: ${t} px">
						<div class="high_light"></div>
						<a class="txt" href="${url}">${name}</a>
					</div>`;
		$(str)
		.appendTo($('.parts'));
	}
}
function moving(){
	let $bubbles = $('.bubble'),
		w = $bubbles.width(),
		h = $bubbles.height(),
		len = $bubbles.length,
		maxL = clientW - w,
		maxT = clientH - h;
		
	moveOne();
	function moveOne(){
		for(let i = 0; i < len;i ++){
			let ele = $bubbles.eq(i),
				pos = ele.position(),
				l = Math.ceil(Math.random() * maxL),
				t = Math.ceil(Math.random() * maxT);
			ele.animate(
				{
					left: l,
					top: t
				},
				{
					duration : 5000,
					complete : function(){
						moveOne();
					}
				}
			);
		}
	}
}

function init(){
	let val = localStorage.getItem('username');
	if(!val) return;
	$.ajax({
		type: 'get',
		url: '/check',
		data: {
			name : val.toLocaleLowerCase()
		},
		dataType: 'json',
		success: function(result){
			if(result !== '0'){
				logoin(val);
			}
		}
	});
}
function logoin(name){
	$('.not_login').hide();
	$('.login').show();
	$('.user').html('欢迎回来' + name);
	$mask.removeClass('sign_mask');
	$signBox.slideUp();
	new  Bubble('影视信息','/infos');
	new Bubble('评论区','/comments');   
  	moving();
  	localStorage.setItem('username',name);
}
