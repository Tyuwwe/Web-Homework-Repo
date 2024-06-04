var url = document.location.toString();
var urlParmStr = url.slice(url.indexOf('?')+1);// 获取问号后所有的字符串
//console.log(urlParmStr);
var default_url;
window.REDAPI.requestUrl().then(function (res) {default_url = res;});

function addDish(f_name, f_desc, f_price, f_imglink) {
    //console.log(document.getElementById('f_imglink').value);
    fetch(default_url + '/dishes' , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: f_name,
            description: f_desc,
            price: f_price,
            image_url: f_imglink,
            restaurant: urlParmStr
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('上传失败:', data.error);
            document.getElementsByClassName('warn-area')[0].innerHTML += "<div class='warn-area-items'>注册失败：" + data.error + "</div>";
            document.getElementsByClassName('warn-area')[0].style.height = "45px";
        } else {
            console.log('上传成功');
            window.close();
        }
    });
}

document.getElementById('addsubmit').addEventListener('click', () => {
    var warn_height = 0;
    var warn_flag = 0;
    document.getElementsByClassName('warn-area')[0].innerHTML = "";
    document.getElementsByClassName('warn-area')[0].style.height = warn_height + "px";
    // 菜品名称为空
    if(document.getElementById('f_name').value == "") {
        warn_flag = 1;
        document.getElementsByClassName('warn-area')[0].innerHTML += "<div class='warn-area-items'>添加失败：菜品名称不能为空</div>";
        warn_height += 45;
        document.getElementsByClassName('warn-area')[0].style.height = warn_height + "px";
    }
    // 菜品售价为空
    if(document.getElementById('f_price').value == "") {
        warn_flag = 1;
        document.getElementsByClassName('warn-area')[0].innerHTML += "<div class='warn-area-items'>添加失败：菜品售价不能为空</div>";
        warn_height += 45;
        document.getElementsByClassName('warn-area')[0].style.height = warn_height + "px";
    }
    // 描述为空时，默认设置为"无描述"
    if(document.getElementById('f_desc').value == "") {
        document.getElementById('f_desc').value = "无描述";
    }
    // 图片链接为空时，默认设置为指定链接
    if(document.getElementById('f_imglink').value == "") {
        document.getElementById('f_imglink').value = "https://ooo.0x0.ooo/2023/12/07/OAPfZL.jpg";
    }
    // 如果没有警告标志，执行添加菜品操作
    if(!warn_flag) {
        console.log("hi");
        setTimeout(addDish(document.getElementById('f_name').value, document.getElementById('f_desc').value, document.getElementById('f_price').value, document.getElementById('f_imglink').value), 100);
    }
})
