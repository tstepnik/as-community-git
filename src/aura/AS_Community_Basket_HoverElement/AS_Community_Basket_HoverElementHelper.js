({

    countSum: function (component, event) {
        let quantity = component.get('v.opportunityProduct').Quantity;
        let amount = component.get('v.opportunityProduct').ListPrice;

        let sum = quantity * amount;
        if (quantity <=1){
            this.hideUnitPrice(component);
        } else {
            this.showUnitPrice(component);
        }

        component.set('v.sumPrice',sum.toFixed(2));

    },

    hideUnitPrice: function (component) {
        let toggleText = component.find("p-priceInit");
        $A.util.toggleClass(toggleText, "hideElement");

    },

    showUnitPrice: function (component) {
        let toggleText = component.find("p-priceInit");
        $A.util.removeClass(toggleText, "hideElement");

    }
})