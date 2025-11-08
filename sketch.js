// Palettes updated to represent emotions
// 0: Happy
// 1: Sad
// 2: Anger
// 3: Fear
// 4: Love
// 5: Overwhelm
const allPalettes = [
  // 0: Happy (Bright, warm yellows, oranges, and sky blue)
  ['#FFFDE7', '#FFEB3B', '#FF9800', '#81D4FA'], // <-- THIS LINE CHANGED

  // 1: Sad (Muted, cool blues and grays)
  ['#263238', '#546E7A', '#90A4AE', '#B0BEC5'],

  // 2: Anger (Strong, high-contrast reds, blacks, and sharp orange)
  ['#1A0000', '#FF0000', '#FF4500', '#D00000'],

  // 3: Fear (Dark, unsettling greens, purples, and grays)
  ['#001000', '#556B2F', '#4B0082', '#616161'],

  // 4: Love (Warm, soft pinks, reds, and lavender)
  ['#4A001E', '#E91E63', '#FF69B4', '#FFF0F5'],

  // 5: Overwhelm (Chaotic, clashing neons - similar to cyberpunk)
  ['#0A0A0A', '#F700FF', '#00FFFF', '#CCFF00']
];


let currentPaletteIndex = 0;
let colorPalette = allPalettes[currentPaletteIndex]; // The currently active palette
let zoff = 0; // Z-axis offset for 3D Perlin noise, to animate over time
let shapeType = 'circle'; // Start with circles, can switch to 'square'

function setup() {
  // Find the canvas container element
  let canvasContainer = select('#canvas-container');
  
  // Create canvas and size it to its container
  let cnv = createCanvas(canvasContainer.width, canvasContainer.height);
  
  // Parent the canvas to the container
  cnv.parent('canvas-container'); 
  
  background(colorPalette[0]); // Initial background color
  noStroke(); // Shapes will not have an outline
}

function draw() {
  background(colorPalette[0]);
  let gridSize = 30; // Size of each cell in the grid

  // MouseX controls noise complexity
  let noiseScale = map(mouseX, 0, width, 0.01, 0.05);

  // Nested loops to draw a grid of shapes
  for (let x = 0; x < width; x += gridSize) {
    for (let y = 0; y < height; y += gridSize) {

      // Get a Perlin noise value
      let noiseVal = noise(x * noiseScale, y * noiseScale, zoff);

      // Use noise to control shape size
      let shapeSize = map(noiseVal, 0, 1, 5, gridSize - 5);

      // Lerp between the Base Color [1] and Accent Color [2]
      let baseColor = color(colorPalette[1]);
      let accentColor = color(colorPalette[2]);
      let interpolatedColor = lerpColor(baseColor, accentColor, noiseVal);

      // Mix in the Subtle Variation Colour [3]
      let secondNoiseVal = noise(x * noiseScale + 1000, y * noiseScale + 1000, zoff);
      let mixedColor = lerpColor(interpolatedColor, color(colorPalette[3]), secondNoiseVal * 0.3);
      fill(mixedColor); // Apply the derived colour

      // Draw either a circle or a rectangle
      if (shapeType === 'circle') {
        ellipse(x + gridSize / 2, y + gridSize / 2, shapeSize, shapeSize);
      } else { // shapeType === 'square'
        rectMode(CENTER); // Draw rectangles from their center
        rect(x + gridSize / 2, y + gridSize / 2, shapeSize, shapeSize);
      }
    }
  }

  // Animate the noise field over time
  // MouseY controls the speed of the animation
  zoff += map(mouseY, 0, height, 0.001, 0.02);
}

// Function to resize canvas when window is resized
function windowResized() {
  let canvasContainer = select('#canvas-container');
  resizeCanvas(canvasContainer.width, canvasContainer.height);
}


// INTERACTIVE: Cycle palette on mouse click
function mousePressed() {
  // Check if mouse is inside the canvas bounds
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    // Cycle the palette index: 0 -> 1 -> ... -> 5 -> 0
    currentPaletteIndex = (currentPaletteIndex + 1) % allPalettes.length;
    // Update the active color palette
    colorPalette = allPalettes[currentPaletteIndex];

    // Immediately reset the background
    background(colorPalette[0]);
  }
}

// INTERACTIVE: Toggle shape type on key press
function keyPressed() {
  if (key === 'c' || key === 'C') {
    if (shapeType === 'circle') {
      shapeType = 'square';
    } else {
      shapeType = 'circle';
    }
  }

  if (key === 's' || key === 'S') {
    saveCanvas('video-capture-duo', 'png');
    console.log("Canvas saved!");
  }
}