var WindowControls = require('./modules/window-controls');
var Pages = require('./modules/pages');
var View = require('./modules/view');

var WINDOW_HEIGHT = 600;
var WINDOW_WIDTH = 600;
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


win.addSubLayer(View(Pages[0], preview, WINDOW_WIDTH, WINDOW_HEIGHT, 0, PADDING));
/*
for (var page of Pages) {
  var layer = View(page, preview,
                   WINDOW_WIDTH, WINDOW_HEIGHT, 0, PADDING);
  win.addSubLayer(layer);
}
*/

function preview(enabled) {
  if (enabled) {
    globalControls.animate({
      properties: {
        opacity: 1
      },
      time: 0.2
    });
  } else {
    globalControls.animate({
      properties: {
        opacity: 0
      },
      time: 0.2
    });
  }
}

preview(false);
