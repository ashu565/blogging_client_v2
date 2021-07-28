import styles from "./id.module.scss";
import { useState, useEffect } from "react";
import Reaction from "../../Components/Reaction/Reaction";
import api from "../../Components/api/api";
import Header from "../../Components/header";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";

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
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const res = await api.get(`/api/v1/blog/getBlog/${params.id}`);
  const data = res.data.data.document;
  return {
    props: {
      blog: data,
    },
    revalidate: 1, // Incremental Site Generation
  };
};

export default function blog({ blog }) {
  const router = useRouter();
  const [isLike, setIsLike] = useState(false); // stores whether user has Liked or Not
  const [comment, setComment] = useState(""); // stores the comment input by user
  const [comments, setComments] = useState([]); // Array of objects of comments with details
  const [commented, setCommented] = useState(false); // get into action as user press post button
  const [more_comments, setMoreComments] = useState(false); // get into action as user press view more comments
  const [user, setUser] = useState(""); // This Stores The current logged in user Id
  const [page, setPage] = useState(1);
  const [display, setDisplay] = useState(false);
  const [totalLikes, setTotalLikes] = useState(blog.likes);

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

  const renderElement = (element) => {
    switch (element.type) {
      case "header":
        const { level } = element.data;
        if (parseInt(level) === 1) {
          return (
            <h1 className={styles.container_header}>{element.data.text}</h1>
          );
        } else if (parseInt(level) === 2) {
          return (
            <h2 className={styles.container_header}>{element.data.text}</h2>
          );
        } else if (parseInt(level) === 3) {
          return (
            <h3 className={styles.container_header}>{element.data.text}</h3>
          );
        } else {
          return (
            <h4 className={styles.container_header}>{element.data.text}</h4>
          );
        }
        break;
      case "paragraph":
        return (
          <p className={styles.container_paragraph}>{element.data.text}</p>
        );
        break;
      case "list":
        if (element.data.style === "unordered") {
          return (
            <ul className={styles.container_list}>
              {element.data.items.map((item) => {
                return <li className={styles.container_list_item}>{item}</li>;
              })}
            </ul>
          );
        } else {
          return (
            <ol className={styles.container_list}>
              {element.data.items.map((item) => {
                return <li className={styles.container_list_item}>{item}</li>;
              })}
            </ol>
          );
        }
        break;
      case "code":
        const { code } = element.data;
        const code_data = code.split("\n");
        return (
          <div className={styles.container_code}>
            {code_data.map((str) => {
              return <p className={styles.container_code_text}>{str}</p>;
            })}
          </div>
        );
        break;
      case "delimiter":
        return <p className={styles.container_delimiter}>* * *</p>;
        break;
      case "table":
        const { content } = element.data;
        return (
          <table className={styles.container_table}>
            {content.map((rowDataInArray) => {
              return (
                <tr className={styles.container_table_row}>
                  {rowDataInArray.map((data) => {
                    return (
                      <td className={styles.container_table_row_data}>
                        {data}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </table>
        );
        break;
    }
  };
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

  return (
    <div className={styles.parent_container}>
      <Toaster />
      <Header />
      <div className={styles.container}>
        <h1 className={styles.container_title}>{blog.title}</h1>
        {/* {data.map((element) => {
          return <div>{renderElement(element)}</div>;
        })} */}
      </div>
      <Reaction
        HandleInput={(e) => setComment(e.target.value)}
        HandleSubmitComment={HandleSubmitComment}
        comments={comments}
        user={user}
        HandleCommentChange={() => setCommented(true)}
        comment={comment}
        HandleLikes={() => setIsLike(!isLike)}
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
