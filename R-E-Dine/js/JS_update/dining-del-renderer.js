var url = document.location.toString();
var urlParmStr = url.slice(url.indexOf('?')+1);// 获取问号后所有的字符串
console.log(urlParmStr);
var default_url;
// 获取默认的API请求地址，并调用getdish函数
window.REDAPI.requestUrl().then(function (res) {default_url = res; getdish(res)});
//fetch(url + '/dishes?type=' + urlParmStr

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
                newdiv.setAttribute("class", "food-del");
                newdiv.setAttribute("id", "div" + data[i].id);
                // 构建菜品展示信息
                newdiv.innerHTML = "<f id='" + data[i].id + "' class='food-del-info'><div class='food-warn'>删除此项菜品</div></f><div class='food-del-container'><img class='food-del-pic' src='" + getIMGtn(data[i]) + "'><div class='food-name'>" + data[i].name + "</div><div class='food-price-storage'><div class='food-price'>" + data[i].price + "元</div></div></div>";      
                document.getElementById('foodlist-box').appendChild(newdiv);
            }
            addDelEvent(); // 添加删除事件监听
        }
    })
}

var deleteFood = document.getElementsByClassName('food-del');

// 添加删除事件函数
function addDelEvent() {
    for(i = 0; i < deleteFood.length; i++) {
        deleteFood[i].addEventListener('click', (e) => {
            // 删除菜品的动画效果
            document.getElementById("div" + e.target.id).style.transform = "translate(-200%, 0px)";
            document.getElementById("div" + e.target.id).style.height = "0px";
            document.getElementById("div" + e.target.id).style.margin = "0";
            delDish(e.target.id); // 发送删除菜品请求
        })
    }
}

// 关闭窗口事件监听
document.getElementById('delSubmit').addEventListener('click', () => {
    window.close();
})

// 发送删除菜品请求函数
function delDish(dishID) {
    fetch(default_url + '/dishes/' + dishID, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('提交失败');
        } else {
            console.log('提交成功');
        }
    })
    .catch((error) => {
        console.error('请求错误:', error);
    });
}
