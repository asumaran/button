;(function ($, undefined) {

  var pluginName = 'button';
  var storageName = 'plugin_' + pluginName;
  var defaults = {
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
      if (this.isActive()) {
        this.$element.trigger('deactivate');
      } else {
        this.$element.trigger('activate');
      }
    },
    isActive: function () {
      return this.$element.hasClass('active');
    },
    activate: function () {
      this.$element.addClass('active');
      this.$options.onActivate.call(this);
    },
    deactivate: function () {
      this.$element.removeClass('active');
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