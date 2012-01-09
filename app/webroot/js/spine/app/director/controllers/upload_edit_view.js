var $, UploadEditView;
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
UploadEditView = (function() {
  __extends(UploadEditView, Spine.Controller);
  UploadEditView.prototype.elements = {
    '#fileupload': 'uploadEl',
    '#fileupload .files': 'filesEl'
  };
  UploadEditView.prototype.events = {
    'click': 'click',
    'change select': 'changeSelected',
    'fileuploaddone': 'done',
    'fileuploadsubmit': 'submit',
    'fileuploadadd': 'add'
  };
  UploadEditView.prototype.template = function(item) {
    return $('#fileuploadTemplate').tmpl(item);
  };
  function UploadEditView() {
    UploadEditView.__super__.constructor.apply(this, arguments);
    this.bind("change", this.change);
    Spine.bind('change:selectedAlbum', this.proxy(this.change));
  }
  UploadEditView.prototype.change = function(item) {
    return this.render();
  };
  UploadEditView.prototype.render = function() {
    var album, gallery, selection;
    console.log('UploadView::render');
    selection = Gallery.selectionList();
    gallery = Gallery.record;
    album = Album.record;
    this.html(this.template({
      gallery: gallery,
      album: album
    }));
    this.initFileupload();
    this.refreshElements();
    return this.el;
  };
  UploadEditView.prototype.add = function(e, data) {
    if (Album.record) {
      return this.openPanel('upload', App.showView.btnUpload);
    }
  };
  UploadEditView.prototype.done = function(e, data) {
    var photos;
    console.log('UploadView::done');
    photos = $.parseJSON(data.jqXHR.responseText);
    return Photo.refresh(photos, {
      clear: false
    });
  };
  UploadEditView.prototype.submit = function(e, data) {
    return console.log('UploadView::submit');
  };
  UploadEditView.prototype.initFileupload = function() {
    console.log('UploadEditView::initFileupload');
    return this.uploadEl.fileupload();
  };
  UploadEditView.prototype.fileuploadsend = function(e, data) {
    var redirectPage, target;
    redirectPage = window.location.href.replace(/\/[^\/]*$/, '/result.html?%s');
    if (data.dataType.substr(0, 6) === 'iframe') {
      target = $('<a/>').prop('href', data.url)[0];
      if (window.location.host !== target.host) {
        return data.formData.push({
          name: 'redirect',
          value: redirectPage
        });
      }
    }
  };
  UploadEditView.prototype.changeSelected = function(e) {
    var album, el, id;
    el = $(e.currentTarget);
    id = el.val();
    album = Album.find(id);
    album.updateSelection([album.id]);
    return Spine.trigger('album:activate');
  };
  UploadEditView.prototype.click = function(e) {};
  UploadEditView.prototype.drop = function(e) {
    console.log(e);
    e.stopPropagation();
    return e.preventDefault();
  };
  return UploadEditView;
})();
if (typeof module !== "undefined" && module !== null) {
  module.exports = UploadEditView;
}