//
//$("#bloqueEntrenamiento .iconoVer").on("tap", function() {
//    $("#datosEntreno").addClass("swipRight");
//});
//$("#datosEntreno").on("tap", function(e) {
//    e.stopPropagation;
//});
//$("#bloqueEntrenamiento .cuerpo").on("tap", function() {
//    $("#datosEntreno").removeClass("swipRight");
//});
//
//var desAcciones = {nada: "<q style='color:rgba(0,0,0,0.6)'>nada</q>",
//    vago: "Vaguear. <small> (+3 frescura, +2 defensa +1 magia)</small>",
//    trabajar: "Trabajar en la guardia. <small>(+3 oro, +2 reacci�n +1 defensa, -1 moral)</small>",
//    estudiar: "Estudiar magia. <small>(+3 magia, +2 defensa +1 frescura)</small>",
//    cazar: "Salir de caza. <small>(+3 agilidad, +2 reflejos +1 reaccion)</small>",
//    meditar: "Ir a la monta�a a Meditar. <small>(+3 defensa, +2 frescura +1 magia)</small>",
//    saquear: "Saquear un poblado. <small>(+3 oro, +2 reacci�n +1 fuerza)</small>",
//    nadar: "Cruzar el mar a nado. <small>(+3 constituci�n, +2 f�sico +1 reacci�n)</small>"};
//
//var atrs = ["fuerza", "magia", "agilidad", "reflejos", "constitucion", "defensa", "reaccion", "frescura", "moral", "oro", "experiencia"];
//var tiempos = ["manana", "tarde", "noche"];
//
//// SELECTS
//var tableS = document.getElementById("selectsEntrenamiento");
//
//tableS.innerHTML = "";
//var rowCount = 0;
//
//var acciones;
//var accionesManana = ["nada", "trabajar", "estudiar", "cazar", "nadar"];
//var accionesTarde = ["nada", "vago", "trabajar", "cazar", "meditar", "nadar"];
//var accionesNoche = ["nada", "vago", "estudiar", "meditar", "saquear"];
//
//for (var i = 0; i < tiempos.length; i++) {
//
//    var row = tableS.insertRow(rowCount);
//
//    var cell = row.insertCell(0);
//    cell.setAttribute("class", "entrenoDia");
//    cell.innerHTML = cap(tiempos[i] + ":");
//
//    var cell = row.insertCell(1);
//    $(cell).addClass("selectEntreno");
//    $(cell).addClass("select");
//
//    var select = $("<select>");
//    $(cell).append(select);
//
//    select.attr("id", tiempos[i]);
//    select.attr("placeholder", "nada");
//
//    if (tiempos[i] === "manana") {
//        acciones = accionesManana;
//    } else if (tiempos[i] === "tarde") {
//        acciones = accionesTarde;
//    } else if (tiempos[i] === "noche") {
//        acciones = accionesNoche;
//    }
//
//    for (var j = 0; j < acciones.length; j++) {
//        var option = $("<option>");
//        option.val(acciones[j]);
//        option.text(acciones[j]);
//        select.append(option);
//    }
//
//    rowCount++;
//}
//
////GUARDAR ENTRENO
//function asignarEntreno() {
//    $("#botonEntreno").attr("disabled", "disabled");
//
//    var manana = $("#manana span").attr("value");
//    var tarde = $("#tarde span").attr("value");
//    var noche = $("#noche span").attr("value");
//
//    $.ajax({
//        type: "GET",
//        url: url + "asignarEntreno",
//        data: {
//            manana: manana,
//            tarde: tarde,
//            noche: noche
//        },
//        success: function(response) {
//            if (response === "") {
//                confirmacion("guardado correctamente");
//            } else {
//                error(response);
//            }
//            global.perfil.entreno = JSON.stringify({manana: manana, tarde: tarde, noche: noche});
//        }
//    });
//}
//;
//
//// ACCIONES
//var table = document.getElementById("entrenamiento");
//table.innerHTML = "";
//var rowCount = 0;
//
//var oldAtr = {};
//var numAtr = {};
//for (var i = 0; i < atrs.length; i++) {
//    oldAtr[atrs[i]] = 0;
//    numAtr[atrs[i]] = 0;
//}
//var numMax = 10;
//
//for (var i = 0; i < atrs.length; i++) {
//
//    var row = table.insertRow(rowCount);
//
//    row.setAttribute("id", "var" + i);
//
//    var cell = row.insertCell(0);
//    cell.innerHTML = cap(atrs[i] + ":");
//    cell.style.width = "1px";
//
//    for (var j = 1; j < numMax + 1; j++) {
//        var cell = row.insertCell(j);
//        var div = document.createElement("div");
//        cell.appendChild(div);
//    }
//
//    var cell = row.insertCell(numMax + 1);
//    cell.setAttribute("class", "numeroAtributo");
//
//    rowCount++;
//}
//
//for (var j = 0; j < atrs.length; j++) {
//    $("#var" + j + " td:last").text(numAtr[atrs[j]]);
//}
//
//$("#selectsEntrenamiento select").change(function() {
//    $("#botonEntreno").removeAttr("disabled");
//
//    for (var m = 0; m < atrs.length; m++) { //restart all
//        numAtr[atrs[m]] = 0;
//    }
//
//    for (var k = 0; k < tiempos.length; k++) {
//        var val = $("#" + tiempos[k]).val();
//        if (val === "vago") {
//            numAtr["frescura"] = numAtr["frescura"] + 3;
//            numAtr["defensa"] = numAtr["defensa"] + 2;
//            numAtr["magia"] = numAtr["magia"] + 1;
//
//        } else if (val === "trabajar") {
//            numAtr["oro"] = numAtr["oro"] + 3;
//            numAtr["reaccion"] = numAtr["reaccion"] + 2;
//            numAtr["defensa"] = numAtr["defensa"] + 1;
//            numAtr["moral"] = numAtr["moral"] - 1;
//
//        } else if (val === "estudiar") {
//            numAtr["magia"] = numAtr["magia"] + 3;
//            numAtr["defensa"] = numAtr["defensa"] + 2;
//            numAtr["frescura"] = numAtr["frescura"] + 1;
//
//        } else if (val === "cazar") {
//            numAtr["agilidad"] = numAtr["agilidad"] + 3;
//            numAtr["reflejos"] = numAtr["reflejos"] + 2;
//            numAtr["reaccion"] = numAtr["reaccion"] + 1;
//
//        } else if (val === "meditar") {
//            numAtr["defensa"] = numAtr["defensa"] + 3;
//            numAtr["frescura"] = numAtr["frescura"] + 2;
//            numAtr["magia"] = numAtr["magia"] + 1;
//
//        } else if (val === "saquear") {
//            numAtr["oro"] = numAtr["oro"] + 3;
//            numAtr["reaccion"] = numAtr["reaccion"] + 2;
//            numAtr["fuerza"] = numAtr["fuerza"] + 1;
//
//        } else if (val === "nadar") {
//            numAtr["constitucion"] = numAtr["constitucion"] + 3;
//            numAtr["agilidad"] = numAtr["agilidad"] + 2;
//            numAtr["defensa"] = numAtr["defensa"] + 1;
//        }
//    }
//
//    for (var j = 0; j < atrs.length; j++) {
//
//        if (numAtr[atrs[j]] > oldAtr[atrs[j]]) {
//            for (var i = oldAtr[atrs[j]] + 1; i <= numAtr[atrs[j]]; i++) {
//                if (i > 0) {
//                    $("#var" + j + " td:eq(" + i + ") div").css("background-color", "rgba(" + (i * 15) + "," + (100 + (i * 15)) + ",0)");
//                } else {
//                    var num = -numAtr[atrs[j]] + 1;
//                    $("#var" + j + " td:eq(" + num + ") div").css("background-color", "inherit");
//                }
//            }
//        } else if (numAtr[atrs[j]] < oldAtr[atrs[j]]) {
//            for (var i = oldAtr[atrs[j]]; i > numAtr[atrs[j]]; i--) {
//                if (i > 0) {
//                    $("#var" + j + " td:eq(" + i + ") div").css("background-color", "inherit");
//                } else {
//                    var num = -numAtr[atrs[j]];
//                    $("#var" + j + " td:eq(" + num + ") div").css("background-color", "rgba(" + (150 + (i * 15)) + "," + -(i * 15) + ",0)");
//                }
//            }
//        }
//        oldAtr[atrs[j]] = numAtr[atrs[j]];
//
//        $("#var" + j + " td:last").text(oldAtr[atrs[j]]);
//    }
//});
//
////CARGAR ENTRENO
//if (global.perfil.entreno !== '') {
//    var entreno = global.entreno;
//    $("#manana").parent().find("a[value='" + entreno.manana + "']").trigger('tap');
//    $("#tarde").parent().find("a[value='" + entreno.tarde + "']").trigger('tap');
//    $("#noche").parent().find("a[value='" + entreno.noche + "']").trigger('tap');
//    $("#botonEntreno").attr("disabled", "disabled");
//
//} else {
//    visualize();
//    sinDatos();
//}
//
//function cap(string) {
//    return string.charAt(0).toUpperCase() + string.slice(1);
//}
//
//reloadTablas();
//
//$("#datosEntreno").css("right", -$("#datosEntreno").width());
