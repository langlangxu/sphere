import { getGravitate, getPosition, getRadius, cos, sin, asin, collision, random } from './util';

// 引力系数 能够控制距离对引力的影响
// 系数越小，坠落 逃离 的速度阀值越大，
// const DECAYRATIO = 4 * Math.PI;
const DECAYRATIO = 12;
const PARTICLE = 3;

class Sphere {
	constructor({ size, x, y, angle, speed, ctx, color, count }) {
		this.ctx = ctx;
		this.x = x;
		this.y = y;
		this.size = size;
		this.angle = angle;
		this.r = getRadius(size);
		this.speed = speed;

		this.color = color || '#933';
		this.count = count || 0;
	}
	move(camera) {
		// mock 两个大的先不动
		// if (this.size === 10000) return this.draw(camera);
		if (this.died) return;
		const { x, y } = this.getNext();
		this.x = x;
		this.y = y;
		this.draw(camera);
	}
	hit(sphereB, angle) {
		if (sphereB.size > this.size) {
			return sphereB.hit(this, angle + 180);
		}
		// this.blast(sphereB);

		angle = (angle + 180) % 360;
		const b2 = sphereB.speed * sphereB.size / this.size;
		// this.update({ angle, b2 });

		this.size += sphereB.size;
		this.r = getRadius(this.size);
		sphereB.died = true;
	}
	die() {
		this.died = true;
	}
	blast(sphereB) {
		this.die();
		sphereB.die();
		const size = this.size + sphereB.size;
		const num = 100;

		for (let i = num; i--; ) {
			createSphere({
				size: size / num,
				x: (this.x + sphereB.x) / 2,
				y: (this.y + sphereB.y) / 2,
				speed: .1,
				ctx: this.ctx,
				angle: random(0, 359),
			})
		}

	}
	// 计算B对this的影响
	meet(sphereB) {
		// 相互作用，必须两个都存在，并且都是激活状态
		if (this === sphereB) return;
		if (this.died || sphereB.died) return;

		const { angle, length } = getPosition(this, sphereB);
		if (collision(this, sphereB, length)) {
			// 碰撞
			this.hit(sphereB, angle);
		} else {
			this.update({angle, length, sphereB});
		}
	}
	// 受到其他天体影响，改变自身的移动参数
	update({ angle, length, sphereB, b2}) {
		angle = angle % 360;
		/*
			 											sphereB
									 B 	       /
	  this next    A \			  /
									\ \   	 /
									 \ \    /
			   this.speed \	\	 /
									   \ \/
									    \/ 偏移量 (length * 引力衰减系数(length))
								     this

			B为实际受影响后的点，从this到B为新的速度和角度

-------------------------------------------------------------
						actual
						 B
						 \	
		next      \ 
			A 			 \
			\				  \                   sphereB
			 \				 \ a    				_-'
			  \					\					 _-'	
			   \				 \      _-'
	  speed \         \  _-'
			     \				_-' - - - - - - - - - - - - - - - - D
						\    _-'   C
						 \_-'  b
						this        

				求 this 到 B的角度和距离
		*/
		
		// 使用新的引力衰减公式
		let b = b2 || getGravitate(sphereB.size, this.size, length);
		if (this.size === 1000) {

			// debugger
		}

		// b为衰减后引力，考虑this的质量，需要根据this的质量计算对this的偏移量的影响
		// 即this质量越大，影响越小
		// b = b / this.size;

		const a = this.speed;
		// this ~ B 为 c
		// <C = 180 - (<sphereB,B,D - <BCD)
		const C = 180 - (angle - this.angle);
		// const C = 0;

		// 三角公示求出 c A
		const c = Math.sqrt(a * a + b * b - 2 * a * b * cos(C));
    const A = asin(b/(c/sin(C)));

    // if (c > 10) {
    // 	debugger;
    // }
    // console.log(length, angle, c, A);
    this.speed = c || 0;
    if (a === 0) {
    	// this.speed = b;
    	this.angle = angle;
    } else {
    	this.angle += (A || 0);
    	this.angle = this.angle % 360;
    }
	}
	// 获取下一个点的坐标
	getNext() {
		/*

		 next point	
			|\
			| \
		a	|  \ c
			|   \
			|____\ 
				b 	 now point

		*/
		const c = this.speed; // 移动的长度
    const A = this.angle; // 移动的角度
    // const rca = radian(ca);
    const a = cos(A) * c;
    const b = sin(A) * c;
    return {
      x: this.x + a,
      y: this.y + b,
    };
	}
	draw(camera) {
		const { ctx } = this;
		ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x + camera.x, this.y + camera.y, this.r ,0, 2*Math.PI);
    ctx.fill();
	}
}



export default Sphere;
