# VideoEvents.js
An utility which simplifies and standardizes Vimeo and YouTube core video events:

### Example Usage
```javascript
var vimeoEvents = new VideoEvents(new Vimeo.Player('#vimeoplayer'));

vimeoEvents.on('progress', function(data) {
	console.log('progress', data);
});
vimeoEvents.once('5%', function(data) {
	console.log('5%', data);
});
vimeoEvents.once('-10', function(data) {
	console.log('-10', data);
});
```

## <a id="create"></a>Creating an Instance

## Methods

### on(*event, callback*)

Attaches an event handler function to the provided event. This method returns the instance of `VideoEvents` to allow for method chaining.

* **event** (String) - The type of [event](#events).
* **callback** (Function) - The function to execute when the event is triggered.

### once(*event, callback*)

Attaches an event handler function to the provided event that is executed, at most, once per event type. Once the event has been triggered the event handler automatically removes itself. This method returns the instance of `VideoEvents` to allow for method chaining.

* **event** (String) - The type of [event](#events).
* **callback** (Function) - The function to execute when the event is triggered.

### off(*event [, callback]*)

Removes event handlers. This method returns the instance of `VideoEvents` to allow for method chaining.

* **event** (String) - The type of [event](#events).
* **[callback]** (Function) - The function to execute when the event is triggered. If `callback` is not passed, this method will remove all handlers for the provided `event`.

If neither `event` or `callback` are passed, this method will remove *all* event handlers from the `VideoEvents` instance.

### getPlayer()

Returns the Vimeo or YouTube player used to [instantiate](#create) the `VideoEvents` instance.

### destroy()

Removes any events and stops all internal processes to allow for prompt garbage collection.

## <a id="events"></a>Events

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

### progress

Triggered when the time / play position of the video updates. This fires in ~250ms intervals during playback.

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


### percent

Triggered when

```javascript
videoEvents.on('5%', function(data) {
	console.log('5%', data);
});
```

### time

Triggered when

```javascript
videoEvents.on('10', function(data) {
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