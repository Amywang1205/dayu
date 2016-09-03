/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
	$mediaBg.on('loadeddata', function () {
		var h = $mediaBg.height(),
		    l = (h / clientH * clientW - clientW) / 2;
		$mediaBg.css({
			height: clientH,
			left: l
		});
		$mediaBg[0].volume = 0;
	});
	/*登录退出按钮*/
	$logout.click(function () {
		localStorage.removeItem('username');
		$('.not_login').show();
		$('.login').hide();
		$('.parts').html('');
	});
	console.dir(localStorage);
	/*点击屏幕播放按钮*/
	$play.click(function () {
		$mask.fadeOut();
		$sign.fadeOut();
		$(this).fadeOut();
		$mediaBg[0].volume = 1;
		$mediaBg[0].currentTime = 0;
		$controls.animate({
			height: 50
		});
		$('.bubble').hide();
	});
	/*登录检测*/
	{
		(function () {
			var setMsg = function setMsg(obj, str, fn) {
				obj.next('.msg').html(str);
				if (!fn) return;
				obj.parent('.item')[fn]('error');
			};

			var $username = $('#username'),
			    $password = $('#password');
			/*登录按钮*/
			$signIn.click(function () {
				$mask.addClass('sign_mask');
				$signBox.slideDown();
				$username[0].focus();
			});
			$signUp.click(function () {
				window.location.href = 'http://localhost:9999/sign';
			});
			$yesBtn.click(function () {
				var name = $username.val(),
				    pw = $password.val();
				$.ajax({
					type: 'post',
					url: '/logoin',
					data: {
						name: name.toLocaleLowerCase(),
						pw: pw
					},
					dataType: 'json',
					success: function success(result) {
						if (result == 0) {
							setMsg($password, '用户名或密码错误');
							$password.parent('.item').addClass('error');
							$username.parent('.item').addClass('error');
						} else {
							logoin(name);
						}
					}
				});
			});
			$noBtn.click(function () {
				$signBox.slideUp(function () {
					$mask.removeClass('sign_mask');
				});
			});
			$username.focus(function () {
				$(this).addClass('active');
			});
			$username.blur(function () {
				$(this).removeClass('active');
				var val = $(this).val();
				if (!val) {
					setMsg($(this), '*用户名不可以为空哦', 'addClass');
				} else {
					setMsg($(this), '', 'removeClass');
				};
			});
			$username.change(function () {
				var val = $(this).val().toLocaleLowerCase();
				if (!val) return;
				$.ajax({
					type: 'get',
					url: '/check',
					data: {
						name: val.toLocaleLowerCase()
					},
					dataType: 'json',
					success: function success(result) {
						if (result == '0') {
							setMsg($username, '*该用户不存在', 'addClass');
						} else {
							setMsg($username, '', 'removeClass');
						}
					}
				});
			});
			$password.focus(function () {
				$(this).addClass('active');
			});
			$password.blur(function () {
				$(this).removeClass('active');
				var val = $(this).val();
				if (!val) {
					setMsg($(this), '*密码不可以为空哦', 'addClass');
					return;
				} else {
					setMsg($(this), '', 'removeClass');
				}
			});
		})();
	}
	/*视频控件*/
	{
		var MediaControl = function () {
			function MediaControl(obj, mediaObj) {
				_classCallCheck(this, MediaControl);

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

			_createClass(MediaControl, [{
				key: 'init',
				value: function init() {
					var _this = this;

					this.video.currentTime = 0;
					this.progressBar.css('width', 0);
					setTimeout(function () {
						var totalTime = _this.video.duration;
						_this.t.html('00:00/' + parseInt(totalTime / 60) + ':' + Math.round(totalTime % 60));
					}, 30);
				}
			}, {
				key: 'play',
				value: function play() {
					var _this2 = this;

					this.pauseBtn.on('click', function () {
						_this2.pauseBtn.hide();
						_this2.playBtn.show();
						_this2.video.play();
					});
				}
			}, {
				key: 'pause',
				value: function pause() {
					var _this3 = this;

					this.playBtn.on('click', function () {
						clearInterval(_this3.timer);
						_this3.playBtn.hide();
						_this3.pauseBtn.show();
						_this3.video.pause();
					});
				}
			}, {
				key: 'running',
				value: function running() {
					var _this4 = this;

					var len = parseInt(this.progress.width()),
					    total = void 0,
					    totalTime = void 0,
					    current = void 0,
					    currentTime = void 0,
					    w = void 0;
					this.timer = setInterval(function () {
						total = _this4.video.duration;
						totalTime = _this4.getTime(total);
						current = _this4.video.currentTime, currentTime = _this4.getTime(current), w = parseInt(current / total * len);
						_this4.progressBar.css({
							width: w
						});
						_this4.t.html(currentTime.min + ':' + currentTime.sec + '/' + totalTime.min + ':' + totalTime.sec);
						if (len === w) {
							_this4.playBtn.hide();
							_this4.pauseBtn.show();
						}
					}, 1000);
				}
			}, {
				key: 'clickProgressBar',
				value: function clickProgressBar() {
					var _this5 = this;

					this.progress.on('click', function (e) {
						var point = e.pageX - _this5.progress.position().left,
						    total = _this5.video.duration,
						    len = _this5.progress.width();
						_this5.video.currentTime = point / len * total;
						_this5.progressBar.css('width', point);
					});
				}
			}, {
				key: 'hoverProgressBar',
				value: function hoverProgressBar() {
					var _this6 = this;

					var $barTime = $('.bar_time');
					var setBarTime = function setBarTime(e) {
						var point = e.pageX - _this6.progress.position().left,
						    total = _this6.video.duration,
						    len = _this6.progress.width(),
						    t = _this6.getTime(point / len * total);
						$barTime.html(t.min + ':' + t.sec).css({
							left: e.pageX - $barTime.width() / 2,
							top: 3
						});
					};
					this.progress.on('mouseover', function (e) {
						$barTime.animate({
							opacity: 1
						}, 300);
						setBarTime(e);
					});
					this.progress.on('mousemove', function (e) {
						setBarTime(e);
					});
					this.progress.on('mouseout', function () {
						console.log(1);
						$barTime.animate({
							opacity: 0
						});
					});
				}
			}, {
				key: 'setVolume',
				value: function setVolume() {
					var _this7 = this;

					this.volume.click(function () {
						var p = void 0;
						if (_this7.video.volume) {
							_this7.video.volume = 0;
							p = '-28px';
						} else {
							_this7.video.volume = 1;
							p = 0;
						}
						_this7.volume.css('background-position-y', p);
					});
				}
			}, {
				key: 'clickBackBtn',
				value: function clickBackBtn() {
					var _this8 = this;

					this.back.click(function () {
						$play.fadeIn();
						$mask.fadeIn();
						$sign.fadeIn();
						$(_this8).fadeIn();
						$mediaBg[0].volume = 0;
						_this8.obj.animate({
							height: 0
						});
						new Bubble('影视信息', '/infos');
						new Bubble('评论区', '/comments');
						moving();
					});
				}
			}, {
				key: 'getTime',
				value: function getTime(time) {
					var min = toTwo(parseInt(time / 60)),
					    sec = toTwo(Math.round(time % 60));
					return {
						min: min,
						sec: sec
					};
				}
			}]);

			return MediaControl;
		}();

		new MediaControl($controls, $mediaBg[0]);
	}

	/*泡泡*/

	var Bubble = function () {
		function Bubble(name, url) {
			_classCallCheck(this, Bubble);

			this.create(name, url);
		}

		_createClass(Bubble, [{
			key: 'create',
			value: function create(name, url) {
				var l = Math.ceil(Math.random() * (clientW - 200)),
				    t = Math.ceil(Math.random() * (clientH - 200));
				var str = '<div class="bubble" style="left: ' + l + 'px;top: ' + t + ' px">\n\t\t\t\t\t\t<div class="high_light"></div>\n\t\t\t\t\t\t<a class="txt" href="' + url + '">' + name + '</a>\n\t\t\t\t\t</div>';
				$(str).appendTo($('.parts'));
			}
		}]);

		return Bubble;
	}();

	function moving() {
		var $bubbles = $('.bubble'),
		    w = $bubbles.width(),
		    h = $bubbles.height(),
		    len = $bubbles.length,
		    maxL = clientW - w,
		    maxT = clientH - h;

		moveOne();
		function moveOne() {
			for (var i = 0; i < len; i++) {
				var ele = $bubbles.eq(i),
				    pos = ele.position(),
				    l = Math.ceil(Math.random() * maxL),
				    t = Math.ceil(Math.random() * maxT);
				ele.animate({
					left: l,
					top: t
				}, {
					duration: 5000,
					complete: function complete() {
						moveOne();
					}
				});
			}
		}
	}

	function init() {
		var val = localStorage.getItem('username');
		if (!val) return;
		$.ajax({
			type: 'get',
			url: '/check',
			data: {
				name: val.toLocaleLowerCase()
			},
			dataType: 'json',
			success: function success(result) {
				if (result !== '0') {
					logoin(val);
				}
			}
		});
	}
	function logoin(name) {
		$('.not_login').hide();
		$('.login').show();
		$('.user').html('欢迎回来' + name);
		$mask.removeClass('sign_mask');
		$signBox.slideUp();
		new Bubble('影视信息', '/infos');
		new Bubble('评论区', '/comments');
		moving();
		localStorage.setItem('username', name);
	}

/***/ }
/******/ ]);