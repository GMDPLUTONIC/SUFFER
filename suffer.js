let mediaRecorder;
let recordedChunks = [];

const startRecordingButton = document.getElementById('startRecord');
const stopRecordingButton = document.getElementById('stopRecord');
const videoPreview = document.getElementById('preview');

startRecordingButton.addEventListener('click', async () => {
    try {
        // Capture screen
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: { mediaSource: 'screen', width: 3840, height: 2160 } // 4K resolution
        });

        videoPreview.srcObject = stream;

        // Setup MediaRecorder
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/mp4; codecs=vp9' });
        recordedChunks = [];

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/mp4' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'recording.mp4';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };

        mediaRecorder.start();
        startRecordingButton.disabled = true;
        stopRecordingButton.disabled = false;

    } catch (err) {
        console.error('Error accessing display media: ', err);
    }
});

stopRecordingButton.addEventListener('click', () => {
    mediaRecorder.stop();
    startRecordingButton.disabled = false;
    stopRecordingButton.disabled = true;
});
