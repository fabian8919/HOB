var _Usuarios = (function () {
    var TableUsuarios;
    
    _columnsUsu = [
        {"width": "5%"},
        {"width": "5%"},
        {"width": "15%"},
        {"width": "20%"},
        {"width": "15%"},
        {"width": "15%"},
        {"width": "10%"},
        {"width": "15%"},
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
    
})(jQuery);

$(document).ready(function () {


});
