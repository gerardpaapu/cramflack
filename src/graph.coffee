class Flat 
    data: null # ImageData 
    width: 0   # Positive Integer
    height: 0  # Positive Integer
    top: 0     # Integer
    left: 0    # Integer

class Edge
    # represents a non-destructive transform 
    # apply: Chain -> Chain

class Layer extends Chain
    transforms: []
    stack: [] 

class Chain
    getFlat: -> null

    _dirty: yes  # is the cache out of date?
    _cache: null # Flat

    # remove: Index -> EdgeChain
    # throws RangeError
    remove: (i) ->        

    # replace: Index, Edge -> Chain
    # throws RangeError
    replace: (i, edge) -> 

    # update: Index, Function -> EdgeChain
    # throws RangeError
    update: (i, fn) ->
    
    # append: Edge -> Chain
    append: (edge) ->     

    # prepend: Edge -> Chain
    prepend: (node) ->     

class EmptyChain extends Chain
