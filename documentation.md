# Documentation

[kerupani129s/spectre-monotile-js - GitHub](https://github.com/kerupani129s/spectre-monotile-js)

## Maths

### Matrix class

```javascript
static get IDENTITY()
static get FLIPPING()

static decomposeScale(matrix)
```

## Rendering

### Renderer class

```javascript
context

matrix

radiusKeyPoint

noFill
noStrokeQuad
noRenderCategoryName

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
	noRenderCategoryName = true,
} = {})

clear()

render(tile, matrix = Matrix.IDENTITY)

renderKeyPoints(tile, matrix = Matrix.IDENTITY)

renderChildKeyPoints(tile, matrix = Matrix.IDENTITY)

async extractImage({ type, quality } = {})
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

constructor(categoryID, strict = false)
```

### Mystic class

Inheritance: `Tile`

```javascript
constructor(strict = false)
```

## Tiling

### Tiling class

```javascript
static get length()

static createSpectres(strict = false)

get(categoryID)

substitute()
```
