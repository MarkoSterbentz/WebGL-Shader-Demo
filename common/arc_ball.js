var ArcBall = function(origin, distance) {
	this.last_mx = 0;
	this.last_my = 0;
	this.cur_mx = 0;
	this.cur_my = 0;

	this.last_clientY = 0;
	this.cur_clientY = 0;

	this.arcball_on = false;
	this.zoom_active = false;
	this.zoomSpeed = 10;

	this.rotationAxis = vec3(0.0, 0.0, 0.0);
	this.rotationAngle = vec3(0.0, 0.0, 0.0);

	this.origin = origin;
	this.distance = distance;
	this.deltaDistance = 0;

	this.eye = undefined;

	this.sceneRotationMatrix = mat4();

	this.computeAngleAndAxis = function() {
	 	if (this.cur_mx != this.last_mx || this.cur_my != this.last_my) {
	 		var pp = this.getArcballVector(this.last_mx, this.last_my);
	 		var qp = this.getArcballVector(this.cur_mx, this.cur_my);
	 		this.rotationAngle = Math.min(1.0, Math.acos(dot(pp, qp)));

	 		this.rotationAxis = cross(pp, qp);

	 		this.last_mx = this.cur_mx;
	 		this.last_my = this.cur_my;

 		  	this.sceneRotationMatrix = mult(rotate(degrees(this.rotationAngle), this.rotationAxis), this.sceneRotationMatrix);
	 	}
	};

	this.getArcballVector = function(x, y) {
		// x and y must be in canvas coordinates
		return normalize(vec3(x, y, Math.sqrt(Math.sqrt(3) - (x * x) + (y * y))));
	};

	this.handleLeftMouseDown = function(x, y) {
		this.arcball_on = true;
		// convert to canvas coordinates
	    x = ((event.clientX - canvas.offsetLeft) / canvas.width) * 2.0 - 1.0;
  		y = -(((event.clientY - canvas.offsetTop) / canvas.height) * 2.0 - 1.0);
		this.last_mx = x;
		this.last_my = y;
		this.cur_mx = x;
		this.cur_my = y;
	};

	this.handleRightMouseDown = function(clientX, clientY) {
		this.zoom_active = true;
		this.last_clientY = clientY;
		this.cur_clientY = clientY;
	};

	this.handleMouseUp = function() {
		this.arcball_on = false;
		this.zoom_active = false;
		this.distance += this.deltaDistance;
		this.deltaDistance = 0;
	};

	this.handleMouseMove = function(clientX, clientY) {
	    var x = ((clientX - canvas.offsetLeft) / canvas.width) * 2.0 - 1.0;
  		var y = -(((clientY - canvas.offsetTop) / canvas.height) * 2.0 - 1.0);
		if (this.arcball_on) {
			this.cur_mx = x;
			this.cur_my = y;
			this.computeAngleAndAxis();
		} else if (this.zoom_active) {
			this.cur_clientY = clientY;
			this.calculateZoom();
		}
	};

	this.calculateZoom = function() {
		this.last_clientY -= canvas.offsetTop;
		this.cur_clientY -= canvas.offsetTop;
		var dragDistance = this.last_clientY - this.cur_clientY;
		dragDistance = dragDistance * this.zoomSpeed / canvas.height;
		if (this.distance + dragDistance > 0.1) {
			this.deltaDistance = dragDistance;
		}
	};
};
