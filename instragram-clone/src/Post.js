// Will define how will a post look
import React, { useState, useEffect } from 'react'
import './css/Post.css';
import Avatar from '@material-ui/core/Avatar';
import {db} from './firebase.js';
import firebase from "firebase";
import Comment from "./Comment"
import { Button } from '@material-ui/core';

// following keys of post are used in this function
// username
// caption
// imageUrl
// avatarImageUrl
// timestamp
// likeCount
function Post({ postId, post, user}) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [likeStatus, setLikeStatus] = useState("LIKE");
  // toggles user reaction to post
  const likePost = (event) =>{
    // todo: complete this function
    event.preventDefault();
    // db.collection("posts")
    // .doc(postId)
    // .update({
    //     likeCount: post.likeCount+1 
    // });
    console.log(user.displayName + " liked " + postId)
  }
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
            likeCount: 0
        });
    setComment('');
  }
 
  
  return (
    <div className="post">
        {/* header -> avatar + username */}
        <div className="post__header">
            <Avatar
                className="post__avatar"
                alt={post.username}
                // todo: correct the avatar Image url
                src="{avatarImageUrl}"
            />
            <h3>{post.username}</h3>
            
        </div>
        {/* image */}
        <img
            className = "post__image"
            src={post.imageUrl}
            alt=""
        />
        {/* like + comment + share */}
        <div className="post__reactionBar">
          <Button
            onClick={likePost}
          >
            Like
          </Button>
          {/* todo */}
          <Button>
            Comment
          </Button>
          {/* todo */}
          <Button>
            Share
          </Button>
        </div>
        {/* Caption */}
        <div className="post__caption">
          <Comment 
            cUsername={post.username} 
            cText={post.caption}
            cTimestamp={post.timestamp} 
            cType="caption"
            user={user}
          />
        </div> 

        {/********************************************/}
        {/* Existing comments */}
        {/* username + comment + Edit + react + Age */}
        <div className="post__comments">
          {
            comments.map(c=>(// find why curly braces fail here
              <Comment 
                cUsername={c.username} 
                cText={c.text}
                cTimestamp={c.timestamp} 
                cType="comment"
                user={user}
              />
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
