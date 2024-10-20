let mediaRecorder;
let recordedChunks = [];
let isRecording = false;

const toggleRecordingButton = document.getElementById('toggleRecord');
const videoPreview = document.getElementById('preview');

// Enable dragging functionality for the start/stop button
dragElement(toggleRecordingButton);

// Function to toggle recording on/off
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
            toggleRecordingButton.style.backgroundColor = '#f44336';
            isRecording = true;

            // Stop recording when the user closes the screen stream
            stream.getVideoTracks()[0].addEventListener('ended', () => {
                if (isRecording) {
                    mediaRecorder.stop();
                    toggleRecordingButton.textContent = 'Start Recording';
                    toggleRecordingButton.style.backgroundColor = '#4CAF50';
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
        toggleRecordingButton.style.backgroundColor = '#4CAF50';
        isRecording = false;
    }
});

// Make the button draggable
function dragElement(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    elmnt.onmousedown = dragMouseDown;
    elmnt.ontouchstart = dragMouseDown; // Mobile support

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // Get the mouse cursor position at startup
        if (e.type === 'touchstart') {
            pos3 = e.touches[0].clientX;
            pos4 = e.touches[0].clientY;
        } else {
            pos3 = e.clientX;
            pos4 = e.clientY;
        }

        document.onmouseup = closeDragElement;
        document.ontouchend = closeDragElement; // Mobile support
        document.onmousemove = elementDrag;
        document.ontouchmove = elementDrag; // Mobile support
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // Calculate the new cursor position
        if (e.type === 'touchmove') {
            pos1 = pos3 - e.touches[0].clientX;
            pos2 = pos4 - e.touches[0].clientY;
            pos3 = e.touches[0].clientX;
            pos4 = e.touches[0].clientY;
        } else {
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
        }
        // Set the element's new position
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // Stop moving when mouse or touch is released
        document.onmouseup = null;
        document.ontouchend = null;
        document.onmousemove = null;
        document.ontouchmove = null;
    }
}
