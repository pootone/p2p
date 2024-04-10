const firebaseConfig = {
    apiKey: "AIzaSyBuGBwRToBzDRfahNTopteuS9fOmEg1so8",
    authDomain: "no2-2024.firebaseapp.com",
    projectId: "no2-2024",
    storageBucket: "no2-2024.appspot.com",
    messagingSenderId: "350892065045",
    appId: "1:350892065045:web:83e08ce22324bac4e8291c",
    measurementId: "G-N9JH7N740F"
};

const currentUrl = new URL(document.location);
let currentUser;
let currentUserData;

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
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

initApp = function (isnewachieve) {
    firebase.auth().onAuthStateChanged(
        function (user) {
            // User is signed in.
            if (user) {
                $("#loginModal").hide();
                currentUser = user;
                getUserData().then(() => {
                    updateUserData();
                    if (!isnewachieve && $.cookie("toSaveAchieve")) {
                        collectAchieve();
                    }
                });
                // updateUserData();
            } else {
                // User is signed out.
                if ($.cookie("skipLogin") != 'true' && !isnewachieve) {
                    $("#loginModal").show();
                }
                currentUser = null;
                currentUserData = null;
                updateUserData();
            }
        },
        function (error) {
            console.log(error);
        }
    );
}

$().ready(function () {
    $("#title").text("Personal Dashboard");
    // Check whether get new achieve
    initApp(isNewAchieve());
    // Initialize the FirebaseUI Widget using Firebase.
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    // The start method will wait until the DOM is loaded.
    ui.start("#firebaseui-auth-container", uiConfig);
    // if (!) {
    // }

    // Wake aicam page backend
    $.post("https://p2p-contest-backend.onrender.com/wake", {}, function (data, status) { });
    $("#login_skip").click(function () {
        $("#loginModal").hide();
        $.cookie('skipLogin', 'true', { expires: 7 });
    });

    $("#login_signout_btn").click(function () {
        firebase.auth().signOut()
            .then(function () {
                $.removeCookie("skipLogin");
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

// Check wether there's new achieve
function isNewAchieve() {
    const range = currentUrl.searchParams.get("range");
    const badge = currentUrl.searchParams.get("badge");

    // Visit exhibition
    if (range) {
        switch (range) {
            case "1": {
                adjustAchieveModalContent("二號探險家", "4-1.svg");
                $.cookie('toSaveAchieve', JSON.stringify({ badge_id: "4", badge_val: "1", electricity: "10" }), { expires: 7 });
                break;
            }
            case "2": {
                adjustAchieveModalContent("二號探險家", "4-2.svg");
                $.cookie('toSaveAchieve', JSON.stringify({ badge_id: "4", badge_val: "2", electricity: "20" }), { expires: 7 });
                break;
            }
            case "3": {
                adjustAchieveModalContent("二號探險家", "4-3.svg");
                $.cookie('toSaveAchieve', JSON.stringify({ badge_id: "4", badge_val: "3", electricity: "30" }), { expires: 7 });
                break;
            }
            case "4": {
                adjustAchieveModalContent("二號探險家", "4-4.svg");
                $.cookie('toSaveAchieve', JSON.stringify({ badge_id: "4", badge_val: "4", electricity: "40" }), { expires: 7 });
                break;
            }
        }
        showAchieveModal();
        return true;
    } else if (badge) {
        switch (badge) {
            case "1st":
                break;
        }
        return true;
    }
    return false;
}

function showAchieveModal() {
    $("#achieModal").modal('show');
}

function adjustAchieveModalContent(achieveName, achieveImg) {
    let nameLen = achieveName.length;
    if (7 < nameLen) {
        $("#achieTxtImg").attr("src", "../images/AI_Cam/achieText-3.svg")
    } else if (4 < nameLen) {
        $("#achieTxtImg").attr("src", "../images/AI_Cam/achieText-2.svg")
    } else {
        $("#achieTxtImg").attr("src", "../images/AI_Cam/achieText-1.svg")
    }
    $("#achieTextContent").text(achieveName);
    $("#achieImg").attr("src", `../images/AI_Cam/badge/${achieveImg}`);
}

function getUserData() {
    return new Promise((resolve, reject) => {
        let userRef = db.collection("users").doc(currentUser.uid);

        userRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                currentUserData = doc.data();
            } else {
                console.log("No user data yet");
            }
            resolve();
        }).catch((error) => {
            console.log("Error getting document:", error);
            reject(error);
        });
    })
}

function updateUserData() {
    $("#title").text(currentUser ? currentUser.displayName + "'s Dashboard" : "Personal Dashboard");
    $("#electricity").text(currentUserData ? currentUserData.electricity : "");
    // Go through all badge
    // Toggle badge icon display
    if (currentUserData && currentUserData.badge) {
        Object.entries(currentUserData.badge).forEach((obj) => {
            console.log($(`#badge${obj[0]}Modal`));
            // console.log($(`#badge${obj[0]}Modal`));
            $(`img[data-bs-target='#badge${obj[0]}Modal']`).attr("src", `../images/badge/badges/badge_icon/badge${obj[0]}.png`);
        })
    }
}

function collectAchieve() {
    if (currentUser) {
        var userRef = db.collection('users').doc(currentUser.uid);

        let toSaveData = JSON.parse($.cookie("toSaveAchieve"));

        // console.log(currentUserData.electricity + toSaveData.electricity);
        // console.log(currentUserData.electricity);
        // console.log(currentUserData);

        let currentElectricity = currentUserData && currentUserData.electricity ? parseInt(currentUserData.electricity) : 0;

        let currentBadge = currentUserData && currentUserData.badge ? currentUserData.badge : {};

        currentBadge[toSaveData.badge_id] = toSaveData.badge_val;

        userRef.set({
            electricity: currentElectricity + parseInt(toSaveData.electricity),
            badge: currentBadge
        }).then(() => {
            $("#achieModal").modal('hide');
            getUserData().then(() => {
                updateUserData();
                $.removeCookie('toSaveAchieve');
            });
        }).catch((error) => {
            console.error("Error updating user data:", error);
        });
    } else {
        $("#achieModal").modal('hide');
        $("#loginModal").show();
    }
}