$.fn.sortable = function(type) {
  return $(this).Html5Sortable({
    type: type,
    drop: function(source, target) {
      return true;
    }
  });
};
$.Html5Sortable = function() {
  return $.Html5Sortable.s_currentID = Math.floor(Math.random() * 10000001);
};
$.Html5Sortable.DRAGANDDROP_DEFAULT_TYPE = "de.webpremiere.html5sortable";
$.Html5Sortable.s_currentID = 0;
$.Html5Sortable.defaultOptions = {
  dragTarget: function(source) {
    return $(source);
  },
  text: function(source) {
    return $('<div></div>').append($(source).clone(true)).html();
  },
  css: function(source) {
    var el;
    el = $(source);
    return {
      'height': el.css('height'),
      'padding-top': el.css('padding-top'),
      'padding-bottom': el.css('padding-bottom'),
      'margin-top': el.css('margin-top'),
      'margin-bottom': el.css('margin-bottom')
    };
  },
  klass: function(source) {
    return 'html5sortable-state-highlight';
  },
  splitter: function(source) {
    return ($($('li.' + this.klass())[0] || $('<li class="' + this.klass() + '"></li>'))).css(this.css(source));
  },
  type: $.Html5Sortable.DRAGANDDROP_DEFAULT_TYPE,
  drop: function(source, target) {
    return false;
  }
};
$.fn.Html5Sortable = function(opts) {
  var options;
  options = $.extend({}, $.Html5Sortable.defaultOptions, opts);
  $.Html5Sortable.s_currentID++;
  if (options.type === $.Html5Sortable.DRAGANDDROP_DEFAULT_TYPE) {
    options.type = options.type + '_' + $.Html5Sortable.s_currentID;
  }
  return this.each(function() {
    var that;
    that = $(this);
    that.init = function(el) {
      return options.dragTarget(el).attr('draggable', true).bind('dragstart', function(e) {
        var dt;
        dt = e.originalEvent.dataTransfer;
        dt.effectAllowed = 'move';
        dt.setData('Text', JSON.stringify({
          html: options.text(el),
          type: options.type
        }));
        Spine.sortItem = {
          el: el,
          data: el.data(),
          splitter: options.splitter(this),
          cond: null
        };
        $('._dragging').removeClass('_dragging');
        return el.addClass('_dragging out');
      }).bind('dragend', function(e) {
        var _ref;
        console.log('Sort::dragend');
        $('._dragging').removeClass('_dragging');
        if ((_ref = Spine.sortItem.el) != null) {
          _ref.addClass('in').removeClass('out');
        }
        return Spine.sortItem.splitter.remove();
      }).bind('dragenter', function(e) {
        var cond;
        if (!Spine.sortItem) {
          return;
        }
        Spine.sortItem.cond = cond = (e.originalEvent.pageX - $(this).position().left) > ($(this).width());
        if (cond) {
          Spine.sortItem.splitter.insertAfter(this);
        } else {
          Spine.sortItem.splitter.insertBefore(this);
        }
        return false;
      }).bind('dragleave', function(e) {
        try {
          if (!(e.originalEvent.dataTransfer.getData('Text') && JSON.parse(e.originalEvent.dataTransfer.getData('Text')).type === options.type)) {
            return true;
          }
        } catch (e) {
          return true;
        }
        return false;
      }).bind('drop', function(e) {
        var cond, it, model, sourceEl;
        try {
          console.log('Sort::drop');
          cond = Spine.sortItem.cond;
          if (!(JSON.parse(e.originalEvent.dataTransfer.getData('Text')).type === options.type)) {
            return true;
          }
        } catch (e) {
          return true;
        }
        sourceEl = $('._dragging');
        Spine.sortItem.splitter.remove();
        it = $(JSON.parse(e.originalEvent.dataTransfer.getData('Text')).html).addClass('out');
        it.data(Spine.sortItem.data);
        model = $(it).item().constructor.className;
        if (!options.drop(sourceEl.get(0), it.get(0))) {
          return it.remove();
        } else {
          if (cond) {
            it.insertAfter(this);
          } else {
            it.insertBefore(this);
          }
          sourceEl.remove();
          that.init(it);
          it.addClass('in');
          $('._dragging').removeClass('_dragging');
          it.removeClass('out');
          return Spine.Model[model].trigger('sortupdate', e, it);
        }
      });
    };
    return that.children('li').each(function() {
      return that.init($(this));
    });
  });
};
