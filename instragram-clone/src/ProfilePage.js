import React, { useEffect, useState } from 'react';
import { Avatar, Button, Modal} from '@material-ui/core';
import ComingSoon from './ComingSoon'
import { db, storage } from './firebase';
import './css/ProfilePage.css';
import { makeStyles } from '@material-ui/core/styles';
import ImageUploader from 'react-images-upload';


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
    maxWidth: 'max-content',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid lightgray',
    borderRadius: '7px',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    display: 'flex',
    flexDirection: 'column'
  },
}));


// here users are actually usernames
function ProfilePage({user, searchedUser}) {

  const [ownProfile, setOwnProfile] = useState(false);
  // todo: add something on which following use effect listens to
  useEffect(() => {
      if(user === searchedUser){
        setOwnProfile(true);
        console.log(user.displayName + "'s own profile")
      }
      else{
        setOwnProfile(false);
        console.log("Someone else's profile")
        // TODO: searched user can be disabled
      }
  },[user, searchedUser]);

  
  // load all the posts of searched user
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    db.collection("posts")
      .where("username", "==", searchedUser.displayName)
        .orderBy('timestamp', 'desc')
        .onSnapshot(snapshot => 
          { /* onSnapshot acts as a listener */
            setPosts(snapshot.docs.map(doc =>
              ({ 
                id: doc.id,
                post: doc.data()
              })
            ));
          }
        )
  },[]);

  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    if (e.target.files[0]){
      setImage(e.target.files[0])
    }
  };
  
  const [avatarUrl, setAvatarUrl]=useState(searchedUser.photoURL);
  const handleAvatarUpload = (event) =>{
    event.preventDefault();

    console.log("Will upload new Avatar")
    
    // create a storage ref
    const storageRef = storage.ref(user.uid + '/avatar_' + image.name)
    // Upload file
    const uploadTask = storageRef.put(image);
  
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progress function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          // setProgress(progress);
          console.log("Profile photo upload: " + progress +"%")
        },
        function error(err){
          alert(err)
        },
        () => {
            //final function
            storage
            .ref(user.uid)
            .child('/avatar'+image.name)
            .getDownloadURL()
            .then( url => {
                    user.updateProfile({photoURL: url});
                    setAvatarUrl(url)                    
                    setProgress(0);
                    setImage(null);
                  });
          }
    )
    console.log(user.photoURL)
    setOwnAvatarOpen(false);
  }
  const handleAvatarRemove = (event) =>{
    event.preventDefault();

    console.log("Removing Avatar")
    var photoRef = storage.refFromURL(user.photoURL);
    photoRef.delete()
            .then(function() {
                // File deleted successfully
                user.updateProfile({photoURL: ""});
                setAvatarUrl("");
                console.log("Removed successfully.")
              }).catch(function(error) {
                // Uh-oh, an error occurred!
                console.log("An error occurred while deleting from storage")
              });

    setOwnAvatarOpen(false);
  }
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = useState(getModalStyle);
  
  const [ownAvatarOpen, setOwnAvatarOpen] = useState(false)
  const [gridName, setGridName] = useState("posts")
  return (
    <>
    <Modal
      open={ownAvatarOpen}
      onClose={()=> setOwnAvatarOpen(false)} 
    >
      <div style={modalStyle} className={classes.paper}>
        <strong>Change Profile Photo</strong> <br/><hr/>
        <input type="file" onChange={handleChange} />
        <Button onClick={handleAvatarUpload} color="primary">Upload Photo</Button>
        <Button onClick={handleAvatarRemove} color="secondary">Remove Current Photo</Button>
        <Button onClick={()=>(setOwnAvatarOpen(false))}>Cancel</Button>
      </div>
    </Modal>

    <div className="profile">
    <div className="profile__nonGrid">
      <div className="profile__avatar">
        {/* avatar */}
        {/* 
            if own then clicking shows edit option
            else shows status, if any
        */}
        <Avatar
          alt={searchedUser.displayName}
          src={avatarUrl}
          onClick={
            ()=>{
              if(ownProfile){
                console.log("Opening own avatar options")
                setOwnAvatarOpen(true)
              }
              else{
                console.log("Opening others avatar")
              }
            }
          }
        />
      </div>
      <div className="profile__details">
        {/* username */}
        <h2 style={{fontWeight: 'lighter'}}> {searchedUser.displayName}</h2>
        {(ownProfile)?(
          /* if owner, then show
              edit profile and settings button */
         <>
         <button>Settings</button>
         <button>Edit profile</button>
          <div className="profile__stats">
            <p><strong>NaN</strong> posts</p>
            <p><strong>NaN</strong> followers</p>
            <p><strong>NaN</strong> following</p>
          </div>
         </>
        ):(
          /* else show:
                message
                follow 
                button to open dropdown to for suggested users
                hamburger: block, restrict or report
          */
          <>
         <button>...</button>
         <button>Follow</button>
         <button>Message</button>
         </>
        )}
        {/* Numbers: posts + followers + following*/}
        {/* Name */}
        {/* description */}
      </div>
    </div>
    {/* Pinned statuses */}
    <div>
    </div>
    {/* Grids */}
    <div className="profile__grids">

      <div className="profile__navigation">
            <Button 
              onClick={()=>setGridName("posts")}
            >Posts</Button>

            <Button 
              onClick={()=>setGridName("saved")}
            >Saved</Button>

            <Button 
              onClick={()=>setGridName("tagged")}
            >Tagged</Button>
      </div>
      {
        (gridName === "posts")?(
          <div className="profile__postsGrid">
            {posts.map(({id, post}) => 
            (<div key = {id}>
              {/* key = {id} 
              postId = {id}
              postUsername={post.username}
              imageUrl={post.imageUrl}
              avatarImageUrl={post.avatarImageUrl}
              caption={post.caption}
              user={searchedUser}
              timestamp={post.timestamp} */}
                <img 
                  src={post.imageUrl} 
                  className="gridImage" 
                />
              </div>)
            )}
          </div>
        )
        :(gridName === "saved")?(
          <ComingSoon msg="saved"/>
        ):(gridName === "tagged")?(
          <ComingSoon msg="tagged"/>
        ): (null)
      }
      {/* Posts */}
      {/* Saved posts */}
      {/* Tagged */}
    </div>
    <br/><br/><br/>
    </div>
    </>
  );
}

export default ProfilePage;
