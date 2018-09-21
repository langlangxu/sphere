const can = document.querySelector('#can1');
const ctx = can.getContext('2d');
const width = can.width;
const height = can.height;


// 查看位置
const camera = {
  x: width / 2,
  y: height / 2,
  nextY: 0, // 位置过渡用
  nextX: 0,
}
import Sphere from './Sphere';
import controller from './controller';

controller(camera);

import { interval, getGravitate2, random, collision } from './util';


const galaxy = [];

window.createSphere = function(opt) {
	galaxy.push(new Sphere(opt));
}

galaxy.push(new Sphere({
	size: 1000,
	x: 100,
	y: 0,
	angle: 0,
	speed: 0,
	ctx,
	color: '#900',
}));


// galaxy.push(new Sphere({
// 	size: 10000,
// 	x: 300,
// 	y: -100,
// 	angle: 180,
// 	speed: 1,
// 	color: '#090',
// 	ctx,
// }));

// galaxy.push(new Sphere({
// 	size: 10,
// 	x: 200,
// 	y: -100,
// 	angle: 180,
// 	speed: .2,
// 	ctx,
// }));



for (let i = 100; i--; ) {
	galaxy.push(new Sphere({
		size: 1,
		x: 10,
		y: i * 3,
		angle: 0,
		speed: 1,
		ctx,
		color: `rgb(${100 + i * 10},${100 + i * 10},${100 + i * 10})`,
	}));
	// galaxy.push(new Sphere({
	// 	size: random(5, 10) / 2,
	// 	x: random(10, 200) - 50,
	// 	y: random(10, 200) - 50,
	// 	angle: random(0, 360),
	// 	speed: random(10) / 10,
	// 	ctx,
	// 	color: `rgb(${random(155, 255)},${random(155, 255)},${random(155, 255)})`,
	// }));
}


function loop() {
  ctx.clearRect(0, 0, width, height);

  galaxy.forEach(sphere => {
		sphere.move(camera);
		galaxy.forEach(sphereB => {
      sphere.meet(sphereB);
		});
  });
	// const { angle, length } = getGravitate(galaxy[1], galaxy[0]);
	// galaxy[1].update({ angle, length, sphereB: galaxy[0] });

	// 控制相机
	const step = 0.1;
  if (camera.nextY !== 0) {
    camera.y += camera.nextY * step;
    camera.nextY -= camera.nextY * step;
  }

  if (camera.nextX !== 0) {
    camera.x += camera.nextX * step;
    camera.nextX -= camera.nextX * step;
  }
	interval(loop);
}

window.galaxy = galaxy;

interval(loop);