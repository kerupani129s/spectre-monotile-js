(async () => {

	const exampleSpectre = async () => {

		// 
		const monotiles = new Monotiles();

		monotiles.init({
			width: 400,
			height: 320,
			matrix: new DOMMatrixReadOnly().scale(80).translate(1, 1),
			lineWidth: 2,
			radiusKeyPoint: 5,
		});

		// 
		monotiles.render(1);
		monotiles.renderKeyPoints(1);

		// 
		const blob = await new Promise(resolve => monotiles.canvas.toBlob(resolve));
		const image = new Image();
		image.src = URL.createObjectURL(blob);
		await image.decode();

		document.body.appendChild(image);

	};

	const exampleMystic = async () => {

		// 
		const monotiles = new Monotiles();

		monotiles.init({
			width: 480,
			height: 480,
			matrix: new DOMMatrixReadOnly().scale(80).translate(1, 1),
			lineWidth: 2,
			radiusKeyPoint: 5,
		});

		// 
		monotiles.render(0);
		monotiles.renderKeyPoints(0);

		// 
		const blob = await new Promise(resolve => monotiles.canvas.toBlob(resolve));
		const image = new Image();
		image.src = URL.createObjectURL(blob);
		await image.decode();

		document.body.appendChild(image);

	};

	const exampleClustersA = async () => {

		// 
		const monotiles = new Monotiles();

		monotiles.init({
			width: 520,
			height: 480,
			matrix: new DOMMatrixReadOnly().scale(40).translate(3, 2),
			lineWidth: 2,
			radiusKeyPoint: 5,
		});

		// 
		monotiles.substitute();

		monotiles.render(1);
		monotiles.renderChildKeyPoints(1);

		// 
		const blob = await new Promise(resolve => monotiles.canvas.toBlob(resolve));
		const image = new Image();
		image.src = URL.createObjectURL(blob);
		await image.decode();

		document.body.appendChild(image);

	};

	const exampleClustersB = async () => {

		// 
		const monotiles = new Monotiles();

		monotiles.init({
			width: 520,
			height: 480,
			matrix: new DOMMatrixReadOnly().scale(40).translate(3, 2),
			lineWidth: 2,
			radiusKeyPoint: 5,
		});

		// 
		monotiles.substitute();

		monotiles.render(1);
		monotiles.renderKeyPoints(1);

		// 
		const blob = await new Promise(resolve => monotiles.canvas.toBlob(resolve));
		const image = new Image();
		image.src = URL.createObjectURL(blob);
		await image.decode();

		document.body.appendChild(image);

	};

	const exampleSuperClustersA = async () => {

		// 
		const monotiles = new Monotiles();

		monotiles.init({
			width: 620,
			height: 760,
			matrix: new DOMMatrixReadOnly().scale(20).translate(8, 12),
			lineWidth: 2,
			radiusKeyPoint: 5,
		});

		// 
		monotiles.substitute();
		monotiles.substitute();

		monotiles.render(1);
		monotiles.renderChildKeyPoints(1);

		// 
		const blob = await new Promise(resolve => monotiles.canvas.toBlob(resolve));
		const image = new Image();
		image.src = URL.createObjectURL(blob);
		await image.decode();

		document.body.appendChild(image);

	};

	const exampleSuperClustersB = async () => {

		// 
		const monotiles = new Monotiles();

		monotiles.init({
			width: 620,
			height: 760,
			matrix: new DOMMatrixReadOnly().scale(20).translate(8, 12),
			lineWidth: 2,
			radiusKeyPoint: 5,
		});

		// 
		monotiles.substitute();
		monotiles.substitute();

		monotiles.render(1);
		monotiles.renderKeyPoints(1);

		// 
		const blob = await new Promise(resolve => monotiles.canvas.toBlob(resolve));
		const image = new Image();
		image.src = URL.createObjectURL(blob);
		await image.decode();

		document.body.appendChild(image);

	};

	await exampleSpectre();
	await exampleMystic()
	await exampleClustersA();
	await exampleClustersB();
	await exampleSuperClustersA();
	await exampleSuperClustersB();

})();
