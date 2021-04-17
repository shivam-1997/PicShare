// Will define how will a post look
import React, { useState, useEffect } from 'react'
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import {db} from './firebase.js';
import firebase from "firebase";

function Post({ postId, username, caption, imageUrl, avatarImageUrl, user}) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  
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

  const postComment = (event) => {
    event.preventDefault();
    db.collection("posts")
        .doc(postId)
        .collection("comments")
        .add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    setComment('');
  }

    return (
        <div className="post">
            {/* header -> avatar + username */}
            <div className="post__header">
                <Avatar
                    className="post__avatar"
                    alt={username}
                    src={avatarImageUrl}
                />
                <h3>{username}</h3>
            </div>

            {/* actual post/image */}
            <img
                className = "post__image"
                src={imageUrl}
                alt=""
            />

            {/* username + caption */}
            <h4 className="post__text">
                <strong>{username} </strong>
                {caption}
            </h4>

            {/* Existing comments */}
            <div className="post__comments">
              {
                comments.map(c=>(
                  <p> <strong>{c.username}</strong> {c.text}</p>)
                )
              }
            </div>

            {/* Add comments */}
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
