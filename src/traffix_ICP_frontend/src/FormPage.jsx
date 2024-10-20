import { useState, useRef } from 'react';
import axios from 'axios';
import { traffix_ICP_backend } from 'declarations/traffix_ICP_backend'; // Import ICP canister
import './FormPage.css'; 

function FormPage() {
  const [imageSrc, setImageSrc] = useState(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [ipfsUrl, setIpfsUrl] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Start camera stream
  function openCamera() {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch((err) => console.error('Camera access denied:', err));
  }

  // Capture image from the video stream
  function captureImage() {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    setImageSrc(dataUrl);
    setTimestamp(new Date().toLocaleString()); // Set timestamp
    video.srcObject.getTracks().forEach((track) => track.stop()); // Stop camera
  }

  // Upload image to IPFS
  async function uploadToIPFS() {
    try {
      const blob = await fetch(imageSrc).then((res) => res.blob());
      const formData = new FormData();
      formData.append('file', blob);

      const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          pinata_api_key: 'de32c8a2eec50ccf014c',
          pinata_secret_api_key: 'ae43ef563dcb7c62e8063158e390819da9ecee32751c46d47211b6ca2e84ab32',
        },
      });

      const ipfsHash = response.data.IpfsHash;
      const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
      setIpfsUrl(ipfsUrl);

      // Call smart contract to store the CID, description, and timestamp
      await submitToContract(ipfsHash);
      alert('Successfully uploaded to IPFS and recorded on blockchain!');
    } catch (error) {
      console.error('IPFS upload error:', error);
      alert('Failed to upload to IPFS.');
    }
  }

  // Submit CID, description, and timestamp to the ICP smart contract
  async function submitToContract(cid) {
    try {
      const success = await traffix_ICP_backend.submitReport(cid, description, timestamp);
      if (success) {
        alert('Report successfully submitted to the smart contract!');
      } else {
        alert('Failed to submit the report to the smart contract.');
      }
    } catch (error) {
      console.error('ICP contract submission error:', error);
      alert('Error submitting to smart contract.');
    }
  }

  return (
    <div className="container">
      <button onClick={openCamera} className="button open-camera">
        Open Camera
      </button>

      <div className="camera-container">
        <video ref={videoRef} className="video" autoPlay></video>
        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      </div>

      {imageSrc && (
        <div className="preview">
          <img src={imageSrc} alt="Captured" className="captured-image" />
        </div>
      )}

      <button onClick={captureImage} className="button capture-button">
        Capture Picture
      </button>

      <form className="details-form">
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input"
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="input"
        />
        <input
          type="text"
          placeholder="Timestamp"
          value={timestamp}
          readOnly
          className="input"
        />
        <button type="button" onClick={uploadToIPFS} className="button upload-button">
          Upload to IPFS
        </button>
      </form>

      {ipfsUrl && (
        <div className="ipfs-url">
          <p>View your image on IPFS:</p>
          <a href={ipfsUrl} target="_blank" rel="noopener noreferrer">
            {ipfsUrl}
          </a>
        </div>
      )}
    </div>
  );
}

export default FormPage;
