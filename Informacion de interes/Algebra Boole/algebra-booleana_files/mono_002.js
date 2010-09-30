/**
 * Creacion, denuncia, calificacion de comentarios
 * Monografias.com
 * 
 * @author  	Daniela Rodriguez Careri <danielarc@interdac.com.ar>
 * @requires	mono.base
 * @requires 	jQuery
 * 
 */


mono.CFG.URL_COMENTARIO_ENVIAR		 	= mono.CFG.URL_MONO + "comentario/crear";
mono.CFG.URL_COMENTARIO_DENUNCIAR 		= mono.CFG.URL_MONO + "comentario/denunciar";
mono.CFG.URL_COMENTARIO_VOTAR 			= mono.CFG.URL_MONO + "comentario/votar";
mono.CFG.URL_PAGINA_SOLICITAR			= mono.CFG.URL_MONO + "comentario/paginador/";


/***********************************************************************************************************************
 * Objeto que maneja la creacion de comentarios
 */
mono.comentarios = {
	
	setHandlers : function() {
		
		// Mostrar el form de comentarios solo a los logueados.
		if (mono.TEMP.usuario) {
			$("#cont-form-comentario").show();
		} else {
			$("#js-inicia-primero").show();
		}
		
		// Desactivar el envio hasta que el user escriba algo
		$("#form-enviar-comentario button.submit").attr("disabled", "disabled");
		
		// Validar que el user escriba algo
		var timeout;
		$(":input[name='comentario-texto']").bind("keydown", function(e) {
			var $elem = $(this);
			clearTimeout(timeout);
			timeout = setTimeout( function() {
				var val = $elem.val();
				if (!val) {
					$("#form-enviar-comentario button.submit").attr("disabled", "disabled");
				} else  {
					$("#form-enviar-comentario button.submit").removeAttr("disabled");
				}
			}, 500);
		});	
		
		// Enviar
		$("#form-enviar-comentario").bind("submit", function(e) {
			e.preventDefault();
			var $form = $(this);
			$form.desactivar();
			$("#js-comentario-error").hide();
			var oldComentario = $(":input[name='comentario-texto']").val();
			var newComentario = mono.util.sanearTexto(oldComentario);
			$(":input[name='comentario-texto']").val(newComentario);
			$.ajax({
				url : mono.CFG.URL_COMENTARIO_ENVIAR,
				type : "POST",
				data : { "mono_id" : mono.temp_mono_id, "comentario" : newComentario },
				success : function(result) {
					$("#cont-form-comentario").hide();
					$("#js-comentario-publicado").show();
					$("#js-comentarios").empty().html(result);
					mono.denuncias.setHandlers();
					mono.calificacion.setHandlers();
					mono.paginacion.setHandlers();
				},
				error : function(XHR, estado, error) {
					switch (XHR.status) {
						case 500 : {
							$("#js-comentario-error p").html(mono.msg.ERROR_500);
							$("#js-comentario-error").show();
							$form.activar();
						} break;
						
						case 403 : {
							$("#js-comentario-error p").html(mono.msg.ERROR_403_COMENTARIO);
							$("#js-comentario-error").show();
							$form.activar();
						} break;
						
						case 400 : {
							$("#js-comentario-error p").html(mono.msg.ERROR_400_COMENTARIO);
							$("#js-comentario-error").show();
							$form.activar();
						} break;
						
					}
					
				}
			}); // ajax
			
		});
		
		mono.console.log("comentarios.setHandlers listo.");
			
	} // setHandlers
	
}

/***********************************************************************************************************************
 * Objeto que maneja la denuncia de comentarios
 */
mono.denuncias = {
	
	setHandlers : function() {
			
		// Mostrar el denunciador solo a los logueados.
		if (mono.TEMP.usuario) {
			$(".js-denunciador").show();
		}
		
		$(".js-denunciar").bind("click", function(e) {
			e.preventDefault();
			$el = $(this);
			comentarioId = $el.parents("li").attr("id").match(/js-comentario-([0-9]+)/)[1];
			if (confirm(mono.msg.CONFIRMA_DENUNCIA)) {
				$.ajax({
					url : mono.CFG.URL_COMENTARIO_DENUNCIAR,
					type : "POST",
					data : { "comentario_id" : comentarioId },
					success : function(result) {
						$el.parents(".js-denunciador").html(mono.msg.DENUNCIA_ENVIADA);
					},
					error : function(XHR, estado, error) {
						switch (XHR.status) {
							case 500 : {
								alert(mono.msg.ERROR_500);
							} break;
							
							case 403 : {
								alert(mono.msg.ERROR_403_DENUNCIA);
							} break;						
						}
					}
				}); // ajax	
			}
			
		});
		
		mono.console.log("denuncias.setHandlers listo.");
	} //setHandlers
	
}

/***********************************************************************************************************************
 * Objeto que maneja la calificacion de comentarios
 */
mono.calificacion = {
	
	setHandlers : function() {
		
		// habilitar manitos solo a los logueados.
		if (mono.TEMP.usuario) {
			
			$(".js-upvote, .js-downvote").bind("click", function(e) {
				e.preventDefault();
				$(this).blur();
				var $el = $(this);
				var $padre = $(this).parents("li");
				var comentarioId = $padre.attr("id").match(/js-comentario-([0-9]+)/)[1];
				var username = mono.util.getCookie("monoauth_username");
				if (username == null) return false;
				mono.console.log ("verificando si existe: " + "mono_" + username + "_" + comentarioId);
				if (mono.util.getCookie("mono_" + username + "_" + comentarioId)) {
					alert (mono.msg.NO_VOTAR_DOBLE);
					return false;
				} else {
					accion = $el.hasClass("js-upvote") ? "sumar" : "restar";
					$.ajax({
						url : mono.CFG.URL_COMENTARIO_VOTAR,
						type : "POST",
						data : { "comentario_id" : comentarioId, "accion" : accion },
						success : function(result) {
							mono.util.setCookie("mono_" + username + "_" + comentarioId, "true", true);
							diferencia = $el.hasClass("js-upvote") ? 1 : -1;
							var oldValor = parseInt ($el.siblings(".js-votos-actuales").text());
							var newValor = oldValor + diferencia;
							$el.siblings(".js-votos-actuales").text(newValor);
							var oldSrc = $el.children("img").attr("src").match(/^(.*).gif$/)[1];
							var newSrc = oldSrc + "_done.gif";
							$el.children("img").attr("src", newSrc);
							$(".js-upvote, .js-downvote", $padre).unbind("click").bind("click",function(e) {
								e.preventDefault();
								$(this).blur();
								alert (mono.msg.NO_VOTAR_DOBLE);
							});
						},
						error : function(XHR, estado, error) {
							switch (XHR.status) {
								case 500 : {
									alert(mono.msg.ERROR_500);
								} break;
								
								case 403 : {
									alert(mono.msg.ERROR_403_DENUNCIA);
								} break;						
							}
						}
					}); // ajax	
					
				}
			});
			
		} else {
			
			$(".js-upvote, .js-downvote").bind("click", function(e) {
				e.preventDefault();
				$(this).blur();
				alert (mono.msg.ERROR_403_VOTAR);
			});
			
		}
		
		mono.console.log("calificacion.setHandlers listo.");		
	} // setHandlers
	
}


/***********************************************************************************************************************
 * Objeto que maneja la paginacion de los comentarios
 */
mono.paginacion = {
	
	setHandlers : function() {
		
		$(".js-pag-anterior, .js-pag-siguiente, .js-pag-nro").bind("click", function(e) {
			e.preventDefault();
			$(this).blur();
			var $el = $(this);

			mono.console.log("click - " + $el.name);

			if ($el.hasClass("js-pag-nro")) {
				var pag = parseInt ($el.text());
			} else {
				var actual = parseInt ($el.siblings(".js-pag-actual").text());
				var pag = $el.hasClass("js-pag-anterior") ? actual - 1 : actual + 1;
			}

			mono.paginacion.cargarPagina(pag);
			
		});
	
		mono.console.log("paginacion.setHandlers listo.");			
	}, // setHandlers
	
	cargarPagina : function(pag) {
		$.ajax({
			url : mono.CFG.URL_PAGINA_SOLICITAR,
			type : "GET",
			data : { "mono_id" : mono.temp_mono_id, "pagina" : pag },
			success : function(result) {
				$("#js-comentarios").empty().html(result);
				mono.denuncias.setHandlers();
				mono.calificacion.setHandlers();
				mono.paginacion.setHandlers();
			},
			error : function(XHR, estado, error) {
				// fallar silenciosamente					
			}
		}); // ajax	
	} // cargarPagina

}


/***********************************************************************************************************************
 * Main
 */

$(document).bind("ready", function() {
	mono.comentarios.setHandlers();
	mono.paginacion.cargarPagina(1);
	mono.console.log("mono.comentarios listo.");
})

