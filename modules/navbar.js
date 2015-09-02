var WindowControls = require('./window-controls');

exports.Navbar = function(page, width, height) {

  var urlbarHeight = 16;

  var navbar = new Layer({
    height: height,
    width: width,
    backgroundColor: page.bg,
    style: {
      "border-radius": "3px 3px 0 0",
    }
  });

  var ctrls = WindowControls(60, height, 6);
  ctrls.x = 5;

  navbar.addSubLayer(ctrls);

  var urlbar = new Layer({
    height: urlbarHeight,
    backgroundColor: "#EEE",
    borderRadius: 100,
    width: width / 3,
    style: {
      "font-size": "9px",
      "line-height": 0.9 * urlbarHeight + "px",
      "color": "rgba(0,0,0,0.5)",
      "text-align": "center"
    },
    html: page.domain + ": <strong>" + page.title + "</strong>"
  });

  navbar.addSubLayer(urlbar);
  urlbar.center();

  var reloadButton = new Layer({
    backgroundColor: "transparent",
    x: width / 3 - urlbarHeight,
    height: urlbarHeight,
    width: urlbarHeight,
    style: {
      "font-family": "ion",
      "font-size": urlbarHeight + "px",
      "line-height": urlbarHeight + "px",
      "text-align": "center",
      "display": "inline-block",
    },
    html: "\uf49a"
  });

  var backButton = new Layer({
    backgroundColor: "transparent",
    x: 0,
    height: 14,
    width: 14,
    style: {
      "font-family": "ion",
      "font-size": "12px",
      "line-height": urlbarHeight + "px",
      "text-align": "center",
      "display": "inline-block",
    },
    html: "\uf3d2"
  });

  urlbar.addSubLayer(reloadButton);
  urlbar.addSubLayer(backButton);

  return navbar;
}


exports.PreviewNavbar = function(page, width, height) {

  var bg = "white";
  var fg = "black";

  var closeButton = new Layer({
    backgroundColor: "transparent",
    height: height,
    width: height,
    x: width - height,
    style: {
      "font-family": "ion",
      "font-size": 0.5 * height + "px",
      "line-height": height + "px",
      "text-align": "center",
      "display": "inline-block",
      "color": fg,
    },
    html: "\uf129"
  });

  var layer = new Layer({
    height: height,
    width: width,
    backgroundColor: bg,
    style: {
      "border-radius": "3px 3px 0 0",
    }
  });

  var title = new Layer({
    backgroundColor: 'transparent',
    height: height,
    width: width,
    style: {
      "font-size": 0.5 * height + "px",
      "line-height": height + "px",
      "color": fg,
      "text-align": "center",
      "font-weight": "lighter",
    },
    html: page.domain + ": " + page.title
  });

  layer.addSubLayer(title);

  layer.addSubLayer(closeButton);

  return layer;
}
