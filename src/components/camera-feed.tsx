import { useState, useEffect, useRef } from 'react';

const CameraFeed = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const captureInterval = 5000; // Capture frame every 5 seconds

  useEffect(() => {
    // Get available video devices
    async function getVideoDevices() {
      try {
        const deviceInfos = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = deviceInfos.filter(device => device.kind === 'videoinput');

        console.log(deviceInfos);
        console.log(videoDevices);
        
        
        setDevices(videoDevices);
        // Automatically select the first device if available
        if (videoDevices.length > 0) {
          setSelectedDeviceId(videoDevices[0].deviceId);
        }
      } catch (error) {
        console.error('Error accessing video devices:', error);
      }
    }

    getVideoDevices();
  }, []);


  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (error) {
        console.error('Error accessing the camera:', error);
      }
    }

    startCamera();

    const intervalId = setInterval(() => {
      captureFrame();
    }, captureInterval);

    return () => clearInterval(intervalId);
  }, []);

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL('image/png');
      console.log('Captured frame:', imageData);
    }
  };

  const handleDeviceChange = (event) => {
    setSelectedDeviceId(event.target.value);
  };

  return (
    <div>
      <h1>Camera Feed with Frame Capture</h1>
      
      {/* Camera selection dropdown */}
      <label htmlFor="camera-select">Select Camera:</label>
      <select id="camera-select" onChange={handleDeviceChange} value={selectedDeviceId}>
        {devices.map(device => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Camera ${device.deviceId}`}
          </option>
        ))}
      </select>

      {/* Video feed */}
      {/* <video ref={videoRef} style={{ width: '100%', height: 'auto' }} autoPlay muted /> */}
      <video ref={videoRef} style={{ width: '500px', height: '500px' }} autoPlay muted />

      {/* Hidden canvas to capture frames */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default CameraFeed;