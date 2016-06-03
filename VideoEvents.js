/* jshint strict: true, browser: true, nonbsp: true, bitwise: true, immed: true, latedef: true, eqeqeq: true, undef: true, curly: true, unused: false */
/* global console */

/**
 * @author Aaron Clinger - https://github.com/aaronclinger/videoevents.js
 */
(function(window) {
	'use strict';
	
	function VideoListener(e, fn, one) {
		var pub = {};
		var callback;
		var event;
		var type;
		var once;
		
		
		pub.getEvent = function() {
			return event;
		};
		
		pub.getType = function() {
			return type;
		};
		
		pub.getCallback = function() {
			return callback;
		};
		
		pub.isOnce = function() {
			return once;
		};
		
		var init = function(e, fn, one) {
			if ( ! parseEventType(e)) {
				return false;
			}
			
			callback = fn;
			once     = !! one;
			
			return pub;
		};
		
		var parseEventType = function(e) {
			if (e === '' + e) {
				e = e.toLowerCase();
				
				switch (e) {
					case 'play' :
					case 'ready' :
					case 'pause' :
					case 'finish' :
					case 'progress' :
						type  = 'status';
						event = e;
						return true;
					default :
						if (e.slice(-1) === '%') {
							e = convertToNumber(e.slice(0, -1));
							
							if (e !== false && e > 0 && e < 100) {
								type  = 'percent';
								event = e;
								return true;
							}
						}
				}
			}
			
			e = convertToNumber(e);
			
			if (e === false) {
				return false;
			}
			
			type  = 'time';
			event = e;
			
			return true;
		};
		
		var convertToNumber = function(val) {
			val = +val;
			
			if (val + 0 === val) {
				return val;
			}
			
			return false;
		};
		
		return init(e, fn, one);
	}
	
	function VideoEvents(videoPlayer) {
		var pub       = {};
		var listeners = [];
		var isReady   = false;
		var isYouTube;
		var player;
		
		
		pub.on = function(eventValue, callback) {
			
		};
		
		pub.once = function(eventValue, callback) {
			
		};
		
		pub.off = function(eventValue, callback) {
			
		};
		
		pub.destroy = function() {
			if ( ! player) {
				return;
			}
			
			if (isYouTube) {
				player.removeEventListener('onReady', onReady);
				player.removeEventListener('onStateChange', onStateChange);
			} else {
				player.removeEvent('ready');
				player.removeEvent('play');
				player.removeEvent('pause');
				player.removeEvent('finish');
				player.removeEvent('playProgress');
			}
			
			listeners = [];
			player    = null;
		};
		
		var init = function(videoPlayer) {
			player    = videoPlayer;
			isYouTube = !! player.addEventListener;
			
			if (isYouTube) {
				player.addEventListener('onReady', onReady);
			} else {
				player.addEvent('ready', onReady);
			}
		};
		
		var onReady = function() {
			isReady = true;
			
			if (isYouTube) {
				player.addEventListener('onStateChange', onStateChange);
			} else {
				player.addEvent('play', function(data) {
					//console.log('play', data);
				});
				player.addEvent('pause', function(data) {
					//console.log('pause', data);
				});
				player.addEvent('finish', function(data) {
					//console.log('finish', data);
				});
				player.addEvent('playProgress', function(data) {
					//console.log(data);
				});
			}
		};
		
		var onStateChange = function(event) {
			switch (event.data) {
				case 0 :
					//console.log('finish');
					break;
				case 1 :
					//console.log('play');
					break;
				case 2 :
					//console.log('pause');
					break;
			}
		};
		
		var getEventData = function() {
			return {
				time: 0,
				percent: 0,
				duration: 0
			};
		};
		
		init(videoPlayer);
		
		return pub;
	}
	
	window.VideoEvents = VideoEvents;
}(window));