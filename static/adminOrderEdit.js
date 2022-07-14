'use strict';

window.addEventListener('load', function(){
    firebase.auth().onAuthStateChanged(function(user){
        document.getElementById('saveChanges').onclick = function() {
            /*
            Send a HTTP request to trigger the update_order Cloud Function
             */
            var status = document.getElementById('statusInput').value;
            var trackPoint = document.getElementById('trackPointInput').value;
            var estimatedDelivery = document.getElementById('estimatedDeliveryInput').value;
            var deliveryAddress = document.getElementById('deliveryAddressInput').value;
            var order_id = document.getElementById('orderIDText').innerText;

            if (status.length < 1 || trackPoint.length < 1 || estimatedDelivery.length < 1 || deliveryAddress.length < 1) {
                alert("Please fill all fields before saving changes");
            }

            else {
                var postBody = {
                    "order_id": order_id,
                    "status": status,
                    "track_point": trackPoint,
                    "estimated_delivery": estimatedDelivery,
                    "delivery_address": deliveryAddress
                };

                var xhr = new XMLHttpRequest();
                xhr.open("POST", '/admin/update', true); // asynchronous
                xhr.setRequestHeader('Content-Type', 'application/json'); // indicates body of post is JSON data
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) { // on successful request
                            alert("Order Updated!\nRefresh page to see changes");
                        }
                        
                    }
                }
                xhr.send(JSON.stringify(postBody)); // send request with body data
            }
        }
        document.getElementById('deleteOrder').onclick = function() {
            /*
            Send a HTTP request to the delete_order Cloud Function
             */
            var order_id = document.getElementById('orderIDText').innerText;

            var xhr = new XMLHttpRequest();
                xhr.open("DELETE", '/admin/delete?id=' + order_id, true); // asynchronous
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            alert("Order Deleted!\nRefresh page to see changes");
                        }
                    }
                }
                xhr.send();
        }
    });
});