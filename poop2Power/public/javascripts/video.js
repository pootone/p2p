$().ready(function () {
    // if (window.orientation == 0 && isMobileDevice()) {
    //   // Portrait Mode
    //   $("#rotatePhone").css("display", "block");
    // }
    // // if(isMobileDevice)
    // // Rotate phone animation
    // $(window).on("orientationchange", function (event) {
    //   if (window.orientation == 0 && isMobileDevice()) {
    //     // Portrait Mode
    //     $("#rotatePhone").css("display", "block");
    //   } else {
    //     $("#rotatePhone").css("display", "none");
    //   }
    //   console.log(window.orientation == 0);
    // });
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