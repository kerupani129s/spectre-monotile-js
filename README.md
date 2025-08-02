# spectre-monotile-js

## Demo

[Monotiles: Spectre/Tile(1, 1)](https://kerupani129s.github.io/spectre-monotile-js/)

## Usage

```html
<script src="spectre.js?v=1.0.0"></script>
```

```javascript
// 
const monotiles = new Monotiles();

monotiles.init({
	strict: true,
	width: 520,
	height: 500,
	matrix: new DOMMatrixReadOnly().scale(40).translate(3, 2.5),
});

document.body.appendChild(monotiles.canvas);

// 
monotiles.substitute();

monotiles.render(1);
monotiles.renderChildKeyPoints(1);
```

## Documents

### Monotiles class

```javascript
renderer

matrix

get canvas()

init({
	strict = false,
	width = 300,
	height = 150,
	lineWidth = 2,
	radiusKeyPoint = 5,
	matrix = new DOMMatrixReadOnly().scale(20),
	noFill = false,
	noStrokeQuad = false,
	noRenderCategoryName = true,
} = {})

substitute()

render(categoryID, matrix = new DOMMatrixReadOnly())

renderKeyPoints(categoryID, matrix = new DOMMatrixReadOnly())

renderChildKeyPoints(categoryID, matrix = new DOMMatrixReadOnly())
```

## License

[MIT License](LICENSE)
