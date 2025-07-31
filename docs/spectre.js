(() => {

	// 
	// 定数
	// 
	const matrixIdentity = new DOMMatrixReadOnly();

	const matrixTransposition = new DOMMatrixReadOnly([0, 1, 1, 0, 0, 0]);

	// 
	// レンダラ
	// 
	const Renderer = class {

		#canvas;
		context;

		radiusKeyPoint;
		noFill;
		noStrokeQuad;
		noRenderCategoryName;

		get canvas() {
			return this.#canvas;
		}

		get width() {
			return this.#canvas.width;
		}

		get height() {
			return this.#canvas.height;
		}

		init({
			width = 300,
			height = 150,
			lineWidth = 2,
			radiusKeyPoint = 5,
			noFill = false,
			noStrokeQuad = false,
			noRenderCategoryName = true,
		} = {}) {

			const canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;

			const context = canvas.getContext('2d');
			context.lineWidth = lineWidth;
			context.lineCap = 'round';
			context.lineJoin = 'round';
			context.textAlign = 'center';
			context.textBaseline = 'middle';

			// 
			this.#canvas = canvas;
			this.context = context;
			this.radiusKeyPoint = radiusKeyPoint;
			this.noFill = noFill;
			this.noStrokeQuad = noStrokeQuad;
			this.noRenderCategoryName = noRenderCategoryName;

		};

	};

	// 
	// タイル
	// 
	const Tile = class {

		static #categoryNames = ['Γ', 'Δ', 'Θ', 'Λ', 'Ξ', 'Π', 'Σ', 'Φ', 'Ψ', 'Γ₁', 'Γ₂'];

		#categoryID;

		#keyPoints;

		constructor(categoryID, keyPoints = null) {
			this.#categoryID = categoryID;
			this.#keyPoints = keyPoints;
		}

		get categoryID() {
			return this.#categoryID;
		}

		get categoryName() {
			return Tile.#categoryNames[this.#categoryID];
		}

		get keyPoints() {
			return this.#keyPoints;
		}

		render(renderer, matrix) {}

		renderKeyPoints(renderer, matrix) {

			if ( ! this.#keyPoints ) {
				return;
			}

			// 
			if ( ! renderer.noStrokeQuad ) {
				if ( this.#categoryID === 0 ) {
					renderer.context.strokeStyle = '#0000ff';
				} else {
					renderer.context.strokeStyle = '#ff0000';
				}
			}

			if ( this.#categoryID === 0 ) {
				renderer.context.fillStyle = '#0000ff';
			} else {
				renderer.context.fillStyle = '#ff0000';
			}

			// 
			const points = this.#keyPoints.map(point => matrix.transformPoint(point));

			if ( ! renderer.noStrokeQuad ) {
				const pathQuad = new Path2D();
				pathQuad.moveTo(points[0].x, points[0].y);
				for (const { x, y } of points.slice(1)) {
					pathQuad.lineTo(x, y);
				}
				pathQuad.closePath();
				renderer.context.stroke(pathQuad);
			}

			for (const { x, y } of points) {
				const pathKeyPoint = new Path2D();
				pathKeyPoint.arc(x, y, renderer.radiusKeyPoint, 0, 2 * Math.PI);
				renderer.context.fill(pathKeyPoint);
			}

		}

		renderCategoryName(renderer, matrix) {

			// TODO: Supertile で描画したい場合、大きさと位置を変更
			// [x, 0, 0, y, 0, 0] [c, s, - s, c, 0, 0] = [x c, y s, - x s, y c, 0, 0]
			// sqrt((y s) ^ 2 + (y c) ^ 2) = y sqrt(s ^ 2 + c ^ 2) = y
			const fontSize = Math.sqrt(matrix.b * matrix.b + matrix.d * matrix.d);
			const { x, y } = matrix.transformPoint(new DOMPointReadOnly(1.15, 1.1));

			renderer.context.fillStyle = '#000000';
			renderer.context.font = `${fontSize}px serif`;
			renderer.context.fillText(this.categoryName, x, y);

		}

		// TODO: getBounds(matrix)
		// TODO: { minX, minY, maxX, maxY }

	};

	const Supertile = class extends Tile {

		#children = [];

		constructor(categoryID, keyPoints = null) {
			super(categoryID, keyPoints);
		}

		addChild(tile, matrix) {
			this.#children.push({ tile, matrix });
		}

		render(renderer, matrix) {
			for (const child of this.#children) {
				child.tile.render(renderer, matrix.multiply(child.matrix));
			}
		}

		renderChildKeyPoints(renderer, matrix) {
			for (const child of this.#children) {
				child.tile.renderKeyPoints(renderer, matrix.multiply(child.matrix));
			}
		}

	};

	const Spectre = class extends Tile {

		static #points;
		static #pathStrict;
		static #path;

		#strict;

		static {

			const points = [
				{ x: 0.0, y: 0.0 },
				{ x: 1.0, y: 0.0 },
				{ x: 1.5, y: 0.0 - Math.sqrt(3) / 2 },
				{ x: 1.5 + Math.sqrt(3) / 2, y: 0.5 - Math.sqrt(3) / 2 },
				{ x: 1.5 + Math.sqrt(3) / 2, y: 1.5 - Math.sqrt(3) / 2 },
				{ x: 2.5 + Math.sqrt(3) / 2, y: 1.5 - Math.sqrt(3) / 2 },
				{ x: 3.0 + Math.sqrt(3) / 2, y: 1.5 },
				{ x: 3.0, y: 2.0 },
				{ x: 3.0 - Math.sqrt(3) / 2, y: 1.5 },
				{ x: 2.5 - Math.sqrt(3) / 2, y: 1.5 + Math.sqrt(3) / 2 },
				{ x: 1.5 - Math.sqrt(3) / 2, y: 1.5 + Math.sqrt(3) / 2 },
				{ x: 0.5 - Math.sqrt(3) / 2, y: 1.5 + Math.sqrt(3) / 2 },
				{ x: 0.0 - Math.sqrt(3) / 2, y: 1.5 },
				{ x: 0.0, y: 1.0 },
			].filter(point => DOMPointReadOnly.fromPoint(point));

			const controlPoints = [
				{ x: 1 / 3, y: 0.5 },
				{ x: 1 - 1 / 3, y: 0.5 },
			].filter(point => DOMPointReadOnly.fromPoint(point));

			// 変換行列: (0, 0) と (1, 0) を入れ替えるような 180 度回転
			const matrixReverse = new DOMMatrixReadOnly([-1, 0, 0, -1, 1, 0]);

			const pathStrict = new Path2D();
			pathStrict.moveTo(points[0].x, points[0].y);
			for (const [i, pointStart] of points.entries()) {
				const pointEnd = points[i === points.length - 1 ? 0 : i + 1];
				const matrix = matrixIdentity
					.translate(pointStart.x, pointStart.y)
					.rotateFromVector(
						pointEnd.x - pointStart.x,
						pointEnd.y - pointStart.y,
					)
					.multiply(i % 2 === 0 ? matrixReverse : matrixIdentity);
				const controlPointsTransformed = controlPoints.map(point => matrix.transformPoint(point));
				const indices = (i % 2 === 0 ? [1, 0] : [0, 1]);
				pathStrict.bezierCurveTo(
					controlPointsTransformed[indices[0]].x, controlPointsTransformed[indices[0]].y,
					controlPointsTransformed[indices[1]].x, controlPointsTransformed[indices[1]].y,
					pointEnd.x, pointEnd.y,
				);
			}
			pathStrict.closePath();

			const path = new Path2D();
			path.moveTo(points[0].x, points[0].y);
			for (const { x, y } of points.slice(1)) {
				path.lineTo(x, y);
			}
			path.closePath();

			// 
			this.#points = points;
			this.#pathStrict = pathStrict;
			this.#path = path;

		}

		static get points() {
			return this.#points;
		}

		constructor(categoryID, strict, keyPoints = null) {
			super(categoryID, keyPoints);
			this.#strict = strict;
		}

		render(renderer, matrix) {

			if ( ! renderer.noFill ) {
				if ( this.categoryID === 9 ) {
					renderer.context.fillStyle = '#a0ffa0';
				} else if ( this.categoryID === 10 ) {
					renderer.context.fillStyle = '#80ffff';
				} else {
					renderer.context.fillStyle = '#ffffff';
				}
			}

			const path = new Path2D();
			path.addPath((this.#strict ? Spectre.#pathStrict : Spectre.#path), matrix);
			if ( ! renderer.noFill ) {
				renderer.context.fill(path);
			}
			renderer.context.stroke(path);

			if ( ! renderer.noRenderCategoryName ) {
				this.renderCategoryName(renderer, matrix);
			}

		}

	};

	const Mystic = class extends Supertile {

		constructor(keyPoints, strict) {

			super(0, keyPoints);

			const { x, y } = Spectre.points[8];

			this.addChild(new Spectre(9, strict), matrixIdentity);
			this.addChild(new Spectre(10, strict), matrixIdentity.translate(x, y).rotate(30));

		}

	};

	// 
	// モノタイル
	// 
	const Monotiles = class {

		static rulesChildMatrices = [
			{ sharedKeyPointIndices: [3, 0], angle: 0 },
			{ sharedKeyPointIndices: [0, 3], angle: -120 },
			{ sharedKeyPointIndices: [1, 2], angle: -60 },
			{ sharedKeyPointIndices: [0, 3], angle: -60 },
			{ sharedKeyPointIndices: [1, 3], angle: 0 },
			{ sharedKeyPointIndices: [1, 2], angle: 60 },
			{ sharedKeyPointIndices: [0, 3], angle: 60 },
			{ sharedKeyPointIndices: [1, 3], angle: 120 },
		];

		static rulesChildCategories = [
			[0, 5, 1, -1, 2, 6, 4, 7],
			[0, 4, 1, 4, 7, 6, 5, 7],
			[0, 8, 1, 5, 7, 6, 5, 7],
			[0, 8, 1, 4, 7, 6, 5, 7],
			[0, 8, 1, 5, 7, 6, 8, 7],
			[0, 8, 1, 4, 7, 6, 8, 7],
			[0, 4, 1, 4, 7, 6, 5, 3],
			[0, 8, 1, 8, 7, 6, 5, 7],
			[0, 8, 1, 8, 7, 6, 8, 7],
		];

		static rulesKeyPoints = [
			{ childIndex: 7, keyPointIndex: 2 },
			{ childIndex: 6, keyPointIndex: 1 },
			{ childIndex: 4, keyPointIndex: 2 },
			{ childIndex: 1, keyPointIndex: 1 },
		];

		renderer;

		#tiles;
		matrix;

		get canvas() {
			return this.renderer.canvas;
		}

		static #createTiles(strict) {
			const keyPoints = [3, 5, 7, 11].map(pointIndex => Spectre.points[pointIndex]);
			const tiles = [];
			for (let categoryID = 0; categoryID < 9; categoryID++) {
				if ( categoryID === 0 ) {
					tiles.push(new Mystic(keyPoints, strict));
				} else {
					tiles.push(new Spectre(categoryID, strict, keyPoints));
				}
			}
			return tiles;
		}

		static #generateChildMatrices(keyPointsChild) {

			const matricesChildBase = [];

			let point;

			for (const [childIndex, { sharedKeyPointIndices, angle }] of this.rulesChildMatrices.entries()) {

				// 変換行列: 回転
				const matrixRotation = matrixIdentity.rotate(angle);

				const sharedKeyPoints = sharedKeyPointIndices.map(i => keyPointsChild[i]);
				const sharedKeyPointsRotated = sharedKeyPoints
					.map(sharedKeyPoint => matrixRotation.transformPoint(sharedKeyPoint));

				if ( childIndex === 0) {
					point = sharedKeyPointsRotated[1];
					matricesChildBase.push(matrixRotation);
					continue;
				}

				// 変換行列: 移動
				const matrixTranslation = matrixIdentity.translate(
					point.x - sharedKeyPointsRotated[0].x,
					point.y - sharedKeyPointsRotated[0].y,
				);

				// 変換行列: 回転, 移動
				const matrix = matrixTranslation.multiply(matrixRotation);

				point = matrix.transformPoint(sharedKeyPoints[1]);
				matricesChildBase.push(matrix);

			}

			// 変換行列: 回転, 移動, 転置
			const matricesChild = matricesChildBase.map(matrix => matrixTransposition.multiply(matrix));

			return matricesChild;

		}

		static #generateKeyPoints(keyPointsChild, matricesChild) {

			return this.rulesKeyPoints.map(({ childIndex, keyPointIndex }) => {

				const matrixChild = matricesChild[childIndex];
				const keyPointChild = keyPointsChild[keyPointIndex];

				return matrixChild.transformPoint(keyPointChild);

			});

		}

		static #createSupertile(categoryID, keyPoints, tiles, matricesChild) {

			const ruleChildCategories = this.rulesChildCategories[categoryID];

			// 
			const supertile = new Supertile(categoryID, keyPoints);

			for (const [childIndex, categoryIDChild] of ruleChildCategories.entries()) {

				if ( categoryIDChild < 0 ) {
					continue
				}

				supertile.addChild(tiles[categoryIDChild], matricesChild[childIndex]);

			}

			return supertile;

		}

		static #substituteTiles(tiles) {

			// tiles[categoryID].keyPoints は共通
			const keyPointsChild = tiles[0].keyPoints;

			const matricesChild = this.#generateChildMatrices(keyPointsChild);

			const keyPoints = this.#generateKeyPoints(keyPointsChild, matricesChild);

			const supertiles = [];
			for (let categoryID = 0; categoryID < 9; categoryID++) {
				supertiles.push(
					this.#createSupertile(categoryID, keyPoints, tiles, matricesChild)
				);
			}

			return supertiles;

		}

		init({
			strict = false,
			width = 300,
			height = 150,
			lineWidth = 2,
			radiusKeyPoint = 5,
			matrix = matrixIdentity.scale(20),
			noFill = false,
			noStrokeQuad = false,
			noRenderCategoryName = true,
		} = {}) {

			const renderer = new Renderer();
			renderer.init({
				width, height,
				lineWidth, radiusKeyPoint,
				noFill, noStrokeQuad, noRenderCategoryName,
			});

			const tiles = Monotiles.#createTiles(strict);

			// 
			this.renderer = renderer;
			this.#tiles = tiles;
			this.matrix = matrix;

		}

		substitute() {
			this.#tiles = Monotiles.#substituteTiles(this.#tiles);
		}

		render(categoryID, matrix = matrixIdentity) {
			this.#tiles[categoryID].render(this.renderer, this.matrix.multiply(matrix));
		}

		renderKeyPoints(categoryID, matrix = matrixIdentity) {
			this.#tiles[categoryID].renderKeyPoints(this.renderer, this.matrix.multiply(matrix));
		}

		renderChildKeyPoints(categoryID, matrix = matrixIdentity) {
			this.#tiles[categoryID].renderChildKeyPoints(this.renderer, this.matrix.multiply(matrix));
		}

	};

	window.Monotiles = Monotiles;

})();
