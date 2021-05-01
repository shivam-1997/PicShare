import React, { useState, useEffect } from 'react'
import './css/App.css';
import {auth, db} from './firebase.js';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import firebase from "firebase";

const createUserEntry = (uid, displayName) => {
    db.collection("users")
      .doc(uid)
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
          username: displayName,
          photoUrl:""
      });
    db.collection("users")
      .doc(uid)
      .collection("notification")
      .add({
          notifyViaEmail: true
      });
    db.collection("users")
      .doc(uid)
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
      });
}

function Welcome() {

  const [signInOpen, setSignInOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);

  const [email, setEmail] = useState(``);
  const [username, setUsername] = useState(``);
  const [password, setPassword] = useState(``);
  
  const[user, setUser] = useState(null);

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
                createUserEntry(authUser.user.uid,authUser.user.displayName)
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

    return (
      <div>
        <form className="app__signup">
          <center><h2>SignUp</h2></center>
          {/* first show following options/buttons
              // create user with email & password
              // create user with Google
              // create user with Phone number
              // create user with Apple
          */}
          <Button 
            // onClick={signupEmail}
          >
              SignUp using Email
          </Button>          
          <Button 
            // onClick={signupGoogle}
          >
              SignUp using Google
          </Button>         
           <Button 
            // onClick={signupPhone}
          >
              SignUp using Phone
          </Button>          
          <Button 
            // onClick={signupApple}
          >
              SignUp using Apple
          </Button>
          <Button 
            // onClick={signup}
          >
              Cancel 
          </Button>
          {/* <Input
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
          <Button type="submit" onClick={signUp}>Signup</Button> */}
        </form>
      </div>
      
    );
}

export default Welcome
