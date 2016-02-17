'use strict';

var Gallery = require('gallery');

var App = (function() {

	var slideGallery,
		fadeGallery;

	var createGalleries = function() {
		slideGallery = new Gallery('#gallery-wrapper');
	};

	return {
		init: function() {
			createGalleries();
		}
	}

}());

App.init();