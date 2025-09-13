(async () => {

	const { Matrix, Renderer, EdgeShape, Spectre } = Monotile;

	const exampleA = async () => {

		// 
		const renderer = new Renderer();

		renderer.init({
			width: 400,
			height: 360,
			matrix: Matrix.IDENTITY.scale(80).translate(1, 1.5),
		});

		// 
		const edgeShape = new EdgeShape().lineTo(0.75, Math.sqrt(3) / 4).lineTo(1, 0);
		const tile = new Spectre({ edgeShape });

		renderer.render(tile);

		// 
		const image = await renderer.extractImage();

		document.body.appendChild(image);

	};

	const exampleB = async () => {

		// 
		const renderer = new Renderer();

		renderer.init({
			width: 400,
			height: 360,
			matrix: Matrix.IDENTITY.scale(80).translate(1, 1.5),
		});

		// 
		const edgeShape = new EdgeShape().bezierCurveTo(0.5, 0.5, 0.5, -0.5, 1, 0);
		const tile = new Spectre({ edgeShape });

		renderer.render(tile);

		// 
		const image = await renderer.extractImage();

		document.body.appendChild(image);

	};

	const exampleC = async () => {

		// 
		const renderer = new Renderer();

		renderer.init({
			width: 400,
			height: 360,
			matrix: Matrix.IDENTITY.scale(80).translate(1, 1.5),
		});

		// 
		const edgeShape = new EdgeShape().quadraticCurveTo(0.75, 0.75, 1, 0);
		const tile = new Spectre({ edgeShape });

		renderer.render(tile);

		// 
		const image = await renderer.extractImage();

		document.body.appendChild(image);

	};

	const exampleD = async () => {

		// 
		const renderer = new Renderer();

		renderer.init({
			width: 400,
			height: 360,
			matrix: Matrix.IDENTITY.scale(80).translate(1, 1.5),
		});

		// 
		const edgeShape = new EdgeShape().arc(0.5, 0, 0.5, Math.PI, 0, true);
		const tile = new Spectre({ edgeShape });

		renderer.render(tile);

		// 
		const image = await renderer.extractImage();

		document.body.appendChild(image);

	};

	const exampleE = async () => {

		// 
		const renderer = new Renderer();

		renderer.init({
			width: 400,
			height: 360,
			matrix: Matrix.IDENTITY.scale(80).translate(1, 1.5),
		});

		// 
		const edgeShape = new EdgeShape().arcTo(0.5, 0.5, 1, 0, Math.sqrt(2) / 4).lineTo(1, 0);
		const tile = new Spectre({ edgeShape });

		renderer.render(tile);

		// 
		const image = await renderer.extractImage();

		document.body.appendChild(image);

	};

	const exampleF = async () => {

		// 
		const renderer = new Renderer();

		renderer.init({
			width: 400,
			height: 360,
			matrix: Matrix.IDENTITY.scale(80).translate(1, 1.5),
		});

		// 
		const edgeShape = new EdgeShape().ellipse(0.5, 0, 0.5, 1 / 3, 0, Math.PI, 0, true);
		const tile = new Spectre({ edgeShape });

		renderer.render(tile);

		// 
		const image = await renderer.extractImage();

		document.body.appendChild(image);

	};

	await exampleA();
	await exampleB();
	await exampleC();
	await exampleD();
	await exampleE();
	await exampleF();

})();
