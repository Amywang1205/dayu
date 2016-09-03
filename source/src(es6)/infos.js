/*获取元素*/
var $bg = $('.bg');

//轮播图
{
	let $picsList = $('.pics .pics_list'),
		$front = $picsList.find('.front'),
		$behind = $picsList.find('.behind'),
		pics = [],
		maxL = 0,
		n = 0,
		timer = null;
		
	$.ajax({
		type: 'get',
		url: '/getPics',
		async: false,
		success: function(result){
			pics = result;
			maxL = pics.length;
		}
	});
	$picsList.click(
		function() {
			play();
		}
	);
	setBehind();
	timer = setInterval(play,2000);
	function create3d(obj,url){
		let $leftEle = '<div class="left">'+ setHtml('left',url) +'</div>',
			$rightEle = '<div class="right">'+ setHtml('right',url) +'</div>';
		obj.html($leftEle + $rightEle);
	}
	function open3d(){
		let $leftItem = $front.find('.left div'),
			$rightItem = $front.find('.right div'),
			len = $leftItem.length;
		
		for(let i = 0; i < len;i++){
			$leftItem.eq(i).css({
				transform : 'rotate('+ (-i - 1)*9 +'deg)'
			});
			$rightItem.eq(i).css({
				transform : 'rotate('+ (len - i)*9 +'deg)'
			});
		}		
	}
	function setBehind(){	
		create3d($front,pics[n]);
		$behind.css({
			backgroundImage : 'url(source/img/pics/'+ pics[n] +')',
			opacity : 0
		})
	}
	function play(){
		open3d();
		n ++;
		n %= maxL;
		$behind.animate(
			{
				backgroundImage : 'url(source/img/pics/'+ pics[n] +')',
				opacity: 1
			},
			1000,
			function(){	
				setBehind();
			}
		)
	}
	function setHtml(type,url){
		let str = '',
			i = 0,
			start = 0;
		switch(type){
			case 'left':
				start = 0;
				break;
			case 'right':
				start = 150;
				break;
		}
		for(i;i < 10;i ++){
			str += '<div style="background-image:url(source/img/pics/'+ url +');background-position-x: -'+ (start + i * 15) +'px;"></div>';
		}
		return str;
	}
}

//获取可视区域的宽高
var clientW = window.innerWidth,
	clientH = window.innerHeight;
{
	let num = 0,
		timer = null;
	class Bubble{
		constructor(){
			this.ele = document.createElement('div');
			this.w = Math.ceil(Math.random() * 80) + 20;
			this.l = Math.ceil(Math.random() * (clientW - this.w));
			this.ui();
			this.create();
		}
		ui(){
			this.ele.className = "bubble";
			this.ele.style.cssText = "width: "+ this.w +"px;height: "+ this.w +"px;left: "+ this.l +"px;top:"+ (clientH + this.w) +"px";
			this.ele.innerHTML = '<div class="high_light"></div>';
		}
		create(){
			$bg[0].appendChild(this.ele);
			this.moving();
		}
		moving(){
			let randomTime = Math.ceil(Math.random() * 2) + 3;
			$(this.ele).animate(
				{
					top: -this.w
				},
				randomTime * 1000,
				() => {
					let random = Math.ceil(Math.random() * 100);
					$(this.ele).css({
						width: random,
						height: random,
						top: clientH + this.w,
						left: Math.ceil(Math.random() * (clientW - this.w))
					});
					this.moving();
				}
			);
		}
	}
	new Bubble;
	timer = setInterval(function(){
		num ++;
		if(num > 10) clearInterval(timer);
		new Bubble;
	},1000);
}