//openWeekWindow 
document.addEventListener("DOMContentLoaded", function () {
    const openWeekButton = document.getElementById("openWeekWindowBtn");
    const floatingWindow = document.getElementById("WeekWindow");
    const closeWeekButton = document.getElementById("closeWeekWindowBtn");
    const body = document.body;

    // If weekly btn exist, setting its click event
    if(openWeekButton){
        openWeekButton.addEventListener("click", function () {
            floatingWindow.style.display = "block";
            body.style.overflow = "hidden"; // Disable scrolling on the body
        });
        closeWeekButton.addEventListener("click", function () {
            floatingWindow.style.display = "none";
            body.style.overflow = ""; // Enable scrolling on the body
        });
    }
});


document.addEventListener('DOMContentLoaded', function () {
    var menuBar = document.querySelector('.menu-bar');
    var rankWindowBtn = document.getElementById('openRankWindowBtn');
    var weekWindowBtn = document.getElementById('openWeekWindowBtn');
    var toggleMenuBtn = document.getElementById('toggleMenuBtn');

    toggleMenuBtn.addEventListener('click', function () {
        if (menuBar.style.display === 'none' || menuBar.style.display === '') {
            menuBar.style.display = 'block';
            rankWindowBtn.style.display = 'none';
            weekWindowBtn.style.display = 'none';
        } else {
            menuBar.style.display = 'none';
            if (window.innerWidth <= 768) {
                rankWindowBtn.style.display = 'none';  
                weekWindowBtn.style.display = 'none';  
            } else {
                rankWindowBtn.style.display = 'block';  
                weekWindowBtn.style.display = 'block';  
            }
        }
    });

});

