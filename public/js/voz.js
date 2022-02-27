var _Voz = (function () {
    var TableVoz;
    var tablePlantillasVoz;
    
    _columnsVoz = [
        {"width": "10%"},
        {"width": "10%"},
        {"width": "10%"},
        {"width": "20%"},
        {"width": "25%"},
        {"width": "25%"}
    ];

    _columnsPlantillasVoz = [
        {"width": "1%"},
        {"width": "20%"},
        {"width": "69%"},
        {"width": "10%"}
    ];

    TableVoz = $("#tableVoz").DataTable({
        pagingType: "numbers",
        language: lang_dataTable,
        autoWidth: false,
        searching: true,
        ordering: true,
        paging: true,
        destroy: true,
        pageLength: 10,
        columns: _columnsVoz,
        order: [[1, 'asc']]
    });

    tablePlantillasVoz = $("#tablePlantillasVoz").DataTable({
        pagingType: "numbers",
        language: lang_dataTable,
        autoWidth: false,
        searching: true,
        ordering: true,
        paging: true,
        destroy: true,
        pageLength: 10,
        columns: _columnsPlantillasVoz,
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
        _Voz.managerView(event, 'estadistico');
        $('#cancelproceso').attr('hidden', true);
        $('#crearProc').attr('hidden', false); 
        $('#estaVoz').attr('hidden', false);
        $('#graficarLop').attr('hidden', false);
    }

    var listarPlantillasVoz = () => {
        $.ajax({
            type:"POST",
            url: "/voz/listarPlantillas/",
            beforeSend: function(){
                $('#idPlantillaVoz').val('');
                $('#nombres_plantilla').val('');
                $('#mensajeVozPlantilla').val('');
                tablePlantillasVoz.rows().clear().draw();
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

                    tablePlantillasVoz.row.add([
                        e.id,
                        e.nombre_plantilla,
                        e.contenido,
                        iconActivo
                    ]);
                });
                tablePlantillasVoz.draw();
                Swal.close();
            }
        });
    }

    var createPlantilla = () => {
        (async () => {    
            var dataString = $('#form-plantillasVoz').serialize();
            let nombre = $("#nombres_plantilla").val();
            var validar = await validarPlantillaExiste(nombre.toUpperCase());

            if(validar == false){
                $.ajax({
                    type: "POST",
                    url: "/voz/CreatePlantilla/",
                    data: dataString,
                    beforeSend: function () {
                        _Globals.alertWait();
                    },
                    success: function (r) { 
                        $('#idPlantillaVoz').val('');
                        $('#nombres_plantilla').val('');
                        $('#mensajeVozPlantilla').val('');
                        if (r) {
                            _Globals.alertProcess("success", "Bien!", "La plantilla fue creada.");
                            _Voz.listarPlantillasVoz();
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
                            url: "/voz/UpdatePlantilla/",
                            data: dataString,
                            beforeSend: function(){
                                _Globals.alertWait();
                            },
                            success:function(r){
                                if (!r) {
                                    _Globals.NotifyError("El proceso ha fallado.");
                                } else {
                                    _Voz.listarPlantillasVoz();
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
                    url: "/voz/existePlantilla/",
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
        $('#idPlantillaVoz').val(data[0]);
        $('#nombres_plantilla').val(data[1]);
        $('#mensajeVozPlantilla').val(data[2]);
        
        if (data[3].indexOf('toggle-on') !== -1){
            document.getElementById("activePlantillaVoz").checked = true;
        }

        if (data[3].indexOf('toggle-off') !== -1){
            document.getElementById("activePlantillaVoz").checked = false;
        }
    }

    return{
        listarPlantillasVoz:listarPlantillasVoz,
        setPlantillaSeleccionada:setPlantillaSeleccionada,
        createPlantilla:createPlantilla,
        managerView: managerView,
        cancelProceso: cancelProceso
    }
    
})(jQuery);

$(document).ready(function () {

    document.getElementById("estaVoz").click();

    $('#modalPlantillasVoz').on('shown.bs.modal', function (e) {
        _Voz.listarPlantillasVoz();
    })

    $('#form-plantillasVoz').on('submit', (e)=>{
        e.preventDefault();
        _Voz.createPlantilla();
    });

    $('#tablePlantillasVoz tbody').on('click', 'tr', function () {
        var table = $('#tablePlantillasVoz').DataTable();
        var data = table.row( this ).data();
        _Voz.setPlantillaSeleccionada(data);
    });

    $('#crearProc').on('click', ()=>{
        $('#crearProc').attr('hidden', true);
        $('#estaVoz').attr('hidden', true);
        $('#graficarLop').attr('hidden', true);
        $('#cancelproceso').attr('hidden', false);
    });

    $('#crearProc').on('click', ()=>{
       
    });
});
