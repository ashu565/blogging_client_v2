import styles from "./index.module.scss";
import Tags from "../Components/tags";
import Blogs from "../Components/blogs";
import Header from "../Components/header";
import api from "../Components/api/api";

export const getStaticProps = async () => {
  // This function Runs Only in Server Side So don't use any keyword like document,localStorage,etc
  const res = await api.get("/api/v1/blog/getAllBlog?sort=-likes,-createdAt");
  const data = res.data.document;
  return {
    props: {
      blogs: data,
    },
    revalidate: 1,
  };
};

export default function Home({ blogs }) {
  return (
    <>
      <Header />
      <div className={styles.Blog}>
        <Blogs className={styles.Blog_Blogs} blogs={blogs} />
      </div>
    </>
  );
}
