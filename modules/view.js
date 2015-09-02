var Bars = require('./navbar');

var PADDING = 100;

function View(page, size) {

  var self = this;

  var navbar = Bars.Navbar(page, size.width, 30);

  self.previewNavbar = Bars.PreviewNavbar(page, size.width, 60);

  self.previewNavbar.opacity = 0;

  var innerWindow = new Layer({
    width: size.width,
    height: size.width * page.h / page.w,
    image: page.screenshot
  });

  var layer = new Layer({
    width: size.width,
    height: 1.5 * size.height + navbar.height,
    backgroundColor: page.bg,
    borderRadius: 6,
    originY: 0.2,
    shadowSpread: 10,
    shadowBlur: 10,
    shadowColor: "rgba(0,0,0,0.2)"
  });

  self.frame = new ScrollComponent({
    y: navbar.height,
    width: size.width,
    height: layer.height,
    scrollHorizontal: false
  });

  self.frame.content.addSubLayer(innerWindow);


  self.veil = new Layer({
    y: self.previewNavbar.height,
    width: size.width,
    height: layer.height,
    backgroundColor: 'black',
    opacity: 0,
    ignoreEvents: true,
  });

  layer.addSubLayer(navbar);
  layer.addSubLayer(self.frame);
  layer.addSubLayer(self.previewNavbar);
  layer.addSubLayer(self.veil);

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
    if (self.frame.scrollY === 0) {
      self.frame.content.draggable.overdrag = false;
      layer.draggable.constraints.height = height + PADDING;
    } else {
      self.frame.content.draggable.overdrag = true;
      layer.draggable.constraints.height = height;
    }
  };

  updateConstraints();
  self.frame.on(Events.ScrollAnimationDidEnd, updateConstraints);

  layer.on(Events.Move, function() {
    if (layer.y > 0) {
      self.frame.scrollVertical = false;
    }
    if (layer.y >= 0.8 * PADDING) {
      self.previewOn();
    }
  });

  layer.on(Events.DragEnd, function() {
    if (layer.y > 0 && layer.y < 0.8 * PADDING) {
      self.frame.scrollVertical = true;
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
    self.previewOff();
  });

  self._previewMode = false;

  self.layer = layer;
}

View.prototype = {

  select: function() {
    var self = this;
    self.veil.animate({
      time: 1,
      properties: {
        opacity: 0,
      }
    });
  },

  unselect: function() {
    var self = this;
    self.veil.animate({
      time: 1,
      properties: {
        opacity: 0.6,
      }
    });
  },

  previewOn: function() {

    var self = this;

    if (self._previewMode) {
      return;
    }

    var curveOptions = {
      tension: 100,
      friction: 15,
      velocity: 0,
    }

    self.layer.animate({
      curve: "spring-rk4",
      curveOptions: curveOptions,
      properties: {
        y: 0,
        scale: 0.25,
      }
    });

    self.previewNavbar.animate({
      curve: "spring-rk4",
      curveOptions: curveOptions,
      properties: {
        opacity: 1
      }
    });

    self.layer.draggable = false;
    // Should wait for AnimationEnd event, but I'm lazy
    setTimeout(function() { self._previewMode = true }, 2000);

    if (self.previewCallback)
      self.previewCallback(true);
  },

  previewOff: function() {

    var self = this;

    if (!self._previewMode) {
      return;
    }

    self._previewMode = false;
    self.layer.draggable = true;
    self.frame.scrollVertical = true;

    self.layer.animate({
      time: 0.2,
      curve: "linear",
      properties: {
        scale: 1,
      }
    });

    self.previewNavbar.animate({
      time: 0.2,
      curve: "linear",
      properties: {
        opacity: 0
      }
    });

    if (self.previewCallback)
      self.previewCallback(false);
  },
}

module.exports = View;
