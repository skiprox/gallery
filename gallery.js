'use strict';

var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var Hammer = require('hammerjs');

/**
 * A Gallery Factory
 * @param {Object} - Obj: The object of elements and other features
 *
 * *** @param {String} - ease: The ease on the gallery slide
 * *** @param {Float}  - duration: The duration of the slide
 */
function Gallery(containerEl, obj) {
    // Call the superclass constructor
    EventEmitter.call(this);

    // Establish the properties of the object
    this.settings = {};
    this.props = {};
    this.elem = {};
    this.hammer = null;
    this._establishObjectProperties(containerEl, obj);

    // Add necessary styles
    this._addTransitions();
    this.elem.leftNav.style.opacity = 0;

    // Referencing the bound listeners
    this.moveLeft = this.moveLeft.bind(this);
    this.moveRight = this.moveRight.bind(this);
    this._galleryPan = this._galleryPan.bind(this);
    this._galleryPanEnd = this._galleryPanEnd.bind(this);

    // Add the event listeners
    this._addListeners();
}

// Inherit from EventEmitter for Modal
inherits(Gallery, EventEmitter);

// Store the prototype in a variable for ease and fun!
var proto = Gallery.prototype;

proto._establishObjectProperties = function(containerEl, obj) {
    // The settings
    this.settings.ease = obj.ease || 'ease';
    this.settings.duration = obj.duration || 400;

    // The elements
    this.elem.galleryWrapper = document.querySelector(containerEl);
    this.elem.gallery = this.elem.galleryWrapper.querySelector('.gallery');
    this.elem.slides = this.elem.galleryWrapper.querySelectorAll('.gallery-item');
    this.elem.leftNav = this.elem.galleryWrapper.querySelector('.left');
    this.elem.rightNav = this.elem.galleryWrapper.querySelector('.right');

    // The properties
    this.props.currentSlide = 0;
    this.props.totalSlides = this.elem.slides.length;
    this.props.slideWidth = this.elem.gallery.clientWidth;

    // The hammer (touch)
    this.hammer = new Hammer(this.elem.gallery, {preventDefault: true});
};

/**
 * Add transitions to the elems that need them to animate the slides
 */
proto._addTransitions = function() {
    this.elem.gallery.style.transition = 'transform ' + this.settings.duration + 'ms ' + this.settings.ease;
};

/**
 * Remove transitions on the gallery element
 */
proto._removeTransitions = function() {
	this.elem.gallery.style.transition = null;
};

proto._addListeners = function() {
	// Click events
    this.elem.leftNav.addEventListener('click', this.moveLeft);
    this.elem.rightNav.addEventListener('click', this.moveRight);

    // Hammer events
    this.hammer.on('pan', this._galleryPan);
    this.hammer.on('panend', this._galleryPanEnd);
};

proto._removeListeners = function() {
	// Click events
	this.elem.leftNav.removeEventListener('click', this.moveLeft);
    this.elem.rightNav.removeEventListener('click', this.moveRight);

    // Hammer events
    this.hammer.off('pan', this._galleryPan);
    this.hammer.off('panend', this._galleryPanEnd);
};

/**
 * Move the gallery to the left, if applicable
 */
proto.moveLeft = function(e) {
	this._addTransitions();
    if (this.props.currentSlide === 0) {
        return false;
    }
    else {
        this.props.currentSlide--;
        this.elem.gallery.style.transform = 'translateX(' + -(this.props.currentSlide * this.props.slideWidth) + 'px)';
    }
    this._checkForPaddles();
};

/**
 * Move the gallery to the right, if applicable
 */
proto.moveRight = function(e) {
	this._addTransitions();
    if (this.props.currentSlide >= this.props.totalSlides-1) {
        return false;
    }
    else {
        this.props.currentSlide++;
        this.elem.gallery.style.transform = 'translateX(' + -(this.props.currentSlide * this.props.slideWidth) + 'px)';
    }
    this._checkForPaddles();
};

/**
 * Move back to the current slide (for swiping)
 */
proto.moveToCurrent = function() {
	this._addTransitions();
	this.elem.gallery.style.transform = 'translateX(' + -(this.props.currentSlide * this.props.slideWidth) + 'px)';
};

/**
 * Triggers when the gallery is panned (using Hammer)
 */
proto._galleryPan = function(e) {
	this._removeTransitions();
	this.elem.gallery.style.transform = 'translateX(' + (e.deltaX - (this.props.currentSlide * this.props.slideWidth)) + 'px)';
};

/**
 * Triggers when the panning stops on the gallery
 */
proto._galleryPanEnd = function(e) {
	console.log(e.deltaX);
	// If the movement is more than 50% of the width, then we trigger a move on the slide
	console.log('half of the movement', Math.abs(e.deltaX));
	console.log('slide width', this.props.slideWidth);
	if (Math.abs(e.deltaX) >= this.props.slideWidth/2) {
		if (e.deltaX > 0) {
			this.moveLeft();
		}
		else {
			this.moveRight();
		}
	}
	else {
		this.moveToCurrent();
	}
};

/**
 * Check if we should hide/show the paddles
 */
proto._checkForPaddles = function() {
	if (this.props.currentSlide == 0) {
		this.elem.leftNav.style.opacity = 0;
	}
	else if (this.props.currentSlide >= this.props.totalSlides-1) {
		this.elem.rightNav.style.opacity = 0;
	}
	else {
		this.elem.leftNav.style.opacity = 1;
		this.elem.rightNav.style.opacity = 1;
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

module.exports = Gallery;
