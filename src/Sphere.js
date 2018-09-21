import { getGravitate, getRadius, cos, sin, asin } from './util';

// 引力系数 能够控制距离对引力的影响
// 系数越小，坠落 逃离 的速度阀值越大，
// const DECAYRATIO = 4 * Math.PI;
const DECAYRATIO = 6;


class Sphere {
	constructor({ size, x, y, angle, speed, ctx, color }) {
		this.ctx = ctx;
		this.x = x;
		this.y = y;
		this.size = size;
		this.angle = angle;
		this.r = getRadius(size);
		this.speed = speed;

		this.color = color || '#933';
	}
	move(camera) {
		if (this.died) return;
		const { x, y } = this.getNext();
		this.x = x;
		this.y = y;
		this.draw(camera);
	}
	hit(sphereB) {
		if (sphereB.size > this.size) {
			return sphereB.hit(this);
		}
		
		this.size += sphereB.size;
		this.r = getRadius(this.size);
		// angle += 180;
		sphereB.died = true;
	}
	// 受到其他天体影响，改变自身的移动参数
	update({ angle, length, sphereB}) {
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

		// 变量小写是边，大写是对角
		// 计算 三角形 this，B ，C
		// this 到 C 的距离，需要乘一个衰减系数
		const decay = (length * length) * DECAYRATIO;
		let b =  sphereB.size / decay;
		// b为衰减后引力，考虑this的质量，需要根据this的质量计算对this的偏移量的影响
		// 即this质量越大，影响越小
		b = b / this.size;

		const a = this.speed;
		// this ~ B 为 c
		// <C = 180 - (<sphereB,B,D - <BCD)
		const C = 180 - (angle - this.angle);
		// const C = 0;

		// 三角公示求出 c A
		const c = Math.sqrt(a * a + b * b - 2 * a * b * cos(C));
    const A = asin(b/(c/sin(C)));

    this.speed = c || 0;
    if (a === 0) {
    	this.angle = angle;
    } else {
    	this.angle += (A || 0);
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
