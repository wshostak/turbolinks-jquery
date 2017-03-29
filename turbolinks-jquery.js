/*
  turbolinks-jquery.js
  Version: 1.0.1

  == == == == == == == == == == == == == == == == == == == == == == == == == == == == == ==
  jQuery plugin to fix binded / ready event problems caused by Turbolinks5
  Load after jQuery and any jQuery migration scripts but before any scripts using $.on and $.ready
  == == == == == == == == == == == == == == == == == == == == == == == == == == == == == ==
*/

(function($) {
  $.fn.onOld = $.fn.on;

  $.fn.on = function(events, selector, data, handler) {
    var splitEvents = typeof events === 'string' ? events.split(' ') : null;

    if (splitEvents) {
      var args = {
        elem: this.context || this,
        selector: selector,
        data: data,
        handler: handler
      };
      var temp;

      if (typeof args.selector === 'function') {
        temp = args.selector;
        args.selector = args.data;
        args.data = args.handler;
        args.handler = temp;
      }

      if (typeof args.data === 'function') {
        temp = args.data;
        args.data = args.handler;
        args.handler = temp;
      }

      // I am sure not needed but Justin Case.
      if (Array.isArray(args.elem)) args.elem = args.elem[0];

      splitEvents.forEach(function(event) {
        args.namespace = event.split('.');

        var storedEvents = ($._data(args.elem, 'events') || [])[args.namespace.shift()] || [];

        storedEvents.forEach(function(storedEvent) {
          if (
            storedEvent.namespace === args.namespace.sort().join('.') &&
            storedEvent.selector === args.selector &&
            storedEvent.data === args.data &&
            storedEvent.handler.toString() === args.handler.toString()
          ) {
            events = events.replace(event, '').trim();
          }
        });
      });
    }

    return $(this).onOld(events, selector, data, handler);
  };

  $.fn.ready = function(fn) {
    document.addEventListener('turbolinks:load', fn);
    return this;
  };
})(jQuery);
