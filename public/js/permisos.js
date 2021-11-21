var _Permisos = (function () {
    var TablePermisos;
    
    _columnsPerm = [
        {"width": "10%"},
        {"width": "10%"},
        {"width": "20%"},
        {"width": "60%"}
    ];

    TablePermisos = $("#tablePermisos").DataTable({
        pagingType: "numbers",
        language: lang_dataTable,
        autoWidth: false,
        searching: true,
        ordering: true,
        paging: true,
        destroy: true,
        pageLength: 10,
        columns: _columnsPerm,
        order: [[1, 'asc']]
    });
    
})(jQuery);

$(document).ready(function () {


});
