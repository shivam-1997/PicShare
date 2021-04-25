import React, { useState, useEffect } from 'react'
import './css/App.css';
import Post from './Post';
import {auth, db} from './firebase.js';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';


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
  const [posts, setPosts] = useState([]);
    
  useEffect(() => {
    /*will run once for all the posts*/
    db.collection("posts"/*name inside firebase db*/)
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
        })
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
  
    auth.createUserWithEmailAndPassword(email, password)
        .then((authUser)=>{
          return authUser.user.updateProfile({
            displayName: username
          })
        })
        .catch((error)=> alert(error.message));
    setSignUpOpen(false);      
  }

  const signIn =(event)=>{
    event.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
        .catch((error)=> alert(error.message));
    
    setSignInOpen(false);
  }
  
  return (
    <div className="App">
      
      <Modal
        open={signUpOpen}
        onClose={()=> setSignUpOpen(false)} /* Inline function */
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

      {/* Header */}
      <div className="app__header">
        
       <img
        className="app__headerImage"
        src="https://i.imgur.com/zqpwkLQ.png"
        alt=""
       />
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
      {
        user?(
          <div className="app__posts">
          {
            posts.map(({id, post}) => 
            (<Post
              key = {id} 
              postId = {id}
              username={post.username}
              imageUrl={post.imageUrl}
              avatarImageUrl={post.avatarImageUrl}
              caption={post.caption}
              user={user}
              timestamp={post.timestamp}
              />)
            )
          }
          </div>
        ): (null)
      }

      {/* Navigation bar */}
      <div className="app__navigation">
        <ImageUpload user={user}/>
      </div>

    </div>   
  );
}

export default App;
