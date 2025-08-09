# Documentation

[kerupani129s/spectre-monotile-js - GitHub](https://github.com/kerupani129s/spectre-monotile-js)

## Maths

### Matrix class

```javascript
static get IDENTITY()
static get FLIPPING()

static extractScale(matrix)
```

## Rendering

### Renderer class

```javascript
context

matrix

radiusKeyPoint

noFill
noStrokeQuad

get canvas()

get width()

get height()

init({
	width = 300,
	height = 150,
	matrix = Matrix.IDENTITY.scale(20),
	lineWidth = 2,
	radiusKeyPoint = 5,
	noFill = false,
	noStrokeQuad = false,
} = {})

clear()

render(tile, matrix = Matrix.IDENTITY)

renderKeyPoints(tile, matrix = Matrix.IDENTITY)
renderChildKeyPoints(supertile, matrix = Matrix.IDENTITY)

renderCategoryName(tile, matrix = Matrix.IDENTITY)
renderChildCategoryNames(supertile, matrix = Matrix.IDENTITY)
renderCategoryNames(tile, matrix = Matrix.IDENTITY)

async extractImage({ type, quality } = {})
```

## Edges

### EdgeShape class

```javascript
static get LINE()
static get BEZIER_CURVE()
```

## Tiles

### Tile class

```javascript
get categoryID()
get categoryName()
```

### Supertile class

Inheritance: `Tile`

### Spectre class

Inheritance: `Tile`

```javascript
static get points()

constructor({ categoryID = 1, edgeShape = EdgeShape.LINE })
```

### Mystic class

Inheritance: `Tile`

```javascript
constructor({ edgeShape = EdgeShape.LINE })
```

### Hexagon class

Inheritance: `Tile`

```javascript
static get points()

constructor({ categoryID = 1 })
```

## Tiling

### Tiling class

```javascript
static get length()

static createSpectres(edgeShape = EdgeShape.LINE)
static createHexagons()

get(categoryID)

substitute()
```
