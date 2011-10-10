Spine ?= require("spine")
$      = Spine.$

Spine.Controller.include
  focusFirstInput: (el) ->
    return unless el
    $('input', el).first().focus().select() if el.is(':visible')
    el

  preserveEditorOpen: (controller, target) ->
    App[controller].deactivate()
    target.click()

  isCtrlClick: (e) ->
    e.metaKey or e.ctrlKey or e.altKey

Spine.Controller.extend
  empty: ->
    console.log 'empty'
    @constructor.apply @, arguments

