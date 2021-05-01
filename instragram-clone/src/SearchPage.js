import React, {useEffect, useState} from 'react';
import ProfilePage from './ProfilePage';
import './css/Search.css';

function SearchPage({user}) {


  const [searchItem, setSearchItem] = useState('');
  const [searchedUser, setSearchedUser] = useState(null);
  useEffect(() => {
    // only check if len of search item is >1
    // db.collection("posts")
    //   .where("username", "==", searchItem)
    //     .orderBy('timestamp', 'desc')
    //     .onSnapshot(snapshot => 
    //       { /* onSnapshot acts as a listener */
    //         setPosts(snapshot.docs.map(doc =>
    //           ({ 
    //             id: doc.id,
    //             post: doc.data()
    //           })
    //         ));
    //       }
    //     )
    console.log("searching " + searchItem +" using useEfect")
  },[searchItem]);

  const [inSearch, setInSearch] = useState(false);

  return (
    <div className="search">
      <div className="search_bar">
        <input 
          type="text" 
          placeholder="Search something"
          onChange={
            event=> {
              setSearchItem(event.target.value);
              setInSearch(false);
            }
          }
          value={searchItem}
        />
      </div>
      {
        (inSearch===true)?(
          console.log(user.displayName + " searched for: "+ searchItem)
          // <ProfilePage user={user} searchedUser={searchedUser} />
        ):(null)
      }
      <br />
    </div>
  );
}

export default SearchPage
