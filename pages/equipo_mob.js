//
//var equipoJs = {
//    equipo: global.equipo,
//    i: 0,
//    canvas: document.createElement('canvas'),
//    stage: {},
//    iniciarCanvas: function() {
//        var ths = this;
//        ths.canvas.width = 90;
//        ths.canvas.height = 135;
//        $("#aspectoDiv").append(ths.canvas);
//        $(ths.canvas).attr("id", "aspecto");
//        ths.stage = new createjs.Stage(ths.canvas);
//    },
//    mostrarEquipo: function() {
//        var equipo = this.equipo;
//        $("#numCriaturas").html(" (" + equipo.length + " <small>/20</small>)");
//        var table = $("#tableEquipo tbody").get(0);
//        $(table).html("");
//        var rowCount = 0;
//        var cell;
//        var max = 0;
//        var min = 100;
//        for (var i = 0; i < equipo.length; i++) {
//            var media = getMedia(equipo[i].media);
//            if (media > max)
//                max = media;
//            if (media < min)
//                min = media;
//        }
//
//        var row = table.insertRow(rowCount);
//        for (var i = 0; i < 8; i++) {
//            cell = row.insertCell(i);
//        }
//
//        var mediaDif = max - min;
//        for (var i = 0; i < equipo.length; i++) {
//
//            var evo = JSON.parse(equipo[i].evolucion);
//            var row = table.insertRow(rowCount);
//
//            $(row).attr("id", equipo[i].id);
//            $(row).attr("class", "UnHighLight");
//            $(row).attr("onclick", 'equipoJs.detalle(' + i + ')');
//
//
//            cell = row.insertCell(0);
//            cell.innerHTML = getNombre(equipo[i]);
//            //$(cell).css("padding-left", "5px");
//			
//            cell = row.insertCell(1);
//            setRazaImg(cell, equipo[i].raza);
//            cell = row.insertCell(2);
//            setClaseImg(cell, equipo[i].clases);
//            cell = row.insertCell(3);
//            setElemImg(cell, equipo[i].elemento);
//            cell = row.insertCell(4);
//            setMutaImg(cell, equipo[i].mutacion);
//            var cellMedia = row.insertCell(5);
//            var atributos = ["fu", "ma", "ag", "rf", "co", "df", "rc"];
//            var mediaOld = 0;
//            for (var j = 0; j < atributos.length; j++) {
//                mediaOld = mediaOld + evo[evo.length - 2][atributos[j]];
//            }
//            var media = getMedia(equipo[i].media);
//            mediaOld = getMedia(mediaOld);
//            this.setDif(cellMedia, media, mediaOld);
//
//            var color1 = Math.round((media - min) / mediaDif * 100) + 155;
//            var color2 = Math.round((media - min) / mediaDif * 100) + 100;
//            $(cellMedia).css("color", "rgba(" + color1 + "," + color2 + ",0,1)");
//            cell = row.insertCell(6);
//            setNivel(cell, evo[evo.length - 1]["xp"], evo[evo.length - 2]["xp"]);
//            cell = row.insertCell(7);
//            cell.innerHTML = getEdad(equipo[i].edad);
//
//            rowCount++;
//        }
//    },
//    setDif: function(cell, atr, old) {
//        cell.innerHTML = "<norm>" + atr + "</norm>";
//        if (old > -1) {
//            var dif = parseInt(atr - old);
//            if (dif > 0) {
//                $(cell).append("<dif> +" + dif + "</dif>");
//            }
//        }
//    },
//    detalle: function(i) {		
//        global.criatura = this.equipo[i];
//        detalleCriatura(global.criatura, this.stage);
//
//		if(window.isMobile){
//			$(".none").removeClass("none");
//			//$("#detalleCriatura > div").removeClass("none");
//			$("#" + global.criatura.id).append($("#detalleCriatura"));
//			$("#" + global.criatura.id + " > td").addClass("none");
//		}
//		
//    },
//    botonVender: function() {
//        var criat = this.equipo[this.i];
//        this.precioVenta = numero(criat.precio);
//        $("#precioVenta").text(this.precioVenta);
//        $('#divVender').dialog({
//            resizable: false,
//            closeOnEscape: false,
//            height: 150,
//            width: 300,
//            title: criat.nombre,
//            modal: true,
//            draggable: true,
//            close: function() {
//                $(this).dialog("destroy");
//            }
//        });
//    },
//    vender: function(elem) {
//        var ths = this;
//        var id = this.equipo[this.i].id;
//		
//        $(elem).closest(".dialog").dialog('close');
//        if (this.equipo.length === 1) {
//            aviso('no puedes quedarte sin criaturas!');
//            return;
//        }
//        $.ajax({
//            type: "GET",
//            url: "vender",
//            data: {
//                id: id
//            },
//            success: function(response) {
//                if (response === "") {
//                    global.perfil.oro -= ths.precioVenta;
//                    cargarPerfil();
//
//                    var index = getIndexById(id, global.equipo);
//                    global.equipo.splice(index, 1);
//                    ths.mostrarEquipo();
//
//                    confirmacion("criatura vendida");
//                } else {
//                    error(response);
//                }
//            }
//        });
//    },
//    events: function() {
//        var ths = this;
//        $("#apodoDetalles").focus(function() {
//            if ($("#apodoDetalles").hasClass("sinApodo")) {
//                $("#apodoDetalles").val("");
//            } else {
//                $("#apodoDetalles").val($("#apodoDetalles").val().split('" ')[1].split(' "')[0]);
//            }
//        });
//        $("#apodoDetalles").blur(function() {
//            var criat = ths.equipo[ths.i];
//            if ($("#apodoDetalles").val() !== criat.apodo) {
//                $.ajax({
//                    type: "GET",
//                    url: "asignarApodo",
//                    data: {
//                        id: criat.id,
//                        apodo: $("#apodoDetalles").val()
//                    }
//                });
//            }
//            criat.apodo = $("#apodoDetalles").val();
//            if ($("#apodoDetalles").val() !== "") {
//                $("#apodoDetalles").val('" ' + $("#apodoDetalles").val() + ' "');
//                $("#equipo_" + ths.i).find(".apodo").text($("#apodoDetalles").val());
//            } else {
//                $("#equipo_" + ths.i).find(".apodo").text('');
//            }
//        });
//		
//		$('#botonFinalVender').keydown(function(e) {
//            if (e.keyCode === 13) {
//                return false;
//            }
//        });
//    }
//};
//
//equipoJs.mostrarEquipo();
//equipoJs.events();
//equipoJs.iniciarCanvas();
