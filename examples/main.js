/*jshint -W121, -W018*/
'use strict';

var gallery = require( './../gallery.js' );

var Main = (function() {

	var slideGallery,
		fadeGallery;

	return {
		init : function() {
			slideGallery = new gallery('#gallery-wrapper');
			fadeGallery = new gallery('#gallery-wrapper-fade', {
				isSlide: false
			});
			return this;
		}
	};

}());

module.exports = Main.init();
