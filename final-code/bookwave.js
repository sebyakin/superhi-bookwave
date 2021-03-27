// loop over each section, get the image and replace with a canvas
const sections = document.querySelectorAll("section")

sections.forEach(section => {
  
  const originalImage = section.querySelector("img")
  const originalImageSource = originalImage.getAttribute("src")
  
  section.innerHTML = ""
  
  // set up a pixi application
  const app = new PIXI.Application({
    width: 1100,
    height: 800,
    transparent: true
  })
  
  // add the pixi application to the section tag
  section.appendChild(app.view)
  
  // make a new image
  let image = null
  let displacementImage = null
  let rgbFilter = new PIXI.filters.RGBSplitFilter([0, 0], [0, 0], [0, 0])
  
  // make a new loader
  const loader = new PIXI.loaders.Loader()
  
  // load in our image
  loader.add("image", originalImageSource)
  loader.add("displacement", "displacement1.jpg")
  loader.load((loader, resources) => {
    // once the image has loaded, now do things
    image = new PIXI.Sprite(resources.image.texture)
    displacementImage = new PIXI.Sprite(resources.displacement.texture)
    
    image.x = 100 + 450
    image.y = 100 + 300
    image.width = 900
    image.height = 600
    image.interactive = true
    
    image.anchor.x = 0.5
    image.anchor.y = 0.5
    
    displacementImage.width = 600
    displacementImage.height = 600
    displacementImage.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT
    
    
    image.filters = [
      // new PIXI.filters.BlurFilter(3, 5),
      // new PIXI.filters.NoiseFilter(0.1)
      new PIXI.filters.DisplacementFilter(displacementImage, 100),
      rgbFilter
    ]
    
    // add the image to the app
    app.stage.addChild(image)
    app.stage.addChild(displacementImage)
    
    // add some rotation on each frame
    // app.ticker.add(() => {
    //   displacementImage.x = displacementImage.x + 1
    //   displacementImage.y = displacementImage.y + 1
    // })
  })
  
  let currentX = 0
  let aimX = 0
  let currentY = 0
  let aimY = 0
  
  // now i want to listen to mousemove
  section.addEventListener("mousemove", function (event) {
    aimX = event.pageX
    aimY = event.pageY
  })
  
  // lets make an animation in Javascript
  const animate = function () {
    // currentX should get towards aimX every frame
    const diffX = aimX - currentX
    const diffY = aimY - currentY
    
    currentX = currentX + (diffX * 0.05)
    currentY = currentY + (diffY * 0.05)
    
    // if there is a displacement image loaded, move it
    if (displacementImage) {
      displacementImage.x = currentX
      displacementImage.y = displacementImage.y + 1 + (diffY * 0.01)
      
      rgbFilter.red = [diffX * 0.1, 0]
      rgbFilter.green = [0, diffY * 0.1]
    }
    
    // keep running this animation every frame
    requestAnimationFrame(animate)
  }
  
  // load this animation up
  animate()  
})









