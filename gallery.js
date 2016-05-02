'use strict';

var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var defaults = require('defaults');
var Hammer = require('hammerjs');

var defaultValues = {
	ease: 'ease',
	duration: 600,
	threshold: 0.5,
	isSlide: true,
	hasTouch: true
};

/**
 * A Gallery Factory
 * @param {String} - containerEl: The query string for the container element
 * @param {Object} - Obj: The object of elements and other features
 *
 * *** @param {String} - ease: The ease on the gallery slide
 * *** @param {Float}  - duration: The duration of the slide
 * *** @param {Float} - threshold: The threshold for touch gallery (when it moves from one slide to the next)
 * *** @param {Boolean} - isSlide: Is it a slide gallery, or a fade gallery?
 */
function SimpleGallery(containerEl, obj) {
	// Call the superclass constructor
	EventEmitter.call(this);

	// Establish the properties of the object
	this.settings = {};
	this.props = {};
	this.elem = {};
	this.hammer = null;
	obj = obj || {};
	this._establishObjectProperties(containerEl, obj);

	// Add necessary styles
	this._addPreTransitions();
	this.elem.rightNav.classList.add('active');

	// Referencing the bound listeners
	this.moveLeft = this.moveLeft.bind(this);
	this.moveRight = this.moveRight.bind(this);
	this._moveLeftClicked = this._moveLeftClicked.bind(this);
	this._moveRightClicked = this._moveRightClicked.bind(this);
	this._moveToPosition = this._moveToPosition.bind(this);
	this._galleryPan = this._galleryPan.bind(this);
	this._galleryPanEnd = this._galleryPanEnd.bind(this);
	this._onResize = this._onResize.bind(this);
	this._onFadeComplete = this._onFadeComplete.bind(this);

	// Add the event listeners
	this._addListeners();
}

// Inherit from EventEmitter for Modal
inherits(SimpleGallery, EventEmitter);

// Store the prototype in a variable for ease and fun!
var proto = SimpleGallery.prototype;

/**
 * Establish the properties attached to 'this'
 */
proto._establishObjectProperties = function(containerEl, obj) {
	// The settings
	this.settings = defaults(obj, defaultValues);

	// The elements
	this.elem.galleryWrapper = document.querySelector(containerEl);
	this.elem.gallery = this.elem.galleryWrapper.querySelector('.gallery');
	this.elem.slides = this.elem.galleryWrapper.querySelectorAll('.gallery-item');
	this.elem.leftNav = this.elem.galleryWrapper.querySelector('.left');
	this.elem.rightNav = this.elem.galleryWrapper.querySelector('.right');
	this.elem.toggleNav = this.elem.galleryWrapper.querySelectorAll('.togglenav-link');
	this.elem.currentActiveToggle = this.elem.galleryWrapper.querySelector('.togglenav-link.active');

	// The properties
	this.props.currentSlide = 0;
	this.props.previousSlide = 0;
	this.props.totalSlides = this.elem.slides.length;
	this.props.slideWidth = this.elem.gallery.clientWidth;

	// The hammer (touch)
	if (this.settings.hasTouch) {
		this.hammer = new Hammer(this.elem.gallery, {preventDefault: true});
	}
};

/**
 * Add transitions to the elems that need them to animate the slides,
 * and styles to the fade gallery items in order to transition them effectively
 */
proto._addPreTransitions = function() {
	if (this.settings.isSlide) {
		this.elem.gallery.style.transition = 'transform ' + this.settings.duration + 'ms ' + this.settings.ease;
	}
	else {
		var i = this.props.totalSlides;
		while (i--) {
			this.elem.slides[i].style.transition = 'opacity ' + this.settings.duration + 'ms ' + this.settings.ease;
			if (i !== this.props.currentSlide) {
				this.elem.slides[i].style.display = 'none';
				this.elem.slides[i].style.opacity = 0;
			}
			else {
				this.elem.slides[i].style.display = 'block';
				this.elem.slides[i].style.opacity = '1';
			}
		}
	}
};

/**
 * Remove transitions on the gallery element
 */
proto._removeTransitions = function() {
	if (this.settings.isSlide) {
		this.elem.gallery.style.transition = null;
	}
	else {
		var i = this.props.totalSlides;
		while (i--) {
			this.elem.slides[i].style.transition = null;
		}
	}
};

proto._addListeners = function() {
	var i = this.props.totalSlides;

	// Click events
	this.elem.leftNav.addEventListener('click', this._moveLeftClicked);
	this.elem.rightNav.addEventListener('click', this._moveRightClicked);
	while (i--) {
		this.elem.toggleNav[i].addEventListener('click', this._moveToPosition);
	}

	// Hammer events
	if (this.settings.hasTouch) {
		this.hammer.on('pan', this._galleryPan);
		this.hammer.on('panend', this._galleryPanEnd);
	}

	// Resize event
	window.addEventListener('resize', this._onResize);
};

proto._removeListeners = function() {
	var i = this.props.totalSlides;

	// Click events
	this.elem.leftNav.removeEventListener('click', this._moveLeftClicked);
	this.elem.rightNav.removeEventListener('click', this._moveRightClicked);
	while (i--) {
		this.elem.toggleNav[i].removeEventListener('click', this._moveToPosition);
	}

	// Hammer events
	if (this.settings.hasSlide) {
		this.hammer.off('pan', this._galleryPan);
		this.hammer.off('panend', this._galleryPanEnd);
	}

	// Resize event
	window.removeEventListener('resize', this._onResize);
};

proto._moveRightClicked = function(e) {
	e.preventDefault();
	this.moveRight();
};

proto._moveLeftClicked = function(e) {
	e.preventDefault();
	this.moveLeft();
};

/**
 * Move the gallery to the left, if applicable
 */
proto.moveLeft = function(e) {
	this._addPreTransitions();
	if (this.props.currentSlide === 0) {
		return false;
	}
	this.props.previousSlide = this.props.currentSlide;
	this.props.currentSlide--;
	if (this.settings.isSlide) {
		this._updateTransform();
	}
	else {
		this._updateFade();
	}
	this._checkNav();
};

/**
 * Move the gallery to the right, if applicable
 */
proto.moveRight = function(e) {
	this._addPreTransitions();
	if (this.props.currentSlide >= this.props.totalSlides-1) {
		return false;
	}
	this.props.previousSlide = this.props.currentSlide;
	this.props.currentSlide++;
	if (this.settings.isSlide) {
		this._updateTransform();
	}
	else {
		this._updateFade();
	}
	this._checkNav();
};

/**
 * Move gallery to position automatically (when togglenav is clicked)
 */
proto._moveToPosition = function(e) {
	e.preventDefault();
	this.props.previousSlide = this.props.currentSlide;
	this.props.currentSlide = Array.prototype.slice.call(this.elem.toggleNav).indexOf(e.target);
	this.moveToSlide(this.props.previousSlide, this.props.currentSlide);
};

/**
 * Public function to moving to specific slide
 * @param  {Int} previousSlide [Slide number of where we are]
 * @param  {Int} currentSlide  [Slide number of where we want to move]
 */
proto.moveToSlide = function(previousSlide, currentSlide) {
	if (this.settings.isSlide) {
		this._updateTransform();
	}
	else {
		this._updateFade();
	}
	this._checkNav();
};

/**
 * Move back to the current slide (for swiping)
 */
proto.moveToCurrent = function() {
	this._addPreTransitions();
	this._updateTransform();
	this._checkNav();
};

/**
 * Triggers when the gallery is panned (using Hammer)
 */
proto._galleryPan = function(e) {
	this._removeTransitions();
	if (this.settings.isSlide) {
		this._updateTransform(e.deltaX);
	}
};

/**
 * Update the transform on the gallery
 * @param  {Float} deltaX       The delta x value of the mouse
 */
proto._updateTransform = function(deltaX) {
	deltaX = deltaX || 0;
	this.elem.gallery.style.transform = 'translateX(' + (deltaX - (this.props.currentSlide * this.props.slideWidth)) + 'px)';
};

/**
 * Update the fade on the gallery (fade from one slide to the next)
 */
proto._updateFade = function() {
	this.elem.slides[this.props.previousSlide].style.opacity = 0;
	setTimeout(this._onFadeComplete, this.settings.duration);
};

/**
 * Triggered with a timeout, called when the duration of the first animation has completed
 */
proto._onFadeComplete = function() {
	var that = this;
	this.elem.slides[this.props.previousSlide].style.display = 'none';
	this.elem.slides[this.props.currentSlide].style.display = 'block';
	// Use settimeout to animate the opacity of the next slide, otherwise it just pops in
	setTimeout(function() {
		that.elem.slides[that.props.currentSlide].style.opacity = '1';
	}, this.settings.duration/10);
};

/**
 * Triggers when the panning stops on the gallery
 */
proto._galleryPanEnd = function(e) {
	// If the movement is more than the threshold, then we trigger a move on the slide
	if (Math.abs(e.deltaX) >= this.props.slideWidth*this.settings.threshold) {
		if (e.deltaX > 0) {
			if (this.props.currentSlide === 0) {
				this.moveToCurrent();
			}
			else {
				this.moveLeft();
			}
		}
		else {
			if (this.props.currentSlide >= this.props.totalSlides-1) {
				this.moveToCurrent();
			}
			else {
				this.moveRight();
			}
		}
	}
	else {
		this.moveToCurrent();
	}
};

/**
 * Check if we should hide/show the paddles
 */
proto._checkNav = function() {
	// The Paddle Navs
	if (this.props.currentSlide == 0) {
		this.elem.rightNav.classList.add('active');
		this.elem.leftNav.classList.remove('active');
	}
	else if (this.props.currentSlide >= this.props.totalSlides-1) {
		this.elem.leftNav.classList.add('active');
		this.elem.rightNav.classList.remove('active');
	}
	else {
		this.elem.leftNav.classList.add('active');
		this.elem.rightNav.classList.add('active');
	}

	// The Toggle Navs
	this.elem.currentActiveToggle.classList.remove('active');
	this.elem.currentActiveToggle = this.elem.toggleNav[this.props.currentSlide];
	this.elem.currentActiveToggle.classList.add('active');
};

/**
 * Resizing function, recalculate the slide width and run the transform with this new width
 */
proto._onResize = function(e) {
	this.props.slideWidth = this.elem.gallery.clientWidth;
	if (this.settings.isSlide) {
		this._updateTransform();
	}
};

/**
 * Destroys the gallery
 */
proto.destroy = function() {
	this._removeListeners();
	this.hammer.destroy();
	this.settings = null;
	this.props = null;
	this.elem = null;
	this.hammer = null;
};

module.exports = SimpleGallery;
