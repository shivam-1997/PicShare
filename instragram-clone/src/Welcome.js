import React, { useState, useEffect } from 'react'
import './css/App.css';
import './css/Welcome.css';
import {auth, db} from './firebase.js';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import firebase from "firebase";
import SignIn from './SignIn'
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

// function emailForm(){
//   return(
//     <div>
//       <Input
//         placeholder="Email"
//         type="text"
//         onChange={ (e) => setEmail(e.target.value)}
//         value={email}
//       />  
//       <Input
//         placeholder="Username"
//         type="text"
//         onChange={ (e) => setUsername(e.target.value)}
//         value={username}
//       />
//       <Input
//         placeholder="Password"
//         type="password"
//         onChange={ (e) => setPassword(e.target.value)}
//         value={password}
//       />
//       <Button type="submit" onClick={signUp}>Signup</Button>

//     </div>
    
//   )
// }



function Welcome() {

  const [signInOpen, setSignInOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState("welcome");

  
  // state= {showForm: false}
  const [email, setEmail] = useState(``);
  const [username, setUsername] = useState(``);
  const [password, setPassword] = useState(``);
  
  const[user, setUser] = useState(null);


  const showForm = () => {
    return (


      <div> 
        console.log('Hi')
     <form id= "add-app">
 
          <label>Application Name : </label>
          <input type="text"> </input>
 
          <label> id : </label>
          <input type="text" ></input>
 
          <label>Server details : </label>
          <input ></input>
 
          <button>Create</button>
       </form>
       </div>
      );
  }
 

  const signupEmail = () =>{
    console.log("signupEmail");
    // <form className="">

    //   <Input
    //     placeholder="Email"
    //     type="text"
    //     onChange={ (e) => setEmail(e.target.value)}
    //     value={email}
    //   />  
    //   <Input
    //     placeholder="Username"
    //     type="text"
    //     onChange={ (e) => setUsername(e.target.value)}
    //     value={username}
    //   />
    //   <Input
    //     placeholder="Password"
    //     type="password"
    //     onChange={ (e) => setPassword(e.target.value)}
    //     value={password}
    //   />
    //   <Button type="submit" onClick={signUp}>Signup</Button>
    // </form>
    return(
    <div>
      <form id= "add-app">
  
        <label>Application Name : </label>
        <input type="text"> </input>

        <label> id : </label>
        <input type="text" ></input>

        <label>Server details : </label>
        <input ></input>

        <button>Create</button>
      </form>
 </div>
    )
      
    
  }

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
      <div classs="welcome__main">
      {
        (signUpOpen === "welcome")?
        (

          <div>
          <form className="app__signup">
            <center><h2>SignUp</h2></center>
            {/* first show following options/buttons
                // create user with email & password
                // create user with Google
                // create user with Phone number
                // create user with Apple
            */}
            <Button onClick={()=> setSignUpOpen("email")} > SignUp using Email </Button> 
                     
            <Button onClick={()=> setSignUpOpen("google")}> SignUp using Google </Button>         
            <Button onClick={()=>setSignUpOpen("phone")} > SignUp using Phone </Button>          
            <Button onClick={()=>setSignUpOpen("apple")} > SignUp using Apple </Button>
            <Button onClick={()=>setSignUpOpen("cancel")} > Cancel       </Button>
            
          </form>
        </div>

        ):(signUpOpen === "google")?
        (<div>
          Open using email
          {/* {
            alert("email email email"),
            console.log("in email")
          } */}
          
          <form className="">
            <div>
              <div class="col-75">
              <label htmlFor="email">Email address</label>
                <Input
                  placeholder="Email"
                  type="text"
                  onChange={ (e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
              <div class="col-75">
              <label htmlFor="username_">User Name</label>
                <Input
                  placeholder="Username"
                  type="text"
                  onChange={ (e) => setUsername(e.target.value)}
                  value={username}
                />
              </div>
              <div class="col-75">
              <label htmlFor="password_">Password</label>
                <Input
                  placeholder="Password"
                  type="password"
                  onChange={ (e) => setPassword(e.target.value)}
                  value={password}
                />
              </div>
              <div class="col-75">
                <Button type="submit" onClick={signUp}>Signup</Button>
              </div>
              <div class="col-75">
                <Button onClick={()=> setSignUpOpen("welcome")}>Go Back </Button>
              </div>
              
            </div>
            
          </form>
          
        </div>
          
          ):(signUpOpen === "email")?
          (<div>
              Open using Email
              <div class = "container">
                <div class = "row">
                <div class="col-sm-offset-3 col-sm-6">
                  <div class="tile">
                    <div class="login show">
                      <form>
                        <div class="form-group">
                          <input type="text" class="form-control" placeholder="Name" required/>
                        </div>
                        <div class="form-group">
                            <input type="email" class="form-control" placeholder="Email" required/>
                        </div>
                        <div class="form-group">
                            <input type="password" class="form-control" placeholder="Password" required/>
                        </div>
                        <button type="submit" class="btn-block">Sign Up</button>
                        <div class="soc">
                          <a href="#" class="fa fa-facebook"></a>
                          <a href="#" class="fa fa-twitter"></a>
                          <a href="#" class="fa fa-linkedin"></a>
                        </div>
                        <Button class="btn-goback"onClick={()=> setSignUpOpen("welcome")}>Go Back </Button>
                        {/* <button type="submit" class="btn-block">Go Back</button> */}
                      </form>
                    </div>
                  </div>   
                  {/* // title */}
                </div>     
                {/* // sm6 */}
              </div> 
                    {/* // row */}
            </div>         
            {/* // container */}
          </div>           
          // main closing 
            
            )
        :(null)

      }
      </div>
    );
}

export default Welcome
