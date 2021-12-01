var _Modulos = (function () {
    var TableModulos;
    
    _columnsMod = [
        {"width": "10%"},
        {"width": "30%"},
        {"width": "30%"},
        {"width": "20%"},
        {"width": "10%"}
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

    var drawTable = () =>{    
            
        $.ajax({
            type:"POST",
            url: "/modulos/extraerData/",
            beforeSend: function(){
                TableModulos.rows().clear().draw();
                _Globals.alertWait();
            },
            success:function(r){
                var data = JSON.parse(r);
                var optHerramientas;
                var icono;
                $.each(data,function(i,e){
                    optHerramientas = '<a href="#" onclick="_Modulos.editarModulo('+e.id+')" ><span class="btn btn-warning btn-sm"><i class="far fa-edit fa-lg"></i></span></a>  ';
                    optHerramientas += '<a href="#" onclick="_Modulos.eliminarModulo('+e.id+')" data-toggle="tooltip" data-placement="right" data-original-title="Eliminar Registro"><span class="btn btn-danger btn-sm"><i class="far fa-times-circle fa-lg"></i></span></a>';
                    icono = '<i class="'+e.icono+'" style="font-size: xx-large"></i>'
                    TableModulos.row.add([
                        optHerramientas,
                        e.id_modulo,
                        e.nombre_modulo,
                        e.modulo_padre,
                        icono
                    ]);
                });
                TableModulos.draw();
                Swal.close();
            }
            
        });    
    }

    var editarModulo = (id) =>{        
        $.ajax({
            type:"POST",
            url: "/modulos/extraerDataId/",
            data:{
                "id":id
            },
            beforeSend: function(){
                _Globals.alertWait();
            },
            success:function(r){
                var data = JSON.parse(r);
                if(data){
                    $("#Modulos_id").val(data[0].id_modulo);
                    $("#Modulos_nombre").val(data[0].nombre_modulo);
                    $("#Modulos_icono").val(data[0].icono);
                    traerModulosPadre(data[0].modulo_padre);
                    $("#modalModulos").modal("show");
                    Swal.close();
                }
            }
        });    
    }

    var modulos = () => {

        var dataString = $('#form-modulos').serialize();
        
        $.ajax({
            type: "POST",
            url: "/modulos/",
            data: dataString,
            beforeSend: function () {
                _Globals.alertWait();
            },
            success: function (r) { 
                $('#Modulos_id').prop("required", true);
                $('#Modulos_id').val('');
                $('#Modulos_nombre').val('');
                $('#modalModulos').modal('hide');
                if (r) {
                    _Globals.alertProcess("success", "Bien!", "El proceso fue exitoso.");
                } else {
                    _Globals.alertProcess("error", "Error!", "El proceso ha fallado.");
                }
                _Modulos.drawTable();
            }  
        });
    }

    var eliminarModulo = (id) => {
        Swal.fire({
            title: 'Estás Seguro?',
            text: "Se eliminará el módulo!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar!'
        }).then((result) => {
            if (result.value) {
                $.ajax({
                    type:"POST",
                    url: "/modulos/eliminarModulo/",
                    data:{
                        "id":id
                    },
                    beforeSend: function(){
                        _Globals.alertWait();
                    },
                    success:function(r){
                        if (!r) {
                            _Globals.NotifyError("El proceso ha fallado.");
                        } else {
                            _Modulos.drawTable();
                            _Globals.alertProcess("success", "Bien!", "El módulo se eliminó con exito.");
                        }
                    }
                });  
            }
        });
    }

    var traerModulosPadre = (id) =>{        
        $.ajax({
            type:"POST",
            url: "/modulos/extraerDataModulosPadre/",
            data:{
                "id":id
            },
            beforeSend: function(){
                $('#Modulos_relPadre').html('');
            },
            success:function(r){
                var data = JSON.parse(r);
                if(data){
                    $.each(data, function(key, val){
                        $('#Modulos_relPadre').append('<option value="'+ data[key].id_modulo_padre+ '">'+data[key].nombre+'</option>')
                    });
                    $('#Modulos_relPadre option[value="'+id+'"]').prop('selected', 'selected');
                }
            }
        });    
    }

    var icons = [{icon: 'fas fa-address-book'},{icon: 'fas fa-address-card'},{icon: 'fas fa-adjust'},{icon: 'fas fa-align-center'},{icon: 'fas fa-align-justify'},{icon: 'fas fa-align-left'},{icon: 'fas fa-align-right'},{icon: 'fas fa-allergies'},{icon: 'fas fa-ambulance'},{icon: 'fas fa-american-sign-language-interpreting'},{icon: 'fas fa-anchor'},{icon: 'fas fa-angle-double-down'},{icon: 'fas fa-angle-double-left'},{icon: 'fas fa-angle-double-right'},{icon: 'fas fa-angle-double-up'},{icon: 'fas fa-angle-down'},{icon: 'fas fa-angle-left'},{icon: 'fas fa-angle-right'},{icon: 'fas fa-angle-up'},{icon: 'fas fa-archive'},{icon: 'fas fa-arrow-alt-circle-down'},{icon: 'fas fa-arrow-alt-circle-left'},{icon: 'fas fa-arrow-alt-circle-right'},{icon: 'fas fa-arrow-alt-circle-up'},{icon: 'fas fa-arrow-circle-down'},{icon: 'fas fa-arrow-circle-left'},{icon: 'fas fa-arrow-circle-right'},{icon: 'fas fa-arrow-circle-up'},{icon: 'fas fa-arrow-down'},{icon: 'fas fa-arrow-left'},{icon: 'fas fa-arrow-right'},{icon: 'fas fa-arrow-up'},{icon: 'fas fa-arrows-alt'},{icon: 'fas fa-arrows-alt-h'},{icon: 'fas fa-arrows-alt-v'},{icon: 'fas fa-assistive-listening-systems'},{icon: 'fas fa-asterisk'},{icon: 'fas fa-at'},{icon: 'fas fa-audio-description'},{icon: 'fas fa-backward'},{icon: 'fas fa-balance-scale'},{icon: 'fas fa-ban'},{icon: 'fas fa-band-aid'},{icon: 'fas fa-barcode'},{icon: 'fas fa-bars'},{icon: 'fas fa-baseball-ball'},{icon: 'fas fa-basketball-ball'},{icon: 'fas fa-bath'},{icon: 'fas fa-battery-empty'},{icon: 'fas fa-battery-full'},{icon: 'fas fa-battery-half'},{icon: 'fas fa-battery-quarter'},{icon: 'fas fa-battery-three-quarters'},{icon: 'fas fa-bed'},{icon: 'fas fa-beer'},{icon: 'fas fa-bell'},{icon: 'fas fa-bell-slash'},{icon: 'fas fa-bicycle'},{icon: 'fas fa-binoculars'},{icon: 'fas fa-birthday-cake'},{icon: 'fas fa-blind'},{icon: 'fas fa-bold'},{icon: 'fas fa-bolt'},{icon: 'fas fa-bomb'},{icon: 'fas fa-book'},{icon: 'fas fa-bookmark'},{icon: 'fas fa-bowling-ball'},{icon: 'fas fa-box'},{icon: 'fas fa-box-open'},{icon: 'fas fa-boxes'},{icon: 'fas fa-braille'},{icon: 'fas fa-briefcase'},{icon: 'fas fa-briefcase-medical'},{icon: 'fas fa-bug'},{icon: 'fas fa-building'},{icon: 'fas fa-bullhorn'},{icon: 'fas fa-bullseye'},{icon: 'fas fa-burn'},{icon: 'fas fa-bus'},{icon: 'fas fa-calculator'},{icon: 'fas fa-calendar'},{icon: 'fas fa-calendar-alt'},{icon: 'fas fa-calendar-check'},{icon: 'fas fa-calendar-minus'},{icon: 'fas fa-calendar-plus'},{icon: 'fas fa-calendar-times'},{icon: 'fas fa-camera'},{icon: 'fas fa-camera-retro'},{icon: 'fas fa-capsules'},{icon: 'fas fa-car'},{icon: 'fas fa-caret-down'},{icon: 'fas fa-caret-left'},{icon: 'fas fa-caret-right'},{icon: 'fas fa-caret-square-down'},{icon: 'fas fa-caret-square-left'},{icon: 'fas fa-caret-square-right'},{icon: 'fas fa-caret-square-up'},{icon: 'fas fa-caret-up'},{icon: 'fas fa-cart-arrow-down'},{icon: 'fas fa-cart-plus'},{icon: 'fas fa-certificate'},{icon: 'fas fa-chart-area'},{icon: 'fas fa-chart-bar'},{icon: 'fas fa-chart-line'},{icon: 'fas fa-chart-pie'},{icon: 'fas fa-check'},{icon: 'fas fa-check-circle'},{icon: 'fas fa-check-square'},{icon: 'fas fa-chess'},{icon: 'fas fa-chess-bishop'},{icon: 'fas fa-chess-board'},{icon: 'fas fa-chess-king'},{icon: 'fas fa-chess-knight'},{icon: 'fas fa-chess-pawn'},{icon: 'fas fa-chess-queen'},{icon: 'fas fa-chess-rook'},{icon: 'fas fa-chevron-circle-down'},{icon: 'fas fa-chevron-circle-left'},{icon: 'fas fa-chevron-circle-right'},{icon: 'fas fa-chevron-circle-up'},{icon: 'fas fa-chevron-down'},{icon: 'fas fa-chevron-left'},{icon: 'fas fa-chevron-right'},{icon: 'fas fa-chevron-up'},{icon: 'fas fa-child'},{icon: 'fas fa-circle'},{icon: 'fas fa-circle-notch'},{icon: 'fas fa-clipboard'},{icon: 'fas fa-clipboard-check'},{icon: 'fas fa-clipboard-list'},{icon: 'fas fa-clock'},{icon: 'fas fa-clone'},{icon: 'fas fa-closed-captioning'},{icon: 'fas fa-cloud'},{icon: 'fas fa-cloud-download-alt'},{icon: 'fas fa-cloud-upload-alt'},{icon: 'fas fa-code'},{icon: 'fas fa-code-branch'},{icon: 'fas fa-coffee'},{icon: 'fas fa-cog'},{icon: 'fas fa-cogs'},{icon: 'fas fa-columns'},{icon: 'fas fa-comment'},{icon: 'fas fa-comment-alt'},{icon: 'fas fa-comment-dots'},{icon: 'fas fa-comment-slash'},{icon: 'fas fa-comments'},{icon: 'fas fa-compass'},{icon: 'fas fa-compress'},{icon: 'fas fa-copy'},{icon: 'fas fa-copyright'},{icon: 'fas fa-couch'},{icon: 'fas fa-credit-card'},{icon: 'fas fa-crop'},{icon: 'fas fa-crosshairs'},{icon: 'fas fa-cube'},{icon: 'fas fa-cubes'},{icon: 'fas fa-cut'},{icon: 'fas fa-database'},{icon: 'fas fa-deaf'},{icon: 'fas fa-desktop'},{icon: 'fas fa-diagnoses'},{icon: 'fas fa-dna'},{icon: 'fas fa-dollar-sign'},{icon: 'fas fa-dolly'},{icon: 'fas fa-dolly-flatbed'},{icon: 'fas fa-donate'},{icon: 'fas fa-dot-circle'},{icon: 'fas fa-dove'},{icon: 'fas fa-download'},{icon: 'fas fa-edit'},{icon: 'fas fa-eject'},{icon: 'fas fa-ellipsis-h'},{icon: 'fas fa-ellipsis-v'},{icon: 'fas fa-envelope'},{icon: 'fas fa-envelope-open'},{icon: 'fas fa-envelope-square'},{icon: 'fas fa-eraser'},{icon: 'fas fa-euro-sign'},{icon: 'fas fa-exchange-alt'},{icon: 'fas fa-exclamation'},{icon: 'fas fa-exclamation-circle'},{icon: 'fas fa-exclamation-triangle'},{icon: 'fas fa-expand'},{icon: 'fas fa-expand-arrows-alt'},{icon: 'fas fa-external-link-alt'},{icon: 'fas fa-external-link-square-alt'},{icon: 'fas fa-eye'},{icon: 'fas fa-eye-dropper'},{icon: 'fas fa-eye-slash'},{icon: 'fas fa-fast-backward'},{icon: 'fas fa-fast-forward'},{icon: 'fas fa-fax'},{icon: 'fas fa-female'},{icon: 'fas fa-fighter-jet'},{icon: 'fas fa-file'},{icon: 'fas fa-file-alt'},{icon: 'fas fa-file-archive'},{icon: 'fas fa-file-audio'},{icon: 'fas fa-file-code'},{icon: 'fas fa-file-excel'},{icon: 'fas fa-file-image'},{icon: 'fas fa-file-medical'},{icon: 'fas fa-file-medical-alt'},{icon: 'fas fa-file-pdf'},{icon: 'fas fa-file-powerpoint'},{icon: 'fas fa-file-video'},{icon: 'fas fa-file-word'},{icon: 'fas fa-film'},{icon: 'fas fa-filter'},{icon: 'fas fa-fire'},{icon: 'fas fa-fire-extinguisher'},{icon: 'fas fa-first-aid'},{icon: 'fas fa-flag'},{icon: 'fas fa-flag-checkered'},{icon: 'fas fa-flask'},{icon: 'fas fa-folder'},{icon: 'fas fa-folder-open'},{icon: 'fas fa-font'},{icon: 'fas fa-football-ball'},{icon: 'fas fa-forward'},{icon: 'fas fa-frown'},{icon: 'fas fa-futbol'},{icon: 'fas fa-gamepad'},{icon: 'fas fa-gavel'},{icon: 'fas fa-gem'},{icon: 'fas fa-genderless'},{icon: 'fas fa-gift'},{icon: 'fas fa-glass-martini'},{icon: 'fas fa-globe'},{icon: 'fas fa-golf-ball'},{icon: 'fas fa-graduation-cap'},{icon: 'fas fa-h-square'},{icon: 'fas fa-hand-holding'},{icon: 'fas fa-hand-holding-heart'},{icon: 'fas fa-hand-holding-usd'},{icon: 'fas fa-hand-lizard'},{icon: 'fas fa-hand-paper'},{icon: 'fas fa-hand-peace'},{icon: 'fas fa-hand-point-down'},{icon: 'fas fa-hand-point-left'},{icon: 'fas fa-hand-point-right'},{icon: 'fas fa-hand-point-up'},{icon: 'fas fa-hand-pointer'},{icon: 'fas fa-hand-rock'},{icon: 'fas fa-hand-scissors'},{icon: 'fas fa-hand-spock'},{icon: 'fas fa-hands'},{icon: 'fas fa-hands-helping'},{icon: 'fas fa-handshake'},{icon: 'fas fa-hashtag'},{icon: 'fas fa-hdd'},{icon: 'fas fa-heading'},{icon: 'fas fa-headphones'},{icon: 'fas fa-heart'},{icon: 'fas fa-heartbeat'},{icon: 'fas fa-history'},{icon: 'fas fa-hockey-puck'},{icon: 'fas fa-home'},{icon: 'fas fa-hospital'},{icon: 'fas fa-hospital-alt'},{icon: 'fas fa-hospital-symbol'},{icon: 'fas fa-hourglass'},{icon: 'fas fa-hourglass-end'},{icon: 'fas fa-hourglass-half'},{icon: 'fas fa-hourglass-start'},{icon: 'fas fa-i-cursor'},{icon: 'fas fa-id-badge'},{icon: 'fas fa-id-card'},{icon: 'fas fa-id-card-alt'},{icon: 'fas fa-image'},{icon: 'fas fa-images'},{icon: 'fas fa-inbox'},{icon: 'fas fa-indent'},{icon: 'fas fa-industry'},{icon: 'fas fa-info'},{icon: 'fas fa-info-circle'},{icon: 'fas fa-italic'},{icon: 'fas fa-key'},{icon: 'fas fa-keyboard'},{icon: 'fas fa-language'},{icon: 'fas fa-laptop'},{icon: 'fas fa-leaf'},{icon: 'fas fa-lemon'},{icon: 'fas fa-level-down-alt'},{icon: 'fas fa-level-up-alt'},{icon: 'fas fa-life-ring'},{icon: 'fas fa-lightbulb'},{icon: 'fas fa-link'},{icon: 'fas fa-lira-sign'},{icon: 'fas fa-list'},{icon: 'fas fa-list-alt'},{icon: 'fas fa-list-ol'},{icon: 'fas fa-list-ul'},{icon: 'fas fa-location-arrow'},{icon: 'fas fa-lock'},{icon: 'fas fa-lock-open'},{icon: 'fas fa-long-arrow-alt-down'},{icon: 'fas fa-long-arrow-alt-left'},{icon: 'fas fa-long-arrow-alt-right'},{icon: 'fas fa-long-arrow-alt-up'},{icon: 'fas fa-low-vision'},{icon: 'fas fa-magic'},{icon: 'fas fa-magnet'},{icon: 'fas fa-male'},{icon: 'fas fa-map'},{icon: 'fas fa-map-marker'},{icon: 'fas fa-map-marker-alt'},{icon: 'fas fa-map-pin'},{icon: 'fas fa-map-signs'},{icon: 'fas fa-mars'},{icon: 'fas fa-mars-double'},{icon: 'fas fa-mars-stroke'},{icon: 'fas fa-mars-stroke-h'},{icon: 'fas fa-mars-stroke-v'},{icon: 'fas fa-medkit'},{icon: 'fas fa-meh'},{icon: 'fas fa-mercury'},{icon: 'fas fa-microchip'},{icon: 'fas fa-microphone'},{icon: 'fas fa-microphone-slash'},{icon: 'fas fa-minus'},{icon: 'fas fa-minus-circle'},{icon: 'fas fa-minus-square'},{icon: 'fas fa-mobile'},{icon: 'fas fa-mobile-alt'},{icon: 'fas fa-money-bill-alt'},{icon: 'fas fa-moon'},{icon: 'fas fa-motorcycle'},{icon: 'fas fa-mouse-pointer'},{icon: 'fas fa-music'},{icon: 'fas fa-neuter'},{icon: 'fas fa-newspaper'},{icon: 'fas fa-notes-medical'},{icon: 'fas fa-object-group'},{icon: 'fas fa-object-ungroup'},{icon: 'fas fa-outdent'},{icon: 'fas fa-paint-brush'},{icon: 'fas fa-pallet'},{icon: 'fas fa-paper-plane'},{icon: 'fas fa-paperclip'},{icon: 'fas fa-parachute-box'},{icon: 'fas fa-paragraph'},{icon: 'fas fa-paste'},{icon: 'fas fa-pause'},{icon: 'fas fa-pause-circle'},{icon: 'fas fa-paw'},{icon: 'fas fa-pen-square'},{icon: 'fas fa-pencil-alt'},{icon: 'fas fa-people-carry'},{icon: 'fas fa-percent'},{icon: 'fas fa-phone'},{icon: 'fas fa-phone-slash'},{icon: 'fas fa-phone-square'},{icon: 'fas fa-phone-volume'},{icon: 'fas fa-piggy-bank'},{icon: 'fas fa-pills'},{icon: 'fas fa-plane'},{icon: 'fas fa-play'},{icon: 'fas fa-play-circle'},{icon: 'fas fa-plug'},{icon: 'fas fa-plus'},{icon: 'fas fa-plus-circle'},{icon: 'fas fa-plus-square'},{icon: 'fas fa-podcast'},{icon: 'fas fa-poo'},{icon: 'fas fa-pound-sign'},{icon: 'fas fa-power-off'},{icon: 'fas fa-prescription-bottle'},{icon: 'fas fa-prescription-bottle-alt'},{icon: 'fas fa-print'},{icon: 'fas fa-procedures'},{icon: 'fas fa-puzzle-piece'},{icon: 'fas fa-qrcode'},{icon: 'fas fa-question'},{icon: 'fas fa-question-circle'},{icon: 'fas fa-quidditch'},{icon: 'fas fa-quote-left'},{icon: 'fas fa-quote-right'},{icon: 'fas fa-random'},{icon: 'fas fa-recycle'},{icon: 'fas fa-redo'},{icon: 'fas fa-redo-alt'},{icon: 'fas fa-registered'},{icon: 'fas fa-reply'},{icon: 'fas fa-reply-all'},{icon: 'fas fa-retweet'},{icon: 'fas fa-ribbon'},{icon: 'fas fa-road'},{icon: 'fas fa-rocket'},{icon: 'fas fa-rss'},{icon: 'fas fa-rss-square'},{icon: 'fas fa-ruble-sign'},{icon: 'fas fa-rupee-sign'},{icon: 'fas fa-save'},{icon: 'fas fa-search'},{icon: 'fas fa-search-minus'},{icon: 'fas fa-search-plus'},{icon: 'fas fa-seedling'},{icon: 'fas fa-server'},{icon: 'fas fa-share'},{icon: 'fas fa-share-alt'},{icon: 'fas fa-share-alt-square'},{icon: 'fas fa-share-square'},{icon: 'fas fa-shekel-sign'},{icon: 'fas fa-shield-alt'},{icon: 'fas fa-ship'},{icon: 'fas fa-shipping-fast'},{icon: 'fas fa-shopping-bag'},{icon: 'fas fa-shopping-basket'},{icon: 'fas fa-shopping-cart'},{icon: 'fas fa-shower'},{icon: 'fas fa-sign'},{icon: 'fas fa-sign-in-alt'},{icon: 'fas fa-sign-language'},{icon: 'fas fa-sign-out-alt'},{icon: 'fas fa-signal'},{icon: 'fas fa-sitemap'},{icon: 'fas fa-sliders-h'},{icon: 'fas fa-smile'},{icon: 'fas fa-smoking'},{icon: 'fas fa-snowflake'},{icon: 'fas fa-sort'},{icon: 'fas fa-sort-alpha-down'},{icon: 'fas fa-sort-alpha-up'},{icon: 'fas fa-sort-amount-down'},{icon: 'fas fa-sort-amount-up'},{icon: 'fas fa-sort-down'},{icon: 'fas fa-sort-numeric-down'},{icon: 'fas fa-sort-numeric-up'},{icon: 'fas fa-sort-up'},{icon: 'fas fa-space-shuttle'},{icon: 'fas fa-spinner'},{icon: 'fas fa-square'},{icon: 'fas fa-square-full'},{icon: 'fas fa-star'},{icon: 'fas fa-star-half'},{icon: 'fas fa-step-backward'},{icon: 'fas fa-step-forward'},{icon: 'fas fa-stethoscope'},{icon: 'fas fa-sticky-note'},{icon: 'fas fa-stop'},{icon: 'fas fa-stop-circle'},{icon: 'fas fa-stopwatch'},{icon: 'fas fa-street-view'},{icon: 'fas fa-strikethrough'},{icon: 'fas fa-subscript'},{icon: 'fas fa-subway'},{icon: 'fas fa-suitcase'},{icon: 'fas fa-sun'},{icon: 'fas fa-superscript'},{icon: 'fas fa-sync'},{icon: 'fas fa-sync-alt'},{icon: 'fas fa-syringe'},{icon: 'fas fa-table'},{icon: 'fas fa-table-tennis'},{icon: 'fas fa-tablet'},{icon: 'fas fa-tablet-alt'},{icon: 'fas fa-tablets'},{icon: 'fas fa-tachometer-alt'},{icon: 'fas fa-tag'},{icon: 'fas fa-tags'},{icon: 'fas fa-tape'},{icon: 'fas fa-tasks'},{icon: 'fas fa-taxi'},{icon: 'fas fa-terminal'},{icon: 'fas fa-text-height'},{icon: 'fas fa-text-width'},{icon: 'fas fa-th'},{icon: 'fas fa-th-large'},{icon: 'fas fa-th-list'},{icon: 'fas fa-thermometer'},{icon: 'fas fa-thermometer-empty'},{icon: 'fas fa-thermometer-full'},{icon: 'fas fa-thermometer-half'},{icon: 'fas fa-thermometer-quarter'},{icon: 'fas fa-thermometer-three-quarters'},{icon: 'fas fa-thumbs-down'},{icon: 'fas fa-thumbs-up'},{icon: 'fas fa-thumbtack'},{icon: 'fas fa-ticket-alt'},{icon: 'fas fa-times'},{icon: 'fas fa-times-circle'},{icon: 'fas fa-tint'},{icon: 'fas fa-toggle-off'},{icon: 'fas fa-toggle-on'},{icon: 'fas fa-trademark'},{icon: 'fas fa-train'},{icon: 'fas fa-transgender'},{icon: 'fas fa-transgender-alt'},{icon: 'fas fa-trash'},{icon: 'fas fa-trash-alt'},{icon: 'fas fa-tree'},{icon: 'fas fa-trophy'},{icon: 'fas fa-truck'},{icon: 'fas fa-truck-loading'},{icon: 'fas fa-truck-moving'},{icon: 'fas fa-tty'},{icon: 'fas fa-tv'},{icon: 'fas fa-umbrella'},{icon: 'fas fa-underline'},{icon: 'fas fa-undo'},{icon: 'fas fa-undo-alt'},{icon: 'fas fa-universal-access'},{icon: 'fas fa-university'},{icon: 'fas fa-unlink'},{icon: 'fas fa-unlock'},{icon: 'fas fa-unlock-alt'},{icon: 'fas fa-upload'},{icon: 'fas fa-user'},{icon: 'fas fa-user-circle'},{icon: 'fas fa-user-md'},{icon: 'fas fa-user-plus'},{icon: 'fas fa-user-secret'},{icon: 'fas fa-user-times'},{icon: 'fas fa-users'},{icon: 'fas fa-utensil-spoon'},{icon: 'fas fa-utensils'},{icon: 'fas fa-venus'},{icon: 'fas fa-venus-double'},{icon: 'fas fa-venus-mars'},{icon: 'fas fa-vial'},{icon: 'fas fa-vials'},{icon: 'fas fa-video'},{icon: 'fas fa-video-slash'},{icon: 'fas fa-volleyball-ball'},{icon: 'fas fa-volume-down'},{icon: 'fas fa-volume-off'},{icon: 'fas fa-volume-up'},{icon: 'fas fa-warehouse'},{icon: 'fas fa-weight'},{icon: 'fas fa-wheelchair'},{icon: 'fas fa-wifi'},{icon: 'fas fa-window-close'},{icon: 'fas fa-window-maximize'},{icon: 'fas fa-window-minimize'},{icon: 'fas fa-window-restore'},{icon: 'fas fa-wine-glass'},{icon: 'fas fa-won-sign'},{icon: 'fas fa-wrench'},{icon: 'fas fa-x-ray'},{icon: 'fas fa-yen-sign'}];

    var itemTemplate = $('.icon-picker-list').clone(true).html();
    
    $('.icon-picker-list').html('');
    $(icons).each(function(index) {
        var itemtemp = itemTemplate;
        var item = icons[index].icon;
    
        itemtemp = itemtemp.replace(/{{item}}/g, item).replace(/{{index}}/g, index);
        $('.icon-picker-list').append(itemtemp);
    });

    return{
        modulos:modulos,
        editarModulo:editarModulo,
        eliminarModulo:eliminarModulo,
        traerModulosPadre:traerModulosPadre,
        drawTable:drawTable
    }
    
})(jQuery);

$(document).ready(function () {

    _Modulos.traerModulosPadre('');
    _Modulos.drawTable();

    $('#form-modulos').on('submit', (e)=>{
        e.preventDefault();
        _Modulos.modulos();
    });

    $('.picker-button').click(function() {
        $('#iconPicker').modal('show');
    });

    $(document).on('click', '.icon-picker-list a', function() {
        let selectedIcon = $(this).data('index');
        let name = $(this).data('class');
        $('.icon-picker-list a').removeClass('active');
        $('.icon-picker-list a').eq(selectedIcon).addClass('active');
        $("#Modulos_icono").val(name);
        $('#iconPicker').modal('hide');
    }); 
});
