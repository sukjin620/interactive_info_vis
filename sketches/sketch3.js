// Instance-mode sketch for tab 3
registerSketch('sk3', function (p) {
  p.setup = function () {
    p.createCanvas(600, 600);
    p.angleMode(p.DEGREES);
  };

  p.draw = function () {
    // Get current time FIRST
    let hr = p.hour();
    let min = p.minute();
    let sec = p.second();
  
    // Determine shift color based on current hour
    let shiftColor;
    if (hr >= 7 && hr < 15) shiftColor = p.color(220, 255, 220);    
    else if (hr >= 15 && hr < 23) shiftColor = p.color(255, 240, 200); 
    else shiftColor = p.color(220, 230, 255);                     
  
    p.background(255);

    // Center the drawing origin
    p.translate(p.width / 2, p.height / 2);
  
    // Draw outer square frame
    p.fill(shiftColor);
    p.stroke(50);
    p.strokeWeight(8);
    p.rectMode(p.CENTER);
    p.rect(0, 0, 400, 400, 10);
  
    // Draw hour markers (squares at 12, 3, 6, 9)
    p.fill(50);
    p.noStroke();
    for (let i = 0; i < 4; i++) {
      p.push();
      p.rotate(i * 90);
      p.translate(0, -160);
      p.rect(0, 0, 20, 20);
      p.pop();
    }
  
    // Draw smaller markers for other hours
    for (let i = 0; i < 12; i++) {
      if (i % 3 !== 0) {
        p.push();
        p.rotate(i * 30);
        p.translate(0, -160);
        p.rect(0, 0, 8, 8);
        p.pop();
      }
    }

    // Draw red cross background
    p.push();
    p.noStroke();
    p.fill(255, 0, 0, 100);
    p.rectMode(p.CENTER);
    p.rect(0, 0, 200, 60);
    p.rect(0, 0, 60, 200);
    p.pop();
  
    // Hour hand (square shape)
    p.push();
    p.rotate((hr % 12) * 30 + min * 0.5 - 90);
    p.fill(50);
    p.noStroke();
    p.rect(20, 0, 80, 16, 4);
    p.pop();
  
    // Minute hand (square shape)
    p.push();
    p.rotate(min * 6 - 90);
    p.fill(80);
    p.noStroke();
    p.rect(20, 0, 120, 12, 4);
    p.pop();
  
    // Second hand (thin square)
    p.push();
    p.rotate(sec * 6 - 90);
    p.fill(220, 50, 50);
    p.noStroke();
    p.rect(20, 0, 140, 4, 2);
    p.pop();
  
    // Center ambulance icon instead of square
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(36);
    p.text('🚑', 0, 0);

  };
});  
