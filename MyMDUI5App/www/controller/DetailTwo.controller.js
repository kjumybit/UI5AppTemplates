sap.ui.define([ 
	"./BaseController",
	"../model/formatter",	
	"jquery.sap.global"
], function(BaseController, formatter, jQuery) {
	"use strict";

	const _sComponent = "DetailTwo";

	return BaseController.extend("kjumybit.ui5.example.controller.DetailTwo", {

		// local members
		formatter: formatter,

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
		onBeforeRendering: function() {

			jQuery.sap.log.debug("onBeforeRendering", null, _sComponent);	

			// set own navigation button
			let bMaster = !this.getSplitAppObj().isMasterShown();
			this.getRuntimeModel().setProperty('/header/masterBtnVisible', bMaster);

			// hide master button
			this.hideDefaultMasterButton();

		}


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

	
	});
});
