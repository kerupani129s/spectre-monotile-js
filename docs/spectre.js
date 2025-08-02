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
			matrix = matrixIdentity.scale(20),
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

		render(tile, matrix = matrixIdentity) {
			tile.render(this, this.matrix.multiply(matrix));
		}

		renderKeyPoints(tile, matrix = matrixIdentity) {
			tile.renderKeyPoints(this, this.matrix.multiply(matrix));
		}

		renderChildKeyPoints(tile, matrix = matrixIdentity) {
			tile.renderChildKeyPoints(this, this.matrix.multiply(matrix));
		}

	};

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

		static #keyPointIndices = [3, 5, 7, 11];

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

		static get keyPointIndices() {
			return this.#keyPointIndices;
		}

		static get points() {
			return this.#points;
		}

		constructor(categoryID, strict, tiles = null) {
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
				this.renderCategoryName(renderer, matrix);
			}

		}

	};

	const Mystic = class extends Supertile {

		static #rulesChildMatrix = [
			{ pointIndex: 0, angle: 0 },
			{ pointIndex: 8, angle: 30 },
		];

		static #ruleChildCategory = [9, 10];

		constructor(strict, tiles = null) {

			super(0, tiles);

			const matricesChild = Mystic.#rulesChildMatrix.map(({ pointIndex, angle }) => {

				const { x, y } = Spectre.points[pointIndex];
				const matrix = matrixIdentity.translate(x, y).rotate(angle);

				return matrix;

			});

			for (const [childIndex, categoryIDChild] of Mystic.#ruleChildCategory.entries()) {

				const tile = new Spectre(categoryIDChild, strict);
				const matrix = matricesChild[childIndex];

				this.addChild(tile, matrix);

			}

		}

	};

	// 
	// タイル張り
	// 
	const Spectres = class {

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

		static #createTile(categoryID, strict, tiles) {
			return (categoryID === 0 ? new Mystic(strict, tiles) : new Spectre(categoryID, strict, tiles));
		}

		static createTiles(strict) {
			const keyPoints = Spectre.keyPointIndices.map(i => Spectre.points[i]);
			const tiles = new Tiles(keyPoints);
			for (let categoryID = 0; categoryID < Tiles.length; categoryID++) {
				tiles.set(categoryID, this.#createTile(categoryID, strict, tiles));
			}
			return tiles;
		}

		static #generateChildMatrices(keyPointsChild) {

			const matricesChildBase = [];

			let point;

			for (const [childIndex, { sharedKeyPointIndices, angle }] of this.#rulesChildMatrix.entries()) {

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

			return this.#rulesKeyPoint.map(({ childIndex, keyPointIndex }) => {

				const matrixChild = matricesChild[childIndex];
				const keyPointChild = keyPointsChild[keyPointIndex];

				return matrixChild.transformPoint(keyPointChild);

			});

		}

		static #createSupertile(categoryID, tiles, matricesChild, supertiles) {

			const ruleChildCategory = this.#rulesChildCategory[categoryID];

			// 
			const supertile = new Supertile(categoryID, supertiles);

			for (const [childIndex, categoryIDChild] of ruleChildCategory.entries()) {
				if ( categoryIDChild >= 0 ) {
					supertile.addChild(tiles.get(categoryIDChild), matricesChild[childIndex]);
				}
			}

			return supertile;

		}

		static substituteTiles(tiles) {

			const keyPointsChild = tiles.keyPoints;

			const matricesChild = this.#generateChildMatrices(keyPointsChild);

			const keyPoints = this.#generateKeyPoints(keyPointsChild, matricesChild);

			const supertiles = new Tiles(keyPoints);
			for (let categoryID = 0; categoryID < Tiles.length; categoryID++) {
				supertiles.set(
					categoryID,
					this.#createSupertile(categoryID, tiles, matricesChild, supertiles)
				);
			}

			return supertiles;

		}

	};

	// 
	// モノタイル
	// 
	const Monotiles = class {

		renderer;

		#tiles;

		get canvas() {
			return this.renderer.canvas;
		}

		init({
			strict = false,
			width = 300,
			height = 150,
			matrix = matrixIdentity.scale(20),
			lineWidth = 2,
			radiusKeyPoint = 5,
			noFill = false,
			noStrokeQuad = false,
			noRenderCategoryName = true,
		} = {}) {

			const renderer = new Renderer();
			renderer.init({
				width, height,
				matrix,
				lineWidth, radiusKeyPoint,
				noFill, noStrokeQuad, noRenderCategoryName,
			});

			const tiles = Spectres.createTiles(strict);

			// 
			this.renderer = renderer;
			this.#tiles = tiles;

		}

		substitute() {
			this.#tiles = Spectres.substituteTiles(this.#tiles);
		}

		render(categoryID, matrix = matrixIdentity) {
			this.renderer.render(this.#tiles.get(categoryID), matrix);
		}

		renderKeyPoints(categoryID, matrix = matrixIdentity) {
			this.renderer.renderKeyPoints(this.#tiles.get(categoryID), matrix);
		}

		renderChildKeyPoints(categoryID, matrix = matrixIdentity) {
			this.renderer.renderChildKeyPoints(this.#tiles.get(categoryID), matrix);
		}

	};

	window.Monotiles = Monotiles;

})();
