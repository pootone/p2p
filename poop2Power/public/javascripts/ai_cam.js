let API = "https://p2p-contest-backend.onrender.com/aicam/gpt/img";
let API_txt = "https://p2p-contest-backend.onrender.com/aicam/gpt/txt";
let uploadImg = null;
let responseData = null;
let methane = 0;
let electricity = 0;
let constipate = 0;
let calorie = 0;
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

const labels = [["甲烷排放", 0], ["電力輸出", 0], ["便秘風險", 0], ["熱量", 0]];

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
    $.post("https://p2p-contest-backend.onrender.com/wake", {}, function (data, status) {});
    // Auto scroll to bottom, when append content to the container
    var dialogContainer = document.getElementById('dialog-container');
    dialogObserver.observe(dialogContainer, { childList: true });

    $("#guide-dialog-1").hide();

    setTimeout(function () {
        $("#guide-dialog-1").show();
    }, 2000);
    // appendLoader(); //TODO
    // appendChart(1, 2, 3, 4);//TODO
    // $("#chartMoreModal").modal('show');//TODO
    // appendImgCheck("test"); //TODO
    // showAcheiveModal();
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

    $("#submit").on("click", function () {
        let payload = {
            img: uploadImg,
            description: $("#descTxt").val() || ''
        }
        $("#descTxt").val('');
        console.log(payload);

        if (payload.img || payload.description) {
            // 若有圖片，則送出圖文至 gpt-4-vision-preview
            if (payload.img) {
                appendLoader();
                // Remove last chart's id
                $("#myChart").removeAttr("id");

                $.post(API, payload, function (data, status) {
                    $("#loader").remove();

                    responseData = JSON.parse(data.message.content.replace("```json", "").replace("```", ""));
                    console.log("Get response success!");
                    console.log("Res data: ", data);
                    uploadImg = null;

                    responseData.food = payload.description == "" ? responseData.food : payload.description;

                    appendImgCheck(responseData.food);
                })
            }
            // 若只有文字則送 gpt-3.5-turbo
            else {
                appendAskMsg(payload.description);
                appendGetReq(payload.description);
                appendLoader();

                $.post(API_txt, { description: payload.description }, function (data, status) {
                    $("#loader").remove();

                    responseData = JSON.parse(data.message.content.replace("```json", "").replace("```", ""));
                    console.log("Get response success!");
                    console.log("Res data: ", data);

                    methane = responseData.result.methane;
                    electricity = responseData.result.electricity;
                    constipate = responseData.result.constipate;
                    calorie = responseData.result.calorie;

                    appendChart(methane,
                        electricity,
                        constipate,
                        calorie,
                        responseData.result.suggest);

                    $("#modalTitle").text("您消耗的" + payload.description + "......");

                    // Show Achievement Model
                    setTimeout(function () {
                        isCloseAwardModal = false;
                        showAchieveModal()
                    }, 1500);
                })
            }
        }
    })
})

function scrollToBottom() {
    let scrollableDiv = $("#dialog-container");
    scrollableDiv.scrollTop(scrollableDiv[0].scrollHeight);
}

function showAchieveModal() {
    $("#acheModal").modal('show');
}

function appendChart(methane, electricity, constipate, calorie, suggest = "") {
    chartConfig.data.datasets[0].data =
        [methane,
            electricity,
            constipate,
            calorie];
    chartConfig.data.labels[0][1] = methane;
    chartConfig.data.labels[1][1] = electricity;
    chartConfig.data.labels[2][1] = constipate;
    chartConfig.data.labels[3][1] = calorie;

    console.log("data.datasets: ", chartConfig.data.datasets[0].data);

    // Create a chart
    let row = document.createElement("div")
    row.classList.add("row", "d-flex", "mb-2", "px-5");

    let container = document.createElement("div");
    container.classList.add("col-sm-6", "col-md-4");

    let canvasContainer = document.createElement("div");
    canvasContainer.classList.add("w-100");
    canvasContainer.id = "chartProp";

    let canvas = document.createElement("canvas");
    canvas.id = "myChart";
    canvasContainer.appendChild(canvas);
    container.appendChild(canvasContainer);

    let btnContainer = document.createElement("div");
    btnContainer.classList.add("d-flex", "align-items-bottom", "position-relative");
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

    // Add chart to the dialog block
    $("#dialog-container").append(row);
    let ctx = $("#myChart");
    new Chart(ctx, chartConfig);

    new Chart($("#chartMoreRadar"), chartConfig);
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

    let decorate = document.createElement("img");

    decorate.setAttribute("src", "../images/AI_Cam/ask-txt-deco.png");
    decorate.setAttribute("style", "position: absolute; left: 65%; top: -20%;")

    //- msg
    let msg = document.createElement("p");
    msg.innerHTML = inputMsg;
    msg.classList.add("position-absolute", "fs-5");
    msg.setAttribute("style", "top: 35%;")

    container.appendChild(bg);
    container.appendChild(decorate);
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
    btn.onclick = function () { appendRetryMsg() };

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
    appendChart(responseData.result.methane,
        responseData.result.electricity,
        responseData.result.constipate,
        responseData.result.calorie,
        responseData.result.suggest);

    $("#modalTitle").text("您消耗的" + responseData.food + "......");

    // Show Achievement Model
    setTimeout(function () {
        isCloseAwardModal = false;
        showAchieveModal();
    }, 1500);
}

function appendRetryMsg() {
    $("#imgNo").removeClass("imgNo");
    $("#imgYes").removeClass("imgYes");
    $("#imgYes img:nth-child(1)").attr("src", "../images/AI_Cam/no.svg");
    $("#imgNo img:nth-child(1)").attr("src", "../images/AI_Cam/yes.svg");
    $("#imgNo").prop("disabled", true);
    $("#imgYes").prop("disabled", true);
    $("#imgNo").removeAttr("id");

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
    bg.setAttribute("src", "../images/AI_Cam/res-bg-1.svg");

    let txt = document.createElement("p");
    txt.classList.add("position-absolute", "w-75", "fs-5", "my-auto");
    txt.innerHTML = "收到！讓我們一起來看看一份" + food + "會有多少甲烷排放量、電力輸出、熱量及便秘風險吧！";

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
    bg.setAttribute("src", "../images/AI_Cam/res-bg-award.svg");

    let txt = document.createElement("p");
    txt.classList.add("position-absolute", "w-75", "fs-5", "my-auto");
    txt.setAttribute("style", "left: 15%;");
    txt.textContent = "恭喜！你得到了";

    // Award name
    let button = document.createElement("button");
    button.setAttribute("type", "button");
    button.classList.add("py-2", "bg-transparent", "border-0");
    button.style.backgroundImage = "url(../images/AI_Cam/highlight.svg)";
    button.style.backgroundRepeat = "no-repeat";
    button.style.backgroundSize = "contain";
    button.textContent = "「" + "Burger King" + "」";
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
}

function appendAwardMore() {
    let bg = document.createElement("img");
    bg.classList.add("w-100");
    bg.setAttribute("src", "../images/AI_Cam/res-bg-4.svg");

    let txt = document.createElement("p");
    txt.classList.add("position-absolute", "w-75", "fs-5", "my-auto");
    txt.setAttribute("style", "left: 15%;");
    txt.textContent = "還有更多有趣、可愛的成就等你解鎖喔！快來看看吧！";

    // Go!
    let button = document.createElement("button");
    button.setAttribute("type", "button");
    button.classList.add("position-absolute", "bg-transparent", "border-0");
    button.style.left = "45%";
    button.style.bottom = "-1%";
    button.style.width = "10%";
    // button.onclick = showAcheiveModal; //TODO
    let buttonImg = document.createElement("img");
    buttonImg.classList.add("w-100");
    buttonImg.setAttribute("src", "../images/AI_Cam/go.svg");
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
    row.classList.add("row", "px-5");
    row.id = "loader";
    let loader = document.createElement("lottie-player");
    loader.classList.add("col-md-2", "px-0");
    loader.setAttribute("src", "../images/AI_Cam/AICamera_loadingDialogBox_Lottie.json");
    loader.setAttribute("background", "transparent");
    loader.setAttribute("speed", "1");
    loader.setAttribute("loop", "");
    loader.setAttribute("autoplay", "");

    row.appendChild(loader);
    $("#dialog-container").append(row);
}

$("#chartMoreModalBtn").on("click", function () {
    $("#chartMoreModal").modal('hide');
});