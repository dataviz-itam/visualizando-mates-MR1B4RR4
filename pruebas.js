// Get the canvas element
var canvas = document.getElementById("myCanvas");

// Set the canvas size to full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Get the drawing context
var ctx = canvas.getContext("2d");

// Flip the y-axis and move the origin to lower left corner
ctx.scale(1, -1);
ctx.translate(0, -canvas.height);

//Fill the canvas with dark gray:
ctx.fillStyle = "#222";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// ------------------------------------------------------------
// The data:
// Let's create some synthetic data to test the ideas:
// * TODO: You have to replace this with real data (!)
// ------------------------------------------------------------

// To get a more realistic data, we define random values,
// ranged between different intervals:

let N1 = 17;
let X1 = [];
let Y1 = [];

for (let i = 0; i < N1; i++) {
    X1.push(Math.random()-0.5)
    Y1.push(10 * Math.random())
}

let N2 = 10;
let X2 = [];
let Y2 = [];

for (let i = 0; i < N2; i++) {
    X2.push(Math.random())
    Y2.push(5 * ( Math.random()-0.5) )
}

// ------------------------------------------------------------
// Problem 1: (free ride)
// Compute the bounding boxes of the two datasets and their union
// ------------------------------------------------------------

function create_bbox(X, Y) {
    let Xmin = Math.min(...X);
    let Xmax = Math.max(...X);
    let Ymin = Math.min(...Y);
    let Ymax = Math.max(...Y);

    return {'xmin': Xmin, 'xmax': Xmax, 'ymin': Ymin, 'ymax': Ymax};
}

function union_bbox(bbox1, bbox2) {
    let Xmin = Math.min(bbox1.xmin, bbox2.xmin);
    let Xmax = Math.max(bbox1.xmax, bbox2.xmax);
    let Ymin = Math.min(bbox1.ymin, bbox2.ymin);
    let Ymax = Math.max(bbox1.ymax, bbox2.ymax);

    return {'xmin': Xmin, 'xmax': Xmax, 'ymin': Ymin, 'ymax': Ymax};
}

let bbox1 = create_bbox(X1,Y1);
let bbox2 = create_bbox(X2,Y2);
let bbox = union_bbox(bbox1, bbox2);

// ------------------------------------------------------------
// For the rest of the problems, you have to make a decision...
//
// You have to choose between two options:
// -> Transform the screen space coordinates to the data space
// -> Transform the data coordinates to the screen space
//
// The first option is more intuitive, but the second option
// is more efficient. You have to choose one of them and
// implement it in the following problems.
//
// Many things come into play at this point:
// -> The bounding boxes of the two datasets
// -> The bounding box of their union
// -> The size of the canvas
// -> The size of the bubbles
// -> The size of the margins
// ------------------------------------------------------------

let padding = {bottom: 50, left: 50, right: 50, top: 50};

// Put the origin at the lower left corner of the visible area:
ctx.translate(padding.left, padding.bottom);

let width = canvas.width - padding.left - padding.right;
let height = canvas.height - padding.bottom - padding.top;

// Compute the transformation from data space to screen space:
// Observe that there is a part of the following formulas that
// is common for all the coordinates. You can compute this part
// only once and then use it to compute the screen coordinates
// of all the points.
function x2screen(x){
    return (x - bbox.xmin) * width / (bbox.xmax - bbox.xmin);
}

function y2screen(y){
    return (y - bbox.ymin) * height / (bbox.ymax - bbox.ymin);
}

let Xrange = bbox.xmax - bbox.xmin;
let Yrange = bbox.ymax - bbox.ymin;

// ------------------------------------------------------------
// Example:
// Draw the two bounding boxes
// ------------------------------------------------------------
ctx.strokeStyle = "red";
ctx.lineWidth = 2;
ctx.beginPath();
ctx.rect( x2screen(bbox1.xmin), y2screen(bbox1.ymin),
        x2screen(bbox1.xmax)-x2screen(bbox1.xmin),
        y2screen(bbox1.ymax)-y2screen(bbox1.ymin));
ctx.stroke();

ctx.strokeStyle = "blue";
ctx.lineWidth = 2;
ctx.beginPath();
ctx.rect( x2screen(bbox2.xmin), y2screen(bbox2.ymin),
        x2screen(bbox2.xmax)-x2screen(bbox2.xmin),
        y2screen(bbox2.ymax)-y2screen(bbox2.ymin));
ctx.stroke();


// ------------------------------------------------------------
// Problem 4:
// Draw the two datasets
// * TODO: make this happen!
// ------------------------------------------------------------

let Z1 = [];
let Z2 = [];

for (let i = 0; i < N1; i++) {
    Z1.push(Math.random() * 20 + 5);
}

for (let i = 0; i < N2; i++) {
    Z2.push(Math.random() * 20 + 10); 
}

ctx.fillStyle = "green"; 
for (let i = 0; i < N1; i++) {
    let screenX = x2screen(X1[i]);
    let screenY = y2screen(Y1[i]);
    let radius = Math.sqrt(Z1[i]) * 2; 
    
    ctx.beginPath();
    ctx.arc(screenX, screenY, radius, 0, 2 * Math.PI); 
    ctx.fill(); 
}

ctx.fillStyle = "orange"; 
for (let i = 0; i < N2; i++) {
    let screenX = x2screen(X2[i]);
    let screenY = y2screen(Y2[i]);
    let radius = Math.sqrt(Z2[i]) * 2; 
    
    ctx.beginPath();
    ctx.arc(screenX, screenY, radius, 0, 2 * Math.PI); 
    ctx.fill(); 
}


// ------------------------------------------------------------
// Problem 5:
// Draw axes and labels
// - Compute the main ticks and subticks for each axis.
// - Draw the axes and the labels.
// * TODO: make this happen!
// ------------------------------------------------------------
// Hints:
// -> You can use the following functions to draw text:
//    ctx.fillText(text, x, y);
//    ctx.strokeText(text, x, y);
// -> You can use the following functions to draw lines:
//    ctx.beginPath();
//    ctx.moveTo(x1, y1);
//    ctx.lineTo(x2, y2);
//    ctx.stroke();

ctx.strokeStyle = "white"; 
ctx.fillStyle = "white"; 
ctx.lineWidth = 1;

function drawAxes() {
    let originScreenX = x2screen(0);
    let originScreenY = y2screen(0);

    let xTickInterval = (bbox.xmax - bbox.xmin) / 10;
    let yTickInterval = (bbox.ymax - bbox.ymin) / 10;

    let tickSize = 10;

    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;

    ctx.moveTo(0, originScreenY);
    ctx.lineTo(width, originScreenY);

    ctx.moveTo(originScreenX, 0);
    ctx.lineTo(originScreenX, height);

    ctx.stroke();

    for (let x = bbox.xmin; x <= bbox.xmax; x += xTickInterval) {
        let tickX = x2screen(x);
        ctx.moveTo(tickX, originScreenY - tickSize / 2);
        ctx.lineTo(tickX, originScreenY + tickSize / 2);

        ctx.save();
        ctx.scale(1, -1); 
        ctx.fillText(Math.trunc(x.toFixed(2)*100)/100, tickX, -(originScreenY + tickSize + 20)); 
        ctx.restore();
    }

    for (let y = bbox.ymin; y <= bbox.ymax; y += yTickInterval) {
        let tickY = y2screen(y);
        ctx.moveTo(originScreenX - tickSize / 2, tickY);
        ctx.lineTo(originScreenX + tickSize / 2, tickY);

        ctx.save();
        ctx.scale(1, -1); 
        ctx.fillText(Math.trunc(y.toFixed(2)), originScreenX + tickSize / 2 + 5, -tickY + 5); 
    }
}

drawAxes();

// ------------------------------------------------------------
// * TODO:
// ------------------------------------------------------------
// 1. Package the scatter solution into a function that takes
// as input the data and the canvas context and draws the
// scatter plot.
//
// 2. Transform your code to make bubble charts!
// ------------------------------------------------------------