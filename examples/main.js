/*jshint -W121, -W018*/
'use strict';

var gallery = require( './../gallery.js' );

var Main = (function() {

	return {
		init : function() {
			window.testGallery = new gallery('.gallery-wrapper', {});
			return this;
		}
	};

}());

module.exports = Main.init();
