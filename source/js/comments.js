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
	$btn.click(function () {
		var name = localStorage.getItem('username'),
		    con = $txtarea.val();

		if (!con) return;
		$.ajax({
			type: 'post',
			url: '/addComment',
			data: {
				name: name,
				comment: con
			},
			dataType: 'json',
			success: function success(result) {
				if (result == '1') {
					$display.html('');
					render();
					$txtarea.val('');
				}
			}
		});
	});

	/*背景*/
	{
		(function () {
			var more = function more() {
				num++;
				if (num > 10) clearInterval(timer);
				new Bubble();
			};

			var num = 0,
			    timer = null;

			var Bubble = function () {
				function Bubble() {
					_classCallCheck(this, Bubble);

					this.ele = document.createElement('div');
					this.w = Math.ceil(Math.random() * 80) + 20;
					this.l = Math.ceil(Math.random() * (clientW - this.w));
					this.ui();
					this.create();
				}

				_createClass(Bubble, [{
					key: 'ui',
					value: function ui() {
						this.ele.className = "bubble";
						this.ele.style.cssText = "width: " + this.w + "px;height: " + this.w + "px;left: " + this.l + "px;top:" + (clientH + this.w) + "px";
						this.ele.innerHTML = '<div class="high_light"></div>';
					}
				}, {
					key: 'create',
					value: function create() {
						$bg[0].appendChild(this.ele);
						this.moving();
					}
				}, {
					key: 'moving',
					value: function moving() {
						var _this = this;

						var randomTime = Math.ceil(Math.random() * 2) + 3;
						$(this.ele).animate({
							top: -this.w
						}, randomTime * 1000, function () {
							var random = Math.ceil(Math.random() * 100);
							$(_this.ele).css({
								width: random,
								height: random,
								top: clientH + _this.w,
								left: Math.ceil(Math.random() * (clientW - _this.w))
							});
							_this.moving();
						});
					}
				}]);

				return Bubble;
			}();

			new Bubble();
			timer = setInterval(more, 2000);
		})();
	}
	console.dir(window);
	function renderItem(data) {
		var str = '<dl class="item">\n\t\t\t\t\t<dt>\n\t\t\t\t\t\t<span class="name">' + data.username + '</span>\n\t\t\t\t\t\t<span class="time">' + setTime(data.time) + '</span>\n\t\t\t\t\t</dt>\n\t\t\t\t\t<dd class="txt">\n\t\t\t\t\t\t' + data.comment + '\n\t\t\t\t\t</dd>\n\t\t\t\t</dl>';
		$(str).appendTo($display);
	}
	function render() {
		$.ajax({
			type: 'post',
			url: '/data',
			dataType: 'json',
			success: function success(result) {
				//根据ajax得到的数据渲染页面
				if (result) {
					for (var i = 0, len = result.length; i < len; i++) {
						renderItem(result[i]);
					}
				}
			}
		});
	}

	function init() {
		if (!localStorage.length) {
			window.location.href = '/';
		} else {
			var val = localStorage.getItem('username');
			if (!val) window.location.href = '/';
			$.ajax({
				type: 'get',
				url: '/check',
				data: {
					name: val
				},
				dataType: 'json',
				success: function success(result) {
					if (result === '0') {
						window.location.href = '/';
					}
				}
			});
		}
	}

/***/ }
/******/ ]);