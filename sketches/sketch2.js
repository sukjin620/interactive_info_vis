// Instance-mode sketch for tab 2
registerSketch('sk2', function (p) {
  let currentSecond = -1;
  let beatProgress = 0;
  let isBeating = false;
  let ecgPoints = [];
  let scrollOffset = 0;
  let scrollSpeed = 2;
  let isMinutePulse = false;

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(60);
    
    for (let i = 0; i < p.width + 200; i++) {
      ecgPoints.push(0);
    }
  };

  p.draw = function () {
    p.background(245, 250, 252);
    
    let h = p.hour();
    let m = p.minute();
    let s = p.second();
    
    if (s !== currentSecond) {
      currentSecond = s;
      isBeating = true;
      beatProgress = 0;
      isMinutePulse = (s === 0);
    }
    
    if (isBeating) {
      beatProgress += 0.02;
      if (beatProgress >= 1) {
        isBeating = false;
        beatProgress = 0;
      }
    }
    
    scrollOffset += scrollSpeed;
    if (scrollOffset >= 1) {
      scrollOffset = 0;
      ecgPoints.shift();
      
      let newY = getECGValue(beatProgress, isBeating, isMinutePulse); // FIXED: Added isMinutePulse
      ecgPoints.push(newY);
    }
    
    let centerX = p.width / 2;
    let timeY = p.height * 0.2;
    let ecgY = p.height * 0.5;
    let heartY = p.height * 0.8;
    
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(p.width * 0.08);
    p.fill(60, 80, 100);
    p.noStroke();
    
    let timeString = p.nf(h, 2) + ':' + p.nf(m, 2) + ':' + p.nf(s, 2);
    p.text(timeString, centerX, timeY);
    
    drawScrollingECG(ecgY);
    
    drawHeartIcon(centerX, heartY, isBeating, beatProgress, isMinutePulse); // FIXED: Added isMinutePulse
  };

  function getECGValue(progress, beating, minutePulse) {
    if (!beating || progress >= 1) {
      return 0; 
    }
    
    let amplify = minutePulse ? 1.8 : 1;
    if (progress < 0.15) {
      let t = progress / 0.15;
      return -p.sin(t * p.PI) * 12 * amplify;
    }
    
    if (progress < 0.25) {
      return 0;
    }
    
    if (progress < 0.4) {
      let t = (progress - 0.25) / 0.15;
      
      if (t < 0.2) {
        return t * 20 * amplify;
      } else if (t < 0.5) {
        let spike = (t - 0.2) / 0.3;
        return 4 - p.sin(spike * p.PI) * 70 * amplify;
      } else {
        let dip = (t - 0.5) / 0.5;
        return 4 + p.sin(dip * p.PI) * 25 * amplify;
      }
    }
    
    if (progress < 0.5) {
      return 0;
    }
    
    if (progress < 0.7) {
      let t = (progress - 0.5) / 0.2;
      return -p.sin(t * p.PI) * 20 * amplify;
    }
    
    return 0; 
  }

  function drawScrollingECG(yPos) {
    p.push();
    p.translate(0, yPos);
    
    let margin = p.width * 0.05;
    
    p.stroke(220, 230, 235);
    p.strokeWeight(1);
    let gridSpacing = 30;
    for (let i = 0; i < p.width; i += gridSpacing) {
      p.line(i, -100, i, 100);
    }
    for (let j = -100; j <= 100; j += 20) {
      p.line(0, j, p.width, j);
    }
    
    p.stroke(180, 200, 210);
    p.strokeWeight(2);
    p.line(0, 0, p.width, 0);
    
    p.stroke(220, 50, 60);
    p.strokeWeight(3);
    p.noFill();
    
    p.beginShape();
    for (let i = 0; i < p.width; i++) {
      let index = i + Math.floor(scrollOffset);
      if (index < ecgPoints.length) {
        p.vertex(i, ecgPoints[index]);
      }
    }
    p.endShape();
    
    p.pop();
  }

  function drawHeartIcon(x, y, beating, progress, minutePulse) { // FIXED: Added minutePulse parameter
    p.push();
    p.translate(x, y);
    
    let scale = 1;
    if (beating && progress < 0.3) {
      let pulseAmount = minutePulse ? 0.3 : 0.15;
      scale = 1 + p.sin(progress * p.PI * 3.33) * pulseAmount;
    }
    p.scale(scale);
    
    p.fill(220, 50, 60);
    p.noStroke();
    
    p.beginShape();
    for (let a = 0; a < p.TWO_PI; a += 0.1) {
      let hx = 16 * p.pow(p.sin(a), 3);
      let hy = -(13 * p.cos(a) - 5 * p.cos(2 * a) - 2 * p.cos(3 * a) - p.cos(4 * a));
      p.vertex(hx * 1.5, hy * 1.5);
    }
    p.endShape(p.CLOSE);
    
    p.pop();
  }

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    
    let newSize = p.width + 200;
    if (ecgPoints.length < newSize) {
      while (ecgPoints.length < newSize) {
        ecgPoints.push(0);
      }
    } else if (ecgPoints.length > newSize) {
      ecgPoints = ecgPoints.slice(0, newSize);
    }
  };
});