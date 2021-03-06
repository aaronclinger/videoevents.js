/* jshint strict: true, browser: true, nonbsp: true, bitwise: true, immed: true, latedef: true, eqeqeq: true, undef: true, curly: true, unused: true */

/**
 * @author Aaron Clinger - https://github.com/aaronclinger/videoevents.js
 */
(function(window) {
	'use strict';
	
	var parseEventData = function(e) {
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
							return {type: 'percent', value: e / 100};
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
	
	function VideoListener(eventData, fn, one) {
		var pub = {before: true};
		var callback;
		var value;
		var type;
		var once;
		
		
		pub.getType = function() {
			return type;
		};
		
		pub.getValue = function() {
			return value;
		};
		
		pub.getCallback = function() {
			return callback;
		};
		
		pub.isOnce = function() {
			return once;
		};
		
		pub.trigger = function(player, time, percent, duration) {
			var data = {
				sender: player,
				type: type,
				time: time,
				percent: percent,
				duration: duration
			};
			
			switch (type) {
				case 'percent' :
					data.value = value * 100 + '%';
					break;
				case 'time' :
					data.value = value;
					break;
			}
			
			callback(data);
		};
		
		pub.equals = function(vidListener, compareCallback) {
			var isEqual = value === vidListener.getValue() && type === vidListener.getType();
			
			if (isEqual && compareCallback) {
				isEqual = callback === vidListener.getCallback();
			}
			
			return isEqual;
		};
		
		var init = function(eventData, fn, one) {
			type     = eventData.type;
			value    = eventData.value;
			callback = fn;
			once     = !! one;
			
			return pub;
		};
		
		return init(eventData, fn, one);
	}
	
	function VideoEvents(videoPlayer) {
		var pub       = {};
		var listeners = [];
		var interval  = null;
		var isYouTube = false;
		var isElement = false;
		var isVimeo   = false;
		var player;
		
		
		pub.on = function(event, callback) {
			addEvent(event, callback, false);
			
			return pub;
		};
		
		pub.once = function(event, callback) {
			addEvent(event, callback, true);
			
			return pub;
		};
		
		pub.off = function(event, callback) {
			var l = listeners.length;
			var hasCallback;
			var eventData;
			var listen;
			
			if (event) {
				eventData = parseEventData(event);
				
				if (eventData !== false) {
					listen      = new VideoListener(eventData, callback);
					hasCallback = !! callback;
					
					while (l--) {
						if (listeners[l].equals(listen, hasCallback)) {
							listeners.splice(l, 1);
							
							if (hasCallback) {
								break;
							}
						}
					}
				}
			} else {
				listeners = [];
			}
			
			return pub;
		};
		
		pub.getPlayer = function() {
			return player;
		};
		
		pub.destroy = function() {
			if ( ! player) {
				return;
			}
			
			if (isYouTube) {
				player.removeEventListener('onReady', youtubeOnReady);
				player.removeEventListener('onStateChange', youtubeOnStateChange);
				
				if (interval !== null) {
					clearInterval(interval);
					interval = null;
				}
			} else if (isVimeo) {
				player.off('play', vimeoOnPlay);
				player.off('pause', vimeoOnPause);
				player.off('ended', vimeoOnEnd);
				player.off('timeupdate', vimeoOnProgress);
			} else if (isElement) {
				player.removeEventListener('play', elementEvent);
				player.removeEventListener('pause', elementEvent);
				player.removeEventListener('ended', elementEvent);
				player.removeEventListener('timeupdate', elementEvent);
			}
			
			listeners = [];
			player    = null;
		};
		
		var init = function(videoPlayer) {
			player    = videoPlayer;
			isVimeo   = !! player.on;
			isElement = videoPlayer instanceof Element;
			isYouTube = ! isElement && !! player.addEventListener;
			
			if (isYouTube) {
				player.addEventListener('onReady', youtubeOnReady);
			} else if (isVimeo) {
				player.on('play', vimeoOnPlay);
				player.on('pause', vimeoOnPause);
				player.on('ended', vimeoOnEnd);
				player.on('timeupdate', vimeoOnProgress);
			} else if (isElement) {
				player.addEventListener('play', elementEvent);
				player.addEventListener('pause', elementEvent);
				player.addEventListener('ended', elementEvent);
				player.addEventListener('timeupdate', elementEvent);
			}
		};
		
		var addEvent = function(event, callback, once) {
			var eventData = parseEventData(event);
			var listen;
			var l;
			
			if (eventData !== false) {
				listen = new VideoListener(eventData, callback, once);
				l      = listeners.length;
				
				while (l--) {
					if (listeners[l].equals(listen, true)) {
						return;
					}
				}
				
				listeners.push(listen);
			}
		};
		
		var checkEvents = function(type, time, percent, duration) {
			var i = -1;
			var shouldTrigger;
			var compare;
			var listen;
			var value;
			
			while (++i < listeners.length) {
				listen        = listeners[i];
				shouldTrigger = false;
				
				if (type === listen.getType()) {
					switch (type) {
						case 'play' :
						case 'pause' :
						case 'end' :
						case 'progress' :
							shouldTrigger = true;
							break;
					}
				} else if (type === 'progress') {
					switch (listen.getType()) {
						case 'time' :
						case 'percent' :
							value = listen.getValue();
							
							if (listen.getType() === 'time') {
								compare = time;
								
								if (value < 0) {
									value = Math.max(0, duration + value);
								}
							} else {
								compare = percent;
							}
							
							if (value > compare) {
								listen.before = true;
							} else if (listen.before && value <= compare) {
								listen.before = false;
								shouldTrigger = true;
							}
							break;
					}
				}
				
				if (shouldTrigger) {
					listen.trigger(pub, time, percent, duration);
					
					if (listen.isOnce()) {
						listeners.splice(i--, 1);
					}
				}
			}
		};
		
		var constrainPercent = function(val) {
			val = isNaN(val) ? 0 : val;
			val = Math.min(1, Math.max(0, val));
			
			return Math.round(val * 1000) / 1000;
		};
		
		var youtubeOnReady = function() {
			player.addEventListener('onStateChange', youtubeOnStateChange);
		};
		
		var youtubeOnStateChange = function(event) {
			switch (event.data) {
				case 0 : // end
					youtubeEvent('end');
					break;
				case 1 : // play
					youtubeEvent('play');
					break;
				case 2 : // pause
					youtubeEvent('pause');
					break;
			}
		};
		
		var youtubeEvent = function(type) {
			var time     = player.getCurrentTime();
			var duration = player.getDuration();
			var percent  = constrainPercent(time / duration);
			
			switch (type) {
				case 'play' :
					if (interval === null) {
						interval = setInterval(function() {
							youtubeEvent('progress');
						}, 250);
					}
					break;
				case 'pause' :
				case 'end' :
					clearInterval(interval);
					interval = null;
					break;
			}
			
			checkEvents(type, time, percent, duration);
		};
		
		var vimeoOnPlay = function(data) {
			vimeoEvent('play', data);
		};
		
		var vimeoOnPause = function(data) {
			vimeoEvent('pause', data);
		};
		
		var vimeoOnEnd = function(data) {
			vimeoEvent('end', data);
		};
		
		var vimeoOnProgress = function(data) {
			vimeoEvent('progress', data);
		};
		
		var vimeoEvent = function(type, data) {
			checkEvents(type, data.seconds, constrainPercent(data.percent), data.duration);
		};
		
		var elementEvent = function(e) {
			var type     = e.type;
			var element  = e.target;
			var time     = element.currentTime;
			var duration = element.duration;
			
			if (type === 'timeupdate') {
				type = 'progress';
			}
			
			checkEvents(type, time, constrainPercent(time / duration), duration);
		};
		
		init(videoPlayer);
		
		return pub;
	}
	
	window.VideoEvents = VideoEvents;
}(window));
