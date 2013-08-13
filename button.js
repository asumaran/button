// TODO: 
// * Hacer que los radiobutton tambien escuchen eventos y puedan
// * y puedan actualizar el estado del botón si es que son "checados" dinámicamente

;(function ($, undefined) {

  var pluginName = 'button';
  var storageName = 'plugin_' + pluginName;
  var defaults = {
    activeClass: 'active',
    behaviour: 'single',
    onActivate: function () {},
    onDeactivate: function () {}
  };

  // Constructor
  var Button = function (element, options) {
    this.$element = $(element);
    this.$options = $.extend({}, defaults, options);
    this.init();
  };

  Button.prototype = {
    init: function () {
      this.setBindings();
    },
    setBindings: function () {

      var self = this;

      this.$element.on('click.' + pluginName, function (e) {
        e.preventDefault();
        self.click();
      });

      this.$element.on('activate.' + pluginName, function (e) {
        self.activate();
      });

      this.$element.on('deactivate.' + pluginName, function (e) {
        self.deactivate();
      });

    },
    click: function () {

      var $elementData = this.$element.data('button');
      var behaviour = ($elementData && $elementData.behaviour) ? $elementData.behaviour : 'single';

      switch(behaviour) {
        case 'radiobutton':
          console.log('radiobutton case');

          // Deseleccionamos todos los demás radiobutton del grupo
          $($elementData.group).not(this.$element).trigger('deactivate');

          // Activamos al que se le hizo click
          this.$element.trigger('activate');
          break;
        case 'checkbox':
        case 'single':
          console.log('checkbox case');
          if(this.isActive()){
            console.log('trigger: Deactivate');
            this.$element.trigger('deactivate');
          }else{
            console.log('trigger: Activate');
            this.$element.trigger('activate');
          }
          break;
      }
    },
    isActive: function () {
      return this.$element.hasClass(this.$options.activeClass);
    },
    activate: function () {
      console.log('Activate method');

      var $elementData = this.$element.data('button');
      var behaviour = ($elementData && $elementData.behaviour) ? $elementData.behaviour : 'single';

      // Manejamos los input relacionados
      if( behaviour == 'radiobutton' ){

        // Radiobutton
        // Seleccionamos el radio button correspondiente
        $($elementData.input).removeAttr('checked');
        $($elementData.input + '[value="' + $elementData.value + '"]').prop({
          'checked': true
        });

      }else if( behaviour == 'checkbox'  ){

        // Checkbox
        $($elementData.input + '[value="' + $elementData.value + '"]').prop({
          'checked': true
        });
      }
      
      // Añadimos clase para estado
      this.$element.addClass(this.$options.activeClass);

      // Ejecutamos callback
      this.$options.onActivate.call(this);
    },
    deactivate: function () {
      console.log('Deactivate method');

      var $elementData = this.$element.data('button');
      var behaviour = ($elementData && $elementData.behaviour) ? $elementData.behaviour : 'single';
      
      if( behaviour == 'radiobutton' ){
        $($elementData.input + '[value="' + $elementData.value + '"]').removeAttr('checked');
      }else if(  behaviour == 'checkbox' ){

        // Quitamos check
        $($elementData.input + '[value="' + $elementData.value + '"]').prop({
          checked: false
        });
      }

      // Añadimos clase para estado
      this.$element.removeClass(this.$options.activeClass);

      // Ejecutamos callback
      this.$options.onDeactivate.call(this);
    }

  }

  $.fn[pluginName] = function (options) {

    return this.each(function () {

      // Obtenemos instancia del elemento actual si es que la hay
      // para ser usado en las validaciones que siguen
      var pluginInstance = $.data(this, storageName);
      // Definimos lo que queremos ejecutar
      if (typeof options === 'object' || options === 'init' || !options) {
        // Este caso será para cuando se llame al plugin o se llame al método init 
        // o cuando realmente se esté pasando un objeto que serán los defaults

        // Prevenimos multiple instancias
        if (!$.data(this, "plugin_" + pluginName)) {
          // Si no tiene definida la propiedad entonces quiere decir
          // que no ha sido inicializado el plugin en este elemento
          // entonces creamos la propiedad y inicializamos el plugin en este elemento
          $.data(this, "plugin_" + pluginName, new Button(this, options));
        } else {
          $.error('Plugin is already initialized for this object.');
          return;
        }
      } else if (pluginInstance[options]) {
        // Este caso será si es que se está tratando de llamar un método directamente del plugin
        var method = options;

        // El primer argumento fue el nombre del método
        options = Array.prototype.slice.call(arguments, 1);

        // Ejecutamos el método
        pluginInstance[method](options);
      } else {
        $.error('Method ' + options + ' does not exist on jQuery.' + pluginName + '.');
        return;
      }
    });
  }
})(jQuery);
