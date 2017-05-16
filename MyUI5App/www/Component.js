sap.ui.define([
	"sap/ui/core/UIComponent",
	"model/models",
    "constants/service",
    "constants/values"
], function(UIComponent, models) {
	"use strict";

	return UIComponent.extend("ui5.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app 
		 * and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
           
			// set the local storage model for app settings
			this.setModel(models.createFhemJsConfigModel(), "settings");
			
			//initialize navigation
			this.getRouter().initialize();
		},
        
        /**
        * The content density adapts itself based on the device type
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

});
