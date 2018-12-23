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
		 * Handles selection of an item in the navigation list.
		 * Hide navigation view (master page) and navigate (display) selected detail page.
		 * Hints:
		 * - when navigating to a new detail view for the first time, it must be placed into the 
		 *   detail page aggregation of the spilt app controll.
		 *   We achieve this by loading a list af views for the default route at startup. 
		 *   The manifest.json look slike:
		 *   <code>"target": [ "master", "detail2", "object", "detail" ]</code>
		 * 
		 * @param {object} oEvent List item press event
		 */
		onNavItemPress: function(oEvent) {

			// get View ID from event parameter
			var sPageId = oEvent.getParameter("listItem").getCustomData()[0].getValue();

			jQuery.sap.log.info("Navigate to detail view " + sPageId, null, _sComponent);
			
			// replace current detail view with new detail in navigation container for detail pages
			this.getSplitAppObj().toDetail(this.getDetailPageId(sPageId)); 

			this._closeMasterView(false);
		},


		/**
		 * Handles page Back button press
		 * Hide navigation view (master page)
		 * 
		 * @param {object} oEvent Button event
		 */
		onPressNavigationBack: function(oEvent) {

			this._closeMasterView(true);
		},

		
		/**
		 * On Phones there is always only one view visible. The current master view mus be replaced
		 * by a detail view. 
		 * - the detail view must have been loaded by the router (or on bootstrap)
		 * - if we navigate to a new detail view, it is already set by the <code>onNavItemPress</code>.
		 * - if we go back to the current (last) detail view  by <code>onPressNavigationBack</code> we have 
		 *   request a navigation
		 * 
		 * OpenUI5 Docu:
		 * - hideMaster() and showMaster: 
		 *   Used to hide/show the master page when in ShowHideMode and the device is in portrait mode.
		 * 
		 * @param {boolean} bBackToDetailView Navigate to current detail view 
		 */
		_closeMasterView: function(bBackToDetailView) {

			let oApp = this.getSplitAppObj();

			jQuery.sap.log.info("Close master view", null, _sComponent);

			// enable Master Button on Detail Views
			this.getRuntimeModel().setProperty('/header/masterBtnVisible', true);

			switch (this.getViewMode()) {
				case this.ViewMode.full:
					// hide master view 
					oApp.setMode("HideMode"); 
					break;
				case this.ViewMode.overlay:
					// hide master view 
					oApp.setMode("HideMode"); 
					break;					
				case this.ViewMode.single:
					// if called from navigation item, the new target detail view is loaded, but 
					// not active, so do a navigation only if triggerd by the navigation back button			
					if (bBackToDetailView) {
						// navigate to (current) detail view (replace master view)
						// getPreviousPage() returns a detail view as we have have even one master view
						let oDetailView = oApp.getPreviousPage();
						jQuery.sap.log.info("Navigate to previous page " + oDetailView.getId(), null, _sComponent);
						oApp.toDetail(oDetailView.getId()); 	
					}					
					break;
				default:					
			}

			// keep default master button invisible
			this.hideDefaultMasterButton();			
		}
	
	});
});
