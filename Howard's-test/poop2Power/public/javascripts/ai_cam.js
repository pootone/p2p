let API = "/aicam/gpt/img";
let API_txt = "/aicam/gpt/txt";
let uploadImg = null;
let responseData = null;

const labels = ["甲烷排放", "電力輸出", "便秘風險", "熱量"];

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
                        size: 20 // 指標字型大小
                    }
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
    $("#guide-dialog-1").hide();

    setTimeout(function () {
        $("#guide-dialog-1").show();
    }, 2000);


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
            row.classList.add("row", "justify-content-end");

            let container = document.createElement("div");
            container.classList.add("col-6", "col-md-3", "d-flex",
                "justify-content-center", "align-items-center", "position-relative");
            container.setAttribute("style", "height: 362px");

            let bg = document.createElement("img");
            bg.classList.add("w-100");
            bg.setAttribute("src", "/images/AI_Cam/ask-img-bg-1.svg");

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
            scrollToBottom();
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
                    $("#resContent").text(data.message.content);
                    uploadImg = null;

                    appendChart(responseData.result.methane,
                        responseData.result.electricity,
                        responseData.result.constipate,
                        responseData.result.calorie);

                    scrollToBottom();

                    // Show Achievement Model
                    setTimeout(function () { showAcheiveModel() }, 1500);
                })
            }
            // 若只有文字則送 gpt-3.5-turbo
            else {
                appendAskMsg(payload.description);
                appendLoader();

                $.post(API_txt, { description: payload.description }, function (data, status) {
                    $("#loader").remove();

                    responseData = JSON.parse(data.message.content.replace("```json", "").replace("```", ""));
                    console.log("Get response success!");
                    console.log("Res data: ", data);
                    $("#resContent").text(data.message.content);

                    appendChart(responseData.result.methane,
                        responseData.result.electricity,
                        responseData.result.constipate,
                        responseData.result.calorie);
                    scrollToBottom();

                    // Show Achievement Model
                    setTimeout(function () { showAcheiveModel() }, 1500);
                })
            }
        }
    })
})

function scrollToBottom() {
    let scrollableDiv = $("#dialog-container");
    scrollableDiv.scrollTop(scrollableDiv[0].scrollHeight);
}

function showAcheiveModel() {
    $("#acheModel").modal('show');
}

function appendChart(methane, electricity, constipate, calorie) {
    chartConfig.data.datasets[0].data =
        [methane,
            electricity,
            constipate,
            calorie];
    console.log("data.datasets: ", chartConfig.data.datasets[0].data);

    // Create a chart
    let row = document.createElement("div")
    row.classList.add("row", "d-flex");

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

    let btn = document.createElement("button");
    btn.classList.add("bg-transparent", "border-0", "position-absolute");
    btn.setAttribute("style", "height: 10%; top: 75%;");

    let img = document.createElement("img");
    img.classList.add("w-100");
    img.setAttribute("src", "/images/AI_Cam/more.svg");
    img.setAttribute("style", "filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));")
    btn.appendChild(img);
    btnContainer.appendChild(btn);

    row.appendChild(container);
    row.appendChild(btnContainer);

    // Add chart to the dialog block
    $("#dialog-container").append(row);
    let ctx = $("#myChart");
    new Chart(ctx, chartConfig);
}

function appendAskMsg(inputMsg) {
    let row = document.createElement("div")
    row.classList.add("row", "d-flex", "justify-content-end", "m-4");

    let container = document.createElement("div");
    container.classList.add("col-6", "col-md-3", "position-relative", "d-flex",
     "justify-content-center", "align-items-center");
    container.setAttribute("style", "height: 100px");

    let bg = document.createElement("img");
    bg.classList.add("w-100", "position-absolute");
    bg.setAttribute("src", "/images/AI_Cam/ask-txt-bg-1.svg");

    let decorate = document.createElement("img");

    decorate.setAttribute("src", "/images/AI_Cam/ask-txt-deco.png");
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

function appendLoader() {
    let row = document.createElement("div")
        row.classList.add("row");
        let loader = document.createElement("div");
        loader.id = "loader";
        console.log(loader);
        row.appendChild(loader);
        $("#dialog-container").append(row);

    scrollToBottom();
}