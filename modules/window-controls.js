module.exports = function(width, height, radius) {
  var WindowButton, b1, b2, b3, layer;
  WindowButton = function(bg) {
    return new Layer({
      height: radius * 2,
      width: radius * 2,
      borderRadius: radius,
      backgroundColor: bg
    });
  };
  b1 = WindowButton("#FF6056");
  b2 = WindowButton("#FFBE2F");
  b3 = WindowButton("#29CB41");
  b1.x = width / 6 - radius;
  b2.x = width / 3 + b1.x;
  b3.x = width / 3 + b2.x;
  layer = new Layer({
    width: width,
    height: height,
    backgroundColor: "transparent"
  });
  layer.addSubLayer(b1);
  layer.addSubLayer(b2);
  layer.addSubLayer(b3);
  b1.centerY();
  b2.centerY();
  b3.centerY();
  return layer;
}
