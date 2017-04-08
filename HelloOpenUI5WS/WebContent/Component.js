sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"sap/ui/model/json/JSONModel",
	"org/hkroeber/demo/ws/model/models"
], function(UIComponent, Device, JSONModel, models) {
	"use strict";

	return UIComponent.extend("org.hkroeber.demo.ws.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			
			// set settings model
			//TODO: define model in descriptor ???, use new JS class
			var oSettings = {
		            settings : {
		               serverURL : "ws://himberrypi.fritz.box:8086"
		            }
		    };
		    this.setModel(new JSONModel(oSettings));
		}
	});
})