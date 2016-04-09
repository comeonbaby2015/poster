$(document).ready(function () {
    $("#input_name").focus();
    $("body").keydown(function(event) {
        if (event.keyCode == "13") {//keyCode=13是回车键
            $("#btn_login").click();
        }
    });

    function showMsg(msg) {
        $("#infodialog").find('#infomsg').text(msg);
        $("#infodialog").show();
        setTimeout(function () {
            $("#infodialog").hide();
        }, 1500);
    }

    $("#btn_login").click(function () {
        if ($("#input_name").val().length == 0) {
            showMsg('用户名不能为空');
            return false;
        }
        if ($("#input_password").val().length == 0) {
            showMsg('密码不能为空');
            return false;
        }
        $.post("loginAction", {
            "name": $("#input_name").val(),
            "password": $("#input_password").val()
        }, function (data) {
            if (data.success) {
                window.location.href = "./home";
            } else {
                showMsg(data.message);
            }
        })
    });
});
