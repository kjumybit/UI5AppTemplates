sap.ui.define([ 
	"kjumybit/ui5/example/controller/BaseController",
	"sap/m/MessageToast"
], function(BaseController, MessageToast) {
	"use strict";

	return BaseController.extend("kjumybit.ui5.example.controller.App", {

		/**
		 * Called when a controller is instantiated and its View controls (if
		 * available) are already created. Can be used to modify the View before
		 * it is displayed, to bind event handlers and do other one-time
		 * initialization.
		 * 
		 * @memberOf de.kjumybit.fhem.App 
		 */
		onInit : function() {
			
			// call the base component's init function
			BaseController.prototype.onInit.apply(this, arguments);

		},

		
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the
		 * controller's View is re-rendered (NOT before the first rendering!
		 * onInit() is used for that one!).
		 * 
		 * @memberOf de.kjumybit.fhem.App
		 */
		onBeforeRendering: function() {
		
			// set initial master and detail view (page)
			this._oSplittApp = this._oSplittApp || this.getSplitAppObj();
			
			this._oSplittApp.setMode("ShowHideMode");  // default
			//this._oSplittApp.setInitialMaster('Master');
			//this._oSplittApp.setInitialDetail('Detail');

			this.determineViewMode();
			this.hideDefaultMasterButton();				
		},
		
		
		/**
		 * Called when the View has been rendered (so its HTML is part of the
		 * document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * 
		 * @memberOf de.kjumybit.fhem.App
		 */
		// onAfterRendering: function() {
		//
		// },
		
		/**
		 * Called when the Controller is destroyed. Use this one to free resources
		 * and finalize activities.
		 * 
		 * @memberOf de.kjumybit.fhem.App
		 */
		 // onExit: function() {
		 // }
		 

		/** ================================================================================
		 *  App event handler
		 ** ================================================================================ */

		 /**
		  * Handle device orientation change.
		  * The UI5 device model is already changed, but own bindings haven't been updated.
		  * So force model binding update.
		  * 
		  * @param {object} oEvent Event parameter
		  */
		 onOrientationChange: function(oEvent) {
			var bLandscapeOrientation = oEvent.getParameter("landscape"),
				sMsg = "Orientation now is: " + (bLandscapeOrientation ? "Landscape" : "Portrait");
			
			MessageToast.show(sMsg, {duration: 5000});

			this.getDeviceModel().updateBindings(true);  // "force" is required
			this.determineViewMode();
			this.hideDefaultMasterButton();	

			// set visbility of own master button 
			let bMaster = !this.getSplitAppObj().isMasterShown();
			this.getRuntimeModel().setProperty('/header/masterBtnVisible', bMaster);
		},

	});
});
