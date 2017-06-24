
var campoBatallaX = 1400;
var campoBatallaY = 500;

var calculoBatalla = {
    asesinos1: "",
    asesinos2: ""
};
var equiposDivision = "";

//only for sending
function calcularBatallas(batallas) {

    for (var j = 0; j < batallas.length; j++) {

        calculoBatalla.muertes = "";

        var resultado = "";
        var anterior;

        var batalla = batallas[j];

        var equipo1 = JSON.parse(batalla.alinLoc);
        var equipo2 = JSON.parse(batalla.alinVis);

        setCriaturasBatalla(equipo1);
        setCriaturasBatalla(equipo2);
        batalla.random = equipo1[0].id / (equipo1[0].id + equipo2[0].id);

        equipo1 = equipar(equipo1, 1);
        equipo2 = equipar(equipo2, 2);

        var equiposCalculo = ordenarIniciativa(equipo1, equipo2);

        var cargarBatalla = [];
        var muertos1 = 0;
        var muertos2 = 0;

        var frame = 0;

        var startCalculation = (new Date()).getTime();
        while (muertos1 < 5 && muertos2 < 5) {

            muertos1 = 0;
            muertos2 = 0;

            for (var i = 0; i < equiposCalculo.length; i++) {

                if (equiposCalculo[i].equipo === 1) {
                    equiposCalculo = IA(equiposCalculo, 1, i);
                    if (equiposCalculo[i].vida <= 0) {
                        muertos1++;
                    }
                }
                if (equiposCalculo[i].equipo === 2) {
                    equiposCalculo = IA(equiposCalculo, 2, i);
                    if (equiposCalculo[i].vida <= 0) {
                        muertos2++;
                    }
                }
            }

            if (batallas[j].tipo == "academia") {
                cargarBatalla[frame] = copiarFrameAcademia(anterior, equiposCalculo);
                anterior = jQuery.extend(true, {}, equiposCalculo);
            }

            frame++;

            if (frame == 50 && (new Date()).getTime() - startCalculation > 500) { //half sec.            
                console.log("slow");
                if (window.willContinueLoading) {
                    break;
                    //TODO: continue loading
                    window.willContinueLoading = false;
                }
            }

            if (frame > 1000) {
                break;
            }
        }

        resultado = {
            id: batallas[j].id,
            resultado: muertos2 + "-" + muertos1,
            batalla: "",
            muertes: calculoBatalla.muertes
        };
        if (batallas[j].tipo == "academia") {
            resultado.batalla = JSON.stringify(LZW.compress(JSON.stringify(cargarBatalla)));
        }
//        $("html").html(JSON.stringify(cargarBatalla));

        setResultadosBatallas(JSON.stringify([resultado]));
    }
}

//only for visualization
function calcularBatalla(equipo1, equipo2) {

    batalla.criaturas = {};
    batalla.ids = [];
    var anterior;

    setCriaturasBatalla(equipo1);
    setCriaturasBatalla(equipo2);
    batalla.random = equipo1[0].id + equipo2[0].id;

    equipo1 = equipar(equipo1, 1);
    equipo2 = equipar(equipo2, 2);

    var equiposBatalla = ordenarIniciativa(equipo1, equipo2);

    var cargarBatalla = [];
    var muertos1 = 0;
    var muertos2 = 0;

    cargarBatalla[0] = jQuery.extend(true, {}, equiposBatalla);
    var frame = 1;

    //run calculation    
    while (muertos1 < 5 && muertos2 < 5) {

        muertos1 = 0;
        muertos2 = 0;

        for (var i = 0; i < equiposBatalla.length; i++) {

            if (equiposBatalla[i].equipo == 1) {
                equiposBatalla = IA(equiposBatalla, 1, i);
                if (equiposBatalla[i].vida <= 0) {
                    muertos1++;
                }
            }
            if (equiposBatalla[i].equipo == 2) {
                equiposBatalla = IA(equiposBatalla, 2, i);
                if (equiposBatalla[i].vida <= 0) {
                    muertos2++;
                }
            }
        }

        cargarBatalla[frame] = copiarFrame(anterior, equiposBatalla);
        anterior = jQuery.extend(true, {}, equiposBatalla);

        frame++;

        //maximum length battle
        if (frame > 1000) {
            break;
        }
    }
    console.log(frame)

    var res = batallaJSON.resultado.split("-");

    if (res[0] != muertos2 || res[1] != muertos1) {
        $.ajax({
            type: "GET",
            url: "setDenuncia",
            data: {
                id: batallaJSON.id
            },
            complete: function () {
                aviso("Se ha detectado una incoherencia en el resultado de la batalla, si este mensaje se repite pasadas unas horas, por favor contacta con un administrador.")
            }
        });
    }
    return cargarBatalla;
}

function copiarFrame(anterior, equipos) {

    var retorno = [];

    for (var i = 0; i < equipos.length; i++) {
        retorno[i] = $.extend(true, {}, equipos[i]);
        retorno[i] = eliminarStats(retorno[i], anterior, i);
        reiniciarStats(equipos[i]);
    }
    return retorno;
}

function copiarFrameAcademia(anterior, equipos) {

    var retorno = [];

    for (var i = 0; i < equipos.length; i++) {
        retorno[i] = $.extend(true, {}, equipos[i]);
        retorno[i].vida = Math.round(retorno[i].vida / batalla.criaturas[retorno[i].id].vida * 25);
        retorno[i] = eliminarStats(retorno[i], anterior, i);
        reiniciarStats(equipos[i]);
    }
    return retorno;
}

function reiniciarStats(criat) {
    delete criat.golpe;
    delete criat.magia;
    delete criat.cura;
    delete criat.alert;
    delete criat.alert2;
    delete criat.alert3;
}

function eliminarStats(criat, anterior, i) {
    criat.x = criat.x.toFixed(1);
    criat.y = criat.y.toFixed(1);
    delete criat.equipo;
    delete criat.arm;
    delete criat.def;
    delete criat.vel;

    if (typeof anterior !== 'undefined') {
        if (criat.vida === anterior[i].vida) {
            delete criat.vida;
        }
        if (criat.x === anterior[i].x) {
            delete criat.x;
        }
        if (criat.y === anterior[i].y) {
            delete criat.y;
        }
        if (criat.estado === anterior[i].estado) {
            delete criat.estado;
        }
        if (criat.sprite === anterior[i].sprite) {
            delete criat.sprite;
        }
        if (criat.z === anterior[i].z) {
            delete criat.z;
        }
    }
    return criat;
}

function equipar(criaturas, equipo) {

    var x, y;

    var criaturasRetorno = [];

    for (var i = 0; i < criaturas.length; i++) {
        var dist = campoBatallaY / 8;
        y = criaturas[i].y * dist + (campoBatallaY - dist * 4) / 2;
        if (equipo == 1) {
            x = criaturas[i].x * dist + 400;
        } else {
            x = campoBatallaX - (criaturas[i].x * 100 + 400);
        }

        criaturasRetorno[i] = {
            id: criaturas[i].id,
            equipo: equipo,
            vida: criaturas[i].vida,
            y: y,
            x: x,
            estado: 'parado',
            sprite: 'paraDer',
            z: 0
        }
    }
    return criaturasRetorno;
}

function getEquipoBatalla(id, equiposDivision) {
    for (var i = 0; i < equiposDivision.length; i++) {
        var equipoDiv = JSON.parse(equiposDivision[i]);
        if (equipoDiv[0].user == id) {
            return equipoDiv;
        }
    }
}

function ordenarIniciativa(equipo1, equipo2) {

    var equipos = equipo1.concat(equipo2);

    for (var i = 0; i < equipos.length; i++) {

        for (var j = 0; j < equipos.length; j++) {

            if (equipos[i].iniciativa < equipos[j].iniciativa) {
                var tempVal = equipos[j];
                equipos[j] = equipos[i];
                equipos[i] = tempVal;
            }
        }
    }
    for (var k = 0; k < equipos.length; k++) {
        batalla.criaturas[equipos[k].id].i = k;
        equipos[k].z = k;
    }

    return equipos;
}

function setResultadosBatallas(resultados) {

    $.ajax({
        type: "POST",
        url: "setResultadosBatallas",
        data: {
            resultados: resultados
        }
    });

    if (window.willContinueLoading) {
        //get more
        getBatallasCalculo();
    } else {
        //TODO: continue loading
    }
}

var VPArquero = 30;
var VPMAGO = 15;

function setCriaturasBatalla(equipo) {

    var criatura;

    for (var i = 0; i < equipo.length; i++) {

        criatura = equipo[i];

        criatura.rgAtaque = 999;
        criatura.rgParado = 0;
        criatura.rgEspecial = 999;
        criatura.especial = 999;
        criatura.rgMovimiento = 0;

        criatura.golpeMax = 0;
        criatura.curaMax = 0;
        criatura.dano = criatura.fuerza;
        criatura.ataq = 50 - criatura.agilidad / 4;
        criatura.vel = criatura.agilidad / 10 + 4;
        criatura.reac = 20 - criatura.reaccion / 8;
        criatura.alto = 30;
        criatura.ancho = 25;
        criatura.efecto = null;
        criatura.vida = criatura.constitucion * 10;
        criatura.arm = (100 - (criatura.reflejos / 2)) / 100;
        criatura.def = (100 - (criatura.defensa / 2)) / 100;
        criatura.alcance = 30;
        criatura.poder = criatura.magia;
        criatura.reacEspecial = 250;

        if (typeof criatura.clase == 'undefined' || criatura.clase == '') {
            criatura.clase = 'barbaro';
        }
        if (criatura.actitud != 'agresivo' && criatura.actitud != 'cauto') {
            criatura.actitud = 'moderado';
        }

        var clasePrincipal = criatura.clases.split(";")[0].split(":")[0];
        if (clasePrincipal != criatura.clase)
            criatura.reac = criatura.reac + 5;

        if (criatura.clase == 'barbaro') {
            criatura.vel = criatura.vel * 1.2;

        } else if (criatura.clase == 'arquero') {
            criatura.alcance = 300;
            criatura.arm = (150 - (criatura.reflejos / 2)) / 100;
            criatura.def = (150 - (criatura.defensa / 2)) / 100;
            criatura.velocidadProyectil = VPArquero;

        } else if (criatura.clase == 'mago') {
            criatura.vida = criatura.constitucion * 3;
            criatura.alcance = 200;
            criatura.arm = (150 - (criatura.reflejos / 2)) / 100;
            criatura.velocidadProyectil = VPMAGO;
            criatura.vel = criatura.agilidad / 20 + 3;

        } else if (criatura.clase == 'healer') {
            criatura.alcance = 200;
            criatura.velocidadProyectil = VPMAGO;
        }

        if (criatura.raza == 'duende') {
            criatura.poder = criatura.poder * 1.5;
            criatura.dano = criatura.dano * 0.7;
            criatura.vel = criatura.vel * 0.8;
        }

        if (criatura.mutacion == "ojos") {
            criatura.reacEspecial = Math.round(criatura.reacEspecial * 0.75);
        } else if (criatura.mutacion == "alas") {
            criatura.vel = Math.round(criatura.vel * 1.5);
        } else if (criatura.mutacion == "marca") {
            criatura.dano = Math.round(criatura.dano * 1.2);
            criatura.poder = Math.round(criatura.poder * 1.2);
        }

        batalla.ids.push(equipo[i].id);
        batalla.criaturas[equipo[i].id] = criatura;
    }
}

function setCriaturasBatallaJuv(equipo) {

    var criatura;

    for (var i = 0; i < equipo.length; i++) {
        criatura = equipo[i];

        criatura.fuerza = "-";
        criatura.magia = "-";
        criatura.agilidad = "-";
        criatura.reflejos = "-";
        criatura.constitucion = "-";
        criatura.defensa = "-";
        criatura.reaccion = "-";
        criatura.vida = 25;

        if (criatura.clase == 'arquero') {
            criatura.velocidadProyectil = VPArquero;

        } else if (criatura.clase == 'mago') {
            criatura.velocidadProyectil = VPMAGO;

        } else if (criatura.clase == 'healer') {
            criatura.velocidadProyectil = VPMAGO;
        }

        batalla.ids.push(equipo[i].id);
        batalla.criaturas[equipo[i].id] = criatura;
    }
}

function setCriaturasBatallaJuvPropio(equipo) {
    //getAcademia(function() {

    var promesas = jsonPaginas["academia"];
    var criatura;

    for (var i = 0; i < equipo.length; i++) {
        criatura = equipo[i];

        var promesa = getObjById(promesas, criatura.id);
        if (promesa.fuerza != 0) {
            criatura.fuerza = promesa.fuerza
        } else {
            criatura.fuerza = "-";
        }
        if (promesa.magia != 0) {
            criatura.magia = promesa.magia
        } else {
            criatura.magia = "-";
        }
        if (promesa.agilidad != 0) {
            criatura.agilidad = promesa.agilidad
        } else {
            criatura.agilidad = "-";
        }
        if (promesa.reflejos != 0) {
            criatura.reflejos = promesa.reflejos
        } else {
            criatura.reflejos = "-";
        }
        if (promesa.constitucion != 0) {
            criatura.constitucion = promesa.constitucion
        } else {
            criatura.constitucion = "-";
        }
        if (promesa.defensa != 0) {
            criatura.defensa = promesa.defensa
        } else {
            criatura.defensa = "-";
        }
        if (promesa.reaccion != 0) {
            criatura.reaccion = promesa.reaccion
        } else {
            criatura.reaccion = "-";
        }

        criatura.vida = 25;
        if (criatura.clase == 'arquero') {
            criatura.velocidadProyectil = VPArquero;
        } else if (criatura.clase == 'mago') {
            criatura.velocidadProyectil = VPMAGO;
        } else if (criatura.clase == 'healer') {
            criatura.velocidadProyectil = VPMAGO;
        }

        batalla.ids.push(equipo[i].id);
        batalla.criaturas[equipo[i].id] = criatura;
    }
    //});
}

//LZW Compression/Decompression for Strings
var LZW = {
    compress: function (uncompressed) {
        //"use strict";
        // Build the dictionary.
        var i,
                dictionary = {},
                c,
                wc,
                w = "",
                result = [],
                dictSize = 256;
        for (i = 0; i < 256; i += 1) {
            dictionary[String.fromCharCode(i)] = i;
        }

        for (i = 0; i < uncompressed.length; i += 1) {
            c = uncompressed.charAt(i);
            wc = w + c;
            //Do not use dictionary[wc] because javascript arrays 
            //will return values for array['pop'], array['push'] etc
            // if (dictionary[wc]) {
            if (dictionary.hasOwnProperty(wc)) {
                w = wc;
            } else {
                result.push(dictionary[w]);
                // Add wc to the dictionary.
                dictionary[wc] = dictSize++;
                w = String(c);
            }
        }

        // Output the code for w.
        if (w !== "") {
            result.push(dictionary[w]);
        }
        return result;
    },
    decompress: function (compressed) {
        "use strict";
        // Build the dictionary.
        var i,
                dictionary = [],
                w,
                result,
                k,
                entry = "",
                dictSize = 256;
        for (i = 0; i < 256; i += 1) {
            dictionary[i] = String.fromCharCode(i);
        }

        w = String.fromCharCode(compressed[0]);
        result = w;
        for (i = 1; i < compressed.length; i += 1) {
            k = compressed[i];
            if (dictionary[k]) {
                entry = dictionary[k];
            } else {
                if (k === dictSize) {
                    entry = w + w.charAt(0);
                } else {
                    return null;
                }
            }

            result += entry;

            // Add w+entry[0] to the dictionary.
            dictionary[dictSize++] = w + entry.charAt(0);

            w = entry;
        }
        return result;
    }
}