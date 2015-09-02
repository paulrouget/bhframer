var WindowControls = require('./modules/window-controls');
var Navbar = require('./modules/navbar');

var WINDOW_HEIGHT = 620;
var WINDOW_WIDTH = 600;
var PADDING = 100;

var page1 = {
  domain: "qz.com",
  title: "Quartz",
  w: 2348,
  h: 4586,
  screenshot: "pages/p1.png",
  bg: "white",
  fg: "black",
  scrollable: true
};

var page2 = {
  domain: "instagram.com",
  title: "Instagram",
  w: 2246,
  h: 1370,
  screenshot: "pages/p2.png",
  bg: "#115688",
  fg: "white",
  scrollable: false
};

var page3 = {
  domain: "vimeo.com",
  title: "Staff Picks - Blood Pulls A …",
  w: 2348,
  h: 4006,
  screenshot: "pages/p3.png",
  bg: "#282828",
  fg: "white",
  scrollable: true
};

new BackgroundLayer({
  name: "background",
  backgroundColor: "#ecf0f1",
  image: "images/w6.jpg"
});

var win = new Layer({
  name: "window",
  width: WINDOW_WIDTH,
  height: WINDOW_HEIGHT,
  borderRadius: 6,
  shadowBlur: 30,
  shadowSpread: 2,
  shadowY: 20,
  shadowColor: "rgba(0,0,0,0.5)",
  backgroundColor: "rgba(0,0,0,0.4)"
});

win.center();

var View = function(page, x) {
  var navbar = Navbar(page, WINDOW_WIDTH, 30);
  var innerWindow = new Layer({
    x: x,
    width: WINDOW_WIDTH,
    height: WINDOW_WIDTH * page.h / page.w,
    image: page.screenshot
  });
  var frame = new ScrollComponent({
    y: navbar.height,
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    scrollHorizontal: false
  });
  frame.content.addSubLayer(innerWindow);
  var layer = new Layer({
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT + navbar.height,
    backgroundColor: page.bg,
    borderRadius: 6,
    originY: 0,
    shadowSpread: 10,
    shadowBlur: 10,
    shadowColor: "rgba(0,0,0,0.2)"
  });
  layer.addSubLayer(navbar);
  layer.addSubLayer(frame);
  layer.draggable.enabled = true;
  layer.draggable.overdrag = false;
  layer.draggable.horizontal = false;
  layer.draggable.constraints = {
    height: layer.height + navbar.height,
    y: -1 * navbar.height
  };

  var updateConstraints = function() {
    var height;
    height = layer.height + navbar.height;
    if (frame.scrollY === 0) {
      frame.content.draggable.overdrag = false;
      return layer.draggable.constraints.height = height + PADDING;
    } else {
      frame.content.draggable.overdrag = true;
      return layer.draggable.constraints.height = height;
    }
  };

  updateConstraints();

  frame.on(Events.ScrollAnimationDidEnd, function() {
    return updateConstraints();
  });

  var closeButton = new Layer({
    backgroundColor: "transparent",
    height: navbar.height,
    width: navbar.height,
    style: {
      "font-family": "ion",
      "font-size": 0.5 * navbar.height + "px",
      "line-height": "14px",
      "text-align": "center",
      "display": "inline-block",
      "color": "#333",
    },
    opacity: 0,
    html: "\uf129"
  });

  layer.addSubLayer(closeButton);

  var localOnPullingView = function(cursor) {
    navbar.opacity = 1 - 2 * cursor;
    layer.scale = 1 - 0.3 * cursor;
    closeButton.opacity = cursor;
  };

  layer.on(Events.Move, function() {
    var cursor;
    cursor = 0;
    if (layer.y > 0) {
      cursor = layer.y / PADDING;
    }
    localOnPullingView(cursor);
    return onPullingView(cursor);
  });

  localOnPullingView(0);

  return layer;
};

var globalControls = WindowControls(60, 20, 6);

win.addSubLayer(globalControls);

win.addSubLayer(View(page1, 0));

var onPullingView = (function(_this) {
  return function(cursor) {
    return globalControls.opacity = 0.5 + cursor;
  };
})(this);

onPullingView(0);
