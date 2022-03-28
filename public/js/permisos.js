var _Permisos = (function () {
    var TablePermisos;
    
    _columnsPerm = [
        {"width": "10%"},
        {"width": "30%"},
        {"width": "60%"}
    ];

    TablePermisos = $("#tablePermisos").DataTable({
        pagingType: "numbers",
        language: lang_dataTable,
        autoWidth: false,
        searching: true,
        ordering: true,
        paging: true,
        destroy: true,
        pageLength: 10,
        columns: _columnsPerm,
        order: [[1, 'asc']]
    });

    var drawTable = () =>{        
        $.ajax({
            type:"POST",
            url: "/permisos/extraerData/",
            beforeSend: function(){
                TablePermisos.rows().clear().draw();
                _Globals.alertWait();
            },
            success:function(r){
                var data = JSON.parse(r);
                var optHerramientas;
                $.each(data,function(i,e){
                    optHerramientas = '<a href="#" onclick="_Permisos.editarPermiso('+e.id+')" ><span class="btn btn-warning btn-sm"><i class="far fa-edit fa-lg"></i></span></a>  ';
                    optHerramientas += '<a href="#" onclick="_Permisos.eliminarPermiso('+e.id+')" data-toggle="tooltip" data-placement="right" data-original-title="Eliminar Registro"><span class="btn btn-danger btn-sm"><i class="far fa-times-circle fa-lg"></i></span></a>';
                    TablePermisos.row.add([
                        optHerramientas,
                        e.id_permiso,
                        e.nombre,
                    ]);
                });
                TablePermisos.draw();
                Swal.close();
            }
            
        });    
    }

    var editarPermiso = (id) =>{        
        $.ajax({
            type:"POST",
            url: "/permisos/extraerDataId/",
            data:{
                "id":id
            },
            beforeSend: function(){
                _Globals.alertWait();
            },
            success:function(r){
                var data = JSON.parse(r);
                if(data){
                    $("#Permisos_id").val(data[0].id_permiso);
                    $("#Permisos_nombre").val(data[0].nombre);
                    $("#modalPermisos").modal("show");
                    Swal.close();
                }
            }
        });    
    }

    var permisos = () => {

        var dataString = $('#form-permisos').serialize();
        
        $.ajax({
            type: "POST",
            url: "/permisos/",
            data: dataString,
            beforeSend: function () {
                _Globals.alertWait();
            },
            success: function (r) { 
                $('#Permisos_id').prop("required", true);
                $('#Permisos_id').val('');
                $('#Permisos_nombre').val('');
                $('#modalPermisos').modal('hide');
                if (r) {
                    _Globals.alertProcess("success", "Bien!", "El proceso fue exitoso.");
                } else {
                    _Globals.alertProcess("error", "Error!", "El proceso ha fallado.");
                }
                _Permisos.drawTable();
            }  
        });
    }

    var eliminarPermiso = (id) => {
        Swal.fire({
            title: 'Estás Seguro?',
            text: "Se eliminará el permiso!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar!'
        }).then((result) => {
            if (result.value) {
                $.ajax({
                    type:"POST",
                    url: "/permisos/eliminarPermiso/",
                    data:{
                        "id":id
                    },
                    beforeSend: function(){
                        _Globals.alertWait();
                    },
                    success:function(r){
                        if (!r) {
                            _Globals.NotifyError("El proceso ha fallado.");
                        } else {
                            _Permisos.drawTable();
                            _Globals.alertProcess("success", "Bien!", "El cliente se eliminó con exito.");
                        }
                    }
                });  
            }
        });
    }

    var limpiar = () =>{
        $("#Permisos_id").val('');
        $("#Permisos_nombre").val('');
    }

    return{
        permisos:permisos,
        editarPermiso:editarPermiso,
        eliminarPermiso,
        drawTable:drawTable,
        limpiar:limpiar
    }
    
})(jQuery);

$(document).ready(function () {

    _Permisos.drawTable();
    $('#form-permisos').on('submit', (e)=>{
        e.preventDefault();
        _Permisos.permisos();
    });
});
