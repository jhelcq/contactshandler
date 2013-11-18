var Contacto = Backbone.Model.extend({
  initialize: function(){
    this.bind( 'change', function( model, options ) {});
    this.bind( 'invalid', function( model, error ) {});
    this.bind('request', function( model, xhr, options ) {});
    this.bind('sync', function( model, resp, options ) {});
  },

  defaults: {
    id: null,
    nombre: '',
    telefono: 0 
  },

	idAttribute: 'id',

  validate: function(attrs){
    if (attrs.nombre == ''){
        return "Nombre inválido!";
    }

    if (attrs.telefono == '' || attrs.telefono <= 0){
        return "Teléfono inválido!";
    }
  }
});
