var WindowControls = require('./window-controls');

module.exports = function(page, width, height) {

  var navbar = new Layer({
    height: height,
    width: width,
    backgroundColor: page.bg,
    style: {
      "border-radius": "3px 3px 0 0"
    }
  });

  var ctrls = WindowControls(60, height, 6);
  ctrls.x = 5;

  navbar.addSubLayer(ctrls);

  var urlbar = new Layer({
    height: 14,
    backgroundColor: "#EEE",
    borderRadius: 100,
    width: width / 3,
    style: {
      "font-size": "9px",
      "line-height": "13.5px",
      "color": "rgba(0,0,0,0.5)",
      "text-align": "center"
    },
    html: page.domain + ": <strong>" + page.title + "</strong>"
  });

  navbar.addSubLayer(urlbar);
  urlbar.center();

  var reloadButton = new Layer({
    backgroundColor: "transparent",
    x: width / 3 - 14,
    height: 14,
    width: 14,
    style: {
      "font-family": "ion",
      "font-size": "14px",
      "line-height": "14px",
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
      "line-height": "14px",
      "text-align": "center",
      "display": "inline-block",
    },
    html: "\uf3d2"
  });

  urlbar.addSubLayer(reloadButton);
  urlbar.addSubLayer(backButton);

  return navbar;
}
