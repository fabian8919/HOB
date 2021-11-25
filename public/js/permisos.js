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
            },
            success:function(r){
                var data = JSON.parse(r);
                var optHerramientas;
                $.each(data,function(i,e){
                    optHerramientas = '<a href="#" onclick="_Permisos.mostrarModalEditarPermiso('+e.id+')" ><span class="btn btn-warning btn-sm"><i class="far fa-edit fa-lg"></i></span></a>  ';
                    optHerramientas += '<a href="#" onclick="mostrarModalDeleteCategoria('+e.id+')" id="deleteCategoria'+e.id+'" data-toggle="tooltip" data-placement="right" data-original-title="Eliminar Registro"><span class="btn btn-danger btn-sm"><i class="far fa-times-circle fa-lg"></i></span></a>';
                    TablePermisos.row.add([
                        optHerramientas,
                        e.id_permiso,
                        e.nombre,
                    ]);
                });
                TablePermisos.draw();
            }
            
        });    
    }

    var mostrarModalEditarPermiso = (id) =>{        
        $.ajax({
            type:"POST",
            url: "/permisos/extraerDataId/",
            data:{
                "id":id
            },
            beforeSend: function(){
            },
            success:function(r){
                var data = JSON.parse(r);
                if(data){
                    $("#Permisos_id").val(data[0].id_permiso);
                    $("#Permisos_nombre").val(data[0].nombre);
                    $("#modalPermisos").modal("show");
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
                //$('#preload').show();
            },
            success: function (r) { 
                if(r){

                }else{

                }
                _Permisos.drawTable();
            }  
        });
    }

    return{
        permisos:permisos,
        mostrarModalEditarPermiso:mostrarModalEditarPermiso,
        drawTable:drawTable
    }
    
})(jQuery);

$(document).ready(function () {

    _Permisos.drawTable();
    $('#form-permisos').on('submit', (e)=>{
        e.preventDefault();
        _Permisos.permisos();
    });
});
