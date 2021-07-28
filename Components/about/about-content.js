import styles from "./content.module.scss";

export default function ({ Heading, Content1, Content2 }) {
  return (
    <>
      <div className={styles.content}>
        <h4 className={styles.head}>{Heading}</h4>
        <p className={styles.Content1}>{Content1}</p>
        <p className={styles.Content2}>{Content2}</p>
      </div>
    </>
  );
}
