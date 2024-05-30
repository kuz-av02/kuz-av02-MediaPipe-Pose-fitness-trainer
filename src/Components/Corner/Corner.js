import { useEffect, useRef } from "react"
import useCamera from "../../Core/useCamera"
import useMediaPipe from "../../Core/useMediaPipe"
import * as drawUtils from "../../utils/MpLandmarks.util"
import cornerClassifier from "../../PoseClassifiers/Movement/Corner.Classifier"

function Corner() {
    const webcamRef = useRef(null)
    const canvasRef = useRef(null)
    const pose = useMediaPipe()
    let infoPose = { time: 0, nowTime:0, comments: new Set() }

    useEffect(() => {
        if (!pose) return
        async function sendPose() {
            const camera = useCamera(webcamRef.current, canvasRef, pose)
            try {
                await camera.start()
            } catch (error) {
                console.log(error)
            }
        }
        pose.onResults(onResults)
        sendPose()
    }, [pose])

    function onResults(results) {
        const canvasElement = canvasRef.current
        const canvasCtx = canvasElement.getContext("2d")
        canvasCtx.save()
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height)
        canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height)

        if (!results?.poseLandmarks) return
        drawUtils.drawPoseLandmarks(canvasCtx, results, cornerClassifier, infoPose)
        // canvasCtx.fillStyle = 'black';
        // canvasCtx.font = "bold 18px Arial";
        // canvasCtx.fillText(angles.left_armAngle, simplifiedPoseLandmarks[13].x, simplifiedPoseLandmarks[13].y, 800);
        canvasCtx.restore()
    }

    return (
        <div className="App">
            <div className="container">
                <video className="input_video" ref={webcamRef} />
                <canvas ref={canvasRef} className="output_canvas"></canvas>
            </div>

            <div
                id="pose-lable"
                style={{
                    padding: "10px",
                    width: "fit-content",
                    position: "sticky",
                    background: "#04b7cf",
                }}
            >
                <p id="pose-lable-text">Pose: Unknown</p>
                <p id="time-lable-text">Time: 0</p>
            </div>
        </div>
    )
}

export default Corner
