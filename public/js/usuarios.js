var _Usuarios = (function () {
    var TableUsuarios;
    var tableClientesUS;
    var tableModulosUS;
    var tablePermisosUS;
    var idUserUpdate;

    _columnsUsu = [
        { "width": "5%" },
        { "width": "5%" },
        { "width": "15%" },
        { "width": "20%" },
        { "width": "15%" },
        { "width": "15%" },
        { "width": "10%" },
        { "width": "15%" },
    ];

    _columnsUsuC = [
        { "width": "90%" },
        { "width": "10%" }
    ];

    TableUsuarios = $("#tableUsuarios").DataTable({
        pagingType: "numbers",
        language: lang_dataTable,
        autoWidth: false,
        searching: true,
        ordering: true,
        paging: true,
        select: true,
        destroy: true,
        pageLength: 10,
        columns: _columnsUsu,
        order: [[1, 'desc']]
    });

    $('#modalUserClieButton').on('click', () => {
        var data = TableUsuarios.rows('.selected').data();
        if (data.length == 0) {
            _Globals.alertProcess("error", "!Error", "Debe seleccionar un usuario de la tabla.");
            return;
        }
        idUserUpdate = data[0][1];
        _Usuarios.extraerClientes();
        _Usuarios.extraerClientesId(idUserUpdate);
    });

    tableClientesUS = $("#tableClientesUS").DataTable({
        pagingType: "numbers",
        language: lang_dataTable,
        autoWidth: false,
        searching: true,
        ordering: true,
        paging: true,
        destroy: true,
        pageLength: 10,
        columns: _columnsUsuC,
        order: [[1, 'asc']]
    });

    tableModulosUS = $("#tableModulosUS").DataTable({
        pagingType: "numbers",
        language: lang_dataTable,
        autoWidth: false,
        searching: true,
        ordering: true,
        paging: true,
        destroy: true,
        pageLength: 10,
        columns: _columnsUsuC,
        order: [[1, 'asc']]
    });

    tablePermisosUS = $("#tablePermisosUS").DataTable({
        pagingType: "numbers",
        language: lang_dataTable,
        autoWidth: false,
        searching: true,
        ordering: true,
        paging: true,
        destroy: true,
        pageLength: 10,
        columns: _columnsUsuC,
        order: [[1, 'asc']]
    });

    var drawTable = () => {
        $.ajax({
            type: "POST",
            url: "/usuarios/extraerData/",
            beforeSend: function () {
                TableUsuarios.rows().clear().draw();
                _Globals.alertWait();
            },
            success: function (r) {
                var data = JSON.parse(r);
                var optHerramientas;
                $.each(data, function (i, e) {
                    optHerramientas = '<a href="#" onclick="_Usuarios.editarUsuario(' + e.id + ')" id="editarUsuario' + e.id + '" data-toggle="tooltip" data-placement="left" data-original-title="Editar Registro"><span class="btn btn-warning btn-sm"><i class="far fa-edit fa-lg"></i></span></a>  ';
                    optHerramientas += '<a href="#" onclick="_Usuarios.eliminarUsuario(' + e.id + ')" id="deleteUusario' + e.id + '" data-toggle="tooltip" data-placement="right" data-original-title="Eliminar Registro"><span class="btn btn-danger btn-sm"><i class="fas fa-user-times"></i></span></a>';
                    TableUsuarios.row.add([
                        optHerramientas,
                        e.id,
                        e.cedula,
                        e.nombre,
                        e.correo,
                        moment(e.fecha).format("YYYY-MM-DD"),
                        (e.activo) ? "Activo" : "Inactivo",
                        (e.bloqueado) ? "Bloqueado" : "Desbloqueado"
                    ]);
                });
                TableUsuarios.draw();
                Swal.close();
            }

        });

    }

    var usuarios = () => {

        var dataString = $('#form-usuarios').serialize();

        $.ajax({
            type: "POST",
            url: "/usuarios/",
            data: dataString,
            beforeSend: function () {
                _Globals.alertWait();
            },
            success: function (r) {
                $('#contrasena').prop("required", true);
                $('#contrasena').val('');
                $('#cedula').val('');
                $('#nombre').val('');
                $('#correo').val('');
                $('#modalUsuarios').modal('hide');
                if (r) {
                    _Globals.alertProcess("success", "Bien!", "El proceso fue exitoso.");
                } else {
                    _Globals.alertProcess("error", "Error!", "El proceso ha fallado.");
                }
                _Usuarios.drawTable();
            }
        });
    }

    var editarUsuario = (id) => {
        $.ajax({
            type: "POST",
            url: "/usuarios/ExtraerId/",
            data: { "id": id },
            beforeSend: function () {
                _Globals.alertWait();
            },
            success: function (r) {
                var data = JSON.parse(r);

                const activo = document.querySelector("#activo");
                const bloqueado = document.querySelector("#bloqueado");

                $('#cedula').val(data[0].cedula);
                $('#nombre').val(data[0].nombre);
                $('#correo').val(data[0].correo);
                activo.checked = data[0].activo;
                bloqueado.checked = data[0].bloqueado;
                $('#modalUsuarios').modal('show');
                $('#contrasena').removeAttr("required");
                Swal.close();
            }
        });
    }

    var eliminarUsuario = (id) => {
        Swal.fire({
            icon: 'question',
            title: 'Para eliminar el usuario debe ingresar su contraseña',
            input: 'text',
            input: 'password',
            inputAttributes: {
                autocapitalize: 'off',
                maxlength: 50
            },
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Confirmar',
            showLoaderOnConfirm: true,
            preConfirm: (pass) => {
                if (!pass) {
                    Swal.showValidationMessage(
                        "La contraseña no puede estar vacia."
                    )
                } else {
                    $.ajax({
                        type: "POST",
                        url: "/usuarios/ValidarContrasena/",
                        data: { "contrasena": pass, "id": id },
                        success: function (r) {
                            if (!r) {
                                _Globals.NotifyError("La contraseña es incorrecta.");
                            } else {
                                _Usuarios.drawTable();
                                _Globals.alertProcess("success", "Bien!", "El usuario se eliminó con exito.");
                            }
                        }
                    });
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        });
    }

    var validarDuplicado = (cedula) => {
        $.ajax({
            type: "POST",
            url: "/usuarios/DuplicadoCedula/",
            data: { "cedula": cedula },
            success: function (r) {
                if (!r) {
                    _Globals.NotifyInfo("El usuario ya existe, los datos que ingrese actualizarán el usuario.");
                }
            }
        });
    }

    var extraerClientes = () => {
        $.ajax({
            type: "POST",
            url: "/clientes/extraerData/",
            beforeSend: function () {
                _Globals.alertWait();
            },
            success: function (r) {
                $('#clientesAsgUsu').empty();
                var data = JSON.parse(r);
                $('#clientesAsgUsu').append('<option value="">Seleccionar</option>');
                $.each(data, function (i, e) {
                    $('#clientesAsgUsu').append('<option value="' + e.nit + '">' + e.razon_social + '</option>');
                });
                $('#modalUsuariosClientesRela').modal('show');
                Swal.close();
            }
        });
    }

    var extraerClientesId = (id) => {
        $.ajax({
            type: "POST",
            url: "/clientes/extraerUsuariosId/",
            data: { "idusuario": id },
            beforeSend: function () {
                tableClientesUS.rows().clear().draw();
                _Globals.alertWait();
            },
            success: function (r) {
                if (!r) {
                    return;
                } else if (r.error) {
                    _Globals.alertProcess("error", "!Error", r.error);
                } else {
                    $.each(r, function (i, e) {
                        tableClientesUS.row.add([
                            e.razon_social,
                            '<a href="#" onclick="_Usuarios.desAsociarCliente(' + e.nit + ')"><span style="font-size:15px;color:red;"><i class="fas fa-trash"></i> Eliminar</span></a>'
                        ]);
                    });
                    tableClientesUS.draw();
                }
                Swal.close();
            }
        });
    }

    var incluirCliente = (idcliente) => {
        if(!idcliente){
            _Globals.alertProcess("error", "!Error", "Debe seleccionar un cliente.");
            return;
        }
        $.ajax({
            type: "POST",
            url: "/usuario/UsuarioCliente/",
            data: { "nitcliente": idcliente, "idusuario": idUserUpdate },
            beforeSend: function () {
                _Globals.alertWait();
            },
            success: function (r) {
                if (r.error) {
                    _Globals.alertProcess("error", "!Error", r.error);
                } else if (r.exito) {
                    _Globals.alertProcess("success", "!Bien", r.exito);
                    _Usuarios.extraerClientesId(idUserUpdate);
                }
            }
        });
    }

    var desAsociarCliente = (nit) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        });

        swalWithBootstrapButtons.fire({
            title: '¿Estas seguro de eliminar este registro?',
            text: "Se requiere confirmación del usuario.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, Eliminarlo!',
            cancelButtonText: 'No, Cancelar!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: "POST",
                    url: "/usuario/QuitarUsuarioCliente/",
                    data: { "nitcliente": nit, "idusuario": idUserUpdate },
                    beforeSend: function () {
                        _Globals.alertWait();
                    },
                    success: function (r) {
                        if (r.error) {
                            _Globals.alertProcess("error", "!Error", r.error);
                        } else if (r.exito) {
                            _Usuarios.extraerClientesId(idUserUpdate);
                            swalWithBootstrapButtons.fire(
                                'Eliminado!',
                                'El proceso fue exitoso.',
                                'success'
                            );
                        }
                    }
                });
            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire(
                    'Cancelado',
                    'El registro se ha salvado :)',
                    'error'
                )
            }
        })
    }

    return {
        usuarios: usuarios,
        drawTable: drawTable,
        editarUsuario: editarUsuario,
        eliminarUsuario: eliminarUsuario,
        validarDuplicado: validarDuplicado,
        extraerClientes: extraerClientes,
        incluirCliente: incluirCliente,
        extraerClientesId: extraerClientesId,
        desAsociarCliente: desAsociarCliente
    }

})(jQuery);

$(document).ready(function () {
    _Usuarios.drawTable();
    $('#form-usuarios').on('submit', (e) => {
        e.preventDefault();
        _Usuarios.usuarios();
    });

    $('#modalUsuariosButton').on('click', () => {
        $('#contrasena').val('');
        $('#cedula').val('');
        $('#nombre').val('');
        $('#correo').val('');
        _Globals.NotifyInfo("Una contraseña fuerte debe tener: un numero, un caracter especial, una letra mayuscula.");
    });

    $('#cedula').on('blur', () => {
        if ($('#cedula').val() != "") {
            _Usuarios.validarDuplicado($('#cedula').val());
        }
    });

    $('#agregar_clientes_us').on('click', () => {
        _Usuarios.incluirCliente($('#clientesAsgUsu').val());
    });

    $('#contrasena').keyup(function (e) {

        var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
        var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
        var enoughRegex = new RegExp("(?=.{8,}).*", "g");
        var small = document.querySelector("#smallTextPassword");

        if (false == enoughRegex.test($(this).val())) {
            small.setAttribute("style", "color:red;");
            $('#smallTextPassword').html('La contraseña debe tener al menos 8 caracteres.');
        } else if (strongRegex.test($(this).val())) {
            small.setAttribute("style", "color:green;");
            $('#smallTextPassword').html('La contraseña es excelente.');
        } else if (mediumRegex.test($(this).val())) {
            small.setAttribute("style", "color:orange;");
            $('#smallTextPassword').html('La contraseña buena.');
        } else {
            small.setAttribute("style", "color:red;");
            $('#smallTextPassword').html('La contraseña es muy debil.');
        }
    });

});
