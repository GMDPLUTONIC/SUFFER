let mediaRecorder;
let recordedChunks = [];

const startRecordingButton = document.getElementById('startRecord');
const stopRecordingButton = document.getElementById('stopRecord');
const videoPreview = document.getElementById('preview');

startRecordingButton.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: { mediaSource: 'screen', width: 3840, height: 2160 } 
        });

        videoPreview.srcObject = stream;

        mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });
        recordedChunks = [];

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };
        
        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'recording.webm';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };

        mediaRecorder.start();
        startRecordingButton.disabled = false;

    } catch (err) {
        console.error('Error accessing display media: ', err);
    }
});