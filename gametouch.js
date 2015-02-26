// space = 32
// left ctrl = 17
// up = 38
// down = 40
// left = 37
// right = 39
var gamepad_config = {
  bindA: { press: keyDown, release: null, keyCode: 32 },
  bindB: { press: keyDown, release: null, keyCode: 17 },
  bindDirections: {
    up: { press: keyDown, release: keyUp, keyCode: 38 },
    down: { press: keyDown, release: keyUp, keyCode: 40 },
    left: { press: keyDown, release: keyUp, keyCode: 37 },
    right: { press: keyDown, release: keyUp, keyCode: 39 }
  },
  parentId: '',
  useAnalog: true,
  dualAnalog: false,
  scale: 1
};

var gamepad = {
  controls: {},
  show: function(){
    for (i in this.controls){
      this.controls[i].style.display = 'block';
    }
  },
  hide: function(){
    for (i in this.controls){
      this.controls[i].style.display = 'none';
    }
  },
  setScale: function(scale){
    this.scale = scale;
  }
};

(function(){
  document.addEventListener('DOMContentLoaded', function(){
    initGamepad(gamepad, gamepad_config);
  });
})();

function initGamepad(gp, conf){
	function checkTouch(){
    try {
      document.createEvent("TouchEvent");
      return true;
    } catch (e) {
      return false;
    }
  }

  if (checkTouch()){
    console.info('Touch input detected!');
    conf.useanalog = conf.useanalog || false;
    conf.dualanalog = conf.dualanalog || false;
    gp.parent = document.getElementById(conf.parentId) || document.body;
    var controls = gp.controls;
    var stick = {};

    if (conf.bindA && (conf.bindA.press || conf.bindA.release)) generateActionBtn(controls, 'a', conf.bindA);
    if (conf.bindB && (conf.bindB.press || conf.bindB.release)) generateActionBtn(controls, 'b', conf.bindB);
    if (conf.useAnalog) {
      generateAnalog(controls, 'left');
    } else {
      generateDirectionalBtn(controls, 'up', conf.bindDirections.up);
      generateDirectionalBtn(controls, 'down', conf.bindDirections.down);
      generateDirectionalBtn(controls, 'left', conf.bindDirections.left);
      generateDirectionalBtn(controls, 'right', conf.bindDirections.right);
    }

    // Adding controls to the page
    for (x in controls){ gp.parent.appendChild(controls[x]); };

    // After-render settings
    if (controls.a && controls.b) {
      controls.a.className = 'gamepad-el gamepad-action-two';
      controls.b.className = 'gamepad-el gamepad-action-two';
    }
    if (controls.analog_left) {
      var a = controls.analog_left;
      var s = window.getComputedStyle(a);
      gp.analogCenter = {
        x: a.offsetLeft + (parseInt(s.width)/2),
        y: a.offsetTop + (parseInt(s.height)/2)
      };
    }

    // Analog events
    function analogStart(evt){
      gp.stick = {
        pos: {
          x: controls.analog_left.childNodes[0].getBoundingClientRect().left/gp.scale,
          y: controls.analog_left.childNodes[0].getBoundingClientRect().top/gp.scale
        },
        radius: controls.analog_left.childNodes[0].offsetWidth/2,
        limit: controls.analog_left.offsetWidth/2
      }
    }
    function analogMove(evt){
      evt.preventDefault();
      var bd = conf.bindDirections;
      var x = evt.targetTouches[0].clientX / gp.scale;
      var y = evt.targetTouches[0].clientY / gp.scale;
      var radians = Math.atan2(x - gp.analogCenter.x, y - gp.analogCenter.y);
      var degrees = (radians * (4 / Math.PI));
      animateStick(controls.analog_left.childNodes[0], x, y);

      if (degrees >= 2.5 && degrees < 3.5) { //up right
        bd.up.press({ keyCode: bd.up.keyCode });
        bd.down.release({ keyCode: bd.down.keyCode });
        bd.left.release({ keyCode: bd.left.keyCode });
        bd.right.press({ keyCode: bd.right.keyCode });
      } else if (degrees >= 1.5 && degrees < 2.5) { //right
        bd.up.release({ keyCode: bd.up.keyCode });
        bd.down.release({ keyCode: bd.down.keyCode });
        bd.left.release({ keyCode: bd.left.keyCode });
        bd.right.press({ keyCode: bd.right.keyCode });
      } else if (degrees >= 0.5 && degrees < 1.5){ //down right
        bd.up.release({ keyCode: bd.up.keyCode });
        bd.down.press({ keyCode: bd.down.keyCode });
        bd.left.release({ keyCode: bd.left.keyCode });
        bd.right.press({ keyCode: bd.right.keyCode });
      } else if (degrees >= -0.5 && degrees < 0.5) { //down
        bd.up.release({ keyCode: bd.up.keyCode });
        bd.down.press({ keyCode: bd.down.keyCode });
        bd.left.release({ keyCode: bd.left.keyCode });
        bd.right.release({ keyCode: bd.right.keyCode });
      } else if (degrees >= -1.5 && degrees < 0.5) { //down left
        bd.up.release({ keyCode: bd.up.keyCode });
        bd.down.press({ keyCode: bd.down.keyCode });
        bd.left.press({ keyCode: bd.left.keyCode });
        bd.right.release({ keyCode: bd.right.keyCode });
      } else if (degrees >= -2.5 && degrees < -1.5) { //left
        bd.up.release({ keyCode: bd.up.keyCode });
        bd.down.release({ keyCode: bd.down.keyCode });
        bd.left.press({ keyCode: bd.left.keyCode });
        bd.right.release({ keyCode: bd.right.keyCode });
      } else if (degrees >= -3.5 && degrees < -2.5) { //up left
        bd.up.press({ keyCode: bd.up.keyCode });
        bd.down.release({ keyCode: bd.down.keyCode });
        bd.left.press({ keyCode: bd.left.keyCode });
        bd.right.release({ keyCode: bd.right.keyCode });
      } else { //up
        bd.up.press({ keyCode: bd.up.keyCode });
        bd.down.release({ keyCode: bd.down.keyCode });
        bd.left.release({ keyCode: bd.left.keyCode });
        bd.right.release({ keyCode: bd.right.keyCode });
      }
    }
    function analogEnd(evt){
      evt.preventDefault();
      for (x in conf.bindDirections) {
        var d = conf.bindDirections[x];
        d.release({keyCode: d.keyCode});
      }
      setCSSTransform(controls.analog_left.childNodes[0], 'translate(0px, 0px)');
    }
    function animateStick(el, touchX, touchY){
      var radius = gp.stick.radius;
      var limit = gp.stick.limit;
      var pos = gp.stick.pos;
      var x1 = pos.x + radius;
      var y1 = pos.y + radius;
      var x2 = touchX;
      var y2 = touchY;
      var cat1 = Math.abs(x2 - x1);
      var cat2 = Math.abs(y2 - y1);
      var hip = Math.sqrt(Math.pow(cat1, 2) + Math.pow(cat2, 2));

      if (hip < limit){
        var tX = (touchX - pos.x) - radius;
        var tY = (touchY - pos.y) - radius;
      } else {
        var tgt = getFinalPoint({ x: x1, y: y1 }, { x: x2, y: y2 }, limit);
        var tX = (tgt.x - pos.x) - radius;
        var tY = (tgt.y - pos.y) - radius;
      }
      setCSSTransform(el, 'translate(' + tX + 'px,' + tY + 'px)');
    }

    // Button generation functions (separated for a cleaner code)
    function generateActionBtn(ctrls, name, actions){
      ctrls[name] = document.createElement('div');
      ctrls[name].setAttribute('id', 'gamepad-' + name);
      ctrls[name].className = 'gamepad-el gamepad-action-one';
      ctrls[name].innerHTML = name.toUpperCase();
      if (actions.press){
        ctrls[name].addEventListener('touchstart', function(evt){
          evt.preventDefault();
          actions.press({ keyCode: actions.keyCode });
        });
      }
      if (actions.release){
        ctrls[name].addEventListener('touchend', function(evt){
          evt.preventDefault();
          actions.release({ keyCode: actions.keyCode });
        });
      }
    }
    function generateDirectionalBtn(ctrls, direction, actions){
      controls[direction] = document.createElement('div');
      controls[direction].setAttribute('id', 'gamepad-' + direction);
      controls[direction].className = 'gamepad-el gamepad-directional';
      if (actions.press){
        ctrls[direction].addEventListener('touchstart', function(evt){
          evt.preventDefault();
          actions.press({ keyCode: actions.keyCode });
        });
      }
      if (actions.release){
        ctrls[direction].addEventListener('touchend', function(evt){
          evt.preventDefault();
          actions.release({ keyCode: actions.keyCode });
        });
      }
    }
    function generateAnalog(ctrls, side){
      controls['analog_'+side] = document.createElement('div');
      controls['analog_'+side].setAttribute('id', 'gamepad-analog-' + side);
      controls['analog_'+side].setAttribute('data-side', side);
      controls['analog_'+side].className = 'gamepad-el gamepad-analog';
      controls['analog_'+side].addEventListener('touchstart', analogStart);
      controls['analog_'+side].addEventListener('touchmove', analogMove);
      controls['analog_'+side].addEventListener('touchend', analogEnd);
      var ball = document.createElement('div');
      ball.setAttribute('id', 'gamepad-analog-stick-' + side);
      ball.className = 'gamepad-el gamepad-analog-stick';
      ball.setAttribute('data-side', side);
      controls['analog_'+side].appendChild(ball);
    }

    //Helpers
    function setCSSTransform(el, val) {
      if (!el) return false;
      el.style.transform = val;
      el.style.webkitTransform = val;
      el.style.mozTransform = val;
      el.style.msTransform = val;
      el.style.oTransform = val;
    }
    function getFinalPoint(p1, p2, finalDist) {
      function lineDistance(point1, point2){
        var xs = 0;
        var ys = 0;
        xs = point2.x - point1.x;
        xs = xs * xs;
        ys = point2.y - point1.y;
        ys = ys * ys;
        return Math.sqrt(xs + ys);
      }
      function ruleOfThree(a, b, c, d){
        return ((c * b) / a) + d;
      }
      var parcialDist = lineDistance(p1, p2);
      var finalX = ruleOfThree(parcialDist, finalDist, p2.x - p1.x, p1.x);
      var finalY = ruleOfThree(parcialDist, finalDist, p2.y - p1.y, p1.y);
      return {x: finalX, y: finalY}
    };
  } else {
    console.info('No touch input detected');
  }
};