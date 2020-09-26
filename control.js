///-------------------------------------------------------------------------///
///                         GLUMT OURLGASS CONTROL                          ///
///-------------------------------------------------------------------------///

// --- Global time factor for debug purpose (default: 60 for seconds)
const g_TIME_FACTOR = 60;

const g_OURGLASSCONT_HEIGHT = 300;
const g_OURGLASSCONT_WIDTH = 475;

const g_PHASENAMES = ['Unterrichtsgespräch', 'Einzelarbeit', 'Partnerarbeit', 'Gruppenarbeit', 'Organisation', 'Ourglass ist abgelaufen.']

var g_START = 0.0
var g_PAUSE = 0.0
var g_HOLD = 0.0


// --- End of global variables definition


// Main function (Start and reset button)
function startOurglass(form) {

	const fillButton = document.getElementById("pbFill");
	if(fillButton.value == "Füllen"){
		// Change button text and set other buttons initial condition
		fillButton.value = "Reset";
		document.getElementById("pbPause").value = "Pause";

		// CONSTANTS
		// style parameters (maybe import from css)
		const heightTriangle = 100;
		const widthTriangle = 200;
		const triangleAngle = Math.atan(widthTriangle / 2 / heightTriangle);
		const volumeTotal = Math.PI/3 * Math.tan(triangleAngle) * heightTriangle**3;
		const areaTotal = Math.tan(triangleAngle) * heightTriangle**2 / 2;
		const openingRadius = 1;
		const distanceTopDown = 75;

		// Max number of phases (depend on form implementation in HTML)
		const maxPhases = 5;


		// parse form (color phase and duration), count number of valid phases and save them in the ourglassContainer
		var phaseDuration = [];
		var phaseType = [];
		var noPhases = 0;
		for(let i = 0; i < maxPhases; i++) {
			phaseDuration[i] = parseFloat(form[i * 2 + 1].value);
			phaseType[i] = parseFloat(form[i * 2].value);
			if (phaseDuration[i] != 0 && phaseType[i] != 0) {
				noPhases= noPhases + 1;
			}
		}
		document.getElementById("ourglassContainer").setAttribute('value', noPhases.toString());

		// Calculate cummulative time of all phases, total time and virtual volume flow speed
		var cumDuration = [];
		cumDuration[0] = phaseDuration[0];
		for (var i = 1; i < noPhases; i++) {
			cumDuration[i] = cumDuration[i-1] + phaseDuration[i];
		}
		var totalTime = cumDuration[cumDuration.length - 1];
		const volSpeed = Math.round(areaTotal / totalTime);

		// Calculate ourglass heights
		triangleHeights = calcTriangleHeights(cumDuration, areaTotal, volSpeed, triangleAngle);
		// Construct the ourglass
		addTriangles('down', phaseType, triangleHeights, triangleAngle, cumDuration, distanceTopDown, 0)
		addTriangles('up', phaseType, triangleHeights, triangleAngle, cumDuration, distanceTopDown, cumDuration.length)
		addLines(phaseType, triangleHeights, triangleAngle, cumDuration, distanceTopDown)

		// Set animatino for ourglass container after everything is created
		// This will trigger the animation
		document.getElementById("ourglassContainer").style.animation = 'showOurglassContainer 1s ease-in-out';
		document.getElementById("ourglassContainer").style.animationFillMode = 'forwards';

        toggleSpeedButtons();
	} else {
		// Reset functionallity

		// Remove all created elements which construct the ourglass
		fillButton.value = "Füllen";
		document.getElementById('ourglassContainer').innerHTML = "";
		document.getElementById("ourglassContainer").style.animationFillMode = 'backwards';
		document.getElementById('ourglassContainer').style.zIndex = -1;

		document.getElementById("pbPause").value = "Pause";

		var phaseNameDivs = document.getElementsByClassName("phaseContainer");
		noPhaseNames = phaseNameDivs.length;
		for (var i = phaseNameDivs.length - 1; i > -1; i--) {
			phaseNameDivs[i].parentNode.removeChild(phaseNameDivs[i]);
		}
        toggleSpeedButtons();
	}
    g_START = Date.now()/1000;
    g_PAUSE = 0.0;
    g_HOLD = 0.0;


}

function toggleSpeedButtons() {

    if (document.getElementById('pbSpeed').style.visibility == 'visible') {
        document.getElementById('pbSpeed').style.visibility = 'hidden';
        document.getElementById('pbSlow').style.visibility = 'hidden';
    } else {
        document.getElementById('pbSpeed').style.visibility = 'visible';
        document.getElementById('pbSlow').style.visibility = 'visible';
    }
}


// Puase and resume button
function pauseAnimation() {

	const pauseButton = document.getElementById("pbPause");
	noPhases = parseFloat(document.getElementById("ourglassContainer").getAttribute('value'));

	if(pauseButton.value == "Fortsetzen"){
        g_PAUSE = g_PAUSE + Date.now()/1000 - g_HOLD;
        toggleSpeedButtons();

		pauseButton.value = "Pause";
		// Resume animation
		for (let i = 0; i < noPhases * 2; i++) {
			document.getElementById("tri" + i.toString()).classList.remove("paused");
		}

		// Show line and resume text animation
		for (let i = 0; i < noPhases; i++) {
			line = document.getElementById("line" + i.toString());
			line.classList.remove("paused");
			line.style.visibility = "visible";

			document.getElementById('phase' + i.toString()).classList.remove("paused");
		}
	} else {
        g_HOLD = Date.now()/1000;
        toggleSpeedButtons();

		pauseButton.value = "Fortsetzen";
		// Pause animation
		for (var i = 0; i < noPhases * 2; i++) {
			document.getElementById('tri' + i.toString()).classList.add("paused");
		}

		// Hide Line and pause text animation
		for (let i = 0; i < noPhases; i++) {
			line = document.getElementById("line" + i.toString());
			line.classList.add("paused");
			line.style.visibility = "hidden";

			document.getElementById('phase' + i.toString()).classList.add("paused");
		}
	}
}



// --- Auxiliary functions

// Calculation of tirangle heights by phase duration
function calcTriangleHeights(cumDuration, areaTotal, volSpeed, triangleAngle) {
	var triangleHeights = [];
	for (var i = 0; i < cumDuration.length; i++) {
		areaPhase = volSpeed * cumDuration[i];
		triangleHeights[i] = Math.sqrt(2 * areaPhase / Math.tan(triangleAngle));
	}
	return triangleHeights
}


// Add triangle elements by creating div elements with triangle design and put them into the ourglass container
function addTriangles(triDir, phaseType, triangleHeights, triangleAnlge, cumDuration, distanceTopDown, triCount) {

	ourglassContainer = document.getElementById("ourglassContainer");

	centerWidth = g_OURGLASSCONT_WIDTH / 2;
	ankerHeight =  Math.round(triangleHeights[cumDuration.length - 1])

	firstHeight = Math.round(triangleHeights[0]);
	firstWidth = Math.round(Math.tan(triangleAnlge) * firstHeight);

	for(let i = 0; i < cumDuration.length; i++) {
		var triangle = document.createElement("DIV");
		triangle.setAttribute('class', 'triangle-' + triDir);
		triangle.setAttribute('id', 'tri' + (i + triCount).toString());

		triangle.style.animationDuration = (cumDuration[i] * g_TIME_FACTOR).toString() + 's';

		height = Math.round(triangleHeights[i]);
		widthHalf = Math.round(Math.tan(triangleAnlge) * height);

		triangle.style.left = (centerWidth - widthHalf).toString() + 'px' ;
		triangle.style.zIndex = -(cumDuration.length - 1) * i;
		if (triDir.localeCompare('down') == 0) {
			triangle.style.borderTopWidth = (height).toString() + 'px ';
			triangle.style.borderRightWidth = (widthHalf).toString() + 'px ';
			triangle.style.borderBottomWidth = '0 px ';
			triangle.style.borderLeftWidth = (widthHalf).toString() + 'px';

			triangle.style.top = (ankerHeight - height).toString() + 'px' ;
			triangle.style.borderTopColor = selectColor(phaseType[i]);
		} else {
			triangle.style.borderTopWidth = '0 px ';
			triangle.style.borderRightWidth = (widthHalf).toString() + 'px ';
			triangle.style.borderBottomWidth = (height).toString() + 'px ';
			triangle.style.borderLeftWidth = (widthHalf).toString() + 'px';

			triangle.style.top = (distanceTopDown + 2 * ankerHeight - height).toString() + 'px' ;
			triangle.style.borderBottomColor = selectColor(phaseType[i]);
		}
		ourglassContainer.appendChild(triangle);
	}
}


// Add line and text animation
function addLines(phaseType, triangleHeights, triangleAnlge, cumDuration, distanceTopDown) {
	// get object handle for the containers
	ourglassContainer = document.getElementById("ourglassContainer");
	contentDiv = document.getElementById("contentDiv");

    // initial height and position for line elements
	centerWidth = g_OURGLASSCONT_WIDTH / 2;
	ankerHeight =  Math.round(triangleHeights[cumDuration.length - 1]);
	firstHeight = Math.round(triangleHeights[0]);
	widthHalf = Math.round(Math.tan(triangleAnlge) * triangleHeights[0]);

	// Initial animation duration and delay
	var aniDelay = 0.0;
	var aniDuration = cumDuration[0];
	for(let i = 0; i < cumDuration.length; i++) {
		// Create div elements with line animation and put them into the ourglass container
		var line = document.createElement("DIV");
		line.setAttribute('class', 'line-down');
		line.setAttribute('id', 'line' + (i).toString());

		line.style.left = (centerWidth).toString() + 'px';
		line.style.top = (ankerHeight).toString() + 'px';
		line.style.height = (distanceTopDown +  + ankerHeight).toString() + 'px';

		aniDuration = cumDuration[i] - aniDelay;
		line.style.animationDelay = ((aniDelay)* g_TIME_FACTOR).toString() + 's';
		line.style.animationDuration = ((aniDuration)* g_TIME_FACTOR).toString() + 's';

		line.style.borderLeftColor = selectColor(phaseType[i]);
		line.style.zIndex = -(cumDuration.length - 1) * i;

		ourglassContainer.appendChild(line);


		// Create div elements with phase text and put them into the phase container
		var phase = document.createElement("DIV");
		phase.setAttribute('class', 'phaseContainer');
		phase.setAttribute('id', 'phase' + (i).toString());

		phase.style.animationDelay = ((aniDelay)* g_TIME_FACTOR).toString() + 's';
		phase.style.animationDuration = ((aniDuration)* g_TIME_FACTOR).toString() + 's';

		phase.innerHTML = g_PHASENAMES[phaseType[i]-1];
		contentDiv.appendChild(phase);


		// Update delay time for next loop
		aniDelay = cumDuration[i];
	}
}


function speedUp() {
    timeStretch(1/2);
}


function slowDown() {
    timeStretch(2);
}

function timeStretch(timefactor) {

    if (timefactor > 1) {
        delaySign = -1
    } else {
        delaySign = 1
    }

	pauseAnimation()
	clickTime = Date.now()/1000
	elapsedTime = clickTime - g_START - g_PAUSE
	g_START = g_START + elapsedTime * timefactor

	ourglassContainer = document.getElementById("ourglassContainer");
	ourglassElements = ourglassContainer.children;
	for(let i = 0; i < (ourglassElements.length); i++) {

		tmpDuration = parseFloat(ourglassElements[i].style.animationDuration)
		newDuration = tmpDuration * timefactor
		ourglassElements[i].style.animationDuration = (newDuration).toString() + 's';

		tmpDelay = parseFloat(ourglassElements[i].style.animationDelay)
		if (isNaN(tmpDelay)) {
			tmpDelay = 0.0
		}
		newDelay = (tmpDelay + delaySign * elapsedTime) * timefactor
		ourglassElements[i].style.animationDelay = (newDelay).toString() + 's';
	}

	phaseContainer = document.getElementsByClassName("phaseContainer");
	for(let i = 0; i < (phaseContainer.length); i++) {

		tmpDuration = parseFloat(phaseContainer[i].style.animationDuration)
		newDuration = tmpDuration * timefactor
		phaseContainer[i].style.animationDuration = (newDuration).toString() + 's';

		tmpDelay = parseFloat(phaseContainer[i].style.animationDelay)
		if (isNaN(tmpDelay)) {
			tmpDelay = 0.0
		}
		newDelay = (tmpDelay + delaySign * elapsedTime) * timefactor
		phaseContainer[i].style.animationDelay = (newDelay).toString() + 's';
	}

	pauseAnimation()
}


// Color selector (the values from the dropdown menu are connect to a color here)
function selectColor(phaseId){
	switch(phaseId) {
		case 1:
			colorString =  "rgb(0, 160, 170)"; // tuerkis
			break;
		case 2:
			colorString =  "rgb(210, 10, 100)";  //rot
			break;
		case 3:
			colorString =  "rgb(40, 10, 194)"; //blau
			break;
		case 4:
			colorString =  "rgb(33, 194, 10)"; //grün
			break;
		case 5:
			colorString =  "rgb(255, 212, 0)"; //gelb
			break;
		default	:
			colorString =  "rgb(200, 200, 200)"; //white
	}
	return colorString;
}
