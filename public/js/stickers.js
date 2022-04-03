var _Stickers = (function () {
    var TablePaquetesStickers;
    
    _columnsPaq = [
        {"width": "5%"},
        {"width": "5%"},
        {"width": "45%"},
        {"width": "45%"}
    ];

    TablePaquetesStickers = $("#TablePaquetesStickers").DataTable({
        pagingType: "numbers",
        language: lang_dataTable,
        autoWidth: false,
        searching: true,
        ordering: true,
        select: true,
        paging: true,
        destroy: true,
        pageLength: 10,
        columns: _columnsPaq,
        order: [[1, 'asc']]
    });

    $('#modalCargarStickers').on('click', () => {
        var data = TablePaquetesStickers.rows('.selected').data();
        if (data.length == 0) {
            _Globals.alertProcess("error", "!Error", "Debe seleccionar un paquete de la tabla.");
            return;
        }
        $("#idPaquete").val(data[0][1])
        $("#modal_cargar_stickers").modal("show");
    });
    
    var drawTable = () =>{        
        $.ajax({
            type:"POST",
            url: "/stickers/extraerData/",
            beforeSend: function(){
                TablePaquetesStickers.rows().clear().draw();
                _Globals.alertWait();
            },
            success:function(r){
                var data = JSON.parse(r);
                var optHerramientas;
                $.each(data,function(i,e){
                    optHerramientas = '<a href="#" onclick="_Stickers.modalEditPaquete('+e.id+')" id="'+e.id+'" data-nombre="'+e.nombre+'" data-activo="'+e.activo+'" <span class="btn btn-warning btn-sm"><i class="far fa-edit fa-lg"></i></span></a>  ';
                    optHerramientas += '<a href="#" onclick="_Stickers.eliminarPaquete(' + e.id + ')" data-toggle="tooltip" data-placement="right" data-original-title="Eliminar Registro"><span class="btn btn-danger btn-sm"><i class="far fa-times-circle fa-lg"></i></span></a>';
                    let iconActivo = '';

                    if(e.activo == true){
                        iconActivo = '<i class="fas fa-toggle-on fa-lg"></i>';
                    }else{
                        iconActivo = '<i class="fas fa-toggle-off fa-lg"></i>';
                    }
                    TablePaquetesStickers.row.add([
                        optHerramientas,
                        e.id,
                        e.nombre,
                        iconActivo
                    ]);
                });
                TablePaquetesStickers.draw();
                Swal.close();
            }
            
        });
        
    }

    var paquetes_stickers = () => {
        var dataString = $('#form-paquetes_stickers').serialize();
        
        if($('#opcion_paquete').val() == '1'){
            $.ajax({
                type: "POST",
                url: "/stickers/CrearPaquete/",
                data: dataString,
                beforeSend: function () {
                    _Globals.alertWait();
                },
                success: function (r) { 
                    $('#paquetes_stickers_nombre').prop("required", true);
                    $('#paquetes_stickers_nombre').val('');
                    $('#modalPaquetes_srickers').modal('hide');
                    var data = JSON.parse(r);
                    if (data != 'existe') {
                        _Globals.alertProcess("success", "Bien!", "El proceso fue exitoso.");
                    } else {
                        _Globals.alertProcess("warning", "Advertencia!", "El paquete ya existe.");
                        return false;
                    }
                    _Stickers.mostrarStickers('0')
                    _Stickers.drawTable();
                }  
            });
        }else{
            $.ajax({
                type: "POST",
                url: "/stickers/UpdatePaquete/",
                data: dataString,
                beforeSend: function () {
                    _Globals.alertWait();
                },
                success: function (r) { 
                    $('#paquetes_stickers_nombre').prop("required", true);
                    $('#paquetes_stickers_nombre').val('');
                    $('#idPaqueteStickers').val('');
                    $('#opcion_paquete').val('1');
                    $('#modalPaquetes_srickers').modal('hide');
                    var data = JSON.parse(r);
                    if (data != 'existe') {
                        _Globals.alertProcess("success", "Bien!", "El paquete fue actualizado.");
                    } else {
                        _Globals.alertProcess("warning", "Advertencia!", "Hubo un error.");
                        return false;
                    }
                    _Stickers.drawTable();
                }  
            });
        }
    }

    var eliminarPaquete = (id) =>{
        Swal.fire({
            title: 'Estás Seguro?',
            text: "Se eliminará el paquete!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar!'
        }).then((result) => {
            if (result.value) {
                $.ajax({
                    type:"POST",
                    url: "/stickers/eliminarPaquete/",
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
                            _Stickers.drawTable();
                            _Globals.alertProcess("success", "Bien!", "El paquete se eliminó con exito.");
                        }
                    }
                });  
            }
        });
    }

    var modalEditPaquete = (id) =>{
        var data = document.getElementById(id);
        $('#idPaqueteStickers').val(id);
        $('#opcion_paquete').val('2');
        $('#paquetes_stickers_nombre').val(data.dataset.nombre);
        const activo = document.querySelector("#paquetes_stickers_activo");
        activo.checked = data.dataset.activo;
        $('#modalPaquetes_srickers').modal('show');
    }

    var CargarStickers = () =>{
        var form_data = new FormData();
        var files = $("#files_stickers")[0].files;
        var idPaquete = $("#idPaquete").val();
        form_data.append("idPaquete", idPaquete);
        
        for (var i = 0; i < files.length; i++)
        {
            form_data.append("file", files[i]);
        }
        
        $.ajax({
            url: "/stickers/CargarStickers/",
            type: "POST",
            data: form_data,
            processData: false,
            contentType: false,
            success: function(res) {
                if(res){
                    setTimeout(() =>{_Stickers.mostrarStickers(idPaquete)}, 2000);
                    _Globals.alertProcess("success", "Bien!", "Proceso Finalizado.");
                    $("#modal_cargar_stickers").modal("hide");
                }
            },       
            error: function(res) {
                _Globals.NotifyError("El proceso ha fallado.");
            }       
        });
    }

    var mostrarStickers = (idPaquete) =>{
        $.ajax({
            type:"POST",
            url: "/stickers/extraerStickers/",
            data:{
                "idPaquete": idPaquete
            },
            beforeSend: function(){
                $('#panelStickers').html('');
                _Globals.alertWait();
            },
            success:function(r){
                var data = JSON.parse(r);
                if(data){
                    $.each(data,function(i,e){
                        
                        var stickers = '<div class="col-md-3">'+
                            '<a class="remove-image" href="#" style="display: inline;" onclick="_Stickers.deleteSticker('+e.id+')" id="'+e.id+'" data-paquetestick="'+idPaquete+'" data-pathstick="'+e.ruta+'" >&#215;</a>'+
                            '<img class="img-responsive" style="max-width: 80% !important;margin: 5px;" alt="'+e.nombre+'" src="'+e.ruta+'" >'+
                        '</div>';
    
                        $("#panelStickers").append(stickers);
                    });
                }else{
                    $("#panelStickers").append('<h5>No hay stickers cargados');
                }
                Swal.close();
            }
        });
    }

    var deleteSticker = (id) => {
        var data = document.getElementById(id);
        var path = data.dataset.pathstick;
        var paquete = data.dataset.paquetestick;
        Swal.fire({
            title: 'Estás Seguro?',
            text: "Se eliminará el sticker definitivamente!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar!'
        }).then((result) => {
            if (result.value) {
                $.ajax({
                    type:"POST",
                    url: "/stickers/eliminarSticker/",
                    data:{
                        "id":id,
                        "ruta": path
                    },
                    beforeSend: function(){
                        _Globals.alertWait();
                    },
                    success:function(r){
                        if (!r) {
                            _Globals.NotifyError("El proceso ha fallado.");
                        } else {
                            _Stickers.mostrarStickers(paquete);
                            _Globals.alertProcess("success", "Bien!", "El sticker se eliminó con exito.");
                        }
                    }
                });  
            }
        });
    }

    return {
        paquetes_stickers:paquetes_stickers,
        drawTable:drawTable,
        eliminarPaquete:eliminarPaquete,
        modalEditPaquete:modalEditPaquete,
        CargarStickers:CargarStickers,
        mostrarStickers:mostrarStickers,
        deleteSticker:deleteSticker
    }
    
})(jQuery);

$(document).ready(function () {
    _Stickers.drawTable();
    
    $('#form-paquetes_stickers').on('submit', (e)=>{
        e.preventDefault();
        _Stickers.paquetes_stickers();
    });

    $('#form-cargar_stickers').on('submit', (e)=>{
        e.preventDefault();
        _Stickers.CargarStickers();
    });

    $('#TablePaquetesStickers tbody').on('click', 'tr', function () {
        var table = $('#TablePaquetesStickers').DataTable();
        var data = table.row( this ).data();
        _Stickers.mostrarStickers(data[1])
    });
});
