import React, { useState, useEffect } from 'react'
import './css/App.css';
import {auth, db} from './firebase.js';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import ProfilePage from './ProfilePage';
import Feeds from './Feeds';
import ActivityPage from './ActivityPage'
import SearchPage from './SearchPage'
import firebase from "firebase";
import Welcome from "./Welcome";

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
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [signInOpen, setSignInOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);

  const [email, setEmail] = useState(``);
  const [username, setUsername] = useState(``);
  const [password, setPassword] = useState(``);
  
  const[user, setUser] = useState(null);
  useEffect(() => 
    {
      const unsubscribe = auth.onAuthStateChanged(
        (authUser)=>{
          if(authUser){
            // user has logged in
            console.log(authUser);
            setUser(authUser); //persistent, keeps you login, survives refresh, uses cookie trcaking
          }
          else{
            // user has not logged in
            setUser(null)
          }
        });
        return () =>{
          // perform some cleanup actions
          // will avoid duplicates
          unsubscribe();
        }
        // this has to be fired up anytime
        // either user or username is changed
    }, [user, username]);
  
  const signUp =(event)=>{
    // prevent the page from reloading
    event.preventDefault();
    // authenticating user and creating entry in user table
    // create user with email & password
    // create user with Google
    // create user with Phone number
    // create user with Apple
    auth.createUserWithEmailAndPassword(email, password)
        .then((authUser)=>{
          db.collection("users")
            .doc(authUser.user.uid)
            .collection("basicDetails")
            .add({
              creation_time: firebase.firestore.FieldValue.serverTimestamp(),
              description: "",
              followersCount: 0,
              followingCount: 0,
              postCount:0,
              isActive: true,
              isPrivate: false,
              isProfessional: false,
              username: authUser.user.displayName,
              photoUrl:""
            });
          db.collection("users")
            .doc(authUser.user.uid)
            .collection("notification")
            .add({
              notifyViaEmail: true
            })
          db.collection("users")
            .doc(authUser.user.uid)
            .collection("pushNotification")
            .add({
              // likes: off, fromPeopleIFollow, everyone
              likes: "everyone",
              // Comments: off, fromPeopleIFollow, everyone
              Comments: "everyone",
               // commentLikes: off, fromPeopleIFollow
              commentLikes: "fromPeopleIFollow",
              // taggedPostUpdate: off, fromPeopleIFollow, everyone
              taggedPostUpdate: "fromPeopleIFollow",
              // acceptedFollowRequest: off, everyone
              acceptedFollowRequest: "everyone"
            })
          
          return authUser.user.updateProfile({
            displayName: username
          })
        })
        .catch(
          (error)=> {
            console.log(error.message);
            alert("user creation failed");
          }
        );
        
    setSignUpOpen(false);      
  }

  const signIn =(event)=>{
    event.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
        .catch((error)=> alert(error.message));

    setSignInOpen(false);
  }
  
  const [pageName, setPageName] = useState("feeds");

  return (
    <div className="App">
      {/* signup Modal */}
      <Modal
        open={signUpOpen}
        onClose={()=> setSignUpOpen(false)} /* Inline function */
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center><h2>SignUp</h2></center>
            {/* first show following options/buttons
                // create user with email & password
                // create user with Google
                // create user with Phone number
                // create user with Apple
            */}
            <Input
              placeholder="Email"
              type="text"
              onChange={ (e) => setEmail(e.target.value)}
              value={email}
            />  
            <Input
              placeholder="Username"
              type="text"
              onChange={ (e) => setUsername(e.target.value)}
              value={username}
            />
            <Input
              placeholder="Password"
              type="password"
              onChange={ (e) => setPassword(e.target.value)}
              value={password}
            />
            <Button type="submit" onClick={signUp}>Signup</Button>
          </form>
        </div>
        
      </Modal>

      <Modal
        open={signInOpen}
        onClose={()=> setSignInOpen(false)} /* Inline function */
      >
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img
            className="app__headerImage"
            src="https://i.imgur.com/zqpwkLQ.png"
            alt=""
            />
          </center> 
          <form className="app__signup">
            <Input
              placeholder="Email"
              type="text"
              onChange={ (e) => setEmail(e.target.value)}
              value={email}
            />
            <Input
              placeholder="Password"
              type="password"
              onChange={ (e) => setPassword(e.target.value)}
              value={password}
            />
            <Button type="submit" onClick={signIn}>Log In</Button>
          </form>
        </div>
      </Modal>

      {/* Header starts*/}
      <div className="app__header">
        <div>
          { user?(
              (pageName === "feeds")?(
                <h2>Instagram</h2>
              ):(pageName === "post")?(
                <h2>Upload</h2>
              ):(pageName === "activity")?(
                <h2>Activity</h2>
              ):(pageName === "profile")?(
                <h2>{user.displayName}</h2>
              ):(pageName === "search")?(
                <h2>Search</h2>
              ):(null)
            ): (
              <h2>Instagram</h2>   
            )
          }
          </div>
      {
        user ? (
          <Button onClick={() => auth.signOut()}>SignOut</Button>
        ):
        (
          <div className="app__logincontainer">
            <Button onClick={() => setSignUpOpen(true)}>SignUp</Button>
            <Button onClick={() => setSignInOpen(true)}>SignIn</Button>
          </div>
        )
      }
      </div>
      {/* Header ends*/}

      {
        user?.displayName?(
          <>
          {/* body starts */}
          <div>
          { 
            (pageName === "feeds")?(
              <Feeds user={user} />
            ):(pageName === "post")?(
              <ImageUpload user={user} />
            ):(pageName === "activity")?(
              <ActivityPage user={user} />
            ):(pageName === "profile")?(
              <ProfilePage user={user} searchedUser={user}/>
            ):(pageName === "search")?(
              <SearchPage user={user}/>
            ): (null)
          }
          </div>
          {/* body ends */}
          <br/><br/>
          {/* Navigation bar starts*/}
          <div className="app__navigation">
            <Button 
              onClick={()=>setPageName("feeds")}
              // variant="contained"
              // color="primary"
            >Feeds</Button>

            <Button 
              onClick={()=>setPageName("post")}
              // variant="contained"
              // color="primary"
            >Post</Button>

            <Button 
              onClick={()=>setPageName("search")}
              // variant="contained"
              // color="primary"
            >Search</Button>

            <Button 
              onClick={()=>setPageName("activity")}
              // variant="contained"
             // color="primary"
            >Activity</Button>
            
            <Button 
              onClick={()=>setPageName("profile")}
            // variant="contained"
            // color="primary"
            >Profile</Button>
          </div>
          {/* Navigation bar ends */}
          </>
        ):(
          <Welcome/>
        )
      }     
      {/* Navigation bar ends*/}
    </div>   
  );
}

export default App;
