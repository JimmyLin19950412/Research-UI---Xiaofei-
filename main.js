//array that hold nodes x position, starts empty
var nodesX = [];
//array that hold nodes y position, starts empty
var nodexY = [];
//array that hold anchor node positions. 0 = not anchor nodes, 1 = is anchor nodes
var anchorNodes = [];

//array holding information to be displayed in text box
var information = new Array(25);
//contains the position of array that is shown in text field
var currTextFieldPos = 0;

//JSON object holding nodes info
var jsonNodes = {
        range: 0,
        total: 0,
        anchor: 0,
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

//response from server
var isResponse = false;
var loading;

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
    document.getElementById("generateWSNsModal").style.display = "block";
}

//closes model Generate WSNs
function closeGenerateWSNs() {
    document.getElementById("generateWSNsModal").style.display = "none";
}

//closes loading bar modal
function closeLoadingBar() {
  document.getElementById("loadingBarModal").style.display = "none";
  clearInterval(loading);
  
}

//closes searching WSNs modal
function closeSearchingWSNs() {
    document.getElementById("searchingWSNsModal").style.display = "none";
}

//closes search nodes modal
function closeSearchNodes() {
	document.getElementById("searchNodesModal").style.display = "none";
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
    jsonNodes.range=document.getElementById("radioRangeSlider").value;
    //loops through nodesX / nodesY
    var counter=0;
    for(var i = 0; i < nodesX.length; i++) {
        //variable containing data if current node is an anchor, default is false.
        var isAnchor = false;

        //determine if current node i is an anchor node
        if(anchorNodes[i] == 1) {
            //current node is anchor
            isAnchor = true;
            counter+=1;
        }

        //push data into jsonNodes
        jsonNodes.nodes.push( parseInt(nodesX[i]));
        jsonNodes.nodes.push( parseInt(nodesY[i]));
    }
    
    jsonNodes.total=nodesX.length;
    jsonNodes.anchor=counter;
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
        //change color of pen
        ctx.fillStyle = "#0000FF";
        //changes opacity of line
        ctx.globalAlpha = 0.2;

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
	//main canvas
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
	//secondary temp canvas
	var canvas2 = document.createElement("canvas");
	canvas2.width = canvas.width;
	canvas2.height = canvas.height;
	var ctx2 = canvas2.getContext("2d");
	
    //change color of pen
    ctx2.fillStyle = "#0000FF";
    //changes opacity of line
    ctx2.globalAlpha = 0.6;
	ctx2.globalCompositeOperation="destination-atop";

    //start drawing on temp canvas
    ctx2.moveTo(prevX, prevY);
    ctx2.lineTo(currX, currY);
    jsonDraw.draw.push({
        "X" : currX,
        "Y" : currY
    });
    ctx2.lineWidth = document.getElementById("penWidthSlider").value;
	ctx2.lineJoin = "round";
	ctx2.lineCap = "round";
    ctx2.strokeStyle = "#0000FF";
    ctx2.stroke();
	
	//draws image on top of main canvas
	ctx.drawImage(canvas2, 0, 0);
}

//erases everything in canvas then places generated nodes back on canvas
function erase() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext('2d');
    //reset global alpha
    ctx.globalAlpha = 1;
    //reset global composite operation
    ctx.globalCompositeOperation = "source-over";
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

//displays loading bar and wait to receive data from server
function waitForResponseFromServer() {
    document.getElementById("loadingBarModal").style.display="block";
    //progress bar variables
    var loadingBar = document.getElementById("loadingBar");
    var progressBar = document.getElementById("progressBar");
    //timer is 2min, 120,000ms = 2min
    const timer = 120000;
    //reset isResponse
    isResponse = false;
    var loadingBarPercent = 1;
    //temp count
    var count = 0;
    loadingBar.style.display = "block";
    progressBar.style.display = "block";
    
    loading = setInterval(updateLoadingBar , 100);
    
    function updateLoadingBar() {
        if(loadingBarPercent >= 100 || isResponse == true) {
            clearInterval(loading);
            loadingBar.style.width = 100 + '%';
            if(isResponse == true) {
                document.getElementById("loadingBarMessage").innerHTML = "Received data from server. Please close window";
            }
            else {
                document.getElementById("loadingBarMessage").innerHTML = "Unable to receive response from server. Please try again";
            }
        }
        else {
            loadingBarPercent = loadingBarPercent + 0.08333;
            loadingBar.style.width = loadingBarPercent + '%';
            //code to receive response from server placed here
        }
    }
}

//displays a box with various info when Search WSNs is clicked
function searchWSNs(mode) {    
    //if mode = start then initiialize text field and populate array information
    if(mode == "start") {
        //rest current position of array that is displayed in text field
        currTextFieldPos = 0;
        //reset array
        information = [];
        
        //displays modal/popup
        document.getElementById("searchingWSNsModal").style.display="block";
        
        //code to get information and populate it
        //HERE
        
        //pre-populate information with random data, for demonstration only, delete later
        for(var i = 0; i < 25; i++) {
            information[i] = i;
        }
        
        //populate text field with the value at position in array 
        document.getElementById("message").value = information[currTextFieldPos];
    }
    //if moving left in array
    else if(mode == "left") {
        //if current position of array that is displayed in text field is 0 then loop to end of array
        if(currTextFieldPos == 0) {
            //set current position to end of array
            currTextFieldPos = 24;
        }
        //else if current position of array that is displayed in text field is not 0
        else {
            currTextFieldPos--;
        }
        //populate text field with the value at position in array 
        document.getElementById("message").value = information[currTextFieldPos];
    }
    //if moving right in array
    else if(mode == "right") {
        //if current position of array that is displayed in text field is at end of array loop back to beginning of array (0)
        if(currTextFieldPos == 24) {
            //set current position to end of array
            currTextFieldPos = 0;
        }
        //else if current position of array that is displayed in text field is not at end of array
        else {
            currTextFieldPos++;
        }
        //populate text field with the value at position in array 
        document.getElementById("message").value = information[currTextFieldPos];
    }
}

//when display current area button is pressed
function displayCurrentArea() {
    alert("displayCurrentArea function");
}

//when show all area button is pressed
function showAllArea() {
    alert("showAllArea function");
}

//when unknownOne button is pressed
function unknownOne() {
    alert("unknownOne function");
}

//when unkownTwo button is pressed
function unknownTwo() {
    alert("unknownTwo function");
}

//when unkownThree button is pressed
function unknownThree() {
    alert("unknownThree function");
}

//when unkownFour button is pressed
function unknownFour() {
    alert("unknownFour function");
}

//opens search nodes modal and allows user to input node # to search for node
function searchNodesPopup() {
	//opens search node modal
	document.getElementById("searchNodesModal").style.display = "block";
	
	//gets max number of nodes displayed from array
	var maxNodes = nodesX.length - 1;
	//message to be displayed inside modal
	var message = "";
	
	//if maxNodes is 0 then that means there are no nodes displayed
	if(maxNodes <= 0) {
		message = "No nodes displayed";
		document.getElementById("nodeNumber").disabled = true;
		document.getElementById("searchButton").disabled = true;
	}
	//else there are nodes displayed
	else {
		message = "Please enter a number between 0 and " + maxNodes;
		document.getElementById("nodeNumber").disabled = false;
		document.getElementById("searchButton").disabled = false;
	}
	
	//update the displayed message
	document.getElementById("messageBox").innerHTML = message;
	
	//set focus onto textbox
	document.getElementById("nodeNumber").focus();
}

//takes inputed number from search nodes modal to display node info
function searchNodes() {
	//get value from textbox
	var input = document.getElementById("nodeNumber").value;
	//get max # of nodes
	var maxNodes = nodesX.length - 1;
	//if input is less than 0 or greater than maxNodes-1 then it is out of bounds
	if(input < 0 || input > maxNodes) {
		document.getElementById("errorMessageBox").innerHTML = "Invalid range";
	}
	else {
		//close search nodes modal
		closeSearchNodes();
		nodesX[input];
		nodesY[input];
		//open popup and set its position`
        var popupBox = document.getElementById("popup");
        popupBox.style.display = "block";
        popupBox.style.top = nodesY[input];
        popupBox.style.left = nodesX[input];
        popupBox.innerHTML = "Node #: " + input + "<br />" + "X: " + nodesX[input] + "<br />" + "Y: " + nodesY[input];
	}
}

function randomTest(){
  erase();
  var c1,c2,h1,h2,d;
  var dis;
  do
  {
    c1=Math.floor(Math.random() * jsonNodes.anchor); 
    c2=0;
    do{
      c2=Math.floor(Math.random() * jsonNodes.anchor);
    }while(c2==c1);
    
    h1=Math.floor(Math.random() * 10)+3;
    h2=0;
    do{
      h2=Math.floor(Math.random() * 10)+3;
    }while(h2==h1); 
    
    d=Math.floor(Math.random() * 50)+30;
    dis=(nodesX[c1]-nodesX[c2])*(nodesX[c1]-nodesX[c2])+(nodesY[c1]-nodesY[c2])*(nodesY[c1]-nodesY[c2]);
  }while(dis>(h1+h2)*(h1+h2)*d*d)
  console.log(c1+' '+c2+ ' ' +h1+' '+h2);


    //start drawing
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    //draw first (free) circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(nodesX[c2], nodesY[c2], h2*d, 0, 2 * Math.PI);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "white";
    ctx.stroke();
    ctx.globalAlpha = 0.3;
    ctx.fill();
    //color intersection between first circle and second circle
    ctx.beginPath();
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = "red"
    ctx.globalCompositeOperation = "source-atop";
    ctx.arc(nodesX[c1], nodesY[c1], h1*d, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    //color intersection between first circle and third circle
    ctx.beginPath()
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = "white";
    ctx.globalCompositeOperation = "source-atop";
    ctx.arc(nodesX[c1], nodesY[c1], h1*d-d, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    //draw second outer circle
    ctx.beginPath();
    ctx.globalCompositeOperation = "destination-over";
    ctx.arc(nodesX[c1], nodesY[c1], h1*d, 0, 2 * Math.PI);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "white";
    ctx.stroke(); 
    ctx.globalAlpha = 0.0;
    ctx.fill();
    //draw third inner circle
    ctx.beginPath();
    ctx.arc(nodesX[c1], nodesY[c1], h1*d-d, 0, 2 * Math.PI);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "white";
    ctx.stroke();
    ctx.globalAlpha = 0.0;
    ctx.fill();
    //reset global composite operation
    ctx.globalCompositeOperation = "source-over";
    //redraw strokes
    ctx.beginPath();
    ctx.arc(nodesX[c2], nodesY[c2], h2*d, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(nodesX[c1], nodesY[c1], h1*d, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(nodesX[c1], nodesY[c1], h1*d-d, 0, 2 * Math.PI);
    ctx.stroke();
    
    
  var i,j;
  var ccc=0;
  for(i=0;i<2000;i++)
  {
    for(j=0;j<2000;j++)
    {
      if(pDis(i,j,nodesX[c2],nodesY[c2])<h2*h2*d*d && pDis(i,j,nodesX[c1],nodesY[c1])<h1*h1*d*d && pDis(i,j,nodesX[c1],nodesY[c1])>(h1-1)*(h1-1)*d*d)
        ccc+=1;
      
    }
  }
  
  console.log(ccc);
}

function pDis(x1,y1,x2,y2)
{
  return (x1-x2)*(x1-x2)+(y1-y2)*(y1-y2);
}
