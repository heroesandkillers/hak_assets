var ajax = {
    call: function (request, data, callback) {
        console.log(request);
        console.log(data);

        $.ajax({
            type: "GET",
            url: url + request,
            data: data,
            success: function (response) {
                var res = "";

                if (response || 0 === response) {
                    try {
                        res = JSON.parse(response);
                    } catch (e) {
                        error("error on parse: " + response);
                        return;
                    }
                }

                if (callback) {
                    callback(res);
                }
            },
            error: function () {
                console.log("ajax error");
            }
        });
    }
    ,
    getAll: function (callback) {
        this.call("getAll", null, function (res) {
            console.log(res);
            callback(res);
        });
    }
    ,
    getLiga: function (division, callback) {
        console.log("division: " + division)
        if (window.global && global.perfil.division.division != division) {
            this.call("getLiga", {'division': division}, function (res) {
                if (res.length) {
                    callback(res);
                } else {
                    console.log("division not exists");
                    callback(false);
                }
            });
        } else {
            //load own liga
            callback(global.liga);
        }
    }
    ,
    getMensajesPrensa: function (ths, callback) {
        this.call("getMensajesPrensa", {'division': ths.division}, function (res) {
            callback(res);
        });
    },
    getCalendarioDivision: function (ths, callback) {
        this.call("getCalendarioDivision", {'division': ths.division}, function (res) {
            ths.calendarioDivision = res;
            callback();
        });
    },
    enviarMensajePrensa: function (ths) {
        this.call("enviarMensajePrensa", {'mensaje': ths.mensaje}, function (res) {
            ths.mostrarPrensa(ths.division);
        });
    },
    setMapa: function (mapa, back) {
        this.call("setMapa", {
            division: global.division,
            mapa: JSON.stringify(mapa),
            back: JSON.stringify(back)
        });
    }
}

function getPerfil() {
    ajax.call("getPerfil", null, function (res) {
        global.perfil = res;
    });
}

var gameURL = "/game/";
function load(hash, callback) {
    console.log("load");
    if (!hash) {
        hash = location.hash.split("#")[1];
    }

    if (!hash) {
        console.log("!location.hash");
        //location.href = gameURL;

    } else {
        if (!window.routes[hash]) {
            console.log("error route = " + hash);
            return;
        }
        console.log("routes[parts[1] = " + routes[hash])
//        var url = "http://" + document.domain + "/hak_static/" + routes[hash];
        var url = org + routes[hash];
        $("#contenidos").load(url, function () {
            if (callback) {
                callback();
            }
        });
    }
}
window.onload = load;
window.onhashchange = load;

function cargar(pagina, id) {
    console.log("pagina = " + pagina);
    if (!id) {
//        location.href = gameURL + "#" + pagina;
        location.hash = pagina;

    } else {
        console.log(pagina)
        $(id).load(org + routes[pagina]);
        ordenarCarga();
    }
}

function getJson(json) {
    $.ajax({
        type: "GET",
        url: "get" + json.charAt(0).toUpperCase() + json.slice(1),
        success: function (response) {
            if (response !== "") {
                global[json] = JSON.parse(response);
            }
        }
    });
}

function asignarApodo(id, apodo, pagina) {
    ajax.call("asignarApodo", {id: id, apodo: apodo}, function (res) {
        getJson(pagina);
        $('#divApodo').dialog('close');
    });
}

function getBatalla(batalla) {
    if (batalla.tipo != "juvenil") {
        ajax.call("getBatalla", {id: batalla.id}, function (res) {
            batalla = res;
        });

    } else {
        if (typeof batalla.resultados == 'undefined') {
            ajax.call("getBatalla", {id: batalla.id}, function (res) {
                batalla = res;
            });
        }
    }

    getBatallaVisible(batalla, function (batalla) {
//        console.log(batalla)
        if (!batalla) {
            console.log("!batalla");
            aviso("error al mostrar batalla");
            return;
        }
        if (!batalla.alinLoc || !batalla.alinVis) {
            console.log("!batalla.alinLoc || !batalla.alinVis");
            aviso("error al mostrar batalla");
            return;
        }

        console.log("batalla cargada: " + batalla);
        batallaJSON = batalla;

        $("#contenidos").load(org + routes["batallas"], function () {
            mostrarDatos();
            centrarGameArea();
        });
    });
}

function getMiBatalla() {
    var calDiv = global.calendarioDivision;
    var batalla = "";
    for (var i = 0; i < calDiv.length; i++) {
        if (calDiv[i].calculos == 0) {
            break;
        }

        if (calDiv[i].calculos > 0) {
            if (calDiv[i].eqLocId == global.perfil.id) { //==
                batalla = calDiv[i];
            } else if (calDiv[i].eqVisId == global.perfil.id) { //==
                batalla = calDiv[i];
            }
        }
    }

    if (batalla == "") {
        aviso("no hay batallas por mostrar");
        return;
    }

    getBatalla(batalla);
}

function getBatallaVisible(batalla, callback) {
    if (batalla.tipo != "juvenil") {
        ajax.call("getBatalla", {id: batalla.id}, function (visible) {
//            if (!visible.alinLoc || !visible.alinVis) {
//                console.log(visible)
//                callback(false);
//            }
            callback(visible);
        });
    } else {
        ajax.call("getBatalla", {id: batalla.id}, function (visible) {
            if (!visible.alinLoc || !visible.alinVis) {
                console.log(visible)
                callback(false);
            }
            callback(visible);
        });
    }
}

function getProximaBatalla() {
    var calDiv = global.calendarioDivision;
    var batalla = null;
    for (var i = 0; i < calDiv.length; i++) {
        if (typeof calDiv[i].resultado === 'undefined') {
            if (calDiv[i].eqLocId == global.perfil.id) { //==
                batalla = calDiv[i];
                break;
            } else if (calDiv[i].eqVisId == global.perfil.id) { //==
                batalla = calDiv[i];
                break;
            }
        }
    }
    return batalla;
}

function getEquipoAcademia(callback) {
    if (global.equipoAcademia === "") {
        ajax.call("getEquipoAcademia", null, function (res) {
            global.equipoAcademia = res;
            callback();
        });
    } else {
        callback();
    }
}

function ordenarCarga() {
    reloadTablas();
    ordenarTablas();
}
