var _Sms = (function () {
    var TableSms;
    var TablePlantillasSms;
    
    _columnsSms = [
        {"width": "10%"},
        {"width": "10%"},
        {"width": "10%"},
        {"width": "20%"},
        {"width": "25%"},
        {"width": "25%"}
    ];

    _columnsPlantillasSms = [
        {"width": "1%"},
        {"width": "20%"},
        {"width": "69%"},
        {"width": "10%"}
    ];

    TableSms = $("#tableSms").DataTable({
        pagingType: "numbers",
        language: lang_dataTable,
        autoWidth: false,
        searching: true,
        ordering: true,
        paging: true,
        destroy: true,
        pageLength: 10,
        columns: _columnsSms,
        order: [[1, 'asc']]
    });

    TablePlantillasSms = $("#tablePlantillasSms").DataTable({
        pagingType: "numbers",
        language: lang_dataTable,
        autoWidth: false,
        searching: true,
        select: true,
        ordering: true,
        paging: true,
        destroy: true,
        pageLength: 10,
        columns: _columnsPlantillasSms,
        order: [[1, 'asc']]
    });

    var managerView = (evt, name) =>{       

        var i, tabcontent, tablinks;

        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        document.getElementById(name).style.display = "block";
        evt.currentTarget.className += " active";
    }

    var cancelProceso = (event) =>{
        _Sms.managerView(event, 'estadistico');
        $('#cancelproceso').attr('hidden', true);
        $('#crearProc').attr('hidden', false); 
        $('#estaSms').attr('hidden', false);
        $('#graficarLop').attr('hidden', false);
    }

    var listarPlantillasSms = () => {
        $.ajax({
            type:"POST",
            url: "/sms/listarPlantillas/",
            beforeSend: function(){
                $('#idPlantillaSms').val('');
                $('#nombres_plantilla').val('');
                $('#mensajeSmsPlantilla').val('');
                TablePlantillasSms.rows().clear().draw();
                _Globals.alertWait();
            },
            success:function(r){
                var data = JSON.parse(r);
                $.each(data,function(i,e){
                    let iconActivo = '';

                    if(e.activo == true){
                        iconActivo = '<i class="fas fa-toggle-on fa-lg"></i>';
                    }else{
                        iconActivo = '<i class="fas fa-toggle-off fa-lg"></i>';
                    }

                    TablePlantillasSms.row.add([
                        e.id,
                        e.nombre_plantilla,
                        e.contenido,
                        iconActivo
                    ]);
                });
                TablePlantillasSms.draw();
                Swal.close();
            }
        });
    }

    var createPlantilla = () => {
        (async () => {    
            var dataString = $('#form-plantillasSms').serialize();
            let nombre = $("#nombres_plantilla").val();
            var validar = await validarPlantillaExiste(nombre.toUpperCase());

            if(validar == false){
                $.ajax({
                    type: "POST",
                    url: "/sms/CreatePlantilla/",
                    data: dataString,
                    beforeSend: function () {
                        _Globals.alertWait();
                    },
                    success: function (r) { 
                        $('#idPlantillaSms').val('');
                        $('#nombres_plantilla').val('');
                        $('#mensajeSmsPlantilla').val('');
                        if (r) {
                            _Globals.alertProcess("success", "Bien!", "La plantilla fue creada.");
                            _Sms.listarPlantillasSms();
                        } else {
                            _Globals.alertProcess("error", "Error!", "El proceso ha fallado.");
                        }
                    }  
                });
            }else{
                Swal.fire({
                    title: 'Estás Seguro?',
                    text: "Se actualizará la plantilla!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, Actualizar!'
                }).then((result) => {
                    if (result.value) {
                        $.ajax({
                            type:"POST",
                            url: "/sms/UpdatePlantilla/",
                            data: dataString,
                            beforeSend: function(){
                                _Globals.alertWait();
                            },
                            success:function(r){
                                if (!r) {
                                    _Globals.NotifyError("El proceso ha fallado.");
                                } else {
                                    _Sms.listarPlantillasSms();
                                    _Globals.alertProcess("success", "Bien!", "La plantilla se actualizó con éxito.");
                                }
                            }
                        });  
                    }
                });
            }
        })(); 
    }

    var validarPlantillaExiste = async(nombre) => {
        return new Promise(
            (resolve, reject) => {
                $.ajax({
                    type:"POST",
                    url: "/sms/existePlantilla/",
                    data:{
                        "nombre":nombre
                    },
                    beforeSend: function(){
                        _Globals.alertWait();
                    },
                    success:function(r){
                        var data = JSON.parse(r);
                        if (data == 'existe'){
                            resolve(true);
                            return false;
                        }
                        resolve(false);
                    }
                });
            }
        );
    };

    var setPlantillaSeleccionada = (data) => {
        $('#idPlantillaSms').val(data[0]);
        $('#nombres_plantilla').val(data[1]);
        $('#mensajeSmsPlantilla').val(data[2]);
        
        if (data[3].indexOf('toggle-on') !== -1){
            document.getElementById("activePlantillaSms").checked = true;
        }

        if (data[3].indexOf('toggle-off') !== -1){
            document.getElementById("activePlantillaSms").checked = false;
        }
    }

    return{
        listarPlantillasSms:listarPlantillasSms,
        setPlantillaSeleccionada:setPlantillaSeleccionada,
        createPlantilla:createPlantilla,
        managerView: managerView,
        cancelProceso: cancelProceso
    }
    
})(jQuery);

$(document).ready(function () {

    document.getElementById("estaSms").click();

    $('#modalPlantillasSms').on('shown.bs.modal', function (e) {
        _Sms.listarPlantillasSms();
    })

    $('#form-plantillasSms').on('submit', (e)=>{
        e.preventDefault();
        _Sms.createPlantilla();
    });

    $('#tablePlantillasSms tbody').on('click', 'tr', function () {
        var table = $('#tablePlantillasSms').DataTable();
        var data = table.row( this ).data();
        _Sms.setPlantillaSeleccionada(data);
    });

    $('#crearProc').on('click', ()=>{
        $('#crearProc').attr('hidden', true);
        $('#estaSms').attr('hidden', true);
        $('#graficarLop').attr('hidden', true);
        $('#cancelproceso').attr('hidden', false);
    });

    $('#crearProc').on('click', ()=>{
       
    });
});
