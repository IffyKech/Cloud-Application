'use strict';

window.addEventListener('load', function(){
    firebase.auth().onAuthStateChanged(function(user){
        document.getElementById('formSubmit').onclick = function() {
            /*
            Send a HTTP request to the process_order Cloud Function (create a new order)
             */
            var userID = user.uid;
            var userAddress = document.getElementById('addressInput').value;
            var userPostcode = document.getElementById('postcodeInput').value;
            var productID = document.getElementById('productIdText').innerText;
            var productPrice = document.getElementById('productPriceText').innerText;
            var productName = document.getElementById('productName').innerText;
            var productSrc = document.getElementById('productImage').src;
            var postBody = {
                "id": userID,
                "address": userAddress,
                "postcode": userPostcode,
                "product_id": productID,
                "product_price": productPrice,
                "product_name": productName,
                "product_src": productSrc
            };

            // Start HTTP request
            var xhr = new XMLHttpRequest();
            xhr.open("POST", '/order', true); // asynchronous
            xhr.setRequestHeader('Content-Type', 'application/json'); // indicates body of post is JSON data
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        window.location.assign('/orders');
                    }
                    if (xhr.status === 500) {
                        window.location.assign('/orders');
                    }
                }
            }

            xhr.send(JSON.stringify(postBody));
        }
    });
});