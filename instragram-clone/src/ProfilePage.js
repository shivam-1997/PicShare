import React, { useEffect, useState } from 'react';
import { Button} from '@material-ui/core';
import ComingSoon from './ComingSoon'
import { db } from './firebase';
import './css/ProfilePage.css';

// here users are actually usernames
function ProfilePage({loggedInUser, searchedUser}) {

  // check if the ownProfile
  // if yes, show everything everything except follow and message
  // if not, 
  // show follow/following
    // if private dont show unless followed
    
  // if(loggedInUser === searchedUser){
  // }
  console.log(loggedInUser + " searched for: "+searchedUser);
  
  // const [ownProfile, setOwnProfile] = useState(false);
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    db.collection("posts")
      .where("username", "==", searchedUser)
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
  

  const [gridName, setGridName] = useState("posts")
  return (
    <div className="profile">
    <div>
      {/* avatar */}
      <div>
        {/* username */}
        {/* Edit profile */}
        {/* Settings */}
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
            (<div>
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
  );
}

export default ProfilePage;
