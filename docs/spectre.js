(() => {

	// 
	// 行列
	// 
	const Matrix = class {

		static #identity = new DOMMatrixReadOnly();
		static #flipping = new DOMMatrixReadOnly([0, 1, 1, 0, 0, 0]);

		static get IDENTITY() {
			return this.#identity;
		}

		// 反転 reflection/flipping
		// 転置 transposition
		static get FLIPPING() {
			return this.#flipping;
		}

		static extractScale(matrix) {

			// [c, s, - s, c, 0, 0] [x, 0, 0, y, 0, 0] = [c x, s x, - s y, c y, 0, 0]
			// sqrt((  c x) ^ 2 + (s x) ^ 2) = sqrt(c ^ 2 + s ^ 2) x = x
			// sqrt((- s y) ^ 2 + (c y) ^ 2) = sqrt(s ^ 2 + c ^ 2) y = y
			return {
				x: Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b),
				y: Math.sqrt(matrix.c * matrix.c + matrix.d * matrix.d),
			};

		}

	};

	// 
	// レンダラ
	// 
	const Renderer = class {

		#canvas;
		context;

		matrix;

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
			matrix = Matrix.IDENTITY.scale(20),
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

			this.matrix = matrix;

			this.radiusKeyPoint = radiusKeyPoint;

			this.noFill = noFill;
			this.noStrokeQuad = noStrokeQuad;
			this.noRenderCategoryName = noRenderCategoryName;

		}

		clear() {
			this.context.clearRect(0, 0, this.width, this.height);
		}

		render(tile, matrix = Matrix.IDENTITY) {
			tile.render(this, this.matrix.multiply(matrix));
		}

		renderKeyPoints(tile, matrix = Matrix.IDENTITY) {
			tile.renderKeyPoints(this, this.matrix.multiply(matrix));
		}

		renderChildKeyPoints(tile, matrix = Matrix.IDENTITY) {
			tile.renderChildKeyPoints(this, this.matrix.multiply(matrix));
		}

		async extractImage({ type, quality } = {}) {
			const blob = await new Promise(resolve => this.#canvas.toBlob(resolve, type, quality));
			const image = new Image();
			image.src = URL.createObjectURL(blob);
			await image.decode();
			URL.revokeObjectURL(image.src);
			return image;
		}

	};

	// 
	// 辺の形状
	// 
	const EdgePath = class {

		// TODO: 仮
		#joinPath;

		// TODO: 仮
		set(joinPath) {
			this.#joinPath = joinPath;
		}

		joinPath(path, pointStart, pointEnd, reversed) {
			// TODO: 仮
			this.#joinPath(path, pointStart, pointEnd, reversed);
		}

	};

	const EdgeShape = class {

		#edgePath;

		static get LINE() {
			// メモ: 後で定義
			return line;
		}

		static get BEZIER_CURVE() {
			// メモ: 後で定義
			return bezierCurve;
		}

		constructor(edgePath) {
			this.#edgePath = edgePath;
		}

		generatePath(points) {

			const path = new Path2D();

			path.moveTo(points[0].x, points[0].y);

			for (const [i, pointStart] of points.entries()) {
				const pointEnd = points[i === points.length - 1 ? 0 : i + 1];
				this.#edgePath.joinPath(path, pointStart, pointEnd, i % 2 === 0);
			}

			path.closePath();

			return path;

		}

	};

	const Line = class extends EdgeShape {

		constructor() {

			const edgePath = new EdgePath();

			// TODO: 仮
			edgePath.set((path, pointStart, pointEnd, reversed) => (
				this.#joinPath(path, pointStart, pointEnd, reversed)
			));

			super(edgePath);

		}

		#joinPath(path, pointStart, pointEnd, reversed) {
			path.lineTo(pointEnd.x, pointEnd.y);
		}

	};

	const BezierCurve = class extends EdgeShape {

		// 変換行列: (0, 0) と (1, 0) を入れ替えるような 180 度回転
		static #matrixReversing = new DOMMatrixReadOnly([-1, 0, 0, -1, 1, 0]);

		static #controlPoints;

		static {

			const controlPoints = [
				{ x: 1 / 3, y: 0.5 },
				{ x: 1 - 1 / 3, y: 0.5 },
			].map(point => DOMPointReadOnly.fromPoint(point));

			this.#controlPoints = controlPoints;

		}

		constructor() {

			const edgePath = new EdgePath();

			// TODO: 仮
			edgePath.set((path, pointStart, pointEnd, reversed) => (
				this.#joinPath(path, pointStart, pointEnd, reversed)
			));

			super(edgePath);

		}

		#joinPath(path, pointStart, pointEnd, reversed) {

			const matrix = Matrix.IDENTITY
				.translate(pointStart.x, pointStart.y)
				.rotateFromVector(
					pointEnd.x - pointStart.x,
					pointEnd.y - pointStart.y,
				)
				.multiply(reversed ? BezierCurve.#matrixReversing : Matrix.IDENTITY);
			const controlPoints = BezierCurve.#controlPoints.map(point => matrix.transformPoint(point));
			const indices = (reversed ? [1, 0] : [0, 1]);

			path.bezierCurveTo(
				controlPoints[indices[0]].x, controlPoints[indices[0]].y,
				controlPoints[indices[1]].x, controlPoints[indices[1]].y,
				pointEnd.x, pointEnd.y,
			);

		}

	};

	// メモ: EdgeShape の初期化完了前に EdgeShape のプロパティに代入することは不可
	const line = new Line();
	const bezierCurve = new BezierCurve();

	// 
	// タイル
	// 
	const Tile = class {

		static #categoryNames = ['Γ', 'Δ', 'Θ', 'Λ', 'Ξ', 'Π', 'Σ', 'Φ', 'Ψ', 'Γ₁', 'Γ₂'];

		#categoryID;
		#tiles;

		constructor(categoryID, tiles = null) {
			this.#categoryID = categoryID;
			this.#tiles = tiles;
		}

		get categoryID() {
			return this.#categoryID;
		}

		get categoryName() {
			return Tile.#categoryNames[this.#categoryID];
		}

		render(renderer, matrix) {}

		renderKeyPoints(renderer, matrix) {

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
			const points = this.#tiles.keyPoints.map(point => matrix.transformPoint(point));

			if ( ! renderer.noStrokeQuad ) {
				const pathQuad = new Path2D();
				pathQuad.moveTo(points[0].x, points[0].y);
				for (const { x, y } of points.values().drop(1)) {
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
			const fontSize = Matrix.extractScale(matrix).y;
			const { x, y } = matrix.transformPoint(new DOMPointReadOnly());

			renderer.context.fillStyle = '#000000';
			renderer.context.font = `${fontSize}px serif`;
			renderer.context.fillText(this.categoryName, x, y);

		}

		// TODO: getBounds(matrix)
		// TODO: { minX, minY, maxX, maxY }

	};

	const Tiles = class {

		static #length = 9;

		#array = Array(Tiles.#length);

		#keyPoints;

		static get length() {
			return this.#length;
		}

		get keyPoints() {
			return this.#keyPoints;
		}

		constructor(keyPoints) {
			this.#keyPoints = keyPoints;
		}

		set(categoryID, tile) {
			this.#array[categoryID] = tile;
		}

		get(categoryID) {
			return this.#array[categoryID];
		}

	};

	const Supertile = class extends Tile {

		#children = [];

		constructor(categoryID, tiles = null) {
			super(categoryID, tiles);
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
		static #keyPointIndices;

		static #pathStrict;
		static #path;
		static #categoryNamePosition;

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
			].map(point => DOMPointReadOnly.fromPoint(point));

			const keyPointIndices = [3, 5, 7, 11];

			const pathStrict = EdgeShape.BEZIER_CURVE.generatePath(points);
			const path = EdgeShape.LINE.generatePath(points);

			const categoryNamePosition = { x: 1.15, y: 1.1 };

			// 
			this.#points = points;
			this.#keyPointIndices = keyPointIndices;

			this.#pathStrict = pathStrict;
			this.#path = path;
			this.#categoryNamePosition = categoryNamePosition;

		}

		static get keyPoints() {
			return this.#keyPointIndices.map(i => this.#points[i]);
		}

		static get points() {
			return this.#points;
		}

		constructor(categoryID, strict = false, tiles = null) {
			super(categoryID, tiles);
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
				const { x, y } = Spectre.#categoryNamePosition;
				this.renderCategoryName(renderer, matrix.translate(x, y));
			}

		}

	};

	const Mystic = class extends Tile {

		static #rulesChild = [
			{ categoryID: 9, pointIndex: 0, angle: 0 },
			{ categoryID: 10, pointIndex: 8, angle: 30 },
		];

		#children;

		constructor(strict = false, tiles = null) {

			super(0, tiles);

			this.#children = Mystic.#rulesChild.map(child => {

				const tile = new Spectre(child.categoryID, strict);
				const { x, y } = Spectre.points[child.pointIndex];
				const matrix = Matrix.IDENTITY.translate(x, y).rotate(child.angle);

				return { tile, matrix };

			});

		}

		render(renderer, matrix) {
			for (const child of this.#children) {
				child.tile.render(renderer, matrix.multiply(child.matrix));
			}
		}

	};

	const Hexagon = class extends Tile {

		static #points;
		static #keyPointIndices;

		static #path;
		static #categoryNamePosition;

		static {

			const points = [
				{ x: 0.0, y: 0.0 },
				{ x: 1.0, y: 0.0 },
				{ x: 1.5, y: 0.0 + Math.sqrt(3) / 2 },
				{ x: 1.0, y: 0.0 + Math.sqrt(3) },
				{ x: 0.0, y: 0.0 + Math.sqrt(3) },
				{ x: -0.5, y: 0.0 + Math.sqrt(3) / 2 },
			].map(point => DOMPointReadOnly.fromPoint(point));

			const keyPointIndices = [1, 2, 3, 5];

			const path = EdgeShape.LINE.generatePath(points);

			const categoryNamePosition = { x: 0.5, y: Math.sqrt(3) / 2 };

			// 
			this.#points = points;
			this.#keyPointIndices = keyPointIndices;

			this.#path = path;
			this.#categoryNamePosition = categoryNamePosition;

		}

		static get keyPoints() {
			return this.#keyPointIndices.map(i => this.#points[i]);
		}

		static get points() {
			return this.#points;
		}

		constructor(categoryID, tiles = null) {
			super(categoryID, tiles);
		}

		render(renderer, matrix) {

			if ( ! renderer.noFill ) {
				if ( this.categoryID === 0 ) {
					renderer.context.fillStyle = '#80ffff';
				} else {
					renderer.context.fillStyle = '#ffffff';
				}
			}

			const path = new Path2D();
			path.addPath(Hexagon.#path, matrix);
			if ( ! renderer.noFill ) {
				renderer.context.fill(path);
			}
			renderer.context.stroke(path);

			if ( ! renderer.noRenderCategoryName ) {
				const { x, y } = Hexagon.#categoryNamePosition;
				this.renderCategoryName(renderer, matrix.translate(x, y));
			}

		}

	};

	// 
	// タイル張り
	// 
	const Tiling = class {

		static #rulesChildMatrix = [
			{ sharedKeyPointIndices: [3, 0], angle: 0 },
			{ sharedKeyPointIndices: [0, 3], angle: -120 },
			{ sharedKeyPointIndices: [1, 2], angle: -60 },
			{ sharedKeyPointIndices: [0, 3], angle: -60 },
			{ sharedKeyPointIndices: [1, 3], angle: 0 },
			{ sharedKeyPointIndices: [1, 2], angle: 60 },
			{ sharedKeyPointIndices: [0, 3], angle: 60 },
			{ sharedKeyPointIndices: [1, 3], angle: 120 },
		];

		static #rulesChildCategory = [
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

		static #rulesKeyPoint = [
			{ childIndex: 7, keyPointIndex: 2 },
			{ childIndex: 6, keyPointIndex: 1 },
			{ childIndex: 4, keyPointIndex: 2 },
			{ childIndex: 1, keyPointIndex: 1 },
		];

		#tiles;

		static get length() {
			return Tiles.length;
		}

		static createSpectres(strict = false) {

			const tiles = new Tiles(Spectre.keyPoints);

			tiles.set(0, new Mystic(strict, tiles));
			for (let categoryID = 1; categoryID < Tiles.length; categoryID++) {
				tiles.set(categoryID, new Spectre(categoryID, strict, tiles));
			}

			return new Tiling(tiles);

		}

		static createHexagons() {

			const tiles = new Tiles(Hexagon.keyPoints);

			for (let categoryID = 0; categoryID < Tiles.length; categoryID++) {
				tiles.set(categoryID, new Hexagon(categoryID, tiles));
			}

			return new Tiling(tiles);

		}

		constructor(tiles) {
			this.#tiles = tiles;
		}

		get(categoryID) {
			return this.#tiles.get(categoryID);
		}

		#generateChildMatrices() {

			// メモ: array.values().map(f)
			const rulesIterator = Tiling.#rulesChildMatrix.values()
				.map(({ sharedKeyPointIndices, angle }) => ({
					matrixRotation: Matrix.IDENTITY.rotate(angle),
					sharedKeyPoints: sharedKeyPointIndices.map(i => this.#tiles.keyPoints[i]),
				}));

			// メモ: array.values() の場合は take(1) を配列に変換すると done にならない
			//       array.values().map(f) の場合は take(1) を配列に変換すると done になる
			const first = rulesIterator.take(1)
				.map(({ matrixRotation, sharedKeyPoints }) => ({
					matrix: Matrix.FLIPPING.multiply(matrixRotation),
					point: matrixRotation.transformPoint(sharedKeyPoints[1]),
				}))
				.next().value;

			const matricesChild = rulesIterator
				.reduce(({ matrices, point }, { matrixRotation, sharedKeyPoints }) => {

					const sharedKeyPointRotated = matrixRotation.transformPoint(sharedKeyPoints[0]);

					// 変換行列: 移動
					const matrixTranslation = Matrix.IDENTITY.translate(
						point.x - sharedKeyPointRotated.x,
						point.y - sharedKeyPointRotated.y,
					);

					// 変換行列: 回転, 移動
					const matrixBase = matrixTranslation.multiply(matrixRotation);

					// 変換行列: 回転, 移動, 反転
					const matrix = Matrix.FLIPPING.multiply(matrixBase);

					// 
					matrices.push(matrix);

					return {
						matrices,
						point: matrixBase.transformPoint(sharedKeyPoints[1]),
					};

				}, {
					matrices: [first.matrix],
					point: first.point,
				})
				.matrices;

			return matricesChild;

		}

		#generateKeyPoints(matricesChild) {

			return Tiling.#rulesKeyPoint.map(({ childIndex, keyPointIndex }) => {

				const matrixChild = matricesChild[childIndex];
				const keyPointChild = this.#tiles.keyPoints[keyPointIndex];

				return matrixChild.transformPoint(keyPointChild);

			});

		}

		#createSupertile(categoryID, matricesChild, tiles) {

			const ruleChildCategory = Tiling.#rulesChildCategory[categoryID];

			// 
			const supertile = new Supertile(categoryID, tiles);

			for (const [childIndex, categoryIDChild] of ruleChildCategory.entries()) {
				if ( categoryIDChild >= 0 ) {
					supertile.addChild(this.#tiles.get(categoryIDChild), matricesChild[childIndex]);
				}
			}

			return supertile;

		}

		substitute() {

			const matricesChild = this.#generateChildMatrices();

			const keyPoints = this.#generateKeyPoints(matricesChild);

			// 
			const tiles = new Tiles(keyPoints);

			for (let categoryID = 0; categoryID < Tiles.length; categoryID++) {
				tiles.set(
					categoryID,
					this.#createSupertile(categoryID, matricesChild, tiles)
				);
			}

			return new Tiling(tiles);

		}

	};

	window.Monotile = {
		Matrix,
		Renderer,
		// TODO: EdgePath, EdgeShape,
		Tile, Supertile, Spectre, Mystic, Hexagon,
		Tiling,
	};

})();
