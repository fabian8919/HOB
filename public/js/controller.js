var _Admin = (function () {

    /* Controla las vistas */
    var traerVista = (vista) => {
        $('#contentPage').html('');
        var ruta = '../../modules/' + vista + '.html';
        window.localStorage.setItem('vista', vista);
        $.ajax({
            url: ruta,
            beforeSend: function () {
                // $('#page-loader').css('display', '');
                // $('#page-loader').fadeOut(800);
            },
            success: function (data) {
                $('#contentPage').html(data);
            },
            error: function (_error) {
                console.log("Error!", "Modulo no encontrado "+ vista, _error);
            }
        });
    }

    return {
        traerVista: traerVista
    }

})(jQuery);

$(document).ready(function () {

    /* Control de vista */
    var vista = 'index';
    if (localStorage.vista != undefined) {
        vista = localStorage.vista;
    }
    _Admin.traerVista(vista);

});
