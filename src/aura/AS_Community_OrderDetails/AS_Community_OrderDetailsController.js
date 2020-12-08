({
    handleNewCaseModal: function (component, event) {
        let orderNumber = component.get('v.OrderNumber');
        console.log('OrderNumber');
        console.log(orderNumber);
        component.set('v.showNewComplainModal', true);
    },

    onInit: function (component, event, helper) {

    },
    tableRowClicked: function(component, event, helper) {
        helper.tableRowClicked(component, event);
    },

    loadDetails: function (component, event, helper) {
        helper.loadOrders(component, event);
    },

    closeModal: function (component, event) {
        console.log('WCHODZI DO CLOSE MODAL');
        component.set('v.showNewComplainModal', false);
        console.log('WYCHODZI DO CLOSE MODAL');
    },
    createCase: function (component, event, helper) {
        console.log('WCHODZI DO CONTROLLERA');
        helper.createCase(component, event);
        component.set('v.showNewComplainModal', false);
    }
})