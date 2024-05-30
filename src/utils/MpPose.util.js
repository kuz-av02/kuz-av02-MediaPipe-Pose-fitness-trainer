import { POSE_LANDMARKS_LEFT, POSE_LANDMARKS_RIGHT } from "./MpLandmarks.util"

// Расчет угла между линиями
function angleBetweenLines(landmark1, landmark2, landmark3) {
    const { x: x1, y: y1 } = landmark1
    const { x: x2, y: y2 } = landmark2
    const { x: x3, y: y3 } = landmark3

    let angle = Math.atan2(y3 - y2, x3 - x2) - Math.atan2(y1 - y2, x1 - x2)
    angle = (angle * 180) / Math.PI
    // const { x: x1, y: y1 } = landmarks[POSE_LANDMARKS_RIGHT.RIGHT_SHOULDER]
    // const { x: x2, y: y2 } = landmarks[POSE_LANDMARKS_RIGHT.RIGHT_ELBOW]
    // const { x: x3, y: y3 } = landmarks[POSE_LANDMARKS_RIGHT.RIGHT_WRIST]

    // let angle = Math.atan2(y3 - y2, x3 - x2) - Math.atan2(y1 - y2, x1 - x2)
    // angle = (angle * 180) / Math.PI
    // console.log(Math.abs(angle))
    if (angle < 0) angle += 360
    return angle
}

// Получение всех углов для левых, правых Landmarks
function calcFullPoseAngles(landmarks) {
    const right_fullLeftPoseAngles = calcLeftPoseAngles(landmarks)
    const right_fullRightPoseAngles = calcRightPoseAngles(landmarks)
    const hipsToTorsoAngles = calcHipsToTorsoAngles(landmarks)
    const axisYAngles = calcAxisYPoseAngles(landmarks)
    const axisXAngles = calcAxisXPoseAngles(landmarks)
    const centerAngles = calcLeftRightCenterPoseAngles(landmarks)
    const direction = landmarks[POSE_LANDMARKS_LEFT.LEFT_SHOULDER].z < landmarks[POSE_LANDMARKS_RIGHT.RIGHT_SHOULDER].z

    return { ...right_fullLeftPoseAngles, ...right_fullRightPoseAngles, ...hipsToTorsoAngles, ...axisYAngles, ...axisXAngles, ...centerAngles }
}

// Получение всех углов для левых Landmarks
function calcLeftPoseAngles(landmarks) {
    const left_upperPoseAngles = calcLeftUpperPoseAngles(landmarks)
    const left_lowerPoseAngles = calcLeftLowerPoseAngles(landmarks)

    return { ...left_upperPoseAngles, ...left_lowerPoseAngles }
}

// Получение всех углов для правых Landmarks
function calcRightPoseAngles(landmarks) {
    const right_upperPoseAngles = calcRightUpperPoseAngles(landmarks)
    const right_lowerPoseAngles = calcRightLowerPoseAngles(landmarks)

    return { ...right_upperPoseAngles, ...right_lowerPoseAngles }
}

// Расчет углов точек торса
function calcHipsToTorsoAngles(landmarks) {
    // Расчет угла для правой точки плеча, правой точки торса и левой точки торса
    const right_hipToTorsoAngle = angleBetweenLines(
        landmarks[POSE_LANDMARKS_RIGHT.RIGHT_SHOULDER],
        landmarks[POSE_LANDMARKS_RIGHT.RIGHT_HIP],
        landmarks[POSE_LANDMARKS_LEFT.LEFT_HIP]
    )

    // Расчет угла для правой точки торса, левой точки торса и левой точки плеча
    const left_hipToTorsoAngle = angleBetweenLines(
        landmarks[POSE_LANDMARKS_RIGHT.RIGHT_HIP],
        landmarks[POSE_LANDMARKS_LEFT.LEFT_HIP],
        landmarks[POSE_LANDMARKS_LEFT.LEFT_SHOULDER]
    )

    return { right_hipToTorsoAngle, left_hipToTorsoAngle }
}

// Получение углов для правых вверхних точек
function calcRightUpperPoseAngles(landmarks) {
    // Расчет угла между правыми точками плеча, локтя и ладони
    const right_armAngle = angleBetweenLines(
        landmarks[POSE_LANDMARKS_RIGHT.RIGHT_SHOULDER],
        landmarks[POSE_LANDMARKS_RIGHT.RIGHT_ELBOW],
        landmarks[POSE_LANDMARKS_RIGHT.RIGHT_WRIST]
    )

    // Расчет угла между правыми точками бедра, плеча и локтя
    const right_armToTorsoAngle = angleBetweenLines(
        landmarks[POSE_LANDMARKS_RIGHT.RIGHT_HIP],
        landmarks[POSE_LANDMARKS_RIGHT.RIGHT_SHOULDER],
        landmarks[POSE_LANDMARKS_RIGHT.RIGHT_ELBOW]
    )

    return { right_armAngle, right_armToTorsoAngle }
}

// Получение углов для левых вверхних точек
function calcLeftUpperPoseAngles(landmarks) {
    // Расчет угла между правыми точками ладони, локтя и плеча
    const left_armAngle = angleBetweenLines(
        landmarks[POSE_LANDMARKS_LEFT.LEFT_WRIST],
        landmarks[POSE_LANDMARKS_LEFT.LEFT_ELBOW],
        landmarks[POSE_LANDMARKS_LEFT.LEFT_SHOULDER]
    )

    // Расчет угла между правыми точками локтя, плеча и бедра
    const left_armToTorsoAngle = angleBetweenLines(
        landmarks[POSE_LANDMARKS_LEFT.LEFT_ELBOW],
        landmarks[POSE_LANDMARKS_LEFT.LEFT_SHOULDER],
        landmarks[POSE_LANDMARKS_LEFT.LEFT_HIP]
    )

    return { left_armAngle, left_armToTorsoAngle }
}

// Расчет углов для правых нижних точек
function calcRightLowerPoseAngles(landmarks) {
    // Расчет угла для правых точек бедра, колена и лодыжки
    const right_legAngle = angleBetweenLines(
        landmarks[POSE_LANDMARKS_RIGHT.RIGHT_HIP],
        landmarks[POSE_LANDMARKS_RIGHT.RIGHT_KNEE],
        landmarks[POSE_LANDMARKS_RIGHT.RIGHT_ANKLE]
    )

    // Расчет угла для левой точки бедра, правых точек бедра и колена
    const right_legToHipAngle = angleBetweenLines(
        landmarks[POSE_LANDMARKS_LEFT.LEFT_HIP],
        landmarks[POSE_LANDMARKS_RIGHT.RIGHT_HIP],
        landmarks[POSE_LANDMARKS_RIGHT.RIGHT_KNEE]
    )

    return { right_legAngle, right_legToHipAngle }
}

// Расчет углов для левых нижних точек
function calcLeftLowerPoseAngles(landmarks) {
    // Расчет угла для левых точкек бедра, колена и лодыжки
    const left_legAngle = angleBetweenLines(
        landmarks[POSE_LANDMARKS_LEFT.LEFT_ANKLE],
        landmarks[POSE_LANDMARKS_LEFT.LEFT_KNEE],
        landmarks[POSE_LANDMARKS_LEFT.LEFT_HIP]
    )

    // Расчет угла для левых точек колена и бедра, правой точки бедра
    const left_legToHipAngle = angleBetweenLines(
        landmarks[POSE_LANDMARKS_LEFT.LEFT_KNEE],
        landmarks[POSE_LANDMARKS_LEFT.LEFT_HIP],
        landmarks[POSE_LANDMARKS_RIGHT.RIGHT_HIP]
    )

    return { left_legAngle, left_legToHipAngle }
}

// Расчет углов для левых и правых центральных точек
function calcLeftRightCenterPoseAngles(landmarks) {
    // Расчет угла для левых точкек плеча, бедра и колена
    const left_shoulderToKneeAngle = angleBetweenLines(
        landmarks[POSE_LANDMARKS_LEFT.LEFT_KNEE],
        landmarks[POSE_LANDMARKS_LEFT.LEFT_HIP],
        landmarks[POSE_LANDMARKS_LEFT.LEFT_SHOULDER]
    )

    // Расчет угла для правых точек точкек плеча, бедра и колена
    const right_shoulderToKneeAngle = angleBetweenLines(
        landmarks[POSE_LANDMARKS_RIGHT.RIGHT_SHOULDER],
        landmarks[POSE_LANDMARKS_RIGHT.RIGHT_HIP],
        landmarks[POSE_LANDMARKS_RIGHT.RIGHT_KNEE]
    )

    return { left_shoulderToKneeAngle, right_shoulderToKneeAngle }
}

// Расчет углов для точек с плоскостью Y
function calcAxisYPoseAngles(landmarks) {
    // Выбор ближайшей контрольных точек плеча и бедра к камере (в зависимости от положения по оси Z)
    const left_right_hip =
        landmarks[POSE_LANDMARKS_LEFT.LEFT_HIP].z < landmarks[POSE_LANDMARKS_RIGHT.RIGHT_HIP].z
            ? landmarks[POSE_LANDMARKS_LEFT.LEFT_HIP]
            : landmarks[POSE_LANDMARKS_RIGHT.RIGHT_HIP]
    const left_right_shoulder =
        landmarks[POSE_LANDMARKS_LEFT.LEFT_SHOULDER].z < landmarks[POSE_LANDMARKS_RIGHT.RIGHT_SHOULDER].z
            ? landmarks[POSE_LANDMARKS_LEFT.LEFT_SHOULDER]
            : landmarks[POSE_LANDMARKS_RIGHT.RIGHT_SHOULDER]
    const hip_axis_y = { x: left_right_hip.x, y: 0, z: left_right_hip.z, visibility: left_right_hip.visibility }
    // Расчет угла для ближайшего плеча, бедра и оси Y
    const nearest_hipAngle = angleBetweenLines(left_right_shoulder, left_right_hip, hip_axis_y)

    // Выбор ближайшей контрольноых точек колена к камере (в зависимости от положения по оси Z)
    const left_right_knee =
        landmarks[POSE_LANDMARKS_LEFT.LEFT_KNEE].z < landmarks[POSE_LANDMARKS_RIGHT.RIGHT_KNEE].z
            ? landmarks[POSE_LANDMARKS_LEFT.LEFT_KNEE]
            : landmarks[POSE_LANDMARKS_RIGHT.RIGHT_KNEE]
    const knee_axis_y = { x: left_right_hip.x, y: 0, z: left_right_hip.z, visibility: left_right_hip.visibility }
    // Расчет угла для ближайшего бедра, колена и оси Y
    const nearest_kneeAngle = angleBetweenLines(left_right_hip, left_right_knee, knee_axis_y)

    // const { x: x1, y: y1 } = left_right_knee
    // const { x: x2, y: y2 } = knee_axis_y
    // const { x: x3, y: y3 } = hip_axis_y

    // let angle = Math.atan2(y3 - y2, x3 - x2) - Math.atan2(y1 - y2, x1 - x2)
    // angle = (angle * 180) / Math.PI
    // if (angle < 0) angle += 360
    // console.log("nearest_hipAngle: ", Math.abs(angle))

    return { nearest_hipAngle, nearest_kneeAngle }
}

// Расчет углов для точек с плоскостью Y
function calcAxisXPoseAngles(landmarks) {
    // Выбор ближайшей контрольных точек плеча, бедра и колена к камере (в зависимости от положения по оси Z)
    const left_right_hip =
        landmarks[POSE_LANDMARKS_LEFT.LEFT_HIP].z < landmarks[POSE_LANDMARKS_RIGHT.RIGHT_HIP].z
            ? landmarks[POSE_LANDMARKS_LEFT.LEFT_HIP]
            : landmarks[POSE_LANDMARKS_RIGHT.RIGHT_HIP]
    const left_right_shoulder =
        landmarks[POSE_LANDMARKS_LEFT.LEFT_SHOULDER].z < landmarks[POSE_LANDMARKS_RIGHT.RIGHT_SHOULDER].z
            ? landmarks[POSE_LANDMARKS_LEFT.LEFT_SHOULDER]
            : landmarks[POSE_LANDMARKS_RIGHT.RIGHT_SHOULDER]
    const left_right_knee =
        landmarks[POSE_LANDMARKS_LEFT.LEFT_KNEE].z < landmarks[POSE_LANDMARKS_RIGHT.RIGHT_KNEE].z
            ? landmarks[POSE_LANDMARKS_LEFT.LEFT_KNEE]
            : landmarks[POSE_LANDMARKS_RIGHT.RIGHT_KNEE]
    const hip_axis_x = { x: 0, y: left_right_hip.y, z: left_right_hip.z, visibility: left_right_hip.visibility }
    // Расчет угла для ближайшего плеча, бедра и оси X
    const nearest_shoulder_hipAngle = angleBetweenLines(left_right_shoulder, left_right_hip, hip_axis_x)
    // Расчет угла для ближайшего колена, бедра и оси Y
    const nearest_knee_hipAngle = angleBetweenLines(left_right_knee, left_right_hip, hip_axis_x)

    return { nearest_shoulder_hipAngle, nearest_knee_hipAngle }
}

// Передвод координат X, Y в int относительно ширины и высоты экрана
function simplifyPoseLandmarks(results, minVisibility = 0.5) {
    return results.poseLandmarks.map((landmark) => {
        return {
            x: Math.min(Math.floor(landmark.x * results.image.width), results.image.width - 1),
            y: Math.min(Math.floor(landmark.y * results.image.height), results.image.height - 1),
            z: Math.floor(landmark.z * 1000),
            visibility: landmark.visibility,
        }
    })
}

// Возращает пару точек правого плеча и правого локтя
function getRightShoulderToElbowConnectors() {
    return [POSE_LANDMARKS_RIGHT.RIGHT_SHOULDER, POSE_LANDMARKS_RIGHT.RIGHT_ELBOW]
}

// Возращает пару точек правого локтя и правой ладони
function getRightElbowToWristConnectors() {
    return [POSE_LANDMARKS_RIGHT.RIGHT_ELBOW, POSE_LANDMARKS_RIGHT.RIGHT_WRIST]
}

// Возращает пару точек левого плеча и левого локтя
function getLeftShoulderToElbowConnectors() {
    return [POSE_LANDMARKS_LEFT.LEFT_SHOULDER, POSE_LANDMARKS_LEFT.LEFT_ELBOW]
}

// Возращает пару точек левого локтя и левой ладони
function getLeftElbowToWristConnectors() {
    return [POSE_LANDMARKS_LEFT.LEFT_ELBOW, POSE_LANDMARKS_LEFT.LEFT_WRIST]
}

// Возращает пару точек правого бедра и колена
function getRightHipToKneeConnectors() {
    return [POSE_LANDMARKS_RIGHT.RIGHT_HIP, POSE_LANDMARKS_RIGHT.RIGHT_KNEE]
}

// Возращает пару точек правого колена и правой лодыжки
function getRightKneeToAnkleConnectors() {
    return [POSE_LANDMARKS_RIGHT.RIGHT_KNEE, POSE_LANDMARKS_RIGHT.RIGHT_ANKLE]
}

// Возращает пару точек левого бедра и колена
function getLeftHipToKneeConnectors() {
    return [POSE_LANDMARKS_LEFT.LEFT_HIP, POSE_LANDMARKS_LEFT.LEFT_KNEE]
}

// Возращает пару точек левого колена и левой лодыжки
function getLeftKneeToAnkleConnectors() {
    return [POSE_LANDMARKS_LEFT.LEFT_KNEE, POSE_LANDMARKS_LEFT.LEFT_ANKLE]
}

function getTorsoConnectors() {
    return []
}

// Возращает пару точек левого плеча и бедра
function getLeftShoulderToHipConnectors() {
    return [POSE_LANDMARKS_LEFT.LEFT_SHOULDER, POSE_LANDMARKS_LEFT.LEFT_HIP]
}

// Возращает пару точек правого плеча и бедра
function getRightShoulderToHipConnectors() {
    return [POSE_LANDMARKS_RIGHT.RIGHT_SHOULDER, POSE_LANDMARKS_RIGHT.RIGHT_HIP]
}

// Возращает пару точек левого и правого бедер
function getLeftToRightHipConnectors() {
    return [POSE_LANDMARKS_LEFT.LEFT_HIP, POSE_LANDMARKS_RIGHT.RIGHT_HIP]
}

// Возращает пару точек левого и правого плеч
function getLeftToRightShoulderConnectors() {
    return [POSE_LANDMARKS_LEFT.LEFT_SHOULDER, POSE_LANDMARKS_RIGHT.RIGHT_SHOULDER]
}

export {
    calcFullPoseAngles,
    calcLeftPoseAngles,
    calcRightPoseAngles,
    calcRightUpperPoseAngles,
    calcLeftUpperPoseAngles,
    calcRightLowerPoseAngles,
    calcLeftLowerPoseAngles,
    calcHipsToTorsoAngles,
    simplifyPoseLandmarks,
    getRightShoulderToElbowConnectors,
    getRightElbowToWristConnectors,
    getLeftShoulderToElbowConnectors,
    getLeftElbowToWristConnectors,
    getRightHipToKneeConnectors,
    getRightKneeToAnkleConnectors,
    getLeftHipToKneeConnectors,
    getLeftKneeToAnkleConnectors,
    getTorsoConnectors,
    getLeftShoulderToHipConnectors,
    getRightShoulderToHipConnectors,
    getLeftToRightHipConnectors,
    getLeftToRightShoulderConnectors, //
}
