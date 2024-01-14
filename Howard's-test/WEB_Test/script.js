function showImage(buttonId) {
    console.log("Button ID: " + buttonId);

    var smallImage = document.getElementById(buttonId);
    smallImage.classList.remove('hidden');
    smallImage.classList.add('show');

    var button = document.getElementById('button-' + buttonId);
    button.disabled = true;
    button.style.backgroundColor = '#ccc'; 

    
    smallImage.onclick = function () {
        smallImage.classList.add('hidden');
        button.disabled = false;
        button.style.backgroundColor = '';
    };
}
