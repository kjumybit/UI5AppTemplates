/**
 * 
 */
sap.ui.define(function() {
	"use strict";
	// jQuery.sap.require("sap.ui.core.format.DateFormat");
	var formatter = {
			
			/**
			 * Get device name depending on Alias attribute 
			 */
			getDeviceName: function (sDevAlias, sDevName) {	
				return (sDevAlias ? sDevAlias : sDevName);
			},
	};
	
	return formatter;

}, /* bExport= */ true);