# WebGL-Shader-Demo
This project includes a scene depicting either a triforce or a sphere with a variety of different shading effects. These shading effects utilize a combination of reflection or refraction of the cube-mapped skybox and a red directional light source placed in front of the object.

##### Controls:
	Key Presses:
	s - Switch model
	d - Toggle sound on/off
	1 - Load gold reflective material
	2 - Load mirror / steel material
	3 - Load glass material
	4 - Load good material of the north
	5 - Load only specular lit material
	6 - Load only specular lit material with reflection
	7 - Load special glitchy material
	 
	Mouse Controls:
	Left Click and Drag - Rotate world
	Right Click and Drag - Adjust zoom distance
  
##### Cross Origin Issues:
  If you run into CORS issues when running this project locally, use the terminal to navigate to project directory, and start a simple http server with Python. This command for this is:
  ```
  python -m SimpleHTTPServer
  ```
  
  Then in your browser, navigate to http://127.0.0.1:8000, or change the port number to the corresponding port being used by the Python server.
