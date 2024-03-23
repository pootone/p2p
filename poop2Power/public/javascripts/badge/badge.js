const firebaseConfig = {
    apiKey: "AIzaSyBuGBwRToBzDRfahNTopteuS9fOmEg1so8",
    authDomain: "no2-2024.firebaseapp.com",
    projectId: "no2-2024",
    storageBucket: "no2-2024.appspot.com",
    messagingSenderId: "350892065045",
    appId: "1:350892065045:web:83e08ce22324bac4e8291c",
    measurementId: "G-N9JH7N740F"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
// FirebaseUI config.
var uiConfig = {
    signInSuccessUrl: "./badge.html",
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        {
            provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            buttonColor: '#777E94',
            iconUrl: '../images/badge/loginModal/google_icon.svg'
        },
        {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            buttonColor: '#D1A4A4',
            iconUrl: '../images/badge/loginModal/mail_icon.svg'
        },
        {
            provider: firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID,
            buttonColor: '#C6B896',
            iconUrl: '../images/badge/loginModal/anom_icon.svg'
        }
    ],
    signInFlow: "popup",
};

initApp = function () {
    firebase.auth().onAuthStateChanged(
        function (user) {
            // User is signed in.
            if (user) {
                $("#loginModal").hide();
                $("#title").text(user.displayName + "'s Dashboard");
            } else {
                // User is signed out.
                $("#loginModal").show();
                $("#title").text("Personal Dashboard");
            }
        },
        function (error) {
            console.log(error);
        }
    );
}

$().ready(function () {
    initApp();
    // Initialize the FirebaseUI Widget using Firebase.
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    // The start method will wait until the DOM is loaded.
    ui.start("#firebaseui-auth-container", uiConfig);


    $("#login_skip").click(function () {
        $("#loginModal").hide();
    });

    $("#login_signout_btn").click(function() {
        firebase.auth().signOut()
        .then(function () {
            window.location = "../";
          });
    });
});

function showImage(buttonId) {
    console.log("Button ID: " + buttonId);

    var smallImage = document.getElementById(buttonId);
    smallImage.classList.remove('hidden');
    smallImage.classList.add('show');

    var button = document.getElementById('button-' + buttonId);
    button.disabled = true;
    // button.style.backgroundColor = '#ccc'; 


    smallImage.onclick = function () {
        smallImage.classList.add('hidden');
        button.disabled = false;
        button.style.backgroundColor = '';
    };
}

//aquarium layer2
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const randomTop = getRandomNumber(10, 70);
document.documentElement.style.setProperty('--random-top', `${randomTop}%`);
const randomLeft = getRandomNumber(10, 90);
document.documentElement.style.setProperty('--random-left', `${randomLeft}%`);


function scrollToSection(sectionId) {
    var targetElement = document.getElementById(sectionId);

    if (targetElement) {
        var elementRect = targetElement.getBoundingClientRect();
        var absoluteElementTop = elementRect.top + window.pageYOffset;
        var middleOfElement = absoluteElementTop - (window.innerHeight / 2);

        window.scrollTo({
            top: middleOfElement,
            behavior: "smooth"
        });
    }
}

function closeFloatingWindow() {
    // 在此處添加關閉浮動視窗的程式碼
    // 例如，您可以將浮動視窗的樣式設置為 display: none; 或透過其他方式關閉
    // 這僅是一個簡單的示例，實際實現可能取決於您的代碼結構和需求
    var floatingWindow = document.querySelector('.floating-window-container');
    if (floatingWindow) {
        floatingWindow.style.display = 'none';
    }
}

