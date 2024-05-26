let videoArr = [
    "https://www.youtube.com/embed/kQorKvQ9t5E", // 甲烷
    "https://www.youtube.com/embed/pcAvgp1CaDM", // 電力 
    "https://www.youtube.com/embed/ALnzmrCoBDo", // 熱量
    "https://www.youtube.com/embed/7yBYGV3EXlg", // 便秘
];

let curPlay = 0;

$().ready(function () {
    if (isMobileDevice()) {
        // Portrait Mode
        $("#mobileCarousel").css("display", "block");
    } else {
        $("#mobileCarousel").css("display", "none");
    }

    $(".viBtn").on("click", function () {
        let src = $(this).data("src");
        $("#pcVideo").attr("src", videoArr[src]);
        $(this).data("src", curPlay);
        $(this).find('img').attr("src", `../images/video/${curPlay}.svg`);
        $("#pcVideoContainer").css("background-image", `url(../images/video/${src}-bg.png)`)
        curPlay = src;
    });
});

function handleOrientation(event) {
    alert("em");
    if (isPortrait()) {
        console.log("orientation change");
        alert("isMobile");
    }
}

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );
}