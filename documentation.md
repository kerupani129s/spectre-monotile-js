# Documentation

[kerupani129s/spectre-monotile-js - GitHub](https://github.com/kerupani129s/spectre-monotile-js)

## Monotiles class

```javascript
renderer

get canvas()

init({
	strict = false,
	width = 300,
	height = 150,
	matrix = new DOMMatrixReadOnly().scale(20),
	lineWidth = 2,
	radiusKeyPoint = 5,
	noFill = false,
	noStrokeQuad = false,
	noRenderCategoryName = true,
} = {})

substitute()

render(categoryID, matrix = new DOMMatrixReadOnly())

renderKeyPoints(categoryID, matrix = new DOMMatrixReadOnly())

renderChildKeyPoints(categoryID, matrix = new DOMMatrixReadOnly())
```

## Renderer class

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
	matrix = new DOMMatrixReadOnly().scale(20),
	lineWidth = 2,
	radiusKeyPoint = 5,
	noFill = false,
	noStrokeQuad = false,
	noRenderCategoryName = true,
} = {})

clear()

render(tile, matrix = new DOMMatrixReadOnly())

renderKeyPoints(tile, matrix = new DOMMatrixReadOnly())

renderChildKeyPoints(tile, matrix = new DOMMatrixReadOnly())
```
