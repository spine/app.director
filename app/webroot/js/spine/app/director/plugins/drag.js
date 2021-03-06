var $, Controller;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
if (typeof Spine === "undefined" || Spine === null) {
  Spine = require("spine");
}
$ = Spine.$;
Controller = Spine.Controller;
Controller.Drag = {
  extended: function() {
    var Include;
    Include = {
      init: function() {
        return Spine.dragItem = null;
      },
      dragstart: __bind(function(e, data) {
        var el, event, parentDataElement, _ref, _ref2, _ref3, _ref4, _ref5;
        el = $(e.target);
        el.addClass('dragged');
        Spine.dragItem = {};
        Spine.dragItem.el = el;
        Spine.dragItem.source = el.item();
        parentDataElement = $(e.target).parents('.parent.data');
        Spine.dragItem.origin = ((_ref = parentDataElement.data()) != null ? (_ref2 = _ref.tmplItem) != null ? _ref2.data : void 0 : void 0) || ((_ref3 = parentDataElement.data()) != null ? _ref3.current.record : void 0);
        event = e.originalEvent;
        if ((_ref4 = event.dataTransfer) != null) {
          _ref4.effectAllowed = 'move';
        }
        if ((_ref5 = event.dataTransfer) != null) {
          _ref5.setData('text/html', Spine.dragItem);
        }
        return Spine.trigger('drag:start', e, this);
      }, this),
      dragenter: function(e, data) {
        var func;
        func = function() {
          return Spine.trigger('drag:timeout', e);
        };
        clearTimeout(Spine.timer);
        Spine.timer = setTimeout(func, 1000);
        return Spine.trigger('drag:enter', e, this);
      },
      dragover: function(e, data) {
        var event, _ref;
        event = e.originalEvent;
        event.stopPropagation();
        event.preventDefault();
        if ((_ref = event.dataTransfer) != null) {
          _ref.dropEffect = 'move';
        }
        return Spine.trigger('drag:over', e, this);
      },
      dragleave: function(e, data) {
        return Spine.trigger('drag:leave', e, this);
      },
      dragend: function(e, data) {
        return $(e.target).removeClass('dragged');
      },
      drop: __bind(function(e, data) {
        var event, _ref;
        clearTimeout(Spine.timer);
        event = e.originalEvent;
        if ((_ref = Spine.dragItem) != null) {
          _ref.el.removeClass('dragged');
        }
        return Spine.trigger('drag:drop', e, data);
      }, this)
    };
    return this.include(Include);
  }
};
