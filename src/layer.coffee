makeContext = (width, height) ->
    canvas = document.createElement 'canvas'
    canvas.width = width
    canvas.height = height
    canvas.getContext '2d'

class Layer
    initialize: (@width, @height) ->
        @context = makeContext @width, @height

    clear: -> @context.clearRect 0, 0, @width, @height

    visible: true

    opacity: 1.0

class LayerStack
    initialize: (@top, @rest) ->

    getMergedData: ->
        # oh yeah, do that shit
