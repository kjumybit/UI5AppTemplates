/*
 *  
 */
sap.ui.define([
	"jquery.sap.storage",
	"sap/ui/base/ManagedObject",
	"sap/ui/model/json/JSONModel" 	
],
	function(jQueryStorage, ManagedObject, JSONModel) {
		"use strict";
								
		const _sComponent = "Settings";
		
		var Settings = ManagedObject.extend("de.kjumybit.fhem.libs.Settings", /** @lends de.kjumybit.fhem.libs.Settings.prototype */ {
	
								
			/**
			 * 
			 * Triggers 
			 * - readComplete event on read of complete settings properties
			 * - readIncomplete event on read of incomplete settings properties
			 */
			constructor: function(sId, mSettings) {
				ManagedObject.apply(this, arguments);

				// identify how the constructor has been used to extract the settings
				if (typeof sId !== "string") {
					mSettings = sId;
					sId = undefined;
				}
								
				// get initialized or saved JSON model
				this._mSettings = _readAppSettings();
				this._oModel = new JSONModel(this._mSettings);
				this._oModel.setDefaultBindingMode("TwoWay");
				
				//TODO trigger events
			},

			
			/**
			 * 
			 */
			metadata: {
				properties: {
					publicMethods : [ "getData", "getModel", "isComplete", "save", "setData" ]					
				}
			},

			
			/**
			 * 
			 */
			destroy: function () {
				ManagedObject.prototype.destroy.apply(this, arguments);
			},
			
		});


		/**
		 * Get JSON settings object
		 * @returns {mSettings}
		 * 
		 * @public
		 */
		Settings.prototype.getData = function() {
			return this._mSettings;
		};

		
		/**
		 * Set JSON settings object and validate settings properties.
		 * Only a complete settings object will be set.
		 * 
		 * @returns {bIsComplete}}
		 * 
		 * @public
		 */
		Settings.prototype.setData = function(mSettings) {
			let bIsComplete =_isComplete(mSettings);

			if (bIsComplete) {
				this._oModel.setData(mSettings, true);
			}
			
			return bIsComplete;
		};
		
		
		/**
		 * Get JSON model with settings properties.
		 * @returns {oJSONModel}
		 * 
		 * @public
		 */
		Settings.prototype.getModel = function() {
			return this._oModel;
		};

		
		/**
		 * Are all properties of the settings object complete.
		 * @returns {bIsComplete}
		 * 
		 * @public
		 */
		Settings.prototype.isComplete = function() {			
			return _isComplete(this._mSettings);
		};
		
		
		/**
		 * Save user settings to local storage. Only a complete setting object is stored.
		 * Triggers
		 * - saveSuccess event on success
		 * - saveError event on error
		 * 
		 * @public
		 */
		Settings.prototype.save = function() {
			if (this.isComplete()) {
				//TODO: trigger event
				_saveAppSettings(this._mSettings);
			} else {
				//TODO: trigger event
			}
		};

		
		// Private section
		
		/**
		 * Get initialized settings JSON object
		 * @returns {mSettings} 
		 */
		function _getInitializedModel () {
			// initialize storage
			return {
				"server": {
					"host": "localhost",
					"port": "8086"
				},
				"protocoll": {
					"secure": false
				},
				"authentication": {
					"userName": "",
					"password": ""
				}
			}			
		};
		
		
		/**
		 * Read application settings from local storage
		 * @returns {oSettings}
		 */
		function _readAppSettings () {
			
			// load local web storage containing app configuration data
			var oStorage = jQueryStorage.sap.storage(jQueryStorage.sap.storage.Type.local);
			var sContent = oStorage.get("appSettings");
			var oSettings = {};
			
			if (sContent) {
				oSettings = JSON.parse(sContent);
			} else {
				// initialize storage
				oSettings = _getInitializedModel();
			}
			jQuery.sap.log.info("Settings properties read.", null, _sComponent);
			return oSettings;
		};
			
		
		/**
		 * Write application settings to local storage
		 * @param {oSettings}
		 */
		function _saveAppSettings (oSettings) {
			
			// save to local web storage
			var oStorage = jQueryStorage.sap.storage(jQueryStorage.sap.storage.Type.local);
			var oContent = JSON.stringify(oSettings);
			oStorage.put("appSettings", oContent);
			jQuery.sap.log.info("Settings properties saved.", null, _sComponent);
		};
		

		function _isComplete (mSettings) {
			
			if (!mSettings || typeof mSettings !== "object") {
				jQuery.sap.log.error("Settings object is not initialized", null, _sComponent);
				return false;
			}
			
			if (!mSettings.server || typeof mSettings.server !== "object") {
				jQuery.sap.log.error("Settings object contains no 'server' section", null, _sComponent);
				return false;
			}
			
			if (mSettings.server.host === undefined || typeof mSettings.server.host !== "string") {
				jQuery.sap.log.error("Settings server section contains no valid 'host' property", null, _sComponent);
				return false;
			}
 
			if (mSettings.server.port === undefined || typeof mSettings.server.port !== "string") {
				jQuery.sap.log.error("Settings server section contains no valid 'port' property", null, _sComponent);
				return false;
			}
			
			if (!mSettings.server.host || !mSettings.server.port) {
				return false;
			}
			
			return true;
		};
		
		
		return Settings;

	}, /* bExport= */ true);