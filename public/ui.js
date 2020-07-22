/*
 * Simple test p5js sketch sending UI and mouse parameters over websockets
 * sliders are syncronized between connections
 */


let socket;
let param1_slider;
let param2_slider;

function setup() {
  createCanvas(400, 400);
  background(0);

  ////socket on localhost
  // socket = io.connect('http://localhost:3000');
  // use 'io()' instead and it will automatically find connection
  socket = io();

  //test ui
  param1_slider = createSlider(0.0, 10.1, 0.5, 0.1);
  param2_slider = createSlider(0.0, 1.1, 5.5, 0.1);

  //UI on change ie when slider is interacted with, send it as parameter
  //
  // slider1
  param1_slider.input(function() {
  let param1_val = param1_slider.value();
  sendParam("/param1", param1_val); 
  });
  
  //slider2
  param2_slider.input(function() {
  let param2_val = param2_slider.value();
  sendParam("/param2", param2_val); 
  });

  //set slider on input to synchronize
  socket.on('param',
    // When we receive data
    function(data) {
      let val = data.val

      if(data.address === "/param1") {
        console.log(val);
        param1_slider.value(val);
      }
      if(data.address === "/param2") {
        console.log(val);
        param2_slider.value(val);
      }
    }
  );
}

function draw() {
}

function mouseDragged() {
  // if mouse is within drawing box
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    fill(255);
    noStroke();
    ellipse(mouseX,mouseY,20,20);

    //sending mouse coords 
    sendParam("/mouseX", mouseX); 
    sendParam("/mouseY", mouseY); 
  }
}


//SEND FUNCTION takes and osc adress and single value
function sendParam(adr, val) {
  let data = {
    address: adr,
    val: val
  };
  socket.emit('param', data)
}
