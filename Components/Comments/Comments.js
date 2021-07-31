import CommentCard from "./CommentCard";
export default function Comments({
  comments,
  user,
  HandleCommentChange,
  admin,
}) {
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
                admin={admin}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
