/*获取元素*/
var $bg = $('.bg'),
	$display = $('.display'),
	$txtarea = $('.txtarea'),
	$btn = $('.btn');

//获取可视区域的宽高
var clientW = window.innerWidth,
	clientH = window.innerHeight;

init();
render();
/*获取数据*/
$btn.click(
	function(){
		let name = localStorage.getItem('username'),
			con = $txtarea.val();
			
		if(!con) return;
		$.ajax({
			type: 'post',
			url: '/addComment',
			data: {
				name : name,
				comment : con
			},
			dataType: 'json',
			success: function(result){
				if(result == '1'){
					$display.html('');
					render();
					$txtarea.val('');
				}
			}
		});
	}
);

/*背景*/
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
	timer = setInterval(more,2000);
	function more(){
		num ++;
		if(num > 10) clearInterval(timer);
		new Bubble;
	}
}
console.dir(window);
function renderItem(data){
	let str = `<dl class="item">
					<dt>
						<span class="name">${data.username}</span>
						<span class="time">${setTime(data.time)}</span>
					</dt>
					<dd class="txt">
						${data.comment}
					</dd>
				</dl>`;
	$(str).appendTo($display);
}
function render(){
	$.ajax({
		type: 'post',
		url: '/data',
		dataType: 'json',
		success: function(result){
			//根据ajax得到的数据渲染页面
			if(result){
				for(let i = 0,len = result.length;i < len;i++){
					renderItem(result[i]);
				}	
			}
		}
	});
}

function init(){
	if(!localStorage.length){
		window.location.href = '/';
	}else{
		let val = localStorage.getItem('username');
		if(!val) window.location.href = '/';
		$.ajax({
			type: 'get',
			url: '/check',
			data: {
				name : val
			},
			dataType: 'json',
			success: function(result){
				if(result === '0'){
					window.location.href = '/';
				}
			}
		});
	}
}
