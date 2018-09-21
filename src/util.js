/*

*/
const PI = Math.PI;

// 角度求弧度
export function radian(angle) {
  // return 2 * PI / 360 * angle;
  return PI / 180 * angle;
}

// 弧度求角度
export function aradian(rad) {
  return 180 / PI * rad;
}

// 获取区间随机数
export function random(min, max) {
	if (max === undefined) {
		max = min;
		min = 0;
	}
  return ~~(Math.random() * (max - min + 1)) + min;
}

// T 根据质量求半径
// S 根据面积求半径
export function getRadius(T) {
	// const S = T;
	// S = PI * r * r
 	// T = 4 / 3 * PI * r * r;
	// return Math.sqrt(S / PI);
	return Math.cbrt(T / (4 / 3) / PI);
}

export function cos(c) {
  return Math.cos(radian(c));
}

export function acos(m) {
  return aradian(Math.acos(m));
}

export function sin(c) {
  return Math.sin(radian(c));
}

export function asin(c) {
  return aradian(Math.asin(c));
}

export function interval(func) {
	setTimeout(func)
	// requestAnimationFrame(func);
}

// @params: sphereA, sphereB
export function collision(A, B) {
  const { length } = getGravitate(A, B);
  const min = A.r + B.r;
  if (length < min) {
    return true;
  }
}


// 获取两点的距离和角度
export function getGravitate(pointA, pointB) {
	/*

      pointA
      |\
      | \ c
    a |  \   pointB  钝角  A + (180 - 点2.angle)
      |___\____________
        b      d

  */

	// 两个球之间的距离 c
  const a = pointA.y - pointB.y;
  const b = pointA.x - pointB.x;
  // c*c === a*a + b*b;
  const c = Math.sqrt(a*a + b*b);
  const C = 90;
  // c/sin(C) === a/sin(A)
  // sin(A) = a/(c/sin(C));
  let A = asin(a / (c / sin(C)));
  if (isNaN(A)) A = 0;
  // 点2钝角
  let E;
  if (b < 0) {
    E = 360 - A;
  } else {
    E = A + 180;
  }
  // if (!c) {
  //   return;
  // }
  return { angle: E, length: c || 0 };
};
