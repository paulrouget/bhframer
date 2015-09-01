# Awesomebar, with blur:40 of the content?
# multimedia, PiP
# pull page down again
# no tab
# swip left/right to switch tab

Framer.Device.deviceType = "fullscreen"

HEIGHT = 600
WIDTH = 600
NAVBARHEIGHT = 30

ION =
	"font-family": "ion"
	"font-size": "14px"
	"line-height": "14px"
	"text-align": "center"
	"display": "inline-block"

## WINDOW

new BackgroundLayer
	name: "background"
	#backgroundColor: "#ecf0f1"
	image: "images/w6.jpg"

win = new Layer
	name: "window"
	width: WIDTH
	height: HEIGHT
	borderRadius: 6
	shadowBlur: 30,
	shadowSpread: 2,
	shadowY: 20,
	shadowColor: "rgba(0,0,0,0.5)"
	backgroundColor: "rgba(0,0,0,0.4)"

win.center();

## NAVBAR

makeNavbar = (p) ->
	navbar = new Layer
		height: NAVBARHEIGHT
		width: WIDTH
		backgroundColor: p.bg
		style: "border-radius": "3px 3px 0 0"
	ctrls = new Layer
		x: 0
		height: 12
		width: 60
		backgroundColor: "transparent"
	b1 = new Layer
		x: 6
		width: 11
		height: 11
		backgroundColor: "#FF6056"
		borderRadius: 6
	b2 = b1.copy()
	b2.x = 24
	b2.backgroundColor = "#FFBE2F"
	b3 = b1.copy()
	b3.x = 42
	b3.backgroundColor = "#29CB41"
	ctrls.addSubLayer b1
	ctrls.addSubLayer b2
	ctrls.addSubLayer b3
	navbar.addSubLayer(ctrls)
	ctrls.centerY()
	urlbar = new Layer
		height: 14
		backgroundColor: "#EEE"
		borderRadius: 100
		width: HEIGHT / 3
		style:
			"font-size": "9px"
			"line-height": "13.5px"
			"color": "rgba(0,0,0,0.5)"
			"text-align": "center"
		html: "qz.com: <strong>Quartz</strong>"
	navbar.addSubLayer(urlbar)
	urlbar.center()
	
	reloadButton = new Layer
		backgroundColor: "transparent",
		x: HEIGHT / 3 - 14
		height: 14,
		width: 14,
		style: ION
		html: "\uf49a"
	
	backButton = reloadButton.copy()
	backButton.html = "\uf3d2"
	backButton.x = 0
	backButton.style = ION
	backButton.style["font-size"] = "12px"
		
	urlbar.addSubLayer(reloadButton)
	urlbar.addSubLayer(backButton)
	
	navbar

## FRAMES

p1 =
	w: 2348
	h: 4586
	url: "pages/p1.png"
	bg: "white"
	fg: "black"
	scrollable: true

p2 =
	w: 2246
	h: 1370
	url: "pages/p2.png"
	bg: "#115688"
	fg: "white"
	scrollable: false

p3 =
	w: 2348
	h: 4006
	url: "pages/p3.png"
	bg: "#282828"
	fg: "white"
	scrollable: true

frame = (p) ->
	
	navbar = makeNavbar(p)
	
	frame = new ScrollComponent
		y: navbar.height
		width: WIDTH
		height: HEIGHT,
		scrollHorizontal: false
		mouseWheelEnabled: true

	content = new Layer
		width: WIDTH
		height: WIDTH * p.h / p.w
		image: p.url

	frame.content.addSubLayer(content)
	
	scrollable = new ScrollComponent
		width: WIDTH
		height: HEIGHT
		backgroundColor: p.bg
		scrollHorizontal: false
		mouseWheelEnabled: true
	scrollable.content.addSubLayer(navbar)
	scrollable.content.addSubLayer(frame)
	
	if not p.scrollable
		scrollable.content.draggable.enabled = false;
	
	scrollable.content.draggable.overdrag = false;
	frame.content.draggable.overdrag = false;
	# frame.content.draggable.momentum = false;

	frame.on Events.ScrollAnimationDidEnd, (e)->
		if frame.scrollY == 0
			frame.content.draggable.overdrag = false;
		else
			frame.content.draggable.overdrag = true;



	win.addSubLayer(scrollable)

frame(p1)