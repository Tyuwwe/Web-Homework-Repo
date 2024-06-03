// 获取餐品ID，获取餐品信息并显示
// 提供修改餐品信息的功能
var url = document.location.toString(); // 获取当前页面的URL
var urlParmStr = url.slice(url.indexOf('?') + 1); // 获取URL问号后面的字符串
var urlParmStrArray = urlParmStr.split("&"); // 将字符串按&分割成数组
var default_url;

// 请求获取默认URL并调用getDishbyID函数
window.REDAPI.requestUrl().then(function (res) {
    default_url = res;
    getDishbyID();
});

// 根据URL参数获取餐品信息的函数
function getDishbyID() {
    fetch(default_url + '/dishes/' + urlParmStrArray[1], {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('获取餐品失败:', data.error); // 处理获取餐品失败的错误信息
        } else {
            // 将获取到的餐品信息填充到表单中
            document.getElementById('f_name').value = data.name;
            document.getElementById('f_price').value = data.price;
            document.getElementById('f_desc').value = data.description;
            document.getElementById('f_imglink').value = data.image_url;
        }
    });
}

// 更新餐品信息的函数
function updateDish(f_name, f_desc, f_price, f_imglink) {
    fetch(default_url + '/dishes/' + urlParmStrArray[1], {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: f_name,
            description: f_desc,
            price: f_price,
            image_url: f_imglink,
            restaurant: urlParmStrArray[0]
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('上传失败:', data.error); // 处理上传失败的错误信息
            document.getElementsByClassName('warn-area')[0].innerHTML += "<div class='warn-area-items'>注册失败：" + data.error + "</div>";
            document.getElementsByClassName('warn-area')[0].style.height = "45px";
        } else {
            console.log('上传成功'); // 上传成功后关闭窗口
            window.close();
        }
    });
}

// 监听提交按钮的点击事件
document.getElementById('addsubmit').addEventListener('click', () => {
    var warn_height = 0;
    var warn_flag = 0;
    document.getElementsByClassName('warn-area')[0].innerHTML = "";
    document.getElementsByClassName('warn-area')[0].style.height = warn_height + "px";

    // 检查菜品名称是否为空
    if (document.getElementById('f_name').value == "") {
        warn_flag = 1;
        document.getElementsByClassName('warn-area')[0].innerHTML += "<div class='warn-area-items'>添加失败：菜品名称不能为空</div>";
        warn_height += 45;
        document.getElementsByClassName('warn-area')[0].style.height = warn_height + "px";
    }

    // 检查菜品价格是否为空
    if (document.getElementById('f_price').value == "") {
        warn_flag = 1;
        document.getElementsByClassName('warn-area')[0].innerHTML += "<div class='warn-area-items'>添加失败：菜品售价不能为空</div>";
        warn_height += 45;
        document.getElementsByClassName('warn-area')[0].style.height = warn_height + "px";
    }

    // 如果描述为空，则设置默认描述
    if (document.getElementById('f_desc').value == "") {
        document.getElementById('f_desc').value = "无描述";
    }

    // 如果图片链接为空，则设置默认图片链接
    if (document.getElementById('f_imglink').value == "") {
        document.getElementById('f_imglink').value = "https://ooo.0x0.ooo/2023/12/07/OAPfZL.jpg";
    }

    // 如果没有警告标志，则更新餐品信息
    if (!warn_flag) {
        setTimeout(() => updateDish(
            document.getElementById('f_name').value,
            document.getElementById('f_desc').value,
            document.getElementById('f_price').value,
            document.getElementById('f_imglink').value
        ), 100);
    }
});
