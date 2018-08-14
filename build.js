
// only one input variable with duration of each phase
var duration = [1,1,1,1,1];


// style variables
var height_triangle = 100;
var width_triangle = 50;
var phi_triangle = 45 / 180 * Math.PI;


// 
var a_0 = 0;

var A_triangle = height_triangle * width_triangle / 2;
var time_total = duration.reduce((x, y) => x + y);


h_output = [];
var a_i = a_0;
for(var i = 0; i < duration.length; i++) {
	let area_i = A_triangle * duration[i] / time_total;
	//console.log(a_i)
	
	h_output[i] = -1*(Math.tan(phi_triangle) * a_i) / 2 + Math.sqrt(Math.pow((Math.tan(phi_triangle) * a_i) / 2, 2) + Math.tan(phi_triangle) * area_i)

	console.log()
	
	a_i = 2 * h_output[i] / Math.tan(phi_triangle) + a_i;
}

console.log(h_output)