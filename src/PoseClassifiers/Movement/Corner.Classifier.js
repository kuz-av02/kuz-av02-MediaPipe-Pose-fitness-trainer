import * as mposeUtils from "../../utils/MpPose.util.js"

function Corner(angles, infoPose) {
    const poseLable = document.getElementById("pose-lable-text")
    const poseTimeLable = document.getElementById("time-lable-text")
    const invalidConnections = []

    console.log(angles.nearest_knee_hipAngle)
    if (angles.nearest_knee_hipAngle > 325 || angles.nearest_knee_hipAngle < 35 || (angles.nearest_knee_hipAngle > 145 && angles.nearest_knee_hipAngle < 215)) {
        infoPose.comments.add("Ноги слишком низко<br>")
        invalidConnections.push(mposeUtils.getRightHipToKneeConnectors())
        invalidConnections.push(mposeUtils.getRightKneeToAnkleConnectors())
        invalidConnections.push(mposeUtils.getLeftHipToKneeConnectors())
        invalidConnections.push(mposeUtils.getLeftKneeToAnkleConnectors())
    } else {
        infoPose.comments.delete("Ноги слишком низко<br>")
    }
    if ((angles.nearest_knee_hipAngle > 60 && angles.nearest_knee_hipAngle < 120) || (angles.nearest_knee_hipAngle > 240 && angles.nearest_knee_hipAngle < 300)) {
        infoPose.comments.add("Ноги слишком высоко<br>")
        invalidConnections.push(mposeUtils.getRightHipToKneeConnectors())
        invalidConnections.push(mposeUtils.getRightKneeToAnkleConnectors())
        invalidConnections.push(mposeUtils.getLeftHipToKneeConnectors())
        invalidConnections.push(mposeUtils.getLeftKneeToAnkleConnectors())
    } else {
        infoPose.comments.delete("Ноги слишком высоко<br>")
    }
    if (angles.nearest_shoulder_hipAngle < 35 || angles.nearest_shoulder_hipAngle > 325 || (angles.nearest_shoulder_hipAngle > 145 && angles.nearest_shoulder_hipAngle < 215)) {
        infoPose.comments.add("Торс слишком низко<br>")
        invalidConnections.push(mposeUtils.getRightShoulderToHipConnectors())
        invalidConnections.push(mposeUtils.getLeftShoulderToHipConnectors())
        invalidConnections.push(mposeUtils.getLeftToRightHipConnectors())
        invalidConnections.push(mposeUtils.getLeftToRightShoulderConnectors())
    } else {
        infoPose.comments.delete("Торс слишком низко<br>")
    }
    if ((angles.nearest_shoulder_hipAngle > 60 && angles.nearest_shoulder_hipAngle < 120) || (angles.nearest_shoulder_hipAngle > 240 && angles.nearest_shoulder_hipAngle < 300)) {
        infoPose.comments.add("Торс слишком высоко<br>")
        invalidConnections.push(mposeUtils.getRightShoulderToHipConnectors())
        invalidConnections.push(mposeUtils.getLeftShoulderToHipConnectors())
        invalidConnections.push(mposeUtils.getLeftToRightHipConnectors())
        invalidConnections.push(mposeUtils.getLeftToRightShoulderConnectors())
    } else {
        infoPose.comments.delete("Торс слишком высоко<br>")
    }
    const now = new Date()
    // console.log(now.getHours() * 3600, now.getMinutes() * 60, now.getSeconds(), now.getMilliseconds() / 1000)
    if (infoPose.comments?.size < 1) {
        if (infoPose.nowTime == 0) {
            const now = new Date()
            infoPose.nowTime = now.getHours() * 3600 * 1000 + now.getMinutes() * 60 * 1000 + now.getSeconds()* 1000 + now.getMilliseconds()
        } else {
            const now = new Date()
            infoPose.time = Number(infoPose.time * 1000)
            infoPose.time += (now.getHours() * 3600 * 1000 + now.getMinutes() * 60 * 1000 + now.getSeconds()* 1000 + now.getMilliseconds() - infoPose.nowTime)
            infoPose.time = infoPose.time / 1000
            infoPose.nowTime = now.getHours() * 3600 * 1000 + now.getMinutes() * 60 * 1000 + now.getSeconds()* 1000 + now.getMilliseconds()
        }
        poseLable.innerHTML = "Продолжайте в том же духе!"
    } else {
        poseLable.innerHTML = "Результаты уголка:<br>" + Array.from(infoPose.comments).join("")
    }
    poseTimeLable.innerHTML = `Time: ${infoPose.time}`

    return { invalidConnections, pose: "Corner" }
}

export default Corner
