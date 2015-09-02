/**
 * TODO:
 *  awesomebar
 *  other tabs
 *  horizontal swipe
 *  PiP
 *  also animate non-selected previews
 *  refactor the view code
 */

var WindowControls = require('./modules/window-controls');
var Pages = require('./modules/pages');
var View = require('./modules/view');

var WINDOW_HEIGHT = 600;
var WINDOW_WIDTH = 800;
var PADDING = 100;

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

var globalControls = WindowControls(60, 20, 6);
globalControls.opacity = 0;
win.addSubLayer(globalControls);

var size = {width: WINDOW_WIDTH, height: WINDOW_HEIGHT};

// var v0 = new View(Pages[0], size)
var v1 = new View(Pages[1], size)
var v2 = new View(Pages[2], size)
var v3 = new View(Pages[3], size)
// var v4 = new View(Pages[4], size)

function onFullPreview(preview) {

  if (preview) {

    globalControls.animate({
      properties: {
        opacity: 1
      },
      time: 0.2
    });


    // for (var v of [v0, v1, v3, v4]) {
    for (var v of [v1, v3]) {
      v.layer.animate({
        curve: "spring-rk4",
        curveOptions: {
          tension: 200,
          friction: 10,
          velocity: 0,
        },
        properties: {
          x: v.layer._orgX
        }
      });
    }

  } else {

    globalControls.animate({
      properties: {
        opacity: 0
      },
      time: 0.2
    });

    // for (var v of [v0, v1, v3, v4]) {
    for (var v of [v1, v3]) {
      v.layer.animate({
        properties: {
          x: v.layer._orgX * 2
        }
      });
    }

  }

}

// v0.unselect();
v1.unselect();
v2.select();
v3.unselect();
// v4.unselect();

// v0.previewOn();
v1.previewOn();
v2.previewOff();
v3.previewOn();
// v4.previewOn();

// v0.layer._orgX = v0.layer.x = -480;
v1.layer._orgX = v1.layer.x = -240;
v2.layer._orgX = v2.layer.x =    0;
v3.layer._orgX = v3.layer.x =  240;
// v4.layer._orgX = v4.layer.x =  480;


// win.addSubLayer(v0.layer);
// win.addSubLayer(v4.layer);
win.addSubLayer(v1.layer);
win.addSubLayer(v3.layer);
win.addSubLayer(v2.layer);

v2.previewCallback = onFullPreview;

onFullPreview(false);
