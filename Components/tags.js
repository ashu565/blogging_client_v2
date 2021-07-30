import styles from "./tags.module.scss";
export default function tags({ tags, HandleTagSearch, searchTag }) {
  const tagsRender = () => {
    return Object.keys(tags).map((tag) => {
      return (
        <div
          onClick={HandleTagSearch}
          key={tag}
          className={`${styles.tags_data} ${
            searchTag.includes(tag) ? styles.tags_data_active : styles.tags.data
          }`}
          data-tag={tag}
        >
          <h4 data-tag={tag} className={styles.tags_data_tag}>
            {tag}
          </h4>
          <h4 data-tag={tag} className={styles.tags_data_length}>
            {tags[tag]}
          </h4>
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
