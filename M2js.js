/**
 * Created by Lucas on 27-10-2016.
 */
const user = 'LUCA0526'; //change to input window mb;
const key = '7cceee87aa251a526da7cbbf84341693';
const url = 'http://52.57.228.6/man2API/php/BankPhp.php';
var currencies = [{currencyName: "LUCA0526"}];
var tempArray = [];

$(document).ready(function () {
    getAccountInfo();
    seeOffers();
    setInterval(getAccountInfo, 300000);
    setInterval(seeOffers, 40000);
});

function setOffer() {
    $.ajax({
        'url': url,
        'type': 'GET',
        'data': {
            'apikey': key,
            'what': 'sell',
            'amount': $('#sell_amount').val()
        },
        dataType: 'json',
        'success': function (dataString) {
            setTimeout(seeOffers, 500);
            $('#sell_amount').text("");
        }
    });
}


function seeOffers() { //http://52.57.228.6/man2API/php/BankPhp.php?what=offers&apikey=7cceee87aa251a526da7cbbf84341693
    $.ajax({
            'url': url,
            'type': 'GET',
            'data': {
                'apikey': key,
                'what': 'offers'
            },
            dataType: 'json',
            'success': function (dataString) {
                var currentTable = document.getElementById("offers_Table");

                for (currentTable.rows.length - 1; currentTable.rows.length - 1 > 0;) {
                    currentTable.deleteRow(currentTable.rows.length - 1);
                }

                for (var i = 1; i <= dataString.data.length; i++) {
                    currencies.push({currencyName: dataString.data[i - 1].currency});

                    $("#offers_Table").append('<tr class="child" id="rownumber' + i + '">' +
                        '<td>' + dataString.data[i - 1].id + ' </td>' +
                        '<td>' + parseFloat(dataString.data[i - 1].amount).toFixed(2) + ' </td>' +
                        '<td>' + dataString.data[i - 1].currency + '</td>' +
                        '<td>' + dataString.data[i - 1].since + '</td>' +
                        '<td> 100.00 </td>' +
                        //'<td><button id="heybtn' + i + '"> hey </button></td>' +
                        '</tr>');

                    const currentID = dataString.data[i - 1].id;

                    $('#heybtn' + i).click(function () {
                        buySpecificOfferFromTable(currentID);
                    });
                }

                currencies = $.uniqueSort(currencies);
                tempArray = [];
                var checkList = [];

                $.each(currencies, function (index, value) {
                    const currentCurrency = value.currencyName;
                    var here = false;
                    $.each(checkList, function (checkindex, checkvalue) {
                        if (currentCurrency == checkvalue.currencyName) {
                            here = true;
                        }
                    });
                    if (!here) {
                        checkList.push({currencyName: currentCurrency});
                        getExhangeFromList(currentCurrency);
                    }
                });

                setTimeout(function () {
                    inputExchangeRate(tempArray);
                }, 300);
            }
        }
    );
}

function inputExchangeRate(tempArray) {
    $.each($('#offers_Table')[0].rows, function (index, value) {
        $.each(tempArray, function (tempindex, tempvalue) {
            if (value.cells[2].innerHTML == tempvalue.currencyName) {
                value.cells[4].innerHTML = parseFloat(tempvalue.currentAmount).toFixed(2);
            }
        });
    });
}

function getExhangeFromList(currency) {

    $.ajax({
        'url': url,
        'type': 'GET',
        'data': {
            'apikey': key,
            'what': 'exchange_rate',
            'from': currency,
            'to': user
        },
        dataType: 'json',
        'success': function (dataString) {
            const amount = dataString.data.amount;
            tempArray.push({
                currencyName: currency,
                currentAmount: amount
            });
        }
    });
}

function buySpecificOfferFromTable(offerID) {

    $.ajax({
        'url': url,
        'type': 'GET',
        'data': {
            'apikey': key,
            'what': 'buy',
            'offer': offerID
        },
        dataType: 'json',
        'success': function (dataString) {
            $('#buy_Success_Text').text("offer" + offerID + " has been bought");
            setTimeout(seeOffers, 500);

        }
    });
}

function buySpecificOffer() {
    $.ajax({
        'url': url,
        'type': 'GET',
        'data': {
            'apikey': key,
            'what': 'buy',
            'offer': $('#offer_Buy_ID').val()
        },
        dataType: 'json',
        'success': function (dataString) {
            $('#buy_Success_Text').text("offer" + $('#offer_Buy_ID').val() + " has been bought");
            setTimeout(seeOffers, 500)
        }
    });
}


function getExchangeRate() {
    $.ajax({
        'url': url,
        'type': 'GET',
        'data': {
            'apikey': key,
            'what': 'exchange_rate',
            'from': $('#target_User_Input').val(),
            'to': user
        },
        dataType: 'json',
        'success': function (dataString) {
            $('#exchange_Rate_Text').text(dataString.data.from + " --> " + dataString.data.to + " = " + dataString.data.amount);
        }
    });
}


function getAccountInfo() {
    $.ajax({
        'url': url,
        'type': 'GET',
        'data': {
            'apikey': key,
            'what': 'account_info'
        },
        dataType: 'json',
        'success': function (dataString) {
            var user = dataString.data[0];
            $('#current_Status').text("You currently have: " + user.amount + " of " + user.currency);
        }
    });
}