sap.ui.define([
	"de/kjumybit/fhem/controller/BaseController",
	"de/kjumybit/fhem/libs/Settings",	
	"jquery.sap.global",	
	"sap/ui/model/json/JSONModel",	
	"sap/tnt/NavigationList",
	"sap/tnt/NavigationListItem"
], function(BaseController, Settings, jQuery, JSONModel, NavigationList, NavigationListItem) {
	"use strict";

	const _sComponent = "Navigation";
	
	return BaseController.extend("de.kjumybit.fhem.controller.Navigation", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf helloworld.Main
		 */
		onInit: function() {
		
			jQuery.sap.log.debug("onInit", null, _sComponent);
		},

		
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf helloworld.Main
		 */
		onBeforeRendering: function() {

			jQuery.sap.log.debug("onBefore", null, _sComponent);
			
			this.oRuntimeModel = this.getRuntimeModel();
            this.oSettings = this.getSettings(); 
            this.oNavModel = this.getModel("sideNavigation");
            
			// connect to Fhem backend server and get metadata model
			if ( this.oSettings.isComplete() ) {				
				this._createFhemModel(this.oSettings);
			}

            var oSideNavCtrl = this.getView().byId("sideNavigation");           
            			
            /*
			oSideNavCtrl.setModel(oNavModel);
            
            // create item aggregation: requires Navigation List
			var oNavigationListTemplate = this._createNavigationList();
			
            // bind item aggregation
			oSideNavCtrl.setItem(oNavigationListTemplate);
			*/
						
		},

		
		
		/**
		 * Handle press on Settings button. Display app settings dialog. 
		 */
		onPressSettings: function(oEvent) {
			var oView = this.getView();
			var oDialog = oView.byId("settingsDlg");
			
			if (!oDialog) {
				// create dialog via fragment factory (provide 'this' to enable callback handlers
				oDialog = sap.ui.xmlfragment(oView.getId(), "de.kjumybit.fhem.view.SettingsDialog", this);
				// connect dialog to view (models, lifecycle)
				oView.addDependent(oDialog);
			}

			oDialog.open();		
		},
		
		
		/**
		 * Handle close settings dialog.
		 * - Save settings properties and
		 * - (Re-) connect to the Fhem service.
		 *  
		 */
		onPressCloseSettingsDlg: function(oEvent) {
			oEvent.getSource().getParent().close();

			if ( this.oSettings.isComplete() ) {
				this.oSettings.save();
				// (re) connect to Fhem backend server and get metadata model				
				this._createFhemModel(this.oSettings);
			}
		},
		
						
		/**
		 * Create navigation list items
		 * @returns {sap/tnt/NavigationList} the navigation list
		 */
		_createNavigationList: function() {
			
			var oNavigationListTemplate = new NavigationList({
				items: {
					template: new NavigationListItem({
						text: '{sideNavigation>navItemID}',
						items: {
							template: new NavigationListItem({
								text: '{sideNavigation>itemId}'
							}),
							path: 'sideNavigation>items',
							templateShareable: "false"					//avoids framework warning
						},
						expanded: false,
						select: [this.onNavItemSelect, this],
						icon: "sap-icon://fhem/hm_ccu"
					}),
					path: 'sideNavigation>/appNavTree/dynamicItems',      //no curly brackets here!
					templateShareable: "false"
				},
				width: "auto"
			});
			
			return oNavigationListTemplate;
		},
		
		
		/**
		 * Handles item selection in navigation list on level 1 
		 * (overview, devices, rooms, ...) and selected sub item
		 * @parameter oEvent ..,
		 * @parameter oEvent.getSource() ... Navigation List Item (Level 1)   
		 */
		onNavItemSelect: function(oEvent) {
			
			var oRouter = this.getRouter();
			var oItem = oEvent.getParameters("item");
			if (!oItem) return;
			
			var sText = oItem.item.getText();
			
			// get model binding of selected navigation item
			var oBindingContext = oEvent.getSource().getBindingContext('sideNavigation');
			if (!oBindingContext) return;
			
			// get view name of item
			var oItemProperty = oBindingContext.getProperty();
			if (oItemProperty.view) {
				oRouter.navTo(oItemProperty.view);
			}
		},
		
	
		/**
		 * Handles page Back button press
		 * Hide navigation view (master page)
		 */
		onPressNavigationBack: function(oEvent) {
			//TODO
			this.getOwnerComponent()._oApp.setMode("HideMode");
			this.getOwnerComponent()._oApp.hideMaster();
		},
		
		
		/**
		 * Establish connection to Fhem backend server.
		 * An existing connection is closed before.
		 */
		//TODO: check for connection change
		_createFhemModel : function (oSettings) {
			jQuery.sap.require("fhem.model");
			
			let mSettings = oSettings.getModel().getProperty("/");			
			let fhemModel = this.getFhemModel();
			
			if (fhemModel) {
				// close existing connection
				fhemModel.disconnect();
			}
			
			// create new Fhem model
			fhemModel = new fhem.model.Model({
				"host": mSettings.server.host, 
				"port": mSettings.server.port,
				"onConnection": this._onFhemConnection.bind(this),
				"onMetaDataLoaded": this._onMetaDataLoaded.bind(this),
				"onConnectionFailed": this._onErrorFhemConnection.bind(this),
				"onDisconnected": this._onFhemDisconnect.bind(this)			
			});

			// local testing 
			/*
			oModel.loadData("model/fhemJsonList2.json");
			this.setModel(oModel, "fhemMetaData" );  
			this._setSideNavModelfromFhem();			
			*/
			
			this.setFhemModel(fhemModel);
		},

		
		_onFhemConnection : function(oEvent) {
			this._setRuntimeFhemConnectionState(false);
		},

		
		_onErrorFhemConnection : function(oEvent) {
			this._setRuntimeFhemConnectionState(false);
		},
		
		
		_onFhemDisconnect : function(oEvent) {
			this._setRuntimeFhemConnectionState(false);
		},

		
		/**
		 * Handle Fhem metadata 
		 * Set & update local models
		 * - Fhem data model
		 * - Side navigation model 
		 */
		//TODO: re-use JSON Model
		_onMetaDataLoaded : function(oEvent) {
			
			this._setRuntimeFhemConnectionState(true);			
			
			let oMetaModel = this.getFhemMetaModel();
			let oFhem = this.getFhemModel(); 
			oMetaModel.setData(oFhem.getMetaData());
			
			// oModel.loadData("model/fhemJsonList2.json"); // local testing
  
			this._setSideNavModelfromFhem(oFhem);
		},
		
		
		/**
		 * update Fhem connection state in runtime model 
		 */
		_setRuntimeFhemConnectionState: function( bConnected ) {					
			this.oRuntimeModel.setProperty("/fhemConnection/isConnected", bConnected);
		},
		
		
		/**
		 * Set sideNavigation model with Fhem metadata
		 * - Groups (TODO)
		 * - Rooms
		 * - Device Types
		 * - Device Sub Types 
		 */
		_setSideNavModelfromFhem: function(oFhem) {
			
			var oFhemData = oFhem.getMetaData();
			var oNavModel = this.getModel("sideNavigation");
			var oNavItems = oNavModel.getProperty("/appNavTree/dynamicItems");
			
			// iterate over all main navigation items (Fhem categories) and
			// add Fhem category items as sub item to the current main navigation item
			for (var i=0, iL=oNavItems.length; i<iL; i++ ) {
				if (oNavItems[i].fhemModelRef.setName) {
					
					oNavItems[i].items = [];	
					var aFhemItems = oFhemData[oNavItems[i].fhemModelRef.setName];
					if (!aFhemItems) continue;
					
					for (var j=0, jL=aFhemItems.length; j<jL; j++) {
						oNavItems[i].items.push({
							"itemId": (oNavItems[i].fhemModelRef.nameProperty ? aFhemItems[j][oNavItems[i].fhemModelRef.nameProperty] : aFhemItems[j] ) 
						});
					}
				}
			}
			// update navigation model
			oNavModel.setProperty("/appNavTree/dynamicItems", oNavItems);
		},

		
	});
});
