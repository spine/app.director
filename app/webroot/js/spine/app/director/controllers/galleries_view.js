var $, GalleriesView;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
if (typeof Spine === "undefined" || Spine === null) {
  Spine = require("spine");
}
$ = Spine.$;
GalleriesView = (function() {
  __extends(GalleriesView, Spine.Controller);
  GalleriesView.extend(Spine.Controller.Drag);
  GalleriesView.prototype.elements = {
    '.items': 'items'
  };
  GalleriesView.prototype.headerTemplate = function(items) {
    return $("#headerGalleryTemplate").tmpl(items);
  };
  GalleriesView.prototype.template = function(items) {
    return $("#galleriesTemplate").tmpl(items);
  };
  function GalleriesView() {
    GalleriesView.__super__.constructor.apply(this, arguments);
    this.el.data({
      current: {
        className: null,
        record: null
      }
    });
    this.list = new GalleriesList({
      el: this.items,
      template: this.template
    });
    this.header.template = this.headerTemplate;
    Gallery.bind('refresh', this.proxy(this.refresh));
    AlbumsPhoto.bind('refresh change', this.proxy(this.change));
    Spine.bind('show:galleries', this.proxy(this.show));
  }
  GalleriesView.prototype.change = function(item, mode) {
    console.log('GalleriesView::change');
    if (item.constructor.className !== 'Gallery') {
      return;
    }
    switch (mode) {
      case 'create':
        return this.create(item);
    }
  };
  GalleriesView.prototype.refresh = function(items) {
    items = Gallery.all().sort(Gallery.nameSort);
    return this.render(items);
  };
  GalleriesView.prototype.render = function(items) {
    console.log('GalleriesView::render');
    if (Gallery.count()) {
      this.list.render(items);
    } else {
      this.html('<label class="invite"><span class="enlightened">This Application has no galleries. &nbsp;<button class="optCreateGallery dark large">New Gallery</button>');
    }
    return this.header.render();
  };
  GalleriesView.prototype.show = function() {
    App.showView.trigger('change:toolbarOne', ['Default']);
    App.showView.trigger('change:toolbarTwo', ['']);
    return App.showView.trigger('canvas', this);
  };
  GalleriesView.prototype.newAttributes = function() {
    if (User.first()) {
      return {
        name: 'New Name',
        user_id: User.first().id
      };
    } else {
      return User.ping();
    }
  };
  GalleriesView.prototype.create = function(e) {
    console.log('GalleriesView::create');
    return Spine.trigger('create:gallery');
  };
  GalleriesView.prototype.destroy = function(e) {
    console.log('GalleriesView::destroy');
    return Spine.trigger('destroy:gallery');
  };
  return GalleriesView;
})();
if (typeof module !== "undefined" && module !== null) {
  module.exports = GalleriesView;
}
