(async () => {

	const exampleSpectreStrict = async () => {

		// 
		const monotiles = new Monotiles();

		monotiles.init({
			strict: true,
			width: 400,
			height: 360,
			matrix: new DOMMatrixReadOnly().scale(80).translate(1, 1.5),
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
		URL.revokeObjectURL(image.src);

		document.body.appendChild(image);

	};

	const exampleMysticStrict = async () => {

		// 
		const monotiles = new Monotiles();

		monotiles.init({
			strict: true,
			width: 480,
			height: 560,
			matrix: new DOMMatrixReadOnly().scale(80).translate(1, 1.5),
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
		URL.revokeObjectURL(image.src);

		document.body.appendChild(image);

	};

	const exampleClusterStrictA = async () => {

		// 
		const monotiles = new Monotiles();

		monotiles.init({
			strict: true,
			width: 520,
			height: 500,
			matrix: new DOMMatrixReadOnly().scale(40).translate(3, 2.5),
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
		URL.revokeObjectURL(image.src);

		document.body.appendChild(image);

	};

	const exampleClusterStrictB = async () => {

		// 
		const monotiles = new Monotiles();

		monotiles.init({
			strict: true,
			width: 520,
			height: 500,
			matrix: new DOMMatrixReadOnly().scale(40).translate(3, 2.5),
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
		URL.revokeObjectURL(image.src);

		document.body.appendChild(image);

	};

	const exampleSuperClusterStrictA = async () => {

		// 
		const monotiles = new Monotiles();

		monotiles.init({
			strict: true,
			width: 620,
			height: 760,
			matrix: new DOMMatrixReadOnly().scale(20).translate(8.5, 12),
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
		URL.revokeObjectURL(image.src);

		document.body.appendChild(image);

	};

	const exampleSuperClusterStrictB = async () => {

		// 
		const monotiles = new Monotiles();

		monotiles.init({
			strict: true,
			width: 620,
			height: 760,
			matrix: new DOMMatrixReadOnly().scale(20).translate(8.5, 12),
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
		URL.revokeObjectURL(image.src);

		document.body.appendChild(image);

	};

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
		URL.revokeObjectURL(image.src);

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
		URL.revokeObjectURL(image.src);

		document.body.appendChild(image);

	};

	const exampleClusterA = async () => {

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
		URL.revokeObjectURL(image.src);

		document.body.appendChild(image);

	};

	const exampleClusterB = async () => {

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
		URL.revokeObjectURL(image.src);

		document.body.appendChild(image);

	};

	const exampleSuperClusterA = async () => {

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
		URL.revokeObjectURL(image.src);

		document.body.appendChild(image);

	};

	const exampleSuperClusterB = async () => {

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
		URL.revokeObjectURL(image.src);

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
