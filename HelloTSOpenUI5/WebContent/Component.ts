import UIComponent  from "sap/ui/core/UIComponent";
import Device       from "sap/ui/Device";
import models       from "ui5/test/helloTS/model/models";

@UI5("ui5/test/helloTS.Component")
export default class Component extends UIComponent
{
    public static metadata: any = {
        manifest : "json"
    };

    private _sContentDensityClass: string;

    /**
     * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
     * In this method, the device models are set and the router is initialized.
     * @public
     * @override
     */
    public init(): void {

        // set the device model
        this.setModel(models.createDeviceModel(), "device");

        // call the base component's init function and create the App view
        super.init();

        // create the views based on the url/hash
        this.getRouter().initialize();
    }


    /**
     * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
     * design mode class should be set, which influences the size appearance of some controls.
     * @public
     * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
     */
    public getContentDensityClass(): string {
        if (this._sContentDensityClass === undefined) {
            // check whether FLP has already set the content density class; do nothing in this case
            if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
                this._sContentDensityClass = "";
            } else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
                this._sContentDensityClass = "sapUiSizeCompact";
            } else {
                // "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
                this._sContentDensityClass = "sapUiSizeCozy";
            }
        }
        return this._sContentDensityClass;
    }

    /**
     * Convenience method for getting the model.
     * @public
     * @override
     * @returns the model of the component
     */
    public getModel<T extends sap.ui.model.Model>(sName?: string): T {
        return <T>super.getModel(sName);
    }
}