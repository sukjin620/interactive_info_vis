// Instance-mode sketch for tab 4
registerSketch('sk4', function (p) {
  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textAlign(p.CENTER, p.CENTER);
  };
  
  p.draw = function () {
    p.background(80, 126, 230);
    
    let h = p.nf(p.hour(), 2);
    let m = p.nf(p.minute(), 2);
    let s = p.nf(p.second(), 2);
    let timeString = h + ':' + m + ':' + s;
    
    let ms = p.millis() % 1000;
    let pulse = p.map(ms, 0, 1000, 1.0, 1.15);
    pulse = 1.0 + 0.15 * p.sin(p.map(ms, 0, 1000, 0, p.TWO_PI));
    
    let cx = p.width / 2;
    let cy = p.height / 2;
    
    p.push();
    p.translate(cx, cy);
    p.scale(pulse);
    
    p.fill(220, 50, 80);
    p.stroke(180, 30, 60);
    p.strokeWeight(3);
    p.beginShape();
    for (let a = 0; a < p.TWO_PI; a += 0.01) {
      let x = 16 * p.pow(p.sin(a), 3);
      let y = -(13 * p.cos(a) - 5 * p.cos(2 * a) - 2 * p.cos(3 * a) - p.cos(4 * a));
      x *= 8;
      y *= 8;
      p.vertex(x, y);
    }
    p.endShape(p.CLOSE);
    
    p.fill(255);
    p.noStroke();
    p.textSize(32);
    p.text(timeString, 0, 0);
    
    p.pop();
    
    p.fill(30, 120, 40);
    p.textSize(20);
  };
  
  p.windowResized = function () { 
    p.resizeCanvas(p.windowWidth, p.windowHeight); 
  };
});