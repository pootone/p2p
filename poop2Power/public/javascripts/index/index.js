document.addEventListener("DOMContentLoaded", function () {
    const shit = document.getElementById("shit");
    const nextBtn = document.getElementById("nextBtn");

    shit.addEventListener("mousedown", startDrag);
    shit.addEventListener("touchstart", startDrag);

    function startDrag(e) {
        e.preventDefault();

        const initialX = e.clientX || e.touches[0].clientX;
        const initialY = e.clientY || e.touches[0].clientY;

        const initialLeft = parseFloat(getComputedStyle(shit).left);
        const initialTop = parseFloat(getComputedStyle(shit).top);

        document.addEventListener("mousemove", drag);
        document.addEventListener("touchmove", drag);
        document.addEventListener("mouseup", endDrag);
        document.addEventListener("touchend", endDrag);

        function drag(e) {
            e.preventDefault();
            const currentX = e.clientX || e.touches[0].clientX;
            const currentY = e.clientY || e.touches[0].clientY;

            const offsetX = currentX - initialX;
            const offsetY = currentY - initialY;

            const newX = initialLeft + offsetX;
            const newY = initialTop + offsetY;

            shit.style.left = `${newX}px`;
            shit.style.top = `${newY}px`;

            if (checkOverlap(shit, nextBtn)) {
                window.location.href = "html/IndexTrans";
            }
        }

        function endDrag() {
            document.removeEventListener("mousemove", drag);
            document.removeEventListener("touchmove", drag);
            document.removeEventListener("mouseup", endDrag);
            document.removeEventListener("touchend", endDrag);
        }

        function checkOverlap(element1, element2) {
            const rect1 = element1.getBoundingClientRect();
            const rect2 = element2.getBoundingClientRect();

            return (
                rect1.left < rect2.right &&
                rect1.right > rect2.left &&
                rect1.top < rect2.bottom &&
                rect1.bottom > rect2.top
            );
        }
    }
});

//trans
// Activate the carousel
var badgeCarousel = new bootstrap.Carousel(document.getElementById('badgeCarousel'), {
    interval: 2000, // Set the interval between slides in milliseconds (adjust as needed)
    wrap: true // Enable continuous loop
});

// Add a custom event listener to update the current slide index and circle images
var currentSlide = 0;
document.getElementById('badgeCarousel').addEventListener('slid.bs.carousel', function (event) {
    currentSlide = event.to;
    updateCircleImages();
});

function goToSlide(slideIndex) {
    // Go to the specified slide
    badgeCarousel.to(slideIndex);
    currentSlide = slideIndex;
    updateCircleImages();
}

function updateCircleImages() {
    for (var i = 0; i < 3; i++) {
        var circleImage = document.getElementById('circle' + i);
        if (i === currentSlide) {
            circleImage.src = "./images/index-old/overlay/circle_Y.svg";
        } else {
            circleImage.src = "./images/index-old/overlay/circle_N.svg";
        }
    }
}

function showTooltip(tipId) {
    setTimeout(function () {
        document.getElementById("tipIndex").style.display = 'none';
        document.getElementById("tipBadge").style.display = 'none';
        document.getElementById("tipCam").style.display = 'none';
        document.getElementById("tipAnim").style.display = 'none';
        document.getElementById("tipAbout").style.display = 'none';
        document.getElementById(tipId).style.display = 'block';
        // Restart the carousel when the tooltip is shown
        badgeCarousel.cycle();
    }, 100);
}

function hideTooltip() {
    document.getElementById("tipIndex").style.display = 'none';
    document.getElementById("tipBadge").style.display = 'none';
    document.getElementById("tipCam").style.display = 'none';
    document.getElementById("tipAnim").style.display = 'none';
    document.getElementById("tipAbout").style.display = 'none';
    // Pause the carousel when hiding the tooltip
    badgeCarousel.pause();
}