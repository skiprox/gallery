'use strict';

var Gallery = require('gallery');

var App = (function() {

	var slideGallery,
		fadeGallery;

	var createGalleries = function() {
		slideGallery = new Gallery('#slide-gallery-wrapper');
		fadeGallery = new Gallery('#fade-gallery-wrapper', {
			isSlide: false
		});
	};

	return {
		init: function() {
			createGalleries();
		}
	}

}());

App.init();