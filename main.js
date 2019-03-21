//array that hold nodes x position, starts empty
var nodesX = [];
//array that hold nodes y position, starts empty
var nodexY = [];
//array that hold anchor node positions. 0 = not anchor nodes, 1 = is anchor nodes
var anchorNodes = [];

//JSON object holding nodes info
var jsonNodes = {
    nodes: []
};

//JSON object holding drawing info
var jsonDraw = {
    draw: []
};

//boolean to control if drawing is enabled. Starts false, enables when pen button is clicked
var toggleDraw = false;
//boolean to control if hopinfo is enabled. starts false, enables when hopinfo button is clicked
var toggleHopInfo = false;

//boolean flag determining if user is drawing. originally, false
var flag = false;
//previous and current positions of mouse, maintined to draw properly
var prevX = 0;
var currX = 0;
var prevY = 0;
var currY = 0;
var dot_flag = false;

//resizes canvas size
function resizeCanvas() {
    /*
    //resize the width of canvas
    document.getElementById("canvas").width = window.innerWidth - 20;
    //resize the height of canvas
    document.getElementById("canvas").height = window.innerHeight - 55;
    */

    document.getElementById("canvas").width = document.getElementById("sensorFieldWidthSlider").value;
    document.getElementById("canvas").height = document.getElementById("sensorFieldLengthSlider").value;

}

//opens modal Generate WSNs
function openGenerateWSNs() {
    document.getElementById("generateWSNsModal").style.display="block";
}

//closes model Generate WSNs
function closeGenerateWSNs() {
    document.getElementById("generateWSNsModal").style.display="none";
}

//get value of penWidth
function penWidthGetValue() {
    document.getElementById("penWidthValue").innerHTML = document.getElementById("penWidthSlider").value;
}

//get value of nodes in network slider
function nodesInNetworkGetValue() {
    document.getElementById("nodesInNetworkValue").innerHTML = document.getElementById("nodesInNetworkSlider").value;
}

//get value of anchors in network slider
function anchorsInNetworkGetValue() {
    document.getElementById("anchorsInNetworkValue").innerHTML = document.getElementById("anchorsInNetworkSlider").value;
}
//get value of radio range slider
function radioRangeGetValue() {
    document.getElementById("radioRangeValue").innerHTML = document.getElementById("radioRangeSlider").value;
}
//get value of sensor field width slider
function sensorFieldWidthGetValue() {
    document.getElementById("sensorFieldWidthValue").innerHTML = document.getElementById("sensorFieldWidthSlider").value;
}

//get value of sensor field length slider
function sensorFieldLengthGetValue() {
    document.getElementById("sensorFieldLengthValue").innerHTML = document.getElementById("sensorFieldLengthSlider").value;
}

//closes popup
function closePopUp() {
    document.getElementById("popup").style.display = "none";
}

//changes toggleDraw to true or false depending on button click
function toggleDrawing() {
    //if toggleDraw is false then changes toggleDraw to true
    if(toggleDraw == false) {
        toggleDraw = true;
        //change color of button to show that toggleDraw is true/on
        document.getElementById("penButton").style.background = "#FF0000";
    }
    //if toggleDraw is not false then it is true, change toggleDraw to false
    else {
        toggleDraw = false;
        //changes color of button to show that toggleDraw is false/off
        document.getElementById("penButton").removeAttribute("style");
    }
}

//changes toggleHopInfo to true or false depending on button click
function toggleHopInfoing() {
	//if toggleHopInfo is false then changes to true
	if(toggleHopInfo == false) {
		toggleHopInfo = true;
		//change color of button to show that toggleHopInfo is true/on
		document.getElementById("hopInfoButton").style.background = "#FF0000";
	}
	else {
		toggleHopInfo = false;
		//if toggleHopInfo is not false, then it is true, change toggleHopInfo to false
		document.getElementById("hopInfoButton").removeAttribute("style");
	}
}

//reset variables from generateNodes
function resetGenerateNodes() {
    //reset nodesX and nodesY array
    nodesX = [];
    nodesY = [];
    anchorNodes=[];
    //reset anchorNodes. 0 = not anchor nodes, 1 = is anchor nodes
    for(var i = 0; i < document.getElementById("anchorsInNetworkSlider").value; i++) {
        //change current position of array to 0
        anchorNodes.push(1);
    }
    //determine anchorNodes. # of anchor nodes determined by slider in Generate WSNs

    //reset jsonNodes
    var jsonNodes = {
        nodes: []
    };
    
    //closes popup boxes
    document.getElementById("popup").style.display = "none";
}

function euDis(x1,y1,x2,y2){
  return (x1-x2)*(x1-x2)+(y1-y2)*(y1-y2);
}

//generate nodes
function generateNodes() {
    //get # of nodes from Generate WSNs
    var numNodes = document.getElementById("nodesInNetworkSlider").value;
    //get X value of canvas from Generate WSNs
    var maxX = document.getElementById("sensorFieldWidthSlider").value;
    //get Y value of canvas from Generate WSNs
    var maxY = document.getElementById("sensorFieldLengthSlider").value;

    //loops until length of nodes = numNodes
    //generates x and y coordinates of nodes
    while(nodesX.length < numNodes && nodesY.length < numNodes) {
        //generate random x (0 - maxX.length)
        var ranX = Math.floor(Math.random() * maxX);
        //generate random y (0 - maxY.length)
        var ranY = Math.floor(Math.random() * maxY);

        //check to see if combination of x and y positions are duplicates
        //nodesX and nodesY are/should be same length, checking either length is enough
        //counter for for loop
        var i = 0;
        for(i = 0; i < nodesX.length; i++) {
            //if position is duplicate
            if(euDis(nodesX[i], nodesY[i] , ranX, ranY)<11) {
                //break out for loop
                break;
            }
        }

        //if i is = to nodesX or nodesY length then that means for loop reached end of arrays, meaning no duplicates
        if(i == nodesX.length) {
            //add generates x and y to position of nodes
            nodesX.push(ranX);
            nodesY.push(ranY);
        }
    }
}

//place generated nodes on canvas
function placeNodesOnCanvas() {
    //get canvas element from html
    var canvas = document.getElementById("canvas");
    //canvas is 2d
    var ctx = canvas.getContext("2d");

    //loops through length of nodesX and nodesY array
    for(var i = 0; i < nodesX.length; i++) {
        //if current node is an anchor node
        if(anchorNodes[i] == 1) {
            //change color of nodes to red
            ctx.fillStyle = "#FF0000";   
        }
        //if current node is not an anchor node
        else {
            //change color of nodes to black
            ctx.fillStyle = "#000000";
        }

        //place nodes on canvas
        //ctx.fillRect(nodesX[i], nodesY[i], 5, 5);
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.arc(nodesX[i], nodesY[i], 1, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }
}

//creates json with node information
function createJsonNodes() {
    //loops through nodesX / nodesY
    for(var i = 0; i < nodesX.length; i++) {
        //variable containing data if current node is an anchor, default is false.
        var isAnchor = false;

        //determine if current node i is an anchor node
        if(anchorNodes[i] == 1) {
            //current node is anchor
            isAnchor = true;
        }

        //push data into jsonNodes
        jsonNodes.nodes.push({
            "NodeID" : i++,
            "X" : nodesX[i],
            "Y" : nodesY[i],
            "IsAnchor" : isAnchor
        });
    }
}

//tracks mouse movement
function trackMouse() {
    var canvas = document.getElementById("canvas");

    //track the users mouse and actions
    canvas.addEventListener("mousemove", function (e) {
        findXY("move", e)
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        findXY("down", e)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        findXY("up", e)
		//if toggleHopInfo is true
		if(toggleHopInfo == true) {
			displayHopInfo(e);
		}
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        findXY("out", e)
    }, false);
}

//finds x and y coordinate of mouse
function findXY(action, e) {
    if(toggleDraw == true) {
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");

        //if user mouse is down
        if(action == "down") {
            //change prev x and y locations to current x and y locations
            prevX = currX;
            prevY = currY;
            currX = e.clientX - canvas.getBoundingClientRect().left;
            currY = e.clientY - canvas.getBoundingClientRect().top;
            //drawing is true, flag is true
            flag = true;
            dot_flag = true;

            //starting position of drawing/line
            if(dot_flag == true) {
                //start drawing
                ctx.beginPath();
                //change color of nodes to black
                ctx.fillStyle = "#000000";
                ctx.fillRect(currX, currY, 1, 1);
                //add starting point to json object
                jsonDraw.draw.push({
                    "X" : currX,
                    "Y" : currY
                });
                dot_flag = false;
            }
        }

        //if user lifts up mouse button or leaves canvas, stop drawing
        if (action == "up" || action == "out") {
            flag = false;
			ctx.closePath();
        }

        //if user moves mouse, draw lines from starting point
        if (action == "move") {
            if(flag == true) {
                prevX = currX;
                prevY = currY;
                currX = e.clientX - canvas.getBoundingClientRect().left;
                currY = e.clientY - canvas.getBoundingClientRect().top;
                draw();
            }
        }
    }
}

//allows the user to draw on canvas
function draw() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    //start drawing
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    jsonDraw.draw.push({
        "X" : currX,
        "Y" : currY
    });
    //change color of nodes to black
    ctx.fillStyle = "#000000";
    ctx.lineWidth = document.getElementById("penWidthSlider").value;
	ctx.lineJoin = "round";
	ctx.lineCap = "round";
    ctx.stroke();
}

//erases everything in canvas then places generated nodes back on canvas
function erase() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext('2d');
    
    //clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //reset json object
    var jsonDraw = {
        draw: []
    };
    //place nodes back on canvas
    placeNodesOnCanvas();
}

//clears entire canvas
function clearCanvas() {
    //resets all variables
    resetGenerateNodes();
    erase();
}

//displays hopinfo
function displayHopInfo(e) {
	//obtain current x and y positions of mouse
    currX = e.clientX - canvas.getBoundingClientRect().left;
    currY = e.clientY - canvas.getBoundingClientRect().top;

	//loop through nodesX array to determine if current mouse location is a node
	for(var i = 0; i < nodesX.length; i++) {
		//check to see if current mouse x position is in nodesX array
		if(currX + 1 >= nodesX[i] && currX - 1 <= nodesX[i]){
			//check to see if current Y position is in nodesY array
			if(currY + 1 >= nodesY[i] && currY - 1 <= nodesY[i]) {
				//if both X and Y position of mouse is in array, then mouse is over a node
                var popupBox = document.getElementById("popup");
                popupBox.style.display = "block";
                popupBox.style.top = currY;
                popupBox.style.left = currX;
                popupBox.innerHTML = "Node #: " + i + "<br />" + "X: " + nodesX[i] + "<br />" + "Y: " + nodesY[i];
			}
		}
	}
}
