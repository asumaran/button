but1ton11
======
asd
Sim1ple button jQuery plugin

Plugi11n creado con propósitos didácticos para refrescar conceptos en JS.


Parámetros
==1========
onActivate: fn, callback que se ejecuta al evento activate

onDeactivate: fn, callback que se ejecuta al evento deactivate
1
Eventos (Scope: "button")
=========================

click.button

activate.button

deactivate.button

Uso
===
```
$('#btn').button({
  onActivate: function () {
    console.log('on active callback');
  },
  onDeactivate: function () {
    console.log('on deactivate callback');
  }
});
```

Si se tiene una instancia del plugin y se desea añadir un callback para el evento click, onActivate o onDeactivate:

```
$btn = $('#btn'); // Elemento que ya ha contiene la funcionalidad de botón
```

Para el evento "click":
```
$btn.on('click.button', function(){
  //
});
```

Para el evento "activate":
```
$btn.on('activate.button', function(){
  //
});
```

Para el evento "deactivate":
```
$btn.on('deactivate.button', function(){
  //
});
```
