import styles from "./Reaction.module.scss";
import { useState } from "react";
import CommentIcon from "@material-ui/icons/ChatBubbleOutline";
import LikeIcon from "@material-ui/icons/ThumbUpAltOutlined";
import ShareIcon from "@material-ui/icons/Share";
import Comments from "../Comments/Comments";
import Avatar from "@material-ui/core/Avatar";

export default function blog({
  comments,
  HandleInput,
  HandleSubmitComment,
  user,
  HandleCommentChange,
  comment,
  HandleLikes,
  isLike,
  totalLikes,
  admin,
}) {
  return (
    <div className={styles.parent_container}>
      {/* New Section Reactions */}
      <div className={styles.reaction}>
        {isLike === false ? (
          <div onClick={HandleLikes} className={styles.reaction_likes}>
            <LikeIcon color="inherit" fontSize="small" />
            <p>Like</p>
            <p>{totalLikes}</p>
          </div>
        ) : (
          <div onClick={HandleLikes} className={styles.reaction_likes}>
            <img src="/Likes.svg" alt="Liked"></img>
            <p className={styles.reaction_likes_special}>Like</p>
            <p className={styles.reaction_likes_special}>{totalLikes}</p>
          </div>
        )}
        <label htmlFor="Enable_Input_Box" className={styles.reaction_comments}>
          <CommentIcon fontSize="small" />
          <p>Comment</p>
        </label>
        <div className={styles.reaction_likes}>
          <ShareIcon fontSize="default" />
          <p>Share</p>
        </div>
      </div>
      {/* New Comments Section */}
      <div className={styles.comments}>
        {/* Input Section */}
        <div className={styles.comments_input}>
          <Avatar className={styles.comments_input_avatar} src="/avatar.jpg" />
          <textarea
            onChange={(e) => HandleInput(e)}
            value={comment}
            className={styles.comments_input_writing}
            placeholder="Write a comment..."
            id="Enable_Input_Box"
            type="text"
          />
          <button
            onClick={HandleSubmitComment}
            className={styles.comments_input_postButton}
          >
            Post
          </button>
        </div>
        {/* Display Comments Section */}
        <div className={styles.comments_displayAllComments}>
          <span>All Comments</span>
        </div>
        <div>
          <Comments
            HandleCommentChange={HandleCommentChange}
            user={user}
            comments={comments}
            admin={admin}
          />
        </div>
      </div>
    </div>
  );
}
