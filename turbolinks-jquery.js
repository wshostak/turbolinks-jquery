(function($){

  $.fn.onOld = $.fn.on;

  $.fn.on = function (events, selector, data, handler) {

    var splitEvents = events.split(' '),
        args = {
          elem: this.context || this,
          selector: selector,
          data: data,
          handler: handler
        },
        temp;

    if (typeof args.selector == "function") {

      temp = args.selector;
      args.selector = args.data;
      args.data = args.handler;
      args.handler = temp;
    }

    if (typeof args.data == "function") {

      temp = args.data;
      args.data = args.handler;
      args.handler = temp;
    }

    // I am sure not needed but Justin Case.
    if (Array.isArray(args.elem)) args.elem = args.elem[0];

    splitEvents.forEach(function (event) {

      args.namespace = event.split('.');

      (($._data(args.elem, "events") || [])[args.namespace.shift()] || []).forEach(function (storedEvent) {

        if (storedEvent.namespace == args.namespace.sort().join('.') && storedEvent.selector == args.selector  && storedEvent.data == args.data && storedEvent.handler.toString() == args.handler.toString()) {

          events = events.replace(event, '').trim();
        }
      });
    });

    return $(this).onOld(events, selector, data, handler);
  };

  $.fn.ready = function(fn) {

    document.addEventListener('turbolinks:load', fn);
  
  	return this;
  };
})(jQuery);
