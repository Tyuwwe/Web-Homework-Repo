var url = document.location.toString();
var urlParmStr = url.slice(url.indexOf('?')+1);// 获取问号后所有的字符串
//console.log(urlParmStr);
var default_url;
// 获取默认的API请求地址，并调用getdish函数
window.REDAPI.requestUrl().then(function (res) {default_url = res; getdish(res)});

// 获取菜品信息函数
function getdish(url) {
    // 发送GET请求获取指定类型的菜品信息
    fetch(url + '/dishes?type=' + urlParmStr , {
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
            // 遍历获取的菜品信息并添加到页面上
            for (var i = 0; i < Object.keys(data).length; i++) {
                var newdiv = document.createElement('div');
                newdiv.setAttribute("class", "food-del-edit");
                newdiv.setAttribute("id", "div" + data[i].id);
                // 构建菜品编辑信息
                newdiv.innerHTML = "<f id='" + data[i].id + "' class='food-edit-info'><div class='food-warn'>编辑此项菜品</div></f><div class='food-del-container'><img class='food-del-pic' src='" + getIMGtn(data[i]) + "'><div class='food-name'>" + data[i].name + "</div><div class='food-price-storage'><div class='food-price'>" + data[i].price + "元</div></div></div>";      
                document.getElementById('foodlist-box').appendChild(newdiv);
            }
            addEditEvent(); // 添加编辑事件监听
        }
    })
}

var editFood = document.getElementsByClassName('food-del-edit');

// 添加编辑事件函数
function addEditEvent() {
    for(i = 0; i < editFood.length; i++) {
        editFood[i].addEventListener('click', (e) => {
            // 调用编辑菜品函数
            window.REDAPI.debug_reload_merchant_edit_attr(urlParmStr, e.target.id);
        })
    }
}

// 关闭窗口事件监听
document.getElementById('editSubmit').addEventListener('click', () => {
    window.close();
})

// 定时刷新菜品信息
setInterval(() => {
    document.getElementById('foodlist-box').innerHTML = '';
    getdish(default_url);
    //location.reload();
}, 5000);
