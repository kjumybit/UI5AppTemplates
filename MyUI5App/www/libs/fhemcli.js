/**
 * Fhem client Ui functions
 *  
 */

var fhem = fhem || { 
	ui: {},
	model: {},
	core: {}
};

/* =====================================================================
 * Core functions
 * ===================================================================== */
fhem.core = (new function fhemCore() {
	"use strict"
	
	jQuery.sap.require("socket.io");
	
	// define global private variables
	
	// define global private functions and classes
	
	
	/**
	 * public Constants
	 */
	var PublishEvent = {
			getMetaData : "getMetaData",
			getValueOnce : "getValueOnce",  
			getValueOnChange : "getValueOnChange",
			getDeviceOnChange : "getDeviceOnChange",
			getAllValuesOnChange : "getAllValuesOnChange",
			getAllDevicesOnChange : "getAllDevicesOnChange",
			getAllValues : "getAllValues",
			refreshValues : "refreshValues",
			command : "command"
	};
	
	var SubscribeEvent = {
			"getMetaData" : "metaData",
			"getMetaDataError" : "metaDataError",
			"getValueOnce" : "value",
			"getValueOnChange" : "value",
			"getAllValuesOnChange" : "value",
			"getDeviceOnChange" : "device",
			"getAllDevicesOnChange" : "device",
	}
		
	/**
	 *  Fhem Service
	 *  Manages connection to backend Fhem.js server 
	 */

	// class Service: constructor function 
	function Service() {

		this._io = io;
		
		this._socket = null;
		this._bConnected = false;
		this._oHandler = {
				fnOnErrorFhemConnection: null,
				fnOnSuccessFhemConnection: null,
				fnOnDisconnect: null,
				oListener: null
		}
		this._subscriptions = [];
	}
	
	/*
	 * Connect to backend service
	 */
	Service.prototype.connect = function(args) {
		//TODO: check connection state
		
		this._oHandler.fnOnErrorFhemConnection = args.onErrorFhemConnection;
		this._oHandler.fnOnFhemDisconnect = args.onFhemDisconnect;
		this._oHandler.fnOnSuccessFhemConnection = args.onSuccessFhemConnection;
		this._oHandler.oListener = args.oListener;
			
		this._socket = this._io.connect('ws://' + args.host + ':' + args.port,
				{
	                timeout: 5000,
	                'sync disconnect on unload' : true
	            });
		
		// register own 'on error' handler
		this._socket.on('connect_error', (function(oService) {
			return function() { 
				oService._bConnected = false;
				// call back error function
				if (oService._oHandler.fnOnErrorFhemConnection) 
					oService._oHandler.fnOnErrorFhemConnection(oService._oHandler.oListener);
			}
		})(this));
		
		// register own 'on connect' handler
		this._socket.on('connect', (function(oService) {
			return function() {
				oService._bConnected = true;		
				
				//call callback to register handler for topics
				if (oService._oHandler.fnOnSuccessFhemConnection) 
					oService._oHandler.fnOnSuccessFhemConnection(oService._oHandler.oListener);
								
			}
		})(this));
		
		
		
		// register own 'on disconnect' handler
		this._socket.on('disconnect', (function(oService) {
			return function() { 
				oService._bConnected = false;
				if (oService._oHandler.fnOnDisconnect) 
					oService._oHandler.fnOnDisconnect(oService._oHandler.oListener);

			}
		})(this));
		
		
		Service.prototype.disconnect = function(args) {
			this._socket.disconnect();
			return this;
		};
		
		Service.prototype.registerEventHandler = function(sEvent, fnCallback, oListener) {
			this._socket.on(sEvent, fnCallback.bind(oListener));
			return this;
		};
		
		Service.prototype.sendEvent = function(sEvent, sData) {
			this._socket.emit(sEvent);
			return this;
		};
	}
	
			
	/**
	 * export public components
	 */
	this.Service = Service;
	this.PublishEvent = PublishEvent;
	this.SubscribeEvent = SubscribeEvent;
	
}())


/* =====================================================================
 * Data models 
 * ===================================================================== */
fhem.model = (function fhemModel() {

	"use strict"

	/**
	 * Receive device meta data from backend, store it in the model instance and
	 * inform model change listeners via OpenUI5 events.
	 * Called by fhem.core.Service ws connection handler.
	 */
	function _onMetaData(oData) {
		if (oData) {
			this.mFhemMetaData = oData; // { DeviceSet: [], RoomSet: [], DeviceTypeSet: [], DeviceTypeSet: [] };
			this.fireEvent("metaDataLoaded");
		}
	}

	function _onValueData(oData) {
		//TODO: evaluate Fhem data type
		if (oData) {
			
		}
	}
	
	function _onDeviceData(oData) {
		//TODO: evaluate Fhem data type
		if (oData) {
			
		}
	}

	/**
	 * Handle successful Fhem connection
	 * Retrieve Fhem metadata via web socket connection.
	 */
	function _onSuccessFhemConnection(oFhemBaseModel) {
		//TODO: evaluate Fhem data type

		// register WS event handler for Fhem metadata event
		oFhemBaseModel._fhemService.registerEventHandler(fhem.core.SubscribeEvent.getMetaData, _onMetaData, oFhemBaseModel);
		// retrieve meta data from Fhem backend (fire ws metadata event)
		oFhemBaseModel._fhemService.sendEvent(fhem.core.PublishEvent.getMetaData, null);
	}
	
	function _onErrorFhemConnection(oFhemBaseModel) {
		//TODO: evaluate Fhem data type
	}
	

	function _onFhemDisconnect(oFhemBaseModel) {
		oFhemBaseModel.fireEvent("connectionClosed");
		//TODO refresh internal data
	}

	
	//var Model = (new function FhemModel() {
	//TODO: describe mParameters
	/**
	 * 
	 */
	function Model(mParameters) {
		//TODO: use new class (type) for FHEM metadata
		
		this.mFhemMetaData = { 
				DeviceSet: [], 
				RoomSet: [], 
				DeviceTypeSet: [], 
				DeviceSubTypeSet: [] 
		};
		this.mEventRegistry = {};
		
		this._fhemService = new fhem.core.Service();
		
		// register client handler
		this.attachConnectionSuccess(null, mParameters.onConnection, null);
		this.attachMetaDataLoaded(null, mParameters.onMetaDataLoaded, null);
		this.attachConnectionFailed(null, mParameters.onConnectionFailed, null);
		this.attachConnectionClosed(null, mParameters.onDisconnected, null);
		
		
		// connect to Fhem
		this._fhemService.connect({ host: mParameters.host , port: mParameters.port,
									onErrorFhemConnection: _onErrorFhemConnection,
			                        onFhemDisconnect: _onFhemDisconnect,
			                        onSuccessFhemConnection: _onSuccessFhemConnection,
			                        oListener: this
		})
		
		//TODO: Test data: call this._onMetaData(oData) with imported mock data
	};
	
	
	Model.prototype.disconnect = function () {
		this._fhemService.disconnect(null);
	};
	
	Model.prototype.getMetaData = function () {
		return this.mFhemMetaData;
	};
	
	Model.prototype.getRoomSet = function () {
		return this.mFhemMetaData.RoomSet;
	};
	
	Model.prototype.getDeviceTypeSet = function () {
		return this.mFhemMetaData.DeviceTypeSet;
	};

	Model.prototype.getDeviceSubTypeSet = function () {
		return this.mFhemMetaData.DeviceTypeSet;
	};
	
	Model.prototype.getDeviceSet = function () {
		return this.mFhemMetaData.DeviceSet;
	};
	
	Model.prototype.sendCommand = function () {
		//TODO
	};

	Model.prototype.attachConnectionSuccess = function(oData, fnFunction, oListener) {
		this.attachEvent("connected", oData, fnFunction, oListener);
		return this;		
	};
	
	Model.prototype.attachMetaDataLoaded = function(oData, fnFunction, oListener) {
		this.attachEvent("metaDataLoaded", oData, fnFunction, oListener);
		return this;
	};

	Model.prototype.attachRequestCompleted = function(oData, fnFunction, oListener) {
		//TODO		
		return this;
	};
	
	Model.prototype.attachRequestFailed = function(oData, fnFunction, oListener) {
		//TODO
		return this;
	};
	
	Model.prototype.attachRequestSent = function(oData, fnFunction, oListener) {
		//TODO		
		return this;
	};

	Model.prototype.attachConnectionFailed = function(oData, fnFunction, oListener) {
		this.attachEvent("connectionError", oData, fnFunction, oListener);
		return this;				
	};

	Model.prototype.attachConnectionClosed = function(oData, fnFunction, oListener) {
		this.attachEvent("connectionClosed", oData, fnFunction, oListener);
		return this;						
	};
	
	
	/**
	 * Attaches an event handler to the event with the given identifier.
	 *
	 * @param {string}
	 *            sEventId The identifier of the event to listen for
	 * @param {object}
	 *            [oData] An object that will be passed to the handler along with the event object when the event is fired
	 * @param {function}
	 *            fnFunction The handler function to call when the event occurs. This function will be called in the context of the
	 *                       <code>oListener</code> instance (if present) or on the event provider instance. The event
	 *                       object ({@link sap.ui.base.Event}) is provided as first argument of the handler. Handlers must not change
	 *                       the content of the event. The second argument is the specified <code>oData</code> instance (if present).
	 * @param {object}
	 *            [oListener] The object that wants to be notified when the event occurs (<code>this</code> context within the
	 *                        handler function). If it is not specified, the handler function is called in the context of the event provider.
	 * @return {sap.ui.base.EventProvider} Returns <code>this</code> to allow method chaining
	 * @public
	 */
	Model.prototype.attachEvent = function(sEventId, oData, fnFunction, oListener) {
		var mEventRegistry = this.mEventRegistry;
		
		//TODO jQuery.sap.assert(typeof (sEventId) === "string" && sEventId, "EventProvider.attachEvent: sEventId must be a non-empty string");
		
		if (typeof (oData) === "function") {
		//one could also increase the check in the line above
		//if(typeof(oData) === "function" && oListener === undefined) {
			oListener = fnFunction;
			fnFunction = oData;
			oData = undefined;
		}

		//TODO jQuery.sap.assert(typeof (fnFunction) === "function", "EventProvider.attachEvent: fnFunction must be a function");
		//TODO jQuery.sap.assert(!oListener || typeof (oListener) === "object", "EventProvider.attachEvent: oListener must be empty or an object");

		var aEventListeners = mEventRegistry[sEventId];
		if ( !Array.isArray(aEventListeners) ) {
			aEventListeners = mEventRegistry[sEventId] = [];
		}

		aEventListeners.push({oListener:oListener, fFunction:fnFunction, oData: oData});

		// Inform interested parties about changed EventHandlers
		/*
		if ( mEventRegistry[EVENT__LISTENERS_CHANGED] ) {
			this.fireEvent(EVENT__LISTENERS_CHANGED, {EventId: sEventId, type: 'listenerAttached'});
		}
		*/
		
		return this;
	};
	
	/**
	 * Removes a previously attached event handler from the event with the given identifier.
	 *
	 * The passed parameters must match those used for registration with {@link #attachEvent} beforehand.
	 *
	 * @param {string}
	 *            sEventId The identifier of the event to detach from
	 * @param {function}
	 *            fnFunction The handler function to detach from the event
	 * @param {object}
	 *            [oListener] The object that wanted to be notified when the event occurred
	 * @return {sap.ui.base.EventProvider} Returns <code>this</code> to allow method chaining
	 * @public
	 */
	Model.prototype.detachEvent = function(sEventId, fnFunction, oListener) {
		var mEventRegistry = this.mEventRegistry;
		
		/*TODO
		jQuery.sap.assert(typeof (sEventId) === "string" && sEventId, "EventProvider.detachEvent: sEventId must be a non-empty string" );
		jQuery.sap.assert(typeof (fnFunction) === "function", "EventProvider.detachEvent: fnFunction must be a function");
		jQuery.sap.assert(!oListener || typeof (oListener) === "object", "EventProvider.detachEvent: oListener must be empty or an object");
		*/
		
		var aEventListeners = mEventRegistry[sEventId];
		if ( !Array.isArray(aEventListeners) ) {
			return this;
		}

		var bListenerDetached = false;

		//PERFOPT use array. remember length to not re-calculate over and over again
		for (var i = 0, iL = aEventListeners.length; i < iL; i++) {
			//PERFOPT check for identity instead of equality... avoid type conversion
			if (aEventListeners[i].fFunction === fnFunction && aEventListeners[i].oListener === oListener) {
				//delete aEventListeners[i];
				aEventListeners.splice(i,1);
				bListenerDetached = true;
				break;
			}
		}
		// If we just deleted the last registered EventHandler, remove the whole entry from our map.
		if (aEventListeners.length == 0) {
			delete mEventRegistry[sEventId];
		}
		
		return this;
	};
	
	
	/**
	 * Fires an {@link sap.ui.base.Event event} with the given settings and notifies all attached event handlers.
	 *
	 * @param {string}
	 *            sEventId The identifier of the event to fire
	 * @param {object}
	 *            [mParameters] The parameters which should be carried by the event
	 * @param {boolean}
	 *            [bAllowPreventDefault] Defines whether function <code>preventDefault</code> is supported on the fired event
	 * @param {boolean}
	 *            [bEnableEventBubbling] Defines whether event bubbling is enabled on the fired event. Set to <code>true</code> the event is also forwarded to the parent(s)
	 *                                   of the event provider ({@link #getEventingParent}) until the bubbling of the event is stopped or no parent is available anymore.
	 * @return {sap.ui.base.EventProvider|boolean} Returns <code>this</code> to allow method chaining. When <code>preventDefault</code> is supported on the fired event
	 *                                             the function returns <code>true</code> if the default action should be executed, <code>false</code> otherwise.
	 * @protected
	 */
	Model.prototype.fireEvent = function(sEventId, mParameters) {


		/* eslint-disable consistent-this */
		var oProvider = this,
			aEventListeners, oEvent, i, iL, oInfo;

		aEventListeners = oProvider.mEventRegistry[sEventId];

		if ( Array.isArray(aEventListeners) ) {
			// avoid issues with 'concurrent modification' (e.g. if an event listener unregisters itself).
			aEventListeners = aEventListeners.slice();
			oEvent = {
				sEventId: sEventId,
				mParameters: mParameters,
			};
			
			for (i = 0, iL = aEventListeners.length; i < iL; i++) {
				oInfo = aEventListeners[i];
				oInfo.fFunction.call(oInfo.oListener || oProvider, oEvent, oInfo.oData);
			}
		}

		return this;
	};

	/**
	 * Returns whether there are any registered event handlers for the event with the given identifier.
	 *
	 * @param {string} sEventId The identifier of the event
	 * @return {boolean} Whether there are any registered event handlers
	 * @protected
	 */
	Model.prototype.hasListeners = function(sEventId) {
		return !!this.mEventRegistry[sEventId];
	};	
	
	
	
	/**
	 * export public components
	 */
	return {
		Model: Model
	}
	
}())


