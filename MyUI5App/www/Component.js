sap.ui.define([
	"sap/ui/core/UIComponent",
	"model/models"
], function(UIComponent, models) {
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

			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
           
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