function ClienteContactos( idContenedor ) {
	this.contactos= new Contactos();
	this.templateContactos= Handlebars.compile( $('#plantillaContenidoContactos').html() );

	_.extend(this, Backbone.Events);

	this.eventosYFuncionesPrimitivas(); //asignacion de eventos y ejecucion de funciones(estas se ejecutaran solo la primera vez) que perduran siempre
	// this.inicializarValoresPorDefectoDelFormulario(); //valores por defecto del formulario
}

ClienteContactos.prototype= {
	iniciar: function() {
		this.contactos.iniciar();
		// console.log('Iniciamos una vez mas!!!');
	},

	inicializarValoresPorDefectoDelFormulario: function(){
	},

	eventosYFuncionesPrimitivas: function ( contactos ) {
		var actual= this;
		var tempContacto= new Contacto();

		$('#footerPrimeraPantalla #nuevo').click(function() {
			$('#primeraPantalla').css('display','none');
			$('#segundaPantalla').css('display','block');

			//borramos los campos de datos del nuevo contacto
			var nombre= $('#nombre').val('');
			var telefono= $('#telefono').val('');
		});

		$('#footerPrimeraPantalla #borrarTodos').click(function() {});

		$('#footerSegundaPantalla #adicionar').click(function() {
			//se reinicia los datos del contacto temporal
			tempContacto.set({
				nombre: '',
				telefono: 0
			},{
				silent: true //no se emitira evento change, tampoco se hara una validacion
			});

			//colocan los datos del nuevo contacto
			var nombre= $('#nombre').val();
			var telefono= $('#telefono').val();
			tempContacto.set({
				nombre: nombre,
				telefono: telefono
			},{
				validate: true //se emitira el evento change, si es que la validacion es correcta
			});
		});

		$('#footerSegundaPantalla #regresar').click(function regresarPrimeraPantalla() {
			$('#segundaPantalla').css('display','none');			
			$('#primeraPantalla').css('display','block');	
			$('#contenidoPrimeraPantalla').html( actual.templateContactos( actual.contactos.toJSON() ) ); //volvemos a mostrar todos los contactos
		});
		
		$('#primeraPantalla #notificacionListaContactos #aceptar').click(function() {
			$('#primeraPantalla #notificacionListaContactos').css('display','none');	
			$('#primeraPantalla').css('display','block');			
		});
		
		$('#segundaPantalla #notificacionDatosInvalidos #aceptar').click(function() {
			$('#segundaPantalla #notificacionDatosInvalidos').css('display','none');	
		});

		$('#segundaPantalla #notificacionOperacionAdicion #aceptar').click(function() {
			$('#segundaPantalla #notificacionOperacionAdicion').css('display','none');	
			$('#segundaPantalla').css('display','none');			
			$('#primeraPantalla').css('display','block');	
			$('#contenidoPrimeraPantalla').html( actual.templateContactos( actual.contactos.toJSON() ) ); //volvemos a mostrar todos los contactos
		});

		this.listenTo( this.contactos, 'terminoIniciar', function(estado, mensaje) {
			if(estado=='seCargo')
				$('#primeraPantalla #contenidoPrimeraPantalla').html( actual.templateContactos( actual.contactos.toJSON() ) );
			else{
				$('#primeraPantalla #notificacionListaContactos p').text( mensaje );	
				$('#primeraPantalla #notificacionListaContactos').css('display','block');	
			}
		});

		this.listenTo( tempContacto, 'invalid', function( contacto, error ) {//se ejecuta si el nuevo contacto datos invalidos
			$('#segundaPantalla #notificacionDatosInvalidos p').text(error);	
			$('#segundaPantalla #notificacionDatosInvalidos').css('display','block');	
			// console.log(error);
		});

		this.contactos.listenTo( tempContacto, 'change', this.contactos.adicionar );//se ejecuta si el nuevo contacto tiene datos validos y se adicionar al libro de contactos

		this.listenTo( this.contactos, 'terminoAdicionar', function( estado, mensaje ) {
			if(estado== 'seAdiciono')
				$('#segundaPantalla #notificacionOperacionAdicion h1').text( 'Ok' );	
			else
				$('#segundaPantalla #notificacionOperacionAdicion h1').text( 'Error' );	
			$('#segundaPantalla #notificacionOperacionAdicion p').text( mensaje );	
			$('#segundaPantalla #notificacionOperacionAdicion').css('display','block');	
		});
	}
};