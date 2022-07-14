'use strict';

window.addEventListener('load', function(){
    firebase.auth().onAuthStateChanged(function(user){
        document.getElementById('formSubmit').onclick = function() {
            var order_number = document.getElementById('trackingInput').value;
            var postBody = {"order_number": order_number};
            
            // Start HTTP request
            var xhr = new XMLHttpRequest();
            xhr.open("POST", '/track', true); // asynchronous
            xhr.setRequestHeader('Content-Type', 'application/json'); // indicates body of post is JSON data
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var response = JSON.parse(xhr.responseText);
                        if (user.email === "admin@hotmail.co.uk") { // if current user is admin
                            window.location.assign('/admin/orders?id=' + response['order_id']);
                        }
                        else {
                            window.location.assign('/orders?id=' + response['order_id']);
                        }
                    }
                    if (xhr.status === 400) { // on a failed request
                        alert("Incorrect order number. Please try again");
                    }
                }
            }

            xhr.send(JSON.stringify(postBody));
        }
    });
});