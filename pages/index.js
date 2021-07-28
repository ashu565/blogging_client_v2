import styles from "./index.module.scss";
import Tags from "../Components/tags";
import Blogs from "../Components/blogs";
import Header from "../Components/header";
import api from "../Components/api/api";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

export const getStaticProps = async () => {
  // This function Runs Only in Server Side So don't use any keyword like document,localStorage,etc
  const res = await api.get("/api/v1/blog/getAllBlog");
  const data = res.data.document;
  return {
    props: {
      blogs: data,
    },
    revalidate: 1,
  };
};
export default function Home({ blogs }) {
  const [filteredBlogs, setFilteredBlogs] = useState(blogs);

  const HandleSearch = async (e) => {
    const search = e.target.value;
    if (search === "") {
      setFilteredBlogs(blogs);
      return;
    }
    const res = await api.get(`/api/v1/blog/getSearchedBlog?word=${search}`);
    const filter_blog = res.data.document;
    setFilteredBlogs(filter_blog);
  };

  const debounce = (func) => {
    let timer;
    return function (...args) {
      const context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(context, args);
      }, 500);
    };
  };

  const OptimisedHandleSearch = debounce(HandleSearch);

  return (
    <>
      <Header />
      <div className={styles.Blog}>
        <h1 className={styles.Blog_Heading}>Ashutosh's Blogs</h1>
        <div className={styles.Blog_Search}>
          <h4>Search</h4>
          <input
            onChange={OptimisedHandleSearch}
            autoComplete="off"
            className={styles.Blog_Search_Box}
          />
        </div>
        <Tags className={styles.Blog_Tags} />
        <Link href="/most-liked">
          <button className={styles.Blog_mostLiked}>
            View Most Popular Blogs
          </button>
        </Link>
        {filteredBlogs.length > 0 ? (
          <Blogs className={styles.Blog_Blogs} blogs={filteredBlogs} />
        ) : (
          <h2 className={styles.Blog_NoBlogs}>
            No articles found for search query: Please Write Some Blogs that
            includes these topics
          </h2>
        )}
      </div>
    </>
  );
}
