import { Button } from '@material-ui/core';
import React, {useState} from 'react';
import {storage, db} from './firebase';
import firebase from "firebase";
import './css/ImageUpload.css'


function ImageUpload({user}) {

  
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
                  });
          }
    )
  }

  return (
    <div className="imageUpload">

          <div className="imageUpload__modal">
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
  );
}

export default ImageUpload
