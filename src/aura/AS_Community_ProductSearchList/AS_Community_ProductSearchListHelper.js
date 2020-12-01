({
    loadProducts: function (component) {
        let firstQueryInfo = this.getSessionStorage();
        let numberOfRecords = firstQueryInfo.numberOfProducts;
        let limit = firstQueryInfo.queryLimit;

        this.setRange(component, numberOfRecords, firstQueryInfo.offset, limit);
        this.setNumberOfPages(component, numberOfRecords, limit);
        this.setComponents(component);
        this.hidePreviousPage(component);
    },

    pressPreviousButton: function (component) {
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
            this.changeData(component, newOffset);
        }
    },

    pressNextButton: function (component) {
        let increseNumbers = false;
        let clickedNbValue = component.get('v.clickedNumber-value');
        let clickedNbAuraId = component.get('v.clickedNumber-auraId');
        const numberOfPages = component.get('v.numberOfPages');

        if (clickedNbValue <= numberOfPages) {
            let oldAIdNumber = clickedNbAuraId.substring(clickedNbAuraId.length - 1);
            let oldAIdText = clickedNbAuraId.slice(0, -1);
            let newNumber = parseInt(oldAIdNumber) + 1;

            let newAuraId = oldAIdText + newNumber;
            let offsetSize = component.get('v.offsetSize');
            if (clickedNbAuraId === 'pn-m5') {
                this.increaseButtons(component);
                increseNumbers = true;
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
            this.changeData(component, newOffset);

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
        this.changeData(component, newOffset);

        // component.set('v.clickedNumber-auraId', auraId);
        // component.set('v.clickedNumber-value', value);

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

    changeData: function (component, offset) {
        let firstQueryInfo = this.getSessionStorage();
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
                let errors = response.getError();
                let message,
                    title = 'Error';
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        message = errors[0].message
                        console.log(message);
                    }
                } else {
                    message = 'Unknow error';
                    console.log(message);
                }
            }
        });
        $A.enqueueAction(action);

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
        console.log('CLICKED NUMBER VALUE: ' + pageNumber );
        if (pageNumber <= 1) {
            console.log('WCHODZI');
            let toggleText = component.find("previousPage-id");
            this.hideElement(toggleText);
        }
    },

    showPreviousPage: function (component) {
        let toggleText = component.find("previousPage-id");
        this.showElement(toggleText);
    },

    hideNextPage: function (component) {
        let pageNumber = component.get('v.clickedNumber-value');
        let lastPage = component.get('v.numberOfPages');
        if (pageNumber >= lastPage) {
            let toggleText = component.find("nextPage-id");
            this.hideElement(toggleText);
            ;
        }
    },

    showNextPage: function (component) {
        let element = component.find("nextPage-id");
        this.showElement(element);
    },

    colorElement: function (component, auraId) {
        this.removeColorFromAll(component);
        let element = component.find(auraId);
        $A.util.toggleClass(element, "colorElement");
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
        if (newValue <= numberOfPages && newValue > 0) {
            component.set(getCmpName, newValue);
            this.showElement(element);
        } else {
            this.hideElement(element);
        }
    },

    showElement: function (element) {
        $A.util.removeClass(element, "hideElement");
        $A.util.toggleClass(element, "showElement");
    },

    hideElement: function (element) {
        $A.util.removeClass(element, "showElement");
        $A.util.toggleClass(element, "hideElement");
    },

    removeColorFromAll: function (component) {
        for (let i = 1; i < 6; i++) {
            let auraId = "pn-m" + i;
            let toggleText = component.find(auraId);
            $A.util.removeClass(toggleText, "colorElement");

        }
    },

    increaseButtons: function (component) {
        this.changeNumberButtons(component, 1, 'pn-m2', 4);

    },

    decreaseButtons: function (component) {
        this.changeNumberButtons(component, -1, 'pn-m4', -4);
    },

    changeNumberButtons: function (component, changeNumber, newNumberAuraId, newNumbersChangeAmount) {
        let clickedNbValue = component.get('v.clickedNumber-value');

        let newNumber = parseInt(clickedNbValue) + (changeNumber);

        component.set('v.clickedNumber-value', newNumber);
        component.set('v.clickedNumber-auraId', newNumberAuraId);

        this.setPageNumbers(component, (newNumbersChangeAmount));
        this.removeColorFromAll(component);
        this.colorElement(component, newNumberAuraId);

    },

    getSessionStorage: function () {
        let sessionKey = 'productWrappers';
        let sessionJson = sessionStorage.getItem(sessionKey);
        return JSON.parse(sessionJson);
    },

    setComponents: function (component) {
        let firstQueryInfo = this.getSessionStorage();
        let numberOfRecords = firstQueryInfo.numberOfProducts;
        let limit = firstQueryInfo.queryLimit;

        component.set('v.products', firstQueryInfo.wrappers);
        component.set('v.clickedNumber-value', 1);
        component.set('v.clickedNumber-auraId', 'pn-m1');
        component.set('v.offset', 0);
        component.set('v.recordsNumber', numberOfRecords);

        component.set('v.offsetSize', limit);
        component.set('v.pn_first', 1);
        component.set('v.pn_second', 2);
        component.set('v.pn_third', 3);
        component.set('v.pn_fourth', 4);
        component.set('v.pn_fifth', 5);
        this.setPageNumbers(component, 0);
        this.colorElement(component, 'pn-m1');
    },


})