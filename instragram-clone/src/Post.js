// Will define how will a post look
import React, { useState, useEffect } from 'react'
import './css/Post.css';
import Avatar from '@material-ui/core/Avatar';
import {db} from './firebase.js';
import firebase from "firebase";

function calculateAge(seconds){
  var age = firebase.firestore.Timestamp.now().seconds-seconds // currenntly in secs
  if(age<60){
    return "seconds";
  }
  age = age/60; // currently in mins
  if(age<60){
    return (Math.floor(age)+" mins");
  }
  age = age/60; //currently in hrs
  if(age<24){
    return (Math.floor(age)+" hrs");
  }
  age = age/24; //currently in days
  if(age<31){
    return (Math.floor(age)+" days");
  }
  age = age/30; //currently in months 
  if(age<12){
    return (Math.floor(age)+" mths");
  }
  age = age/12; //currently in years
  return (Math.floor(age)+" yrs");
}
function Post({ postId, postUsername, caption, imageUrl, avatarImageUrl, user, timestamp}) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  // read comments
  useEffect(() => {
    let unsubscribe;
    if (postId){
      unsubscribe =
        db.collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy('timestamp', 'asc')
        .onSnapshot(
          (snapshot) => {
            setComments(
              snapshot.docs.map( 
                (doc) => (doc.data()) 
              ))
              }
        );
    };
    return () => {
      unsubscribe();
    };
  }, [postId]);

  // postComment handles uploading the comment
  const postComment = (event) => {
    event.preventDefault();
    db.collection("posts")
        .doc(postId)
        .collection("comments")
        .add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            edited: 0,
            heartReactCount: 0
        });
    setComment('');
  }

  function editPost(event){
    return(null);
  } 
  function editComment(event){
    return(null);
  }
  
  return (
    <div className="post">
        {/* header -> avatar + username */}
        <div className="post__header">
            <Avatar
                className="post__avatar"
                alt={postUsername}
                src={avatarImageUrl}
            />
            <h3>{postUsername}</h3>
        </div>

        {/* actual post/image */}
        <img
            className = "post__image"
            src={imageUrl}
            alt={imageUrl}
        />
        <div className="post__caption">
          {/* username + caption + time */}
          <p className="post__text">
              <strong>{postUsername} </strong>
              {caption}
          </p>
          <p>  
            {/* Edit button */}
            {
              user &&  user.displayName && 
              user.displayName===postUsername &&(
                <button
                  className="edit__button"
                  type="submit"
                  onClick={editPost}
                >
                  (Edit)
                </button>
              )
            }
            {/* Age */}
            <text className="comment__age">{calculateAge(timestamp.seconds)} ago</text>
          </p>
        </div> 

        {/********************************************/}
        {/* Existing comments */}
        {/* username + comment + Edit + react + Age */}
        <div className="post__comments">
          {
            comments.map(c=>(
              <div className="post__comment">
              {/* username + comment */}
              <p> 
                <strong>{c.username}</strong> {c.text}
              </p>
              {/* Edit button */}
              <p>
               {
                  user &&  user.displayName && 
                  user.displayName===c.username &&(
                    <button
                      className="edit__button"
                      type="submit"
                      onClick={editComment}
                    >
                      (Edit)
                    </button>
                  )
                }
                {/* React button */}
                {
                  (c.heartReactCount) && (c.heartReactCount > 0)?(
                      <button
                        className="edit__button"
                        type="submit"
                        // onClick={toggleHeartReactCount}
                      >
                        ❤️{c.heartReactCount}
                      </button>
                  ):(
                    <button
                      className="edit__button"
                      type="submit"
                      // onClick={toggleHeartReactCount}
                    >
                      💟 
                    </button>
                  )
                }
                {/* Age */}
                <text className="comment__age">| {calculateAge(c.timestamp.seconds)} ago</text>
                </p> 
              </div>
            ))
          }
        </div>
        {/********************************************/}
        {/* Add comment */}
        {user &&  user.displayName && ( 
            <form className="post__commentBox">
              <input
                className="post__input"
                type="text"
                placeholder="Say something..."
                value={comment}
                onChange={(e)=>setComment(e.target.value)}
              />
              <button
                className="post__button"
                disabled={!comment}
                type="submit"
                onClick={postComment}
              >
                Post
              </button>
            </form>
        )
      }
    </div>
  )
}

export default Post
