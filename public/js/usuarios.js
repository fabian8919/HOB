var _Usuarios = (function () {
    var TableUsuarios;

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

    TableUsuarios = $("#tableUsuarios").DataTable({
        pagingType: "numbers",
        language: lang_dataTable,
        autoWidth: false,
        searching: true,
        ordering: true,
        paging: true,
        destroy: true,
        pageLength: 10,
        columns: _columnsUsu,
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
                    optHerramientas += '<a href="#" onclick="_Usuarios.eliminarUsuario(' + e.id + ')" id="deleteUusario' + e.id + '" data-toggle="tooltip" data-placement="right" data-original-title="Eliminar Registro"><span class="btn btn-danger btn-sm"><i class="far fa-times-circle fa-lg"></i></span></a>';
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
                Swal.close();
                if (r) {
                    _Globals.alertProcess("success", "Bien!", "El proceso fue exitoso.");
                } else {
                    _Globals.alertProcess("error", "Error!", "El proceso ha fallado.");
                }
                $('#modalUsuarios').modal('hide');
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
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Confirmar',
            showLoaderOnConfirm: true,
            preConfirm: (pass) => {
                if(!pass){
                    Swal.showValidationMessage(
                        "La contraseña no puede estar vacia."
                    )
                } else {
                    
                }                
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: `${result.value.login}'s avatar`,
                    imageUrl: result.value.avatar_url
                })
            }
        })
    }

    var validarDuplicado = (cedula)=>{
        $.ajax({
            type: "POST",
            url: "/usuarios/DuplicadoCedula/",
            data: { "cedula": cedula },
            success: function (r) {
              if(r){
                
              } else {

              }
            }
        });
    }

    return {
        usuarios: usuarios,
        drawTable: drawTable,
        editarUsuario: editarUsuario,
        eliminarUsuario: eliminarUsuario,
        validarDuplicado:validarDuplicado
    }

})(jQuery);

$(document).ready(function () {
    _Usuarios.drawTable();
    $('#form-usuarios').on('submit', (e) => {
        e.preventDefault();
        _Usuarios.usuarios();
    });
    
    $('#modalUsuariosButton').on('click', ()=>{
        $('#contrasena').val('');
        $('#cedula').val('');
        $('#nombre').val('');
        $('#correo').val('');
    });

    $('#cedula').on('blur',()=>{
        _Usuarios.validarDuplicado($('#cedula').val());
    });

});
