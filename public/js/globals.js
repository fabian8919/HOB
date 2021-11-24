var _Globals = (function () {

    var alertProcess = (icon, tittle, msg)=>{
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

    return {
        alertProcess:alertProcess,
        alertWait:alertWait
    }
    
})(jQuery);

$(document).ready(function () {

});
