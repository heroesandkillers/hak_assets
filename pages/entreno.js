
var atrs = ["fuerza", "magia", "agilidad", "reflejos", "constitucion", "defensa", "reaccion"];

//GUARDAR ENTRENO
function asignarEntreno() {
    $("#botonEntreno").attr("disabled", "disabled");

    var entrenamiento = {};
    for (var i = 0; i < atrs.length; i++) {
        var tr = $("#var_" + atrs[i]);
        var count = tr.find(".sel").length;
        entrenamiento[atrs[i]] = "" + count;
    }
    console.log("sending: " + JSON.stringify(entrenamiento));

    $.ajax({
        type: "GET",
        url: url + "asignarEntreno",
        data: entrenamiento,
        success: function (response) {
            if (response === "") {
                confirmacion("guardado correctamente");
            } else {
                error(response);
            }
            global.perfil.entreno = JSON.stringify(entrenamiento);
        }
    });
}

// TABLA ENTRENAMIENTO
var table = document.getElementById("entrenamiento");
table.innerHTML = "";
var rowCount = 0;

var oldAtr = {};
var numAtr = {};
for (var i = 0; i < atrs.length; i++) {
    oldAtr[atrs[i]] = 0;
    numAtr[atrs[i]] = 0;
}
var numMax = 10;

for (var i = 0; i < atrs.length; i++) {
    var tr = $("<tr>");
    $(table).append(tr);
    var td = $("<td>");
    tr.append(td);
    td.html(cap(atrs[i] + ":"));
    td.attr("colspan", 10);

    var row = $("<tr>")[0];
    $(table).append(row);
    row.setAttribute("id", "var_" + atrs[i]);

    //trainment points table
    for (var j = 0; j < numMax; j++) {
        var cell = row.insertCell(j);
        $(cell).addClass("punto");
        $(cell).attr("pos", j);
        var div = document.createElement("div");
        cell.appendChild(div);
    }

    var cell = row.insertCell(numMax);
    cell.setAttribute("class", "numeroAtributo");

    rowCount++;
}

var maxPoints = 25;
$("#entrenamiento .punto").click(function () {
    var position = $(this).attr("pos");
    var selected = $(this).hasClass("last");

    var row = $(this).parent();
    $(row).find("td.punto").html("<div>");
    $(row).find("td.punto").removeClass("last");

    var last = false;
    for (var i = 0; i < 10; i++) {
        var points = $("#entrenamiento .sel").length;
        if (points >= maxPoints) {
            break;
        }

        var td = $(row).find("td.punto:eq(" + i + ")");

        if (position == i) {
            console.log("position: " + position);
            if (selected) {
                break;
            }
            last = true;
            td.addClass("last");
        }

        selectTrainment(row, i);

        if (last) {
            break;
        }
    }

    $("#botonEntreno").removeAttr("disabled");
    countTrainment();
});

//add skill count
for (var j = 0; j < atrs.length; j++) {
    $("#var_" + atrs[j] + " td:last").text(numAtr[atrs[j]]);
}

//CARGAR ENTRENO
if (global.perfil.entreno) {
    var entreno = global.perfil.entreno;
    for (var tipo in entreno) {
        var valor = entreno[tipo];
        for (var i = 0; i < valor; i++) {
            selectTrainment($("#var_" + tipo), i);
        }
    }
    $("#botonEntreno").attr("disabled", "disabled");
    countTrainment();

} else {
    console.log("sinDatos");
    visualize();
    sinDatos();
}

function selectTrainment(tr, i) {
    var div = tr.find("td:eq(" + i + ") > div");
    div.css("background-color", "rgba(" + (150 + (i * 15)) + "," + (255 - i * 15) + ",0)");
    div.addClass("sel");
}

function countTrainment() {
    for (var i = 0; i < atrs.length; i++) {
        var row = $("#var_" + atrs[i]);
        var count = row.find(".sel").length;
        row.find(".numeroAtributo").text(count);
    }
}

function cap(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

reloadTablas();
