var _RedSocial = (function () {
    var TableRedesDisponibles;
    
    _columnsDisp = [
        {"width": "5%"},
        {"width": "5%"},
        {"width": "90%"},
    ];

    TableRedesDisponibles = $("#TableRedesDisponibles").DataTable({
        pagingType: "numbers",
        language: lang_dataTable,
        autoWidth: false,
        searching: true,
        ordering: true,
        select: false,
        paging: true,
        destroy: true,
        pageLength: 10,
        columns: _columnsDisp,
        order: [[1, 'asc']]
    });

    var TableRedesAsociadas;
    
    _columnsAsoc = [
        {"width": "5%"},
        {"width": "5%"},
        {"width": "30%"},
        {"width": "60%"},
    ];

    TableRedesAsociadas = $("#TableRedesAsociadas").DataTable({
        pagingType: "numbers",
        language: lang_dataTable,
        autoWidth: false,
        searching: true,
        ordering: true,
        select: false,
        paging: true,
        destroy: true,
        pageLength: 10,
        columns: _columnsAsoc,
        order: [[1, 'asc']]
    });

    var GetRedes = () => {
        $.ajax({
            type:"POST",
            url: "/apiMensajeria/GetRedes/",
            beforeSend: function(){
                TableRedesDisponibles.rows().clear().draw();
                _Globals.alertWait();
            },
            success:function(r){
                var data = JSON.parse(r);
                $.each(data,function(i,e){
                    var icono = '<span class="'+e.icono+'"></span>';
                    TableRedesDisponibles.row.add([
                        e.tipo,
                        icono,
                        e.red
                    ]);
                });
                TableRedesDisponibles.draw();
                Swal.close();
            }
            
        });
    }

    var GetRedesAsociadas = () => {
        $.ajax({
            type:"POST",
            url: "/apiMensajeria/GetRedesAsociadas/",
            beforeSend: function(){
                TableRedesAsociadas.rows().clear().draw();
                _Globals.alertWait();
            },
            success:function(r){
                var data = JSON.parse(r);
                $.each(data,function(i,e){
                    var icono = '<span class="'+e.icono+'"></span>';
                    TableRedesAsociadas.row.add([
                        e.id,
                        icono,
                        e.red,
                        e.channel_id
                    ]);
                });
                TableRedesAsociadas.draw();
                Swal.close();
            }
            
        });
    }

    var AsociarRedSocial = (data) =>{

        Swal.fire({
            title: data[2],
            text: 'Debes digitar un channel id',
            input: 'text',
            inputAttributes: {
              autocapitalize: 'off',
            },
            preConfirm: (value) => {
                if (!value) {
                  Swal.showValidationMessage(
                    'Debes digitar el channel id'
                  )
                }
            },
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            showLoaderOnConfirm: true,
            allowOutsideClick: false
        }).then((result) => {
            if (result.value) {
                $.ajax({
                    type:"POST",
                    url: "/apiMensajeria/createChannelId/",
                    data:{
                        "tipo": data[0],
                        "bird": result.value
                    },
                    beforeSend: function(){
                        _Globals.alertWait();
                    },
                    success:function(r){
                        var data = JSON.parse(r);
                        if(data == true) {
                            setTimeout(() =>{_RedSocial.GetRedes()}, 1000);
                            setTimeout(() =>{_RedSocial.GetRedesAsociadas()}, 1000);
                            _Globals.alertProcess("success", "Bien!", "El proceso fue exitoso.");
                        } else {
                            _Globals.alertProcess("error", "Error!", "El proceso ha fallado.");
                        }
                        Swal.close();
                    }
                });  
            }
        });
    }

    var validarBirdKey = () => {
        $.ajax({
            type: "POST",
            url: "/apiMensajeria/validarBirdKey/",
            beforeSend: function () {
                _Globals.alertWait();
            },
            success: function (r) { 
                var data = JSON.parse(r);
                
                if(data == false){
                    Swal.fire({
                        title: 'Es necesario crear un bird key',
                        input: 'text',
                        inputAttributes: {
                          autocapitalize: 'off',
                        },
                        preConfirm: (value) => {
                            if (!value) {
                              Swal.showValidationMessage(
                                'Debes digitar el bird key'
                              )
                            }
                        },
                        icon: 'info',
                        showCancelButton: false,
                        confirmButtonText: 'Guardar',
                        showLoaderOnConfirm: true,
                        allowOutsideClick: false
                    }).then((result) => {
                        if (result.value) {
                            $.ajax({
                                type:"POST",
                                url: "/apiMensajeria/createBirdKey/",
                                data:{
                                    "bird": result.value
                                },
                                beforeSend: function(){
                                    _Globals.alertWait();
                                },
                                success:function(r){
                                    var data = JSON.parse(r);
                                    $("#birdKey").val(data[0].bird_key)
                                    $("#idBirdKey").val(data[0].id)
                                    $("#btnShowEdit").attr('hidden', false);
                                    $("#rowBirdKey").attr('hidden', true);
                                    Swal.close();
                                }
                            });  
                        }
                    });
                }else{
                    $("#btnShowEdit").attr('hidden', false);
                    $("#rowBirdKey").attr('hidden', true);
                    $("#birdKey").val(data[0].bird_key)
                    $("#idBirdKey").val(data[0].id)
                    Swal.close();
                }
            }  
        });
    }

    var redSocial = () => {

        var dataString = $('#form-redSocial').serialize();
        
        $.ajax({
            type: "POST",
            url: "/apiMensajeria/redSocial/",
            data: dataString,
            beforeSend: function () {
                _Globals.alertWait();
            },
            success: function (r) { 
                var data = JSON.parse(r);
                $('#redSocial_name').prop("required", true);
                $('#redSocial_name').val('');
                $('#modalRedSocial').modal('hide');
                if (data == 'existe') {
                    _Globals.alertProcess("warning", "Error!", "La red social ya existe.");
                }else if(data == true) {
                    _RedSocial.GetRedes();
                    _Globals.alertProcess("success", "Bien!", "El proceso fue exitoso.");
                } else {
                    _Globals.alertProcess("error", "Error!", "El proceso ha fallado.");
                }
            }  
        });
    }

    var icons = [{icon: 'fab fa-whatsapp'}, {icon: 'fab fa-facebook'}, {icon: 'fab fa-facebook-messenger'}, {icon: 'fab fa-telegram-plane'}, {icon: 'fab fa-twitter'}, {icon: 'fab fa-instagram'}, {icon: 'fab fa-weixin'}, {icon: 'fab fa-viber'}, {icon: 'fab fa-tumblr'}, {icon: 'fab fa-twitch'}, {icon: 'fab fa-snapchat-ghost'}, {icon: 'fab fa-skype'}, {icon: 'fab fa-line'}];
    var itemTemplate = $('.icon-picker-list').clone(true).html();
    
    $('.icon-picker-list').html('');
    $(icons).each(function(index) {
        var itemtemp = itemTemplate;
        var item = icons[index].icon;
    
        itemtemp = itemtemp.replace(/{{item}}/g, item).replace(/{{index}}/g, index);
        $('.icon-picker-list').append(itemtemp);
    });

    var EditBirdKey = () =>{
        var id = $("#idBirdKey").val();
        var birdKey = $("#birdKey").val();

        $.ajax({
            type: "POST",
            url: "/apiMensajeria/updateBirdKey/",
            data:  {
                "id": id,
                "birKey": birdKey
            },
            beforeSend: function () {
                _Globals.alertWait();
            },
            success: function (r) { 
                var data = JSON.parse(r);
                if(data == true) {
                    $("#rowBirdKey").attr('hidden', true);
                    _Globals.alertProcess("success", "Bien!", "El bird key fue modificado con exito.");
                } else {
                    _Globals.alertProcess("error", "Error!", "El proceso ha fallado.");
                }               
            }  
        });
    }

    return{  
        GetRedes:GetRedes,
        GetRedesAsociadas:GetRedesAsociadas,
        AsociarRedSocial:AsociarRedSocial,
        validarBirdKey:validarBirdKey,
        redSocial:redSocial,
        EditBirdKey:EditBirdKey
    }
})(jQuery);

$(document).ready(function () {

    _RedSocial.validarBirdKey();
    _RedSocial.GetRedes();
    _RedSocial.GetRedesAsociadas();
    $('#form-redSocial').on('submit', (e)=>{
        e.preventDefault();
        _RedSocial.redSocial();
    });

    $('.picker-button').click(function() {
        $('#iconPicker').modal('show');
    });

    $(document).on('click', '.icon-picker-list a', function() {
        let selectedIcon = $(this).data('index');
        let name = $(this).data('class');
        $('.icon-picker-list a').removeClass('active');
        $('.icon-picker-list a').eq(selectedIcon).addClass('active');
        $("#redSocial_icono").val(name);
        $('#iconPicker').modal('hide');
    }); 

    $("#btnShowEdit").click(function() {
        var div = document.getElementById("rowBirdKey");
        var oculto = div.getAttribute("hidden");
        if(oculto == null){
            $("#rowBirdKey").attr('hidden', true);
        }else{
            $("#rowBirdKey").attr('hidden', false);
        }
    });

    $('#TableRedesDisponibles tbody').on('click', 'tr', function () {
        var table = $('#TableRedesDisponibles').DataTable();
        var data = table.row(this).data();
        _RedSocial.AsociarRedSocial(data);
    });
});