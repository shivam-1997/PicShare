import React, { useState, useEffect } from 'react'
import './css/App.css';
import Post from './Post';
import {db} from './firebase.js';

function Feeds({user}) {

  const [posts, setPosts] = useState([]);
    
  useEffect(() => {
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

  return (
    <div className="App">
      {
        user?(
          <div className="app__posts">
          {
            posts.map(({id, post}) => 
            (<Post 
              key = {id} 
              postId = {id}
              post={post}
              user={user}
             />)
            )
          }
          </div>
        ): (null)
      }
    </div>   
  );
}

export default Feeds;
