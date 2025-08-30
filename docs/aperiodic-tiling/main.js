(async () => {

	const { Matrix, Renderer, Tiling } = Monotile;

	const angles = [0, -120, -60, -60, 0, 60, 60, 120];

	const renderChildAngles = (renderer, supertile, matrix = Matrix.IDENTITY) => {
		for (const [i, child] of supertile.children.entries()) {
			renderer.renderText(
				child.tile,
				`${angles[i]}°`,
				{
					matrix: matrix.multiply(child.matrix),
					style: { scale: 0.75 },
				},
			);
		}
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
		renderChildAngles(renderer, tile);

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
		renderer.renderChildKeyPoints(tile);
		renderer.renderChildCategoryNames(tile);

		// 
		const image = await renderer.extractImage();

		document.body.appendChild(image);

	};

	const exampleClusterC = async () => {

		// 
		const renderer = new Renderer();

		renderer.init({
			width: 260,
			height: 300,
			matrix: Matrix.IDENTITY.scale(40).translate(1.5, 2.5),
		});

		// 
		const tile = Tiling.createHexagons().substitute().get(1);

		renderer.render(tile);
		renderer.renderChildKeyPoints(tile);
		renderChildAngles(renderer, tile);

		// 
		const image = await renderer.extractImage();

		document.body.appendChild(image);

	};

	const exampleClusterD = async () => {

		// 
		const renderer = new Renderer();

		renderer.init({
			width: 260,
			height: 300,
			matrix: Matrix.IDENTITY.scale(40).translate(1.5, 2.5),
		});

		// 
		const tile = Tiling.createHexagons().substitute().get(1);

		renderer.render(tile);
		renderer.renderChildKeyPoints(tile);
		renderer.renderChildCategoryNames(tile);

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
		renderChildAngles(renderer, tile);

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
		renderer.renderChildKeyPoints(tile);
		renderer.renderChildCategoryNames(tile);

		// 
		const image = await renderer.extractImage();

		document.body.appendChild(image);

	};

	const exampleSuperClusterC = async () => {

		// 
		const renderer = new Renderer();

		renderer.init({
			width: 410,
			height: 430,
			matrix: Matrix.IDENTITY.scale(20).translate(7.5, 6),
		});

		// 
		const tile = Tiling.createHexagons().substitute().substitute().get(1);

		renderer.render(tile);
		renderer.renderChildKeyPoints(tile);
		renderChildAngles(renderer, tile);

		// 
		const image = await renderer.extractImage();

		document.body.appendChild(image);

	};

	const exampleSuperClusterD = async () => {

		// 
		const renderer = new Renderer();

		renderer.init({
			width: 410,
			height: 430,
			matrix: Matrix.IDENTITY.scale(20).translate(7.5, 6),
		});

		// 
		const tile = Tiling.createHexagons().substitute().substitute().get(1);

		renderer.render(tile);
		renderer.renderChildKeyPoints(tile);
		renderer.renderChildCategoryNames(tile);

		// 
		const image = await renderer.extractImage();

		document.body.appendChild(image);

	};

	await exampleClusterA();
	await exampleClusterB();
	await exampleClusterC();
	await exampleClusterD();
	await exampleSuperClusterA();
	await exampleSuperClusterB();
	await exampleSuperClusterC();
	await exampleSuperClusterD();

})();
