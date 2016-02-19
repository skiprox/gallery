# gallery

[Check out the examples!](http://skiprox.github.io/gallery/)

A way to create galleries with touch support.


### Gallery Options
These are all options you can pass to the gallery. Only the query string for the container element is required.

* `containerEl [String]` – The query string for the container element.
* `obj [Object]` - Object containing all the other options, listed below.
* `*** ease [String]` - The ease to apply to the transitions on the gallery elements.
* `*** duration [Float]` - The duration of the transition between slides.
* `*** threshold [Float]` – The threshold at which moving the slide will trigger the next slide.
* `*** isSlide [Boolean]` – Whether the gallery is a slide gallery or a fade gallery.


### Public Gallery Methods
These are all the public methods for gallery.

* `Gallery.moveLeft` - move the gallery to the left
* `Gallery.moveRight` - move the gallery to the right
* `Gallery.moveToSlide` - move the gallery to the specified slide



## Usage
To use, your markup should look something like this:

```
<div id="gallery-wrapper" class="gallery-wrapper">
	<div class="gallery-inner">
		<ul class="gallery">
			<li class="gallery-item">
			</li><li class="gallery-item">
			</li><li class="gallery-item">
			</li><li class="gallery-item">
			</li><li class="gallery-item">
			</li>
		</ul>
	</div>
	<div class="nav">
		<span class="left"></span>
		<span class="right"></span>
	</div>
</div>
```

and then just create a new gallery with:

`var gallery = new gallery('.gallery-wrapper', {ease: 'ease', duration: 600})`

### Examples
See examples/index.html



## Necessary Changes/Improvements

* Get rid of hammerjs npm requirement, just use standard touch events.
* Clean up markup to

