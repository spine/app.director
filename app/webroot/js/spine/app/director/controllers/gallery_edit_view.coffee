Spine ?= require("spine")
$      = Spine.$

class GalleryEditView extends Spine.Controller
  
  @extend Spine.Controller.KeyEnhancer
  
  elements:
    '.editGallery'    : 'editEl'
    '.optCreate'      : 'createGalleryEl'

  events:
    'click'           : 'click'
    'keydown'         : 'saveOnEnter'
    'click .optCreate': 'createGallery'
    
  template: (item) ->
    $('#editGalleryTemplate').tmpl item

  constructor: ->
    super
    Spine.bind('change:selectedGallery', @proxy @change)
    Gallery.bind "refresh change", @proxy @change

  change: (item, mode) ->
    console.log 'GalleryEditView::change'
    @render()

  render: ->
    console.log 'GalleryEditView::render'
#    return unless @isActive()
    if Gallery.record
      @editEl.html @template Gallery.record
    else
      unless Gallery.count()
        @editEl.html $("#noSelectionTemplate").tmpl({type: '<label class="invite"><span class="enlightened">Director has no gallery yet &nbsp;<button class="optCreate dark large">New Gallery</button></span></label>'})
      else
        @editEl.html $("#noSelectionTemplate").tmpl({type: '<label><span class="enlightened">Select a gallery!</span></label>'})
    @editEl

  saveOnEnter: (e) ->
    console.log 'GalleryEditView::saveOnEnter'
    Spine.trigger('save:gallery', @editEl) if(e.keyCode == 13)
    
  createGallery: ->
    Spine.trigger('create:gallery')
    
  click: (e) ->
    console.log 'click'
    
    e.stopPropagation()
    e.preventDefault()
    false

module?.exports = GalleryEditView