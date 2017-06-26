
var paginaObjetivo = "";
var mensajes = {};
var estadist = "";

var batalla = {
    stage: "",
    ids: [],
    criaturas: {}
};

function numero(x) {
    x = x + "";
    var inputValue = x.split("").reverse().join(""); // reverse
    var newValue = '';
    for (var i = 0; i < inputValue.length; i++) {
        if (i % 3 === 0 && i > 0) {
            newValue += '.';
        }
        newValue += inputValue[i];
    }
    return newValue.split("").reverse().join("");
}

function cargarPerfil() {
    var perfil = global.perfil;
    if (typeof perfil !== 'undefined') {

        if (typeof perfil.graficos !== 'undefined') {
            global.graficos = JSON.parse(perfil.graficos);
        }

        $("#nombreId").text(perfil.nombreId);
        $("#posicion").text(numero(perfil.posicion + ""));
        var oro = perfil.oro;
        $("#oro > span").text(numero(oro + ""));
        cargarMensajesPerfil();
    }
}

function getBatallasCalculo(callback) {
    ajax.call("getBatallasCalculo", null, function (batallas) {
        if (batallas.length != 0) {
            calcularBatallas(batallas);
        } else {
            window.willContinueLoading = false;
        }
        if (callback) {
            callback();
        }
    });
}

function cargarMensajesPerfil() {
    var perfil = global.perfil;
    if (perfil.mensajes > 0) {
        $("#numeroMensajes").text(perfil.mensajes);
    } else {
        $("#numeroMensajes").text("");
    }
}

var timers;
function getTimerEntreno(timers) {
    for (var i = 0; i < timers.length; i++) {
        if (timers[i].nombreId === "entreno") {
            return timers[i];
        }
    }
}

//....................................................................................

function reloadTablas() {
    $('.tabla').each(function () {
        var tabla = $(this);
        var width;
        var i = 0;
        $(this).find('.thead th').each(function () {
            width = $(this).outerWidth();
//            $(this).width(width);
            tabla.find(".tbody tbody tr").each(function () {
                $(this).find("td:eq(" + i + ") > div").width(width - 5);
            });
            i++;
        });
    });
}

function Select(obj) {
    var tbl = obj.parentNode.parentNode;
    var firstRow = $(tbl).find("tr").get(0);
    var oldRow = tbl.rows[firstRow.getElementsByTagName("input")[0]];
    if (oldRow && oldRow.value !== null) {
        $(oldRow).removeClass("selected");
        $(oldRow).addClass("UnHighLight");

        $(obj).removeClass("UnHighLight");
        $(obj).addClass("selected");
        firstRow.getElementsByTagName("input")[0].value = obj.rowIndex;
    }
}

function parseDate(input) {
    var n = input.split("/");
    return n[2] * 370 + n[1] * 35 + n[0];
}

function ordenarTablas() {
    var inverse = true;

    $('.arrowDown, .arrowUp').each(function () {
        sortElements($(this));
    });

    $('.arrowDown, .arrowUp, .arrows').each(function () {
        inverse = ordenClicable($(this), inverse);
        inverse = true;
    });
}

function ordenClicable(th, inverse) {

    th.click(function () {

        sortElements(th, inverse);

        inverse = !inverse;

        th.parent().find("th").each(function () {
            $(this).removeClass('arrowDown');
            $(this).removeClass('arrowUp');
        });
        if (inverse) {
            $(this).addClass('arrowDown');
        } else {
            $(this).addClass('arrowUp');
        }
    });
    return inverse;

}

function sortElements($th, inverse) {

    var thIndex = $th.index();
    if ($th.hasClass("fecha")) {
        $th.closest(".contenedor").find("td").filter(function () {
            return $(this).index() === thIndex;
        }).sortElements(function (a, b) {
            return parseDate($.text([a])) > parseDate($.text([b])) ? inverse ? -1 : 1 : inverse ? 1 : -1;
        }, function () {
            // parentNode is the element we want to move
            return this.parentNode;
        });

    } else if ($th.hasClass("dias")) {
        $th.closest(".contenedor").find("td").filter(function () {
            return $(this).index() === thIndex;
        }).sortElements(function (a, b) {
            return $(a).find("input").val() > $(b).find("input").val() ? inverse ? -1 : 1 : inverse ? 1 : -1;

            //                return $(a).find('img')[0].src

        }, function () {
            return this.parentNode;
        });

    } else if ($th.hasClass("numero")) {
        $th.closest(".contenedor").find("td").filter(function () {
            return $(this).index() === thIndex;
        }).sortElements(function (a, b) {
            return parseInt($(a).text().replace(/\./g, '')) > parseInt($(b).text().replace(/\./g, '')) ? inverse ? -1 : 1 : inverse ? 1 : -1;
        }, function () {
            return this.parentNode;
        });

    } else if ($th.hasClass("decimal")) {
        $th.closest(".contenedor").find("td").filter(function () {
            return $(this).index() === thIndex;
        }).sortElements(function (a, b) {
            return parseFloat($(a).text()) > parseFloat($(b).text()) ? inverse ? -1 : 1 : inverse ? 1 : -1;
        }, function () {
            return this.parentNode;
        });

    } else if ($th.hasClass("innerHTML")) {
        $th.closest(".contenedor").find("td").filter(function () {
            return $(this).index() === thIndex;
        }).sortElements(function (a, b) {
            return $(a).find('img')[0].src > $(b).find('img')[0].src ? inverse ? -1 : 1 : inverse ? 1 : -1;
        }, function () {
            return this.parentNode;
        });

        //liga position
    } else if ($th.hasClass("pos")) {
        $th.closest(".contenedor").find("td").filter(function () {
            return $(this).index() === thIndex;
        }).sortElements(function (a, b) {
            return parseInt($(a).attr('pos')) > parseInt($(b).attr('pos')) ? inverse ? -1 : 1 : inverse ? 1 : -1;
        }, function () {
            return this.parentNode;
        });

    } else {
        $th.closest(".contenedor").find("td").filter(function () {
            return $(this).index() === thIndex;
        }).sortElements(function (a, b) {
            return $(a).text() > $(b).text() ? inverse ? -1 : 1 : inverse ? 1 : -1;
        }, function () {
            return this.parentNode;
        });
    }
}

//..........................................................................................

//DIALOGS

function botonDetalles() {
    $(".selected").dblclick();
}

function atributo(num) {
    if (num === 0) {
        return "-";
    } else {
        return num;
    }
}


function loadCanvasAspecto(criatura, stage) {
    if (criatura.raza === "duende")
        criatura.raza = "goblin";

    var raza = new Image();
    if (criatura.raza === 'humano') {
        raza.src = org + 'img/aspectos/humano.png';
    } else if (criatura.raza === 'goblin') {
        raza.src = org + 'img/aspectos/goblin.png';
    } else if (criatura.raza === 'muerto') {
        raza.src = org + 'img/aspectos/muerto.png';
    }
    loadImagenes([raza.src], function () {
        var aspecto = criatura.aspecto;
        montarAspecto(aspecto, raza, stage);
    });
}

function loadCanvasAspectoAcademia(criatura, stage) {
    if (criatura.raza === "duende")
        criatura.raza = "goblin";

    var raza = new Image();
    if (criatura.raza === 'humano') {
        raza.src = org + 'img/aspectos/humanoGris.png';
    } else if (criatura.raza === 'goblin') {
        raza.src = org + 'img/aspectos/goblinGris.png';
    } else if (criatura.raza === 'muerto') {
        raza.src = org + 'img/aspectos/muertoGris.png';
    }
    loadImagenes([raza.src], function () {
        var aspecto = criatura.aspecto;
        montarAspecto(aspecto, raza, stage);
    });
}

function montarAspecto(aspecto, raza, stage) {
    //console.log(stage);

    stage.removeAllChildren();
    var grupo = new createjs.Container();
    raza.onload = updateOnLoad(stage);
    var asp = aspecto.split(";");

    var orejas = new createjs.Bitmap(raza);
    orejas.sourceRect = {
        x: asp[0] * 200,
        y: 0,
        width: 200,
        height: 300
    };

    var rostro = new createjs.Bitmap(raza);
    rostro.sourceRect = {
        x: asp[1] * 200,
        y: 300,
        width: 200,
        height: 300
    };

    var menton = new createjs.Bitmap(raza);
    menton.sourceRect = {
        x: asp[2] * 200,
        y: 600,
        width: 200,
        height: 300
    };

    var iris = new createjs.Bitmap(raza);
    iris.sourceRect = {
        x: asp[3] * 200,
        y: 900,
        width: 200,
        height: 300
    };

    var ojos = new createjs.Bitmap(raza);
    ojos.sourceRect = {
        x: asp[4] * 200,
        y: 1200,
        width: 200,
        height: 300
    };

    var boca = new createjs.Bitmap(raza);
    boca.sourceRect = {
        x: asp[5] * 200,
        y: 1500,
        width: 200,
        height: 300
    };

    var nariz = new createjs.Bitmap(raza);
    nariz.sourceRect = {
        x: asp[6] * 200,
        y: 1800,
        width: 200,
        height: 300
    };

    grupo.addChild(orejas);
    grupo.addChild(rostro);
    grupo.addChild(menton);
    grupo.addChild(iris);
    grupo.addChild(ojos);
    grupo.addChild(boca);
    grupo.addChild(nariz);

    stage.addChild(grupo);

    var escala = $(stage.canvas).parent().height() / 300;
    grupo.scaleY = escala;
    grupo.scaleX = escala;

    stage.update();
}

function updateOnLoad(stage) {
    stage.update();
}

var dialog_count = 0;

function error(error) {
    console.log("ERROR!");
    if (error.indexOf("Struts Problem Report") != -1) {
        console.log("STRUTS ERROR!");
        var myWindow = window.open('', '', 'width=200,height=100');
        if (myWindow) {
            myWindow.document.write(error);
            myWindow.focus();
        }
        return;
    }

    $("#mensajeError").html(error);

    $('#error').dialog({
        resizable: false,
        closeOnEscape: false,
        height: 150,
        width: 300,
        title: 'Error',
        modal: true,
        draggable: true
    });
}
function aviso(aviso) {
    $("#mensajeAviso").html(aviso);

    $('#aviso').dialog({
        resizable: false,
        closeOnEscape: true,
        height: 150,
        width: 300,
        title: 'Aviso',
        modal: true,
        draggable: true
    });
}

function confirmacion(mensaje) {
    $("#mensajeConfirmacion").html(mensaje);

    $('#confirmacion').css("transition-duration", 0);
    $('#confirmacion').css("opacity", "100");
    $('#confirmacion').css("display", "block");

    setTimeout(function () {
        $('#confirmacion').css("transition-duration", "500ms");
        $('#confirmacion').css("opacity", "0");
        setTimeout(function () {
            $('#confirmacion').css("display", "none");
        }, 300);
    }, 800);
}

function getPrecio(pujas) {
    if (typeof pujas !== 'undefined') {
        var arrayPujas = pujas.split(";");
        if (arrayPujas.length > 0) {
            var puja = arrayPujas[(arrayPujas.length) - 2];
            if (typeof puja !== 'undefined') {
                var arrayPuja = puja.split(",");
                return arrayPuja[1];
            }
        }
    }
    return "";
}

var apodo = {
    pagina: "",
    id: 0
};
function botonApodo(obj, pagina) {
    var numero = obj.numero;

    $("#apodoAnterior").text(numero);
    popApodo(obj.nombre);

    apodo.pagina = pagina;
    apodo.id = obj.id;
}
$("#botonApodo").click(function () {
    asignarApodo(apodo.id, $("#nuevoApodo").val(), apodo.pagina);
});

function popApodo(nombre) {

    $('#divApodo').dialog({
        resizable: false,
        closeOnEscape: false,
        height: 150,
        width: 300,
        title: nombre,
        modal: true,
        draggable: true
    });
}

$('body').bind('click', function (e) {
    if (
            jQuery('#dialog').dialog('isOpen')
            && !jQuery(e.target).is('.ui-dialog, a')
            && !jQuery(e.target).closest('.ui-dialog').length
            ) {
        jQuery('#dialog').dialog('close');
    }
});

function isCanvasSupported() {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}

function positivo(data) {
    if (data < 0) {
        data = data * (-1);
    }
    return data;
}

function getEdad(nacimiento) {
    var date = new Date(nacimiento);
    var months;
    months = (new Date().getFullYear() - date.getFullYear()) * 12;
    months -= date.getMonth() + 1;
    months += new Date().getMonth();
    return months <= 0 ? 0 : months;
}

function getClaseName(clases) {
    if (clases.split(";")) {
        return clases.split(";")[0].split(":")[0];
    } else {
        return clases;
    }
}

function setClaseImg(cell, clases) {
    var clase = getClaseName(clases);
    var img = "";
    if (clase === 'barbaro') {
        img = "img/iconos/criaturas/guerrero.png";
    } else if (clase === 'arquero') {
        img = "img/iconos/criaturas/arquero.png";
    } else if (clase === 'mago') {
        img = "img/iconos/criaturas/mago.png";
    }
    setImg(cell, org + img);
}

function setRazaImg(cell, raza) {
    var img = "";
    if (raza === 'humano') {
        img = "img/iconos/criaturas/humano.png";
    } else if (raza === 'goblin') {
        img = "img/iconos/criaturas/goblin.png";
    } else if (raza === 'muerto') {
        img = "img/iconos/criaturas/muerto.png";
    }
    setImg(cell, org + img);
}
function setElemImg(cell, elemento) {
    var img = "";
    if (elemento === 'fuego') {
        img = "img/iconos/elementos/fuego.png";
    } else if (elemento === 'hielo') {
        img = "img/iconos/elementos/hielo.png";
    } else if (elemento === 'rayo') {
        img = "img/iconos/elementos/rayo.png";
    } else if (elemento === 'veneno') {
        img = "img/iconos/elementos/veneno.png";
    } else if (elemento === 'piedra') {
        img = "img/iconos/elementos/piedra.png";
    } else if (elemento === 'naturaleza') {
        img = "img/iconos/elementos/naturaleza.png";
    }
    setImg(cell, org + img);
}
function setMutaImg(cell, mutacion) {
    var img = "";
    if (mutacion === 'alas') {
        img = "img/iconos/mutaciones/alas.png";
    } else if (mutacion === 'puas') {
        img = "img/iconos/mutaciones/puas.png";
    } else if (mutacion === 'cuernos') {
        img = "img/iconos/mutaciones/cuernos.png";
    } else if (mutacion === 'ojos') {
        img = "img/iconos/mutaciones/ojos.png";
    } else if (mutacion === 'escamas') {
        img = "img/iconos/mutaciones/escamas.png";
    } else if (mutacion === 'marca') {
        img = "img/iconos/mutaciones/marca.png";
    }
    setImg(cell, org + img);
}

function setImg(cell, img) {
    var div = $("<div>");
    $(cell).append(div);
    $(div).addClass("AttrImg");
    $(div).css("background-image", "url(" + img + ")");
}

function getMedia(media) {
    if (media !== 0) {
        return parseInt(media / 7);
    } else {
        return "-";
    }
}

function setNivel(cell, xp, old) {
    if (cell !== null) {
        if (typeof xp !== 'undefined') {
            var nivel = parseInt(Math.sqrt(xp));
            var nivelOld = parseInt(Math.sqrt(old));
            $(cell).html("<norm>" + nivel + "</norm>");

            if (old > -1) {
                var dif = parseInt(nivel - nivelOld);
                if (dif > 0) {
                    $(cell).append("<dif> +" + dif + "</dif>");
                }
            }
        } else {
            $(cell).html("<norm>0</norm>");
        }
    }
}

function getRatio(bajas, muertes) {
    if (muertes > 0) {
        return ratio = (bajas / muertes).toFixed(2);
    } else {
        return "-";
    }
}

function getResutadoBatalla(res) {
    var result = JSON.parse(res);
    if (typeof result !== 'undefined') {
        return result.resultado;
    } else {
        return "";
    }
}

var nombres = ["Thonald", "Sunggorma", "Bribeo", "Caeli", "Nyaegel", "Thonychell", "Lynya", "Marmarisa", "Canvid", "Renea", "Cysa", "Soing", "Wen", "Thaegard", "Ruthja", "Stecia", "Thasthae", "Stechael", "Nyawilwaru", "Braswise"];
var apellidos = ["Glazewater", "Gold", "Summerred", "Oakfire", "Seaside", "Capeflare", "Tallmountain", "Shortbright", "Orefalconbear", "Birdblur", "Sandrunner", "Tallragemetal", "Long", "Forceborne", "Helmshort", "Spearmace", "Walkerfire", "Eyeheart", "Battlerroad", "Fallbreak"];

function getNombre(obj) {
    if (typeof obj.apodo === 'undefined') {
        var nombre = obj.nombre.split(" ");
        return '<nobr>' + nombre[0][0] + ". " + nombre[1] + '</nobr>';
    } else {
        return '<nobr>" ' + obj.apodo + ' "</nobr>';
    }
}

function getApodo(criat, withName) {
    var apodo = criat.apodo;
    if (typeof apodo !== 'undefined' && apodo !== '') {
        if (withName) {
            return "<b>" + apodo + '</b> - ' + criat.nombre;
        } else {
            return apodo;
        }
    }
    return criat.nombre;
}

function loadImagenes(imagenes, callback) {

    function loader(imagenes, thingToDo, allDone) {
        if (!imagenes) {
            return;
        }
        if ("undefined" === imagenes.length) {
            imagenes = [imagenes];
        }

        var count = imagenes.length;

        var thingToDoCompleted = function (imagenes, i) {
            count--;
            if (0 === count) {
                allDone(imagenes);
            }
        };

        for (var i = 0; i < imagenes.length; i++) {
            thingToDo(imagenes, i, thingToDoCompleted);
        }
    }

    function loadImage(imagenes, i, onComplete) {
        var onLoad = function (e) {
            e.target.removeEventListener("load", onLoad);

            onComplete(imagenes, i);
        };
        var img = new Image();
        img.addEventListener("load", onLoad, false);
        img.src = imagenes[i];
    }

    loader(imagenes, loadImage, function () {
        callback();
    });
}

function getFecha(fecha) {
    var date = new Date(fecha * 86400000);
    var ano = date.getYear() + 1900 + "";
    var anoFinal = ano.slice(parseInt(ano.length) - 2, parseInt(ano.length));
    var mes = date.getMonth() + 1;
    if (mes < 10)
        mes = "0" + mes;
    var dia = date.getDate();
    if (dia < 10)
        dia = "0" + dia;

    return dia + "/" + mes + "/" + anoFinal;
}
function getFechaBySeconds(fecha) {
    var date = new Date(fecha * 1000);
    var comparar = new Date(date.getTime());

    var dia;
    var mes;
    if (comparar.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
        var hora = date.getHours();
        var min = date.getMinutes();
        return hora + ":" + min;

    } else if (comparar.getYear() === new Date().getYear()) {
        mes = date.getMonth() + 1;
        if (mes < 10)
            mes = "0" + mes;
        dia = date.getDate();
        if (dia < 10)
            dia = "0" + dia;

        return dia + "/" + mes;
    } else {
        var ano = date.getYear() + 1900 + "";
        var anoFinal = ano.slice(parseInt(ano.length) - 2, parseInt(ano.length));

        return dia + "/" + mes + "/" + anoFinal;
    }
}
function getFechaCompletaBySeconds(seconds) {
    var date = new Date(seconds * 1000);
    var ano = date.getYear() + 1900 + "";
    var anoFinal = ano.slice(parseInt(ano.length) - 2, parseInt(ano.length));
    var mes = date.getMonth() + 1;
    if (mes < 10)
        mes = "0" + mes;
    var dia = date.getDate();
    if (dia < 10)
        dia = "0" + dia;
    var hora = date.getHours();

    return dia + "." + mes + "." + anoFinal + " - " + hora + ":00";
}

function getCountdown(mils) {
    var date = new Date(mils);
    var horas = Math.floor(mils / 3600000);
    if (horas < 10)
        horas = "0" + horas;
    var minutos = date.getMinutes();
    if (minutos < 10)
        minutos = "0" + minutos;
    var segundos = date.getSeconds();
    if (segundos < 10)
        segundos = "0" + segundos;
    return horas + ":" + minutos + ":" + segundos;
}

function getObjById(obj, id) {
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].id === id) {
            return obj[i];
        }
    }
}

function atr(atr) {
    if (typeof atr === 'undefined' || atr === null || atr == -1) {
        atr = "-";
    }
    return atr;
}

$(".icono").click(function () {
    $(".icono").css("color", "inherit");
    $(this).css("color", "gold");
});

function getIndexById(id, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].id == id) { //==
            return i;
        }
    }
}
function capitalise(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function timePropagation() {
    stopPropagation = true;
    setTimeout(function () {
        stopPropagation = false;
    }, 500);
}
function isInteger(s) {
    var i;
    s = s.toString();
    for (i = 0; i < s.length; i++) {
        var c = s.charAt(i);
        if (isNaN(c)) {
            return false;
        }
    }
    return true;
}
