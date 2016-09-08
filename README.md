# VideoEvents.js
An utility which simplifies and standardizes Vimeo and YouTube video events.

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

## Creating an Instance

## Methods

### on(*event, callback*)

This method returns the instance of `VideoEvents` to allow for method chaining.

* **event** (String) - 
* **callback** (Function) - 

### off(*[event] [, callback]*)

This method returns the instance of `VideoEvents` to allow for method chaining.

* **[event]** (String) - 
* **[callback]** (Function) - 

### once(*event, callback*)

This method returns the instance of `VideoEvents` to allow for method chaining.

* **event** (String) - 
* **callback** (Function) - 

### getPlayer()


### destroy()

Removes any events and stops all internal processes to allow for prompt garbage collection.

## Events

### play

Triggered when

```javascript
videoEvents.on('play', function(data) {
	console.log('play', data);
});
```

### pause

Triggered when

```javascript
videoEvents.on('pause', function(data) {
	console.log('pause', data);
});
```

### progress

Triggered when

```javascript
videoEvents.on('progress', function(data) {
	console.log('progress', data);
});
```

### end

Triggered when

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