// Example 10
registerSketch('sk14', function (p) {

  let PAD = 20;

  let circsH = [];  // hour circles
  let circsM = [];  // minute circles
  let circsS = [];  // second circles (accumulate, then reset each minute)

  let lastHour = -1;
  let lastMinute = -1;
  let lastSecond = -1;

  let wW;
  let hW;

  p.setup = function () {
    wW = p.windowWidth;
    wH = p.windowHeight;
    p.createCanvas(wW, wH);
    p.frameRate(10);

    // Build initial state so it doesn't start empty
    const h24 = p.hour();
    const h12 = (h24 % 12) || 12;
    const m = p.minute();
    const s = p.second();

    p.placeN(h12, wW/12, wH/6, 'hour', circsH);  // hours
    p.placeN(m, wW/14, wH/14, 'min', circsM);  // minutes
    p.placeN(s, wW/32, wH/28, 'sec', circsS);  // seconds already elapsed

    // Set last-variables so we only react on change afterward
    lastHour = h24;
    lastMinute = m;
    lastSecond = s;
  }

  p.draw = function () {
    p.background(250);
    p.noStroke();

    const h24 = p.hour();
    const h12 = (h24 % 12) || 12;
    const m = p.minute();
    const s = p.second();

    // Rebuild hours once per hour
    if (h24 !== lastHour) {
      circsH = [];
      p.placeN(h12, wW/12, wH/6, 'hour', circsH)
      lastHour = h24;
    }

    // Rebuild minutes once per minute
    if (m !== lastMinute) {
      circsM = [];
      p.placeN(m, wW/14, wH/14, 'min', circsM)
      lastMinute = m;
    }

    // Seconds: add one each second; reset at start of minute
    if (s !== lastSecond) {
      if (s === 0) {
        circsS = []; // reset
      } else {
        p.placeOne(wW/32, wH/28, 'sec', circsS); // add exactly one
      }
      lastSecond = s;
    }

    // Draw layers
    p.drawCircles(circsH, p.color(2, 2, 255));
    p.drawCircles(circsM, p.color(140, 140, 255));
    p.drawCircles(circsS, p.color(217, 217, 255));

    // time label
    p.fill(0);
    p.textSize(40);
    p.textAlign(p.LEFT, p.TOP);
    p.text(`${p.nf(h12, 2)}:${p.nf(m, 2)}:${p.nf(s, 2)}`, 10, 10);
  }

  // ------- helpers -------
  p.drawCircles = function (arr, col) {
    p.fill(col);
    for (let c of arr) p.ellipse(c.x, c.y, c.d);
  }

  p.placeN = function (n, minD, maxD, type, target) {
    for (let i = 0; i < n; i++) p.placeOne(minD, maxD, type, target);
  }

  p.placeOne = function (minD, maxD, type, target) {
    let tries = 0;
    while (tries < 800) {
      tries++;
      const d = p.random(minD, maxD);
      const x = p.random(PAD + d / 2, p.width - PAD - d / 2);
      const y = p.random(PAD + d / 2, p.height - PAD - d / 2);
      if (p.isFree(x, y, d)) {
        target.push({ x, y, d, type });
        return true;
      }
    }
    return false; // (give up, too packed)
  }

  p.isFree = function (x, y, d) {
    const all = circsH.concat(circsM, circsS);
    for (let c of all) {
      if (p.dist(x, y, c.x, c.y) < (d / 2 + c.d / 2 + 1)) return false;
    }
    return true;
  }


  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
