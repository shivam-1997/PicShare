// Will define how will a post look
import React from 'react'
import './css/Post.css';
import firebase from "firebase";

function calculateAge(seconds){
  var age = firebase.firestore.Timestamp.now().seconds-seconds // currenntly in secs
  if(age<60){
    return "few secs";
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

function Comment({ cUsername, cText, cTimestamp, cHeartReactCount, cType, user}) {

  if(!cTimestamp){
    // TODO:
    // immediately added comments and captions were passing timestamp as null
    // find why it is happening?
    // Until then set the timestamp to current time
    cTimestamp = firebase.firestore.Timestamp.now()
  }

  function editPost(event){
    return(null);
  } 
  function editComment(event){
    return(null);
  }
  
  return (
    // {/* commentUsername, commentText | Like 
    //   Age | Likes | Reply */}
      
    <div className="comment">
        {/* username + caption + time */}
        <div className="comment__body">
          <p>
            <strong>{cUsername} </strong>
            {cText}
          </p>
          {/* React button */}
        {
          (cHeartReactCount) && (cHeartReactCount > 0)?(
            <button
              className="edit__button"
              type="submit"
              // onClick={toggleHeartReactCount}
            >
            ❤️{cHeartReactCount}
            </button>
          ):(
            <button
            className="edit__button"
            type="submit"
            // onClick={toggleHeartReactCount}
            >
            💟 
            </button>
          )}
        </div>
        {/* Age */}
        <p className="comment__age">{calculateAge(cTimestamp.seconds)} ago 

        {
          (cHeartReactCount) && (cHeartReactCount > 0)?(
            <button
              className="edit__button"
              type="submit"
              // onClick={toggleHeartReactCount}
            >
            ❤{cHeartReactCount}
            </button>
          ):(null)
          }


        {/* Edit button */}
        {
          user &&  user.displayName && 
          user.displayName===cUsername &&(
            <button
            className="edit__button"
            type="submit"
            onClick={editComment}
            >
            Edit
            </button>
          )
        }
        </p>
    </div>
               
  );
}

export default Comment;
