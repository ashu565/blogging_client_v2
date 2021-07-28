import dynamic from "next/dynamic";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import styles from "./my-text-editor.module.scss";
import Header from "../Components/header";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { useState, useEffect } from "react";
import api from "../Components/api/api";

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
  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };
  console.log(convertToRaw(editorState.getCurrentContent()));
  return (
    <>
      <Header />
      <div className={styles.container}>
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
    </>
  );
}
