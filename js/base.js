var anuncioInicio = false;
var calculadoInicio = false;

var graficos = {
    menu: true
};

//esto es una M. la x e y salen de donde les da la gana
function helpers() {
    $(".help").on('mouseover', function(e) {
        var help = $(this);
        //        var contenedor = help.parent();
        $("body").on('mousemove', function(e) {
            var x = e.pageX - help.offset().left;
            var y = e.pageY - help.offset().top + 5;

            //INTENTO DE AUTOAJUSTE EN CASO DE OVERFLOW
            //            if(e.pageX + help.width() > contenedor.offset().left + contenedor.width() -5){
            //                x = x - help.find("span").width();
            //            }
            //            if(e.pageY + help.height() > contenedor.offset().top + contenedor.height() -5){
            //                y = y - help.find("span").height();
            //            }

            help.find("span").css("marginTop", y + "px");
            help.find("span").css("marginLeft", x + "px");
        });

        help.on('mouseout', function(e) {
            $("body").unbind('mousemove');
        });
    });
}

function configurarGraficos() {

    if (graficos.menu === true) {
        $("#handler").height($("body").height() - $("header").height() - 45);

        var bottom = $("footer").height() - 23;
        $("footer").css("bottom", "-" + bottom + "px");
    } else {
        $("#handler").height($("body").height() - $("header").height() - $("footer").height() - 10);

        $(".iconoImg img").css("padding-bottom", "10px");
        $("footer").css("bottom", "0px");
    }

    var timer;
    $("footer").css("bottom", "-" + bottom + "px");
    $("footer").hover(
            function() {
                if (graficos.menu === true) {
                    clearTimeout(timer);
                    $("footer").addClass("footerHover");
                }
            },
            function() {
                if (graficos.menu === true) {
                    timer = setTimeout(function() {
                        $("footer").removeClass("footerHover");
                    }, 500);
                }
            }
    );
}

$("#titulo").hover(
        function() {
            $("#contenidos").css("opacity", "0");
            $("#contenidos2").css("opacity", "100");
        },
        function() {
            $("#contenidos").css("opacity", "100");
            $("#contenidos2").css("opacity", "0");
        }
);

var alto = $("body").height();
var altura = alto / 1;

$("#titulo").css("height", altura + "px");
$("#titulo").css("margin-top", (alto - altura) / 2 + "px");

$("#titulo").css("width", altura / 8 + "px");
$("#titulo").css("margin-left", "-" + altura / 8 + "px");

function ordenar() {
    //definir la misma altura de div que el icono.
    $('.icono').each(function() {
        $(this).mouseover(function() {
            $(this).find(".iconoImg").css("width", "90%");
            $(this).mouseout(function() {
                $(this).find(".iconoImg").css("width", "65%");
            });
        });
    });

    $('.minImg').each(function() {
        $(this).mouseover(function() {
            $(this).css("width", "85%");
        });
        $(this).mouseout(function() {
            $(this).css("width", "75%");
        });
    });

}

function Select(obj) {
    var tbl = obj.parentNode.parentNode;
    var firstRow = $(tbl).find("tr").get(0);
    if (!firstRow.getElementsByTagName("input").length) {
        console.log("not select input");
        return;
    }
    var oldRow = tbl.rows[firstRow.getElementsByTagName("input")[0].value];
    if (oldRow !== null) {
        $(oldRow).removeClass("highlight");
        $(oldRow).removeClass("selected");
        $(oldRow).addClass("UnHighLight");
    }
    $(obj).removeClass("highlight");
    $(obj).removeClass("UnHighLight");
    $(obj).addClass("selected");
    firstRow.getElementsByTagName("input")[0].value = obj.rowIndex;
}

function HighLight(obj) {
    var tbl = obj.parentNode.parentNode;

    var firstRow = tbl.getElementsByTagName("tr")[0];
    if (firstRow.getElementsByTagName("input")[0].value != obj.rowIndex) { //!=
        $(obj).removeClass("selected UnHighLight");
        $(obj).addClass("highlight");
    }
}
function UnHighLight(obj) {
    var tbl = obj.parentNode.parentNode;

    var firstRow = tbl.getElementsByTagName("tr")[0];
    if (firstRow.getElementsByTagName("input")[0].value != obj.rowIndex) { //!=
        $(obj).removeClass("selected highlight");
        $(obj).addClass("UnHighLight");
    }
}

function detalleCriatura(criat, stage, page) {
    $(page).addClass("detalleCriatura");

    idAnterior = criat.id;
    var det = $("#detalleCriatura");

    det.find("#nombre").text(criat.nombre);

    var apodo = criat.apodo;
    if (apodo === "" && !det.find("#apodoDetalles").hasClass("readInput")) {
        det.find("#apodoDetalles").addClass("sinApodo");
        det.find("#apodoDetalles").val("Esta criatura aún no tiene apodo");
    } else {
        det.find("#apodoDetalles").removeClass("sinApodo");
        det.find("#apodoDetalles").val(apodo);
    }

    det.find("#raza").text(criat.raza);
    det.find("#clase").text(getClaseName(criat.clases));
    if (typeof criat.mutacion !== 'undefined' && criat.mutacion !== '') {
        det.find("#mutacion").text(criat.mutacion);
    } else {
        det.find("#mutacion").text("-");
    }
    if (typeof criat.elemento !== 'undefined' && criat.elemento !== '') {
        det.find("#elemento").text(criat.elemento);
    } else {
        det.find("#elemento").text("-");
    }

    det.find("#valor").text(criat.precio);
    det.find("#batallasTemp").text(criat.batallas);
    det.find("#batallasTotal").text(criat.batallas);
    det.find("#bajasTemp").text(criat.bajas);
    det.find("#bajasTotal").text(criat.bajas);
    det.find("#muertesTemp").text(criat.muertes);
    det.find("#muertesTotal").text(criat.muertes);

    det.find("#ratioTemp").text(getRatio(criat.bajas, criat.muertes));
    det.find("#ratioTotal").text(getRatio(criat.bajas, criat.muertes));

    if (stage) {
        if (criat.precio) {
            loadCanvasAspecto(criat, stage);
        } else {
            loadCanvasAspectoAcademia(criat, stage);
        }
    }

    $('.visualize').remove();
    $('#graficoCriatMoral td').remove();
    $('#graficoCriatFrescura td').remove();
    $('#graficoCriatMedia td').remove();
    $('#graficoCriatXp td').remove();

    var atrs = {};
    if (typeof criat.evolucion !== 'undefined') {
        var evo = JSON.parse(criat.evolucion);
        atrs = evo[evo.length - 1];

        var moral = document.getElementById("graficoCriatMoral");
        var frescura = document.getElementById("graficoCriatFrescura");
        var media = document.getElementById("graficoCriatMedia");
        var xp = document.getElementById("graficoCriatXp");

        if (moral !== null && frescura !== null && media !== null && xp !== null) {
            var cell;
            for (var i = evo.length - 1; i >= 0; i--) {

                cell = moral.insertCell(1);
                cell.innerHTML = nan(evo[i].fi);
                cell = frescura.insertCell(1);
                cell.innerHTML = nan(evo[i].fr);

                cell = media.insertCell(1);
                cell.innerHTML = nan((evo[i].fu + evo[i].ma + evo[i].ag + evo[i].rf + evo[i].co + evo[i].df + evo[i].rc) / 7);
                cell = xp.insertCell(1);
                cell.innerHTML = nan(evo[i].xp);
            }
            function nan(num) {
                if (num < 0)
                    num = NaN;
                return num;
            }
        }
    } else if (typeof criat.destapes !== 'undefined' && criat.destapes !== "") {
        var atrs = JSON.parse(criat.destapes);
    }

    det.find("#media").text(getMedia(criat.media));
    det.find("#fuerza").text(atr(atrs["fu"]));
    det.find("#magia").text(atr(atrs["ma"]));
    det.find("#agilidad").text(atr(atrs["ag"]));
    det.find("#reflejos").text(atr(atrs["rf"]));
    det.find("#constitucion").text(atr(atrs["co"]));
    det.find("#defensa").text(atr(atrs["df"]));
    det.find("#reaccion").text(atr(atrs["rc"]));
    det.find("#nivel").text(atrs["xp"]);
    det.find("#edad").text(getEdad(criat.edad));

//    $('#graficoCriat').visualize({
//        type: 'line',
//        colors: ['#be1e2d', '#666699', '#92d5ea', '#ee8310', '#8d10ee', '#5a3b16', '#26a4ed', '#f45a90', '#e9e744'],
//        lineWeight: 2
//    });

    reloadTablas();
}

function parseDate(input) {
    var n = input.split("/");
    return n[2] * 370 + n[1] * 35 + n[0];
}

function popDetalles(criatura) {

    var doc_width = $(document).width();
    var doc_height = $(document).height();

    dialog_count++;
    var nombre = criatura.nombre;

    var height = 480;
    var width = 300;

    $('#detalles_' + criatura.id).dialog({
        show: {
            effect: 'fade',
            duration: 150
        },
        resizable: false,
        closeOnEscape: false,
//        height: height,
        width: width,
        title: nombre,
        position: [doc_width / 2 - width / 2 + 30 * dialog_count, doc_height / 2 - height / 2 + 30 * dialog_count],
        close: function() {
            $('#detalles_' + criatura.id).remove();
            dialog_count--;
        }
    });

    var height = $('#detalles_' + criatura.id + " .aspecto").height();
    var width = height / 1.55;
    var canvas = $('<canvas id ="canvasAspecto_' + criatura.id + '" height="' + height + 'px" width="' + width + 'px"/>')
    $('#detalles_' + criatura.id + " .aspecto").html(canvas);

//    var canvas = $("#canvasAspecto_" + criatura.id).get(0);
    var stage = new createjs.Stage(canvas[0]);
    if (criatura.tiempoVenta !== -1) {
        loadCanvasAspecto(criatura, stage);
    } else {
        loadCanvasAspectoAcademia(criatura, stage);
    }
}

$('body').keyup(function(event) {

    if (event.keyCode === 27) {

        if ($(".ui-dialog")[0]) {

            var index_highest = 0;

            var dialog;
            var dialog_highest;

            $(".ui-dialog").each(function() {
                // always use a radix when using parseInt
                dialog = $(this);

                var index_current = parseInt($(this).css("zIndex"));

                if (index_current > index_highest) {
                    index_highest = index_current;

                    dialog_highest = dialog.find("div[id^=detalles]");
                }
            });
            dialog_highest.dialog("close");
        }
    }

});

$(".boton").hover(function() {
    $(this).fadeTo(800, 1);
});

$('body').keyup(function(event) {
    if (event.keyCode === 38) {
        var index = $(".selected").index();
        $("#table1 tr:eq(" + (index) + ")").trigger('click');
    }
    if (event.keyCode === 40) {
        var index = $(".selected").index();
        $("#table1 tr:eq(" + (index + 2) + ")").trigger('click');
    }
});

$("html").click(function() {
    if ($("#detalleCriatura.movil").height() > 0) {
        $("#bloque").height("100%");
        $("#detalleCriatura").height("0%");
    }
});

function pestanas() {
    var margin = 0;
    $(".tituloPestana").each(function() {
        $(this).css("margin-right", margin + "px");
        margin = margin + 111;
    });
}
function setProximaBatalla(batalla) {
//    if (batalla.eqLoc == global.perfil.id) {
//        $("#contrincante").text(batalla.eqVisName);
//    } else {
//        $("#contrincante").text(batalla.eqLocName);
//    }

    $("#proximaBatalla_equipoLocal").text(batalla.eqLocName);
    $("#proximaBatalla_equipoVisitante").text(batalla.eqVisName);

    $("#tipo").text(batalla.tipo);
    $("#fecha").text(getFechaBySeconds(batalla.fecha));
    $("#hora").text();
}


$(window).on('hashchange', function() {
    documentLoad();
});
function documentLoad() {
    $(document).ready(function() {
        //mapCreator.disable();
        helpers();
    });
}

function validate(response, callback) {
    if (response.substring(0, 2) == "<h") {
        $("html").html(response);
    } else {
        callback();
    }
}
