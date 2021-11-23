var _Clientes = (function () {
    var TableClientes;
    
    _columnsCli = [
        {"width": "5%"},
        {"width": "5%"},
        {"width": "14%"},
        {"width": "20%"},
        {"width": "15%"},
        {"width": "15%"},
        {"width": "10%"},
        {"width": "15%"},
        {"width": "1%"}
    ];

    TableClientes = $("#tableClientes").DataTable({
        pagingType: "numbers",
        language: lang_dataTable,
        autoWidth: false,
        searching: true,
        ordering: true,
        paging: true,
        destroy: true,
        pageLength: 10,
        columns: _columnsCli,
        order: [[1, 'asc']]
    });
    
    var drawTable = () =>{        
        $.ajax({
            type:"POST",
            url: "/clientes/extraerData/",
            beforeSend: function(){
                TableClientes.rows().clear().draw();
                
            },
            success:function(r){
                var data = JSON.parse(r);
                console.log(data);
                var optHerramientas;
                $.each(data,function(i,e){
                    optHerramientas = '<a href="#" onclick="mostrarModalEditarCategoria('+e.id+')" id="editarCategoria'+e.id+'" data-toggle="tooltip" data-placement="left" data-original-title="Editar Registro"><span class="btn btn-warning btn-sm"><i class="far fa-edit fa-lg"></i></span></a>  ';
                    optHerramientas += '<a href="#" onclick="mostrarModalDeleteCategoria('+e.id+')" id="deleteCategoria'+e.id+'" data-toggle="tooltip" data-placement="right" data-original-title="Eliminar Registro"><span class="btn btn-danger btn-sm"><i class="far fa-times-circle fa-lg"></i></span></a>';
                    TableClientes.row.add([
                        optHerramientas,
                        e.id,
                        e.nit,
                        e.razon_social,
                        e.telefono,
                        e.direccion,
                        e.correo,
                        e.fecha,
                        e.activo
                    ]);
                });
                console.log(TableClientes.rows);
                TableClientes.draw();
            }
            
        });
        
    }

    var clientes = () => {

        var dataString = $('#form-clientes').serialize();
        
        $.ajax({
            type: "POST",
            url: "/clientes/",
            data: dataString,
            beforeSend: function () {
                //$('#preload').show();
            },
            success: function (r) { 
                console.log(r);
            }  
        });
    }

    return {
        clientes:clientes,
        drawTable:drawTable
    }
    
})(jQuery);

$(document).ready(function () {
    _Clientes.drawTable();
    $('#form-clientes').on('submit', (e)=>{
        e.preventDefault();
        _Clientes.clientes();
    });

});
