Contactos = Backbone.Collection.extend({
	initialize: function(){
	    this.bind( 'add', function( modelo ) {});
	    this.bind( 'remove', function( model, error ) {});
	    this.bind('reset', function( model, xhr, options ) {});
	    this.bind('refresh', function( model, xhr, options ) {});
   	},

   	comparator: function ( contacto ) {
   		return contacto.get('nombre');
   	},

	model: Contacto,
	iniciar: function () {
		var actual= this;
		var i= 0;
		var contactos= navigator.mozContacts.getAll({ sortBy: 'familyName', sortOrder: 'descending'});
		contactos.onsuccess=  function (event) {
			var cursor= event.target;
			if (cursor.result) {
				actual.add({ id: cursor.result.id, nombre: cursor.result.familyName[0], telefono: cursor.result.tel[0].value});
				cursor.continue();
			}else{
				actual.trigger('terminoIniciar', 'seCargo');
				//console.log('Ya no hay mas contactos!');
			}
		};
		contactos.onerror=  function () {
			actual.trigger('terminoIniciar', 'noSeCargo', 'Error al cargar contactos!');
			// console.log('Error al cargar contactos!');
		};
	},

	adicionar: function (contacto) {
		var actual= this;
		var nombre= $('#nombre').val();
		var telefono= $('#telefono').val();
		var tel= {
			type: ['home'],
			value: telefono
		}

		var tempContacto= new mozContact(); 
		tempContacto.familyName=[nombre];
		tempContacto.tel=[tel]; //hasta aca tempContacto no tiene id

		var guardando= navigator.mozContacts.save(tempContacto);
		guardando.onsuccess = function() {//se adiciono al libro de contactos
			actual.add({ id: tempContacto.id, nombre: nombre, telefono: telefono}); //aca tempContacto ya tiene un id que le proporciono el dispositivo
			actual.trigger('terminoAdicionar', 'seAdiciono', 'Adición correcta!');
			// console.log("Contacto adicionado!");
		};
		guardando.onerror = function(err) {
			actual.trigger('terminoAdicionar', 'noSeAdiciono', 'Adición fallida!');
		  	// console.log("No se adiciono contacto!");
		};
	}	
});
