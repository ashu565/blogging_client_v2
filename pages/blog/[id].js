import styles from "./id.module.scss";
import { useState, useEffect } from "react";
import Reaction from "../../Components/Reaction/Reaction";
import api from "../../Components/api/api";
import Header from "../../Components/header";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";
import dynamic from "next/dynamic";

import { EditorState, convertToRaw, convertFromRaw } from "draft-js";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((module) => module.Editor),
  {
    ssr: false,
  }
);
export const getStaticPaths = async () => {
  const res = await api.get("/api/v1/blog/getAllBlog");
  const data = res.data.document;
  const paths = data.map((blog) => {
    return {
      params: {
        id: blog._id,
      },
    };
  });
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params }) => {
  const res = await api.get(`/api/v1/blog/getBlog/${params.id}`);
  const data = res.data.data.document;
  return {
    props: {
      blog: data,
    },
    revalidate: 5, // Incremental Site Generation
  };
};

export default function blog({ blog }) {
  const router = useRouter();
  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }
  const [isLike, setIsLike] = useState(false); // stores whether user has Liked or Not
  const [comment, setComment] = useState(""); // stores the comment input by user
  const [comments, setComments] = useState([]); // Array of objects of comments with details
  const [commented, setCommented] = useState(false); // get into action as user press post button
  const [more_comments, setMoreComments] = useState(false); // get into action as user press view more comments
  const [user, setUser] = useState(""); // This Stores The current logged in user Id
  const [page, setPage] = useState(1);
  const [display, setDisplay] = useState(false);
  const [totalLikes, setTotalLikes] = useState(blog.likes);
  const [admin, setAdmin] = useState(blog.author._id);
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(convertFromRaw(JSON.parse(blog.body)))
  );

  useEffect(async () => {
    if (user) {
      const config = {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      };
      if (!isLike) {
        const res = await api.patch(
          "/api/v1/blog/deleteLikes",
          {
            blogId: router.query.id,
            userId: user,
          },
          config
        );
        setTotalLikes(res.data.likes);
      } else {
        const res = await api.patch(
          "/api/v1/blog/updateLikes",
          {
            blogId: router.query.id,
            userId: user,
          },
          config
        );
        setTotalLikes(res.data.likes);
      }
    }
  }, [isLike]);

  useEffect(async () => {
    try {
      const config = {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      };
      const res = await api.get("/api/v1/auth/getuser", config);
      setUser(res.data.data.user._id);

      const userId = res.data.data.user._id;
      const index = blog.Likes.indexOf(userId);
      if (index !== -1) {
        setIsLike(true);
      }
    } catch (err) {}
  }, []);

  useEffect(async () => {
    const { id } = router.query;
    const res = await api.get(
      `/api/v1/blog/getAllComments?blog=${id}&page=${page}`
    );
    const new_comments = [...res.data.comment];
    if (new_comments.length === 0) {
      setDisplay(false);
    }
    setComments((comments) => [...comments, ...new_comments]);
  }, [more_comments]);

  useEffect(async () => {
    const { id } = router.query;
    const res = await api.get(`/api/v1/blog/getAllComments?blog=${id}&page=1`);
    const new_comments = [...res.data.comment];
    if (new_comments.length === 5) {
      setDisplay(true);
    }
    setComments(new_comments);
    setPage(1);
    setCommented(false);
  }, [commented]);

  const HandleSubmitComment = async () => {
    if (comment) {
      const { id } = router.query;
      try {
        const config = {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        };
        const res = await api.post(
          `/api/v1/blog/createComment`,
          {
            comment,
            blog: id,
          },
          config
        );
        setComment("");
        setCommented(true);
      } catch (err) {
        toast.error("You are Not Logged In, Please Log In and then Comment");
      }
    }
  };

  const HandleMoreComments = async () => {
    const pg = page;
    setPage(pg + 1);
    setMoreComments(() => !more_comments);
  };
  const HandleTags = (tags) => {
    return tags.map((tag) => {
      return <span className={styles.container_tag}>{tag}</span>;
    });
  };
  const name = `${blog.author.first_name} ${blog.author.last_name}`;

  return (
    <div className={styles.parent_container}>
      <Toaster />
      <Header />
      <div className={styles.container}>
        <h1 className={styles.container_title}>{blog.title}</h1>
        <div className={styles.container_tags}>{HandleTags(blog.tags)}</div>
        <Chip
          avatar={<Avatar alt="" src={blog.author.avatar} />}
          label={name}
        />
        <Editor
          editorState={editorState}
          toolbarClassName={styles.container_toolbar}
          editorClassName={styles.container_editor}
          readOnly="true"
        />
      </div>
      <Reaction
        HandleInput={(e) => setComment(e.target.value)}
        HandleSubmitComment={HandleSubmitComment}
        comments={comments}
        user={user}
        admin={admin}
        HandleCommentChange={() => setCommented(true)}
        comment={comment}
        HandleLikes={() => {
          if (user) {
            setIsLike(!isLike);
          } else {
            toast.error("You Are Not Logged In,Please get Logged In");
          }
        }}
        isLike={isLike}
        totalLikes={totalLikes}
      />
      {display ? (
        <div className={styles.show}>
          <span onClick={HandleMoreComments} className={styles.show_more}>
            View more comments
          </span>
        </div>
      ) : null}
    </div>
  );
}
