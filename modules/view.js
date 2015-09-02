var Navbar = require('./navbar');

module.exports = function(
  page, previewCallback,
  windowWidth, windowHeight, x, padding) {

  var navbar = Navbar.Navbar(page, windowWidth, 30);

  var previewNavbar = Navbar.PreviewNavbar(page, windowWidth, 60);
  previewNavbar.opacity = 0;

  var innerWindow = new Layer({
    x: x,
    width: windowWidth,
    height: windowWidth * page.h / page.w,
    image: page.screenshot
  });

  var frame = new ScrollComponent({
    y: navbar.height,
    width: windowWidth,
    height: windowHeight,
    scrollHorizontal: false
  });

  frame.content.addSubLayer(innerWindow);

  var layer = new Layer({
    width: windowWidth,
    height: windowHeight + navbar.height,
    backgroundColor: page.bg,
    borderRadius: 6,
    shadowSpread: 10,
    shadowBlur: 10,
    shadowColor: "rgba(0,0,0,0.2)"
  });

  layer.addSubLayer(navbar);
  layer.addSubLayer(frame);
  layer.addSubLayer(previewNavbar);

  layer.draggable.enabled = true;
  layer.draggable.overdrag = false;
  layer.draggable.horizontal = false;
  layer.draggable.momentum = false;
  layer.draggable.constraints = {
    height: layer.height + navbar.height,
    y: -1 * navbar.height
  };

  var updateConstraints = function() {
    var height = layer.height + navbar.height;
    if (frame.scrollY === 0) {
      frame.content.draggable.overdrag = false;
      layer.draggable.constraints.height = height + padding;
    } else {
      frame.content.draggable.overdrag = true;
      layer.draggable.constraints.height = height;
    }
  };

  updateConstraints();
  frame.on(Events.ScrollAnimationDidEnd, updateConstraints);

  var previewMode = false;

  layer.on(Events.Move, function() {
    if (layer.y > 0) {
      frame.scrollVertical = false;
    }
    if (layer.y >= 0.8 * padding) {
      previewOn();
    }
  });

  layer.on(Events.DragEnd, function() {
    if (layer.y > 0 && layer.y < 0.8 * padding) {
      layer.animate({
        time: 0.2,
        curve: "spring-rk4",
        curveOptions: {
          tension: 100,
          friction: 10,
          velocity: 0,
        },
        properties: {
          y: 0,
        }
      });
    }
  });

  layer.on(Events.Click, function() {
    if (previewMode) {
      previewOff();
    }
  });


  function previewOn() {

    var curveOptions = {
      tension: 100,
      friction: 10,
      velocity: 0,
    }

    layer.animate({
      time: 1,
      curve: "spring-rk4",
      curveOptions: curveOptions,
      properties: {
        y: 0,
        scale: 0.4,
      }
    });

    previewNavbar.animate({
      curve: "spring-rk4",
      curveOptions: curveOptions,
      properties: {
        opacity: 1
      }
    });

    previewCallback(true);
    layer.draggable = false;
    // Should wait for AnimationEnd event, but I'm lazy
    setTimeout(function() { previewMode = true }, 2000);

  }

  function previewOff() {
    previewMode = false;
    layer.draggable = true;
    frame.scrollVertical = true;

    layer.animate({
      time: 0.2,
      curve: "linear",
      properties: {
        scale: 1,
      }
    });

    previewNavbar.animate({
      time: 0.2,
      curve: "linear",
      properties: {
        opacity: 0
      }
    });


    previewCallback(false);
  }

  return layer;
};
