/*jshint -W121, -W018*/
'use strict';

var gallery = require( './../gallery.js' );

var Main = (function() {

	return {
		init : function() {
			window.testGallery = new gallery('.gallery-wrapper', {
				ease: 'ease-out',
				duration: 400,
				threshold: 0.33
			});
			return this;
		}
	};

}());

module.exports = Main.init();
