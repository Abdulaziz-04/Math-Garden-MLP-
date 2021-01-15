//attributes
bg_color = '#000000'
line_color = '#ffffff'
line_width = 8

//global variables
let prev_x = 0
let prev_y = 0
let canvas
let context
const prepareCanvas = () => {
        //setting up the canvas
        canvas = document.getElementById('my-canvas')
        context = canvas.getContext('2d')
        context.strokeStyle = line_color
        context.fillStyle = bg_color
        context.lineWidth = line_width
        context.lineJoin = 'round'
        context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)
            //variable to keep track of drawing
        isPainting = false
            //Mouse Events
        document.addEventListener('mousedown', (e) => {
            isPainting = true
            cur_x = e.clientX - canvas.offsetLeft
            cur_y = e.clientY - canvas.offsetTop
        })
        document.addEventListener('mouseup', (e) => {
            isPainting = false
        })
        document.addEventListener('mousemove', (e) => {
            if (isPainting) {
                //keeping track of variables i.e. start and end points
                prev_x = cur_x
                cur_x = e.clientX - canvas.offsetLeft

                prev_y = cur_y
                cur_y = e.clientY - canvas.offsetTop

                draw()
            }
        });
        canvas.addEventListener('mouseleave', (e) => {
            isPainting = false
        })

        //Touch events for android
        document.addEventListener('touchstart', (e) => {
            isPainting = true
            cur_x = e.touches[0].clientX - canvas.offsetLeft
            cur_y = e.touches[0].clientY - canvas.offsetTop
        })
        document.addEventListener('touchend', (e) => {
            isPainting = false
        })
        document.addEventListener('touchmove', (e) => {
            if (isPainting) {
                prev_x = cur_x
                cur_x = e.touches[0].clientX - canvas.offsetLeft

                prev_y = cur_y
                cur_y = e.touches[0].clientY - canvas.offsetTop

                draw()
            }
        });
        canvas.addEventListener('touchcancel', (e) => {
            isPainting = false
        })
    }
    //clear and reset
const clearCanvas = () => {
        cur_x = 0
        cur_y = 0
        prev_x = 0
        prev_y = 0
        context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)
    }
    //Canvas drawing functions
const draw = () => {
    context.beginPath()
    context.moveTo(prev_x, prev_y)
    context.lineTo(cur_x, cur_y)
    context.closePath()
    context.stroke()

}