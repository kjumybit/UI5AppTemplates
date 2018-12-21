/**
 * 
 */
sap.ui.define([
	'sap/m/GroupHeaderListItem'
], function(GroupHeaderListItem) {
	
	"use strict";

	var grouper = {
			
			/**
			 * TODO 
			 */
			getDeviceSetGroupHeader: function (oGroup){
				return new GroupHeaderListItem( {
					title: oGroup.key,
					upperCase: false
				} );
			}	};
	
	return grouper;

}, /* bExport= */ true);