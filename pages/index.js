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
  const tag_count = await api.get("/api/v1/blog/getAllTags");
  const tag_values = tag_count.data.tag_values_object;
  const data = res.data.document;
  return {
    props: {
      blogs: data,
      tags: tag_values,
    },
    revalidate: 1,
  };
};
export default function Home({ blogs, tags }) {
  const [searchTag, setSearchTag] = useState([]);
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
  const present = (key_tag) => {
    const index = searchTag.includes(key_tag);
    return index;
  };
  const HandleTagSearch = async (e) => {
    let filtered_array = [];
    if (present(e.target.dataset.tag)) {
      const duplicate = [...searchTag];
      filtered_array = duplicate.filter((tag) => {
        return tag !== e.target.dataset.tag;
      });
    } else {
      filtered_array = [...searchTag];
      filtered_array.push(e.target.dataset.tag);
    }
    const document = await api.post("/api/v1/blog/getTaggedBlogs", {
      tags: filtered_array,
    });
    setSearchTag(filtered_array);
    if (filtered_array.length === 0) {
      setFilteredBlogs(blogs);
    } else {
      setFilteredBlogs(document.data.document);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.Blog}>
        <h1 className={styles.Blog_Heading}>Blogger's World</h1>
        <div className={styles.Blog_Search}>
          <h4>Search</h4>
          <input
            onChange={OptimisedHandleSearch}
            autoComplete="off"
            className={styles.Blog_Search_Box}
          />
        </div>
        <Tags
          HandleTagSearch={HandleTagSearch}
          tags={tags}
          className={styles.Blog_Tags}
          searchTag={searchTag}
        />
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
