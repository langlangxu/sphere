export default function(camera) {

	document.onkeyup = function(e) {

		const step = 300;
	  const code = e.keyCode;
	  if (code === 38) {
	    camera.nextY += step
	  }

	  if (code === 40) {
	    camera.nextY -= step
	  }

	  if (code === 37) {
	    camera.nextX += step


	  }
	  if (code === 39) {
	    camera.nextX -= step
	  }
	}
};
