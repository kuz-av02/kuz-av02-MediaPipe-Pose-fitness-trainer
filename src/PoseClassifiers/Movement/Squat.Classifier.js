import * as mposeUtils from "../../utils/MpPose.util.js"

function squatClassifier(angles, infoPose) {
    const poseLable = document.getElementById("pose-lable-text")
    const poseCorCountLable = document.getElementById("correct-count-lable-text")
    const poseIncorCountLable = document.getElementById("incorrect-count-lable-text")
    const invalidConnections = []

    // console.log(angles.nearest_kneeAngle)
    if (angles.nearest_hipAngle < 325 && angles.nearest_hipAngle > 35) {
        infoPose.comments.add("Наклонитесь назад<br>")
        invalidConnections.push(mposeUtils.getRightShoulderToHipConnectors())
        invalidConnections.push(mposeUtils.getLeftShoulderToHipConnectors())
        invalidConnections.push(mposeUtils.getLeftToRightHipConnectors())
        invalidConnections.push(mposeUtils.getLeftToRightShoulderConnectors())
    }
    if (((angles.nearest_kneeAngle > 40 && angles.nearest_kneeAngle < 60) || (angles.nearest_kneeAngle < 320 && angles.nearest_kneeAngle > 300)) && infoPose.position) {
        infoPose.comments.add("Отпустите свои бёдра ниже<br>")
        invalidConnections.push(mposeUtils.getRightHipToKneeConnectors())
        invalidConnections.push(mposeUtils.getLeftHipToKneeConnectors())
        invalidConnections.push(mposeUtils.getLeftToRightHipConnectors())
    }
    if (angles.nearest_kneeAngle > 70 && angles.nearest_kneeAngle < 290) {
        infoPose.comments.add("Приседание слишком глубокое<br>")
        invalidConnections.push(mposeUtils.getRightHipToKneeConnectors())
        invalidConnections.push(mposeUtils.getLeftHipToKneeConnectors())
        invalidConnections.push(mposeUtils.getLeftToRightHipConnectors())
    }

    if ((angles.nearest_kneeAngle < 40 || angles.nearest_kneeAngle > 320) && infoPose.position == false) {
        infoPose.position = true
        if (infoPose.comments?.size > 0) {
            infoPose.incorrect += 1
            poseIncorCountLable.innerHTML = `Incorrect: ${infoPose.incorrect}`
            poseLable.innerHTML = "Результаты предыдущего приседания:<br>" + Array.from(infoPose.comments).join("")
        } else {
            infoPose.correct += 1
            poseCorCountLable.innerHTML = `Сorrect: ${infoPose.correct}`
            poseLable.innerHTML = "Результаты предыдущего приседания:<br>" + "Ошибок нет"
        }
        infoPose.comments = new Set()
    }
    if (angles.nearest_kneeAngle > 50 && angles.nearest_kneeAngle < 310 && infoPose.position == true) {
        infoPose.position = false
    }
    if (angles.nearest_kneeAngle > 60 && angles.nearest_kneeAngle < 300){
        infoPose.comments.delete("Отпустите свои бёдра ниже<br>")
    }

    return { invalidConnections, pose: "Squat" }
}

export default squatClassifier
