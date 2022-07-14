'use strict';

window.addEventListener('load', function() {
    document.getElementById('formSubmit').onclick = function() {
        var email = document.getElementById('emailInput').value;
        var password = document.getElementById('passwordInput').value;

        if (email === 'admin@hotmail.co.uk' && password === 'password') { // admin user credentials
            firebase.auth().signInWithEmailAndPassword(email, password).then((userCredential) => {
                var user = userCredential.user;
            }).catch((error) => {
                alert(error.errorMessage);
            });
        }
        else {
            alert("Incorrect Admin Details");
        }
    }
})