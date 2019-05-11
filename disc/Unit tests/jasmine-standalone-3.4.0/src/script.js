let getId = x => document.getElementById(x);
let addform = document.forms['add-item'];
let purchaseArr = [];
let dateArr = [];
let currencyArr = [];
let calcVal = 0;


changeDisplay = elem1 => {
    getId(elem1).style.display = "flex";
    getId('back-layout').style.display = "block";
}

Array.from(document.getElementsByClassName('exit')).forEach(item =>
    item.addEventListener('click', () => {
        exitDisplay('add-item');
        exitDisplay('all-items');
        exitDisplay('clear-items');
        exitDisplay('calculate-value');
        exitDisplay('total-calculation');
    })
)

exitDisplay = elem => {
    getId(elem).style.display = "none"
    getId('back-layout').style.display = "none"
}

function Purchase(date, value, currency, product) {
    purchaseArr.push({
        date,
        value,
        currency,
        product
    });
    remove('table-row', 'dataTable');
    sort();
    getDateArr();
    addItem();
    getCurrencyArr();
}

function adding() {
    let date = getId('purchase-date').value
    let value = getId('money-amount').value
    let currency = getId('currency').value.toUpperCase()
    let product = getId('product-name').value.toUpperCase()
    if (/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(date) && Math.sign(value) === 1 && product.trim() !== '') {
        let newPurchase = new Purchase(date, value, currency, product);
        exitDisplay('add-item');
        addform.reset();
    } else alert('Some fields on your form are invalid. Please check your information.')
}

function sort() {
    purchaseArr.sort(function (a, b) {
        let c = new Date(a.date);
        let d = new Date(b.date);
        return c - d;
    });
}

function remove(param1, param2) {
    Array.from(document.getElementsByClassName(param1)).forEach(item => getId(param2).removeChild(item));
}

function addItem() {
    purchaseArr.forEach((x) => {
        let row = document.createElement('tr');
        row.className = "table-row";
        getId('dataTable').appendChild(row);
        let column1 = document.createElement('td');
        column1.innerHTML = x.date;
        row.appendChild(column1);
        let column2 = document.createElement('td');
        column2.innerHTML = x.value;
        row.appendChild(column2);
        let column3 = document.createElement('td');
        column3.innerHTML = x.currency;
        row.appendChild(column3);
        let column4 = document.createElement('td');
        column4.innerHTML = x.product;
        row.appendChild(column4);
    })
}

function getDateArr() {
    dateArr = purchaseArr.map(elem => elem.date);
    dateArr = dateArr.filter((v, i) => dateArr.indexOf(v) === i);
    remove('date-option', 'clear-date');
    remove('rap-date-option', 'choose-year');
    addList(dateArr, 'date-option', 'clear-date');
    getYearArr();
}

function addList(arr, itemClass, parentId) {
    arr.forEach((x) => {
        let option = document.createElement('option');
        option.innerHTML = x;
        option.className = itemClass;
        getId(parentId).appendChild(option);
    })
}

function clearing() {
    purchaseArr = purchaseArr.filter(x => x.date !== getId('clear-date').value);
    dateArr = dateArr.filter(x => x !== getId('clear-date').value);
    remove('table-row', 'dataTable');
    remove('date-option', 'clear-date');
    remove('rap-date-option', 'choose-year');
    remove('currency-option', 'choose-currency');
    addItem();
    getYearArr();
    getCurrencyArr();
    addList(dateArr, 'date-option', 'clear-date');
    exitDisplay('clear-items');
}

function getYearArr() {
    yearArr = dateArr.map(x => x.slice(0, 4));
    yearArr = yearArr.filter((v, i) => yearArr.indexOf(v) === i);
    addList(yearArr, 'rap-date-option', 'choose-year');
}

function getCurrencyArr() {
    currencyArr = purchaseArr.map(elem => elem.currency);
    currencyArr = currencyArr.filter((v, i) => currencyArr.indexOf(v) === i);
    remove('currency-option', 'choose-currency');
    addList(currencyArr, 'currency-option', 'choose-currency');
}

function calculation() {
    calcVal = 0;
    let cYear = getId('choose-year').value;
    let cCurrency = getId('choose-currency').value
    getId('choose-year-calc').innerHTML = cYear;
    getId('choose-currency-show').innerHTML = cCurrency;
    if( cYear.trim() !== '' && cCurrency.trim() !== ''){
    changeDisplay('total-calculation');
    } else {
        alert('Choose options')
    }
    getData()
        .then(data => calcRes(data.rates))
        .catch(err => console.error(err))
}

function getData() {
    return new Promise(function (resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", 'http://data.fixer.io/api/latest?access_key=33f04853b75ec8b764ab9ff9a599af88', true);
        xhr.onload = function () {
            if (this.status == 200) {
                let result = JSON.parse(xhr.response)
                resolve(result)
            } else {
                reject(xhr.statusText);
            }
        }
        xhr.onerror = () => reject('Invalid information');
        xhr.send();
    })
}

function calcRes(data) {
    purchaseArr.forEach(x => {
        if (x.date.slice(0, 4) == getId('choose-year').value) {
            calcVal += x.value / data[x.currency]
        }
    })
    getId('choose-year-value').innerHTML = (data[getId('choose-currency').value] * calcVal).toFixed(2)
}   