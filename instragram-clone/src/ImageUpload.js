import { Button } from '@material-ui/core';
import React, {useState} from 'react';
import {storage, db} from './firebase';
import firebase from "firebase";
import './ImageUpload.css'

function ImageUpload({username, avatarImageUrl}) {

    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');
    const [url, setUrl] = useState('');

    const handleChange = (e) => {
        if (e.target.files[0]){
            setImage(e.target.files[0])
        }
    };

    const handleUpload = () =>{
        // below statement uploads the image to storage
        // after this we would need to get the image url and work with it
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
                            username: username
                        });

                        setProgress(0);
                        setCaption("");
                        setImage(null);
                        setUrl("");
                    });
            }
        )
    }
    return (
        <div className="imageUpload">

        <progress className="imageUpload__progress" value={progress} max="100"/>   
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

        {/* post button */}
        <Button onClick={handleUpload}>
            Upload
        </Button>
        </div>
    )
}

export default ImageUpload
