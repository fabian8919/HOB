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
                    optHerramientas = '<a href="#" onclick="_Clientes.mostrarModalEditarCliente('+e.id+')" ><span class="btn btn-warning btn-sm"><i class="far fa-edit fa-lg"></i></span></a>  ';
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
                TableClientes.draw();
            }
            
        });
        
    }

    var mostrarModalEditarCliente = (id) =>{        
        $.ajax({
            type:"POST",
            url: "/clientes/extraerDataId/",
            data:{
                "id":id
            },
            beforeSend: function(){
            },
            success:function(r){
                var data = JSON.parse(r);
                if(data){
                    $("#Clientes_nit").val(data[0].nit);
                    $("#Clientes_razon_social").val(data[0].razon_social);
                    $("#Clientes_correo").val(data[0].correo);
                    $("#Clientes_direccion").val(data[0].direccion);
                    $("#Clientes_telefono").val(data[0].telefono);
                    if(data[0].activo){
                        $("#Clientes_activo").prop('checked', true);
                    }else{
                        $("#Clientes_activo").prop('checked', false);
                    }
                    $("#modalClientes").modal("show");
                }
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
                _Clientes.drawTable()
                // console.log(r);
            }  
        });
    }

    return {
        clientes:clientes,
        mostrarModalEditarCliente:mostrarModalEditarCliente,
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
