# gallery

A way to create galleries with touch support.



### Public Gallery Methods
List all public methods here.  CamelCase method names.  Do not include private methods.

* `Gallery.moveLeft` - move the gallery to the left
* `Gallery.moveRight` - move the gallery to the right
* `Gallery.moveToCurrent` - move the gallery back to the current slide



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

