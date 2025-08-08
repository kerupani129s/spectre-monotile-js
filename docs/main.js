(async () => {

	const { Matrix, Renderer, EdgeShape, Tiling } = Monotile;

	const exampleSpectreStrict = async () => {

		// 
		const renderer = new Renderer();

		renderer.init({
			width: 400,
			height: 360,
			matrix: Matrix.IDENTITY.scale(80).translate(1, 1.5),
		});

		// 
		const tile = Tiling.createSpectres(EdgeShape.BEZIER_CURVE).get(1);

		renderer.render(tile);
		renderer.renderKeyPoints(tile);

		// 
		const image = await renderer.extractImage();

		document.body.appendChild(image);

	};

	const exampleMysticStrict = async () => {

		// 
		const renderer = new Renderer();

		renderer.init({
			width: 480,
			height: 560,
			matrix: Matrix.IDENTITY.scale(80).translate(1, 1.5),
		});

		// 
		const tile = Tiling.createSpectres(EdgeShape.BEZIER_CURVE).get(0);

		renderer.render(tile);
		renderer.renderKeyPoints(tile);

		// 
		const image = await renderer.extractImage();

		document.body.appendChild(image);

	};

	const exampleClusterStrictA = async () => {

		// 
		const renderer = new Renderer();

		renderer.init({
			width: 520,
			height: 500,
			matrix: Matrix.IDENTITY.scale(40).translate(3, 2.5),
		});

		// 
		const tile = Tiling.createSpectres(EdgeShape.BEZIER_CURVE).substitute().get(1);

		renderer.render(tile);
		renderer.renderChildKeyPoints(tile);

		// 
		const image = await renderer.extractImage();

		document.body.appendChild(image);

	};

	const exampleClusterStrictB = async () => {

		// 
		const renderer = new Renderer();

		renderer.init({
			width: 520,
			height: 500,
			matrix: Matrix.IDENTITY.scale(40).translate(3, 2.5),
		});

		// 
		const tile = Tiling.createSpectres(EdgeShape.BEZIER_CURVE).substitute().get(1);

		renderer.render(tile);
		renderer.renderKeyPoints(tile);

		// 
		const image = await renderer.extractImage();

		document.body.appendChild(image);

	};

	const exampleSuperClusterStrictA = async () => {

		// 
		const renderer = new Renderer();

		renderer.init({
			width: 620,
			height: 760,
			matrix: Matrix.IDENTITY.scale(20).translate(8.5, 12),
		});

		// 
		const tile = Tiling.createSpectres(EdgeShape.BEZIER_CURVE).substitute().substitute().get(1);

		renderer.render(tile);
		renderer.renderChildKeyPoints(tile);

		// 
		const image = await renderer.extractImage();

		document.body.appendChild(image);

	};

	const exampleSuperClusterStrictB = async () => {

		// 
		const renderer = new Renderer();

		renderer.init({
			width: 620,
			height: 760,
			matrix: Matrix.IDENTITY.scale(20).translate(8.5, 12),
		});

		// 
		const tile = Tiling.createSpectres(EdgeShape.BEZIER_CURVE).substitute().substitute().get(1);

		renderer.render(tile);
		renderer.renderKeyPoints(tile);

		// 
		const image = await renderer.extractImage();

		document.body.appendChild(image);

	};

	const exampleSpectre = async () => {

		// 
		const renderer = new Renderer();

		renderer.init({
			width: 400,
			height: 320,
			matrix: Matrix.IDENTITY.scale(80).translate(1, 1),
		});

		// 
		const tile = Tiling.createSpectres().get(1);

		renderer.render(tile);
		renderer.renderKeyPoints(tile);

		// 
		const image = await renderer.extractImage();

		document.body.appendChild(image);

	};

	const exampleMystic = async () => {

		// 
		const renderer = new Renderer();

		renderer.init({
			width: 480,
			height: 480,
			matrix: Matrix.IDENTITY.scale(80).translate(1, 1),
		});

		// 
		const tile = Tiling.createSpectres().get(0);

		renderer.render(tile);
		renderer.renderKeyPoints(tile);

		// 
		const image = await renderer.extractImage();

		document.body.appendChild(image);

	};

	const exampleClusterA = async () => {

		// 
		const renderer = new Renderer();

		renderer.init({
			width: 520,
			height: 480,
			matrix: Matrix.IDENTITY.scale(40).translate(3, 2),
		});

		// 
		const tile = Tiling.createSpectres().substitute().get(1);

		renderer.render(tile);
		renderer.renderChildKeyPoints(tile);

		// 
		const image = await renderer.extractImage();

		document.body.appendChild(image);

	};

	const exampleClusterB = async () => {

		// 
		const renderer = new Renderer();

		renderer.init({
			width: 520,
			height: 480,
			matrix: Matrix.IDENTITY.scale(40).translate(3, 2),
		});

		// 
		const tile = Tiling.createSpectres().substitute().get(1);

		renderer.render(tile);
		renderer.renderKeyPoints(tile);

		// 
		const image = await renderer.extractImage();

		document.body.appendChild(image);

	};

	const exampleSuperClusterA = async () => {

		// 
		const renderer = new Renderer();

		renderer.init({
			width: 620,
			height: 760,
			matrix: Matrix.IDENTITY.scale(20).translate(8, 12),
		});

		// 
		const tile = Tiling.createSpectres().substitute().substitute().get(1);

		renderer.render(tile);
		renderer.renderChildKeyPoints(tile);

		// 
		const image = await renderer.extractImage();

		document.body.appendChild(image);

	};

	const exampleSuperClusterB = async () => {

		// 
		const renderer = new Renderer();

		renderer.init({
			width: 620,
			height: 760,
			matrix: Matrix.IDENTITY.scale(20).translate(8, 12),
		});

		// 
		const tile = Tiling.createSpectres().substitute().substitute().get(1);

		renderer.render(tile);
		renderer.renderKeyPoints(tile);

		// 
		const image = await renderer.extractImage();

		document.body.appendChild(image);

	};

	await exampleSpectreStrict();
	await exampleMysticStrict()
	await exampleClusterStrictA();
	await exampleClusterStrictB();
	await exampleSuperClusterStrictA();
	await exampleSuperClusterStrictB();

	await exampleSpectre();
	await exampleMystic()
	await exampleClusterA();
	await exampleClusterB();
	await exampleSuperClusterA();
	await exampleSuperClusterB();

})();
