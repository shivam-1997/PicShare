import { Button, Modal } from '@material-ui/core';
import React, {useState, useReducer} from 'react';
import {storage, db} from './firebase';
import firebase from "firebase";
import './css/ImageUpload.css'
import { makeStyles } from '@material-ui/core/styles';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function ImageUpload({user}) {

  
  const [uploadModal, toggleUploadModal] = useReducer(uploadModal=>!uploadModal, false);
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState('');

  const handleChange = (e) => {
    if (e.target.files[0]){
      setImage(e.target.files[0])
    }
  };
  
  const handleUpload = () =>{
    // below statement uploads the image to storage
    // after this we would need to get the image url and work with it
    if(image == null){
      return (<h1>"NO IMAGE"</h1>);
    }
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progress function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 10
          );
          setProgress(progress);
        },
        // error function
        (error) => {
          console.log(error);
          alert(error.message);
        },
        () => {
            //final function
            storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then( url => {
                    // post image into db
                    db.collection("posts").add({
                      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                      caption: caption,
                      imageUrl: url,
                      username: user.displayName
                    });
                    
                    setProgress(0);
                    setCaption("");
                    setImage(null);
                    toggleUploadModal();
                  });
          }
    )
  }
                  
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = useState(getModalStyle);
  
  return (
    <div className="imageUpload">

      <Modal
        open={uploadModal}
        onClose={toggleUploadModal}
      >
        <div style={modalStyle} className={classes.paper}>  
          <div className="imageUpload__modal">
          <center>
            <img
              className="app__headerImage"
              src="https://i.imgur.com/zqpwkLQ.png"
              alt=""
            />
          </center>
          {
            (progress)?(
                <progress className="imageUpload__progress" value={progress} max="100"/>
            ):(null)
          }
          {/* <meter className="imageUpload__progress" min="0" max="100" low="33" high="66" optimum="80" value={progress} /> */}
          {/* Caption input */}
          <input 
            type="text" 
            placeholder="Enter a caption"
            onChange={
              event=> setCaption(event.target.value)
            }
            value={caption}
          />
          {/* file picker */}
          <input type="file" onChange={handleChange} />
          <br/>
          {/* post button */}
          <Button 
            onClick={handleUpload}
            variant="contained"
            color="primary"
          >
            Upload
          </Button>
          </div>
        </div>
      </Modal>
      
      {
        user?.displayName?(
          <Button 
            onClick={toggleUploadModal}
            variant="contained"
            color="primary"
          >ADD POST</Button>
        )
        :(<center><h4>Login to post</h4></center>)
      }     
    </div>
  );
}

export default ImageUpload
