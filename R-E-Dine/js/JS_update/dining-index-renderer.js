// 获取当前网页的 URL 并转换为字符串
var url = document.location.toString();
// 获取 URL 中问号后所有的字符串，即查询参数
var urlParmStr = url.slice(url.indexOf('?') + 1);
// console.log(urlParmStr);
var default_url;
// 获取默认的 API 请求地址，并调用 getdish 函数
window.REDAPI.requestUrl().then(function (res) {
    default_url = res; 
    getdish(res);
});

// 为“添加”按钮添加点击事件监听器
document.getElementById('addBTN').addEventListener('click', () => {
    window.REDAPI.debug_reload_merchant_add(urlParmStr);
})

// 为“删除”按钮添加点击事件监听器
document.getElementById('delBTN').addEventListener('click', () => {
    window.REDAPI.debug_reload_merchant_del(urlParmStr);
})

// 为“编辑”按钮添加点击事件监听器
document.getElementById('editBTN').addEventListener('click', () => {
    window.REDAPI.debug_reload_merchant_edit(urlParmStr);
})

// 获取菜品信息的函数
function getdish(url) {
    // 发送 GET 请求获取指定类型的菜品信息
    fetch(url + '/dishes?type=' + urlParmStr, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('获取餐品失败:', data.error);
        } else {
            // console.log(data);
            // 遍历获取的菜品信息并添加到页面上
            for (var i = 0; i < Object.keys(data).length; i++) {
                // console.log(i);
                var newdiv = document.createElement('div');
                newdiv.setAttribute("class", "dining-food");
                newdiv.innerHTML = "<img class='dining-food-img' src='" + getIMGtn(data[i]) + "'><div class='dining-food-info'><div class='dining-food-title'>" + data[i].name + "</div><div class='dining-food-cost'>" + data[i].price + "元</div></div>";
                document.getElementById('foodlist-box').appendChild(newdiv);
            }
        }
    })
}

// 每隔 5000 毫秒（5 秒）刷新一次菜品信息
setInterval(() => {
    document.getElementById('foodlist-box').innerHTML = '';
    getdish(default_url);
    // location.reload();
}, 5000);
