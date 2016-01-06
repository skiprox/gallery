'use strict';

var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;

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
    this._establishObjectProperties(containerEl, obj);

    // Add necessary transitions
    this._addTransitions();

    // Referencing the bound listeners
    this.moveLeft = this.moveLeft.bind(this);
    this.moveRight = this.moveRight.bind(this);

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
};

/**
 * Add transitions to the elems that need them to animate the slides
 */
proto._addTransitions = function() {
    this.elem.gallery.style.transition = 'transform ' + this.settings.duration + 'ms ' + this.settings.ease;
};

proto._addListeners = function() {
    this.elem.leftNav.addEventListener('click', this.moveLeft);
    this.elem.rightNav.addEventListener('click', this.moveRight);
};

proto._removeListeners = function() {

};

/**
 * Move the gallery to the left, if applicable
 */
proto.moveLeft = function() {
    if (this.props.currentSlide === 0) {
        return false;
    }
    else {
        this.props.currentSlide--;
        this.elem.gallery.style.transform = 'translateX(' + -(this.props.currentSlide * 100) + '%)';
        console.log('we should move left');
    }
};

/**
 * Move the gallery to the right, if applicable
 */
proto.moveRight = function() {
    if (this.props.currentSlide >= this.props.totalSlides-1) {
        return false;
    }
    else {
        this.props.currentSlide++;
        this.elem.gallery.style.transform = 'translateX(' + -(this.props.currentSlide * 100) + '%)';
        console.log('we should move right');
    }
};

/**
 * Destroys the gallery
 */
proto.destroy = function() {

};

module.exports = Gallery;
