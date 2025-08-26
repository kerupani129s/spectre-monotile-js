(async () => {

	const { Matrix, Renderer, Spectre } = Monotile;

	const example = async () => {

		// 
		const renderer = new Renderer();

		renderer.init({
			width: 640,
			height: 480,
			matrix: Matrix.IDENTITY.scale(40).translate(2, 1),
		});

		// 
		const tile = new Spectre();

		const [pointRight, pointBottom] = [6, 10].map(i => Spectre.points[i]);

		const matricesRotation = [
			Matrix.IDENTITY.rotate(15),
			Matrix.IDENTITY.rotate(-15).flipY(),
		];

		for (let i = 0, pointBase = new DOMPointReadOnly(); i < 4; i++) {
			for (let j = 0, point = pointBase; j < 4; j++) {

				const matrix = Matrix.IDENTITY.translate(point.x, point.y)
					.multiply(matricesRotation[j % 2]);
				renderer.render(tile, matrix);

				point = matrix.transformPoint(pointRight);
				if ( j === 0 ) {
					pointBase = matrix.transformPoint(pointBottom);
				}

			}
		}

		// 
		const image = await renderer.extractImage();

		document.body.appendChild(image);

	};

	await example();

})();
