/**
 * 
 */
sap.ui.define(function() {
	"use strict";
	// jQuery.sap.require("sap.ui.core.format.DateFormat");
	var formatter = {
			
			/**
			 * Get system type
			 * 
			 * @param {object} oSystem System properties of device model
			 * @returns {string} System type name
			 */
			getSystemTypeName: function (oSystem) {	

				let sActiveTypeName = 'unknown;'
				let aTypes = Object.getOwnPropertyNames(oSystem.SYSTEMTYPE);

				// for each defined system type name return first system type, which is 
				// is set to true
				for (let i=0, iL=aTypes.length;i<iL; i++) {
					let sTypeName = oSystem.SYSTEMTYPE[aTypes[i]];
					if ( oSystem[sTypeName] ) { 
						sActiveTypeName = sTypeName;
						break;
					}
				};

				return sActiveTypeName;
			},
	};
	

	return formatter;

}, /* bExport= */ true);