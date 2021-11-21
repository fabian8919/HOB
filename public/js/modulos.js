var _Modulos = (function () {
    var TableModulos;
    
    _columnsMod = [
        {"width": "10%"},
        {"width": "10%"},
        {"width": "20%"},
        {"width": "60%"}
    ];

    TableModulos = $("#tableModulos").DataTable({
        pagingType: "numbers",
        language: lang_dataTable,
        autoWidth: false,
        searching: true,
        ordering: true,
        paging: true,
        destroy: true,
        pageLength: 10,
        columns: _columnsMod,
        order: [[1, 'asc']]
    });
    
})(jQuery);

$(document).ready(function () {


});
