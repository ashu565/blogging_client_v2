import { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import LOGOUT from "@material-ui/icons/ExitToAppOutlined";
import styles from "./header.module.scss";
import api from "./api/api";
import Link from "next/link";
import { useRouter } from "next/router";
import slugify from 'react-slugify';


export default function Header() {
  const router = useRouter();
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState({});
  useEffect(async () => {
    try {
      const config = {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      };
      const data = await api.get("/api/v1/auth/getuser", config);
      const user = { ...data.data.data.user };
      setUser(user);
      setLogin(true);
    } catch (err) {
      setUser({});
      setLogin(false);
    }
  }, [login]);

  const HandleProfileClick = () => {
    const slug = slugify(user.first_name);
    router.push(`/profile/${slug}`);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.header_left}>
          <img src="/blog4.png" alt="Blogging World"></img>
          <Link href="/">
            <a>Home</a>
          </Link>
          <Link href="/aboutus">
            <a>About Us</a>
          </Link>
          <Link href="/premium">
            <a>Premium Membership</a>
          </Link>
          <Link href="/my-text-editor">
            <a>Write a Blog</a>
          </Link>
        </div>
        {login === false ? (
          <div className={styles.header_right}>
            <Link href="/accounts/signup">
              <p className={styles.header_right_signup}>Sign Up</p>
            </Link>
            <p className={styles.header_right_or}>or</p>
            <Link href="/accounts/login">
              <p className={styles.header_right_signin}>Sign In</p>
            </Link>
          </div>
        ) : (
          <div className={styles.header_right}>
            <Link href="/premium">
              {user.premium === false ? (
                <button className={styles.header_right_button}>Premium</button>
              ) : (
                <button
                  className={`
                    ${styles.header_right_button} ${styles.header_right_button_paid}`}
                >
                  Premium
                </button>
              )}
            </Link>
            <div
              onClick={HandleProfileClick}
              className={styles.header_right_login}
            >
              <Avatar src={user.avatar || "/avatar.jpg"} />
              <p>{user.first_name}</p>
            </div>
            <div
              onClick={() => {
                setLogin(false);
                localStorage.removeItem("token");
                router.push("/accounts/login");
              }}
              className={styles.header_right_LOGOUT}
            >
              <LOGOUT color="inherit" />
              <button className={styles.header_right_LOGOUT_button}>
                LOGOUT
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
