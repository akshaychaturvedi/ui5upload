sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, UIComponent) {
        "use strict";

        return Controller.extend("tbupload.controller.BaseController", {

            getModel: function (oModel) {
                return this.getView().getModel(oModel);
            },

            setModel: function (oModel, sName) {
                return this.getView().setModel(oModel, sName);
            },

            getPage: function () {
                return this.getView().byId("mainPage");
            },

            getBusyDialog: function () { 

                var oView = this.getView();
                if (!this.__dialog) {
                    // Create dialog via fragment factory
                    this.__dialog = sap.ui.xmlfragment(oView.getId(), "tbupload.fragment.BusyDialog");
                    oView.addDependent(this.__dialog);
                }
                return this.__dialog;
            }
        });
    })