(() => {

	const exampleSpectre = () => {

		// 
		const monotiles = new Monotiles();

		monotiles.init({
			width: 400,
			height: 320,
			matrix: new DOMMatrixReadOnly().scale(80).translate(1, 1),
			lineWidth: 2,
			radiusKeyPoint: 5,
		});

		document.body.appendChild(monotiles.canvas);

		// 
		monotiles.render(1);
		monotiles.renderKeyPoints(1);

	};

	const exampleMystic = () => {

		// 
		const monotiles = new Monotiles();

		monotiles.init({
			width: 480,
			height: 480,
			matrix: new DOMMatrixReadOnly().scale(80).translate(1, 1),
			lineWidth: 2,
			radiusKeyPoint: 5,
		});

		document.body.appendChild(monotiles.canvas);

		// 
		monotiles.render(0);
		monotiles.renderKeyPoints(0);

	};

	const exampleClustersA = () => {

		// 
		const monotiles = new Monotiles();

		monotiles.init({
			width: 520,
			height: 480,
			matrix: new DOMMatrixReadOnly().scale(40).translate(3, 2),
			lineWidth: 2,
			radiusKeyPoint: 5,
		});

		document.body.appendChild(monotiles.canvas);

		// 
		monotiles.substitute();

		monotiles.render(1);
		monotiles.renderChildKeyPoints(1);

	};

	const exampleClustersB = () => {

		// 
		const monotiles = new Monotiles();

		monotiles.init({
			width: 520,
			height: 480,
			matrix: new DOMMatrixReadOnly().scale(40).translate(3, 2),
			lineWidth: 2,
			radiusKeyPoint: 5,
		});

		document.body.appendChild(monotiles.canvas);

		// 
		monotiles.substitute();

		monotiles.render(1);
		monotiles.renderKeyPoints(1);

	};

	const exampleSuperClustersA = () => {

		// 
		const monotiles = new Monotiles();

		monotiles.init({
			width: 620,
			height: 760,
			matrix: new DOMMatrixReadOnly().scale(20).translate(8, 12),
			lineWidth: 2,
			radiusKeyPoint: 5,
		});

		document.body.appendChild(monotiles.canvas);

		// 
		monotiles.substitute();
		monotiles.substitute();

		monotiles.render(1);
		monotiles.renderChildKeyPoints(1);

	};

	const exampleSuperClustersB = () => {

		// 
		const monotiles = new Monotiles();

		monotiles.init({
			width: 620,
			height: 760,
			matrix: new DOMMatrixReadOnly().scale(20).translate(8, 12),
			lineWidth: 2,
			radiusKeyPoint: 5,
		});

		document.body.appendChild(monotiles.canvas);

		// 
		monotiles.substitute();
		monotiles.substitute();

		monotiles.render(1);
		monotiles.renderKeyPoints(1);

	};

	exampleSpectre();
	exampleMystic()
	exampleClustersA();
	exampleClustersB();
	exampleSuperClustersA();
	exampleSuperClustersB();

})();
