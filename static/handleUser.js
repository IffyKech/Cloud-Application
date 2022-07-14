'use strict';

window.addEventListener('load', function() {
    // set sign out button
    document.getElementById('sign-out').onclick = function () {
        firebase.auth().signOut().then(() => {
            // Successful sign out
            window.location.assign('/login');
        });
    };

    firebase.auth().onAuthStateChanged((user) => { 
        document.getElementById('welcomeUser').innerText = `Welcome ${user.displayName}`;
    });
});
