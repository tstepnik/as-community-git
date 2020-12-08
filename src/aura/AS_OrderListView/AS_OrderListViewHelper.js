({
    loadOrders: function (component) {
        let orders;
        const action = component.get('c.getOrderWrappers');
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                orders = response.getReturnValue();
                component.set('v.orderWrappers', orders);
            } else if (state === "ERROR") {
                this.handleErrors(component, response);
            }
        });
        $A.enqueueAction(action);

    },

    handleErrors: function (component, response) {
        let sendErrorToast = component.find('errorToastMaker');
        let errors = response.getErrors();
        sendErrorToast.handleErrors('Error', 'Error while processing loading data', 'Error', errors);
    },

    tableRowClicked: function (component, event) {
        let wrappersList = component.get('v.orderWrappers');
        let index = event.currentTarget.dataset.index;
        let wrapper = wrappersList[index];
        let rows = component.find("row");

        $A.util.addClass(rows[index], "row-highlighted");
        let eventt = $A.get('e.c:AS_Community_OrderIdEvent');
        let id = wrapper.orderId;
        let orderNumber = wrapper.orderNumber;
        eventt.setParams({
            "recordId": id,
            "orderNumber": orderNumber
        });

        eventt.fire();
    }
})