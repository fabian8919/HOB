var lang_dataTable = {
    "sLengthMenu": "Mostrar _MENU_ Registros",
    "sZeroRecords": "No se encontraron resultados",
    "sEmptyTable": "Ningún dato disponible en esta tabla",
    "sInfo": "Mostrando _START_ a _END_ de _TOTAL_ Registro(s)",
    "sInfoEmpty": "",
    "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
    "sInfoPostFix": "",
    "sSearch": "Filtro:",
    "sUrl": "",
    "sInfoThousands": ",",
    "sLoadingRecords": "Cargando...",
    "oPaginate": {
      "sFirst": "Primero",
      "sLast": "Final",
      "sNext": "Siguiente",
      "sPrevious": "Anterior"
    },
    "select" : {"rows": "%d fila(s) seleccionada(s)"},
    "oAria": {
    "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
    }
};

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
