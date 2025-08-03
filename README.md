# spectre-monotile-js

[Documentation](documentation.md)

## Demo

[Monotiles: Spectre/Tile(1, 1)](https://kerupani129s.github.io/spectre-monotile-js/)

## Usage

```html
<script src="spectre.js?v=2.0.0"></script>
```

```javascript
const { Matrix, Renderer, Spectres } = Monotile;

// 
const renderer = new Renderer();

renderer.init({
	width: 520,
	height: 500,
	matrix: Matrix.IDENTITY.scale(40).translate(3, 2.5),
});

document.body.appendChild(renderer.canvas);

// 
const tile = Spectres.create(true).substitute().get(1);

renderer.render(tile);
renderer.renderChildKeyPoints(tile);
```

## License

[MIT License](LICENSE)
