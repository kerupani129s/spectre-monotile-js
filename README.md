# spectre-monotile-js

[Documentation](documentation.md)

## Demo

[Monotiles: Spectre/Tile(1, 1)](https://kerupani129s.github.io/spectre-monotile-js/)

## Usage

```html
<script src="spectre.js?v=1.2.0"></script>
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

## License

[MIT License](LICENSE)
