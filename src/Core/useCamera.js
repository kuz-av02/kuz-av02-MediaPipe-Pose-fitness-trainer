const { Camera } = require("@mediapipe/camera_utils")

export default function useCamera(webcamRefCurrent, canvasRef, callback) {
    const camera = new Camera(webcamRefCurrent, {
        onFrame: async () => {
            const canvasElement = canvasRef.current
            let width = window.innerWidth
            let height = window.innerHeight
            canvasElement.width = width
            canvasElement.height = height
            await callback.send({ image: webcamRefCurrent })
        },
    })

    return camera
}
