import { useState } from "react";
import CommentCard from "./CommentCard";
export default function Comments({ comments, user, HandleCommentChange }) {
  const [comment, setComment] = useState([
    {
      name: "Ashutosh Singh Chauhan",
      comment: "This is Insane",
    },
    {
      name: "Devanshu Sharma",
      comment: "Fantastic",
    },
    {
      name: "Rahul Tripathi",
      comment: "Bhai acchi nahi lagg rahi",
    },
    {
      name: "Ajay Yadav",
      comment: "Bhai Bdia lagg rahi hai",
    },
    {
      name: "Kuldeep Singh",
      comment: "Raja Lagg Rahe ho",
    },
  ]);
  return (
    <>
      <div>
        {comments.map((comment) => {
          return (
            <div key={comment._id}>
              <CommentCard
                HandleCommentChange={HandleCommentChange}
                user={user}
                comment={comment}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
