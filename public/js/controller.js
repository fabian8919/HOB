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
        var vista2 = vista.replace(/\s/g, '_');
        var ruta = '../../modules/' + vista2 + '.html';
        window.localStorage.setItem('vista', vista2);
        $.ajax({
            url: ruta,
            beforeSend: function () {
                _Globals.alertWait();
            },
            success: function (data) {
                $('#contentPage').html(data);
                _Admin.sidebarControl(vista2);
                Swal.close();
            },
            error: function (_error) {
                console.log("Error!", "Modulo no encontrado "+ vista2, _error);
            }
        });
    }

    var sidebarControl = (vista)=>{
        $('#sidebarnav li').removeClass("selected");
        $('#indexWell').html("Bienvenido "+localStorage.getItem('nombre'));
        $('#'+vista).addClass("selected");
    }

    return {
        traerVista: traerVista,
        sidebarControl:sidebarControl
    }

})(jQuery);

$(document).ready(function () {

    $('#nomUser').html(localStorage.getItem('nombre'));

    /* Control de vista */
    var vista = 'index';
    if (localStorage.vista != undefined) {
        vista = localStorage.vista;
    }
    if(localStorage.vista == 'index'){
        $('#indexSidebar').addClass("selected");
    }
    _Admin.traerVista(vista);
});
