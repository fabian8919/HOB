var _ModulosPadre = (function () {
    var TableModulosPadre;
    
    _columnsModPadre = [
        {"width": "10%"},
        {"width": "30%"},
        {"width": "60%"}
    ];

    TableModulosPadre = $("#tableModulosPadre").DataTable({
        pagingType: "numbers",
        language: lang_dataTable,
        autoWidth: false,
        searching: true,
        ordering: true,
        paging: true,
        destroy: true,
        pageLength: 10,
        columns: _columnsModPadre,
        order: [[1, 'asc']]
    });

    var drawTable = () =>{        
        $.ajax({
            type:"POST",
            url: "/modulosPadre/extraerData/",
            beforeSend: function(){
                TableModulosPadre.rows().clear().draw();
                _Globals.alertWait();
            },
            success:function(r){
                var data = JSON.parse(r);
                var optHerramientas;
                $.each(data,function(i,e){
                    optHerramientas = '<a href="#" onclick="_ModulosPadre.editarModuloPadre('+e.id+')" ><span class="btn btn-warning btn-sm"><i class="far fa-edit fa-lg"></i></span></a>  ';
                    optHerramientas += '<a href="#" onclick="_ModulosPadre.eliminarModuloPadre('+e.id+')" data-toggle="tooltip" data-placement="right" data-original-title="Eliminar Registro"><span class="btn btn-danger btn-sm"><i class="far fa-times-circle fa-lg"></i></span></a>';
                    TableModulosPadre.row.add([
                        optHerramientas,
                        e.id_modulo_padre,
                        e.nombre,
                    ]);
                });
                TableModulosPadre.draw();
                Swal.close();
            }
            
        });    
    }

    var editarModuloPadre = (id) =>{        
        $.ajax({
            type:"POST",
            url: "/modulosPadre/extraerDataId/",
            data:{
                "id":id
            },
            beforeSend: function(){
                _Globals.alertWait();
            },
            success:function(r){
                var data = JSON.parse(r);
                if(data){
                    $("#ModulosPadre_id").val(data[0].id_modulo_padre);
                    $("#ModulosPadre_nombre").val(data[0].nombre);
                    $("#modalModulosPadre").modal("show");
                    Swal.close();
                }
            }
        });    
    }

    var modulosPadre = () => {

        var dataString = $('#form-modulosPadre').serialize();
        
        $.ajax({
            type: "POST",
            url: "/modulosPadre/",
            data: dataString,
            beforeSend: function () {
                _Globals.alertWait();
            },
            success: function (r) { 
                $('#ModulosPadre_id').prop("required", true);
                $('#ModulosPadre_id').val('');
                $('#ModulosPadre_nombre').val('');
                $('#modalModulosPadre').modal('hide');
                if (r) {
                    _Globals.alertProcess("success", "Bien!", "El proceso fue exitoso.");
                } else {
                    _Globals.alertProcess("error", "Error!", "El proceso ha fallado.");
                }
                _ModulosPadre.drawTable();
            }  
        });
    }

    var eliminarModuloPadre = (id) => {
        Swal.fire({
            title: 'Estás Seguro?',
            text: "Se eliminará el módulo!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar!'
        }).then((result) => {
            if (result.value) {
                $.ajax({
                    type:"POST",
                    url: "/modulosPadre/eliminarModulo/",
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
                            _ModulosPadre.drawTable();
                            _Globals.alertProcess("success", "Bien!", "El módulo se eliminó con exito.");
                        }
                    }
                });  
            }
        });
    }

    return{
        modulosPadre:modulosPadre,
        editarModuloPadre:editarModuloPadre,
        eliminarModuloPadre:eliminarModuloPadre,
        drawTable:drawTable
    }
    
})(jQuery);

$(document).ready(function () {

    _ModulosPadre.drawTable();
    $('#form-modulosPadre').on('submit', (e)=>{
        e.preventDefault();
        _ModulosPadre.modulosPadre();
    });

});
