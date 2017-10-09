var YawPitchCamera = function(initialEye, initialAt) {
 	this.phi = 0.0;
	this.theta = 0.0;
  	this.zoomDistance = 10.0;

  	this.initialEye = vec3(initialEye);
	this.currentEye = vec3(initialEye);
	this.currentAt = vec3(initialAt);

	this.rotation_active = false;
	this.zoom_active = false;
	this.mouseMovementDamper = -0.005;
	this.zoomDamper = -0.01;

	this.maxPhi = 1.5;
	this.minPhi = -1.5;
	this.minZoomDistance = 0.1;

	this.updateEye = function() {
		var tempEye = vec4(this.initialEye, 0.0);
		tempEye[2] = this.zoomDistance;
		tempEye = mult(rotateX(degrees(this.phi)), tempEye);
		tempEye= mult(rotateY(degrees(this.theta)), tempEye);
		this.currentEye = vec3(tempEye[0], tempEye[1], tempEye[2]);
	};

	this.handleMouseMove = function(event) {
		if (camera.rotation_active) {
			this.theta += event.movementX * this.mouseMovementDamper;
			this.phi += event.movementY * this.mouseMovementDamper;

			if (this.phi > this.maxPhi) {
				this.phi = this.maxPhi;
			}
			if (this.phi < this.minPhi) {
				this.phi = this.minPhi;
			}
			this.updateEye();
		} else if (camera.zoom_active) {
			this.zoomDistance += event.movementY * this.zoomDamper;
			if (this.zoomDistance < this.minZoomDistance) {
				this.zoomDistance = this.minZoomDistance;
			}
			this.updateEye();
		}
	};

	this.handleMouseDown = function(event) {
		if (event.button == 0) {
			this.rotation_active = true;
		} else if (event.button == 2) {
			this.zoom_active = true;
		}
	};

	this.handleMouseUp = function(event) {
		this.rotation_active = false;
		this.zoom_active = false;
	};
};
