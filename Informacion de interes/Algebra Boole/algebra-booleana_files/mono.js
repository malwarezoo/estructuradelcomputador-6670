/**
 * Interfase con el usuario
 * Monografias.com
 * 
 * @author  	Daniela Rodriguez Careri <danielarc@interdac.com.ar>
 * @requires 	jQuery
 *  
 */

// TODO: Eliminar llamadas a funciones heredadas
// TODO: Implemementar minificador
// TODO: Implementar lazy loading y test de presencia en una sola funcion

var mono = {
	version : "1.5.1.0"
};

mono.CFG = {};
mono.CFG.IS_DEVEL = (window.location.host.indexOf("stage1") !== -1);
mono.CFG.IS_EXTERNAL = (window.location.host.indexOf("www") == -1);
mono.CFG.IS_BLOGS = (window.location.host.indexOf("blogs") !== -1);

if (mono.CFG.IS_EXTERNAL && mono.CFG.IS_DEVEL) {
	mono.CFG.URL_MONO = "http://www.stage1.monografias.com/";
} else if (mono.CFG.IS_EXTERNAL && !mono.CFG.IS_DEVEL) {
	mono.CFG.URL_MONO = "http://www.monografias.com/";
} else {
	mono.CFG.URL_MONO = "/";
}

mono.CFG.DEBUG 					= true && mono.CFG.IS_DEVEL;
mono.CFG.URL_BASE 				= "/";
mono.CFG.URL_LOGIN		 		= mono.CFG.URL_MONO + "usuario/login";
mono.CFG.URL_REGISTRO	 		= mono.CFG.URL_MONO + "usuario/registro";
mono.CFG.URL_RANDOM				= mono.CFG.URL_MONO + "random/";
mono.CFG.URL_JAVASCRIPT 		= mono.CFG.URL_RANDOM + "js/";

mono.CFG.COMENTARIOS_MAX_CAPS = 70; // m�ximo porcentaje de caracteres en mayusculas tolerables en un comentario	

mono.MSG_TYPE = { ADVERTENCIA: "advert", INFORMACION: "informacion", ERROR: "error", STOP: "stop", PROCESANDO: "procesando"}


/***********************************************************************************************************************
 * Constantes idioma
 */
mono.msg = {
	
	ERROR_500 					: "Ha ocurrido un error en el servidor. Por favor, vuelva a intentar en unos minutos.",
	ERROR_403_COMENTARIO 		: "Para dejar un comentario debe iniciar sesi&oacute;n.",
	ERROR_403_DENUNCIA 			: "Para denunciar un comentario, debe iniciar sesion.",
	ERROR_403_VOTAR 			: "Para poder votar, debe iniciar sesion.",
	ERROR_400_COMENTARIO 		: "Antes de enviar, escriba el comentario.",
	ERROR_AUTENTICACION			: "El usuario y la contrase&ntilde;a no coinciden.",
	ERROR_SERVIDOR				: "Ocurri&oacute; un error en Monografias.com. Por favor, espere unos instantes e intente nuevamente.",
	ERROR_FALTA_EMAIL			: "Falta escribir el e-mail.",
	ERROR_FALTA_PASS			: "Falta escribir la contrase&ntilde;a.",
	
	PLEASE_WAIT					: "Aguarde un instante por favor...",
	
	CONFIRMA_DENUNCIA 			: "Confirme por favor que este comentario viola los Terminos y Condiciones de Monografias.com",
	DENUNCIA_ENVIADA 			: "&nbsp;|&nbsp; <strong>Comentario denunciado</strong>",
	NO_VOTAR_DOBLE 				: "No puede votar el mismo comentario dos veces",
	CTRL_D_FAVORITO				: "Presione Aceptar y luego CTRL + D para agregar esta pï¿½gina a sus favoritos.",
	REGISTRESE					: "&iexcl;Reg&iacute;strese!",
	INICIAR_SESION				: "Iniciar sesi&oacute;n",
	SALIR						: "Salir"

}

/***********************************************************************************************************************
 * Algunas utilidades
 */
mono.util = {
	
	getCookie : function(nombre) {
		var results = document.cookie.match ( '(^|;) ?' + nombre + '=([^;]*)(;|$)' );
		if (results) {
			return (unescape(results[2]));
		} else {
			return null;
		}
	},

	setCookie : function(nombre, value, neverexpires) {
		var cookie_string = nombre + "=" + escape(value) + "; path=/";
		if (neverexpires) {
			var cookie_date = new Date();
			cookie_date.setDate (cookie_date.getDate() + 365 );
			cookie_string += "; expires=" + cookie_date.toGMTString() + "; path=/";
		}
		document.cookie = cookie_string;
	},

	deleteCookie : function(nombre) {
		var cookie_date = new Date();
		cookie_date.setDate(cookie_date.getDate() - 1 );
		console.log(cookie_date.toGMTString());
		document.cookie = nombre += "=; expires=" + cookie_date.toGMTString() + "; path=/";
	},
	
	sanearTexto : function(t) {
		var mayus = t.match(/[A-Z]/g);
		if (mayus) { 
			var cantMayus = mayus.length;
			var total = t.length;
			if ( ((cantMayus/total)*100) > mono.CFG.COMENTARIOS_MAX_CAPS ) {
				t = t.charAt(0).toUpperCase() + t.substr(1).toLowerCase(); // HOLA --> Hola
			}
		}
		t = t.replace(/([A-Za-z0-9,\.!\?\$\-])\1{5,}/g, "$1"+"$1"+"$1"+"$1"); // Holaaaaaaaaaaaaaa --> Holaaaa
		return t;
	},
	
	createMsg : function(mensaje, tipo, opt) {
		var opciones = {};
		opciones.cerrar = opt ? opt.cerrar : false; 
		opciones.dismiss = opt ? opt.dismiss : false;
		$texto = $("<p/>");
		$texto.html(mensaje);
		$msg = $("<div/>");
		$msg.addClass("mensaje-de").addClass(tipo);
		if (opciones.cerrar) $msg.addClass('con-cerrar');
		if (opciones.dismiss) $msg.addClass('con-dismiss');
		$msg.html($texto);
		return ($msg);
	},
	
	agregarFavorito : function() {
		var titulo = document.title;
		var url = parent.location.href;
		if (url == "http://www.monografias.com/") { titulo = "Monografias.com"; }
		if (document.all) {
			window.external.AddFavorite(url, titulo);
		} else {
			alert(mono.msg.CTRL_D_FAVORITO);
		}
	},

	base64encode : function (input) {
		_keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
 		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
			output = output +
			_keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
			_keyStr.charAt(enc3) + _keyStr.charAt(enc4);
		}
		return output;
	},

	evalResultData : function (texto) {
		var rx = (texto.replace(/\r|\n|\r\n|\t/g, ""));
		try	{
			var r = eval( "(" + rx + ")" );
			return (r);
		} catch(ex) {
			return false;
		}
	},
	
	// Todas las llamadas a window.registro enviadas a esta funcion
	// que a su vez, ya no abre mas el popup de registro, sino que lleva
	// al nuevo formulario de registro en sistema de perfiles
	registroRedirect : function() {
		mono.console.log ("Se llamo a la funcion obsoleta registro()");
		window.location = mono.CFG.URL_REGISTRO;
	},
	
	// TODO: popup y registro son heredadas, optimizar en una sola
	popup : function(url) {
		cuteLittleWindow = window.open(url, "littleWindow", "location=no,width=390,height=470,scrollbars=yes");
	},
	
	registro : function(url) {
		cuteLittleWindow = window.open(url, "littleWindow", "location=no,width=415,height=475,scrollbars=yes");
	}
	
}

/***********************************************************************************************************************
 * Funciones de interfase con el usuario
 */
 
mono.ui = {
	
	activarAjaxLogin : function() {
		$.fn.colorbox.settings.bgOpacity = 0.60;
		$.fn.colorbox.settings.transition = "elastic";
		$("#js-login").colorbox({
			contentWidth:"500px",
			contentHeight:"210px",
			//contentAjax: mono.CFG.URL_JAVASCRIPT + "/inc_loginform.html", // no porque no respeta autocomplete
			//contentIframe: mono.CFG.URL_JAVASCRIPT + "/inc_loginform.html", // no porque se complica demasiado comunicarse con el iframe
			contentInline:"#login-box-container .login-box",
			afterShowCallback : function() { 
				var $form = $("#js-loginform", "#colorbox");
				var $notificacion = $(".login-box .notificacion", "#colorbox");
				
				// Enviar login
				$form.submit(function(e) {
					e.preventDefault();
					$notificacion.html(mono.util.createMsg(mono.msg.PLEASE_WAIT, mono.MSG_TYPE.PROCESANDO));
					$form.desactivar();
					var errores = "";
					var email = $(":input[name='email']", $form).val();
					var pass = $(":input[name='password']", $form).val();
					var recordar = $(":input[name='recordar']", $form).attr("checked") ? 1 : 0;
					if (!email) { errores += mono.msg.ERROR_FALTA_EMAIL; }
					if (!pass) { errores += " " + mono.msg.ERROR_FALTA_PASS; }
					if (errores) {
						$notificacion.html(mono.util.createMsg(errores, mono.MSG_TYPE.ERROR));
						$notificacion.show();
						$form.activar();
						return false;
					} else {
						if (mono.CFG.IS_EXTERNAL) { // si no estamos en el dominio raiz, logueamos por JSONP
							var queryString = mono.CFG.URL_LOGIN + "?email=" + email +
								"&password=" + mono.util.base64encode(pass) + "&recordar=" + recordar + "&jsoncallback=?";
							$.getJSON(queryString, function(response) {
								mono.ui.handleLoginResult(response);
							});
						} else { // sino, via ajax
							$.ajax({
								url : mono.CFG.URL_LOGIN,
								type : "POST",
								data : $form.serialize(),
								success : function(response) {
									mono.ui.handleLoginResult(mono.util.evalResultData(response));
								},
								error : function(XHR, estado, error) {
									mono.console.log (XHR, estado, error);
									switch (XHR.status) {
										case 401 : {
											$notificacion.html(mono.util.createMsg(mono.msg.ERROR_AUTENTICACION, mono.MSG_TYPE.ERROR));
											$notificacion.show();
											$form.activar();
										} break;
										default : {
											$notificacion.html(mono.util.createMsg(mono.msg.ERROR_SERVIDOR, mono.MSG_TYPE.ERROR));
											$notificacion.show();
											$form.activar();
										} break;
									}
									
								}
							}); // ajax	
						} // if external
					} // if errores
				}); // submit handler
			} // aftershowcallback
		});//colorbox

		if (mono.CFG.IS_BLOGS) { // Cualquier otro clic en "iniciar sesion" en blogs debe disparar el cuadro ajax
			$(".js-login-blogs").click(function(e) { 
				e.preventDefault();
				$("#js-login").trigger("click");
			});
		}
		
		if (mono.temp_mono_id) { // hack para ticket #128: Clic en "inicie sesion" en monografias tambien debe disparar el cuadro ajax
			$("#js-inicia-primero a:eq(1)").click(function(e) { 
				e.preventDefault();
				$("#js-login").trigger("click");
			});
		}

	},
	
	handleLoginResult : function(response) {
		mono.console.dir(response);
		var $form = $("#js-loginform", "#colorbox");
		var $notificacion = $(".login-box .notificacion", "#colorbox");
		if (response.result) {
			location.reload(); // si logueo exitoso por ahora actualizar la pagina
			// TODO: refrescar por javascript lo que haga falta (sera viable?)
		} else {
			$notificacion.html(mono.util.createMsg(mono.msg.ERROR_AUTENTICACION, mono.MSG_TYPE.ERROR));
			$notificacion.show();
			$form.activar();
		}
	},
	
	// Traer en un IFrame la página para recomendar
	invitarAmigoAjax : function() {
		$.fn.colorbox.settings.bgOpacity = 0.60;
		$.fn.colorbox.settings.transition = "elastic";
		$("#js-invitar-amigo").colorbox({
			contentWidth:"400px",
			contentHeight:"400px",
			contentIframe: mono.CFG.URL_BASE + "cgi-bin2/recomendar.pl"
		});
	}
	
};
	

/***********************************************************************************************************************
 * Activar la interfase con el usuario para todas las paginas
 */
mono.setHandlers = function() {
	
	// Login
	if (mono.TEMP.usuario) {
		var $loginregister = $('<span class="secundario"><img alt="" src="' + mono.CFG.URL_MONO +
			'img/log-user.gif"/>&nbsp;<a href="' + mono.CFG.URL_MONO + 'usuario/perfilprivado">' +
			mono.TEMP.usuario.firstname + (mono.TEMP.usuario.lastname ? " " + 
			(mono.TEMP.usuario.lastname.length > 20 ? mono.TEMP.usuario.lastname.split(" ")[0] : mono.TEMP.usuario.lastname) : "") +
			'</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="' + mono.CFG.URL_MONO + 'usuario/logout">' + mono.msg.SALIR + '</a></span>');
		$("#Idioma").html($loginregister);
    } else {
    	var $loginregister = $('<span class="secundario"><img alt="" src="' + mono.CFG.URL_MONO +
    		'img/log-user.gif"/>&nbsp;<a href="' + mono.CFG.URL_MONO + 'usuario/registro">' +
			mono.msg.REGISTRESE + '</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a id="js-login" href="' + mono.CFG.URL_MONO + 'usuario/login">' +
			mono.msg.INICIAR_SESION + '</a></span>');
		$("#Idioma").html($loginregister);
		if ($("#login-box-container").length) { // activar el login por ajax solo si se encuentra presente el formulario
			$.getScript(mono.CFG.URL_JAVASCRIPT + "jquery.colorbox.js", function() {
				setTimeout(mono.ui.activarAjaxLogin, 500);
			});
		}
    }

	//"Invitar un amigo"
	if (jQuery.fn.colorbox) {
		mono.ui.invitarAmigoAjax();
	} else {
		$.getScript(mono.CFG.URL_JAVASCRIPT + "jquery.colorbox.js", function() {
			setTimeout(mono.ui.invitarAmigoAjax, 500);
		});
	}
    // Reemplazar [arroba] por @
    // Lo habia hecho en jQuery (11ms), pero nativo es mas rapido (3ms)
    var maildivider="[arroba]";
	var href;
	for (i=0; i<=(document.links.length-1); i++){
		href = document.links[i].href;
		if (href.indexOf(maildivider)!=-1) {
			document.links[i].href = href.split(maildivider)[0] + "@" + href.split(maildivider)[1];
		}
	}
    
    // En la barra de navegacion, explicarle a IE6 que "last-child" significa "ultima".
    // Eliminar este tipo de hacks el dichoso dia en que IE6 desaparezca
    $("#Navegacion li:last-child a").addClass("ultima");
        
	mono.console.log("mono.setHandlers listo.");
}

/***********************************************************************************************************************
 * Define la consola de debug, establece si el usuario est� logueado y extiende jQuery.
 * Todo antes de que el DOM est� disponible.
 */
mono.init = function() {
	
	
	if (jQuery.browser.msie && jQuery.browser.version == "6.0") {
		var headID = document.getElementsByTagName("head")[0];         
		var cssNode = document.createElement('link');
		cssNode.type = 'text/css';
		cssNode.rel = 'stylesheet';
		cssNode.href = mono.CFG.URL_RANDOM + "mono_v2-ie6.css";
		cssNode.media = 'screen';
		headID.appendChild(cssNode);
	}
	
	if (mono.CFG.DEBUG) {
		// con debug activado, las llamadas a consola se envian a...
		if ( ( !("console" in window) || !("firebug" in console) )) {
			// Una consolita pobre (en IE, Safari y otros, que iremos mejorando a medida que se requiera)
			// TODO: mejorar mono.console.dir
			mono.console = {
				"log" : function() {
					var args = Array.prototype.slice.call(arguments);
					var t = args.join(" | ");
					$("#mono_debug_console").show().find(".inner").append("<p>" + t + "</p>");
					//$("#mono_debug_console .inner").scrollTo({top:'+=20px'});
				},
				"info": function(){},
				"warn": function(){},
				"error": function(){},
				"assert": function(){},
				"dir": function(){},
				"dirxml": function(){},
				"group": function(){},
				"groupEnd": function(){},
				"time": function(){},
				"timeEnd": function(){},
				"count": function(){},
				"trace": function(){},
				"profile": function(){},
				"profileEnd": function(){}
			}
			
			$(document).ready(function() {
				var $consola = $('<div id="mono_debug_console" style="display:none;"><div style="display:none" class="inner clearfix"></div><span class="show_hide">Consola</span></div>');
				$("body").append($consola);
				$("#mono_debug_console .show_hide").bind("click", function(e){
					$("#mono_debug_console").toggleClass("abierto").find(".inner").toggle();
				});
			});
		} else {
			// O la consola de Firebug para Firefox
			mono.console = console;
		}
	} else {
		// con debug desactivado todas las llamadas a consola se env�an a la nada
		var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml",
	    "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"];
	    mono.console = {};
	    for (var i = 0; i < names.length; ++i) {
	        mono.console[names[i]] = function() {}
	    }
	}

	mono.TEMP = mono.TEMP || {} // Si no viene definido el miembro TEMP desde el HTML, crearlo para uso interno
	
	if (mono.util.getCookie("monoauth_session_hash")) {
		mono.TEMP.usuario = {};
		mono.TEMP.usuario.firstname = mono.util.getCookie("monoauth_firstname") || "";
		mono.TEMP.usuario.lastname = mono.util.getCookie("monoauth_lastname") || "";
		mono.TEMP.usuario.username = mono.util.getCookie("monoauth_username") || "";
	}
	
	jQuery.fn.extend ({
			
		// Desactivar form
		desactivar: function() {
			$(':input[readonly!="readonly"]:not(.desactivado)', this).each(function() {
				var $el = $(this);
				$el.attr('readonly', 'readonly').addClass('desactivado js-dis'); // Ojo, seteamos readonly, no disabled
				if ($el.hasClass('submit'))	{
					$el.addClass('busy');
					$el.attr('disabled', 'disabled').attr('oldValue', $.trim($(this).html()));
					$el.html("Enviando...");
					$el.blur();
				}
			})
			return this;
		},
		
		// Reactivar form
		activar: function() {
			return $('.desactivado.js-dis', this).each(function() {
				$(this).removeAttr('readonly').removeClass('desactivado js-dis');
				if ($(this).attr('oldValue')) { 
					$(this).removeClass('busy');
					$(this).html($(this).attr('oldValue'));
					$(this).removeAttr('disabled').removeAttr('oldValue');
				}
			});
		}
	});

	mono.console.log("mono.init listo.");
	//mono.console.dir(mono.CFG);
}

/***********************************************************************************************************************
 * Main
 */
mono.init();
$(document).bind("ready", function() {
	mono.setHandlers();
});





/***********************************************************************************************************************
 * Compatibilidad hacia atras
 * Habria que reemplazar en todos los HTML las llamadas a funciones heredadas
 * por las nuevas en mono.util y luego borrar de aca para abajo toda esta seccion
 */ 

favorito = mono.util.agregarFavorito;
favoritohome = mono.util.agregarFavorito;
popup = mono.util.popup;
registro = mono.util.registroRedirect;

// TODO: Todo esto habria que replantearlo, es muy desprolijo
function verificarradio(form){
         var indice = form.opt && form.opt.selectedIndex;

        //var indice = form.opt.selectedIndex;
        var opcion = form.opt && form.opt[indice] && form.opt[indice].value;
        //var opcion = form.opt[indice].value;
        var searchterm = form.query.value;

        switch(opcion){
                case "aex":
                        ventanita = window.open("/cgi-bin2/search_mod.cgi?query="+searchterm+"&opt="+opcion,"Asksearch","location=no,width=780,height=500,scrollbars=yes,status=yes,menubar=yes,resizable=yes");
                        break;
                case "org":
                        searchterm=escape(searchterm);
                        window.location = ("/cgi-bin/search.cgi?query="+searchterm);
                        break;
                case "ain":
                        window.location = ("/cgi-bin2/search_mod.cgi?query="+searchterm+"&opt="+opcion);
                        break;
                default:
                        searchterm=escape(searchterm);
                        window.location = ("/cgi-bin/search.cgi?query="+searchterm);
                        break;
        }
        return false;
}

function KeyPressEnterK() {
	if (window.event.keyCode == 13){
		window.event.keyCode =0;
		verificarradio();
	} 
}

function checkKeyPressed(evt,form) {
  evt = (evt) ? evt : (window.event) ? event : null;
  if (evt) {
    var charCode = (evt.charCode) ? evt.charCode :
                   ((evt.keyCode) ? evt.keyCode :
                   ((evt.which) ? evt.which : 0));
    if (charCode == 13) {
        verificarradio(form);
		return false;
    }
  }
}
