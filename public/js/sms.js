var regDateBase = "";
var headers = "";
var dataPlantillasSms = "";
var dataCampanaSms = "";

var _Sms = (function () {
    var currentTabSms = 0;
    var TableSms;
    var TablePlantillasSms;
    var TableCampanasSms;
    var Notify160 = false;
    var Notify320 = false;

    _columnsSms = [{
            "width": "10%"
        },
        {
            "width": "10%"
        },
        {
            "width": "10%"
        },
        {
            "width": "20%"
        },
        {
            "width": "25%"
        },
        {
            "width": "25%"
        }
    ];

    _columnsPlantillasSms = [{
            "width": "1%"
        },
        {
            "width": "20%"
        },
        {
            "width": "69%"
        },
        {
            "width": "10%"
        }
    ];

    _columnsCampanasSms = [{
        "width": "10%"
    },
    {
        "width": "80%"
    },
    {
        "width": "10%"
    }
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
        order: [
            [1, 'asc']
        ]
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
        order: [
            [1, 'asc']
        ]
    });

    TableCampanasSms = $("#tableCampannasSms").DataTable({
        pagingType: "numbers",
        language: lang_dataTable,
        autoWidth: false,
        searching: true,
        select: true,
        ordering: true,
        paging: true,
        destroy: true,
        pageLength: 10,
        columns: _columnsCampanasSms,
        order: [
            [1, 'asc']
        ]
    });

    var managerView = (evt, name) => {

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

    var cancelProceso = (event) => {
        _Sms.managerView(event, 'estadistico');
        $('#cancelproceso').attr('hidden', true);
        $('#crearProc').attr('hidden', false);
        $('#estaSms').attr('hidden', false);
        $('#graficarLop').attr('hidden', false);
    }

    
    var listarPlantillasSms = () => {

        $('#mensajeProceso').val("")
        $('#mensajeProceso').html("")
        $('#mensajeProceso').attr('disabled', false);
        $('#mensajeProceso').focus();
        $('#mensajeProceso').trigger('click');

        $.ajax({
            type: "POST",
            url: "/sms/listarPlantillas/",
            beforeSend: function () {
                $('#idPlantillaSms').val('');
                $('#nombres_plantilla').val('');
                $('#mensajeSmsPlantilla').val('');
                TablePlantillasSms.rows().clear().draw();
                _Globals.alertWait();
            },
            success: function (r) {

                $('#selectPlantilla').empty();
                $('#selectPlantilla').append('<option value="">Seleccione</option>');

                var data = JSON.parse(r);
                dataPlantillasSms = data;

                $.each(data, function (i, e) {
                    let iconActivo = '';

                    if (e.activo == true) {
                        iconActivo = '<i class="fas fa-toggle-on fa-lg"></i>';
                    } else {
                        iconActivo = '<i class="fas fa-toggle-off fa-lg"></i>';
                    }

                    TablePlantillasSms.row.add([
                        e.id,
                        e.nombre_plantilla,
                        e.contenido,
                        iconActivo
                    ]);
                    $('#selectPlantilla').append('<option value="'+ e.id+ '">'+e.nombre_plantilla+'</option>');
                });
                TablePlantillasSms.draw();
                Swal.close();
            }
        });
    }

    var listarCampanasSms = () => {

        $.ajax({
            type: "POST",
            url: "/sms/listarCampanas/",
            beforeSend: function () {
                $('#idCampanaSms').val('');
                $('#nombre_campana').val('');
                TableCampanasSms.rows().clear().draw();
                _Globals.alertWait();
            },
            success: function (r) {

                $('#selectCampana').empty();
                $('#selectCampana').append('<option value="">Seleccione</option>');

                var data = JSON.parse(r);
                dataCampanaSms = data;

                $.each(data, function (i, e) {
                    let iconActivo = '';

                    if (e.activo == true) {
                        iconActivo = '<i class="fas fa-toggle-on fa-lg"></i>';
                    } else {
                        iconActivo = '<i class="fas fa-toggle-off fa-lg"></i>';
                    }

                    TableCampanasSms.row.add([
                        e.id,
                        e.nombre_campana,
                        iconActivo
                    ]);
                    $('#selectCampana').append('<option value="'+ e.id+ '">'+e.nombre_campana+'</option>');
                });
                TableCampanasSms.draw();
                Swal.close();
            }
        });
    }

    var createPlantilla = () => {
        (async () => {
            var dataString = $('#form-plantillasSms').serialize();
            let nombre = $("#nombres_plantilla").val();
            var validar = await validarPlantillaExiste(nombre.toUpperCase());

            if (validar == false) {
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
            } else {
                Swal.fire({
                    title: 'Est??s Seguro?',
                    text: "Se actualizar?? la plantilla!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, Actualizar!'
                }).then((result) => {
                    if (result.value) {
                        $.ajax({
                            type: "POST",
                            url: "/sms/UpdatePlantilla/",
                            data: dataString,
                            beforeSend: function () {
                                _Globals.alertWait();
                            },
                            success: function (r) {
                                if (!r) {
                                    _Globals.NotifyError("El proceso ha fallado.");
                                } else {
                                    _Sms.listarPlantillasSms();
                                    _Globals.alertProcess("success", "Bien!", "La plantilla se actualiz?? con ??xito.");
                                }
                            }
                        });
                    }
                });
            }
        })();
    }

    var validarPlantillaExiste = async (nombre) => {
        return new Promise(
            (resolve, reject) => {
                $.ajax({
                    type: "POST",
                    url: "/sms/existePlantilla/",
                    data: {
                        "nombre": nombre
                    },
                    beforeSend: function () {
                        _Globals.alertWait();
                    },
                    success: function (r) {
                        var data = JSON.parse(r);
                        if (data == 'existe') {
                            resolve(true);
                            return false;
                        }
                        resolve(false);
                    }
                });
            }
        );
    };

    var createCampana = () => {
        (async () => {
            var dataString = $('#form-CampannasSms').serialize();
            let nombre = $("#nombre_campana").val();
            var validar = await validarCampanaExiste(nombre.toUpperCase());

            if (validar == false) {
                $.ajax({
                    type: "POST",
                    url: "/sms/CreateCampana/",
                    data: dataString,
                    beforeSend: function () {
                        _Globals.alertWait();
                    },
                    success: function (r) {
                        $('#idCampanaSms').val('');
                        $('#nombre_campana').val('');
                        if (r) {
                            _Globals.alertProcess("success", "Bien!", "La campa??a fue creada.");
                            _Sms.listarCampanasSms();
                        } else {
                            _Globals.alertProcess("error", "Error!", "El proceso ha fallado.");
                        }
                    }
                });
            } else {
                Swal.fire({
                    title: 'Est??s Seguro?',
                    text: "Se actualizar?? la campa??a!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, Actualizar!'
                }).then((result) => {
                    if (result.value) {
                        $.ajax({
                            type: "POST",
                            url: "/sms/UpdateCampana/",
                            data: dataString,
                            beforeSend: function () {
                                _Globals.alertWait();
                            },
                            success: function (r) {
                                if (!r) {
                                    _Globals.NotifyError("El proceso ha fallado.");
                                } else {
                                    _Sms.listarCampanasSms();
                                    _Globals.alertProcess("success", "Bien!", "La campa??a se actualiz?? con ??xito.");
                                }
                            }
                        });
                    }
                });
            }
        })();
    }

    var validarCampanaExiste = async (nombre) => {
        return new Promise(
            (resolve, reject) => {
                $.ajax({
                    type: "POST",
                    url: "/sms/existeCampana/",
                    data: {
                        "nombre": nombre
                    },
                    beforeSend: function () {
                        _Globals.alertWait();
                    },
                    success: function (r) {
                        var data = JSON.parse(r);
                        if (data == 'existe') {
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

        if (data[3].indexOf('toggle-on') !== -1) {
            document.getElementById("activePlantillaSms").checked = true;
        }

        if (data[3].indexOf('toggle-off') !== -1) {
            document.getElementById("activePlantillaSms").checked = false;
        }
    }

    var setCampanaSeleccionada = (data) => {
        $('#idCampanaSms').val(data[0]);
        $('#nombre_campana').val(data[1]);

        if (data[2].indexOf('toggle-on') !== -1) {
            document.getElementById("activeCampanasSms").checked = true;
        }

        if (data[2].indexOf('toggle-off') !== -1) {
            document.getElementById("activeCampanasSms").checked = false;
        }
    }

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
        x[currentTabSms].style.display = "none";
        currentTabSms = currentTabSms + n;
        if (currentTabSms >= x.length) {
            return false;
        }
        managerSteps(currentTabSms);
    }

    var validateForm = () => {
        var x, y, i, valid = true;
        x = document.getElementsByClassName("tabSteps");
        y = x[currentTabSms].getElementsByTagName("input");
        for (i = 0; i < y.length; i++) {
            if (y[i].value == "") {
                y[i].className += " invalid";
                valid = false;
            }
        }
        t = x[currentTabSms].getElementsByTagName("textarea");
        for (j = 0; j < t.length; j++) {
            if (t[j].value == "") {
                _Globals.NotifyError("El mensaje no puede estar vacio.");
                valid = false;
            }
            if($('#selectCampana').val() == ""){
                _Globals.NotifyError("Debe seleccionar una campa??a.");
                valid = false;
            }
        }
        if (valid) {
            document.getElementsByClassName("step")[currentTabSms].className += " finish";
        }
        return valid;
    }

    var addHeaderMsg = (add) => {
        var msg = $('#mensajeProceso').val();
        if (msg == "") {
            $('#mensajeProceso').val("{{" + add + "}}");
        } else {
            $('#mensajeProceso').val(msg + " {{" + add + "}}");
        }
        $('#mensajeProceso').focus();
        $('#mensajeProceso').trigger('click');
        var cant = $('#mensajeProceso').val().length;
        $('#cantCharacter').html(cant);
        $('#msgPrev').html($('#mensajeProceso').val());
        if(cant > 160 && !Notify160){
            _Globals.NotifyInfo("El mensaje supera los 160 caracteres, se cobrar?? X2.");
            Notify160 = true;
        }
        if(cant > 320 && !Notify320){
            _Globals.NotifyInfo("El mensaje supera los 320 caracteres, se cobrar?? X4.");
            Notify320 = true;
        }
    }

    var countCharacter = (obj) => {
        var strLength = obj.value.length;
        $('#cantCharacter').html(strLength);
        if(strLength > 160 && !Notify160){
            _Globals.NotifyInfo("El mensaje supera los 160 caracteres, se cobrar?? X2.");
            Notify160 = true;
        }
        if(strLength > 320 && !Notify320){
            _Globals.NotifyInfo("El mensaje supera los 320 caracteres, se cobrar?? X4.");
            Notify320 = true;
        }
    }

    var displayHTMLTable = (r) => {
        
        var cantidadDataBase = r.data.length - 1;
        $('#cantidadDataBase').val(cantidadDataBase);
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
                    htmlHeaders += '<a href="javascript:void(0)" onclick="_Sms.addHeaderMsg(' + "'" + headers[i] + "'" + ')"><span class="badge badge-info">' + headers[i] + '</span></a> '
                }
                $('#headersDIV').html(htmlHeaders);
                Swal.close();
            }
        } else {
            _Globals.alertProcess("error", "Error!", "Algo salio mal, recuerde que el delimitador de la base de datos debe ser ';'.");
            $('#baseDeDatos').val("");
        }
    }

    var procesarMasivoSms = () => {

        var formElement = document.getElementById("formSmsMasivo");
        var dateBase = document.getElementById("baseDeDatos");
        
        var dataString = new FormData(formElement);
        dataString.append("file", dateBase.files[0]);
        
        $.ajax({
            type: "POST",
            url: "/sms/procesarMasivo/",
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

    var refreshMensajeProcess = ()=>{
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
    }


    return {
        listarPlantillasSms: listarPlantillasSms,
        setPlantillaSeleccionada: setPlantillaSeleccionada,
        createPlantilla: createPlantilla,
        managerView: managerView,
        managerSteps: managerSteps,
        nextPrev: nextPrev,
        cancelProceso: cancelProceso,
        displayHTMLTable: displayHTMLTable,
        addHeaderMsg: addHeaderMsg,
        countCharacter: countCharacter,
        procesarMasivoSms: procesarMasivoSms,
        refreshMensajeProcess: refreshMensajeProcess,
        listarCampanasSms: listarCampanasSms,
        createCampana: createCampana,
        validarCampanaExiste: validarCampanaExiste,
        setCampanaSeleccionada: setCampanaSeleccionada
    }

})(jQuery);

$(document).ready(function () {

    var currentTabSms = 0;
    _Sms.managerSteps(currentTabSms);
    _Sms.listarPlantillasSms();
    _Sms.listarCampanasSms();

    document.getElementById("estaSms").click();

    $('#modalPlantillasSms').on('shown.bs.modal', function (e) {
        _Sms.listarPlantillasSms();
    })

    $('#modalCampannasSms').on('shown.bs.modal', function (e) {
        _Sms.listarCampanasSms();
    })

    $('#form-plantillasSms').on('submit', (e) => {
        e.preventDefault();
        _Sms.createPlantilla();
    });

    $('#form-CampannasSms').on('submit', (e) => {
        e.preventDefault();
        _Sms.createCampana();
    });

    $('#formSmsMasivo').on('submit', (e) => {
        e.preventDefault();
        _Sms.procesarMasivoSms();
    });

    $('#tablePlantillasSms tbody').on('click', 'tr', function () {
        var table = $('#tablePlantillasSms').DataTable();
        var data = table.row(this).data();
        _Sms.setPlantillaSeleccionada(data);
    });

    $('#tableCampannasSms tbody').on('click', 'tr', function () {
        var table = $('#tableCampannasSms').DataTable();
        var data = table.row(this).data();
        _Sms.setCampanaSeleccionada(data);
    });

    $('#crearProc').on('click', () => {
        $('#crearProc').attr('hidden', true);
        $('#estaSms').attr('hidden', true);
        $('#graficarLop').attr('hidden', true);
        $('#cancelproceso').attr('hidden', false);
    });

    /* Lectura y validacion de archivo CSV */
    $('#baseDeDatos').on('change', () => {
        $('#baseDeDatos').parse({
            config: {
                delimiter: ";",
                worker: true,
                complete: _Sms.displayHTMLTable
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

    $('#mensajeProceso').on('blur', () => {
        _Sms.refreshMensajeProcess();
    });

    $('#nombreProceso').on('blur', () => {
        $('#nombreProcesoP').val($('#nombreProceso').val());
    });
    
    $('#selectPlantilla').on('change', ()=>{
        var position = document.getElementById("selectPlantilla").options.selectedIndex - 1;
        $('#mensajeProceso').val('');
        $('#plantillaSmsS').val('Sin plantilla seleccionada');
        $('#mensajeProceso').html('');
        if($('#selectPlantilla').val() != ""){
            $('#mensajeProceso').val(dataPlantillasSms[position].contenido);
            $('#mensajeProceso').html(dataPlantillasSms[position].contenido);
            $('#mensajeProceso').attr('disabled', true);
        } else {
            $('#mensajeProceso').attr('disabled', false);
        }
        $('#mensajeProceso').focus();
        $('#mensajeProceso').trigger('click');
        $('#plantillaSmsS').val(dataPlantillasSms[position].nombre_plantilla);
        _Sms.refreshMensajeProcess();
        var cant = $('#mensajeProceso').val().length;
        $('#cantCharacter').html(cant);
    });

    $('#selectCampana').on('change', ()=>{
        var position = document.getElementById("selectCampana").options.selectedIndex - 1;
        $('#campanaSmss').val(dataCampanaSms[position].nombre_campana);
    });
});