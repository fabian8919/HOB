var _Modulos = (function () {
    var TableModulos;
    
    _columnsMod = [
        {"width": "10%"},
        {"width": "30%"},
        {"width": "60%"}
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
            },
            success:function(r){
                var data = JSON.parse(r);
                var optHerramientas;
                $.each(data,function(i,e){
                    optHerramientas = '<a href="#" onclick="_Modulos.mostrarModalEditarModulo('+e.id+')" ><span class="btn btn-warning btn-sm"><i class="far fa-edit fa-lg"></i></span></a>  ';
                    optHerramientas += '<a href="#" onclick="mostrarModalDeleteCategoria('+e.id+')" id="deleteCategoria'+e.id+'" data-toggle="tooltip" data-placement="right" data-original-title="Eliminar Registro"><span class="btn btn-danger btn-sm"><i class="far fa-times-circle fa-lg"></i></span></a>';
                    TableModulos.row.add([
                        optHerramientas,
                        e.id_modulo,
                        e.nombre_modulo,
                    ]);
                });
                TableModulos.draw();
            }
            
        });    
    }

    var mostrarModalEditarModulo = (id) =>{        
        $.ajax({
            type:"POST",
            url: "/modulos/extraerDataId/",
            data:{
                "id":id
            },
            beforeSend: function(){
            },
            success:function(r){
                var data = JSON.parse(r);
                if(data){
                    $("#Modulos_id").val(data[0].id_modulo);
                    $("#Modulos_nombre").val(data[0].nombre_modulo);
                    $("#modalModulos").modal("show");
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
                //$('#preload').show();
            },
            success: function (r) { 
                if(r){

                }else{

                }
                _Modulos.drawTable();
            }  
        });
    }

    return{
        modulos:modulos,
        mostrarModalEditarModulo:mostrarModalEditarModulo,
        drawTable:drawTable
    }
    
})(jQuery);

$(document).ready(function () {

    _Modulos.drawTable();
    $('#form-modulos').on('submit', (e)=>{
        e.preventDefault();
        _Modulos.modulos();
    });

});
