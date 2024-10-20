import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
// import { traffix_ICP_backend } from 'declarations/traffix_ICP_backend';
import './FormPage.css';

function FormPage() {
  const [imageSrc, setImageSrc] = useState(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [ipfsUrl, setIpfsUrl] = useState('');
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Set permissions policy
    document.head.appendChild(Object.assign(document.createElement('meta'), {
      httpEquiv: 'Permissions-Policy',
      content: 'camera=self'
    }));

    // Cleanup function to stop camera stream when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const checkCameraSupport = useCallback(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Your browser does not support camera access');
      return false;
    }
    return true;
  }, []);

  const openCamera = useCallback(async () => {
    console.log('Attempting to open camera...');
    if (!checkCameraSupport()) return;

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log('Camera accessed successfully');
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Detailed camera access error:', error);
      alert('Failed to access camera. Please check your browser settings and try again.');
    }
  }, [checkCameraSupport]);

  function captureImage() {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      setImageSrc(url);
    }, 'image/jpeg');
    setTimestamp(new Date().toLocaleString());
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }

  async function uploadToIPFS() {
    if (!imageSrc) {
      alert('Please capture an image first.');
      return;
    }
  
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append('file', blob, 'capture.jpg');
  
      const pinataResponse = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          pinata_api_key: 'de32c8a2eec50ccf014c',
          pinata_secret_api_key: 'ae43ef563dcb7c62e8063158e390819da9ecee32751c46d47211b6ca2e84ab32',
        },
      });
  
      const ipfsHash = pinataResponse.data.IpfsHash;
      const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
      setIpfsUrl(ipfsUrl);
  
      await submitToContract(ipfsHash);
      alert('Successfully uploaded to IPFS and recorded on blockchain!');
    } catch (error) {
      console.error('IPFS upload error:', error);
      alert('Failed to upload to IPFS.');
    }
  }

  async function submitToContract(cid) {
    try {
      const success = await traffix_ICP_backend.submitReport(cid, description, timestamp);
      if (!success) {
        throw new Error('Contract submission failed');
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
        <video ref={videoRef} className="video" autoPlay playsInline></video>
        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      </div>

      {imageSrc && (
        <div className="preview">
          <img src={imageSrc} alt="Captured" className="captured-image" />
        </div>
      )}

      <button onClick={captureImage} className="button capture-button" disabled={!stream}>
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
        <button type="button" onClick={uploadToIPFS} className="button upload-button" disabled={!imageSrc}>
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