// TODO: 
// * Hacer que los radiobutton tambien escuchen eventos y puedan
// * y puedan actualizar el estado del botón si es que son "checados" dinámicamente

;(function ($, undefined) {

  var pluginName = 'button';
  var storageName = 'plugin_' + pluginName;
  var defaults = {
    activeClass: 'active',
    behaviour: 'single',
    beforeActivate: function () {},
    onActivate: function () {},
    onDeactivate: function () {}
  };

  // Constructor
  var Button = function (element, options) {
    
    var self = this;

    self.$element = $(element);
    self.$elementData = self.$element.data('button');
    self.$group = self.$elementData ? $(self.$elementData.group) : [];
    self.$options = $.extend({}, defaults, options);
    self.init();

    function option (key, val){
      if (val) {
        self.$options[key] = val;
      } else if(self.$options[key]) {
        return self.$options[key];
      }else if(self[key]){
        // Solo lectura
        return self[key];
      }
    }

    return {
      option: option
    };

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
      
      // Ejecutamos before activate
      this.$options.beforeActivate.call(this);

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

    // Plugin definition based on
    // http://f6design.com/journal/2012/05/06/a-jquery-plugin-boilerplate/
    // If the first parameter is a string, treat this as a call to
    // a public method.
    if (typeof arguments[0] === 'string') {
      var methodName = arguments[0];
      var args = Array.prototype.slice.call(arguments, 1);
      var returnVal;
      this.each(function () {
        // Check that the element has a plugin instance, and that
        // the requested public method exists.
        if ($.data(this, storageName) && typeof $.data(this, storageName)[methodName] === 'function') {
          // Call the method of the Plugin instance, and Pass it
          // the supplied arguments.
          returnVal = $.data(this, storageName)[methodName].apply(this, args);
        } else {
          throw new Error('Method ' + methodName + ' does not exist on jQuery.' + pluginName);
        }
      });
      if (returnVal !== undefined) {
        // If the method returned a value, return the value.
        return returnVal;
      } else {
        // Otherwise, returning 'this' preserves chainability.
        return this;
      }
      // If the first parameter is an object (options), or was omitted,
      // instantiate a new instance of the plugin.
    } else if (typeof options === "object" || !options) {
      return this.each(function () {
        // Only allow the plugin to be instantiated once.
        if (!$.data(this, storageName)) {
          // Pass options to Plugin constructor, and store Plugin
          // instance in the elements jQuery data object.
          $.data(this, storageName, new Button(this, options));
        }
      });
    }
  };
  
})(jQuery);
