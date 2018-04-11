sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(JSONModel, Device) {
	"use strict";

	// private methods
	
	// pubic methods
	return {

		/** 
		 * Create frontend device model
		 */
		createDeviceModel: function() {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		
		
		/**
		 * Create runtime model
		 */
		createRuntimeModel: function() {
			let mState = {
				fhemConnection : {
					isConnected : false,
				}
			};
			return new JSONModel(mState);
		},
		
				
		/**
		 * Create user dialog model
		 */
		createUserDialogModel: function() {
			return new JSONModel({
				//TODO
			});
		},
		
		
		/**
		 * Create side panel navigation list 
		 */
		createSideNavigationModel: function() {
			return new JSONModel("model/NavigationTree.json");
		}
	};
});