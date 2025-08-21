(async () => {

	const { Matrix, Renderer, Spectre } = Monotile;

	const renderAngle = (renderer, text, point, vector, distance) => {

		const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);

		const x = point.x + distance * vector.x / length;
		const y = point.y + distance * vector.y / length;

		// 
		const path = new Path2D();
		path.arc(point.x, point.y, renderer.keyPointRadius, 0, 2 * Math.PI);
		renderer.context.fill(path);

		renderer.context.fillText(text, x, y);

	};

	const example = async () => {

		// 
		const renderer = new Renderer();

		renderer.init({
			width: 400,
			height: 280,
			matrix: Matrix.IDENTITY.scale(80).translate(1, 1),
		});

		// 
		const tile = new Spectre();

		renderer.render(tile);

		// 
		renderer.context.font = '24px serif';

		const points = Spectre.points.map(point => renderer.matrix.transformPoint(point));

		for (const [i, point] of points.entries()) {

			renderer.context.fillStyle = (i % 2 === 0 ? '#0000ff' : '#ff0000');

			// 
			const pointPrev = points[i === 0 ? points.length - 1 : i - 1];
			const pointNext = points[i === points.length - 1 ? 0 : i + 1];

			const vectorPrev = { x: pointPrev.x - point.x, y: pointPrev.y - point.y };
			const vectorNext = { x: pointNext.x - point.x, y: pointNext.y - point.y };

			if ( i === 10 ) {
				const vector = { x: - vectorNext.y, y: vectorNext.x };
				renderAngle(renderer, '180°', point, vector, 0.35 * 80 * Math.sqrt(3) / 2);
			} else {
				const vector = { x: vectorPrev.x + vectorNext.x, y: vectorPrev.y + vectorNext.y };
				renderAngle(renderer, (i % 2 === 0 ? '90°' : '120°'), point, vector, 0.35 * 80);
			}

		}

		// 
		const image = await renderer.extractImage();

		document.body.appendChild(image);

	};

	await example();

})();
