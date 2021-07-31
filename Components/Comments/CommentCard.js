import styles from "./comment.module.scss";
import Avatar from "@material-ui/core/Avatar";
import api from "../api/api";
export default function CommentCard({
  comment,
  user,
  HandleCommentChange,
  admin,
}) {
  if (!comment.user) {
    return null;
  }
  const HandleCommentDelete = async () => {
    try {
      await api.delete(`/api/v1/blog/deleteComment/${comment._id}`);
      HandleCommentChange();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className={styles.CommentCard}>
      <Avatar
        className={styles.CommentCard_Avatar}
        src="/avatar.jpg"
        alt="Ashutosh Singh Chauhan"
      />
      <div className={styles.CommentCard_Details}>
        <div className={styles.CommentCard_Details_Comment}>
          <span>{comment.user.first_name + " " + comment.user.last_name}</span>
          <p>{comment.comment}</p>
        </div>
        <div className={styles.CommentCard_Details_Reaction}>
          <p>Like</p>
          {user === admin || comment.user._id === user ? (
            <p onClick={HandleCommentDelete}>Delete</p>
          ) : null}
          <small>7h</small>
        </div>
      </div>
      <img
        style={{
          height: "1rem",
        }}
        src="/Likes.svg"
        alt="Likes"
      ></img>
    </div>
  );
}
