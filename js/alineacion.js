var alineacionObj = {
    contenedor: "",
    canvas: "",
    botonAsignar: "",
    claseSelect: "",
    actitudSelect: "",
    lista: "",
    atributos: "",
    nombre: "",
    obj: {},
    criaturas: [],
    stage: "",
    seleccion: 0,
    drag: false,
    dragId: 0,
    posX: 3,
    posY: 5,
    scale: 1,
    canvasAncho: "",
    canvasAlto: "",
    alineacion: "",
    selectX: 0,
    selectY: 0,
    gridX: 0,
    gridY: 0,
    rects: {},
    activo: null,
    oval: new createjs.Shape(),
    startCanvas: function() {
        var ths = this;
        ths.externalEvents();
        ths.criaturas = [];

        if (!isCanvasSupported()) {
            ths.contenedor.removeClass("swipRight");
        }

        ths.canvasAncho = ths.contenedor.width();
        ths.canvasAlto = ths.contenedor.height() -ths.contenedor.find(".titulo").height() - 15;
        ths.canvas.height = ths.canvasAlto;
        ths.canvas.width = ths.canvasAncho;

        ths.stage = new createjs.Stage(ths.canvas);
        createjs.Touch.enable(ths.stage);
        ths.scale = $(ths.canvas).height() / 1000;

        var color = createjs.Graphics.getRGB(0, 0, 0, 0.2);

        var i;
        for (i = 0; i < ths.posY - 1; i++) {
            var alto = ths.canvasAlto / (ths.posY) * (i + 1);

            var h = new createjs.Shape();
            h.graphics.beginStroke(color).moveTo(0, alto).lineTo(ths.canvasAncho, alto);

            ths.stage.addChild(h);
        }
        for (i = 0; i < ths.posX - 1; i++) {
            var ancho = ths.canvasAncho / (ths.posX) * (i + 1);

            var v = new createjs.Shape();
            v.graphics.beginStroke(color).moveTo(ancho, 0).lineTo(ancho, ths.canvasAlto);

            ths.stage.addChild(v);
        }

        ths.oval.graphics.beginStroke("black").beginFill("yellow").drawEllipse(-36, 30, 90, 40);
        ths.oval.name = "oval";
        ths.oval.scaleX = ths.scale;
        ths.oval.scaleY = ths.scale;

        var none = createjs.Graphics.getRGB(0, 0, 0, 0.01);
        for (var i = 0; i < ths.posX; i++) {
            for (var j = 0; j < ths.posY; j++) {
                var container = new createjs.Container();
                ths.rects["pos" + (i*5 + j)] = container;
                var rect = new createjs.Shape();
                rect.name = "rect";
                rect.graphics.beginFill(none);
                ths.drawRect(rect);
                container.i = i;
                container.j = j;
                container.x = ths.canvasAncho / ths.posX * i;
                container.y = ths.canvasAlto / ths.posY * j;
                container.addChild(rect);
                ths.stage.addChild(container);
                ths.rectListener(container);
            }
        }

        ths.colocarAlineaciones();
    },
    rectListener: function(container) {
        var ths = this;        
        container.addEventListener("mousedown", function(evt) {
            if(!stopPropagation){
                timePropagation();
                
                var quieto = true;
                var criatura = container.getChildByName("criatura");            
            
                var x = evt.stageX;
                var y = evt.stageY;
                if(criatura){
                    criatura.scaleX = 1.1;
                    criatura.scaleY = 1.1;
                    ths.stage.update();
                
                    setTimeout(function(){
                        if(quieto){
                            quieto = false;
                            ths.dragId = criatura.id;
                            criatura.addChildAt(ths.oval, 0);
                            criatura.scaleX = 1.3;
                            criatura.scaleY = 1.3;
                            criatura.x = x - container.x;
                            criatura.y = y - container.y;
                            ths.stage.update();
                        
                            evt.addEventListener("mousemove", function(e){
                                console.log("mousemove");
                                criatura.x = e.stageX - container.x;
                                criatura.y = e.stageY - container.y;
                                ths.stage.update();
                            });
                            evt.addEventListener("mouseup", function(e){
                                console.log("mouseup");
                                ths.gridX = Math.floor(e.stageX / (ths.canvasAncho/ths.posX));
                                ths.gridY = Math.floor(e.stageY / (ths.canvasAlto/ths.posY));
                                criatura.x = e.stageX - container.x;
                                criatura.y = e.stageY - container.y;
                                criatura.scaleX = 1;
                                criatura.scaleY = 1;
                                ths.dropCriatura();
                                timePropagation();
                            });  
                        }
                    },1400);
                }
                evt.addEventListener("mousemove", function(){
                    if(Math.abs(evt.stageX - x) + Math.abs(evt.stageY - y) > 10){
                        quieto = false;                
                    }
                });
                evt.addEventListener("mouseup", function(){
                    if(quieto){
                        quieto = false;
                        ths.onCriaturaRelease(container);                    
                    }
                    if(criatura){
                        criatura.scaleX = 1;
                        criatura.scaleY = 1;
                        ths.stage.update();
                    }
                    evt = null;
                });
            }
        });
    },
    onCriaturaRelease: function(container){
        var ths = this;
        var activo = ths.activo === container ? true : false;
        var inside = false;
        var selec = false;
        var criatura = container.getChildByName("criatura");
        if(criatura !== null){
            inside = true;
            if(criatura.getChildByName("oval") !== null){
                selec = true;
            }
        }
            
        var none = createjs.Graphics.getRGB(0, 0, 0, 0.01);
        var rect;
        if(inside === false || (inside && selec)){
            if(activo){
                rect = ths.activo.getChildByName("rect");
                rect.graphics.clear().beginFill(none);
                ths.drawRect(rect);
                ths.activo = null;
                ths.lista.removeClass("swipRight");

            }else{
                if(ths.activo){
                    rect = ths.activo.getChildByName("rect");
                    rect.graphics.clear().beginFill(none);
                    ths.drawRect(rect);
                    ths.activo = null;
                }  
                ths.activo = container;
                rect = container.getChildByName("rect");
                rect.graphics.beginRadialGradientFill(["rgba(255, 0, 0, 0.4)", "rgba(255, 0, 0, 0.1)"], [1, 0],
                    ths.canvasAncho / ths.posX * 0.5, ths.canvasAlto / ths.posY * 0.5,
                    0,
                    ths.canvasAncho / ths.posX * 0.5, ths.canvasAlto / ths.posY * 0.5,
                    ths.canvasAncho / 3 > ths.canvasAlto / 5 ? ths.canvasAncho / 3 : ths.canvasAlto / 5);

                ths.drawRect(rect);
                ths.stage.update();

                ths.gridX = container.i;
                ths.gridY = container.j;

                ths.lista.addClass("swipRight");
            }
            ths.atributos.removeClass("swipRight");
            var criat = ths.oval.parent;
            if(criat !== null){
                criat.removeChild(ths.oval);
            }
            ths.stage.update();
                    
        }else{
            if(ths.activo){
                rect = ths.activo.getChildByName("rect");
                rect.graphics.clear().beginFill(none);
                ths.drawRect(rect);
                ths.activo = null;
            }                
            ths.lista.removeClass("swipRight");
            for (var i = 0; i < ths.criaturas.length; i++) {
                if (ths.criaturas[i].parent.i === container.i && ths.criaturas[i].parent.j === container.j) {
                    var grupo = ths.criaturas[i];
                    ths.atributos.addClass("swipRight");
                    ths.nombre.html(grupo.nombre);
                    ths.actitudSelect.val(grupo.actitud);
                    ths.claseSelect.val(grupo.clase);

                    ths.seleccion = grupo;
                    grupo.addChildAt(ths.oval, 0);
                    ths.stage.update();
                }
            }   
        }
    },
    drawRect: function(elem) {
        var ths = this;
        elem.graphics.drawRect(0,0, ths.canvasAncho / 3, ths.canvasAlto / 5);
    },
    dropCriatura: function() {
        var ths = this;
        var id = ths.dragId;
        var criatura = getObjById(ths.obj, id);
        var actitud = 'moderado';
        var clase = criatura.clases ? criatura.clases.split(";")[0].split(":")[0] : 'barbaro';

        var atributos = {
            clase: clase,
            actitud: actitud
        };
        ths.crearGrupo(id, atributos);
    },
    colocarAlineaciones: function() {
        var ths = this;
        var perfil = global.perfil;
        if (typeof perfil[ths.alineacion] !== 'undefined' && perfil[ths.alineacion] !== '') {

            var alineacionArray = global.alin;
            
            for (var i = 0; i < alineacionArray.length; i++) {
                var id = alineacionArray[i].id;
                var posicion = alineacionArray[i].posicion;

                var posicionX = Math.floor(posicion / 5);
                var posicionY = posicion - posicionX * 5;

                ths.gridX = posicionX;
                ths.gridY = posicionY;

                ths.crearGrupo(id, {
                    clase: alineacionArray[i].clase,
                    actitud: alineacionArray[i].actitud
                });
            }
            loadImagenes(['../img/alineacion/clase.png', '../img/alineacion/actitud.png'], function() {
                ths.stage.update();
            });
        }
        ths.botonAsignar.addClass("noClick");

    },
    crearGrupo: function(id, atributos) {
        var ths = this;
        ths.botonAsignar.removeClass('noClick');
        
        var oX = ths.canvasAncho / ths.posX * 0.5;
        var oY = ths.canvasAlto / ths.posY * 0.5;
        //IF CRIATURA YA EXISTE
        for (var i = 0; i < ths.criaturas.length; i++) {
            if (id === ths.criaturas[i].id) {
                
                var contenedor1 = ths.rects["pos" + (ths.gridX*5 + ths.gridY)];    
                var criat1 = contenedor1.getChildByName("criatura");
                var criat2 = ths.criaturas[i];
                var contenedor2 = criat2.parent;
        
                var pX = (contenedor1.i - contenedor2.i) * (ths.canvasAncho / ths.posX);
                var pY = (contenedor1.j - contenedor2.j) * (ths.canvasAlto / ths.posY);                
                contenedor1.addChild(criat2);

                ths.movimientoAnimation(criat2, criat2.x - pX, criat2.y - pY, oX, oY, function(){
                    if(criat1){
                        contenedor2.addChild(criat1);
                        ths.movimientoAnimation(criat1, oX+pX, oY+pY, oX, oY, function(){});
                    }
                });
                return;
            }
        }
        
        var criatura = getObjById(ths.obj, id);
        
        if(typeof criatura !== 'undefined'){
                    
            var contenedor = ths.rects["pos" + (ths.gridX*5 + ths.gridY)];
            var criat = contenedor.getChildByName("criatura");
            if(criat !== null){
                criat.x = oX;
                criat.y = oY;
                ths.movimientoAnimation(criat, criat.x, criat.y, ths.selectX, ths.selectY,function(){
                    contenedor.removeChild(criat);
                    ths.quitarCriaturaId(criat.id);                    
                    if(!contenedor.getChildByName("criatura")){
                        add();
                    }
                });
                
            }else{
                if (ths.criaturas.length < 5) {
                    add();
                }else{
                    error("no puedes añadir más de 5 criaturas!");
                }                
            }
            function add(){
                var grupo = ths.grupo(criatura, id, atributos);
                ths.criaturas.push(grupo);
                grupo.visible = false;
                contenedor.addChild(grupo);
                ths.movimientoAnimation(grupo, ths.selectX, ths.selectY, oX, oY, function(){});
            }            
        }        
    },
    grupo: function(criatura, id, atributos){
        var ths = this;
        var grupo = new createjs.Container();
        
        var raza = atributos.raza = criatura.raza;
        var clase = atributos.clase;
        var actitud = atributos.actitud;

        var image1 = new Image();
        image1.src = '../img/alineacion/clase.png';

        var imgClase = new createjs.Bitmap(image1);
        imgClase = ths.claseImg(imgClase, atributos);
        imgClase.scaleX = ths.scale;
        imgClase.scaleY = ths.scale;
        imgClase.x = -150 * imgClase.scaleX;
        imgClase.y = -150 * imgClase.scaleY;
        imgClase.name = 'imgClase';

        var image2 = new Image();
        image2.src = '../img/alineacion/actitud.png';

        var imgActitud = new createjs.Bitmap(image2);
        imgActitud = ths.actitudImg(imgActitud, actitud);
        imgActitud.scaleX = ths.scale;
        imgActitud.scaleY = ths.scale;
        imgActitud.x = -50 * imgActitud.scaleX;
        imgActitud.y = -50 * imgActitud.scaleY;
        imgActitud.name = 'imgActitud';

        var text = new createjs.Text(ths.textoAlineacion(id), "16px Calibri", 'black');
        text.x = 0;
        text.y = 80 * ths.scale;
        text.textBaseline = "alphabetic";
        text.name = "text";

        grupo.id = id;
        grupo.name = "criatura";
        grupo.cursor = "pointer";

        grupo.actitud = actitud;
        grupo.clase = clase;
        grupo.raza = raza;
        grupo.nombre = getNombre(criatura);

        grupo.addChild(imgClase);
        grupo.addChild(imgActitud);
        grupo.addChild(text);
        
        return grupo;
    },
    claseImg: function(img, atributos) {
        var x = 0, y = 0;

        var raza = atributos.raza;
        var clase = atributos.clase;

        if (raza === "duende")
            raza = "goblin";

        if (raza === 'humano') {
            y = 0;
        } else if (raza === 'goblin') {
            y = 300;
        }

        if (clase === 'barbaro') {
            x = 0;
        } else if (clase === 'arquero') {
            x = 300;
        } else if (clase === 'mago') {
            x = 600;
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
                var apodo = getApodo(this.obj[i]);
                if (apodo !== "") {
                    return apodo;
                }
                var array = this.obj[i].nombre.split(" ");
                return array[0][0] + ". " + array[1];
            }
        }
        return "";
    },
    asignarAlineacion: function() {
        var ths = this;

        var alineacion = [];
        for (var i = 0; i < ths.criaturas.length; i++) {
            var x = this.criaturas[i].parent.i;
            var y = this.criaturas[i].parent.j;

            var id = this.criaturas[i].id;
            var posicion = x * 5 + y;

            if (posicion >= 0 && posicion < 15) {

                var clase = this.criaturas[i].clase;
                var actitud = this.criaturas[i].actitud;
                alineacion.push({
                    id: id,
                    posicion: posicion,
                    clase: clase,
                    actitud: actitud
                });
            }
        }

        var alin;
        if (ths.alineacion === "alin") {
            alin = JSON.stringify(alineacion);
            $.ajax({
                type: "GET",
                url: url + "asignarAlineacion",
                data: {
                    alineacion: alin
                },
                success: function(response) {
                    if (response !== '') {
                        error(response);
                    }else{
                        global[ths.alineacion] = alineacion;
                        confirmacion("guardado correctamente");
                        ths.botonAsignar.removeClass("noClick");
                    }                    
                }
            });
        } else if (this.alineacion === "alinAcad") {

            alin = JSON.stringify(alineacion);

            $.ajax({
                type: "GET",
                url: url + "asignarAlineacionAcademia",
                data: {
                    alineacion: alin
                },
                success: function(response) {
                    if (response !== '') {
                        error(response);
                    }
                    global[ths.alineacion] = alineacion;
                    //cargar(pestanaAcademia('academiaAlineacion'));
                }
            });
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
        var ths = this;
        ths.criaturas = ths.criaturas.slice(0, i).concat(ths.criaturas.slice(i + 1, ths.criaturas.length));
    },
    movimientoAnimation: function(elem, inicialX, inicialY, terminoX, terminoY, callback) {        
        var ths = this;
        var dist = Math.sqrt(Math.pow(inicialX - terminoX, 2) + Math.pow(inicialY - terminoY, 2));
        var tiempo = Math.floor(dist / 75) +1;

        var variacionX = (inicialX - terminoX) / tiempo;
        var variacionY = (inicialY - terminoY) / tiempo;
        
        elem.x = inicialX;
        elem.y = inicialY;
        elem.visible = true;
        ths.stage.update();
        
        var intervaloDrag = setInterval(function() {
            inicialX = inicialX - variacionX;
            inicialY = inicialY - variacionY;
            
            elem.x = inicialX;
            elem.y = inicialY;
            
            ths.stage.update();
            tiempo--;
            if (tiempo === 0) {
                callback();
                clearTimeout(intervaloDrag);
            }            
        }, 50);
    },
    comprobarHueco: function(img) {
        for (var i = 0; i < this.criaturas.length; i++) {
            if (this.criaturas[i].i === img.i && this.criaturas[i].j === img.j) {
                this.criaturas[i].remove();
                this.stage.update();
            }
        }
    },
    externalEvents: function() {
        var ths = this;
        ths.actitudSelect.on("change click", function() {
            var actitud = $(this).val();
            var grupo = ths.seleccion;
            grupo.actitud = actitud;
            var img = grupo.getChildByName('imgActitud');
            img = ths.actitudImg(img, actitud);
            ths.stage.update();
            ths.botonAsignar.removeClass('noClick');
        });
        ths.claseSelect.on("change click", function() {
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
            ths.botonAsignar.removeClass('noClick');
        });
    },
    unActive: function(){
        var ths = this;          
        if(ths.activo !== null){
            var none = createjs.Graphics.getRGB(0, 0, 0, 0.01);
            var rect = ths.activo.getChildByName("rect");
            rect.graphics.clear().beginFill(none);
            ths.drawRect(rect);        
            ths.activo = null;
            ths.stage.update();
            ths.lista.removeClass("swipRight");
        }
    },
    unSelect: function(){
        var ths = this;
        ths.oval.parent.removeChild(ths.oval);     
        ths.stage.update();
        ths.atributos.removeClass("swipRight");
    }
};
