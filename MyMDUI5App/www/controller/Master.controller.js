sap.ui.define([ 
	"kjumybit/ui5/example/controller/BaseController",
	"jquery.sap.global"		
], function(BaseController, jQuery) {
	"use strict";

	const _sComponent = "Master";

	return BaseController.extend("kjumybit.ui5.example.controller.Master", {

		/**
		 * Called when a controller is instantiated and its View controls (if
		 * available) are already created. Can be used to modify the View before
		 * it is displayed, to bind event handlers and do other one-time
		 * initialization.
		 * 
		 */
		onInit : function() {

			jQuery.sap.log.debug("onInit", null, _sComponent);

			// call the base component's init function
			BaseController.prototype.onInit.apply(this, arguments);

		},

		
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the
		 * controller's View is re-rendered (NOT before the first rendering!
		 * onInit() is used for that one!).
		 * 
		 */
		// onBeforeRendering: function() {
		//
		// },


		/**
		 * Called when the View has been rendered (so its HTML is part of the
		 * document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * 
		 */
		// onAfterRendering: function() {
		//
		// },
		

		/**
		 * Called when the Controller is destroyed. Use this one to free resources
		 * and finalize activities.
		 * 
		 */
		//onExit: function() {
		//
		//}
	

		/** ================================================================================
		 *  App event handler
		 ** ================================================================================ */	


		/**
		 * Handles page Back button press
		 * Hide navigation view (master page)
		 * 
		 * @param {object} oEvent Button event
		 */
		onPressNavigationBack: function(oEvent) {
			let oApp = this.getSplitAppObj();

			jQuery.sap.log.info("Close master view", null, _sComponent);

			// enable Master Button on Detail Views
			this.getRuntimeModel().setProperty('/header/masterBtnVisible', true);

			switch (this.getViewMode()) {
				case this.ViewMode.full:
					// hide master view 
					oApp.setMode("HideMode"); 
					//oApp.hideMaster(); don't work
					break;
				case this.ViewMode.overlay:
					// hide master view 
					oApp.setMode("HideMode"); 
					// oApp.hideMaster();
					break;					
				case this.ViewMode.single:
					// navigate to detail view (replace master view)
					oApp.toMaster(this.getDetailPageId('DetailView'), 'show');
					break;
				default:					
			}

			// keep default master button invisible
			this.hideDefaultMasterButton();			
		}

	
	});
});
