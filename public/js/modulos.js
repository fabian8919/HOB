var _Modulos = (function () {
    var TableModulos;
    
    _columnsMod = [
        {"width": "10%"},
        {"width": "30%"},
        {"width": "30%"},
        {"width": "30%"}
    ];

    TableModulos = $("#tableModulos").DataTable({
        pagingType: "numbers",
        language: lang_dataTable,
        autoWidth: false,
        searching: true,
        ordering: true,
        paging: true,
        destroy: true,
        pageLength: 10,
        columns: _columnsMod,
        order: [[1, 'asc']]
    });

    var drawTable = () =>{    
            
        $.ajax({
            type:"POST",
            url: "/modulos/extraerData/",
            beforeSend: function(){
                TableModulos.rows().clear().draw();
                _Globals.alertWait();
            },
            success:function(r){
                var data = JSON.parse(r);
                var optHerramientas;
                $.each(data,function(i,e){
                    optHerramientas = '<a href="#" onclick="_Modulos.editarModulo('+e.id+')" ><span class="btn btn-warning btn-sm"><i class="far fa-edit fa-lg"></i></span></a>  ';
                    optHerramientas += '<a href="#" onclick="_Modulos.eliminarModulo('+e.id+')" data-toggle="tooltip" data-placement="right" data-original-title="Eliminar Registro"><span class="btn btn-danger btn-sm"><i class="far fa-times-circle fa-lg"></i></span></a>';
                    TableModulos.row.add([
                        optHerramientas,
                        e.id_modulo,
                        e.nombre_modulo,
                        e.modulo_padre
                    ]);
                });
                TableModulos.draw();
                Swal.close();
            }
            
        });    
    }

    var editarModulo = (id) =>{        
        $.ajax({
            type:"POST",
            url: "/modulos/extraerDataId/",
            data:{
                "id":id
            },
            beforeSend: function(){
                _Globals.alertWait();
            },
            success:function(r){
                var data = JSON.parse(r);
                if(data){
                    $("#Modulos_id").val(data[0].id_modulo);
                    $("#Modulos_nombre").val(data[0].nombre_modulo);
                    traerModulosPadre(data[0].modulo_padre);
                    $("#modalModulos").modal("show");
                    Swal.close();
                }
            }
        });    
    }

    var modulos = () => {

        var dataString = $('#form-modulos').serialize();
        
        $.ajax({
            type: "POST",
            url: "/modulos/",
            data: dataString,
            beforeSend: function () {
                _Globals.alertWait();
            },
            success: function (r) { 
                $('#Modulos_id').prop("required", true);
                $('#Modulos_id').val('');
                $('#Modulos_nombre').val('');
                $('#modalModulos').modal('hide');
                if (r) {
                    _Globals.alertProcess("success", "Bien!", "El proceso fue exitoso.");
                } else {
                    _Globals.alertProcess("error", "Error!", "El proceso ha fallado.");
                }
                _Modulos.drawTable();
            }  
        });
    }

    var eliminarModulo = (id) => {
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
                    url: "/modulos/eliminarModulo/",
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
                            _Modulos.drawTable();
                            _Globals.alertProcess("success", "Bien!", "El módulo se eliminó con exito.");
                        }
                    }
                });  
            }
        });
    }

    var traerModulosPadre = (id) =>{        
        $.ajax({
            type:"POST",
            url: "/modulos/extraerDataModulosPadre/",
            data:{
                "id":id
            },
            beforeSend: function(){
                $('#Modulos_relPadre').html('');
            },
            success:function(r){
                var data = JSON.parse(r);
                if(data){
                    $.each(data, function(key, val){
                        $('#Modulos_relPadre').append('<option value="'+ data[key].id_modulo_padre+ '">'+data[key].nombre+'</option>')
                    });
                    $('#Modulos_relPadre option[value="'+id+'"]').prop('selected', 'selected');
                }
            }
        });    
    }

    return{
        modulos:modulos,
        editarModulo:editarModulo,
        eliminarModulo:eliminarModulo,
        traerModulosPadre:traerModulosPadre,
        drawTable:drawTable
    }
    
})(jQuery);

$(document).ready(function () {

    _Modulos.traerModulosPadre('');
    _Modulos.drawTable();
    
    $('#form-modulos').on('submit', (e)=>{
        e.preventDefault();
        _Modulos.modulos();
    });

});
