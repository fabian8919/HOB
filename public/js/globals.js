var _Globals = (function () {

    var alertProcess = (icon, tittle, msg) => {
        Swal.fire({
            icon: icon,
            title: tittle,
            text: msg
        });
    }

    var alertWait = () => {
        Swal.fire({
            icon: "info",
            title: "Espere",
            text: "Procesando...",
            showConfirmButton: false
        });
    }

    var NotifyInfo = (text) => {
        Notify(text);
    }

    var NotifyError = (text) => {
        Notify(text, null, null, 'danger');
    }

    return {
        alertProcess: alertProcess,
        alertWait: alertWait,
        NotifyInfo: NotifyInfo,
        NotifyError: NotifyError
    }

})(jQuery);

$(document).ready(function () {
    $('#logoutUser').on('click', ()=>{
        window.location.replace("/salir");
    });
});
