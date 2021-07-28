import styles from "./tags.module.scss";
import { useState } from "react";
export default function tags() {
  const [tags, setTags] = useState({
    Javascript: 13,
    Css: 14,
    React: 15,
    "Technical Discussion": 5,
    "Node Js": 9,
    Express: 2,
    "Non Techncical Disscussion": 8,
    "Mongo DB": 5,
    Fiction: 154,
    "Technical Support": 1024,
  });
  const tagsRender = () => {
    return Object.keys(tags).map((tag) => {
      return (
        <div key={tag} className={styles.tags_data}>
          <h4 className={styles.tags_data_tag}>{tag}</h4>
          <h4 className={styles.tags_data_length}>{tags[tag]}</h4>
        </div>
      );
    });
  };
  return (
    <>
      <div className={styles.tags}>{tagsRender()}</div>
    </>
  );
}
