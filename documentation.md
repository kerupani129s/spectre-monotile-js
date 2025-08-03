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
