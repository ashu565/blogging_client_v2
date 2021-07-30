import styles from "./blogs.module.scss";
import Link from "next/link";

export default function blog({ blogs }) {
  // console.log(blogs);
  const HandleDate = (date) => {
    const dates = date.split("T");
    const dat = dates[0].toString();
    const DATE = dat.split("-");
    // yyyy-mm-dd
    let actual_date_in_string_format = "";
    const months = [
      "",
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    actual_date_in_string_format =
      months[parseInt(DATE[1])] + " " + DATE[2] + ", " + DATE[0];
    return actual_date_in_string_format;
  };

  const HandleTags = (tags) => {
    return tags.map((tag) => {
      return <span className={styles.blog_card_tag}>{tag}</span>;
    });
  };

  return (
    <>
      {blogs.map((blog) => {
        return (
          <div key={blog._id} className={styles.blog_card}>
            <Link href={"/blog/" + blog._id}>
              <h3 className={styles.blog_card_title}>{blog.title}</h3>
            </Link>
            <span className={styles.blog_card_date}>
              {HandleDate(blog.createdAt)}
            </span>
            <div className={styles.blog_card_tags}>{HandleTags(blog.tags)}</div>
            <p className={styles.blog_card_description}>{blog.description}</p>
          </div>
        );
      })}
    </>
  );
}
