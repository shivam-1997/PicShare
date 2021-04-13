// Will define how will a post look 

import React from 'react'
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
function Post({ username, caption, imageUrl, avatarImageUrl}) {
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
            / >
            {/* username + caption */}
            <h4 className="post__text">
                <strong>{username} </strong>   
                {caption}
            </h4>
        </div>
    )
}

export default Post
