
if (!window.isMobile) {
    documentLoad();
}


var mazmorrasJs = {
    obj: global.mazmorras,
    filas: 0,
    i: 0,
    anchoBarra: "",
    cargado: true,
    indiceApretado: "",
    pre: 0,
    notReady: true,
    canvas: document.createElement('canvas'),
    medidas: function () {
        var ths = this;
        var alto = 200 / $("#bloquePrincipal").parent().height() * 100;
        var alto2 = 200 / ($("#bloquePrincipal").parent().height() - 60) * 100;
        $("#bloquePrincipal").height(100 - alto2 + "%");
        $("#bloqueSegundo").height(alto + "%");
        var filasCapacidad = $(".scrollMazmorras").height() / 25;
        var inferior = true;
        while (inferior === true) {
            ths.filas = ths.filas + 5;
            if (ths.filas + 5 > filasCapacidad) {
                inferior = false;
            }
        }
        $("#contenedorBarra").css("width", $("#buscadorMazmorras").width() - 61 + "px");
    },
    getMisPujas: function () {
        var ths = this;

//        $.ajax({
//            type: "GET",
//            url: url + "getMisPujas",
//            success: function(response) {
//                if (response !== "") {
//                    try {
//                        ths.obj = JSON.parse(response);
//                    } catch (e) {
//                        error(response);
//                        return;
//                    }
//                    ths.colocarCells();
//                }
//            }
//        });

        ajax.call("getMisPujas", null, function (response) {
            console.log("response = ")
            console.log(response)
            ths.obj = response;
            ths.colocarCells();
        });
    },
    getMazmorrasRango: function (elem) {
        var ths = this;
        var recarga = false;
        if (typeof elem !== 'undefined') {
            if ($(elem).hasClass('noClick'))
                return;
            this.paralizarBoton(elem);
        } else {
            recarga = true;
        }

        var peticion = "";
        for (var i = 1; i < $(".filtro").length; i++) {

            var atributo = $(".filtro:eq(" + i + ")").find(".selectAtributo option:selected").val();
            var inferior = 0;
            var superior = 100;
            if ($(".filtro:eq(" + i + ")").find(".selectSigno option:selected").val() === 'igual') {
                inferior = $(".filtro:eq(" + i + ")").find(".selectNumero").val();
                superior = parseInt($(".filtro:eq(" + i + ")").find(".selectNumero").val()) + 1;
            }
            if ($(".filtro:eq(" + i + ")").find(".selectSigno option:selected").val() === 'mayor') {
                inferior = $(".filtro:eq(" + i + ")").find(".selectNumero").val();
            }
            if ($(".filtro:eq(" + i + ")").find(".selectSigno option:selected").val() === 'menor') {
                superior = $(".filtro:eq(" + i + ")").find(".selectNumero").val();
            }

            peticion = peticion + atributo + "," + inferior + "," + superior + ";";
        }
        ths.peticion = peticion;
        ths.ajaxMazmorrasRango(recarga);
    },
    ajaxMazmorrasRango: function (recarga) {
        var ths = this;
        $.ajax({
            type: "GET",
            url: url + "getMazmorrasRango",
            data: {
                peticionJson: ths.peticion
            },
            success: function (response) {
                try {
                    ths.obj = JSON.parse(response);
                } catch (e) {
                    console.log("JSON error = " + response);
                    return;
                }
                console.log(ths.obj);

                if (recarga) {
                    $(".buscadorCell:eq(" + ths.indiceApretado + ")").trigger('click');
                } else {
                    ths.colocarCells();
                    //ths.cargarMazmorras(0, ths.filas - 1);
                }
            }
        });
    },
    paralizarBoton: function (elem) {

        var segundos = 2;
        $(elem).addClass('noClick');
        var timerId = setInterval(function () {

            $(elem).text(segundos);
            if (segundos === 0) {
                clearTimeout(timerId);
            }
            segundos--;
        }, 1000);
        setTimeout(function () {
            $(elem).removeClass('noClick');
            $(elem).text("Buscar");
        }, (segundos + 2) * 1000);
    },
    colocarCells: function () {
        //clean
        $("#tableMazmorras .scrollMazmorras tbody tr").remove();

        var ths = this;
        if (ths.obj.length > 0) {

            var entradasMazmorras = parseInt(parseInt(ths.obj.length - 1) / ths.filas);
            ths.anchoBarra = (entradasMazmorras + 1) * $(".buscadorCell:first").width();

            if ($("#barraMazmorras").data('draggable')) {
                $("#barraMazmorras").draggable("destroy");
            }

            $("#barraMazmorras").width(ths.anchoBarra);
            $("#barraMazmorras").css("left", 0);
            for (var i = $(".buscadorCell").length; i > 0; i--) {
                $(".buscadorCell:eq(" + i + ")").remove();
            }
            $(".buscadorCell").css("display", "inherit");
            for (var i = 1; i < entradasMazmorras + 1; i++) {

                var a = (i) * ths.filas + 1;
                var b = (i + 1) * ths.filas;
                var entradaMaz = $(".buscadorCell:last").clone().insertAfter(".buscadorCell:last");
                entradaMaz.text(a + " - " + b);
                ths.clicableCell(entradaMaz, a - 1, b - 1);
            }
            $(".buscadorCell:first").text(1 + " - " + (1 * ths.filas));
            $('.buscadorCell:first').trigger('click');
        } else {
            $(".buscadorCell").css("display", "none");
        }
    },
    clicableCell: function (elem, min, max) {
        var ths = this;
        elem.click(function () {
            ths.cargado = false;
            $(".buscadorCell").removeClass("apretado");
            $(this).addClass("apretado");
            ths.pre = $(".buscadorCell").index(elem);
            ths.cargarMazmorras(min, max);

            //var pane = $('.scrollMazmorras');
            //pane.data('jsp').scrollToY(1, 0);

            ths.cargado = true;
        });
    },
    recargarMazmorras: function (indice) {
        this.indiceApretado = indice;
        this.ajaxMazmorrasRango(true);
    },
    moverBarra: function (elem, inicial, termino, tiempo) {

        var variacion = (inicial - termino) / tiempo;
        var intervalo = setInterval(function () {

            inicial = inicial - variacion;
            $(elem).css("left", inicial + "px");
            tiempo--;
            if (tiempo === 0) {
                clearTimeout(intervalo);
            }
        }, 40);
    },
    addMazmorras: function () {
        var ths = this;
        var table = document.getElementById("tableMazmorras").getElementsByClassName("tbody")[0].getElementsByTagName("tbody")[0];
        var trs = table.getElementsByTagName("tr");
        var rowCount = trs.length;
        var min = parseInt(trs[rowCount - 1].id.split("_")[1]) + 1;
        var max = min + ths.filas;
        var num = max;
        if (ths.obj.length < max) {
            num = ths.obj.length - 1;
        }
        ths.rowsMazmorras(table, rowCount, min, num);
    },
    addMazmorrasTop: function () {
        var table = document.getElementById("tableMazmorras").getElementsByClassName("tbody")[0].getElementsByTagName("tbody")[0];
        table.innerHtml = "";
        var max = ths.filas * pre - 1;
        var min = max - ths.filas + 1;
        rowsMazmorras(table, 0, min, max);
    },
    cargarMazmorras: function (min, max) {
        var ths = this;
        if (ths.obj.length > 0) {

            //INICIO DE BARRA DE BUSCADOR
            var num = max + ths.filas;
            if (ths.obj.length < num) {
                num = ths.obj.length - 1;
            }

            if (ths.anchoBarra > $("#contenedorBarra").width()) {
                $("#barraMazmorras").draggable({
                    axis: "x",
                    drag: function () {
                        $(this).find('.buscadorCell').addClass('noClick');
                    },
                    stop: function () {
                        $(this).find('.buscadorCell').removeClass('noClick');
                        var limiteInverso = ths.anchoBarra * (-1) + $("#contenedorBarra").width();
                        if ($("#barraMazmorras").css("left").split("px")[0] > 0) {
                            ths.moverBarra("#barraMazmorras", $("#barraMazmorras").css("left").split("px")[0], 0, 5);
                        }
                        if ($("#barraMazmorras").css("left").split("px")[0] < limiteInverso) {
                            ths.moverBarra("#barraMazmorras", $("#barraMazmorras").css("left").split("px")[0], limiteInverso, 5);
                        }
                    }

                });
            }
            //FIN DE BARRA DE BUSCADOR

            var table = document.getElementById("tableMazmorras").getElementsByClassName("tbody")[0].getElementsByTagName("tbody")[0];
            table.innerHTML = "";
            ths.rowsMazmorras(table, 0, min, num);
        } else {
            $("#tableMazmorras .tbody tbody").html("<div style='text-align:center; margin-top:150px'>No hay resultados para la búsqueda</div>");
        }
    },
    rowsMazmorras: function (table, rowCount, min, num) {
        var ths = this;
        var row;
        var cell;
        for (var i = min; i <= num; i++) {

            $(row).append(cell = $("<td>"));
            $(table).append(row = $("<tr>"));

            row.attr("id", "mazmorras_" + i);
            row.attr("real_id", ths.obj[i].id);
            row.addClass("UnHighLight");
            row.attr("onMouseOver", "HighLight(this)");
            row.attr("onMouseOut", "UnHighLight(this)");
            row.attr("onclick", 'Select(this), mazmorrasJs.detMazmorras(' + i + ')');
            row.attr("ondblclick", "detalles()");

            row.append(cell = $("<td>"));
            cell.html("<div>" + ths.obj[i].nombre + "</div>");

            row.append(cell = $("<td>"));
            var div = $("<div>");
            cell.append(div);
            setRazaImg(div, ths.obj[i].raza);

            row.append(cell = $("<td>"));
            var div = $("<div>");
            cell.append(div);
            setClaseImg(div, ths.obj[i].clases);

            row.append(cell = $("<td>"));
            var div = $("<div>");
            cell.append(div);
            setElemImg(div, ths.obj[i].elemento);

            row.append(cell = $("<td>"));
            var div = $("<div>");
            cell.append(div);
            setMutaImg(div, ths.obj[i].mutacion);

            row.append(cell = $("<td>"));
            cell.html("<div style='font-weight:900'>" + getMedia(ths.obj[i].media) + "</div>");

            row.append(cell = $("<td>"));
            cell.html("<div>" + ths.obj[i].fuerza + "</div>");

            row.append(cell = $("<td>"));
            cell.html("<div>" + ths.obj[i].magia + "</div>");

            row.append(cell = $("<td>"));
            cell.html("<div>" + ths.obj[i].agilidad + "</div>");

            row.append(cell = $("<td>"));
            cell.html("<div>" + ths.obj[i].reflejos + "</div>");

            row.append(cell = $("<td>"));
            cell.html("<div>" + ths.obj[i].constitucion + "</div>");

            row.append(cell = $("<td>"));
            cell.html("<div>" + ths.obj[i].defensa + "</div>");

            row.append(cell = $("<td>"));
            cell.html("<div>" + ths.obj[i].reaccion + "</div>");

            row.append(cell = $("<td>"));
            var div = $("<div>");
            cell.append(div);
            setNivel(div, ths.obj[i].exp);

            row.append(cell = $("<td>"));
            cell.html("<div>" + getEdad(ths.obj[i].edad) + "</div>");

            var arrayPujas = ths.obj[i].pujas.split(";");
            var puja = arrayPujas[(arrayPujas.length) - 2];
            var arrayPuja = puja.split(",");
            var precio = arrayPuja[1];
            row.append(cell = $("<td>"));
            cell.html("<div>" + numero(precio) + "</div>");

            row.append(cell = $("<td>"));
            var numPujas = arrayPujas.length - 2;
            if (numPujas > 0) {
                var div = $("<div>");
                $(cell).append(div);
                div.html(numPujas);

                var img = $("<img>");
                img.addClass("icon iconPujas");
                img.attr("src", '../../hak_static/img/iconos/pujas.png');
                img.attr("onclick", "mazmorrasJs.pujas('" + ths.obj[i].pujas + "')");
                div.append(img);
            }

            var cell = $("<td>");
            cell.css("text-align", "right");
            row.append(cell);
            var fechaVenta = ths.obj[i].tiempoVenta;
            var diff = fechaVenta * 1000 - new Date().getTime();
            if (diff > 0) {
                cell.html("<div>" + getCountdown(diff) + "</div>");
            } else {
                cell.html("<div>terminado</div>");
            }
            if (ths.obj[i].tiempoVenta < global.tiempoActual / 1000 + 300) {
                row.style.color = 'yellow';
            } else if (ths.obj[i].tiempoVenta < global.tiempoActual / 1000) {
                row.style.color = 'black';
            }
            for (var j = 0; j < arrayPujas.length - 3; j++) {
                if (global.perfil.id == arrayPujas[j].split(",")[0]) { //==
                    row.style.color = 'red';
                }
            }

            if (global.perfil.id == ths.obj[i].user) { //==
                row.css("color", "#00FF11");
            }
            rowCount++;
        }
        $("#tableMazmorras .tbody tbody tr:nth-child(" + (ths.filas) + "n)").css("border-bottom", "solid 1px red");
        reloadTablas();
        helpers();
        ths.scrollReady();
    },
    detMazmorras: function (i) {
        var ths = this;
        global.criatura = this.obj[i];

        var perfil = global.perfil;
        $("#contenidoDetalle").css("display", "inherit");
        $("#detalleCriatura .maximizar").css("pointer-events", "auto");

        var pujas = ths.obj[i].pujas;
        var arrayPujas = pujas.split(";");
        var puja = arrayPujas[(arrayPujas.length) - 2];
        var arrayPuja = puja.split(",");
        var precio = arrayPuja[1];

        var precioNum = parseInt(precio);
        var precioMin = precioNum;
        var precioMax = perfil.oro;
        if (arrayPuja[0] !== '') {
            precioMin = precioMin * 1.02;
            if (arrayPuja[0] === perfil.nombreId) {
                precioMin = precioNum;
                precioMax = perfil.oro + precioNum;
            }
        }
        if (precioNum > perfil.oro) {
            $("#botonPuja").attr('disable', "true");
        }
        this.selectedId = ths.obj[i].id;

        $("#divPujar .salto").css("display", "inherit");
        $("#pujaMin").css("display", "none");
        if (arrayPuja[0] !== '') {
            if (arrayPuja[0] !== perfil.nombreId) {
                $("#pujaMin").css("display", "inherit");
                $("#divPujar .salto").css("display", "none");
                $("#pujaMin span").text(numero(precio * 1.02 + ""));
            }
        }

        $("#precioPuja").text(numero(precio));
        ths.disableBoton(precioMin, precioMax);
        detalleCriatura(ths.obj[i], ths.stage, "#bloquePrincipal .detalleCriatura");
    },
    takeEquipoI: function () {
        var id = $(".selected").attr("id");
        var arrayId = id.split("_");
        this.i = arrayId[1];
    },
    takeMazmorrasId: function () {
        var id = $(".selected").attr("id");
        var arrayId = id.split("_");
        var i = arrayId[1];
        this.idCriatura = this.obj[i].id;
    },
    nuevoFiltro: function () {
        var elem = $(".filtro:first").clone().insertAfter(".filtro:last").css('dislpay', 'initial');
        $(elem).css('display', 'table-row');
        $(elem).find(".selectNumero").spinner();
    },
    mostrarCanvas: function () {
        var ths = this;
        ths.canvas.width = 100;
        ths.canvas.height = 150;
        $("#aspectoDiv").append(ths.canvas);
        $(ths.canvas).attr("id", "aspecto");
        ths.stage = new createjs.Stage(ths.canvas);
    },
    eliminarFiltro: function (elem) {
        if ($(".filtro").length > 1) {
            $(elem).closest(".filtro").remove();
        }
    },
    pujas: function (pujas) {

        var arrayPujas = pujas.split(";");
        var table = $("#tablaPujas tbody").get(0);
        $(table).html("");
        var rowCount = 0;

        for (var i = arrayPujas.length - 2; i > 0; i--) {

            //var row = table.insertRow(rowCount);
            //row.setAttribute("class", "UnHighLight");
            //var cell0 = row.insertCell(0);
            //cell0.innerHTML = arrayPujas[i].split(",")[0];
            //var cell1 = row.insertCell(1);
            //cell1.innerHTML = numero(arrayPujas[i].split(",")[1]);
            var puja = arrayPujas[i].split(",");
            var row = $("<tr>");
            $(table).append(row);
            row.addClass("UnHighLight");

            row.attr("user", puja[0].split(":")[0]);
            var cell0 = $("<tr>");
            cell0.text(puja[0].split(":")[1]);
            row.append(cell0);
            var cell1 = $("<tr>");
            cell1.text(numero(puja[1]));
            row.append(cell1);

            rowCount++;
        }

        $('#divPujas').dialog({
            resizable: false,
            closeOnEscape: false,
            height: 450,
            width: 300,
            title: 'pujadores',
            modal: false,
            draggable: true
        });
    },
    disableBoton: function (precioMin, precioMax) {
        $('#pujar').attr('disabled', 'true');
        $('#pujaRealizada').keyup(function () {
            var num = $('#pujaRealizada').val().split(".").join("");
            if (isInteger(num) === true) {
                if (parseInt(num) >= precioMin && parseInt(num) <= precioMax) {
                    $('#pujar').removeAttr('disabled');
                }
                if (parseInt(num) < precioMin) {
                    $('#pujar').attr('disabled', 'true');
                }
                if (parseInt(num) > parseInt(precioMax)) {
                    $('#pujar').attr('disabled', 'true');
                }

            } else {
                $('#pujar').attr('disabled', 'true');
            }
            $('#pujaRealizada').val(numero(num));
        });
        $("#pujaRealizada").keydown(function (e) {
            if (e.keyCode === 13) {
                $("#pujar").trigger('click');
            }
        });
    },
    scrollReady: function () {
        var ths = this;
        if (ths.notReady) {

            $('.scrollMazmorras').bind('jsp-scroll-y', function (event, scrollPositionY, isAtTop, isAtBottom) {

                if (ths.cargado) {
                    if (isAtTop && ths.pre > 0) {

                        ths.cargado = false;
                        ths.addMazmorrasTop();
                        $(this).data('jsp').scrollToY(ths.filas * 25, 0);
                        ths.pre--;
                        ths.cargado = true;
                    } else if (isAtBottom) {
                        ths.cargado = false;
                        ths.addMazmorras();
                        ths.cargado = true;
                    }
                }

                var largo = $(".jspPane .tbody tbody tr").length;
                var cell = $(".buscadorCell")[ parseInt((largo / ths.filas) * (scrollPositionY / (largo * 25))) + ths.pre ];
                if (!$(cell).hasClass("apretado")) {
                    $(".buscadorCell").removeClass("apretado");
                    $(cell).addClass("apretado");
                }

            });
        }
        notReady = false;
    },
    //events: function() {
    //    $("#swipBusqueda").click(function(e) {
    //        e.stopPropagation();
    //        $("#busqueda").addClass("swipRight");
    //    });
    //    $(document).on("tap", function() {
    //        if ($("#busqueda").hasClass("swipRight")) {
    //            if (stopPropagation === false) {
    //                $("#busqueda").removeClass("swipRight");
    //            } else {
    //                stopPropagation = false;
    //            }
    //        }
    //    });
    //
    //    $("#busqueda").on("tap", function() {
    //        stopPropagation = true;
    //    });
    //},
    pujar: function (puja) {
        var ths = this;
        var indice = $(".apretado").index();
        $('#divPujar').dialog("close");

        ajax.call("pujar", {
            id: ths.selectedId,
            puja: puja.split(".").join("")
        }, function () {
            aviso(result);
            ths.recargarMazmorras(indice);
            getPerfil();
        });
    }
};


if (false) {
    mazmorrasJs.medidas();
    mazmorrasJs.colocarCells();
    mazmorrasJs.cargarMazmorras(0, mazmorrasJs.filas - 1);
    mazmorrasJs.clicableCell($(".buscadorCell:first"), 0, mazmorrasJs.filas - 1);
    mazmorrasJs.nuevoFiltro();
    mazmorrasJs.iniciarCanvas();
//            mazmorrasJs.events();
} else {
    mazmorrasJs.medidas();
//mazmorrasJs.colocarCells();
//mazmorrasJs.cargarMazmorras(0, mazmorrasJs.filas - 1);
    mazmorrasJs.clicableCell($(".buscadorCell:first"), 0, mazmorrasJs.filas - 1);
    mazmorrasJs.nuevoFiltro();
    mazmorrasJs.mostrarCanvas();
}
