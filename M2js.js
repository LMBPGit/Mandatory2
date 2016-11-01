/**
 * Created by Lucas on 27-10-2016.
 */
const user = 'LUCA0526'; //change to input window mb;
const key = '7cceee87aa251a526da7cbbf84341693';
const url = 'http://52.57.228.6/man2API/php/BankPhp.php';


$(document).ready(function () {
    //getAccountInfo();
    //seeOffers();
    //setInterval(getAccountInfo, 300000);
    //setInterval(seeOffers, 10000);
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

                    var row = document.getElementById("offers_Table").insertRow(i);
                    row.className = "text-right";
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);
                    var cell4 = row.insertCell(3);
                    var cell5 = row.insertCell(4);

                    cell1.innerHTML = dataString.data[i - 1].id;
                    cell2.innerHTML = parseFloat(dataString.data[i - 1].amount).toFixed(2); //sætter decimalantallet til 2
                    cell3.innerHTML = dataString.data[i - 1].currency;
                    cell4.innerHTML = dataString.data[i - 1].since;
                    cell5.innerHTML = dataString.data[i - 1].currency;

                }
            }
        }
    )
    ;
}

function getExhangeFromList(currency, i) {
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
            var amount = dataString.data.amount;
            $("#exchange_Cell_Row" + i).innerHTML = amount;
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