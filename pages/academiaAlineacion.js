

$("#alineacionCanvasAcademia").height($(document).height() - $("header").height());

var alineacionAcademiaJs = {
    equipo: global.equipoAcademia,
    canvas: document.createElement('canvas'),
    colocarAlineacion: function() {
        var ths = this;
        var table = $("#equipoAlineacionAcademia");

        for (var i = 0; i < ths.equipo.length; i++) {
            var row = $("<div>");
            $(table).append(row);
            row.attr("i", i);
            row.addClass("UnHighLight");

            var atributos = $("<nobr>");

            var atrs = {};
            if (typeof ths.equipo[i].evolucion !== 'undefined') {
                var evo = JSON.parse(ths.equipo[i].evolucion);
                atrs = evo[evo.length - 1];
            }

            atributos.addClass("atributos");
            atributos.append("<div>" + atr(atrs.fu) + "</div>");
            atributos.append("<div>" + atr(atrs.ma) + "</div>");
            atributos.append("<div>" + atr(atrs.ag) + "</div>");
            atributos.append("<div>" + atr(atrs.rf) + "</div>");
            atributos.append("<div>" + atr(atrs.co) + "</div>");
            atributos.append("<div>" + atr(atrs.df) + "</div>");
            atributos.append("<div>" + atr(atrs.rc) + "</div>");

            row.append(atributos);
            $(row).append("<br>");

            var nombre = getNombre(ths.equipo[i]);
            var nobr = $("<nobr>");
            $(nobr).append(nombre + " (" + getEdad(ths.equipo[i].edad) + ")");
            $(row).append(nobr);

            var nobr = $("<div>");
            setRazaImg(nobr, ths.equipo[i].raza);

            if (typeof ths.equipo[i].elemento !== 'undefined' && ths.equipo[i].elemento !== '') {
                setElemImg(nobr, ths.equipo[i].elemento);
            } else {
                nobr.append("<div class='AttrImg'>-</div>");
            }
            if (typeof ths.equipo[i].mutacion !== 'undefined' && ths.equipo[i].mutacion !== '') {
                setMutaImg(nobr, ths.equipo[i].mutacion);
            } else {
                nobr.append("<div class='AttrImg'>-</div>");
            }

            $(row).append(nobr);
        }
        ths.events();
    },
    select: function(elem) {
        alineacion.selectX = $(elem).offset().left;
        alineacion.selectY = $(elem).offset().top;
        alineacion.dropCriatura();
    },
    events: function() {
        var ths = this;
        Hammer($("#equipoAlineacionAcademia > div")).on("tap", function(e) {
            timePropagation();
            alineacion.unActive();
            var i = $(this).attr("i");
            alineacion.dragId = alineacion.obj[i].id;
            ths.select(this);
        });
        Hammer($("#equipoAlineacionAcademia")).on("swiperight, tap", function(e) {
            timePropagation();
            $(this).removeClass("swipRight");
            alineacion.unActive();
            e.stopPropagation();
        });

        Hammer($("#atributos > div, #atributos > p")).on("tap", function(e) {
            e.stopPropagation();
        });
        Hammer($("#atributos")).on("swiperight, tap", function(e) {
            $(this).removeClass("swipRight");
            alineacion.unSelect();
            e.stopPropagation();
        });
    }
};

///////////////////////////////////////////////////////////////////////////////

var alineacion = alineacionObj;
alineacion.alineacion = "alinAcad";

alineacion.canvas = document.getElementById("canvasAlineacionAcademia");
alineacion.contenedor = $("#alineacionCanvasAcademia");
alineacion.botonAsignar = $("#asignarAlineacionAcademia");
alineacion.claseSelect = $("#clase");
alineacion.actitudSelect = $("#actitud");
alineacion.lista = $("#equipoAlineacionAcademia");
alineacion.atributos = $("#atributos");
alineacion.nombre = $("#atributoTitulo");

alineacion.obj = global.equipoAcademia;
alineacionAcademiaJs.colocarAlineacion();
alineacion.startCanvas();

$("#equipoAlineacionAcademia").css("right", -$("#equipoAlineacionAcademia").width() - 20 + "px");
$("#atributos").css("right", -$("#atributos").width() - 20 + "px");
