console.log("Tendrils script loaded!");
(function() {
  var canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.zIndex = '0';
  canvas.style.pointerEvents = 'none';

  var context = canvas.getContext('2d');
  var width = canvas.width = window.innerWidth;
  var height = canvas.height = window.innerHeight;

  var mouse = { x: width / 2, y: height / 2 };
  document.addEventListener('mousemove', function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function Tendril() {
    this.spring = 0.45 + 0.025 * Math.random();
    this.friction = 0.5 + 0.05 * Math.random();
    this.nodes = [];

    for (var i = 0; i < 30; i++) {
      this.nodes.push({ x: mouse.x, y: mouse.y, vx: 0, vy: 0 });
    }
  }

  Tendril.prototype.update = function() {
    var node = this.nodes[0];
    node.vx += (mouse.x - node.x) * this.spring;
    node.vy += (mouse.y - node.y) * this.spring;

    for (var i = 1; i < this.nodes.length; i++) {
      var prev = this.nodes[i - 1];
      node = this.nodes[i];
      node.vx += (prev.x - node.x) * this.spring;
      node.vy += (prev.y - node.y) * this.spring;
      node.vx *= this.friction;
      node.vy *= this.friction;
      node.x += node.vx;
      node.y += node.vy;
    }
  };

  Tendril.prototype.draw = function(context) {
    context.beginPath();
    context.moveTo(this.nodes[0].x, this.nodes[0].y);
    for (var i = 1; i < this.nodes.length - 2; i++) {
      var xc = (this.nodes[i].x + this.nodes[i + 1].x) / 2;
      var yc = (this.nodes[i].y + this.nodes[i + 1].y) / 2;
      context.quadraticCurveTo(this.nodes[i].x, this.nodes[i].y, xc, yc);
    }
    context.stroke();
  };

  var tendrils = [];
  for (var i = 0; i < 30; i++) {
    tendrils.push(new Tendril());
  }

  function loop() {
    context.clearRect(0, 0, width, height);
    context.strokeStyle = 'rgba(0,255,255,0.5)';
    context.lineWidth = 1.5;

    for (var i = 0; i < tendrils.length; i++) {
      tendrils[i].update();
      tendrils[i].draw(context);
    }

    requestAnimationFrame(loop);
  }

  loop();
})();
