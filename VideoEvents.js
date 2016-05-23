/* jshint strict: true, browser: true, nonbsp: true, bitwise: true, immed: true, latedef: true, eqeqeq: true, undef: true, curly: true, unused: false */
/* global console */

/**
 * @author Aaron Clinger - https://github.com/aaronclinger/videoevents.js
 */
(function(window) {
	'use strict';
	
	function VideoListener() {
		var pub = {};
		
		
		
		return pub;
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
			
			player = null;
		};
		
		var init = function(videoPlayer) {
			if (videoPlayer) {
				player    = videoPlayer;
				isYouTube = !! player.addEventListener;
				
				if (isYouTube) {
					player.addEventListener('onReady', onReady);
				} else {
					player.addEvent('ready', onReady);
				}
			}
			
			console.log(normalizeEventValue('Play'));
			console.log(normalizeEventValue('play'));
			console.log(normalizeEventValue(0.25));
			console.log(normalizeEventValue('25%'));
			console.log(normalizeEventValue('20'));
			console.log(normalizeEventValue(53));
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
		
		var normalizeEventValue = function(value) {
			if (value === '' + value) {
				value = value.toLowerCase();
				
				switch (value) {
					case 'play' :
					case 'ready' :
					case 'pause' :
					case 'finish' :
					case 'progress' :
						return value;
				}
				
				if (value.slice(-1) === '%') {
					value = value.slice(0, -1) / 100;
				}
			}
			
			
			
			return false;
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