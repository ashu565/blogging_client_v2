import styles from "./editor.module.scss";
import ReactDOM from "react-dom";
import React, { Component } from "react";
import Button from "@material-ui/core/Button";

class Editor extends React.Component {
  state = {
    title: "",
    description: "",
    body: [],
  };
  constructor(props) {
    super(props);
    this.editor = null;
  }

  async componentDidMount() {
    this.initEditor();
  }

  initEditor = () => {
    const EditorJS = require("@editorjs/editorjs");
    const Header = require("@editorjs/header");
    const Embed = require("@editorjs/embed");
    const Delimiter = require("@editorjs/delimiter");
    const List = require("@editorjs/list");
    const InlineCode = require("@editorjs/inline-code");
    const Table = require("@editorjs/table");
    const Quote = require("@editorjs/quote");
    const Code = require("@editorjs/code");
    const Marker = require("@editorjs/marker");
    const Checklist = require("@editorjs/checklist");
    const Image = require("@editorjs/image");
    const Paragraph = require("@editorjs/paragraph");
    const LinkTool = require("@editorjs/link");
    const SimpleImage = require("@editorjs/simple-image");

    let content = null;
    if (this.props.data !== undefined) {
      content = this.props.data;
    }

    this.editor = new EditorJS({
      holder: "editorjs",
      logLevel: "ERROR",
      tools: {
        header: Header,
        embed: {
          class: Embed,
          config: {
            services: {
              youtube: true,
              coub: true,
            },
          },
        },
        embed: Embed,
        table: Table,
        paragraph: Paragraph,
        list: List,
        code: Code,
        linkTool: {
          class: LinkTool,
          config: {
            endpoint: "http://localhost:8008/fetchUrl", // Your backend endpoint for url data fetching
          },
        },
        image: {
          class: Image,
          config: {
            endpoints: {
              byFile: "http://localhost:3000/uploadFile",
            },
          },
        },
        header: {
          class: Header,
          config: {
            levels: [1, 2, 3, 4],
            defaultLevel: 2,
          },
        },
        quote: Quote,
        marker: Marker,
        checklist: Checklist,
        delimiter: Delimiter,
        inlineCode: InlineCode,
        simpleImage: SimpleImage,
      },
      data: content,
    });
  };
  async onSave(e) {
    let data = await this.editor.saver.save();
    // this.props.save(data);
    console.log(this.state.title);
    console.log(this.state.description);
    this.state.body = [...data.blocks];
    console.log(this.state.body);
  }

  render() {
    return (
      <div className={styles.editor}>
        <h3>Write Below Your Blog</h3>
        <div className={styles.title}>
          <h4>Title</h4>
          <input
            onChange={(e) => (this.state.title = e.target.value)}
            placeholder="Enter the title here"
          />
        </div>
        <div className={styles.title}>
          <h4>Description</h4>
          <input
            onChange={(e) => (this.state.description = e.target.value)}
            placeholder="Enter the description here"
          />
        </div>
        <h4 className={styles.editor_body}>Body</h4>
        <div
          className={styles.editorjs}
          id={"editorjs"}
          onChange={(e) => this.onChange(e)}
        ></div>
        <Button
          className={styles.editor_SaveBtn}
          style={{
            fontSize: 18,
          }}
          variant="contained"
          color="primary"
          onClick={(e) => this.onSave(e)}
        >
          Save Here
        </Button>
      </div>
    );
  }
}
export default Editor;
