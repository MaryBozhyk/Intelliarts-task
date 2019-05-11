let a = {date: '2019-05-10', value: 20, currency: 'USD', purchase: 'shirt'};
let b = {date: '2018-08-15', value: 30, currency: 'EUR', purchase: 'dress'};

describe('Testing data from input', () => {

    it(' testing date', () =>{
        let date = a.date;
        expect(date).toMatch(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/);
    })

    it('testing value', () => {
        let value = a.value;
        expect(value).toBeGreaterThan(0)
    })

    it('testing currency', () => {
        let currency = a.currency;
        expect(currency).toEqual(jasmine.any(String))
    })

    it('testing name of product', () => {
        let product = a.purchase; 
        expect(product).toEqual(jasmine.any(String))
    })
})

describe('Testing area functions', ()=>{

    beforeEach(function() { 
       purchaseArr = [a, b];
       purchaseArr1 = [a, a, b];
    });  

    it ('sort items', () => {
        sorted = purchaseArr.sort(function (a, b) {
            let c = new Date(a.date);
            let d = new Date(b.date);
            return c - d;
        })
        sort = [b, a];
        expect(sorted).toEqual(sort);
    })

    it ('get date area', () => {
        dateArr = purchaseArr1.map(elem => elem.date);
        expectedDate = [a.date, a.date, b.date];
        expect(dateArr).toEqual(expectedDate);
        dateArr = dateArr.filter((v, i) => dateArr.indexOf(v) === i);
        filteredDate = [a.date, b.date];
        expect(dateArr).toEqual(filteredDate);
    })

    it('get currency area', () => {
        currencyArr = purchaseArr1.map(elem => elem.currency);
        expectedCurrency = [a.currency, a.currency, b.currency];
        expect(currencyArr).toEqual(expectedCurrency);
        currencyArr = currencyArr.filter((v, i) => currencyArr.indexOf(v) === i);
        filteredCurrency = ['USD', 'EUR'];
        expect(currencyArr).toEqual(filteredCurrency);
    })

    it ('get year area', () => {
        yearArr = [2019, 2019, 2018];
        yearArr = yearArr.filter((v, i) => yearArr.indexOf(v) === i);
        filteredYear = [2019, 2018];
        expect(yearArr).toEqual(filteredYear);
    })

    it('clear element from purchase area', () => {
        clearValue = a.date;
        purchaseArr = purchaseArr.filter(x => x.date !== clearValue);
        expectedArr = [b];
        expect(purchaseArr).toEqual(expectedArr);
    })

    it('clear element from date area', () => {
        dateArr = purchaseArr.map(elem => elem.date);
        clearValue = a.date;
        dateArr = dateArr.filter(x => x !== clearValue);
        expectedArr = [b.date];
        expect(dateArr).toEqual(expectedArr);
    })
})

describe('Testing calculation of total value', () => {

    it('get information from request', () => {
        exchangeRate = getData();
        expect(exchangeRate).toBeDefined();
    })

    it('calculate result', () => {
        calcVal = 0;
        data = {EUR: 1, PLN: 4.296802, UAH: 29.417987, USD: 1.123551};
        purchaseArr = [{date: 2019, value: 20, currency: 'USD', purchase: 'shirt'}, {date: 2018, value: 30, currency: 'EUR', purchase: 'dress'}];
        chooseYear = 2019;
        calculateResult = purchaseArr.forEach(x => {
            if (x.date == chooseYear) {
                calcVal += x.value / data[x.currency]
            }
        })
        expect(calcVal).toEqual(a.value/data.USD);
    })
      
})