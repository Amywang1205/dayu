/*获取元素*/
var $username = $('#username'),
	$password = $('#password'),
	$rePassword = $('#re_password'),
	$btn = $('#btn');
	

//初始化
$username[0].focus();

//光标的获取和设置
$username.focus(function() {
	$username.addClass('active');
});
$username.blur(function() {
	blurFn($username,'*用户名不能为空');
});
$password.focus(function() {
	$password.addClass('active');
});
$password.blur(function() {
	blurFn($password,'*密码不能为空');
	checkPw($password,$password.val());
});
$rePassword.focus(function() {
	$rePassword.addClass('active');
});
$rePassword.blur(function() {
	let prevVal = $password.val(),
		val = $rePassword.val();
	if(!val){
		setMsg($rePassword,'*密码不能为空','addClass');
	}else if(prevVal != val){
		setMsg($rePassword,'*与刚输入的密码不一致','addClass');
	}
	$rePassword.removeClass('active');
});

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
				if(result != '0'){
					setMsg($username,'*用户名已被占用','addClass');	
				}else{
					setMsg($username,'','removeClass');	
				}
			}
		});
	}
);
$btn.click(
	function() {
		let name = $username.val(),
			pw = $password.val();
			if($('.error').length){
				return;
			}
			$.ajax({
				type: 'post',
				url: '/signup',
				data: {
					name : name.toLocaleLowerCase(),
					pw : pw
				},
				dataType: 'json',
				success: function(result){
					if(result == '0'){
						$('.content').html('恭喜亲，注册成功！！！马上为您跳转至首页……');
						localStorage.setItem('username',name);
						setTimeout(function(){
							window.location.href = 'http://localhost:9999';
						},1000);
					}
				}
			});
	}
);
function blurFn(obj,str){
	obj.removeClass('active');
	let val = obj.val();
	val ? setMsg(obj,'','removeClass') : setMsg(obj,str,'addClass');
}
function setMsg(obj,str,fn){
	obj
	.next('.msg')
	.html(str);
	if(!fn) return;
	obj
	.parent('.item')
	[fn]('error');
}
function checkPw(obj,str){
	if(str.length < 6){
		setMsg(obj,'*多于6位数，这样更安全','addClass');
		return false;
	}else if(isNaN(str)){
		setMsg(obj,'*请输入数字哦','addClass');
		return false;
	}
	return true;
}
