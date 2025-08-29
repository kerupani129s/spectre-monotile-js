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

		static extractPosition(matrix) {
			return { x: matrix.e, y: matrix.f };
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

		#matrix;

		keyPointRadius;
		#fontSizeBase;

		noFill;
		noStrokeQuad;

		get canvas() {
			return this.#canvas;
		}

		get width() {
			return this.#canvas.width;
		}

		get height() {
			return this.#canvas.height;
		}

		set matrix(matrix) {
			this.#matrix = matrix;
			this.#fontSizeBase = Matrix.extractScale(matrix).y;
		}

		get matrix() {
			return this.#matrix;
		}

		get fontSizeBase() {
			return this.#fontSizeBase;
		}

		init({
			width = 300,
			height = 150,
			matrix = Matrix.IDENTITY.scale(20),
			lineWidth = 2,
			keyPointRadius = 5,
			noFill = false,
			noStrokeQuad = false,
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

			this.keyPointRadius = keyPointRadius;

			this.noFill = noFill;
			this.noStrokeQuad = noStrokeQuad;

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

		renderChildKeyPoints(supertile, matrix = Matrix.IDENTITY) {
			supertile.renderChildKeyPoints(this, this.matrix.multiply(matrix));
		}

		renderText(tile, matrix = Matrix.IDENTITY, text, { scale = 1 } = {}) {
			tile.renderText(this, this.matrix.multiply(matrix), text, { scale });
		}

		renderCategoryName(tile, matrix = Matrix.IDENTITY) {
			tile.renderCategoryName(this, this.matrix.multiply(matrix));
		}

		renderChildCategoryNames(supertile, matrix = Matrix.IDENTITY) {
			supertile.renderChildCategoryNames(this, this.matrix.multiply(matrix));
		}

		renderCategoryNames(tile, matrix = Matrix.IDENTITY) {
			tile.renderCategoryNames(this, this.matrix.multiply(matrix));
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

		static #controlPoints = [
			{ x: 1 / 3, y: 0.5 },
			{ x: 1 - 1 / 3, y: 0.5 },
		].map(point => DOMPointReadOnly.fromPoint(point));

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
		#keyPoints;

		#textPosition;
		#textScale;

		get categoryID() {
			return this.#categoryID;
		}

		get categoryName() {
			return Tile.#categoryNames[this.#categoryID];
		}

		constructor({
			categoryID = -1,
			keyPoints = null,
			textPosition = null,
			textScale = 1,
		} = {}) {
			this.#categoryID = categoryID;
			this.#keyPoints = keyPoints;
			this.#textPosition = textPosition;
			this.#textScale = textScale;
		}

		render(renderer, matrix) {}

		renderKeyPoints(renderer, matrix) {

			if ( ! renderer.noStrokeQuad ) {
				renderer.context.strokeStyle = (this.#categoryID === 0 ? '#0000ff' : '#ff0000');
			}

			renderer.context.fillStyle = (this.#categoryID === 0 ? '#0000ff' : '#ff0000');

			// 
			const points = this.#keyPoints.map(point => matrix.transformPoint(point));

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
				pathKeyPoint.arc(x, y, renderer.keyPointRadius, 0, 2 * Math.PI);
				renderer.context.fill(pathKeyPoint);
			}

		}

		renderText(renderer, matrix, text, { scale = 1 } = {}) {

			// 
			const fontSize = scale * this.#textScale * renderer.fontSizeBase;

			renderer.context.font = `${fontSize}px serif`;
			renderer.context.fillStyle = '#000000';

			// 
			const { x, y } = matrix.transformPoint(this.#textPosition);

			const {
				actualBoundingBoxAscent,
				actualBoundingBoxDescent,
			} = renderer.context.measureText(text);

			renderer.context.fillText(
				text,
				x,
				y + (actualBoundingBoxAscent - actualBoundingBoxDescent) / 2,
			);

		}

		renderCategoryName(renderer, matrix) {
			this.renderText(renderer, matrix, Tile.#categoryNames[this.#categoryID]);
		}

		renderCategoryNames(renderer, matrix) {
			this.renderCategoryName(renderer, matrix);
		}

		// TODO: getBounds(matrix)
		// TODO: { minX, minY, maxX, maxY }

	};

	const Supertile = class extends Tile {

		#children = [];

		get children() {
			return this.#children;
		}

		constructor({ categoryID, keyPoints, textPosition, textScale, children }) {
			super({ categoryID, keyPoints, textPosition, textScale });
			this.#children = children;
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

		renderChildCategoryNames(renderer, matrix) {
			for (const child of this.#children) {
				child.tile.renderCategoryName(renderer, matrix.multiply(child.matrix));
			}
		}

		renderCategoryNames(renderer, matrix) {
			for (const child of this.#children) {
				child.tile.renderCategoryNames(renderer, matrix.multiply(child.matrix));
			}
		}

	};

	const Spectre = class extends Tile {

		static #points = [
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

		static #keyPoints = [3, 5, 7, 11].map(i => this.#points[i]);

		static #textPosition = new DOMPointReadOnly(1.1, 1.1);

		#path;

		static get points() {
			return this.#points;
		}

		static get keyPoints() {
			return this.#keyPoints;
		}

		constructor({
			edgeShape = EdgeShape.LINE,
			path = null,
			categoryID = -1,
			keyPoints = null,
			textScale = 1,
		} = {}) {
			super({ categoryID, keyPoints, textPosition: Spectre.#textPosition, textScale });
			this.#path = path ?? edgeShape.generatePath(Spectre.points);
		}

		render(renderer, matrix) {

			if ( ! renderer.noFill ) {
				renderer.context.fillStyle = (this.categoryID === 9 ? (
					'#a0ffa0'
				) : this.categoryID === 10 ? (
					'#80ffff'
				) : (
					'#ffffff'
				));
			}

			const path = new Path2D();
			path.addPath(this.#path, matrix);
			if ( ! renderer.noFill ) {
				renderer.context.fill(path);
			}
			renderer.context.stroke(path);

		}

	};

	const Mystic = class extends Tile {

		static #rulesChild = [
			{ categoryID: 9, pointIndex: 0, angle: 0 },
			{ categoryID: 10, pointIndex: 8, angle: 30 },
		];

		static #textPosition = new DOMPointReadOnly(2.15, 2.15);

		#children;

		get children() {
			return this.#children;
		}

		constructor({ path, keyPoints, textScale }) {

			super({ categoryID: 0, keyPoints, textPosition: Mystic.#textPosition, textScale });

			this.#children = Mystic.#rulesChild.map(({ categoryID, pointIndex, angle }) => {

				const tile = new Spectre({ path, categoryID, textScale });
				const { x, y } = Spectre.points[pointIndex];
				const matrix = Matrix.IDENTITY.translate(x, y).rotate(angle);

				return { tile, matrix };

			});

		}

		render(renderer, matrix) {
			for (const child of this.#children) {
				child.tile.render(renderer, matrix.multiply(child.matrix));
			}
		}

		renderCategoryNames(renderer, matrix) {
			for (const child of this.#children) {
				child.tile.renderCategoryNames(renderer, matrix.multiply(child.matrix));
			}
		}

	};

	const Hexagon = class extends Tile {

		static #points = [
			{ x: 0.0, y: 0.0 },
			{ x: 1.0, y: 0.0 },
			{ x: 1.5, y: 0.0 + Math.sqrt(3) / 2 },
			{ x: 1.0, y: 0.0 + Math.sqrt(3) },
			{ x: 0.0, y: 0.0 + Math.sqrt(3) },
			{ x: -0.5, y: 0.0 + Math.sqrt(3) / 2 },
		].map(point => DOMPointReadOnly.fromPoint(point));

		static #keyPoints = [1, 2, 3, 5].map(i => this.#points[i]);

		static #textPosition = new DOMPointReadOnly(0.5, Math.sqrt(3) / 2);

		static #path = EdgeShape.LINE.generatePath(this.#points);

		static get points() {
			return this.#points;
		}

		static get keyPoints() {
			return this.#keyPoints;
		}

		constructor({
			categoryID = -1,
			keyPoints = null,
			textScale = 1,
		} = {}) {
			super({ categoryID, keyPoints, textPosition: Hexagon.#textPosition, textScale });
		}

		render(renderer, matrix) {

			if ( ! renderer.noFill ) {
				renderer.context.fillStyle = (this.categoryID === 0 ? '#80ffff' : '#ffffff');
			}

			const path = new Path2D();
			path.addPath(Hexagon.#path, matrix);
			if ( ! renderer.noFill ) {
				renderer.context.fill(path);
			}
			renderer.context.stroke(path);

		}

	};

	// 
	// タイル張り
	// 
	const Tiling = class {

		static #categoryCount = 9;

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

		#tiles = Array(Tiling.#categoryCount);

		#keyPoints;

		#textScale;

		static get categoryCount() {
			return Tiling.#categoryCount;
		}

		static createSpectres(edgeShape = EdgeShape.LINE) {

			const path = edgeShape.generatePath(Spectre.points);

			// 
			const tiling = new Tiling(Spectre.keyPoints, 1);

			tiling.#add(new Mystic({
				path,
				keyPoints: tiling.#keyPoints,
				textScale: tiling.#textScale,
			}));
			for (let categoryID = 1; categoryID < Tiling.#categoryCount; categoryID++) {
				tiling.#add(new Spectre({
					path,
					categoryID,
					keyPoints: tiling.#keyPoints,
					textScale: tiling.#textScale,
				}));
			}

			return tiling;

		}

		static createHexagons() {

			const tiling = new Tiling(Hexagon.keyPoints, 1);

			for (let categoryID = 0; categoryID < Tiling.#categoryCount; categoryID++) {
				tiling.#add(new Hexagon({
					categoryID,
					keyPoints: tiling.#keyPoints,
					textScale: tiling.#textScale,
				}));
			}

			return tiling;

		}

		static #areaOfQuad(points) {
			return Math.abs(
				points[0].x * points[1].y - points[1].x * points[0].y +
				points[1].x * points[2].y - points[2].x * points[1].y +
				points[2].x * points[3].y - points[3].x * points[2].y +
				points[3].x * points[0].y - points[0].x * points[3].y
			) / 2;
		}

		constructor(keyPoints, textScale) {
			this.#keyPoints = keyPoints;
			this.#textScale = textScale;
		}

		#add(tile) {
			this.#tiles[tile.categoryID] = tile;
		}

		get(categoryID) {
			return this.#tiles[categoryID];
		}

		#generateChildMatrices() {

			// メモ: array.values().map(f)
			const rulesIterator = Tiling.#rulesChildMatrix.values()
				.map(({ sharedKeyPointIndices, angle }) => ({
					matrixRotation: Matrix.IDENTITY.rotate(angle),
					sharedKeyPoints: sharedKeyPointIndices.map(i => this.#keyPoints[i]),
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
				const keyPointChild = this.#keyPoints[keyPointIndex];

				return matrixChild.transformPoint(keyPointChild);

			});

		}

		#generateCategoryNamePoint(matricesChild) {

			const points = Tiling.#rulesChildMatrix
				.map(({ sharedKeyPointIndices }, childIndex) => {

					const matrixChild = matricesChild[childIndex];
					const keyPointChild = this.#keyPoints[sharedKeyPointIndices[0]];

					return matrixChild.transformPoint(keyPointChild);

				});

			const x = points.reduce((sum, { x }) => sum + x, 0) / points.length;
			const y = points.reduce((sum, { y }) => sum + y, 0) / points.length;

			return new DOMPointReadOnly(x, y);

		}

		#generateCategoryNameScale(keyPoints) {

			const areaChild = Tiling.#areaOfQuad(this.#keyPoints);
			const area = Tiling.#areaOfQuad(keyPoints);

			return Math.sqrt(area / areaChild) * this.#textScale;

		}

		#generateChildren(categoryID, matricesChild) {

			return Tiling.#rulesChildCategory[categoryID].entries()
				.filter(([, categoryIDChild]) => categoryIDChild >= 0)
				.map(([childIndex, categoryIDChild]) => ({
					tile: this.get(categoryIDChild),
					matrix: matricesChild[childIndex],
				}))
				.toArray();

		}

		substitute() {

			const matricesChild = this.#generateChildMatrices();

			// 
			const keyPoints = this.#generateKeyPoints(matricesChild);
			const textPosition = this.#generateCategoryNamePoint(matricesChild);
			const textScale = this.#generateCategoryNameScale(keyPoints);

			const tiling = new Tiling(keyPoints, textScale);

			for (let categoryID = 0; categoryID < Tiling.#categoryCount; categoryID++) {
				tiling.#add(new Supertile({
					categoryID,
					keyPoints: tiling.#keyPoints,
					textPosition,
					textScale: tiling.#textScale,
					children: this.#generateChildren(categoryID, matricesChild),
				}));
			}

			return tiling;

		}

	};

	window.Monotile = {
		Matrix,
		Renderer,
		// TODO: EdgePath,
		EdgeShape,
		Tile, Supertile, Spectre, Mystic, Hexagon,
		Tiling,
	};

})();
