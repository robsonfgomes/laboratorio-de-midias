var webpix = ( function(){

	var webpix = {
				
		canvas: null,
		ctx: null,
		ligada: false,

		init: function() {

			// Eventos
			// -------

			webpix.pedePermissaoParaUsoCamera()			

			//
			$( '.controle-gatilho' ).click( function( event ) {
				event.preventDefault();

				webpix.tirarFoto();
			} )

			//
			$( '.controle-download' ).click( function( event ) {				
				return webpix.download();
			} )

			//
			$( '.controles' ).on(
				'click',
				'.controle-download.controle-botao-disabled',
				function( event ) {
					event.preventDefault();
			} )

			//
			$( '.controle-lixeira' ).click( function( event ) {				
				webpix.lixeira();
			} )

			return this
		},

		pedePermissaoParaUsoCamera: function() {
			navigator.webkitGetUserMedia(
				{ video: true },
				webpix.iniciaStream,
				webpix.permissaoNegada
			)
		},

		iniciaStream: function( stream ) {
			//
			$( '.dialogo' ).animate( { top: '-620px' }, 400 )
			$( '.juarez' ).animate( { bottom: '-290px' }, 400, function(){
				$( '.permissao' ).remove()
			} )

			// mostra o vídeo após um determinado tempo para que a
			// transição dos controles ocorra suave
			setTimeout( function() {
				webpix.ligada = true
				$( '.controle-gatilho' )
					.removeClass( 'controle-botao-disabled' )
				$( 'video' )
					.show()
					.attr(
						'src',
						window.webkitURL.createObjectURL( stream ) )
			}, 400)

		},

		permissaoNegada: function() {
			alert(
				'É necessário que você habilite o acesso a câmera ' +
				'para que o experimento funcione')
		},
				

		tirarFoto: function() {

			if( !this.ligada ) return

			this.canvas = $( 'canvas' )[0]
			this.canvas.width = $( 'video' )[0].videoWidth
			this.canvas.height = $( 'video' )[0].videoHeight
			this.ctx = this.canvas.getContext( '2d' )
			this.ctx.drawImage( $( 'video' )[0], 0, 0 )
			this.atualizaFoto()

			$( '.fotoOriginal' ).attr( 'src', this.canvas.toDataURL('image/png') )
			$( 'video' ).hide()

			// atualiza controles
			$( '.controle-gatilho' )
				.addClass( 'controle-botao-disabled' )
			$( '.controle-download' )
				.removeClass( 'controle-botao-disabled' )
			$( '.controle-lixeira' )
				.removeClass( 'controle-botao-disabled' )
			$( '.efeito-prev' )
				.removeClass( 'controle-botao-disabled' )
			$( '.efeito-next' )
				.removeClass( 'controle-botao-disabled' )
		},

		atualizaFoto: function(){

			$( '.foto' )
				.attr( 'src', this.canvas.toDataURL('image/png') )
				.show()
			$( '.controle-download' )
				.attr( 'href', this.canvas.toDataURL('image/png') )
		},
		

		lixeira: function() {

			if( !this.ligada ) return

			$( '.foto' )
				.attr( 'src', '' )
				.hide()
			$( 'video' )
				.show()

			// atualiza controles
			$( '.controle-gatilho' )
				.removeClass( 'controle-botao-disabled' )
			$( '.controle-download' )
				.addClass( 'controle-botao-disabled' )
			$( '.controle-lixeira' )
				.addClass( 'controle-botao-disabled' )
			$( '.efeito-prev' )
				.addClass( 'controle-botao-disabled' )
			$( '.efeito-next' )
				.addClass( 'controle-botao-disabled' )
		},

		download: function(){

			var src = $( '.foto' ).attr( 'src' )
			return this.ligada && src != "" && src != null && src != undefined
		}
	}

	return webpix.init()
})()
