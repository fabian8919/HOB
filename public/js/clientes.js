var _Clientes = (function () {
    var TableClientes;
    
    _columnsCli = [
        {"width": "5%"},
        {"width": "5%"},
        {"width": "14%"},
        {"width": "20%"},
        {"width": "15%"},
        {"width": "15%"},
        {"width": "10%"},
        {"width": "15%"},
        {"width": "1%"}
    ];

    TableClientes = $("#tableClientes").DataTable({
        pagingType: "numbers",
        language: lang_dataTable,
        autoWidth: false,
        searching: true,
        ordering: true,
        paging: true,
        destroy: true,
        pageLength: 10,
        columns: _columnsCli,
        order: [[1, 'asc']]
    });
    
})(jQuery);

$(document).ready(function () {


});
