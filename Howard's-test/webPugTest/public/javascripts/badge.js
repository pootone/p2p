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
            rankWindowBtn.style.display = 'block';  // Adjust this to 'block' or 'inline-block' as needed
            weekWindowBtn.style.display = 'block';  // Adjust this to 'block' or 'inline-block' as needed
        }
    });
});

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

document.addEventListener("DOMContentLoaded", function () {
    const openWeekButton = document.getElementById("openWeekWindowBtn");
    const floatingWindow = document.getElementById("WeekWindow");
    const closeWeekButton = document.getElementById("closeWeekWindowBtn");
    const body = document.body;

    openWeekButton.addEventListener("click", function () {
        floatingWindow.style.display = "block";
        body.style.overflow = "hidden"; // Disable scrolling on the body
    });

    closeWeekButton.addEventListener("click", function () {
        floatingWindow.style.display = "none";
        body.style.overflow = ""; // Enable scrolling on the body
    });
});
