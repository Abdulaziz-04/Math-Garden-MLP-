let answer = 5
let score = 0
let backgroundImages = []
const nextQuestion = () => {
    const n1 = Math.floor(Math.random() * 5)
    document.getElementById('n1').innerHTML = n1
    const n2 = Math.floor(Math.random() * 6)
    document.getElementById('n2').innerHTML = n2
    answer = n1 + n2

}
const checkAnswer = () => {
    const prediction = predictImage()
    if (answer == prediction) {
        score += 1
        if (score <= 6) {
            backgroundImages.push(`url('images/background${score}.svg')`)
            document.body.style.backgroundImage = backgroundImages
        } else {
            alert('Garden has blossomed fully')
            score = 0
            backgroundImages = []
            document.body.style.backgroundImage = backgroundImages
        }
    } else {
        if (score > 0) {
            score -= 1
            backgroundImages.pop()
        }
        document.body.style.backgroundImage = backgroundImages
    }
}