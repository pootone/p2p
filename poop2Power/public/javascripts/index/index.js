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
                window.location.href = "/index/trans";
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
