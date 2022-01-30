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
                if (r.error != "") {
                    _Globals.alertProcess('error', '!Error', r.error);
                } else if (r.userid) {
                    localStorage.setItem('nombre', r.nombre);
                    localStorage.setItem('vista', 'index');
                    window.location.replace("/");
                } else {
                    if (!r.error) {
                        window.localStorage.setItem('vista', 'index');
                        window.location.replace("/");
                    } else if (r.error) {
                        _Globals.alertProcess('error', '!Error', r.error);
                    }
                }
            }
        });
    }

    var recoveryPass = () => {

        var dataString = $('#form-recovery').serialize();

        $.ajax({
            type: "POST",
            url: "/recovery",
            data: dataString,
            beforeSend: function () {
                _Globals.alertWait();
            },
            success: function (r) {
                var data = JSON.parse(r);
                if (!data.error) {
                    _Globals.alertProcess('success', '!Bien', data.exito);
                } else {
                    _Globals.alertProcess('error', '!Error', data.error);
                }
            }
        });
    }

    var recoveryPassForm = ()=> {

        var pass1 = $('#passnew').val();
        var pass2 = $('#passnew2').val();

        if (pass1 != pass2) {
            _Globals.NotifyError("Las contraseñas no coinciden.");
        } else {
            $.ajax({
                type: "POST",
                url: "/password",
                data: {pass: pass1},
                beforeSend: function () {
                    _Globals.alertWait();
                },
                success: function (r) {
                    var data = JSON.parse(r);
                    if (!data.error) {
                        window.location.replace("/");
                    } else {
                        _Globals.NotifyError(data.error);
                        Swal.close();
                    }
                }
            });
        }
    }

    return {
        loginUser: loginUser,
        recoveryPass: recoveryPass,
        recoveryPassForm: recoveryPassForm
    }

})(jQuery);

$(document).ready(function () {
    $('#loginForm').on('submit', (e) => {
        e.preventDefault();
        _Login.loginUser();
    });

    $('#loginRecoveryForm').on('submit', (e) => {
        e.preventDefault();
        _Login.recoveryPassForm();
    });

    $('#recovery').on('click', () => {
        $('#recoveryPass').modal('show');
    });

    $('#form-recovery').on('submit', (e) => {
        e.preventDefault();
        _Login.recoveryPass();
    });

    $('#passnew').keyup(function (e) {

        var small = document.querySelector("#smallTextPassword");
        var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
        var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
        var enoughRegex = new RegExp("(?=.{8,}).*", "g");

        if (false == enoughRegex.test($(this).val())) {
            small.setAttribute("style", "color:red;");
            $('#smallTextPassword').html('La contraseña debe tener al menos 8 caracteres.');
        } else if (strongRegex.test($(this).val())) {
            small.setAttribute("style", "color:green;");
            $('#smallTextPassword').html('La contraseña es excelente.');
        } else if (mediumRegex.test($(this).val())) {
            small.setAttribute("style", "color:orange;");
            $('#smallTextPassword').html('La contraseña buena.');
        } else {
            small.setAttribute("style", "color:red;");
            $('#smallTextPassword').html('La contraseña es muy debil.');
        }
    });

    $('#passnew2').keyup(function (e) {

        var pass1 = $('#passnew').val();
        var pass2 = $('#passnew2').val();

        var small2 = document.querySelector("#smallTextPassword2");

        if (pass1 != pass2) {
            small2.setAttribute("style", "color:red;");
            $('#smallTextPassword2').html('Las contraseñas no coinciden.');
            $('#changePass').attr('hidden', true);
        } else {
            small2.setAttribute("style", "color:green;");
            $('#smallTextPassword2').html('Las contraseñas coinciden.');
            $('#changePass').attr('hidden', false);
        }
    });

});