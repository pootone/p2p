let API = "/gpt/img";
let API_txt = "/gpt/txt";
let uploadImg = null;
let responseData = null;

const ctx = document.getElementById("myChart");

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
                backgroundColor: "rgba(221, 216, 204, 0.6)",
            },
            point: {
                pointRadius: 4,
                pointBackgroundColor: [
                    "rgba(130, 177, 153, 1)",
                    "rgba(219, 187, 87, 1)",
                    "rgba(115, 50, 17, 1)",
                    "rgba(179, 135, 134, 1)",
                ],
                pointStyle: 'rect' // https://www.chartjs.org/docs/latest/configuration/elements.html#point-styles
            },
        },
    },
};

$().ready(function () {
    // Preview the image when image input change
    $("#imgFileInput").on("change", function (event) {
        // 抓取上傳的檔案
        const selectedFile = event.target.files[0];

        // 使用 FileReader 讀取文件內容
        const reader = new FileReader();

        reader.onload = function (file) {
            // 將文件內容轉換為 Base 64 格式
            uploadImg = file.target.result;

            // Show the pic on front-end
            $("#uploadImg").attr("src", uploadImg);
        }

        // 讀取文件內容
        reader.readAsDataURL(selectedFile);
    })

    $("#submit").on("click", function () {
        $("#loader").show();
        let payload = {
            img: uploadImg,
            description: $("#descTxt").val() || ''
        }
        console.log(payload);

        if (payload.img || payload.description) {
            // 若有圖片，則送出圖文至 gpt-4-vision-preview
            if (payload.img) {
                $.post(API, payload, function (data, status) {
                    $("#loader").hide();
                    responseData = JSON.parse(data.message.content.replace("```json", "").replace("```", ""));
                    console.log("Get response success!");
                    console.log("Res data: ", data);
                    $("#resContent").text(data.message.content);
                    uploadImg = null;


                    chartConfig.data.datasets[0].data =
                        [responseData.result.methane,
                        responseData.result.electricity,
                        responseData.result.constipate,
                        responseData.result.calorie];
                    console.log("data.datasets: ", chartConfig.data.datasets[0].data);
                    // Create a chart
                    new Chart(ctx, chartConfig);
                })
            }
            // 若只有文字則送 gpt-3.5-turbo
            else {
                $.post(API_txt, { description: payload.description }, function (data, status) {
                    $("#loader").hide();
                    console.log("Get response success!");
                    console.log("Res data: ", data);
                    $("#resContent").text(data.message.content);

                    // Create a chart
                    new Chart(ctx, chartConfig);
                })
            }
        }
    })
})
