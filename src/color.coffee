class Color

class RGBColor extends Color
    initialize: (@red, @green, @blue) ->

class HSLColor extends Color
    initialize: (@hue, @sat, @lum) ->

@Painter.Color = Color

