let model
const loadModel = async() => {
    //loading the model 
    model = await tf.loadGraphModel('TFJS Model/model.json')
        //console.log(model)
}
const predictImage = () => {
    //STEPS OF DATA PREPROCESSING
    /*
    1. Load the Image
    2. Convert to GrayScale
    3. Find the Contours
    4. Calculate bounding Rectangle
    5. Crop the Image
    6. Resize the Image
    7. Add Padding to set up 28 by 28 size
    8. Find Centre of Mass 
    9. Shift the image
    10. Normalize Pixel values
    11. Create a tensor
    */
    //load the image
    let img = cv.imread(canvas)

    //Convert it to grayscale 
    //args(src,dst,format,channels)

    cv.cvtColor(img, img, cv.COLOR_RGBA2GRAY, 0)

    //clarifying the edges by converting all pixel values > 175 to 255 directly
    //args(src,dst,limit,threshold,threshold_type)
    cv.threshold(img, img, 175, 255, cv.THRESH_BINARY)

    //Setting up the edges in the contours

    let contours = new cv.MatVector()
    let hierarchy = new cv.Mat()
    cv.findContours(img, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE)

    //bounding and cropping the image

    let sample_countour = contours.get(0)
    let rect = cv.boundingRect(sample_countour)

    //cropping the image

    img = img.roi(rect)

    //Resizing the image

    let height = img.rows
    let width = img.cols
    if (height > width) {
        height = 20
        scale_factor = img.rows / height
        width = Math.round(img.cols / scale_factor)
    } else {
        width = 20
        scale_factor = img.cols / width
        height = Math.round(img.rows / scale_factor)
    }
    let size = new cv.Size(width, height)
    cv.resize(img, img, dszie = size, 0, 0, cv.INTER_AREA)

    //Applying padding
    //total size is 28*28 where 4px is padding so calculating padding 
    left_padding = Math.ceil(4 + (20 - width) / 2)
    right_padding = Math.floor(4 + (20 - width) / 2)
    top_padding = Math.ceil(4 + (20 - height) / 2)
    bottom_padding = Math.floor(4 + (20 - height) / 2)
    cv.copyMakeBorder(img, img, top_padding, bottom_padding, left_padding, right_padding, cv.BORDER_CONSTANT, new cv.Scalar(0, 0, 0, 0))



    //Obtaining the centre of mass and its coordinates of the image

    cv.findContours(img, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE)
    let sample = contours.get(0)
    const moments = cv.moments(sample, false)
    const cx = moments.m10 / moments.m00
    const cy = moments.m01 / moments.m00

    //Shifting the image

    const shift_x = Math.round((img.cols / 2.0) - cx)
    const shift_y = Math.round((img.rows / 2.0) - cy)
    size = new cv.Size(img.cols, img.rows)
    const M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, shift_x, 0, 1, shift_y])
    cv.warpAffine(img, img, M, size, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar(0, 0, 0, 0))

    //Normalizing the values i.e. getting them in the range of 0 to 1

    let pixel_array = img.data
    pixel_array = Float32Array.from(pixel_array)
    pixel_array = pixel_array.map((value) => {
            return value / 255.0
        })
        //console.log(pixel_array)

    //Creating a tensor
    const tensor = tf.tensor([pixel_array])
        //console.log(tensor.shape)
        //console.log(tensor.dtype)
    const result = model.predict(tensor)
        //result.print()
    const answer = result.dataSync()[0]


    /*Checking the result
    let test_result = document.createElement('canvas')
    cv.imshow(test_result, img)
    document.body.appendChild(test_result)
    */

    //Cleanup
    img.delete()
    sample_countour.delete()
    contours.delete()
    hierarchy.delete()
    sample.delete()
    M.delete()
    result.dispose()
    tensor.dispose()

    //Return the result
    return answer

}