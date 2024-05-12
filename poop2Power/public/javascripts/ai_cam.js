const firebaseConfig = {
    apiKey: "AIzaSyBuGBwRToBzDRfahNTopteuS9fOmEg1so8",
    authDomain: "no2-2024.firebaseapp.com",
    projectId: "no2-2024",
    storageBucket: "no2-2024.appspot.com",
    messagingSenderId: "350892065045",
    appId: "1:350892065045:web:83e08ce22324bac4e8291c",
    measurementId: "G-N9JH7N740F"
};

let currentUser;
let currentUserData;
let currentBadgeName;

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
// FirebaseUI config.
var uiConfig = {
    signInSuccessUrl: "./aicam.html",
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
                // $("#loginModal").hide();
                currentUser = user;
                getUserData().then(() => {
                    // updateUserData();
                    if ($.cookie("toSaveAchieve") || $.cookie("toSaveElectricity")) {
                        collectAchieve();
                    }
                });
                // console.log(currentUser.uid);
            } else {
                // User is signed out.
                // if ($.cookie("skipLogin") != 'true') {
                //     $("#loginModal").show();
                // }
                $("#guide-dialog-login").show();
                currentUser = null;
            }
        },
        function (error) {
            console.log(error);
        }
    );
}

let API = "https://p2p-wnkb.onrender.com/aicam/gpt/img";
// let API = "/aicam/gpt/img"; //TODO
let API_txt = "https://p2p-wnkb.onrender.com/aicam/gpt/txt";
// let API_txt = "/aicam/gpt/txt"; //TODO
let uploadImg = null;
let responseData = null;
let isCloseAwardModal = true;

let dialogObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
            setTimeout(function () {
                scrollToBottom();
            }, 200);
        }
    })
});

const labels = [["熱量", 0], ["便秘風險", 0], ["電力輸出", 0], ["甲烷排放量", 0]];

let chartMoreRadar;

let chartConfig = {
    type: "radar",
    data: {
        labels: labels,
        datasets: [
            {
                label: "",
                data: []
            }
        ]
    },
    options: {
        plugins: {
            legend: {
                display: false, // 上方資料 label 隱藏
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
                backgroundColor: "rgba(239, 211, 146, 0.6)",
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
    $.post("https://p2p-wnkb.onrender.com/wake", {}, function (data, status) { });

    initApp();
    // Initialize the FirebaseUI Widget using Firebase.
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    // The start method will wait until the DOM is loaded.
    ui.start("#firebaseui-auth-container", uiConfig);

    // Auto scroll to bottom, when append content to the container
    var dialogContainer = document.getElementById('dialog-container');
    dialogObserver.observe(dialogContainer, { childList: true });

    $("#guide-dialog-1").hide();
    $("#guide-dialog-login").hide();

    setTimeout(function () {
        $("#guide-dialog-1").show();
    }, 2000);

    // appendLoader(); //TODO
    // appendChart(1, 2, 3, 4, "說明範例", 6, 7, 8);//TODO
    // $("#chartMoreModal").modal('show');//TODO
    // appendImgCheck("test"); //TODO
    // appendAskMsg("測試");
    // appendGetReq("漢堡"); //TODO
    // appendAwardCongratulation(); //TODO
    // appendAwardMore(); //TODO
    // showAchieveModal();
    // adjustAchieveModalContent([{
    //     badge_id: "1",
    //     badge_val: "y",
    //     badge_name: "吃來乍到",
    //     electricity: 10
    // }, {
    //     badge_id: "2",
    //     badge_val: {"Grains": "Grains", "OilsFatsNutsAndSeeds": "OilsFatsNutsAndSeeds"},
    //     badge_name: "小吃貨",
    //     electricity: 10
    // }]);

    // Preview the image when image input change
    $("#imgFileInput").on("change", function (event) {
        // 抓取上傳的檔案
        const selectedFile = event.target.files[0];

        // 使用 FileReader 讀取文件內容
        const reader = new FileReader();

        reader.onload = function (file) {
            // 將文件內容轉換為 Base 64 格式
            uploadImg = file.target.result;

            let row = document.createElement("div");
            row.classList.add("row", "justify-content-end", "mb-2");

            let container = document.createElement("div");
            container.classList.add("col-6", "col-md-3", "d-flex",
                "justify-content-center", "align-items-center", "position-relative");

            let bg = document.createElement("img");
            bg.classList.add("w-100");
            bg.setAttribute("src", "../images/AI_Cam/ask-img-bg-1.svg");

            //- Image preview
            let imgPre = document.createElement("img");
            imgPre.classList.add("position-absolute", "object-fit-cover", "border-0");
            imgPre.setAttribute("style", "width: 68%; height: 68%; top: 14%; left: 12%; border-radius: 18px")
            imgPre.setAttribute("src", uploadImg);

            container.appendChild(bg);
            container.appendChild(imgPre);
            row.appendChild(container);
            // Append upload img to the dialog
            $("#dialog-container").append(row);
        }

        // 讀取文件內容
        reader.readAsDataURL(selectedFile);
    })

    if (isPortrait()) {
        // Update id to btn
        $("#upload").attr("for", "imgFileInput");
    } else {
        $("#upload").on("click", function () {
            $("#uploadGroup:visible").animate({
                opacity: '0'
            }, 250, function () {
                $(this).hide();
            })

            $("#uploadGroup:hidden").css("display", "flex").animate({
                opacity: '1'
            }, 250)
        })
    }


    $("#submit").on("click", function () {
        let payload = {
            img: uploadImg,
            description: $("#descTxt").val() || ''
        }
        uploadImg = null;
        $("#descTxt").val('');
        console.log(payload);

        if (payload.img || payload.description) {
            // 若有圖片，則送出圖文至 gpt-4-vision-preview

            // Remove last chart's id
            $("#myChart").removeAttr("id");
            if (payload.img) {
                appendLoader();

                $.post(API, payload)
                    .done(function (data) {
                        $("#loader").remove();

                        try {
                            responseData = JSON.parse(data.message.content.replace("```json", "").replace("```", ""));
                            console.log("Get response success!");
                            console.log("Res data: ", data);
                            uploadImg = null;

                            responseData.food = payload.description == "" ? responseData.food : payload.description;
                            appendImgCheck(responseData.food);
                        } catch (e) {
                            $("#loader").remove();
                            appendRetryMsg();
                            console.log(e);
                        }
                    })
                    .fail(function (xhr, status, error) {
                        $("#loader").remove();
                        appendRetryMsg();
                        console.log(error);
                    });
            }
            // 若只有文字則送 gpt-3.5-turbo
            else {
                appendAskMsg(payload.description);
                appendGetReq(payload.description);
                appendLoader();

                $.post(API_txt, { description: payload.description }, function (data, status) {
                    $("#loader").remove();

                    try {
                        responseData = JSON.parse(data.message.content.replace("```json", "").replace("```", ""));
                        console.log("Get response success!");
                        console.log("Res data: ", data);
                        console.log("Res data: ", responseData);

                        appendChart(responseData.result.calorie.calorie_value,
                            responseData.result.constipate,
                            responseData.result.electricity.electricity_level,
                            responseData.result.methane.methane,
                            responseData.result.suggest,
                            responseData.result.methane.car_distance,
                            responseData.result.electricity.phone_battery,
                            responseData.result.calorie.run_distance,
                            );

                        $("#modalTitle").text("您消耗的" + payload.description + "......");

                        // Show Achievement Model
                        if (currentUser) {
                            getUserData().then(() => {
                                achieCheck();
                                collectElectricity();
                                saveResult();
                            });
                        } else {
                            achieCheck();
                        }
                        // setTimeout(function () {
                        //     isCloseAwardModal = false;
                        //     showAchieveModal()
                        // }, 1500);
                    } catch (e) {
                        $("#loader").remove();
                        appendRetryMsg();
                        console.log(e);
                    }
                })
                    .fail(function (xhr, status, error) {
                        $("#loader").remove();
                        appendRetryMsg();
                        console.log(error);
                    });
            }
        }
    })

    $("#login_signout_btn").click(function () {
        firebase.auth().signOut()
            .then(function () {
                $.removeCookie("skipLogin");
            });
    });
})

function scrollToBottom() {
    let scrollableDiv = $("#dialog-container");
    scrollableDiv.scrollTop(scrollableDiv[0].scrollHeight);
}

function showAchieveModal() {
    $("#achieModal").modal('show');
}

function adjustAchieveModalContent(getBadges) {
    let i = 0;
    $("#achieModalBadgesContainer").empty();
    getBadges.forEach(function(badge) {
        let nameLen = badge.badge_name.length;
        let achieTxtImgSrc;
        if (7 < nameLen) {
            achieTxtImgSrc = "../images/AI_Cam/achieText-3.svg";
        } else if (4 < nameLen) {
            achieTxtImgSrc = "../images/AI_Cam/achieText-2.svg";
        } else {
            achieTxtImgSrc = "../images/AI_Cam/achieText-1.svg";
        }
        // electricity: 10 TODO
        $("#achieModalBadgesContainer").append(
        `<div class="carousel-item ${(i==0)?"active":""}">
        <div class="d-flex flex-column align-items-center">
          <div id="achieText">
            <div
              class="position-relative d-flex justify-content-center align-items-center"
            >
              <img
                id="achieTxtImg"
                src=${achieTxtImgSrc}
                style="filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))"
              />
              <p
                id="achieTextContent"
                class="position-absolute fw-bold"
                style="color: #7c2d01; font-size: 25px; margin: 0px"
              >
                ${badge.badge_name}
              </p>
            </div>
          </div>
          <img
            id="achieImg"
            style="width: 20%; top: 37%"
            src="../images/AI_Cam/badge/${badge.badge_id}.gif"
          />
        </div>
      </div>`);
      i++;
    });
}

function appendChart(calorie, constipate, electricity, methane, suggest = "", 
car_distance = 0, phone_battery = 0, run_distance = 0) {
    chartConfig.data.datasets[0].data =
        [calorie,
            constipate,
            electricity, 
            methane
            ];
    chartConfig.data.labels[0][1] = calorie;
    chartConfig.data.labels[1][1] = constipate;
    chartConfig.data.labels[2][1] = electricity;
    chartConfig.data.labels[3][1] = methane;

    console.log("data.datasets: ", chartConfig.data.datasets[0].data);

    // Create a chart
    let row = document.createElement("div")
    row.classList.add("row", "d-flex", "mb-2", "px-sm-5", "custom-justify-content-center");

    let container = document.createElement("div");
    container.classList.add("col-11", "col-md-7", "col-lg-4");

    let canvasContainer = document.createElement("div");
    canvasContainer.classList.add("w-100");
    canvasContainer.id = "chartProp";

    let canvas = document.createElement("canvas");
    canvas.id = "myChart";
    canvasContainer.appendChild(canvas);
    container.appendChild(canvasContainer);

    let btnContainer = document.createElement("div");
    btnContainer.classList.add("d-flex", "align-items-bottom", "position-relative", "custom-chart-more-btn");
    btnContainer.setAttribute("style", "width: 10%; padding: 0%;")

    // more
    let btn = document.createElement("button");
    btn.classList.add("bg-transparent", "border-0", "position-absolute");
    btn.setAttribute("style", "height: 10%; top: 75%;");
    btn.setAttribute("data-bs-toggle", "modal");
    btn.setAttribute("data-bs-target", "#chartMoreModal");

    let img = document.createElement("img");
    img.classList.add("w-100");
    img.setAttribute("src", "../images/AI_Cam/more.svg");
    img.setAttribute("style", "filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));")
    btn.appendChild(img);
    btnContainer.appendChild(btn);

    row.appendChild(container);
    row.appendChild(btnContainer);

    /// more popWin
    // Add suggest txt
    $("#aiSug").text(suggest);
    // level txt
    $("#methaneSp").text("等級" + methane);
    $("#electricitySp").text("等級" + electricity);
    $("#constipateSp").text("等級" + constipate);
    $("#calorieSp").text("等級" + calorie);

    $("#car_distance").text(car_distance+"km");
    $("#phone_battery").text(phone_battery+"min");
    $("#run_distance").text(run_distance+"km");

    // Add chart to the dialog block
    $("#dialog-container").append(row);
    new Chart($("#myChart"), chartConfig);

    if (chartMoreRadar) {
        chartMoreRadar.destroy();
    }
    chartMoreRadar = new Chart($("#chartMoreRadar"), chartConfig);
}

function appendAskMsg(inputMsg) {
    let row = document.createElement("div")
    row.classList.add("row", "d-flex", "justify-content-end", "m-2");

    let container = document.createElement("div");
    container.classList.add("col-6", "col-md-3", "position-relative", "d-flex",
        "justify-content-center", "align-items-center");
    container.setAttribute("style", "height: 100px");

    let bg = document.createElement("img");
    bg.classList.add("w-100", "position-absolute");
    bg.setAttribute("src", "../images/AI_Cam/ask-txt-bg-1.svg");


    //- msg
    let msg = document.createElement("p");
    msg.innerHTML = inputMsg;
    msg.classList.add("position-absolute", "fs-5");
    msg.setAttribute("style", "top: 35%;")

    container.appendChild(bg);
    if (!isMobileDevice()) {
        let decorate = document.createElement("img");

        decorate.setAttribute("src", "../images/AI_Cam/ask-txt-deco.png");
        decorate.setAttribute("style", "position: absolute; left: 65%; top: -20%;")
        container.appendChild(decorate);
    }
    container.appendChild(msg);
    row.appendChild(container);

    // Add msg to the dialog block
    $("#dialog-container").append(row);
}

function appendImgCheck(food) {
    // Check dialog
    let bg = document.createElement("img");
    bg.classList.add("w-100");
    bg.setAttribute("src", "../images/AI_Cam/imgCheck.svg");

    let txt = document.createElement("p");
    txt.classList.add("position-absolute", "w-75", "fs-5", "my-auto");
    txt.setAttribute("style", "left: 25%");
    txt.innerHTML = "請問您吃的是" + food + "嗎？";

    let container = document.createElement("div");
    container.classList.add("col-sm-12", "col-lg-4", "px-md-5",
        "d-flex", "justify-content-center", "align-items-center", "position-relative");

    container.appendChild(bg);
    container.appendChild(txt);

    let row = document.createElement("div");
    row.classList.add("row", "w-100", "mb-2");

    row.appendChild(container);

    $("#dialog-container").append(row);

    // Buttons
    container = document.createElement("div");
    container.classList.add("col-sm-12", "col-lg-4", "px-md-5",
        "d-flex", "justify-content-end", "position-relative");

    // Yes
    let btn = document.createElement("button");
    btn.setAttribute("type", "button");
    btn.classList.add("bg-transparent", "border-0", "position-relative", "imgYes", "p-0", "m-1");
    btn.setAttribute("id", "imgYes");
    btn.onclick = function () { imgResCorrect() };

    bg = document.createElement("img");
    bg.classList.add("imgCheckBtn");
    txt = document.createElement("p");
    txt.classList.add("position-absolute");
    txt.style = "top: 22%; left: 39%";
    txt.innerHTML = "是";

    btn.appendChild(bg);
    btn.appendChild(txt);
    container.appendChild(btn);

    // No
    btn = document.createElement("button");
    btn.setAttribute("type", "button");
    btn.classList.add("bg-transparent", "border-0", "position-relative", "imgNo", "p-0", "m-1");
    btn.setAttribute("id", "imgNo");
    btn.onclick = function () {
        $("#imgNo").removeClass("imgNo");
        $("#imgYes").removeClass("imgYes");
        $("#imgYes img:nth-child(1)").attr("src", "../images/AI_Cam/no.svg");
        $("#imgNo img:nth-child(1)").attr("src", "../images/AI_Cam/yes.svg");
        $("#imgNo").prop("disabled", true);
        $("#imgYes").prop("disabled", true);
        $("#imgNo").removeAttr("id");
        appendRetryMsg();
    };

    bg = document.createElement("img");
    bg.classList.add("imgCheckBtn");
    txt = document.createElement("p");
    txt.classList.add("position-absolute");
    txt.style = "top: 22%; left: 39%";
    txt.innerHTML = "否";

    btn.appendChild(bg);
    btn.appendChild(txt);
    container.appendChild(btn);

    row = document.createElement("div");
    row.classList.add("row", "w-100", "mb-2");

    row.appendChild(container);

    $("#dialog-container").append(row);
}

function imgResCorrect() {
    $("#imgNo").removeClass("imgNo");
    $("#imgYes").removeClass("imgYes");
    $("#imgYes img:nth-child(1)").attr("src", "../images/AI_Cam/yes.svg");
    $("#imgNo img:nth-child(1)").attr("src", "../images/AI_Cam/no.svg");
    $("#imgNo").prop("disabled", true);
    $("#imgYes").prop("disabled", true);
    $("#imgYes").removeAttr("id");

    appendGetReq(responseData.food);
    appendChart(responseData.result.calorie.calorie_value,
        responseData.result.constipate,
        responseData.result.electricity.electricity_level,
        responseData.result.methane.methane,
        responseData.result.suggest,
        responseData.result.methane.car_distance,
        responseData.result.electricity.phone_battery,
        responseData.result.calorie.run_distance,
        );

    $("#modalTitle").text("您消耗的" + responseData.food + "......");

    // Show Achievement Model
    if (currentUser) {
        getUserData().then(() => {
            achieCheck();
            collectElectricity();
            saveResult();
        });
    } else {
        achieCheck();
    }
    // setTimeout(function () {
    //     isCloseAwardModal = false;
    //     showAchieveModal();
    // }, 1500);
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

function achieCheck() {
    // Get the badge
    let currentBadge = currentUserData && currentUserData.badge ? currentUserData.badge : {};
    let getBadges = [];
    let getValues = [];

    let payload = {
        food: responseData.food,
        ingredient: responseData.ingredient
    }
    $.post("https://p2p-wnkb.onrender.com/aicam/achie", )
    // $.post("/aicam/achie", payload) //TODO
        .done(function (data) {
            try {
                badgeResult = JSON.parse(data.message.content.replace("```json", "").replace("```", ""));
                console.log(badgeResult);

                /// Log in ///
                if(currentUser) {
                    // 1 First try
                    if(!("1" in currentBadge)) {
                        getBadges.push({
                            badge_id: "1",
                            badge_val: "y",
                            badge_name: "吃來乍到",
                            electricity: 10
                        });
                    }
                    // 2 Half category
                    if((!("2" in currentBadge) || Object.keys(currentBadge["2"]).length < 3) && 
                    (badgeResult["SixCategoriesofFood"]["Grains"]!="none"||
                    badgeResult["SixCategoriesofFood"]["OilsFatsNutsAndSeeds"]!="none"||
                    badgeResult["SixCategoriesofFood"]["LegumesFishEggsMeatAndTheirProducts"]!="none"||
                    badgeResult["SixCategoriesofFood"]["DairyProducts"]!="none"||
                    badgeResult["SixCategoriesofFood"]["Vegetables"]!="none"||
                    badgeResult["SixCategoriesofFood"]["Fruits"]!="none")) {
                        let toSave = {};
                        for(let key in badgeResult["SixCategoriesofFood"]) {
                            if(badgeResult["SixCategoriesofFood"][key] != "none") {
                                toSave[key] = badgeResult["SixCategoriesofFood"][key];
                            }
                        }

                        if(!currentBadge["2"]){
                            currentBadge["2"] = {};
                        }
                        Object.assign(currentBadge["2"], toSave);

                        if(Object.keys(currentBadge["2"]).length >= 3) {
                            getBadges.push({
                                badge_id: "2",
                                badge_val:  currentBadge["2"],
                                badge_name: "小吃貨",
                                electricity: 10
                            });
                        } else {
                            getValues.push({
                                badge_id: "2",
                                badge_val: currentBadge["2"]
                            });
                        }
                    }

                    // 6 Healthy Staple Foods
                    // if(!("6" in currentBadge) && badgeResult["Healthy Staple Foods"] == "6") {
                    //     getBadges.push({
                    //         badge_id: "6",
                    //         badge_val: "y",
                    //         badge_name: "健康主食",
                    //         electricity: 10
                    //     });
                    // }
                    
                    // 7 NaturalSugars
                    // if(!("7" in currentBadge) && badgeResult["NaturalSugars"] == "7") {
                    //     getBadges.push({
                    //         badge_id: "7",
                    //         badge_val: "y",
                    //         badge_name: "天然能量甜點",
                    //         electricity: 10
                    //     });
                    // }
                    // 8 Vegan
                    // if(!("8" in currentBadge) && badgeResult["Vegan"] == "8") {
                    //     getBadges.push({
                    //         badge_id: "8",
                    //         // badge_val: 0, // 需讀取已達成幾次，累加次數
                    //         badge_name: "素食主義",
                    //         electricity: 30
                    //     });
                    // }
                    // 10 Meat
                    // if(!("10" in currentBadge) && badgeResult["Meat"] == "10") {
                    //     getBadges.push({
                    //         badge_id: "10",
                    //         // badge_val: 0, // 需讀取已達成幾次，累加次數
                    //         badge_name: "九天玄女 降肉",
                    //         electricity: 10
                    //     });
                    // }
                    // 12 FoodFlavor
                    // if(!("12" in currentBadge) && badgeResult["FoodFlavor"] == "12") {
                    //     getBadges.push({
                    //         badge_id: "12",
                    //         // badge_val: 0, // 需讀取已達成幾次，累加次數
                    //         badge_name: "異國風情",
                    //         electricity: 10
                    //     });
                    // }
                } 
                /// Regular badges ///
                // 9 HighProteinDiet
                if(!("9" in currentBadge) && badgeResult["HighProteinDiet"] == "9") {
                    getBadges.push({
                        badge_id: "9",
                        badge_val: "y",
                        badge_name: "肌情四射",
                        electricity: 10
                    });
                }
                
                // 11 Burger
                if(!("11" in currentBadge) && badgeResult["Burger"] == "11") {
                    getBadges.push({
                        badge_id: "11",
                        badge_val: "y", 
                        badge_name: "你是我的堡",
                        electricity: 10
                    });
                }
                
                console.log(getBadges);
                console.log(getBadges.length);
                // Get new badge
                if(getBadges.length > 0) {
                    // currentBadgeName = "吃來乍到";
                    adjustAchieveModalContent(getBadges);
                    $.cookie('toSaveAchieve', JSON.stringify(getBadges), { expires: 7 });
                    $.cookie('toSaveElectricity', JSON.stringify({ electricity: responseData.result.electricity.electricity_level }), { expires: 7 });
                    isCloseAwardModal = false;
                    showAchieveModal();
                    
                    // // currentBadgeName = "吃來乍到";
                    // adjustAchieveModalContent(getBadges);
                    // $.cookie('toSaveAchieve', JSON.stringify({ badge_id: "1", badge_val: "y", electricity: 10 }), { expires: 7 });
                    // $.cookie('toSaveElectricity', JSON.stringify({ electricity: responseData.result.electricity.electricity_level }), { expires: 7 });
                    // isCloseAwardModal = false;
                    // showAchieveModal();
                }
                // Update achieve progress 
                else if(getValues.length > 0) {

                }
            } catch (e) {
                appendRetryMsg();
                console.log("Badge check error: ", e);
            }
        })
        .fail(function (xhr, status, error) {
            console.log(error);
        })
}

function collectAchieve() {
    if (currentUser) {
        var userRef = db.collection('users').doc(currentUser.uid);

        let toSaveData = JSON.parse($.cookie("toSaveAchieve"));
        let toSaveElectricity = JSON.parse($.cookie("toSaveElectricity"));

        // console.log(currentUserData.electricity + toSaveData.electricity);
        // console.log(currentUserData.electricity);
        // console.log(currentUserData);

        let currentElectricity = currentUserData && currentUserData.electricity ? parseInt(currentUserData.electricity) : 0;
        let awardElectricity = 0;
        let currentBadge = currentUserData && currentUserData.badge ? currentUserData.badge : {};
        console.log("safe");
        toSaveData.forEach(function(data) {
            currentBadge[data.badge_id] = data.badge_val;
            awardElectricity += data.electricity;
        });

        userRef.set({
            electricity: currentElectricity + parseInt(toSaveElectricity.electricity) + awardElectricity,
            badge: currentBadge
        }, { merge: true }).then(() => {
            $("#achieModal").modal('hide');
            getUserData().then(() => {
                $.removeCookie('toSaveAchieve');
            });
        }).catch((error) => {
            console.error("Error updating user data:", error);
        });
    } else {
        $("#achieModal").modal('hide');
        $("#loginModal").show();
    }
    currentBadgeName = null;
}

// Save electricity without new badge
function collectElectricity() {
    // Need to login first
    if (currentUser && !$.cookie("toSaveAchieve")) {
        let userRef = db.collection('users').doc(currentUser.uid);
        let currentElectricity = currentUserData && currentUserData.electricity ? parseInt(currentUserData.electricity) : 0;
        let rankRef = db.collection("leaderboard").doc(currentUser.uid);

        userRef.set({
            electricity: currentElectricity + parseInt(responseData.result.electricity.electricity_level),
            isNewData: true
        }, { merge: true }).then(() => {
            rankRef.set({
                elect: currentElectricity + parseInt(responseData.result.electricity.electricity_level),
                userName: currentUser.displayName
            }, {merge: true}).then(() => {
                $.removeCookie('toSaveElectricity');
                // Add collect electricity txt res TODO 
            }).catch((error) => {
                console.error("Error updating leaderboard data:", error);
            });
        }).catch((error) => {
            console.error("Error updating user data:", error);
        });
    }
}

// Save aicam result
function saveResult() {
    // Need to login first
    if (currentUser) {
        var hisRef = db.collection('users').doc(currentUser.uid).collection('req_history').doc();

        // need add img: imgUrl
        hisRef.set({
            food: responseData.food,
            ingredient: responseData.ingredient,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        }, { merge: true }).then(() => {
        }).catch((error) => {
            console.error("Error saving user data:", error);
        });
    }
}

function appendRetryMsg() {
    console.log("Not correct food");
    let bg = document.createElement("img");
    bg.classList.add("w-100");
    bg.setAttribute("src", "../images/AI_Cam/imgCheck.svg");

    let txt = document.createElement("p");
    txt.classList.add("position-absolute", "w-75", "fs-5", "my-auto");
    txt.setAttribute("style", "text-align: center; left: 15%");
    txt.innerHTML = "請再試一次！";

    let container = document.createElement("div");
    container.classList.add("col-sm-11", "col-lg-3", "px-md-5",
        "d-flex", "justify-content-center", "align-items-center", "position-relative");

    container.appendChild(bg);
    container.appendChild(txt);

    let row = document.createElement("div");
    row.classList.add("row", "w-100", "mb-2");

    row.appendChild(container);

    $("#dialog-container").append(row);
}

function appendGetReq(food) {
    let bg = document.createElement("img");
    bg.classList.add("w-100");
    bg.setAttribute("src", isPortrait() ? "../images/AI_Cam/res-bg-1-mobile.svg" : "../images/AI_Cam/res-bg-1.svg");

    let txt = document.createElement("p");
    txt.classList.add("position-absolute", "w-75", "fs-5", "my-auto");
    txt.innerHTML = "收到！讓我們一起來看看一份" + food + "會有多少甲烷排放量、電力輸出、熱量及便秘風險吧！";
    if (isPortrait()) { txt.style.setProperty("font-size", "1.1rem", "important"); };

    let container = document.createElement("div");
    container.classList.add("col-sm-11", "col-lg-8", "px-md-5",
        "d-flex", "justify-content-center", "align-items-center", "position-relative");

    container.appendChild(bg);
    container.appendChild(txt);

    let row = document.createElement("div");
    row.classList.add("row", "w-100", "mb-2");

    row.appendChild(container);

    $("#dialog-container").append(row);
}

function appendAwardCongratulation() {
    let bg = document.createElement("img");
    bg.classList.add("w-100");
    bg.setAttribute("src", "../images/AI_Cam/res-bg-award" + (isMobileDevice() ? "-mobile" : "") + ".svg");

    let txt = document.createElement("p");
    txt.classList.add("position-absolute", "w-75", "fs-5", "my-auto");
    txt.setAttribute("style", "left: 15%;");
    if (isMobileDevice) { txt.setAttribute("style", "font-size: 1rem!important;"); }
    txt.textContent = "恭喜！你得到了";

    // Award name
    let button = document.createElement("button");
    button.setAttribute("type", "button");
    button.classList.add("py-2", "bg-transparent", "border-0");
    button.style.backgroundImage = "url(../images/AI_Cam/highlight.svg)";
    button.style.backgroundRepeat = "no-repeat";
    button.style.backgroundSize = "contain";
    button.textContent = "「" + currentBadgeName + "」";
    button.onclick = showAchieveModal;

    let reason = document.createTextNode("成就，" + "是利用相機拍下漢堡就可以解鎖的秘密成就" + "。");

    txt.appendChild(button);
    txt.appendChild(reason);

    let container = document.createElement("div");
    container.classList.add("col-sm-12", "col-lg-7", "px-md-5",
        "d-flex", "justify-content-center", "align-items-center", "position-relative");

    container.appendChild(bg);
    container.appendChild(txt);

    let row = document.createElement("div");
    row.classList.add("row", "w-100", "mb-2");

    row.appendChild(container);

    $("#dialog-container").append(row);
    currentBadgeName = null;
}

function appendAwardMore() {
    let bg = document.createElement("img");
    bg.classList.add("w-100");
    bg.setAttribute("src", "../images/AI_Cam/res-bg-4" + (isMobileDevice() ? "-mobile" : "") + ".svg");

    let txt = document.createElement("p");
    txt.classList.add("position-absolute", "w-75", "fs-5", "my-auto");
    txt.setAttribute("style", "left: 15%;");
    if (isMobileDevice) { txt.setAttribute("style", "font-size: 1rem!important;"); }
    txt.textContent = "還有更多有趣、可愛的成就等你解鎖喔！快來看看吧！";

    // Go!
    let button = document.createElement("a");
    // button.setAttribute("type", "button");
    button.href = "./badge.html";
    button.classList.add("position-absolute", "bg-transparent", "border-0");
    button.style.left = isMobileDevice() ? "70%" : "45%";
    button.style.bottom = isMobileDevice() ? "-13%" : "-1%";
    button.style.width = isMobileDevice() ? "25%" : "10%";
    // button.onclick = showAcheiveModal; //TODO
    let buttonImg = document.createElement("img");
    buttonImg.classList.add("w-100");
    buttonImg.setAttribute("src", "../images/AI_Cam/go" + (isMobileDevice() ? "-mobile" : "") + ".svg");
    buttonImg.setAttribute("style", "filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));");
    button.appendChild(buttonImg);

    let container = document.createElement("div");
    container.classList.add("col-sm-12", "col-lg-7", "px-md-5",
        "d-flex", "justify-content-center", "align-items-center", "position-relative");

    container.appendChild(bg);
    container.appendChild(txt);
    // container.appendChild(button);

    let row = document.createElement("div");
    row.classList.add("row", "w-100", "mb-2", "position-relative");

    row.appendChild(container);
    row.appendChild(button);
    $("#dialog-container").append(row);
}

function awardClose() {
    if (!isCloseAwardModal) {
        setTimeout(function () {
            appendAwardCongratulation();
        }, 300);
        setTimeout(function () {
            appendAwardMore();
        }, 1000);
        isCloseAwardModal = !isCloseAwardModal;
    }
}

function appendLoader() {
    let row = document.createElement("div");
    row.classList.add("row", "px-3", "px-sm-5");
    row.id = "loader";
    let loader = document.createElement("lottie-player");
    loader.classList.add("col-5", "col-lg-2", "px-0");
    loader.setAttribute("src", "../images/AI_Cam/AICamera_loadingDialogBox_Lottie.json");
    loader.setAttribute("background", "transparent");
    loader.setAttribute("speed", "1");
    loader.setAttribute("loop", "");
    loader.setAttribute("autoplay", "");

    row.appendChild(loader);
    $("#dialog-container").append(row);
}

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function isPortrait() {
    return window.innerHeight > window.innerWidth;
}

$("#chartMoreModalBtn").on("click", function () {
    $("#chartMoreModal").modal('hide');
});

function showLoginModal() {
    $("#loginModal").show();
}
