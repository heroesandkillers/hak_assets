jQuery(document).ready(function($) {

	$(document).ready(function($){
		// set up the options to be used for jqDock...
		var dockOptions = {
			align: 'middle', // horizontal menu, with expansion UP/DOWN from the middle
			size: 50,  // set the maximum minor axis (horizontal) image dimension to 50px
			labels: 'bc'  // add labels (override the 'tl' default)
		};
		// ...and apply...
		$('.jqd_menu').jqDock(dockOptions);
	});

});