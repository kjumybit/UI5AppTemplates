sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"	
], function (Controller, JSONModel) {
		"use strict";

		return Controller.extend("de.kjumybit.fhem.controller.BaseController", {
			
			
			onInit: function() {
			
				if (true) {
					
				};
				
			},
						
			
			/**
			 * Get array index of property value of an JSON object in an array
			 * @param sProperty the name of an object property 
			 * @param value the property value
			 * @param aArray an array of JSON objects
			 * @returns iIndex the array index o fthe frist object with mathich property value
			 *                 or -1, if no object has been found
			 */
			getArrayIndex: function (sProperty, value, aArray) {
				var index = -1;
				for (var i=0, iL=aArray.length; i<iL; i++) {
					var o = aArray[i];
					if (o[sProperty] && o[sProperty] == value) {
						index = i;
						break;
					}
				}
				return index;
			},
									
			
			/**
			 * Set & Get Fhem model from component property
			 * @return {fhem.model.Model}
			 */
			getFhemModel: function () {
				return this.getOwnerComponent().fhemModel;
			},
			
			setFhemModel: function (oFhemModel) {
				return this.getOwnerComponent().fhemModel = oFhemModel;
			},

			
			/**
			 * Get JSON Model for Fhem metadata
			 */
			getFhemMetaModel: function () {
				let oModel = this.getOwnerComponent().getModel('fhemMetaData')
				if (!oModel) {
					oModel = new JSONModel();
					this.getOwnerComponent().setModel('fhemMetaData', oModel);
				}
				return oModel;
			},
							
			
			/**
			 * Get settings object.
			 * @returns {oSettings} [de.kjumybit.fhem.libs.Settings]
			 */
			getSettings: function () {
				return this.getOwnerComponent().oSettings;			
			},
			
			
			getRuntimeModel: function() {
				return this.getOwnerComponent().getModel('runtime');	
			},
			
			
			/**
			 * Convenience method for accessing the router.
			 * @public
			 * @returns {sap.ui.core.routing.Router} the router for this component
			 */
			getRouter : function () {
				return sap.ui.core.UIComponent.getRouterFor(this);
			},

			
			/**
			 * Convenience method for getting the view model by name.
			 * @public
			 * @param {string} [sName] the model name
			 * @returns {sap.ui.model.Model} the model instance
			 */
			getModel : function (sName) {
				return this.getView().getModel(sName);
			},

			
			/**
			 * Convenience method for getting the view model by name.
			 * @public
			 * @param {string} [sName] the model name
			 * @returns {sap.ui.model.Model} the model instance
			 */
			getComponentModel : function (sName) {
				return this.getOwnerComponent().getModel(sName);
			},

			
			/**
			 * Convenience method for setting the view model.
			 * @public
			 * @param {sap.ui.model.Model} oModel the model instance
			 * @param {string} sName the model name
			 * @returns {sap.ui.mvc.View} the view instance
			 */
			setModel : function (oModel, sName) {
				return this.getView().setModel(oModel, sName);
			},

			
			/**
			 * Getter for the resource bundle.
			 * @public
			 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
			 */
			getResourceBundle : function () {
				return this.getOwnerComponent().getModel("i18n").getResourceBundle();
			},

		});

	}
);