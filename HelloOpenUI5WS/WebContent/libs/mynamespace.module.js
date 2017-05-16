/**
 * Template for a local module.
 * Use of a namespace object which exports multiple classes 
 */

var MyNamespace = MyNamespace || {};

/**
 * Module definition
 */
MyNamespace.Module = (new function namespace() {
	
	// define global private variables
	
	// define global private functions and classes
	
	/*
	 *  define classes
	 */

	// class Service: constructor function 
	function Service() {
		this.value = {};
	}
	
	Service.prototype.connect = function() {
		// add your code
	}
	
	// export public components
	this.Service = Service;
	
}())
