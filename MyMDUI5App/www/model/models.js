sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(JSONModel, Device) {
	"use strict";

	/**
	 *  Create JSON data models
	 */
	return {
		
		/**
		 * Device model
		 * 
		 * @returns {sap/ui/model/json/JSONModel} Runtime model
		 */
		createDeviceModel: function() {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		/**
		 * Create runtime model
		 * 
		 * @returns {sap/ui/model/json/JSONModel} Runtime model
		 */
		createRuntimeModel: function() {
			let oRuntime = {
				header: {
					masterBtnVisible: false
				},
				viewMode: {
					mode: "full",
					fullScreen: true,
					overlay: false,
					singleView: false
				},
				cordova: {
					isACordovaApp: false,
					version: "",
				}
			};

			// check cordova
			if (window.cordova) {
				oRuntime.cordova.isACordovaApp = true;
				oRuntime.cordova.version = window.cordova.version;
			}

			return new JSONModel(oRuntime);
		}


		
	};

});