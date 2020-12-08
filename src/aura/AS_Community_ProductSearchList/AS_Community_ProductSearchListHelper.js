({
    loadProducts: function (component) {
        this.setCmpFirstTime(component);
        let firstQueryInfo = this.getSessionObj();
        let numberOfRecords = firstQueryInfo.numberOfProducts;
        let limit = firstQueryInfo.queryLimit;
        let numberOfPages = component.get('v.numberOfPages');

        this.setRange(component, numberOfRecords, firstQueryInfo.offset, limit);
        this.setNumberOfPages(component, numberOfRecords, limit);
        this.setPageNumbers(component, 0);
        this.colorElement(component, 'pn-m1');
        this.hidePreviousPage(component);
        if (numberOfRecords <= 0) {
            this.hidePagination(component);
        } else if (numberOfPages === 1) {
            this.hideNextPage(component);
        }
    },

    pressPreviousButton: function (component, event) {
        let clickedNbValue = component.get('v.clickedNumber-value');
        let clickedNbAuraId = component.get('v.clickedNumber-auraId');

        if (clickedNbValue > 1) {
            let oldAIdNumber = clickedNbAuraId.substring(clickedNbAuraId.length - 1);
            let oldAIdText = clickedNbAuraId.slice(0, -1);
            let newNumber = parseInt(oldAIdNumber) - 1;
            let newAuraId = oldAIdText + newNumber;

            let offsetSize = component.get('v.offsetSize');
            if (clickedNbAuraId === 'pn-m1') {
                this.decreaseButtons(component);
                newAuraId = component.get('v.clickedNumber-auraId');
            } else {
                this.colorElement(component, newAuraId);
            }

            component.set('v.clickedNumber-value', clickedNbValue - 1);
            component.set('v.clickedNumber-auraId', newAuraId);

            this.showNextPage(component);
            if (1 >= (clickedNbValue - 1)) {

                this.hidePreviousPage(component);
                this.showNextPage(component);
            }

            let offset = component.get('v.offset');
            let newOffset = parseInt(offset) - parseInt(offsetSize);
            component.set('v.offset', newOffset);
            this.changeData(component, event, newOffset);

        }

    },

    pressNextButton: function (component, event) {
        let clickedNbValue = component.get('v.clickedNumber-value');
        let clickedNbAuraId = component.get('v.clickedNumber-auraId');
        const numberOfPages = component.get('v.numberOfPages');

        if (clickedNbValue <= numberOfPages) {
            let oldAIdNumber = clickedNbAuraId.substring(clickedNbAuraId.length - 1); //number
            let oldAIdText = clickedNbAuraId.slice(0, -1); //text
            let newNumber;
            if (parseInt(oldAIdNumber) >= 5) {
                newNumber = 1;
            } else {
                newNumber = parseInt(oldAIdNumber) + 1;
            }
            let newAuraId = oldAIdText + newNumber;
            let offsetSize = component.get('v.offsetSize');

            if (clickedNbAuraId === 'pn-m5') {

                this.increaseButtons(component);
                newAuraId = component.get('v.clickedNumber-auraId');
            } else {
                this.colorElement(component, newAuraId);
            }

            component.set('v.clickedNumber-value', parseInt(clickedNbValue) + 1);
            component.set('v.clickedNumber-auraId', newAuraId);

            this.showPreviousPage(component);
            if ((clickedNbValue + 1) >= numberOfPages) {
                this.hideNextPage(component);
                this.showPreviousPage(component);
            }

            let offset = component.get('v.offset');
            let newOffset = parseInt(offset) + parseInt(offsetSize);

            component.set('v.offset', newOffset);
            this.changeData(component, event, newOffset);

        }
    },

    choosePage: function (component, event) {
        const numberOfPages = component.get('v.numberOfPages');

        let id = event.target.id;
        let fields = id.split(' ');
        let value = fields[0];
        let auraId = fields[1];
        let element = component.find(auraId);
        component.set('v.clickedNumber-auraId', auraId);
        component.set('v.clickedNumber-value', value);
        this.removeColorFromAll(component);
        $A.util.toggleClass(element, "colorElement");

        let offsetSize = component.get('v.offsetSize');
        let newOffset = (offsetSize * value) - offsetSize;
        component.set('v.offset', newOffset);
        this.changeData(component, event, newOffset);

        if (value > 1) {
            this.showPreviousPage(component);
        } else {
            this.hidePreviousPage(component);
        }

        if (value < numberOfPages) {
            this.showNextPage(component);
        } else {
            this.hideNextPage(component);
        }

    },

    setNumberOfPages: function (component, numberOfRecords, limit) {
        let numberOfPages = Math.floor(numberOfRecords / limit);

        if (numberOfRecords % limit !== 0) {
            numberOfPages += 1;
        }
        component.set('v.numberOfPages', numberOfPages);
    },

    hidePreviousPage: function (component) {
        let pageNumber = component.get('v.clickedNumber-value');
        if (pageNumber <= 1) {
            this.changeClasses(component, "previousPage-id", "showElement", "hideElement");
        }
    },

    showPreviousPage: function (component) {
        this.changeClasses(component, "previousPage-id", "hideElement", "showElement");

    },

    hideNextPage: function (component) {
        let pageNumber = component.get('v.clickedNumber-value');
        let lastPage = component.get('v.numberOfPages');
        if (pageNumber >= lastPage) {
            this.changeClasses(component, "nextPage-id", "showElement", "hideElement");
        }
    },

    showNextPage: function (component) {
        this.changeClasses(component, "nextPage-id", "hideElement", "showElement");
    },

    changeData: function (component, event, offset) {
        let sessionKey = 'productWrappers';
        let sessionJson = sessionStorage.getItem(sessionKey);
        let firstQueryInfo = JSON.parse(sessionJson);
        let action = component.get("c.getNextPageOffset");
        action.setParams({
            inpTxt: firstQueryInfo.queryPhrase,
            offset: offset
        });

        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                let productsFromApex = response.getReturnValue();
                component.set("v.products", productsFromApex);
                let numberOfRecords = firstQueryInfo.numberOfProducts;
                this.setRange(component, numberOfRecords, offset, firstQueryInfo.queryLimit);

            } else if (state === "ERROR") {
                this.handleErrors(component, event, response);
            }
        });
        $A.enqueueAction(action);

    },

    setRange: function (component, numberOfRecords, offset, limit) {
        let rangeStart = offset + 1;
        component.set('v.recordsOnPage_start', rangeStart);
        let rangeEnd;
        if ((limit + offset) > numberOfRecords) {
            rangeEnd = numberOfRecords;
        } else {
            rangeEnd = limit + offset;
        }
        component.set('v.recordsOnPage_end', rangeEnd);

    },

    setPageNumbers: function (component, additionalValue) {
        this.setPageNumber(component, 'pn_first', 'pn-m1', additionalValue);
        this.setPageNumber(component, 'pn_second', 'pn-m2', additionalValue);
        this.setPageNumber(component, 'pn_third', 'pn-m3', additionalValue);
        this.setPageNumber(component, 'pn_fourth', 'pn-m4', additionalValue);
        this.setPageNumber(component, 'pn_fifth', 'pn-m5', additionalValue);
    },

    setPageNumber: function (component, cmpName, cmpAuraId, additionalValue) {
        let numberOfPages = component.get('v.numberOfPages');
        let getCmpName = 'v.' + cmpName;
        let cmpValue = component.get(getCmpName);
        let newValue = cmpValue + additionalValue;
        let element = component.find(cmpAuraId);
        component.set(getCmpName, newValue);
        if (newValue <= numberOfPages && newValue > 0) {
            $A.util.removeClass(element, "hideElement");
            $A.util.toggleClass(element, "showElement");
        } else {
            $A.util.removeClass(element, "showElement");
            $A.util.toggleClass(element, "hideElement");
        }
    },

    removeColorFromAll: function (component) {
        for (let i = 1; i < 6; i++) {
            let auraId = "pn-m" + i;
            let toggleText = component.find(auraId);
            $A.util.removeClass(toggleText, "colorElement");

        }
    },

    increaseButtons: function (component) {
        this.setButtons(component, 1, 'pn-m2', 4);

    },

    decreaseButtons: function (component) {
        this.setButtons(component, -1, 'pn-m4', -4);
    },

    setButtons: function (component, changeValue, auraId, changeNumbersValue) {
        let clickedNbValue = component.get('v.clickedNumber-value');
        let newNumber = parseInt(clickedNbValue) + (changeValue);
        component.set('v.clickedNumber-value', newNumber);
        component.set('v.clickedNumber-auraId', auraId);

        this.setPageNumbers(component, (changeNumbersValue));
        this.removeColorFromAll(component);
        this.colorElement(component, auraId);
    },

    hidePagination: function (component) {
        let pagination = component.find('pagination-div');
        $A.util.toggleClass(pagination, "hideElement");
    },

    getSessionObj: function () {
        let sessionKey = 'productWrappers';
        let sessionJson = sessionStorage.getItem(sessionKey);
        return JSON.parse(sessionJson);
    },

    setCmpFirstTime: function (component) {
        let firstQueryInfo = this.getSessionObj();
        component.set('v.products', firstQueryInfo.wrappers);
        component.set('v.clickedNumber-value', 1);
        component.set('v.clickedNumber-auraId', 'pn-m1');
        component.set('v.offset', 0);
        component.set('v.recordsNumber', firstQueryInfo.numberOfProducts);
        component.set('v.offsetSize', firstQueryInfo.queryLimit);
        component.set('v.pn_first', 1);
        component.set('v.pn_second', 2);
        component.set('v.pn_third', 3);
        component.set('v.pn_fourth', 4);
        component.set('v.pn_fifth', 5);
    },

    colorElement: function (component, auraId) {
        this.removeColorFromAll(component);
        let element = component.find(auraId);
        $A.util.toggleClass(element, "colorElement");
    },

    changeClasses: function (component, auraId, classToRemove, classToAdd) {
        let toggleText = component.find(auraId);
        $A.util.removeClass(toggleText, classToRemove);
        $A.util.toggleClass(toggleText, classToAdd);
    },

    handleShowToast: function (component, event, title, variant, message) {
        component.find('notification').showToast({
            "title": title,
            "variant": variant,
            "message": message
        });
    },

    handleErrors: function (component, event, response) {
        this.handleShowToast(component, event, 'Error', 'Error', 'Error while processing loading data');
        let errors = response.getError();
        if (errors) {
            if (errors[0] && errors[0].message) {
                console.log("Error message: " +
                    errors[0].message);
            }
        } else {
            console.log("Unknown error");
        }
    }

})