var $, AlbumsView;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
if (typeof Spine === "undefined" || Spine === null) {
  Spine = require("spine");
}
$ = Spine.$;
AlbumsView = (function() {
  __extends(AlbumsView, Spine.Controller);
  AlbumsView.extend(Spine.Controller.Drag);
  AlbumsView.prototype.elements = {
    '.hoverinfo': 'infoEl',
    '.items': 'items'
  };
  AlbumsView.prototype.events = {
    'dragstart  .items .thumbnail': 'dragstart',
    'dragover   .items': 'dragover',
    'drop       .items': 'drop'
  };
  AlbumsView.prototype.albumsTemplate = function(items, options) {
    return $("#albumsTemplate").tmpl(items, options);
  };
  AlbumsView.prototype.headerTemplate = function(items) {
    return $("#headerAlbumTemplate").tmpl(items);
  };
  AlbumsView.prototype.infoTemplate = function(item) {
    return $('#albumInfoTemplate').tmpl(item);
  };
  function AlbumsView() {
    AlbumsView.__super__.constructor.apply(this, arguments);
    this.el.data({
      current: Gallery
    });
    this.info = new Info({
      el: this.infoEl,
      template: this.infoTemplate
    });
    this.list = new AlbumsList({
      el: this.items,
      template: this.albumsTemplate,
      info: this.info,
      parent: this
    });
    this.header.template = this.headerTemplate;
    this.filterOptions = {
      key: 'gallery_id',
      joinTable: 'GalleriesAlbum',
      sorted: true
    };
    Spine.bind('show:albums', this.proxy(this.show));
    this.bind('show:allAlbums', this.proxy(this.renderAll));
    Spine.bind('create:album', this.proxy(this.create));
    Spine.bind('destroy:album', this.proxy(this.destroy));
    Album.bind('ajaxError', Album.errorHandler);
    Album.bind('destroy:join', this.proxy(this.destroyJoin));
    Album.bind('create:join', this.proxy(this.createJoin));
    Album.bind('update destroy', this.proxy(this.change));
    GalleriesAlbum.bind('change', this.proxy(this.renderHeader));
    GalleriesAlbum.bind('change', this.proxy(this.change));
    Spine.bind('change:selectedGallery', this.proxy(this.change));
    Spine.bind('change:selectedGallery', this.proxy(this.renderHeader));
    Gallery.bind('refresh change', this.proxy(this.renderHeader));
    Spine.bind('loading:start', this.proxy(this.loadingStart));
    Spine.bind('loading:done', this.proxy(this.loadingDone));
    $(this.views).queue('fx');
  }
  AlbumsView.prototype.change = function(item, changed) {
    var items;
    console.log('AlbumsView::change');
    if ((item.constructor.className === 'GalleriesAlbum') && (changed === 'update')) {
      return;
    }
    if (changed && this.parent.allAlbums) {
      this.parent.toggleShowAllAlbums();
    }
    if (!this.list.loadtest()) {
      alert('stop');
      return;
    }
    items = Album.filterRelated(Gallery.record.id, this.filterOptions);
    return this.render(items);
  };
  AlbumsView.prototype.renderAll = function() {
    App.showView.canvasManager.change(this);
    return this.render(Album.filter());
  };
  AlbumsView.prototype.render = function(items, mode) {
    var list;
    console.log('AlbumsView::render');
    list = this.list.render(items, mode);
    list.sortable('album');
    this.header.render();
    if (items && items.constructor.className === 'GalleriesAlbum' && item.destroyed) {
      this.show();
    }
    return Spine.trigger('album:activate');
  };
  AlbumsView.prototype.renderHeader = function() {
    console.log('AlbumsView::renderHeader');
    return this.header.change(Gallery.record);
  };
  AlbumsView.prototype.show = function(idOrRecord) {
    var alb, albums, _i, _len, _results;
    App.showView.trigger('change:toolbarOne', ['Default']);
    App.showView.trigger('change:toolbarTwo', ['Slideshow']);
    App.showView.trigger('canvas', this);
    albums = GalleriesAlbum.albums(Gallery.record.id);
    _results = [];
    for (_i = 0, _len = albums.length; _i < _len; _i++) {
      alb = albums[_i];
      _results.push(alb.invalid ? (alb.invalid = false, alb.save({
        ajax: false
      })) : void 0);
    }
    return _results;
  };
  AlbumsView.prototype.newAttributes = function() {
    if (User.first()) {
      return {
        title: 'New Album',
        invalid: false,
        user_id: User.first().id,
        order: Album.count()
      };
    } else {
      return User.ping();
    }
  };
  AlbumsView.prototype.create = function(list, options) {
    var album, cb;
    console.log('AlbumsView::create');
    if (list) {
      cb = __bind(function() {
        var album, gallery;
        album = Album.last();
        gallery = Gallery.record;
        if (gallery) {
          album.createJoin(gallery);
        }
        Photo.trigger('create:join', list, album);
        if ((options != null ? options.origin : void 0) != null) {
          Photo.trigger('destroy:join', list, options['origin']);
        }
        if (Gallery.record) {
          this.navigate('/gallery', Gallery.record.id);
        } else {
          this.navigate('/gallery', null + '/' + album.id);
        }
        album.updateSelection([album.id]);
        return Spine.trigger('album:activate');
      }, this);
    } else {
      cb = function() {
        if (Gallery.record) {
          this.createJoin(Gallery.record);
          album.updateSelection([this.id]);
          Spine.trigger('album:activate');
          return App.navigate('/gallery', Gallery.record.id);
        } else {
          return App.navigate('/galleries/');
        }
      };
    }
    album = new Album(this.newAttributes());
    return album.save({
      success: cb
    });
  };
  AlbumsView.prototype.destroy = function() {
    var album, albums, ga, gallery, gas, list, photos, _i, _j, _k, _len, _len2, _len3, _results;
    console.log('AlbumsView::destroy');
    list = Gallery.selectionList().slice(0);
    albums = [];
    Album.each(__bind(function(record) {
      if (list.indexOf(record.id) !== -1) {
        return albums.push(record);
      }
    }, this));
    if (Gallery.record) {
      Gallery.emptySelection();
      return Album.trigger('destroy:join', albums, Gallery.record);
    } else {
      for (_i = 0, _len = albums.length; _i < _len; _i++) {
        album = albums[_i];
        gas = GalleriesAlbum.filter(album.id, {
          key: 'album_id'
        });
        for (_j = 0, _len2 = gas.length; _j < _len2; _j++) {
          ga = gas[_j];
          gallery = Gallery.exists(ga.gallery_id);
          photos = AlbumsPhoto.photos(album.id);
          Spine.Ajax.disable(function() {
            return Photo.trigger('destroy:join', photos, album);
          });
          Spine.Ajax.disable(function() {
            if (gallery) {
              return Album.trigger('destroy:join', album, gallery);
            }
          });
        }
      }
      _results = [];
      for (_k = 0, _len3 = albums.length; _k < _len3; _k++) {
        album = albums[_k];
        Gallery.removeFromSelection(album.id);
        _results.push(album.destroy());
      }
      return _results;
    }
  };
  AlbumsView.prototype.createJoin = function(albums, target) {
    var album, _i, _len;
    if (albums == null) {
      albums = [];
    }
    if (target == null) {
      target = Gallery.record;
    }
    if (!(target && target.constructor.className === 'Gallery')) {
      return;
    }
    for (_i = 0, _len = albums.length; _i < _len; _i++) {
      album = albums[_i];
      album.createJoin(target);
    }
    return Spine.trigger('album:activate');
  };
  AlbumsView.prototype.destroyJoin = function(albums, target) {
    var album, _i, _len, _results;
    if (!(target && target.constructor.className === 'Gallery')) {
      return;
    }
    _results = [];
    for (_i = 0, _len = albums.length; _i < _len; _i++) {
      album = albums[_i];
      _results.push(album.destroyJoin(target));
    }
    return _results;
  };
  AlbumsView.prototype.loadingStart = function(album) {
    var el, queue;
    el = this.items.children().forItem(album);
    el.addClass('loading');
    if (!el.data()['queue']) {
      queue = el.data()['queue'] = [];
      queue.push({});
    } else {
      queue = el.data()['queue'];
      queue.push({});
    }
    return console.log(queue);
  };
  AlbumsView.prototype.loadingDone = function(album) {
    var el;
    el = this.items.children().forItem(album);
    el.data().queue.splice(0, 1);
    if (!el.data().queue.length) {
      return el.removeClass('loading');
    }
  };
  return AlbumsView;
})();
if (typeof module !== "undefined" && module !== null) {
  module.exports = AlbumsView;
}
