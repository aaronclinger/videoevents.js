/* jshint strict: true, browser: true, nonbsp: true, bitwise: true, immed: true, latedef: true, eqeqeq: true, undef: true, curly: true, unused: false */
/* global console */

/**
 * @author Aaron Clinger - https://github.com/aaronclinger/videoevents.js
 */
(function(window) {
	'use strict';
	
	function videoListener(e, fn, one) {
		var pub = {};
		var callback;
		var value;
		var type;
		var once;
		
		
		pub.getValue = function() {
			return value;
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
		
		pub.trigger = function(time, percent, duration) {
			callback({
				type: type,
				time: time,
				percent: percent,
				duration: duration
			});
		};
		
		pub.equals = function(vidListener, ignoreCallback) {
			var isEqual = pub.getValue() === vidListener.getValue() && pub.getType() === vidListener.getType();
			
			if (isEqual && ! ignoreCallback) {
				isEqual = pub.getCallback() === vidListener.getCallback();
			}
			
			return isEqual;
		};
		
		var init = function(e, fn, one) {
			e = parseEventType(e);
			
			if (e === false) {
				return false;
			}
			
			type     = e.type;
			value    = e.value;
			callback = fn;
			once     = !! one;
			
			return pub;
		};
		
		var parseEventType = function(e) {
			if (e === '' + e) {
				e = e.toLowerCase();
				
				switch (e) {
					case 'play' :
					case 'pause' :
					case 'end' :
					case 'progress' :
						return {type: e, value: null};
					default :
						if (e.slice(-1) === '%') {
							e = convertToNumber(e.slice(0, -1));
							
							if (e !== false && e >= 0 && e <= 100) {
								return {type: 'percent', value: e};
							}
						}
				}
			}
			
			e = convertToNumber(e);
			
			if (e === false) {
				return false;
			}
			
			return {type: 'time', value: e};
		};
		
		var convertToNumber = function(val) {
			val = Number(val);
			
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
		var isYouTube;
		var player;
		
		
		pub.on = function(eventValue, callback) {
			addEvent(eventValue, callback, false);
			
			return pub;
		};
		
		pub.once = function(eventValue, callback) {
			addEvent(eventValue, callback, true);
			
			return pub;
		};
		
		pub.off = function(eventValue, callback) {
			var l = listeners.length;
			var listen;
			
			if (eventValue) {
				listen = videoListener(eventValue, callback);
				
				if (listen !== false) {
					if (callback) {
						while (l--) {
							if (listeners[l].equals(listen)) {
								listeners.splice(l, 1);
								break;
							}
						}
					} else {
						while (l--) {
							if (listeners[l].equals(listen, true)) {
								listeners.splice(l, 1);
							}
						}
					}
				}
			} else {
				listeners = [];
			}
			
			return pub;
		};
		
		pub.destroy = function() {
			if ( ! player) {
				return;
			}
			
			if (isYouTube) {
				player.removeEventListener('onReady', ytOnReady);
				player.removeEventListener('onStateChange', ytOnStateChange);
			} else {
				player.off('play', vimeoOnPlay);
				player.off('pause', vimeoOnPause);
				player.off('ended', vimeoOnEnd);
				player.off('timeupdate', vimeoOnProgress);
			}
			
			listeners = [];
			player    = null;
		};
		
		var init = function(videoPlayer) {
			player    = videoPlayer;
			isYouTube = !! player.addEventListener;
			
			if (isYouTube) {
				player.addEventListener('onReady', ytOnReady);
			} else {
				player.on('play', vimeoOnPlay);
				player.on('pause', vimeoOnPause);
				player.on('ended', vimeoOnEnd);
				player.on('timeupdate', vimeoOnProgress);
			}
		};
		
		var addEvent = function(eventValue, callback, once) {
			var listen = videoListener(eventValue, callback, once);
			var l;
			
			if (listen !== false) {
				l = listeners.length;
				
				while (l--) {
					if (listeners[l].equals(listen)) {
						return;
					}
				}
				
				listeners.push(listen);
			}
		};
		
		var checkEvents = function(type, time, percent, duration) {
			var l = listeners.length;
			var listen;
			
			while (l--) {
				listen = listeners[l];
				
				if (listen.getType() === type) {
					switch (type) {
						case 'play' :
						case 'pause' :
						case 'end' :
						case 'progress' :
							listen.trigger(time, percent, duration);
							
							if (listen.isOnce()) {
								listeners.splice(l, 1);
							}
							
							break;
					}
				}
			}
		};
		
		var ytOnReady = function() {
			player.addEventListener('onStateChange', ytOnStateChange);
		};
		
		var ytOnStateChange = function(event) {
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
		
		var vimeoOnPlay = function(data) {
			vimeoCheckEvents('play', data);
		};
		
		var vimeoOnPause = function(data) {
			vimeoCheckEvents('pause', data);
		};
		
		var vimeoOnEnd = function(data) {
			vimeoCheckEvents('end', data);
		};
		
		var vimeoOnProgress = function(data) {
			vimeoCheckEvents('progress', data);
		};
		
		var vimeoCheckEvents = function(type, data) {
			checkEvents(type, data.seconds, data.percent, data.duration);
		};
		
		init(videoPlayer);
		
		return pub;
	}
	
	window.VideoEvents = VideoEvents;
}(window));