var regDateBase = "";
var headers = "";

var _Voz = (function () {
    var TableVoz;
    var tablePlantillasVoz;
    var currentTab = 0;
    
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

    var managerSteps = (n) => {
        var x = document.getElementsByClassName("tabSteps");
        x[n].style.display = "block";
        if (n == 0) {
            document.getElementById("prevBtn").style.display = "none";
        } else {
            document.getElementById("prevBtn").style.display = "inline";
        }

        if (n == (x.length - 1)) {
            document.getElementById("nextBtn").innerHTML = "Procesar";
        } else {
            document.getElementById("nextBtn").innerHTML = "Siguiente";
        }
        
        var i, x = document.getElementsByClassName("step");
        for (i = 0; i < x.length; i++) {
            x[i].className = x[i].className.replace(" active", "");
        }
        x[n].className += " active";
    }

    var nextPrev = (n) => {
        var x = document.getElementsByClassName("tabSteps");
        if (n == 1 && !validateForm()) return false;
        x[currentTab].style.display = "none";
        currentTab = currentTab + n;
        if (currentTab >= x.length) {
            $('#nextBtn').removeAttr('onclick');
            $('#nextBtn').attr('type', 'submit');
            return false;
        }
        managerSteps(currentTab);
    }

    var validateForm = () => {
        var x, y, i, valid = true;
        x = document.getElementsByClassName("tabSteps");
        y = x[currentTab].getElementsByTagName("input");
        for (i = 0; i < y.length; i++) {
            if (y[i].value == "") {
                y[i].className += " invalid";
                valid = false;
            }
        }
        t = x[currentTab].getElementsByTagName("textarea");
        for (j = 0; j < t.length; j++) {
            if (t[j].value == "") {
                _Globals.NotifyError("El mensaje no puede estar vacio.");
                valid = false;
            }
        }
        if (valid) {
            document.getElementsByClassName("step")[currentTab].className += " finish";
        }
        return valid;
    }

    var displayHTMLTable = (r) => {
        
        var cantidadDataBase = r.data.length - 1;
        $('#cantidadDataBase').html(cantidadDataBase);
        $('#nombreDataBase').val($('#baseDeDatos').val().split("\\").pop());
        
        if(Array.isArray(r.data[0])) {
            
            headers = r.data[0];
            regDateBase = r.data[1];
            
            if (headers.indexOf("celular") == -1) {
                _Globals.alertProcess("error", "Error!", "La columna celular debe estar presente en la base de datos.");
                $('#baseDeDatos').val("");
            } else {
                var htmlHeaders = "";
                for (let i = 0; i < headers.length; i++) {
                    htmlHeaders += '<a href="javascript:void(0)" onclick="_Voz.addHeaderMsg(' + "'" + headers[i] + "'" + ')"><span class="badge badge-info">' + headers[i] + '</span></a> '
                }
                $('#headersDIV').html(htmlHeaders);
                Swal.close();
            }
        } else {
            _Globals.alertProcess("error", "Error!", "Algo salio mal, recuerde que el delimitador de la base de datos debe ser ';'.");
            $('#baseDeDatos').val("");
        }
    }

    var addHeaderMsg = (add) => {
        var msg = $('#mensajeProceso').val();
        if (msg == "") {
            $('#mensajeProceso').val("{{" + add + "}}");
        } else {
            $('#mensajeProceso').val(msg + " {{" + add + "}}");
        }
        var cant = $('#mensajeProceso').val().length;
        $('#cantCharacter').html(cant);
        $('#mensajeProceso').focus();
        $('#mensajeProceso').trigger('click');
    }

    var countCharacter = (obj)=>{
        var strLength = obj.value.length;
        $('#cantCharacter').html(strLength);
    }

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

    var procesarMasivoVoz = () => {
        var formElement = document.getElementById("formVozMasivo");
        var dateBase = document.getElementById("baseDeDatos");
        
        var dataString = new FormData(formElement);
        dataString.append("file", dateBase.files[0]);
        
        $.ajax({
            type: "POST",
            url: "/voz/procesarMasivo/",
            data: dataString,
            processData: false,
            contentType: false,
            beforeSend: function () {
                _Globals.alertWait();
            },
            success: function (r) {
                console.log(r)
            }
        });
    }

    return{
        listarPlantillasVoz:listarPlantillasVoz,
        setPlantillaSeleccionada:setPlantillaSeleccionada,
        createPlantilla:createPlantilla,
        managerView: managerView,
        cancelProceso: cancelProceso,
        managerSteps: managerSteps,
        nextPrev: nextPrev,
        countCharacter: countCharacter,
        validateForm: validateForm,
        displayHTMLTable: displayHTMLTable,
        addHeaderMsg: addHeaderMsg,
        procesarMasivoVoz: procesarMasivoVoz
    }
    
})(jQuery);

$(document).ready(function () {
    var currentTab = 0;
    _Voz.managerSteps(currentTab);

    document.getElementById("estaVoz").click();

    /* Lectura y validacion de archivo CSV */
    $('#baseDeDatos').on('change', () => {
        $('#baseDeDatos').parse({
            config: {
                delimiter: ";",
                worker: true,
                complete: _Voz.displayHTMLTable
            },
            before: function (file, inputElem) {
                _Globals.alertWait("Cargando archivo...");
            },
            error: function (err, file) {
                _Globals.alertProcess("error", "Error!", "Error al leer la base de datos " + file + ", el error es: " + err);
            },
            complete: function () {
                //Swal.close();
            }
        });
    });

    $('#modalPlantillasVoz').on('shown.bs.modal', function (e) {
        _Voz.listarPlantillasVoz();
    })

    $('#form-plantillasVoz').on('submit', (e)=>{
        e.preventDefault();
        _Voz.createPlantilla();
    });

    $('#formVozMasivo').on('submit', (e) => {
        e.preventDefault();
        _Voz.procesarMasivoVoz();
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

    $('#mensajeProceso').on('blur', () => {
        
        /* Crando variables iniciales */
        var msgIni = $('#mensajeProceso').val();
        var msgBef = "";
        var camposMsg = [];
        var msg = msgIni.split("{{");
        
        for (var i = 1; i < msg.length; i++) {
            camposMsg.push(msg[i].split("}}")[0]);
        }

        for (var j = 0; j < camposMsg.length; j++) {
            for (var e = 0; e < headers.length; e++) {
                if(camposMsg[j] == headers[e]){
                    if(msgBef == ""){
                        msgBef = msgIni.replaceAll("{{"+camposMsg[j]+"}}", regDateBase[e]);
                    } else {
                        msgBef = msgBef.replaceAll("{{"+camposMsg[j]+"}}", regDateBase[e]);
                    }
                }
            }
        }
        
        $('#msgPrev').html((!msgBef) ? msgIni : msgBef);
        $('#mensajeProcesoBef').html((!msgBef) ? msgIni : msgBef);
    });

    $('#nombreProceso').on('blur', () => {
        $('#nombreProcesoP').val($('#nombreProceso').val());
    });

});
