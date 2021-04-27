import React, {useState} from 'react';
import ProfilePage from './ProfilePage';
import './css/Search.css';

function SearchPage({user}) {


  const [searchItem, setSearchItem] = useState('');
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
        <button
          onClick={ () => setInSearch(true) }
          variant="contained"
        >
          Search
        </button>
      </div>
      {
        (inSearch===true)?(
          console.log(user.displayName + " searched for: "+ searchItem),
          <ProfilePage loggedInUser={user.displayName} searchedUser={searchItem} />
        ):(null)
      }
      <br />
    </div>
  );
}

export default SearchPage
