var alineacionObj = {
    pagina: "",
    contenedor: "",
    canvas: "",
    botonAsignar: "",
    claseSelect: "",
    actitudSelect: "",
    atributos: "",
    nombre: "",
    obj: {},
    criaturas: [],
    stage: {},
    seleccion: 0,
    drag: false,
    dragId: "",
    posX: 3,
    posY: 5,
    scale: 1,
    canvasAncho: "",
    canvasAlto: "",
    alineacion: "",
    js: {}, //no detalle
    click: false
    ,
    startCanvas: function() {
        console.log("startCanvas")
        var ths = this;
        ths.externalEvents();
        ths.criaturas = [];

        if (!isCanvasSupported()) {
            this.contenedor.css("display", "none");
        }

//        ths.canvasAncho = ths.contenedor.width() * 0.65;
        ths.canvasAncho = ths.contenedor.width() - 20;
        ths.canvasAlto = ths.contenedor.height() - 35;
//        ths.canvas.height = ths.canvasAlto;
//        ths.canvas.width = ths.canvasAncho;

        ths.stage = new createjs.Stage(ths.canvas);
        ths.stage.enableMouseOver();

        $(ths.canvas).mousedown(function() {
            if (ths.click === false) {
                ths.oval.visible = false;
                ths.stage.update();
                $("#atributos").css("display", "none");

//                var alto = 200 / $("#bloque").parent().height() * 100;
//                var alto2 = 200 / ($("#bloque").parent().height() - 60) * 100;
//                $("#bloque").height(100 - alto2 + "%");
//                $("#detalleCriatura").height(alto + "%");
            }
            ths.click = false;
        });

        var color = createjs.Graphics.getRGB(0, 0, 0, 0.2);

        var h = [];
        var i;
        for (i = 0; i < ths.posY - 1; i++) {
            var alto = ths.canvasAlto / (ths.posY) * (i + 1);

            h[i] = new createjs.Shape();
            h[i].graphics.beginStroke(color).moveTo(0, alto).lineTo(ths.canvasAncho, alto);

            ths.stage.addChild(h[i]);
        }

        var v = [];
        for (i = 0; i < ths.posX - 1; i++) {
            var ancho = ths.canvasAncho / (this.posX) * (i + 1);

            v[i] = new createjs.Shape();
            v[i].graphics.beginStroke(color).moveTo(ancho, 0).lineTo(ancho, ths.canvasAlto);

            this.stage.addChild(v[i]);
        }

        $(ths.canvas).droppable({
            drop: function(e) {
                var criaturas = ths.criaturas;

                if (ths.drag === true) {
                    var id = ths.dragId;
                    for (var i = 0; i < criaturas.length; i++) {
                        if (id === criaturas[i].id) {
                            error("no puedes añadir dos veces a la misma criatura!");
                            return;
                        }
                    }
                    if (criaturas.length > 4) {
                        error("no puedes añadir más de 5 criaturas!");
                        return;
                    }

                    var offsetCanvas = $(ths.canvas).offset();
                    var x = e.pageX;
                    var y = e.pageY;

                    x = x - offsetCanvas.left;
                    y = y - offsetCanvas.top;

                    var actitud = 'moderado';

                    var criatura;
                    for (i = 0; i < ths.obj.length; i++) {
                        if (ths.obj[i].id === id) {
                            criatura = ths.obj[i];
                            break;
                        }
                    }

                    var clase = 'barbaro';
                    clase = criatura.clases.split(";")[0].split(":")[0];

                    var atributos = {
                        raza: criatura.raza,
                        clase: clase,
                        actitud: actitud
                    };
                    ths.crearGrupo(id, x, y, atributos);

                    ths.stage.update();
                    ths.drag = false;
                }
            }
        });

        var oval = this.oval;

        oval.graphics.beginStroke("black").beginFill("yellow").drawEllipse(-36, 30, 90, 40);
        oval.name = "oval";

        ths.colocarAlineaciones();

    },
    colocarAlineaciones: function() {
        var ths = this;
        var alineacionArray = global.perfil[ths.alineacion];
        console.log(alineacionArray)

        if (typeof alineacionArray != "object") {
            try {
                alineacionArray = JSON.parse(alineacionArray);
            } catch (e) {
                console.log("error parsing alineacion");
                return;
            }
        }

        if (typeof alineacionArray !== 'undefined' && alineacionArray !== '') {

            for (var i = 0; i < alineacionArray.length; i++) {

                var id = alineacionArray[i].id;
                var posicion = alineacionArray[i].posicion;

                var posicionX = parseInt(posicion / 5);
                var posicionY = posicion - posicionX * 5;

                var x = posicionX * ths.canvasAncho / 3 + ths.canvasAncho / 6;
                var y = posicionY * ths.canvasAlto / 5 + ths.canvasAlto / 10;

                ths.crearGrupo(id, x, y, {
                    clase: alineacionArray[i].clase,
                    actitud: alineacionArray[i].actitud
                });
            }
            //need preload images after update
            loadImagenes([org + 'img/alineacion/clase.png', org + 'img/alineacion/actitud.png'], function() {
                ths.stage.update();
            });
        }
        ths.botonAsignar.addClass("noClick");

    },
    crearGrupo: function(id, x, y, atributos) {

        var ths = this;
        var criatura = getObjById(ths.obj, id);

        if (typeof criatura !== 'undefined') {
            var raza = criatura.raza;
            atributos.raza = raza;
            var clase = atributos.clase;
            var actitud = atributos.actitud;

            var scale = ths.scale = $(ths.canvas).height() / 1200;

            var image1 = new Image();
            image1.src = org + 'img/alineacion/clase.png';

            var imgClase = new createjs.Bitmap(image1);
            imgClase = ths.claseImg(imgClase, atributos);
            imgClase.scaleX = scale;
            imgClase.scaleY = scale;
            imgClase.x = -150 * imgClase.scaleX;
            imgClase.y = -150 * imgClase.scaleY;
            imgClase.name = 'imgClase';

            var image2 = new Image();
            image2.src = org + 'img/alineacion/actitud.png';

            var imgActitud = new createjs.Bitmap(image2);
            imgActitud = ths.actitudImg(imgActitud, actitud);
            imgActitud.scaleX = scale;
            imgActitud.scaleY = scale;
            imgActitud.x = -50 * imgActitud.scaleX;
            imgActitud.y = -50 * imgActitud.scaleY;
            imgActitud.name = 'imgActitud';

            var text = new createjs.Text(ths.textoAlineacion(id), "16px Calibri", 'black');
            text.x = 0;
            text.y = 80 * scale;
            text.textBaseline = "alphabetic";
            text.name = "text";

            var grupo = new createjs.Container();
            grupo.x = x;
            grupo.y = y;
            grupo.cursor = "pointer";

            grupo.id = id;
            grupo.actitud = actitud;
            grupo.clase = clase;
            grupo.raza = raza;
            grupo.nombre = criatura.nombre;

            grupo.addChild(imgClase);
            grupo.addChild(imgActitud);
            grupo.addChild(text);
            ths.criaturas.push(grupo);

            ths.dragImg(grupo);
            ths.stage.addChild(grupo);

            ths.mouseup(grupo);
        }
    },
    claseImg: function(img, atributos) {
        console.log(atributos);
        var x = 0, y = 0;

        var raza = atributos.raza;
        var clase = atributos.clase;

        if (raza === "duende")
            raza = "goblin";

        if (raza === 'humano') {
            y = 0;
        } else if (raza === 'goblin') {
            y = 300;
        } else if (raza === 'muerto') {
            y = 600;
        }

        if (clase === 'barbaro') {
            x = 0;
        } else if (clase === 'arquero') {
            x = 300;
        } else if (clase === 'mago') {
            x = 600;
        } else {
            x = 900;
        }

        img.sourceRect = {
            x: x,
            y: y,
            width: 300,
            height: 300
        };
        return img;
    },
    actitudImg: function(img, actitud) {

        if (actitud === 'cauto') {
            img.sourceRect = {
                x: 0,
                y: 0,
                width: 30,
                height: 30
            };
        } else if (actitud === 'moderado') {
            img.sourceRect = {
                x: 30,
                y: 0,
                width: 30,
                height: 30
            };
        } else if (actitud === 'agresivo') {
            img.sourceRect = {
                x: 60,
                y: 0,
                width: 30,
                height: 30
            };
        }
        return img;
    },
    textoAlineacion: function(id) {
        for (var i = 0; i < this.obj.length; i++) {
            if (this.obj[i].id === id) {
                var nombre = getApodo(this.obj[i]);
                return nombre;
            }
        }
        return "";
    },
    oval: new createjs.Shape(),
    asignarAlineacion: function() {
        var ths = this;
        var alineacion = [];

        for (var i = 0; i < ths.criaturas.length; i++) {
            var x = ths.criaturas[i].x;
            var y = ths.criaturas[i].y;
            x = parseInt(x / (ths.canvasAncho) * 3);
            y = parseInt(y / (ths.canvasAlto) * 5);

            var id = ths.criaturas[i].id;
            var posicion = x * 5 + y;

            if (posicion >= 0 && posicion < 15) {

                var clase = ths.criaturas[i].clase;
                var actitud = ths.criaturas[i].actitud;
                alineacion.push({
                    id: id,
                    posicion: posicion,
                    clase: clase,
                    actitud: actitud
                });
            }
        }

        var alin = JSON.stringify(alineacion);
        ajax.call(ths.urlAsignar, {alineacion: alin}, function(res) {
            if (res != '') {
                error(res);
            }
            ths.guardar(alineacion);
        });
    },
    guardar: function(alineacion) {
        global[this.alineacion] = alineacion;
        confirmacion("guardado correctamente");
        this.botonAsignar.addClass("noClick");
    },
    dragImg: function(grupo) {
        var ths = this;

        var stage = this.stage;

        var dragX = 0;
        var dragY = 0;

        grupo.onPress = function(evt) {
            stage.addChild(grupo);
            var i = getIndexById(grupo.id, global[ths.equipo]);
            ths.js.detalle(i);
            var offset = {
                x: grupo.x - evt.stageX,
                y: grupo.y - evt.stageY
            };
            evt.onMouseMove = function(ev) {
                grupo.x = ev.stageX + offset.x;
                grupo.y = ev.stageY + offset.y;
                stage.update();
            };
        };

        grupo.addEventListener('mousedown', function() {
            ths.oval.visible = true;
            ths.click = true;

            ths.atributos.css("display", "inherit");
            ths.nombre.text(grupo.nombre);
            ths.actitudSelect.val(grupo.actitud);

            var option = ths.claseSelect.find(".opcionEspecial");
            //change especial class
            if (grupo.raza == "humano") {
                option.val("shinobi");
                option.text("shinobi");
            } else if (grupo.raza == "goblin") {
                option.val("healer");
                option.text("curandero");
            } else if (grupo.raza == "muerto") {
                option.val("paladin");
                option.text("caballero");
            }

            ths.claseSelect.val(grupo.clase);
            ths.seleccion = grupo;

            grupo.addChildAt(ths.oval, 0);
            ths.oval.scaleX = ths.scale;
            ths.oval.scaleY = ths.scale;
            stage.update();

            dragX = grupo.x;
            dragY = grupo.y;
        });

        grupo.onClick = function() {
            ths.mouseup(grupo, dragX, dragY);

            var imgX = grupo.x;
            var imgY = grupo.y;

            //Quitar criaturas del canvas
            if (imgX > ths.canvasAncho - 25 || imgX < 25 || imgY > ths.canvasAlto - 25 || imgY < 25) {
                if (dragX > 0 && dragY > 0) {
                    for (var j = 0; j < ths.criaturas.length; j++) {
                        if (ths.criaturas[j] === grupo) {
                            stage.removeChild(grupo);
                            ths.quitarCriaturaId(ths.criaturas[j].id);
                            break;
                        }
                    }
                }
            }
            dragX = 0;
            dragY = 0;
        };
    },
    mouseup: function(grupo, dragX, dragY) {
        var ths = this;
        ths.botonAsignar.removeClass('noClick');

        var imgX = grupo.x;
        var imgY = grupo.y;

        var x = parseInt(imgX / ths.canvasAncho * (ths.posX));
        x = x * (ths.canvasAncho / (ths.posX)) + (ths.canvasAncho / ((ths.posX) * 2));

        var y = parseInt(imgY / ths.canvasAlto * (ths.posY));
        y = y * (ths.canvasAlto / (ths.posY)) + (ths.canvasAlto / ((ths.posY) * 2));

        this.movimientoAnimation(grupo, ths.stage, grupo.x, grupo.y, x, y, 4);

        for (var i = 0; i < ths.criaturas.length; i++) {
            if (ths.criaturas[i].id !== grupo.id) {

                var coincideX = ths.criaturas[i].x;
                var coincideY = ths.criaturas[i].y;

                if (coincideX + 10 > x && coincideX - 10 < x && coincideY + 10 > y && coincideY - 10 < y) {

                    if (dragX > 0 && dragY > 0) {
                        ths.movimientoAnimation(ths.criaturas[i], ths.stage, coincideX, coincideY, dragX, dragY, 7);

                    } else {
                        ths.stage.removeChild(ths.criaturas[i]);
                        ths.quitarCriaturaPosicion(i);
                    }
                }
            }
        }
    },
    quitarCriaturaId: function(id) {
        for (var i = 0; i < this.criaturas.length; i++) {
            if (this.criaturas[i].id === id) {
                this.criaturas = this.criaturas.slice(0, i).concat(this.criaturas.slice(i + 1, this.criaturas.length));
                return;
            }
        }
    },
    quitarCriaturaPosicion: function(i) {
        this.criaturas = this.criaturas.slice(0, i).concat(this.criaturas.slice(i + 1, this.criaturas.length));
    },
    movimientoAnimation: function(elem, stage, inicialX, inicialY, terminoX, terminoY, tiempo) {
        var variacionX = (inicialX - terminoX) / tiempo;
        var variacionY = (inicialY - terminoY) / tiempo;
        var intervaloDrag = setInterval(function() {
            inicialX = inicialX - variacionX;
            inicialY = inicialY - variacionY;
            elem.x = inicialX;
            elem.y = inicialY;
            stage.update();
            tiempo--;
            if (tiempo === 0) {
                clearTimeout(intervaloDrag);
            }
        }, 30);
    },
    comprobarHueco: function(img) {
        for (var i = 0; i < this.criaturas.length; i++) {
            if (this.criaturas[i].x === img.x && this.criaturas[i].y === img.y) {
                this.criaturas[i].remove();
                this.stage.update();
            }
        }
    },
    externalEvents: function() {
        var ths = this;
        this.actitudSelect.on("change click", function() {
            var actitud = $(this).val();
            var grupo = ths.seleccion;
            grupo.actitud = actitud;
            var img = grupo.getChildByName('imgActitud');
            img = ths.actitudImg(img, actitud);
            ths.stage.update();
        });
        this.claseSelect.on("change click", function() {
            console.log(111)
            var clase = $(this).val();
            var grupo = ths.seleccion;
            grupo.clase = clase;
            var img = grupo.getChildByName('imgClase');
            var atributos = {
                raza: grupo.raza,
                clase: grupo.clase
            };
            img = ths.claseImg(img, atributos);
            ths.stage.update();
        });
    }
};