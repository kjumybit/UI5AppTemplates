sap.ui.define([
	'de/kjumybit/fhem/controller/BaseController',
	'sap/m/GenericTile',
	'sap/m/TileContent',
	'sap/m/NumericContent',	
	'de/kjumybit/fhem/model/formatter',
	'de/kjumybit/fhem/model/grouper'
], function(BaseController, GenericTile, TileContent, NumericContent, Formatter, Grouper) {
	"use strict";

	return BaseController.extend("de.kjumybit.fhem.controller.RoomList", {

		
		// init local members
		formatter: Formatter,
		grouper: Grouper,
			
		/**
		* Called when a controller is instantiated and its View controls (if available) are already created.
		* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		* @memberOf helloworld.Main
		*/
		onInit: function() {
	
			// register hook for initializations each time the view is displayed
			this.getRouter().getRoute('RoomList').attachPatternMatched(this.onDisplay, this);
							
			// create tile the first time
			this._createTiles();
		},
	
		
		/**
		* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		* (NOT before the first rendering! onInit() is used for that one!).
		* @memberOf helloworld.Main
		*/
		onBeforeRendering: function() {
			
			// call hook at view creation time
			this.onDisplay();
		},
	
		
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
	
		
		/**
		 * Own hook called each time the view is displayed
		 */
		onDisplay: function() {
						
		},
		
		
		/**
		 * Create Tile controls for all Fhem rooms. Add properties
		 * - room name
		 * - most severe status (error, waring, info)
		 * - icon
		 * - number of devices
		 */
		_createTiles: function() {
						
			var aRooms = this.getFhemModel().getRoomSet();
			
			for (var i = 0, iL = aRooms.length; i < iL; i++) {
				var sRoom = aRooms[i];
				var oTile = new GenericTile("roomList_" + sRoom, {
					header: 'Beschreibung',
					subheader: sRoom
				});
				var oContent = new TileContent().setContent(
						new NumericContent({
							icon: 'sap-icon://line-charts',
							value: i,
							valueColor: ((i % 2)? 'Error': 'Good') 
						}));
				oTile.addTileContent(oContent);
				oTile.attachPress(this.onTilePress, this);
				oTile.addStyleClass("sapUiSmallMarginEnd");
				oTile.addStyleClass("sapUiSmallMarginBottom");
				oTile.placeAt(this.byId("TileRoomList"));
			}
			
		},
		
		
		/** ================================================================================
		 *  App event handler
		 ** ================================================================================ */
		
		/**
		 * Handles Tile press event.
		 * Navigates to device list for the room.
		 */
		onTilePress: function(oEvent) {
			
		}
	
	});
});
