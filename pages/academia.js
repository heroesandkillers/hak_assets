
function getBatallaAcademia() {
    var i = $("#selectBatallas").val();
    getBatalla(batallasAcademia[i]);
}

var academiaEquipoJs = {
    canvas: document.createElement('canvas'),
    eqAcademia: global.equipoAcademia,
    createCanvas: function () {
        var ths = this;
        ths.canvas.width = 80;
        ths.canvas.height = 120;
        $("#aspectoDiv").append(ths.canvas);
        $(ths.canvas).attr("id", "aspecto");
        ths.stage = new createjs.Stage(ths.canvas);
    },
    batallasAcademia: global.batallasAcademia,
    getBatallasAcademia: function () {
        if (this.batallasAcademia === "") {
            var ths = this;
            $.ajax({
                type: "GET",
                url: url + "getBatallasAcademia",
                success: function (response) {
                    ths.batallasAcademia = JSON.parse(response);
                    ths.selectBatallas();
                }
            });
        } else {
            this.selectBatallas();
        }
    },
    selectBatallas: function () {
        for (var i = 0; i < this.batallasAcademia.length; i++) {
            $('<option>').val(i).text(this.batallasAcademia[i].equipoLocal + " : " + this.batallasAcademia[i].equipoVisitante).appendTo('#selectBatallas');
        }
    },
    mostrarAcademia: function () {
        var eqAcademia = this.eqAcademia;
        var table = $("#tableAcademia tbody").get(0);
        $(table).html("");
        var rowCount = 0;

        $("#numCriaturasAcademia").text(" (" + eqAcademia.length + ") ");

        for (var i = 0; i < eqAcademia.length; i++) {

            var row = table.insertRow(rowCount);

            $(row).attr("id", this.eqAcademia[i].id);
            $(row).attr("class", "UnHighLight");
            $(row).attr("onclick", 'academiaEquipoJs.detalle(' + i + ')');
            
            var td0 = $("<td>");
            $(row).append(td0);
            td0.html(eqAcademia[i].nombre);
            
            var td1 = $("<td>");
            $(row).append(td1);
            setRazaImg(td1[0], eqAcademia[i].raza);

            var atributos = ["fu", "ma", "ag", "rf", "co", "df", "rc"];
            
            var td2 = $("<td>");
            $(row).append(td2);
            
            var td3 = $("<td>");
            $(row).append(td3);
            
            var td4 = $("<td>");
            $(row).append(td4);
            
            var destapes = 0;
            if (typeof this.eqAcademia[i].destapes !== 'undefined') {
                try {
                    var dest = JSON.parse(eqAcademia[i].destapes);
                } catch (e) {
                    error(eqAcademia[i].destapes);
                    return;
                }

                setElemImg(td2[0], dest.ele);
                setMutaImg(td3[0], dest.mut);

                for (var j = 0; j < atributos.length; j++) {
                    var destape = setDest(dest[atributos[j]]);
                    if (destape !== "-") {
                        destapes++;
                    }
                }
            }
            td4.text(destapes);
            
            var td5 = $("<td>");
            $(row).append(td5);
            setNivel(td5[0], eqAcademia[i].exp);
            
            var td6 = $("<td>");
            $(row).append(td6);
            td6.html(getEdad(eqAcademia[i].edad));
        }
    },
    detalle: function (i) {
        var ths = this;
        $(".alturaDetalle").removeClass("alturaDetalle");

        $(".none").removeClass("none");
        global.criatura = ths.eqAcademia[i];
        detalleCriatura(global.criatura, ths.stage);
        $("#" + global.criatura.id).append($("#detalleCriatura"));
        $("#" + global.criatura.id + " > td").addClass("none");
        $("#detalleCriatura > div").addClass("alturaDetalle");

        $(".observable").each(function () {
            var div = $(this);
            var td = div.parent().parent().find('td:eq(1)');

            div.removeClass("observar");
            if (td.text().search("-") === -1) {
                div.addClass("observar");
                div.click(function () {
                    ths.ocultarValor();
                    ths.atributo = td.attr("id");
                });
            }
        });
    },
    ocultarValor: function () {
        var nombre = this.eqAcademia[this.i].nombre;
        $("#atrOcultar").text(this.atributo.toUpperCase());

        $('#divOcultar').dialog({
            resizable: false,
            closeOnEscape: false,
            height: 150,
            width: 300,
            title: nombre,
            modal: true,
            draggable: true,
            close: function () {
                $(this).dialog("destroy");
            }
        });
    },
    ocultar: function (elem) {
        var ths = this;

        $(elem).closest('.dialog').dialog('close');
        var id = ths.eqAcademia[ths.i].id;
        $.ajax({
            type: "GET",
            url: url + "ocultar",
            data: {
                id: id,
                atr: ths.atributo
            },
            success: function (response) {
                if (response !== "") {
                    error(response);
                }
                ths.eqAcademia[ths.i][ths.atributo] = 0;
                ths.pestanaAcademia('academiaEquipo');
            }
        });
    },
    setDest: function (i) {
        if (i <= 0) {
            i = "-";
        }
        return i;
    },
    botonExpulsar: function () {
        var nombre = this.eqAcademia[this.i].nombre;
        $("#nombreExpulsado").text(nombre);

        $('#divExpular').dialog({
            resizable: false,
            closeOnEscape: false,
            height: 150,
            width: 300,
            title: nombre,
            modal: true,
            draggable: true,
            close: function () {
                $(this).dialog("destroy");
            }
        });
    },
    expulsar: function (elem) {
        $(elem).closest(".dialog").dialog('close');

        var ths = this;
        $.ajax({
            type: "GET",
            url: url + "expulsar",
            data: {
                id: ths.eqAcademia[ths.i].id
            },
            success: function (response) {
                if (response !== "") {
                    error(response);
                } else {
                    confirmacion("criatura expulsada");
                }
                $('#divExpulsar').dialog('close');
                global.equipoAcademia = "";
                ths.pestanaAcademia('academiaEquipo');
            }
        });
    },
    events: function () {
//        var ths = this;
        $('#botonFinalExpular').keydown(function (e) {
            if (e.keyCode === 13) {
                return false;
            }
        });
//        Hammer($("#detalleCriatura")).on("tap", function () {
//
//            var atributos = ["fu", "ma", "ag", "rf", "co", "df", "rc"];
//            var menu = $("#divOcultables").html("");
//            var div = $("<div>");
//
//            if (typeof global.criatura.destapes !== 'undefined') {
//                var dest = JSON.parse(global.criatura.destapes);
//
//                for (var j = 0; j < atributos.length; j++) {
//                    div = $("<div>");
//                    div.append(setDest(dest[atributos[j]]));
//                    menu.append(div);
//                }
//            } else {
//                menu.append("no hay atributos para destapar");
//            }
//
//            var nombre = global.criatura.nombre;
//            $('#divOcultables').dialog({
//                resizable: false,
//                closeOnEscape: false,
//                height: 150,
//                width: 300,
//                title: nombre,
//                modal: true,
//                draggable: true,
////                close: function () {
////                    $(ths).dialog("destroy");
////                }
//            });
//        });
    }
};

academiaEquipoJs.mostrarAcademia();
academiaEquipoJs.createCanvas();
academiaEquipoJs.events();

$("#detalleCriatura").css("bottom", -$("#detalleCriatura").height());
Hammer($("#detalleCriatura")).on("click", function () {
    $("#detalleCriatura").removeClass("swipBottom");
});
