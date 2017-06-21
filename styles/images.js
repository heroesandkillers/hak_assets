var s = "";
var imgUrl = org + "img/";
var pre = "{background-image:url(" + imgUrl;
var fin = ")}";

function css(nombre, url){
    s += nombre + pre + url + fin;
}

//BASE

css("#handler", "canvas/fondo.jpg");
css(".ico_foro", "interfaz/iconos/foro.png");
css(".ico_mensajes", "interfaz/iconos/mensajes.png");
//css(".escudo", "escudo.png");
css("#ico_logout", "interfaz/iconos/logout.png");
css(".ico_mapa", "interfaz/iconos/mapa.png");
css(".ico_construccion", "interfaz/iconos/construccion.png");
css(".ico_equipo", "interfaz/iconos/equipo.png");
css(".ico_academia", "interfaz/iconos/equipo.png");
css(".ico_entreno", "interfaz/iconos/entreno.png");
css(".ico_alineacion", "interfaz/iconos/alineacion.png");
css(".ico_batallas", "interfaz/iconos/batallas.png");
css(".ico_mazmorras", "interfaz/iconos/mazmorras.png");
css(".ico_perfil", "interfaz/iconos/perfil.png");
//MAPA
css(".ico_lupa", "iconos/iconoLupa.png");
css(".arrowLeft", "interfaz/tabla/arrowLeft.png");
css(".arrowRight", "interfaz/tabla/arrowRight.png");
//css(".loader", "loader.gif");
css(".criaturaMapa", "raza/raza1.png");
css("#titulo", "interfaz/titulo2.png");
css(".checked", "interfaz/checkbox/check.png");
css(".moneda", "iconos/moneda.png");
css("#tituloIndex", "interfaz/tituloH.png");
css("#conjunto", "canvas/fondo.jpg");
css("#close", "iconos/close.png");
css(".observable", "iconos/observar.png");
css(".iconoVer", "iconos/iconoLupa.png");
//ENTRENO
css("#entrenamiento span", "interfaz/tabla/degradado.png");
css("#entrenamiento span  .ui-slider-range.ui-widget-header", "interfaz/tabla/cadena.png");
css("#entrenamiento span .ui-slider-handle", "interfaz/tabla/daga.png");
//ALINEACION
css("#canvasAlineacion, #canvasAlineacionAcademia", "canvas/ground.jpg");
css("#gameArea > div", "canvas/bosque.png");
//css(".escudoImg", "escudo.png");
css("#reproduccion div", "iconos/reproduccion/reproduccion.png");
//CONTACTO
css(".trofeoliga1", "trofeos/trofeo.png");
css("#detallesCalendario", "canvas/ground.jpg");
css(".select", "new_arrow.png");
css(".arrowUp", "interfaz/tabla/arrowUp.png");
css(".arrowDown", "interfaz/tabla/arrowDown.png");
css("#foroExpand", "interfaz/tabla/arrow.png");
css(".ico_ayuda", "iconos/ayuda.png");
css(".maximizar", "iconos/maxim.png");
css(".trofeoliga1", "trofeos/trofeo.png");
css(".ico_Papelera", "iconos/papelera.png");

s += "#container canvas{"
    +"-webkit-border-image:url(../../hak_static/img/canvas/borde.png) 78 round;;"
    +"-o-border-image:url(../../hak_static/img/canvas/borde.png) 78 round;;"
    +"-moz-border-image: url(../../hak_static/img/canvas/borde.png) 78 round;;"
    +"border-image:url(../../hak_static/img/canvas/borde.png) 78 round;;"
    +"background-image:url(../../hak_static/img/canvas/ground.jpg);"
+"}";

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = s;
document.getElementsByTagName('head')[0].appendChild(style);
