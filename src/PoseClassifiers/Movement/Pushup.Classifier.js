import * as mposeUtils from "../../utils/MpPose.util.js"

function pushupClassifier(angles, infoPose) {
    const poseLable = document.getElementById("pose-lable-text")
    const poseCorCountLable = document.getElementById("correct-count-lable-text")
    const poseIncorCountLable = document.getElementById("incorrect-count-lable-text")
    const invalidConnections = []

    console.log(angles.right_armAngle, angles.left_armAngle)
    if (
        !(angles.left_shoulderToKneeAngle > 165 && angles.left_shoulderToKneeAngle < 195) ||
        !(angles.right_shoulderToKneeAngle > 165 && angles.right_shoulderToKneeAngle < 195)
    ) {
        infoPose.comments.add("Выпрямите спину<br>")
        invalidConnections.push(mposeUtils.getRightShoulderToHipConnectors())
        invalidConnections.push(mposeUtils.getLeftShoulderToHipConnectors())
        invalidConnections.push(mposeUtils.getLeftToRightHipConnectors())
        invalidConnections.push(mposeUtils.getLeftToRightShoulderConnectors())
    }
    if (angles.right_armAngle > 290 || angles.right_armAngle < 70 || angles.left_armAngle < 70 || angles.left_armAngle > 290) {
        infoPose.comments.add("Слишком низкое отжимание<br>")
        invalidConnections.push(mposeUtils.getRightElbowToWristConnectors())
        invalidConnections.push(mposeUtils.getRightShoulderToElbowConnectors())
        invalidConnections.push(mposeUtils.getLeftElbowToWristConnectors())
        invalidConnections.push(mposeUtils.getLeftShoulderToElbowConnectors())
    }
    if (
        (angles.left_shoulderToKneeAngle > 165 && angles.left_shoulderToKneeAngle < 195) ||
        (angles.right_shoulderToKneeAngle > 165 && angles.right_shoulderToKneeAngle < 195) &&
        (angles.right_armAngle > 275 || angles.right_armAngle < 85 || angles.left_armAngle < 85 || angles.left_armAngle > 275)
    ) {
        infoPose.comments.delete("Выпрямите спину<br>")
    }


    if (
        (angles.right_armAngle > 275 || angles.right_armAngle < 85 || angles.left_armAngle < 85 || angles.left_armAngle > 275) &&
        infoPose.position == true
    ) {
        infoPose.position = false
    }
    if (
        ((angles.left_armAngle > 160 && angles.left_armAngle < 200) || (angles.right_armAngle > 160 && angles.right_armAngle < 200)) &&
        infoPose.position == false
    ) {
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

    return { invalidConnections, pose: "Pushup" }
}

export default pushupClassifier
