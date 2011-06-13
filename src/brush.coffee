{Color, Layer} = Painter = @Painter

class Mask
    initialize: (@width, @height) ->
        @data = 0 for i in new Array(@width * @height)

    valueAtPoint: (x, y) -> @data[ y * @height + width ]

class Brush
    getMask: (stroke) ->
