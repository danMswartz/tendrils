(function() {
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.zIndex = '0';
  canvas.style.pointerEvents = 'none';

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const mouse = { x: width / 2, y: height / 2 };
  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function Tendril() {
    this.spring = 0.4 + Math.random() * 0.1;
    this.friction = 0.5 + Math.random() * 0.05;
    this.nodes = Array.from({ length: 30 }, () => ({
      x: mouse.x,
      y: mouse.y,
      vx: 0,
      vy: 0,
    }));
  }

  Tendril.prototype.update = function() {
    let node = this.nodes[0];
    node.vx += (mouse.x - node.x) * this.spring;
    node.vy += (mouse.y - node.y) * this.spring;

    for (let i = 1; i < this.nodes.length; i++) {
      const prev = this.nodes[i - 1];
      node = this.nodes[i];
      node.vx += (prev.x - node.x) * this.spring;
      node.vy += (prev.y - node.y) * this.spring;
      node.vx *= this.friction;
      node.vy *= this.friction;
      node.x += node.vx;
      node.y += node.vy;
    }
  };

  Tendril.prototype.draw = function(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.nodes[0].x, this.nodes[0].y);
    for (let i = 1; i < this.nodes.length - 2; i++) {
      const xc = (this.nodes[i].x + this.nodes[i + 1].x) / 2;
      const yc = (this.nodes[i].y + this.nodes[i + 1].y) / 2;
      ctx.quadraticCurveTo(this.nodes[i].x, this.nodes[i].y, xc, yc);
    }
    ctx.stroke();
  };

  const tendrils = Array.from({ length: 20 }, () => new Tendril());

  function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(0,255,255,0.9)';
    ctx.lineWidth = 1.5;

    for (const t of tendrils) {
      t.update();
      t.draw(ctx);
    }

    requestAnimationFrame(loop);
  }

  loop();
})();