registerSketch('sk5', function (p) {
  // Data from EDA - Field positions affect advancement
  const fieldData = {
    LF: { rate: 34.1, angle: 135, color: [255, 107, 107], label: 'Left Field' },
    CF: { rate: 57.0, angle: 90, color: [78, 205, 196], label: 'Center Field' },
    RF: { rate: 57.4, angle: 45, color: [255, 230, 109], label: 'Right Field' }
  };
  
  // Runner base advancement rates (key finding!)
  const baseData = {
    '1B': { rate: 45.0, x: 1, y: 0, color: [149, 225, 211] },
    '2B': { rate: 35.1, x: 0, y: -1, color: [243, 129, 129] },
    '3B': { rate: 80.2, x: -1, y: 0, color: [170, 150, 218] }
  };
  
  // Animation variables
  let time = 0;
  let hangtimeValue = 0;
  let runnerSpeedValue = 0;
  let exitSpeedValue = 0;
  let pulseAnimation = 0;
  let hoveredElement = null;
  let trajectoryPulse = 0;
  
  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.angleMode(p.DEGREES);
  };
  
  p.draw = function () {
    // Scale factor for responsive design
    let scale = p.min(p.width / 1080, p.height / 1080);
    
    // Gradient background (baseball field grass)
    drawGradientBackground();
    
    time += 0.02;
    pulseAnimation = p.sin(time * 100) * 0.5 + 0.5;
    trajectoryPulse = p.sin(time * 80) * 0.5 + 0.5;
    
    // Animate values
    hangtimeValue = p.map(p.sin(time * 50), -1, 1, 3, 6);
    runnerSpeedValue = p.map(p.sin(time * 60 + 50), -1, 1, 25, 30);
    exitSpeedValue = p.map(p.sin(time * 40 + 100), -1, 1, 85, 105);
    
    // Center and scale everything
    p.push();
    p.translate(p.width / 2, p.height / 2);
    p.scale(scale);
    p.translate(-540, -540); // Center of 1080x1080 canvas
    
    // Title
    drawTitle();
    
    // Main baseball field visualization (center)
    p.push();
    p.translate(540, 620);
    drawBaseballField();
    p.pop();
    
    // Hangtime indicator (top left)
    p.push();
    p.translate(180, 190);
    p.scale(0.85);
    drawHangtimeIndicator();
    p.pop();
    
    // Runner speed gauge (top right)
    p.push();
    p.translate(900, 190);
    p.scale(0.85);
    drawRunnerSpeedGauge();
    p.pop();
    
    // Exit speed gauge (middle bottom - between field and key insights)
    p.push();
    p.translate(540, 905);
    p.scale(1.0);
    drawExitSpeedGauge();
    p.pop();
    
    // Key insight
    drawKeyInsight();
    
    p.pop();
  };
  
  function drawGradientBackground() {
    for (let y = 0; y < p.height; y++) {
      let inter = p.map(y, 0, p.height, 0, 1);
      let c = p.lerpColor(p.color(26, 71, 42), p.color(45, 90, 61), inter);
      p.stroke(c);
      p.line(0, y, p.width, y);
    }
  }
  
  function drawTitle() {
    // Title background
    p.fill(0, 0, 0, 120);
    p.noStroke();
    p.rect(40, 30, 1000, 70, 15);
    
    // Title text
    p.fill(255);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(38);
    p.textStyle(p.BOLD);
    p.text('What Affects Runner Advancement?', 540, 65);
  }
  
  function drawBaseballField() {
    let fieldRadius = 400;

    p.push(); 
    p.scale(1, 1.5);
    p.translate(0, 130);
    
    // Draw outfield segments (behind everything)
    Object.keys(fieldData).forEach((key) => {
      let data = fieldData[key];
      
      // Shift the arc downward by 180 degrees
      let startAngle = data.angle + 180 - 22.5;
      let endAngle = data.angle + 180 + 22.5;
    
      // Draw the field segment 
      p.fill(data.color[0], data.color[1], data.color[2], 120);
      p.stroke(255, 150);
      p.strokeWeight(2);
      p.arc(0, 0, fieldRadius * 2, fieldRadius * 2, startAngle, endAngle, p.PIE);
    
      // Label positions
      let labelAngle = data.angle + 180;
      let labelDist = fieldRadius * 0.75;
      let labelX = p.cos(labelAngle) * labelDist;
      let labelY = p.sin(labelAngle) * labelDist;
    
      // Text
      p.fill(255);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(22);
      p.textStyle(p.BOLD);
      p.text(key, labelX, labelY - 20);
    
      p.textSize(28);
      p.text(data.rate + '%', labelX, labelY + 10);
    });

    p.pop();

    let boxX = 500;
    let boxY = -140;
    let boxWidth = 300;
    let boxHeight = 100;

    p.fill(0, 0, 0, 180);
    p.noStroke();
    p.rect(boxX - boxWidth/2, boxY - boxHeight/2, boxWidth, boxHeight, 10);

    p.fill(255, 255, 150);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(14);
    p.textStyle(p.BOLD);
    p.text('Fielder Position', boxX, boxY - 20);

    p.fill(255);
    p.textSize(11);
    p.textStyle(p.NORMAL);
    p.text('Balls hit to right or center field (RF, CF)', boxX, boxY + 5);
    p.text('lead to higher runner advancement than left field (LF)', boxX, boxY + 20);
    
    // Draw infield dirt diamond
    p.fill(139, 90, 60, 120);
    p.stroke(120, 75, 50);
    p.strokeWeight(2);
    let diamondSize = 200;
    p.quad(0, diamondSize,           
           diamondSize, 0,            
           0, -diamondSize,         
           -diamondSize, 0);          
    
    // Draw base paths
    p.stroke(255, 255, 255, 100);
    p.strokeWeight(3);
    p.line(0, diamondSize, diamondSize, 0);
    p.line(diamondSize, 0, 0, -diamondSize);
    p.line(0, -diamondSize, -diamondSize, 0);
    p.line(-diamondSize, 0, 0, diamondSize);
    
    // TRAJECTORY LINES - Draw before bases so they appear underneath
    drawTrajectoryLines(diamondSize);
    
    // Draw and label bases (NO advancement rate bubbles)
    Object.keys(baseData).forEach((baseName) => {
      let base = baseData[baseName];
      let baseX = base.x * diamondSize;
      let baseY = base.y * diamondSize;
      
      // Base size pulses for 3B (highest rate)
      let baseSize = 28;
      if (baseName === '3B') {
        baseSize = 28 + pulseAnimation * 8;
      }
      
      // Draw base (white square rotated 45°)
      p.push();
      p.translate(baseX, baseY);
      p.rotate(45);
      p.fill(255);
      p.stroke(0);
      p.strokeWeight(3);
      p.rect(-baseSize / 2, -baseSize / 2, baseSize, baseSize);
      p.pop();
      
      // Base label
      p.fill(0);
      p.noStroke();
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(12);
      p.textStyle(p.BOLD);
      p.text(baseName, baseX, baseY);
    });
    
    // Draw home plate (pentagon)
    p.fill(255);
    p.stroke(0);
    p.strokeWeight(4);
    let plateSize = 35;
    p.beginShape();
    p.vertex(0, diamondSize + plateSize * 0.6);
    p.vertex(-plateSize, diamondSize);
    p.vertex(-plateSize, diamondSize - plateSize * 0.6);
    p.vertex(0, diamondSize - plateSize);
    p.vertex(plateSize, diamondSize - plateSize * 0.6);
    p.vertex(plateSize, diamondSize);
    p.endShape(p.CLOSE);
    
    // "HOME" label
    p.fill(0);
    p.noStroke();
    p.textSize(12);
    p.textStyle(p.BOLD);
    p.textAlign(p.CENTER, p.CENTER);
    p.text('HOME', 0, diamondSize - 10);
    
    // Comparison arrow between 2B and 3B
    p.stroke(255, 255, 100, 150);
    p.strokeWeight(3);
    p.drawingContext.setLineDash([10, 10]);
    p.line(0, -diamondSize + 10, -diamondSize + 10, 0);
    p.drawingContext.setLineDash([]);
    
    // Comparison text for 2B vs 3B
    p.fill(255, 255, 100);
    p.noStroke();
    p.textSize(15);
    p.textStyle(p.BOLD);
    p.text('Runner on 2B advances', -diamondSize / 2 + 40, -diamondSize / 2 + 40);
    p.text('35% of the time', -diamondSize / 2 + 40, -diamondSize / 2 + 60);  
    
    // Comparison arrow between 3B and HOME
    p.stroke(255, 255, 100, 150);
    p.strokeWeight(3);
    p.drawingContext.setLineDash([10, 10]);
    p.line(-diamondSize + 10, 0, 0, diamondSize -10);
    p.drawingContext.setLineDash([]);
    
    // Comparison text for 3B to HOME
    p.fill(255, 255, 100);
    p.noStroke();
    p.textSize(15);
    p.textStyle(p.BOLD);
    p.text('Runner on 3B advances', -diamondSize / 2 + 20, diamondSize / 2 + 30);
    p.text('80% of the time!', -diamondSize / 2 + 20, diamondSize / 2 + 50);
  }
  
  function drawTrajectoryLines(diamondSize) {
    // Starting point at home plate
    let homeX = 0;
    let homeY = diamondSize;
    
    // SHORT HIT TRAJECTORY - Lower, shorter arc
    let shortMaxHeight = 120; // Peak height of arc
    let shortHorizontalDist = 100; // How far forward it goes
    
    // Draw short trajectory with dashed line
    p.stroke(255, 100, 100, 150 + trajectoryPulse * 50);
    p.strokeWeight(4);
    p.drawingContext.setLineDash([8, 8]);
    
    // Draw curved trajectory (upward parabola)
    p.noFill();
    p.beginShape();
    for (let i = 0; i <= 20; i++) {
      let t = i / 20;
      let x = homeX + shortHorizontalDist * 0.5 * t; // stop at peak (half distance)
      let arcHeight = p.sin(t * 90) * shortMaxHeight;
      let y = homeY - arcHeight;
      p.vertex(x, y);
    }
    p.endShape();
    
    // Baseball at peak of short trajectory
    let shortPeakX = homeX + shortHorizontalDist * 0.5;
    let shortPeakY = homeY - shortMaxHeight;
    p.fill(255, 100, 100);
    p.noStroke();
    p.circle(shortPeakX, shortPeakY, 12 + trajectoryPulse * 4);
    
    p.drawingContext.setLineDash([]);
    
    // Short hit annotation
    p.fill(255, 100, 100);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(13);
    p.textStyle(p.BOLD);
    p.text('SHORT HIT', shortPeakX - 60, shortPeakY - 10);
    p.textSize(11);
    p.textStyle(p.NORMAL);
    p.text('~250 ft', shortPeakX - 60, shortPeakY + 5);
    p.textSize(10);
    p.fill(255, 150, 150);
    p.text('Lower advancement rate', shortPeakX - 60, shortPeakY + 20);
    
    // LONG HIT TRAJECTORY - Higher, longer arc
    let longMaxHeight = 220; // Peak height of arc
    let longHorizontalDist = 180; // How far forward it goes
    
    // Draw long trajectory with solid line
    p.stroke(100, 255, 100, 150 + trajectoryPulse * 50);
    p.strokeWeight(5);
    p.drawingContext.setLineDash([12, 4]);
    
    // Draw curved trajectory 
    p.noFill();
    p.beginShape();
    for (let i = 0; i <= 25; i++) {
      let t = i / 25;
      let x = homeX + longHorizontalDist * 0.5 * t; 
      let arcHeight = p.sin(t * 90) * longMaxHeight; 
      let y = homeY - arcHeight;
      p.vertex(x, y);
    }
    p.endShape();
    
    // Reset dash
    p.drawingContext.setLineDash([]);
    
    // Baseball at peak of long trajectory
    let longPeakX = homeX + longHorizontalDist * 0.5;
    let longPeakY = homeY - longMaxHeight;
    p.fill(100, 255, 100);
    p.noStroke();
    p.circle(longPeakX, longPeakY, 14 + trajectoryPulse * 4);
    
    // Long hit annotation
    p.fill(100, 255, 100);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(13);
    p.textStyle(p.BOLD);
    p.text('LONG HIT', longPeakX + 50, longPeakY );
    p.textSize(11);
    p.textStyle(p.NORMAL);
    p.text('~380 ft', longPeakX + 40, longPeakY + 15);
    p.textSize(10);
    p.fill(150, 255, 150);
    p.text('Higher advancement rate', longPeakX + 40, longPeakY + 30);
    
    // Distance comparison annotation (between the two peaks)
    let midX = (shortPeakX + longPeakX) / 2 + 80;
    let midY = (shortPeakY + longPeakY) / 2 - 30 + 80;
    
    p.fill(255, 255, 100, 200);
    p.noStroke();
    p.rect(midX - 85, midY - 22, 170, 44, 8);
    
    p.fill(0);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(12);
    p.textStyle(p.BOLD);
    p.text('Hit Distance', midX, midY - 8);
    p.textSize(10);
    p.textStyle(p.NORMAL);
    p.text('Runners advance on longer hits', midX, midY + 8);
  }
  
  function drawHangtimeIndicator() {
    // Background panel
    p.fill(0, 0, 0, 130);
    p.noStroke();
    p.rect(-120, -90, 240, 180, 10)
    
    // Title
    p.fill(255);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(16);
    p.textStyle(p.BOLD);
    p.text('Hangtime', 0, -75);
    
    // Subtitle
    p.textSize(11);
    p.textStyle(p.NORMAL);
    p.fill(200);
    p.text('longer hang time allows more time to advance', 0, -56);
    
    // Draw clock representation
    let clockRadius = 50;
    p.translate(0, 10);
    p.fill(50, 50, 50, 180);
    p.noStroke();
    p.circle(0, 5, clockRadius * 2);
    
    // Animated filled portion
    let fillAngle = p.map(hangtimeValue, 3, 6, 0, 360);
    p.fill(255, 200, 100, 200);
    p.arc(0, 5, clockRadius * 2, clockRadius * 2, -90, -90 + fillAngle, p.PIE);
    
    // Value text
    p.fill(255);
    p.textSize(20);
    p.textStyle(p.BOLD);
    p.text(hangtimeValue.toFixed(1) + 's', 0, 2);
    
    // Range indicator
    p.textSize(9);
    p.textStyle(p.NORMAL);
    p.fill(200);
    p.text('3-6 sec range', 0, 60);
  }
  
  function drawRunnerSpeedGauge() {
    // Background panel
    p.fill(0, 0, 0, 130);
    p.noStroke();
    p.rect(-120, -90, 240, 180, 10)
    
    // Title
    p.fill(255);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(16);
    p.textStyle(p.BOLD);
    p.text('Runner Speed', 0, -75);
    
    // Subtitle
    p.textSize(11);
    p.textStyle(p.NORMAL);
    p.fill(200);
    p.text('faster runner is more likely to advance', 0, -56);
    
    // Draw speedometer
    let gaugeRadius = 50;
    let gaugeStart = 180;
    let gaugeEnd = 360;
    
    // Gauge background
    p.translate(0, 10);
    p.stroke(50, 50, 50, 200);
    p.strokeWeight(16);
    p.noFill();
    p.arc(0, 10, gaugeRadius * 2, gaugeRadius * 2, gaugeStart, gaugeEnd);
    
    // Colored gauge
    let speedColor = p.lerpColor(p.color(255, 100, 100), p.color(100, 255, 100), 
                                p.map(runnerSpeedValue, 25, 30, 0, 1));
    p.stroke(speedColor);
    p.strokeWeight(14);
    let currentAngle = p.map(runnerSpeedValue, 25, 30, gaugeStart, gaugeEnd);
    p.arc(0, 15, gaugeRadius * 2, gaugeRadius * 2, gaugeStart, currentAngle);
    
    // Needle
    p.stroke(255);
    p.strokeWeight(3);
    let needleAngle = p.map(runnerSpeedValue, 25, 30, 180, 360);
    let needleLength = gaugeRadius - 5;
    p.line(0, 5, p.cos(needleAngle) * needleLength, 10 + p.sin(needleAngle) * needleLength);
    
    // Center dot
    p.fill(255);
    p.noStroke();
    p.circle(0, 5, 5);
    
    // Value
    p.fill(255);
    p.textSize(18);
    p.textStyle(p.BOLD);
    p.text(runnerSpeedValue.toFixed(1), 0, 8);
    
    // Unit
    p.textSize(10);
    p.textStyle(p.NORMAL);
    p.text('ft/s', 0, 24);
    
    // Range
    p.textSize(9);
    p.fill(200);
    p.text('25-30 ft/s range', 0, 60);
  }
  
  function drawExitSpeedGauge() {
    // Background panel (wider for center placement)
    p.fill(0, 0, 0, 200);
    p.noStroke();
    p.rect(-160, -60, 320, 110, 10);
    
    // Title
    p.fill(255);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(16);
    p.textStyle(p.BOLD);
    p.text('Exit Velocity', 0, -48);
    
    // Subtitle
    p.textSize(11);
    p.textStyle(p.NORMAL);
    p.fill(200);
    p.text('harder hits → higher advancement rate', 0, -30);
    
    // Horizontal bar
    let barWidth = 280;
    let barHeight = 26;
    let barX = -barWidth / 2;
    let barY = -2;
    
    // Background bar
    p.fill(50, 50, 50, 200);
    p.noStroke();
    p.rect(barX, barY, barWidth, barHeight, 12);
    
    // Filled portion
    let fillWidth = p.map(exitSpeedValue, 85, 105, 0, barWidth);
    let exitColor = p.lerpColor(p.color(255, 150, 100), p.color(255, 255, 100), 
                               p.map(exitSpeedValue, 85, 105, 0, 1));
    p.fill(exitColor);
    p.rect(barX, barY, fillWidth, barHeight, 12);
    
    // Value text
    p.fill(255);
    p.textSize(20);
    p.textStyle(p.BOLD);
    p.text(exitSpeedValue.toFixed(0) + ' mph', 0, 3);
    
    // Range
    p.textSize(10);
    p.fill(200);
    p.text('85-105 mph range', 0, 35);
  }
  
  function drawKeyInsight() {
    // Bottom insight box
    p.fill(0, 0, 0, 140);
    p.noStroke();
    p.rect(300, 960, 480, 85, 10);
    
    p.fill(255, 255, 150);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(14);
    p.textStyle(p.BOLD);
    p.text('Key Insights', 540, 982);
    
    p.fill(255);
    p.textSize(13);
    p.textStyle(p.NORMAL);
    p.text('To build a predictive modeling, we can use following features with strong signals: ', 540, 1005);
    p.text('runner_base, fielder_pos, hit_distance, exit_speed, hangtime', 540, 1022);
  }
  
  p.windowResized = function () { 
    p.resizeCanvas(p.windowWidth, p.windowHeight); 
  };
});