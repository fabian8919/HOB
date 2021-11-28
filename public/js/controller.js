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
                _Globals.alertWait();
            },
            success: function (data) {
                $('#contentPage').html(data);
                _Admin.sidebarControl(vista);
                Swal.close();
            },
            error: function (_error) {
                console.log("Error!", "Modulo no encontrado "+ vista, _error);
            }
        });
    }

    var sidebarControl = (vista)=>{
        $('#sidebarnav li').removeClass("selected");
        if(vista == 'index'){
            $('#indexSidebar').addClass("selected");
            $('#indexWell').html("Bienvenido "+localStorage.getItem('nombre'));
        } else if(vista == 'clientes'){
            $('#clientesSidebar').addClass("selected");
        } else if(vista == 'usuarios'){
            $('#usuariosSidebar').addClass("selected");
        } else if(vista == 'permisos'){
            $('#permisosSidebar').addClass("selected");
        } else if(vista == 'modulos'){
            $('#modulosSidebar').addClass("selected");
        } else if(vista = 'modulos_padre'){
            $('#modulospadreSidebar').addClass("selected");
        } else {
            $('#indexSidebar').addClass("selected");
        }
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
