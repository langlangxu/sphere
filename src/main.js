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

import { interval, getGravitate, random, collision } from './util';


const galaxy = [];

galaxy.push(new Sphere({
	size: 100,
	x: 100,
	y: 0,
	angle: 120,
	speed: .3,
	ctx,
}));



for (let i = 1000; i--; ) {
	galaxy.push(new Sphere({
		size: random(1, 10) / 10,
		x: random(10, 200),
		y: random(10, 200),
		angle: random(0, 360),
		speed: random(10) / 10,
		ctx,
		color: `rgb(${random(155, 255)},${random(155, 255)},${random(155, 255)})`,
	}));
}


function loop() {
  ctx.clearRect(0, 0, width, height);

  galaxy.forEach(sphere => {
		sphere.move(camera);
		galaxy.forEach(sphereB => {
			if (sphereB === sphere) return;
      if (sphere.died || sphereB.died) return;
      if (collision(sphere, sphereB)) {
        sphere.hit(sphereB);
      } else {
        const { angle, length } = getGravitate(sphere, sphereB);
        sphere.update({ angle, length, sphereB });
      }
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