WindowControls = require "windowControls"

Framer.Device.contentScale = 1
Framer.Device.deviceType = "fullscreen"

# Awesomebar, with blur:40 of the content?
# multimedia, PiP
# pull page down again
# no tab
# swip left/right to switch tab

WINDOW_HEIGHT = 620
WINDOW_WIDTH = 600

ION =
	"font-family": "ion"
	"font-size": "14px"
	"line-height": "14px"
	"text-align": "center"
	"display": "inline-block"

page1 =
	domain: "qz.com"
	title: "Quartz"
	w: 2348
	h: 4586
	screenshot: "pages/p1.png"
	bg: "white"
	fg: "black"
	scrollable: true

page2 =
	domain: "instagram.com"
	title: "Instagram"
	w: 2246
	h: 1370
	screenshot: "pages/p2.png"
	bg: "#115688"
	fg: "white"
	scrollable: false

page3 =
	domain: "vimeo.com"
	title: "Staff Picks - Blood Pulls A …"
	w: 2348
	h: 4006
	screenshot: "pages/p3.png"
	bg: "#282828"
	fg: "white"
	scrollable: true

## WINDOW

new BackgroundLayer
	name: "background"
	backgroundColor: "#ecf0f1"
	image: "images/w6.jpg"

win = new Layer
	name: "window"
	width: WINDOW_WIDTH
	height: WINDOW_HEIGHT
	borderRadius: 6
	shadowBlur: 30,
	shadowSpread: 2,
	shadowY: 20,
	shadowColor: "rgba(0,0,0,0.5)"
	backgroundColor: "rgba(0,0,0,0.4)"

win.center();

## NAVBAR

Navbar = (page, height) ->
	navbar = new Layer
		height: height
		width: WINDOW_WIDTH
		backgroundColor: page.bg
		style: "border-radius": "3px 3px 0 0"
	ctrls = WindowControls(60, height, 6)
	ctrls.x = 5
	navbar.addSubLayer(ctrls)
	urlbar = new Layer
		height: 14
		backgroundColor: "#EEE"
		borderRadius: 100
		width: WINDOW_WIDTH / 3
		style:
			"font-size": "9px"
			"line-height": "13.5px"
			"color": "rgba(0,0,0,0.5)"
			"text-align": "center"
		html: page.domain + ": <strong>" + page.title + "</strong>"
	navbar.addSubLayer(urlbar)
	urlbar.center()
	
	reloadButton = new Layer
		backgroundColor: "transparent",
		x: WINDOW_WIDTH / 3 - 14
		height: 14,
		width: 14,
		style: ION
		html: "\uf49a"
	backButton = new Layer
		backgroundColor: "transparent",
		x: 0
		height: 14,
		width: 14,
		style: ION
		html: "\uf3d2"
	backButton.style["font-size"] = "12px"		
	urlbar.addSubLayer(reloadButton)
	urlbar.addSubLayer(backButton)
	
	navbar

## FRAMES


View = (page, x) ->
	
	navbar = Navbar(page, 30)

	innerWindow = new Layer
		x: x
		width: WINDOW_WIDTH
		height: WINDOW_WIDTH * page.h / page.w
		image: page.screenshot
		
	frame = new ScrollComponent
		y: navbar.height
		width: WINDOW_WIDTH
		height: WINDOW_HEIGHT,
		scrollHorizontal: false

	frame.content.addSubLayer(innerWindow)
	
	layer = new Layer
		width: WINDOW_WIDTH
		height: WINDOW_HEIGHT + navbar.height
		backgroundColor: page.bg
		borderRadius: 6
		originY: 0
		shadowSpread: 10
		shadowBlur: 10
		shadowColor: "rgba(0,0,0,0.2)"

	layer.addSubLayer(navbar)
	layer.addSubLayer(frame)
	
	layer.draggable.enabled = true
	layer.draggable.overdrag = false
	layer.draggable.horizontal = false
	layer.draggable.constraints =
		height: layer.height + navbar.height
		y: -1 * navbar.height

	PADDING = 100

	updateConstraints = () ->
		height = layer.height + navbar.height
		if frame.scrollY == 0
			frame.content.draggable.overdrag = false;
			layer.draggable.constraints.height = height + PADDING
		else
			frame.content.draggable.overdrag = true;
			layer.draggable.constraints.height = height
	
	updateConstraints();
	
	frame.on Events.ScrollAnimationDidEnd, -> updateConstraints();
	
	closeButton = new Layer
		backgroundColor: "transparent",
		height: navbar.height
		width: navbar.height
		style: ION
		opacity: 0
		html: "\uf129"
	closeButton.style.color = "black"
	closeButton.style["font-size"] = 0.5 * navbar.height + "px"
	closeButton.style["line-height"] = navbar.height + "px"
	closeButton.style.color = "#333"
	
	layer.addSubLayer(closeButton)
	
	localOnPullingView = (cursor) ->
		navbar.opacity = 1 - 2 * cursor;
		layer.scale = 1 - 0.3 * cursor;
		closeButton.opacity = cursor;

	
	layer.on Events.Move, ->
		cursor = 0
		if layer.y > 0
			cursor = layer.y / PADDING
		localOnPullingView(cursor)
		onPullingView(cursor)

	localOnPullingView(0)

	return layer

globalControls = WindowControls(60, 20, 6)

win.addSubLayer(globalControls)

#views = [View(page1, -WINDOW_WIDTH), View(page2, 0), View(page3, #WINDOW_WIDTH)]

#for view in views
#	win.addSubLayer(view)
win.addSubLayer(View(page1, 0))

onPullingView = (cursor) =>
	globalControls.opacity = 0.5 + cursor;

onPullingView(0)

