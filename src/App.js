import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Divider, Drawer, List, ListItem, ListItemText, Button, Typography } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [file, setFile] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const upload = () => {
    if (!file) {
      toast.error('Please choose a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
   
    axios.post('http://localhost:3001/upload', formData, {
      //axios.post('https://fileuploader-backend-athul-22.vercel.app/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        // Calculate and display the upload progress
        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        console.log(progress);
      }
    })
      .then(res => {
        console.log(res.data);
        // Refresh the files after successful upload
        fetchFiles();
        toast.success('File uploaded successfully');
      })
      .catch(err => {
        console.error(err);
        toast.error('Error uploading file');
      })
      .finally(() => {
        setUploading(false);
        setFile(null);
      });
  };

  const fetchFiles = () => {
    // Fetch all files from the server
    axios.get('http://localhost:3001/files')
      .then(res => {
        setFiles(res.data);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    // Fetch files when the component mounts
    fetchFiles();
  }, []);

  return (
    <div style={{ backgroundColor: 'white', height: 'auto', width: '500px', padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '10px' }}>
      <div>
        <p style={{fontSize:'20px',fontWeight:'bold'}}>File Uploader</p>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', }}>
          <label htmlFor="fileInput" style={{ width: '300px', marginBottom: '10px', cursor: 'pointer', border: '1.5px dashed #ccc', padding: '50px', borderRadius: '5px', }}>
            {file ? `Selected file: ${file.name}` : 'Choose a file'}
            <input
              type="file"
              id="fileInput"
              name="file"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ display: 'none', width: '100%' }}
            />
          </label>
        </div>
        <button
          type="button"
          onClick={upload}
          style={{
            fontSize: '15px',
            width: '100%',
            backgroundColor: uploading ? '#ccc' : '#4caf50',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: uploading ? 'not-allowed' : 'pointer',
          }}
          disabled={uploading || !file}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '10px' }}>
          <Button onClick={() => setDrawerOpen(true)} style={{ width: '100%', marginTop: '20px', border: '1px solid blue' }}>View Files</Button>
        </div>
      </div>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} >
        <List>
          <ListItem>
            <ListItemText primary="All Files" />
          </ListItem>
          {files.length > 0 ? (
            files.map((file, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: 'calc(100% - 200px)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '10px' }}>
                      <p style={{ fontSize: '15px' }}>File: {file.originalname}</p>
                    </div>
                    <div>
                      <Button style={{ height: '30px', marginLeft: '100px', backgroundColor: '#d1e6ff', color: '#0056bf' }} href={`${file.fileLink}`} target="_blank">View</Button>
                    </div>
                  </div>
                </ListItem>
                {index < files.length - 1 && <Divider />}
              </React.Fragment>
            ))
          ) : (
            <ListItem>
              <Typography style={{ minWidth: '200px' }} variant="subtitle1">No files available</Typography>
            </ListItem>
          )}
        </List>
      </Drawer>

      <ToastContainer />
    </div>
  );
}

export default App;
