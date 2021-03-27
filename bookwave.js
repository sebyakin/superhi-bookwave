// loog over each section and replace images with canvas

const sections = document.querySelectorAll('section')

// section is a new variable for each
sections.forEach(section => {
    
    const originalImage = section.querySelector('img')
    const originalImageSource = originalImage.getAttribute('src')

    section.innerHTML = ''

    // set up pixi
    const app = new PIXI.Application({
        width: 1100,
        height: 800,
        transparent: true
    }) 
    
    // add canvas to sections instead of original imgs
    section.appendChild(app.view)

    // make a new image
    let image = null
    let displacementImage = null
    let rgbFilter = new PIXI.filters.RGBSplitFilter([0,0],[0,0],[0,0])

    // make loader to load stuff
    const loader = new PIXI.loaders.Loader()

    // load imags
    loader.add('image', originalImageSource)
    loader.add('displacement', 'assets/displacement1.jpg')
    loader.load((loader, resources) => {
        image = new PIXI.Sprite(resources.image.texture)
        displacementImage = new PIXI.Sprite(resources.displacement.texture)

        image.x = 100 + 350
        image.y = 100 + 450
        image.width = 900
        image.height = 600
        image.interactive = true

        image.anchor.x = 0.5
        image.anchor.y = 0.5

        displacementImage.width = 500
        displacementImage.height = 500
        displacementImage.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT



        const displacementFilter = new PIXI.filters.DisplacementFilter(displacementImage, 100)
        const shockwaveFilter = new PIXI.filters.ShockwaveFilter()

        image.filters = [
            // new PIXI.filters.BlurFilter(3, 5),
            // new PIXI.filters.NoiseFilter(0.1),
            displacementFilter,
            rgbFilter
            // shockwaveFilter
        ]

        

        app.stage.addChild(image)
        app.stage.addChild(displacementImage)




        // add some movement on each frame. ticker is a clock
        // app.ticker.add(() => {
        //   displacementImage.x = displacementImage.x + 1
        //   displacementImage.y = displacementImage.y + 1
        // })
    })


    let currentX = 0
    let aimX = 0 
    let currentY = 0
    let aimY = 0 


    // listen mouse movs 
    section.addEventListener('mousemove', function(event) {
        aimX = event.pageX
        aimY = event.pageY
        // displacementImage.y = event.pageY
    })

    // animate
    const animate = () => {
        
        const diffX = aimX - currentX
        const diffY = aimY - currentY

        currentX = currentX + (diffX * 0.03)
        currentY = currentY + (diffY * 0.03)

        // if displacement image loaded - move it 

        if (displacementImage) {
            displacementImage.x = currentX
            displacementImage.y = currentY
        }

         // keep running each frame. recursive loop here, 
        requestAnimationFrame(animate)
    }

    // load animation
    animate()

})

