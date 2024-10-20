let mediaRecorder;
let recordedChunks = [];
let isRecording = false; // State to track recording status

const toggleRecordingButton = document.getElementById('toggleRecord');
const videoPreview = document.getElementById('preview');

// Toggle recording function
toggleRecordingButton.addEventListener('click', async () => {
    if (!isRecording) {
        // Start recording
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: { mediaSource: 'screen', width: 3840, height: 2160 } 
            });

            videoPreview.srcObject = stream;

            // Setup MediaRecorder
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

                // Download the recorded video
                const a = document.createElement('a');
                a.href = url;
                a.download = 'recording.webm';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            };

            mediaRecorder.start();
            toggleRecordingButton.textContent = 'Stop Recording';
            toggleRecordingButton.style.backgroundColor = '#f44336'; // Change button color to red
            isRecording = true;

            // Stop recording when the user closes the screen stream
            stream.getVideoTracks()[0].addEventListener('ended', () => {
                if (isRecording) {
                    mediaRecorder.stop();
                    toggleRecordingButton.textContent = 'Start Recording';
                    toggleRecordingButton.style.backgroundColor = '#4CAF50'; // Reset button color to green
                    isRecording = false;
                }
            });

        } catch (err) {
            console.error('Error accessing display media: ', err);
        }

    } else {
        // Stop recording manually
        mediaRecorder.stop();
        toggleRecordingButton.textContent = 'Start Recording';
        toggleRecordingButton.style.backgroundColor = '#4CAF50'; // Reset button color to green
        isRecording = false;
    }
});