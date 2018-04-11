sap.ui.define([ "sap/ui/core/mvc/Controller" ], function(Controller) {
	"use strict";

	return Controller.extend("org.hkroeber.demo.ws.controller.View1", {

		/**
		 * Called when a controller is instantiated and its View controls (if
		 * available) are already created. Can be used to modify the View before
		 * it is displayed, to bind event handlers and do other one-time
		 * initialization.
		 * 
		 * @memberOf helloworld.Main
		 */
		onInit : function() {

		    // create websocket
			jQuery.sap.require("socket.io");
			this.socket = io.connect('ws://localhost:8086', {
                timeout: 5000,
                'sync disconnect on unload' : true
            });
			
			/**
			 *  passing controller instance to handler function via 
			 *  - closures
			 *  - object property (won't work)
			 *  - function property
			 */ 
			this.socket.on('connect_error', (function(oController) {
				return function() { 
					oController.appendStringToEventContainer('Error while connecting to server');
				}
			})(this));
						
			this.socket.on('connect', (function(oController) {
				return function() { 
					oController.appendStringToEventContainer('Successfully connected to server');
					// oController.socket.emit('getAllValuesOnChange');
					oController.socket.emit('getMetaData');
				}
			})(this));

			// a ws message contains only a single fhem device event
			// var changedValues act as a local container
			var changedValues = '';
			this.socket.on('value', (function(oController) {
				return function(data) { 
					var value = '';
				    for (var unit in data) {
				         value = data[unit];
				         changedValues = changedValues + unit + ': ' + value + "<br>";
				    }
					oController.appendStringToEventContainer(changedValues);
				}
			})(this));


			this.socket.on('metaData', (function(oController) {
				return function(data) {
					if (data) {
						oController.appendStringToEventContainer(data.toString());
					};
				}
			})(this));

			
			this.socket.on('device', (function(oController) {
				return function(data) { 
					oController.appendStringToEventContainer(data);
				}
			})(this));

			
			this.socket.on('disconnect', (function(oController) {
				return function() { 
					oController.appendStringToEventContainer('Disconnected from server');
				}
			})(this));
			
			
			this.socket.on('error', (function(oController) {
				return function() { 
					oController.appendStringToEventContainer('Connection error');
				}
			})(this));
		},


		/**
		 * Similar to onAfterRendering, but this hook is invoked before the
		 * controller's View is re-rendered (NOT before the first rendering!
		 * onInit() is used for that one!).
		 * 
		 * @memberOf helloworld.Main
		 */
		// onBeforeRendering: function() {
		//
		// },
		/**
		 * Called when the View has been rendered (so its HTML is part of the
		 * document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * 
		 * @memberOf helloworld.Main
		 */
		// onAfterRendering: function() {
		//
		// },
		
		/**
		 * Called when the Controller is destroyed. Use this one to free resources
		 * and finalize activities.
		 * 
		 * @memberOf helloworld.Main
		 */
		onExit: function() {
			// disconnect from websocket server
			if (this.socket) this.socket.disconnect();
		},
		
		/**
		 * Handle Side Navigation toggle button
		 */
		onSideNavButtonPress: function() {
			var sideNavigation = this.getView().byId("sideNavigation");
			var expanded = !sideNavigation.getExpanded();

			sideNavigation.setExpanded(expanded);
		},
			
		/**
		 * Append new string to event text HTML container
		 * @param {string} sNewText Text to append
		 * @param {boolean} bClearText Clear text container
		 */
		appendStringToEventContainer: function(sNewText, bClearText) {
			let oText = this.byId("FhemEvents");
			let sText = (bClearText ? oText.getHtmlText() + sNewText : sNewText );
			oText.setHtmlText(sText);
		}
	});
});
