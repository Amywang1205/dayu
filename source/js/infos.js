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
	var $bg = $('.bg');

	//轮播图
	{
		(function () {
			var create3d = function create3d(obj, url) {
				var $leftEle = '<div class="left">' + setHtml('left', url) + '</div>',
				    $rightEle = '<div class="right">' + setHtml('right', url) + '</div>';
				obj.html($leftEle + $rightEle);
			};

			var open3d = function open3d() {
				var $leftItem = $front.find('.left div'),
				    $rightItem = $front.find('.right div'),
				    len = $leftItem.length;

				for (var i = 0; i < len; i++) {
					$leftItem.eq(i).css({
						transform: 'rotate(' + (-i - 1) * 9 + 'deg)'
					});
					$rightItem.eq(i).css({
						transform: 'rotate(' + (len - i) * 9 + 'deg)'
					});
				}
			};

			var setBehind = function setBehind() {
				create3d($front, pics[n]);
				$behind.css({
					backgroundImage: 'url(source/img/pics/' + pics[n] + ')',
					opacity: 0
				});
			};

			var play = function play() {
				open3d();
				n++;
				n %= maxL;
				$behind.animate({
					backgroundImage: 'url(source/img/pics/' + pics[n] + ')',
					opacity: 1
				}, 1000, function () {
					setBehind();
				});
			};

			var setHtml = function setHtml(type, url) {
				var str = '',
				    i = 0,
				    start = 0;
				switch (type) {
					case 'left':
						start = 0;
						break;
					case 'right':
						start = 150;
						break;
				}
				for (i; i < 10; i++) {
					str += '<div style="background-image:url(source/img/pics/' + url + ');background-position-x: -' + (start + i * 15) + 'px;"></div>';
				}
				return str;
			};

			var $picsList = $('.pics .pics_list'),
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
				success: function success(result) {
					pics = result;
					maxL = pics.length;
				}
			});
			$picsList.click(function () {
				play();
			});
			setBehind();
			timer = setInterval(play, 2000);
		})();
	}

	//获取可视区域的宽高
	var clientW = window.innerWidth,
	    clientH = window.innerHeight;
	{
		(function () {
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
			timer = setInterval(function () {
				num++;
				if (num > 10) clearInterval(timer);
				new Bubble();
			}, 1000);
		})();
	}

/***/ }
/******/ ]);