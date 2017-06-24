

var mensajeSeleccionado;
var arr_mensajes = "";

$.ajax({
    type: "GET",
    url: url + "getMensajesPrivados",
    success: function(response) {

        document.getElementById("bandejaEntrada").getElementsByTagName("tbody")[0].textContent = "No hay mensajes";
        document.getElementById("bandejaSalida").getElementsByTagName("tbody")[0].textContent = "No hay mensajes";

        if (response !== "") {
            arr_mensajes = JSON.parse(response);
            listarMensajes();
        }
    }
});

function listarMensajes() {

    var table;

    document.getElementById("bandejaEntrada").getElementsByTagName("tbody")[0].textContent = "";
    document.getElementById("bandejaSalida").getElementsByTagName("tbody")[0].textContent = "";

    for (var i = 0; i < arr_mensajes.length; i++) {

        if (arr_mensajes[i].receptorId === global.perfil.id) {
            table = document.getElementById("bandejaEntrada").getElementsByTagName("tbody")[0];
        } else {
            table = document.getElementById("bandejaSalida").getElementsByTagName("tbody")[0];
        }

        var rowCount = table.rows.length;
        if (rowCount === 0)
            table.textContent = "";

        var row = table.insertRow(rowCount);

        row.setAttribute("class", "UnHighLight");
        row.setAttribute("onMouseOver", "HighLight(this)");
        row.setAttribute("onMouseOut", "UnHighLight(this)");
        row.setAttribute("onclick", 'Select(this), mostrarMensaje(' + i + ')');

        if (arr_mensajes[i].receptorId === global.perfil.id) {
            row.setAttribute("onclick", 'Select(this), mostrarMensaje(' + i + '), marcarLeido(this,' + i + ')');

            if (arr_mensajes[i].leido === false) {
                row.setAttribute("class", "UnHighLight mensajeNuevo");
            }
        }

        var cell1 = row.insertCell(0);
        cell1.innerHTML = arr_mensajes[i].fecha;

        var cell2 = row.insertCell(1);
        if (arr_mensajes[i].receptorId === global.perfil.id) {
            row.setAttribute("ondblclick", 'contacto(' + arr_mensajes[i].emisorId + ')');
            cell2.innerHTML = arr_mensajes[i].emisor;

        } else {
            row.setAttribute("ondblclick", 'contacto(' + arr_mensajes[i].receptorId + ')');
            cell2.innerHTML = arr_mensajes[i].receptor;
        }

        var cell3 = row.insertCell(2);
        cell3.innerHTML = arr_mensajes[i].asunto;

    }
    ;

    reloadTablas();
    ordenarTablas();
}

function mostrarMensaje(i) {
    if (arr_mensajes[i].receptorId === global.perfil.id) {
        $("#responderMensaje").css("display", "inherit");
    } else {
        $("#responderMensaje").css("display", "none");
    }
    $("#mensajeDiv").css("display", "inherit");
    $("#fecha").text(arr_mensajes[i].fecha);
    $("#usuario").text(arr_mensajes[i].emisor);
    $("#asunto").text(arr_mensajes[i].asunto);
    $("#mensaje").text(arr_mensajes[i].mensaje);
    mensajeSeleccionado = i;
}

function marcarLeido(elem, i) {

    if (arr_mensajes[i].leido === true)
        return;

    $(elem).removeClass("mensajeNuevo");
    $("#fecha").text(arr_mensajes[i].fecha);

    $.ajax({
        type: "GET",
        url: url + "marcarMensajeLeido",
        data: {
            id: arr_mensajes[i].id
        },
        complete: function() {
            arr_mensajes[i].leido = true;
            global.perfil.mensajes -= 1;
            cargarMensajesPerfil();
        }
    });

}
