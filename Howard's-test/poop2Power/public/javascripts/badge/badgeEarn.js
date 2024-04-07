// 获取当前页面的URL
var currentUrl = window.location.href;

// 检查URL是否包含?isFirst=true
if (currentUrl.indexOf('?isFirst=true') !== -1) {
    // 如果是第一次访问，直接修改HTML内容
    document.querySelector('.image-container img').src = '../images/badge/徽章/badge/badge1.png';
    // 添加第二个图片和按钮
    var addButton = document.createElement('img');
    addButton.src = '../images/badge/徽章/加.png';
    addButton.id = 'button-badge1';
    addButton.className = 'addBtn';
    addButton.onclick = function() {
        showImage('badge1');
    };

    // 插入新的图片和按钮
    var imageContainer = document.querySelector('.image-container');
    imageContainer.appendChild(addButton);
}
