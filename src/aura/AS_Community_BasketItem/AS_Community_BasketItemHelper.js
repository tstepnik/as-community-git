({

    setDetails: function (component, event, helper) {
        let numberOfProducts = component.get('v.opportunityProduct').Quantity;
        let price = component.get('v.opportunityProduct').ListPrice;
        let sum = price * numberOfProducts;
        component.set('v.numberOfUnits', numberOfProducts);
        component.set('v.productPrice', price);
        component.set('v.priceSum', sum.toFixed(2));
        if (numberOfProducts <= 1) {
            this.hideUnitPrice(component);
        }
    },

    increaseProductsNumber: function (component, event, helper) {
        let price = component.get('v.productPrice');
        let number = component.get('v.numberOfUnits');
        let cmpNumber = parseInt(number) + 1;
        let newPrice = price * cmpNumber;
        component.set('v.numberOfUnits', cmpNumber);
        component.set('v.priceSum', newPrice.toFixed(2));
        if (cmpNumber > 1) {
            this.showUnitPrice(component);
        } else {
            this.hideUnitPrice(component);
        }
        this.updateOpportunityItem(component, event, cmpNumber);
        this.fireEvent();
    },

    decreaseProductsNumber: function (component, event, helper) {
        let price = component.get('v.productPrice');
        let cmpNumber = component.get('v.numberOfUnits');
        if (cmpNumber > 1) {
            let cmpDecreasedNumber = cmpNumber - 1;
            let newPrice = price * cmpDecreasedNumber;
            component.set('v.numberOfUnits', cmpDecreasedNumber);
            component.set('v.priceSum', newPrice.toFixed(2));
        }
        if (cmpNumber === 2) {
            this.hideUnitPrice(component);
        }
        this.updateOpportunityItem(component, event, cmpNumber);
        this.fireEvent();
    },

    showUnitPrice: function (component) {
        let element = component.find('unitPrice');
        $A.util.removeClass(element, "hideElement");
        $A.util.toggleClass(element, "showElement");
    },

    hideUnitPrice: function (component) {
        let element = component.find('unitPrice');
        $A.util.removeClass(element, "showElement");
        $A.util.toggleClass(element, "hideElement");
    },

    changeNumber: function (component, event) {
        let input = component.get('v.numberOfUnits');
        if (input === 0 || input < 1) {
            input = 1;
        }
        let price = component.get('v.productPrice');
        let cmpNumber = input;
        let newPrice = price * cmpNumber;
        component.set('v.numberOfUnits', cmpNumber);
        component.set('v.priceSum', newPrice.toFixed(2));
        if (cmpNumber > 1) {
            this.showUnitPrice(component);
        } else {
            this.hideUnitPrice(component);
        }
        this.updateOpportunityItem(component, event, cmpNumber);
        this.fireEvent();
    },

    pressBasket: function (component, event) {
        let element = component.find('mainContainer');
        $A.util.toggleClass(element, "hideElement");
        this.fireEvent();

    },

    removeProductFromBasket: function (component, event, helper) {
        let productId = component.get('v.opportunityProduct.Product2Id');
        const action = component.get('c.removeItemFromOrder');
        action.setParams({productId: productId});
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "ERROR") {
                this.handleErrors(component, response);
            }
        });
        $A.enqueueAction(action);
    },

    updateOpportunityItem: function (component, event, newAmount) {
        let amount = component.get('v.numberOfUnits');
        let orderItem = component.get('v.opportunityProduct');
        orderItem.Quantity = amount;

        const action = component.get('c.updateOrderItem');
        action.setParams({orderItem: orderItem});
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "ERROR") {
                this.handleErrors(component, response);
            }
        });
        $A.enqueueAction(action);

    },

    fireEvent: function () {
        let event = $A.get('e.c:AS_Community_RequestSum_Event');
        event.fire();
    },

    handleErrors: function (component, response) {
        let sendErrorToast = component.find('errorToastMaker');
        let errors = response.getErrors();
        sendErrorToast.handleErrors('Error', 'Error while processing loading data', 'Error', errors);
    }


})