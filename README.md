# VideoEvents.js

A utility which simplifies and standardizes Vimeo and YouTube core video events.

`VideoEvents` is designed to make video monitoring and tracking simpler:

* Track multiple videos from either – or both – Vimeo and YouTube
* Makes playback events and the events API consistent between the two services
* Adds the missing playback [progress](#event-progress) event to the YouTube player API
* Trigger events at specific playback [time](#event-time) – relative to either the beginning or end of the video – without having to know the video’s duration
* Trigger events at specific playback [percentage](#event-percent)
* Add event handlers that are only executed [once](#method-once)

### Example Usage

```javascript
var videoEvents = new VideoEvents(new YT.Player('ytplayer'));

videoEvents.on('play', function(data) {
	// Triggered when the video plays
	console.log('play', data);
}).on('progress', function(data) {
	// Triggered when the time/play position of the video updates
	console.log('progress', data);
}).once('5%', function(data) {
	// Triggered when the time/play position of the video reaches 5% of the duration
	console.log('5%', data);
}).once('-10', function(data) {
	// Triggered once ten seconds from the end of the video
	console.log('-10', data);
});
```

## <a id="create"></a>Creating an Instance

### new VideoEvents(*player*)

Creates a new instance of `VideoEvents`.

* **player** - An instance of either the [Vimeo](https://github.com/vimeo/player.js) or [YouTube](https://developers.google.com/youtube/iframe_api_reference) API player.

#### Vimeo Example

*Note:* `VideoEvents` *uses Vimeo’s newer [player API](https://github.com/vimeo/player.js) and not their previous Froogaloop library.*

```html
<iframe id="vimeoplayer" src="https://player.vimeo.com/video/76979871" width="640" height="360" frameborder="0"></iframe>

<script src="https://player.vimeo.com/api/player.js"></script>
<script src="VideoEvents.js"></script>

<script>
	var vimeoPlayer = new Vimeo.Player('vimeoplayer');
	var vimeoVideoEvents = new VideoEvents(vimeoPlayer);
	
	vimeoVideoEvents.on('play', function(data) {
		console.log('play', data);
	});
	vimeoVideoEvents.on('progress', function(data) {
		console.log('progress', data);
	});
</script>
```

#### YouTube Example

```html
<iframe id="ytplayer" src="http://www.youtube.com/embed/bHQqvYy5KYo?enablejsapi=1" width="640" height="360" frameborder="0"></iframe>

<script src="https://www.youtube.com/iframe_api"></script>
<script src="VideoEvents.js"></script>

<script>
	function onYouTubeIframeAPIReady() {
		var ytPlayer = new YT.Player('ytplayer');
		var ytVideoEvents = new VideoEvents(ytPlayer);
		
		ytVideoEvents.on('play', function(data) {
			console.log('play', data);
		});
		ytVideoEvents.on('progress', function(data) {
			console.log('progress', data);
		});
	}
</script>
```

## Methods

### on(*event, callback*)

Attaches an event handler function to the provided event. This method returns the instance of `VideoEvents` to allow for method chaining.

* **event** `String` - The type of [event](#events).
* **callback** `Function` - The function to execute when the event is triggered.

### <a id="method-once"></a>once(*event, callback*)

Attaches an event handler function to the provided event that is executed, at most, once per event type. Once the event has been triggered the event handler automatically removes itself. This method returns the instance of `VideoEvents` to allow for method chaining.

* **event** `String` - The type of [event](#events).
* **callback** `Function` - The function to execute when the event is triggered.

### off(*event [, callback]*)

Removes event handlers. This method returns the instance of `VideoEvents` to allow for method chaining.

* **event** `String` - The type of [event](#events).
* **[callback]** `Function` - The function to execute when the event is triggered. If `callback` is not passed, this method will remove all handlers for the provided `event`.

If neither `event` or `callback` are passed, this method will remove *all* event handlers from the `VideoEvents` instance.

### getPlayer()

Returns the Vimeo or YouTube player used to [instantiate](#create) the `VideoEvents` instance.

### destroy()

Removes any events and stops all internal processes to allow for prompt garbage collection.

## <a id="events"></a>Events

All `VideoEvents` events pass a data `Object` to the event handler function:

* **data** `Object` - Data that is passed to the event handler function:
    * **data.sender** `Object` - The instance of `VideoEvents` that sent the event.
    * **data.type** `String` - The type of event.
    * **data.time** `Number` - The current playback position in seconds.
    * **data.percent** `Number` - The current playback position as a decimal percentage.
    * **data.duration** `Number` - The duration of the video in seconds.
    * **[data.value]** `Number` - For [percent](#event-percent) and [time](#event-time) events only:
        * For `percent` events, the `value` is the [specified](#event-percent) as a 0-1 decimal percentage.
        * For `time` events, the `value` is the [specified](#event-time) time in seconds.

### play

Triggered when the video plays.

```javascript
videoEvents.on('play', function(data) {
	console.log('play', data);
});
```

### pause

Triggered when the video pauses.

```javascript
videoEvents.on('pause', function(data) {
	console.log('pause', data);
});
```

### <a id="event-progress"></a>progress

Triggered when the time/play position of the video updates. This fires in ~250ms intervals during playback.

```javascript
videoEvents.on('progress', function(data) {
	console.log('progress', data);
});
```

### end

Triggered any time the playback reaches the end of the video.

```javascript
videoEvents.on('end', function(data) {
	console.log('end', data);
});
```


### <a id="event-percent"></a>percent

Triggered when the playback passes the defined percent of the duration. Percent should be specified as 0%-100% `String` value that includes the percent sign (%).

*Note: This event may not be triggered exactly at the specified percent but will be triggered by the first [progress](#event-progress) event after the defined time.*

```javascript
videoEvents.on('5%', function(data) {
	console.log('5%', data);
});
```

### <a id="event-time"></a>time

Triggered when the playback passes the defined time in seconds. Seconds can be specified as a `String` or as a `Number`. For negative values, the provided seconds is subtracted from the video duration. 

*Note: This event may not be triggered exactly at the specified time but will be triggered by the first [progress](#event-progress) event after the defined time.*

```javascript
videoEvents.on(10.5, function(data) {
	console.log('progress', data);
});

videoEvents.on('-2', function(data) {
	console.log('progress', data);
});
```

## License

`VideoEvents` can be used freely for any open source or commercial works and is released under a [MIT license](http://en.wikipedia.org/wiki/MIT_License).

## Author

[Aaron Clinger](https://github.com/aaronclinger)
