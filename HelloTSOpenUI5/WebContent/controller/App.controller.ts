import Controller    from "sap/ui/core/mvc/Controller";
import MyUIComponent from "ui5/test/helloTS/Component";

@UI5("ui5.test.helloTS.controller.App")
export default class App extends Controller {
		
	/**
	 * Called when a controller is instantiated and its View controls (if
	 * available) are already created. Can be used to modify the View before
	 * it is displayed, to bind event handlers and do other one-time
	 * initialization.
	 * 
	 * @memberOf de.kjumybit.fhem.App 
	 */
	public onInit(): void {
		this.getView().addStyleClass((<MyUIComponent>this.getOwnerComponent()).getContentDensityClass());
	};
		
};
