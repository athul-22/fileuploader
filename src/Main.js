import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const UploadComponent = () => {
  const [previewUrl, setPreviewUrl] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    try {
      const file = acceptedFiles[0];

      // Check file size
      const fileSize = file.size / (1024 * 1024); // in MB

      // Check if compression is needed
      const formData = new FormData();
      formData.append('file', file);

      // Display file preview
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
      } else if (file.type === 'application/pdf') {
        // For simplicity, display the first page of the PDF as an image
        const pdfBlob = new Blob([file]);
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setPreviewUrl(pdfUrl);
      }

      // Send the file to the server
      await axios.post('http://localhost:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('File size:', fileSize, 'MB');
    } catch (error) {
      console.error('Error uploading file:', error.message);
    }
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: ['image/*', 'application/pdf'],
  });

  return (
    <div
      {...getRootProps()}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <input {...getInputProps()} />
      <div
        style={{
          width: '300px',
          height: '200px',
          border: '2px dashed #cccccc',
          borderRadius: '4px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#cccccc',
          cursor: 'pointer',
          background: isDragActive
            ? isDragAccept
              ? '#00e676'
              : '#ff1744'
            : '#ffffff',
        }}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="File preview"
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
          />
        ) : (
          <>
            {isDragActive ? (
              isDragAccept ? (
                <p>Drop the files here</p>
              ) : (
                <p>Only images and PDFs are allowed!</p>
              )
            ) : (
              <p>Drag 'n' drop images or PDFs here, or click to select files</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UploadComponent;
