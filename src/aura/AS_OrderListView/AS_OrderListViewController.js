/**
 * Created by tomas on 04.12.2020.
 */
({

    onInit: function (component, event, helper) {
        helper.loadOrders(component,event);
    },

    tableRowClicked: function (component, event, helper) {
        helper.tableRowClicked(component,event);
    }
})