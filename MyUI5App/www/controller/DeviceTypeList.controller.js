sap.ui.define([
	'de/kjumybit/fhem/controller/BaseController',
	'sap/m/MessagePopover',
	'sap/m/MessagePopoverItem',
	'de/kjumybit/fhem/model/formatter',
	'de/kjumybit/fhem/model/grouper'
], function(BaseController, MessagePopover, MessagePopoverItem, Formatter, Grouper) {
	"use strict";

	return BaseController.extend("de.kjumybit.fhem.controller.DeviceTypeList", {

		
	// init local members
	formatter: Formatter,
	grouper: Grouper,
		
	/**
	* Called when a controller is instantiated and its View controls (if available) are already created.
	* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	* @memberOf helloworld.Main
	*/
	onInit: function() {
		
	},

	/**
	* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	* (NOT before the first rendering! onInit() is used for that one!).
	* @memberOf helloworld.Main
	*/
//		onBeforeRendering: function() {
//
//		},

	/**
	* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	* This hook is the same one that SAPUI5 controls get after being rendered.
	* @memberOf helloworld.Main
	*/
//		onAfterRendering: function() {
//
//		},

	/**
	* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	* @memberOf helloworld.Main
	*/
//		onExit: function() {
//
//		}

	/** ================================================================================
	 *  App event handler
	 ** ================================================================================ */
	
	
	
	});
});
