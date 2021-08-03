import dynamic from "next/dynamic";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import styles from "./my-text-editor.module.scss";
import Header from "../Components/header";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { useState, useEffect, useRef } from "react";
import api from "../Components/api/api";
import ContentEditable from "react-contenteditable";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((module) => module.Editor),
  {
    ssr: false,
  }
);

const uploadImageCallBack = async (file) => {
  try {
    const config = {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    };
    const fd = new FormData();
    fd.append("image", file, file.name);
    const result = await api.post("api/v1/blog/imageupload", fd, config);
    console.log(result);
    const response = {
      data: {
        link: result.data.url,
      },
    };
    return response;
  } catch (err) {
    console.log(err);
  }
};

export default function myeditor() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState(""); // keeps the track of user_id
  const text_title = useRef("");
  const text_description = useRef("");
  const text_tags = useRef("");
  const router = useRouter();

  useEffect(async () => {
    try {
      const config = {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      };
      const data = await api.get("/api/v1/auth/getuser", config);
      const id = data.data.data.user._id;
      setUser(id);
      setLogin(true);
    } catch (err) {
      setLogin(false);
    }
  }, []);

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };
  const HandleBlogSubmit = async () => {
    const config = {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    };
    const title = text_title.current.trim();
    const description = text_description.current.trim();
    const tags = text_tags.current.split(",");
    const body = JSON.stringify(convertToRaw(editorState.getCurrentContent())); // object
    const author = user;
    if (!title || !description || !text_tags.current) {
      toast.error("A Blog Must Have a Title,Description and Tags");
      return;
    }
    const editor_content = {
      title,
      description,
      tags,
      body,
      author,
    };
    try {
      const myPromise = await api.post(
        "/api/v1/blog/createBlog",
        editor_content,
        config
      );
      toast.success("Thanks for writing a Blog");
      router.push('/');
    }catch(err) {
      toast.error("Server is Busy ! Please Write after sometime");
    }
  };
  if (!login) {
    return <h1>You are not logged in, please log in</h1>;
  }
  return (
    <div className={styles.parent}>
      <Toaster position="top-center" />
      <Header />
      <div className={styles.container}>
        <div className={styles.container_title_box}>
          <h4 className={styles.container_title}>Title</h4>
          <ContentEditable
            className={styles.container_text_title}
            html={text_title.current}
            onChange={(e) => {
              text_title.current = e.target.value;
            }}
            onBlur={(e) => {
              console.log(typeof text_title.current);
              console.log(text_title.current);
            }}
            placeholder="Enter Title Here"
          />
        </div>
        <div className={styles.container_title_box}>
          <h4 className={styles.container_title}>Description</h4>
          <ContentEditable
            className={styles.container_text_title}
            html={text_description.current}
            onChange={(e) => {
              text_description.current = e.target.value;
            }}
            onBlur={(e) => {
              console.log(text_description);
            }}
            placeholder="Enter Description Here"
          />
        </div>
        <div className={styles.container_title_box}>
          <h4 className={styles.container_title}>Tags</h4>
          <ContentEditable
            className={styles.container_text_title}
            html={text_tags.current}
            onChange={(e) => {
              text_tags.current = e.target.value;
            }}
            placeholder="Tags must be Seperated by Commas"
          />
        </div>
        <div>
          <h4 className={styles.container_title}>Body</h4>
          <Editor
            editorState={editorState}
            onEditorStateChange={onEditorStateChange}
            toolbarClassName={styles.container_toolbar}
            editorClassName={styles.container_editor}
            toolbar={{
              link: { inDropdown: true },
              image: {
                uploadCallback: uploadImageCallBack,
                alt: { present: true, mandatory: false },
              },
            }}
          />
        </div>
        <button onClick={HandleBlogSubmit}>Save Here</button>
      </div>
    </div>
  );
}
