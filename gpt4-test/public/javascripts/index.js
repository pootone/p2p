let API = "/gpt/img";
let API_txt = "/gpt/txt";
let uploadImg = null;
$().ready(function(){
    // Preview the image when image input change
    $("#imgFileInput").on("change", function(event){
        // 抓取上傳的檔案
        const selectedFile = event.target.files[0];

        // 使用 FileReader 讀取文件內容
        const reader = new FileReader();

        reader.onload = function(file){
            // 將文件內容轉換為 Base 64 格式
            uploadImg = file.target.result;

            // Show the pic on front-end
            $("#uploadImg").attr("src", uploadImg);
        }

        // 讀取文件內容
        reader.readAsDataURL(selectedFile);
    })

    $("#submit").on("click", function(){
        let payload = {
            img: uploadImg,
            description: $("#descTxt").val() || ''
        }
        console.log(payload);

        if(payload.img || payload.description){
            // 若有圖片，則送出圖文至 gpt-4-vision-preview
            if(payload.img) {
                $.post(API, payload, function(data, status) {
                    console.log("Get response success!");
                    console.log("Res data: ", data);
                    $("#resContent").text(data.message.content);
                    uploadImg = null;
                })
            }
            // 若只有文字則送 gpt-3.5-turbo
            else {
                $.post(API_txt, {description: payload.description}, function(data, status) {
                    console.log("Get response success!");
                    console.log("Res data: ", data);
                    $("#resContent").text(data.message.content);
                })
            }
        }
    })
})
