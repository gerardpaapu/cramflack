class Paintbrush extends Tool
    draw: (layer, mask) ->
        l = @currentLayer
        working_layer = new Layer l.width, l.height
        working_layer.blending_mode = @blending_mode
        working_layer.fill @color, mask
        l.merge working_layer
