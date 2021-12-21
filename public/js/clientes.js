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
                _Globals.alertWait();
            },
            success:function(r){
                var data = JSON.parse(r);
                var optHerramientas;
                $.each(data,function(i,e){
                    optHerramientas = '<a href="#" onclick="_Clientes.editarCliente('+e.id+')" ><span class="btn btn-warning btn-sm"><i class="far fa-edit fa-lg"></i></span></a>  ';
                    // optHerramientas += '<a href="#" onclick="_Clientes.eliminarCliente(' + e.nit + ')" data-toggle="tooltip" data-placement="right" data-original-title="Eliminar Registro"><span class="btn btn-danger btn-sm"><i class="far fa-times-circle fa-lg"></i></span></a>';
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
                Swal.close();
            }
            
        });
        
    }

    var editarCliente = (id) =>{        
        $.ajax({
            type:"POST",
            url: "/clientes/extraerDataId/",
            data:{
                "id":id
            },
            beforeSend: function(){
                _Globals.alertWait();
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
                    Swal.close();
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
                _Globals.alertWait();
            },
            success: function (r) { 
                $('#Clientes_nit').prop("required", true);
                $('#Clientes_nit').val('');
                $('#Clientes_razon_social').val('');
                $('#Clientes_correo').val('');
                $('#Clientes_direccion').val('');
                $("#Clientes_telefono").val('');
                $('#modalClientes').modal('hide');
                if (r) {
                    _Clientes.drawTable();
                    _Globals.alertProcess("success", "Bien!", "El proceso fue exitoso.");
                } else {
                    _Globals.alertProcess("error", "Error!", "El proceso ha fallado.");
                }
            }  
        });
    }

    var eliminarCliente = (id) => {
        Swal.fire({
            title: 'Estás Seguro?',
            text: "Se eliminará el cliente!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar!'
        }).then((result) => {
            if (result.value) {
                $.ajax({
                    type:"POST",
                    url: "/clientes/eliminarCliente/",
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
                            _Clientes.drawTable();
                            _Globals.alertProcess("success", "Bien!", "El cliente se eliminó con exito.");
                        }
                    }
                });  
            }
        });
    }

    var limpiar = () =>{
        $("#Clientes_nit").val('');
        $("#Clientes_razon_social").val('');
        $("#Clientes_correo").val('');
        $("#Clientes_direccion").val('');
        $("#Clientes_telefono").val('');
    }

    return {
        clientes:clientes,
        editarCliente:editarCliente,
        eliminarCliente:eliminarCliente,
        drawTable:drawTable,
        limpiar:limpiar
    }
    
})(jQuery);

$(document).ready(function () {
    _Clientes.drawTable();
    $('#form-clientes').on('submit', (e)=>{
        e.preventDefault();
        _Clientes.clientes();
    });

});
