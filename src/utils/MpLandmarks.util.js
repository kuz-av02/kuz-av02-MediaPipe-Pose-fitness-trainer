import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils"
import * as mposeUtils from "./MpPose.util"

// Словарь левой части используемых Landmarks
const POSE_LANDMARKS_LEFT = {
    LEFT_SHOULDER: 11,
    LEFT_ELBOW: 13,
    LEFT_WRIST: 15,
    LEFT_HIP: 23,
    LEFT_KNEE: 25,
    LEFT_ANKLE: 27,
}

// Словарь правой части используемых Landmarks
const POSE_LANDMARKS_RIGHT = {
    RIGHT_SHOULDER: 12,
    RIGHT_ELBOW: 14,
    RIGHT_WRIST: 16,
    RIGHT_HIP: 24,
    RIGHT_KNEE: 26,
    RIGHT_ANKLE: 28,
}

// Словарь всех Landmarks
const POSE_LANDMARKS = {
    ...POSE_LANDMARKS_LEFT,
    ...POSE_LANDMARKS_RIGHT,
}

// Массив с описанием соединений Landmarks
const POSE_CONNECTIONS = [
    [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.RIGHT_SHOULDER],
    [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_ELBOW],
    [POSE_LANDMARKS.LEFT_ELBOW, POSE_LANDMARKS.LEFT_WRIST],
    [POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_ELBOW],
    [POSE_LANDMARKS.RIGHT_ELBOW, POSE_LANDMARKS.RIGHT_WRIST],
    [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_HIP],
    [POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_HIP],
    [POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.RIGHT_HIP],
    [POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.LEFT_KNEE],
    [POSE_LANDMARKS.RIGHT_HIP, POSE_LANDMARKS.RIGHT_KNEE],
    [POSE_LANDMARKS.LEFT_KNEE, POSE_LANDMARKS.LEFT_ANKLE],
    [POSE_LANDMARKS.RIGHT_KNEE, POSE_LANDMARKS.RIGHT_ANKLE],
]

// Функция отрисовки Landmarks и их соединений
function drawPoseLandmarks(canvas, results, poseClassifierCallback, infoPose) {
    const keysToLeftCheck = Object.values(POSE_LANDMARKS_LEFT)
    const keysToRightCheck = Object.values(POSE_LANDMARKS_RIGHT)
    const filteredLeftResults = keysToLeftCheck.filter((key) => results.poseLandmarks[key]?.visibility > 0.9)
    const filteredRightResults = keysToRightCheck.filter((key) => results.poseLandmarks[key]?.visibility > 0.9)
    if (filteredLeftResults?.length > 4 || filteredRightResults?.length > 4) {
        const { invalidConnections, pose } = poseClassifierCallback(poseAngles(results), infoPose)
        const { poseLandmarks } = results
        // Фунции для отрисовки Landmarks левой и правой стороны
        drawLandmarks(
            canvas,
            Object.values(POSE_LANDMARKS).map((index) => poseLandmarks[index]),
            { visibilityMin: 0.65, color: "white", fillColor: "rgb(0,217,231)" }
        )
        // Функции для отрисовки правильных(green) и неправильных(red) соединений Landmarks
        drawConnectors(canvas, poseLandmarks, POSE_CONNECTIONS, {
            visibilityMin: 0.65,
            color: "green",
        })
        drawConnectors(canvas, poseLandmarks, invalidConnections, {
            visibilityMin: 0.65,
            color: "red",
        })
    }

    // poseLable.innerHTML = invalidConnections?.length < 1 ? `${pose} Correct` : `${pose} Incorrect`
}

// Функция рассчета углов в позе
function poseAngles(results) {
    const simplifiedPoseLandmarks = mposeUtils.simplifyPoseLandmarks(results)
    return mposeUtils.calcFullPoseAngles(simplifiedPoseLandmarks)
}

export { drawPoseLandmarks, POSE_CONNECTIONS, POSE_LANDMARKS_LEFT, POSE_LANDMARKS_RIGHT, POSE_LANDMARKS }
