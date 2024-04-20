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
                    getWeeklyAnalysis().then(() => {
                        updateUserData();
                    })
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

const labels = [["甲烷排放量"], ["電力輸出"], ["便秘風險"], ["熱量"]];

let wkAnChart;

let chartConfig = {
    type: "radar",
    data: {
        labels: labels,
        datasets: [
            // this week
            {
                label: "本週",
                data: [0, 0, 0, 0],
                backgroundColor: "rgba(239, 211, 146, 0.6)",
            }, { // last week
                label: "上週",
                data: [0, 0, 0, 0],
                backgroundColor: "rgba(147, 155, 166, 0.6)",
            }
        ]
    },
    options: {
        plugins: {
            legend: {
                display: true, // 上方資料 label 隱藏
                position: 'bottom'
            },
        },
        scales: {
            r: {
                beginAtZero: true, // 從 0 度開始
                startAngle: -45, // 旋轉度數
                angleLines: {
                    display: true, // 對角線隱藏
                },
                grid: { // https://www.chartjs.org/docs/latest/axes/radial/linear.html#grid-line-configuration
                    display: true, // 隔線顯示
                    circular: true // 隔線以同心圓方式呈現
                },
                max: 10, // 最大數值
                min: 0, // 最小數值
                ticks: {
                    display: false, // 刻度顯示
                    stepSize: 1 // 隔線寬距
                },
                pointLabels: {
                    font: {
                        size: 16 // 指標字型大小
                    },
                }
            }
        },
        elements: {
            line: { // https://www.chartjs.org/docs/latest/configuration/elements.html#line-configuration
                borderWidth: 1,
                borderColor: "rgba(255, 255, 255, 1)",
            },
            point: {
                pointRadius: 4,
                pointBackgroundColor: [
                    "rgba(179, 135, 134, 1)",
                    "rgba(130, 177, 153, 1)",
                    "rgba(219, 187, 87, 1)",
                    "rgba(115, 50, 17, 1)",
                ],
                pointStyle: 'rect' // https://www.chartjs.org/docs/latest/configuration/elements.html#point-styles
            },
        },
    },
};

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
    wkAnChart = new Chart($("#wkAnChart"), chartConfig);
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

function getWeeklyAnalysis() {
    const currentDate = new Date();
    const today = currentDate.getDay(); // 今天是星期幾（星期日為 0，...，星期六為 6）
    const startOfLastWeek = new Date(currentDate);
    const endOfThisWeek = new Date(currentDate);

    // 計算上週日的日期
    startOfLastWeek.setDate(currentDate.getDate() - today - 6);

    // 計算這週六的日期
    endOfThisWeek.setDate(currentDate.getDate() - today + 6);

    return new Promise((resolve, reject) => {
        let userRef = db.collection("users").doc(currentUser.uid);
        let hisRef = userRef.collection("req_history");
        let lwData = [];
        let twData = [];
        
        if (currentUserData.isNewData) {
            $("#wkAnDes").text("飲食分析中...");
            $("#wkAnSug").text("飲食分析中...");
            // Get data in 2 weeks
            hisRef
                .where('timestamp', '>=', startOfLastWeek)
                .where('timestamp', '<=', endOfThisWeek)
                .get()
                .then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        const docData = doc.data();
                        const docTimestamp = docData.timestamp.toDate();
                        if (docTimestamp >= startOfLastWeek && docTimestamp <= endOfThisWeek) {
                            twData.push({
                                'food': docData.food,
                                'ingredient': docData.ingredient,
                            });
                        } else {
                            lwData.push({
                                'food': docData.food,
                                'ingredient': docData.ingredient,
                            });
                        }
                    });

                    $.post("https://p2p-wnkb.onrender.com/badge/ana", {
                    // $.post("/badge/ana", {
                        "weekDatas": {
                            "lastweek": lwData,
                            "thisweek": twData,
                        }
                    })
                        .done(function (data) {
                            let resData = JSON.parse(data.message.content.replace("```json", "").replace("```", ""));
                            userRef.set({
                                weekly_analysis: resData,
                                isNewData: false
                            }, { merge: true })
                                .then(() => {
                                    getUserData().then(() => {
                                        resolve();
                                    });
                                })
                                .catch((error) => {
                                    console.error("Error updating user data:", error);
                                });
                        })
                        .fail(function (xhr, status, error) {
                            console.log(error);
                            reject(error);
                        });

                }).catch((error) => {
                    console.log("Error getting document:", error);
                    reject(error);
                });
        } else {
            resolve();
        }

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
    $("#wkAnDes").text((currentUserData && currentUserData.weekly_analysis) ? currentUserData.weekly_analysis.des : "還沒有足夠資料可以分析呦，快去試試 AI 食光機吧！");
    $("#wkAnSug").text((currentUserData && currentUserData.weekly_analysis) ? currentUserData.weekly_analysis.sug : "還沒有足夠資料可以分析呦，快去試試 AI 食光機吧！");
    if (currentUserData && currentUserData.weekly_analysis) {
        // this week
        chartConfig.data.datasets[0].data =
            [currentUserData.weekly_analysis.tw_ana.methane,
            currentUserData.weekly_analysis.tw_ana.electricity,
            currentUserData.weekly_analysis.tw_ana.constipate,
            currentUserData.weekly_analysis.tw_ana.calorie];
        // this week
        chartConfig.data.datasets[1].data =
            [currentUserData.weekly_analysis.lw_ana.methane,
            currentUserData.weekly_analysis.lw_ana.electricity,
            currentUserData.weekly_analysis.lw_ana.constipate,
            currentUserData.weekly_analysis.lw_ana.calorie];
        wkAnChart.update();
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
        }, { merge: true }).then(() => {
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