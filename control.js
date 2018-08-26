
// calculates the style of the hourglass
function calcOurglass(form) {
	const top1 = document.querySelector('div#top1');
	const top2 = document.querySelector('div#top2');
	const top3 = document.querySelector('div#top3');
	const top4 = document.querySelector('div#top4');
	const top5 = document.querySelector('div#top5');
	const bottom1 = document.querySelector('div#bottom1');
	const bottom2 = document.querySelector('div#bottom2');
	const bottom3 = document.querySelector('div#bottom3');
	const bottom4 = document.querySelector('div#bottom4');
	const bottom5 = document.querySelector('div#bottom5');
	const line1 = document.querySelector('div#line1');
	const line2 = document.querySelector('div#line2');
	const line3 = document.querySelector('div#line3');
	const line4 = document.querySelector('div#line4');
	const line5 = document.querySelector('div#line5');


	timeFactor = 60;

	console.log(top1)
	console.log(top5)
	console.log(bottom1)
	console.log(bottom5)
	console.log(line1)
	console.log(line5)



	// only one input variable with duration of each phase
	var duration = [parseFloat(form.time1.value), parseFloat(form.time2.value), parseFloat(form.time3.value), parseFloat(form.time4.value), parseFloat(form.time5.value)];
	console.log(duration)

	console.log(form.phased.value)

	// style variables (maybe import from css)
	var height_triangle = 100;
	var width_triangle = 50;
	var phi_triangle = 45 / 180 * Math.PI;


	// base length of very first triangle
	var a_0 = 0;

	// calc area of surrounding triangle
	var A_triangle = height_triangle * width_triangle / 2;
	// total time (to calculate areas of sub triangles)
	var time_total = duration.reduce((x, y) => x + y);

	// initialize h_vec (it holds all the heights of a singular triangle
	h_output_top = [];
	h_output_bottom = [];
	var a_i = a_0;
	for(let i = 0; i < duration.length; i++) {
		let area_i = A_triangle * duration[i] / time_total;

		h_output_top[i] = -1*(Math.tan(phi_triangle) * a_i) / 2 + Math.sqrt(Math.pow((Math.tan(phi_triangle) * a_i) / 2, 2) + Math.tan(phi_triangle) * area_i)

		a_i = 2 * h_output_top[i] / Math.tan(phi_triangle) + a_i;
		
		h_output_bottom[i] = Math.sqrt(area_i * 2 / Math.tan(phi_triangle));
	}
	heights_triangles_top = calcNormHeights(h_output_top)
	heights_triangles_bottom = calcNormHeights(h_output_bottom)


	// set heights of triangles
	top1.style.setProperty('--top1-scale', heights_triangles_top[4])
	top2.style.setProperty('--top2-scale', heights_triangles_top[3])
	top3.style.setProperty('--top3-scale', heights_triangles_top[2])
	top4.style.setProperty('--top4-scale', heights_triangles_top[1])
	top5.style.setProperty('--top5-scale', heights_triangles_top[0])
	bottom1.style.setProperty('--bottom1-scale', heights_triangles_bottom[4])
	bottom2.style.setProperty('--bottom2-scale', heights_triangles_bottom[3])
	bottom3.style.setProperty('--bottom3-scale', heights_triangles_bottom[2])
	bottom4.style.setProperty('--bottom4-scale', heights_triangles_bottom[1])
	bottom5.style.setProperty('--bottom5-scale', heights_triangles_bottom[0])


	//Copy initial array
	var duration_triangles = duration.concat();
	// cummulative sum to get total animation time
	console.log(duration)
	for (var i = 1; i < duration_triangles.length; i++) {
		duration_triangles[i] = duration_triangles[i-1] + duration_triangles[i];
	}

	// set animation duration based on user input
	top1.style.animationDuration =  (duration_triangles[4] * timeFactor).toString() + 's';
	top2.style.animationDuration =  (duration_triangles[3] * timeFactor).toString() + 's';
	top3.style.animationDuration =  (duration_triangles[2] * timeFactor).toString() + 's';
	top4.style.animationDuration =  (duration_triangles[1] * timeFactor).toString() + 's';
	top5.style.animationDuration =  (duration_triangles[0] * timeFactor).toString() + 's';
	line1.style.animationDuration =  (duration_triangles[4] * timeFactor).toString() + 's';
	line2.style.animationDuration =  (duration_triangles[3] * timeFactor).toString() + 's';
	line3.style.animationDuration =  (duration_triangles[2] * timeFactor).toString() + 's';
	line4.style.animationDuration =  (duration_triangles[1] * timeFactor).toString() + 's';
	line5.style.animationDuration =  (duration_triangles[0] * timeFactor).toString() + 's';
	bottom1.style.animationDuration =  (duration_triangles[4] * timeFactor).toString() + 's';
	bottom2.style.animationDuration =  (duration_triangles[3] * timeFactor).toString() + 's';
	bottom3.style.animationDuration =  (duration_triangles[2] * timeFactor).toString() + 's';
	bottom4.style.animationDuration =  (duration_triangles[1] * timeFactor).toString() + 's';
	bottom5.style.animationDuration =  (duration_triangles[0] * timeFactor).toString() + 's';


	// set color of triangle
	top1.style.borderTopColor =  selectColor(form.phasee.value);
	top2.style.borderTopColor =  selectColor(form.phased.value);
	top3.style.borderTopColor =  selectColor(form.phasec.value);
	top4.style.borderTopColor =  selectColor(form.phaseb.value);
	top5.style.borderTopColor =  selectColor(form.phasea.value);
	bottom1.style.borderBottomColor =  selectColor(form.phasee.value);
	bottom2.style.borderBottomColor =  selectColor(form.phased.value);
	bottom3.style.borderBottomColor =  selectColor(form.phasec.value);
	bottom4.style.borderBottomColor =  selectColor(form.phaseb.value);
	bottom5.style.borderBottomColor =  selectColor(form.phasea.value);
	line1.style.borderLeftColor =  selectColor(form.phasee.value);
	line2.style.borderLeftColor =  selectColor(form.phased.value);
	line3.style.borderLeftColor =  selectColor(form.phasec.value);
	line4.style.borderLeftColor =  selectColor(form.phaseb.value);
	line5.style.borderLeftColor =  selectColor(form.phasea.value);

}

var paused = false; // TODO This is bad
function clearOurglass(form){
	if(paused){
		paused = false;
		//document.body.className="";
		document.getElementById("top5").classList.remove("paused");
		document.getElementById("top4").classList.remove("paused");
		document.getElementById("top3").classList.remove("paused");
		document.getElementById("top2").classList.remove("paused");
		document.getElementById("top1").classList.remove("paused");
		document.getElementById("bottom5").classList.remove("paused");
		document.getElementById("bottom4").classList.remove("paused");
		document.getElementById("bottom3").classList.remove("paused");
		document.getElementById("bottom2").classList.remove("paused");
		document.getElementById("bottom1").classList.remove("paused");
		document.getElementById("line5").classList.remove("paused");
		document.getElementById("line4").classList.remove("paused");
		document.getElementById("line3").classList.remove("paused");
		document.getElementById("line2").classList.remove("paused");
		document.getElementById("line1").classList.remove("paused");
	}
	else{
		paused = true;
		document.getElementById("top5").classList.add("paused");
		document.getElementById("top4").classList.add("paused");
		document.getElementById("top3").classList.add("paused");
		document.getElementById("top2").classList.add("paused");
		document.getElementById("top1").classList.add("paused");
		document.getElementById("bottom5").classList.add("paused");
		document.getElementById("bottom4").classList.add("paused");
		document.getElementById("bottom3").classList.add("paused");
		document.getElementById("bottom2").classList.add("paused");
		document.getElementById("bottom1").classList.add("paused");
		document.getElementById("line5").classList.add("paused");
		document.getElementById("line4").classList.add("paused");
		document.getElementById("line3").classList.add("paused");
		document.getElementById("line2").classList.add("paused");
		document.getElementById("line1").classList.add("paused");
	}
}

// starts the animation by assigning object class to html elements
function anitop(){
	document.getElementById("top5").className = "top5";
	document.getElementById("top4").className = "top4";
	document.getElementById("top3").className = "top3";
	document.getElementById("top2").className = "top2";
	document.getElementById("top1").className = "top1";
	document.getElementById("bottom5").className = "bottom5";
	document.getElementById("bottom4").className = "bottom4";
	document.getElementById("bottom3").className = "bottom3";
	document.getElementById("bottom2").className = "bottom2";
	document.getElementById("bottom1").className = "bottom1";
	document.getElementById("line5").className = "line5";
	document.getElementById("line4").className = "line4";
	document.getElementById("line3").className = "line3";
	document.getElementById("line2").className = "line2";
	document.getElementById("line1").className = "line1";
}


function calcNormHeights(heights_triangles){
	//Copy initial array
	//var heights_triangles = h_output_top.concat();
	// cumsum
	for (var i = 1; i < heights_triangles.length; i++) {
		heights_triangles[i] = heights_triangles[i-1] + heights_triangles[i];
	}
	// Norm heights
	for(let i = 0; i < heights_triangles.length; i++) {
		heights_triangles[i] = heights_triangles[i] / heights_triangles[heights_triangles.length - 1];
	}

	// output heights
	console.log(heights_triangles)
	return heights_triangles;
}


// Color selector (the values from the dropdown menu are connect to a color here)
function selectColor(phaseId){
	switch(parseInt(phaseId)) {
		case 1:
			colorString =  "rgb(113, 153, 255)"; // blau
			break;
		case 2:
			colorString =  "rgb(255, 153, 153)";  //rot
			break;
		case 3:
			colorString =  "rgb(153, 255, 255)"; //türkis
			break;
		case 4:
			colorString =  "rgb(153, 255, 153)"; //grün
			break;
		case 5:
			colorString =  "rgb(227, 197, 120)"; //gelb
			break;
		default:
			colorString =  "rgb(255, 255, 255)"; //white
	}
	console.log(colorString)
	return colorString;
}
