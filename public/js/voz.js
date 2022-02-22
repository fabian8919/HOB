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
        {"width": "10%"},
        {"width": "10%"},
        {"width": "60%"},
        {"width": "20%"}
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

    return{
        managerView: managerView,
        cancelProceso: cancelProceso
    }
    
})(jQuery);

$(document).ready(function () {

    document.getElementById("estaVoz").click();

    $('#crearProc').on('click', ()=>{
        $('#crearProc').attr('hidden', true);
        $('#estaVoz').attr('hidden', true);
        $('#graficarLop').attr('hidden', true);
        $('#cancelproceso').attr('hidden', false);
    });

    $('#crearProc').on('click', ()=>{
       
    });
});
