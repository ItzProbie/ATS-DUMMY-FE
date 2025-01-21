import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import Redis from 'ioredis';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check for authToken in localStorage
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    if (!authToken || !userId) {
      navigate('/login'); // Redirect to login if no authToken is found
    }
  }, [navigate]);

  const handleFileChange = (e) => {
    setError('');
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileSizeMB = selectedFile.size / (1024 * 1024);
      if (fileSizeMB > 5) {
        setError('File size exceeds 5MB. Please upload a smaller file.');
        setFile(null);
      } else {
        setFile(selectedFile);
      }
    }
  };

  const handleUpload = async () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      setError('No authToken found. Please login again.');
      return;
    }

    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setError(''); // Clear any previous errors

    try {
      
      // Step 1: Hit the GET API to get the upload URL
      const fileSize = file.size; // in bytes
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/media/upload?mediaType=pdf&mediaSize=${fileSize}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        // params: {
        //   mediaType: 'pdf',
        //   mediaSize: fileSize,
        // },
      });

      console.log(response);
      

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get upload URL');
      }

      const { presignedUploadUrl } = data; // URL to upload the file

      // Step 2: Hit the PUT API with the file

      const letS3Upload = await fetch(`${process.env.REACT_APP_BASE_URL}/redis-wrapper/s3-upload-limit` , {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      if(!letS3Upload || !letS3Upload?.data?.success){
          console.log("Rate Limited");
          return;
      }

      const uploadResponse = await fetch(presignedUploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/pdf', // Specify the file type
        },
        body: file,
      });
      console.log(uploadResponse);
      
      const extractFileName = (url) => {
        const path = new URL(url).pathname;  // Get the path part of the URL
        const parts = path.split('/');  // Split the path into segments
        return parts[parts.length - 1];  // Return the last segment, which is the file name
      };
      
      const fileName = extractFileName(presignedUploadUrl);
      console.log(presignedUploadUrl);
      console.log("FileName: " , fileName);
      
      
      const findATS = await fetch(`${process.env.REACT_APP_BASE_URL}/ats/generate-ats?fileName=${fileName}` , {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
        }
      });

      console.log(findATS);

      if (!uploadResponse.ok) {
        throw new Error('File upload failed');
      }

      console.log('Success: File uploaded successfully');
    } catch (err) {
      console.error('Error:', err.message);
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Upload Page</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label htmlFor="fileUpload">Upload PDF:</label>
        <input
          type="file"
          id="fileUpload"
          accept="application/pdf"
          onChange={handleFileChange}
        />
      </div>
      <div>
        <button onClick={handleUpload} disabled={!file}>
          Upload
        </button>
      </div>
    </div>
  );
};

export default Upload;
