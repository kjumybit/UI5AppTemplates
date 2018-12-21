sap.ui.define([
	"sap/ui/core/UIComponent",
	"jquery.sap.global",
	"model/models"
], function(UIComponent, jQuery, Models) {
	"use strict";

	return UIComponent.extend("kjumybit.ui5.example.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the
		 * startup of the app and calls the init method once.
		 * 
		 * @public
		 * @override
		 */
		init: function() {

			jQuery.sap.log.setLevel(jQuery.sap.log.Level.DEBUG);
			jQuery.sap.log.debug("init: before Super.apply()", null, 'Component');

			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			jQuery.sap.log.debug("init: after Super.apply()", null, 'Component');

			// set the device model
			this.setModel(Models.createDeviceModel(), "device");

			// initialize component runtime & dialog model
			this.setModel(Models.createRuntimeModel(), "runtime");
           
			// create the views based on the url/hash
			this.getRouter().initialize();
		},
		
		
        /**
         * The content density adapts itself based on the device type
		 * 
		 * @returns {string} Content density class
         */ 
		getContentDensityClass: function() {
			
			if (!this._sContentDensityClass) {
				if (!sap.ui.Device.support.touch) {
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		}

		
	});
})