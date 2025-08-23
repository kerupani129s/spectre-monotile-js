(async () => {

	const { Matrix, Renderer, Spectre } = Monotile;

	const example = async () => {

		// 
		const renderer = new Renderer();

		renderer.init({
			width: 640,
			height: 480,
			matrix: Matrix.IDENTITY.scale(40).translate(2, 1).rotate(15),
		});

		// 
		const tile = new Spectre();

		for (let i = 0; i < 4; i++) {

			let x = i * Spectre.points[10].x;
			let y = i * Spectre.points[10].y;

			for (let j = 0; j < 4; j++) {
				const matrixBase = Matrix.IDENTITY.translate(x, y);
				const matrix = (j % 2 === 0 ? matrixBase : matrixBase.rotate(-30).flipY());
				renderer.render(tile, matrix);
				({ x, y } = matrix.transformPoint(Spectre.points[6]));
			}

		}

		// 
		const image = await renderer.extractImage();

		document.body.appendChild(image);

	};

	await example();

})();
