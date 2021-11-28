var _Login = (function () {

    var loginUser = () => {

        var dataString = $('#loginForm').serialize();

        $.ajax({
            type: "POST",
            url: "/login/",
            data: dataString,
            beforeSend: function () {
                _Globals.alertWait();
            },
            success: function (r) {
                if(r.userid){
                    localStorage.setItem('nombre', r.nombre);
                    localStorage.setItem('vista', 'index');
                    window.location.replace("/");
                } else {
                    var data = JSON.parse(r);
                    if(!data.error){
                        window.localStorage.setItem('vista', 'index');
                        window.location.replace("/");
                    } else if(data.error) {
                        _Globals.alertProcess('error', '!Error', data.error);
                    }
                }
            }
        });
    }

    return {
        loginUser: loginUser
    }

})(jQuery);

$(document).ready(function () {
    $('#loginForm').on('submit', (e)=>{
        e.preventDefault();
        _Login.loginUser();
    });
});
