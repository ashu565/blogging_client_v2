import styles from "./login.module.scss";
import Link from "next/link";
import { useState } from "react";
import api from "../../Components/api/api";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";

export default function login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const HandlerSubmit = (e) => {
    const myPromise = api.post("/api/v1/auth/login", {
      email,
      password,
    });
    toast.promise(myPromise, {
      loading: "Loading...",
      success: (res) => {
        const { token } = res.data.data;
        localStorage.setItem("token", token);
        router.push("/");
        return "success";
      },
      error: (err) => {
        return `${err.response.data.message}`;
      },
    });
  };

  return (
    <div className={styles.container}>
      <Toaster position="top-center" />
      <div className={styles.login}>
        <div className={styles.login_form}>
          <h5 className={styles.login_form_title}>LOG INTO YOUR ACCOUNT!</h5>
          <span className={styles.login_form_input}>
            <input
              className={styles.login_form_input_data}
              autoCapitalize="off"
              spellCheck="false"
              placeholder="Email-address"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </span>
          <span className={styles.login_form_input}>
            <input
              className={styles.login_form_input_data}
              autoCapitalize="off"
              spellCheck="false"
              placeholder="Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </span>
          <button
            onClick={HandlerSubmit}
            className={styles.login_btn}
            data-no-border="true"
          >
            Sign In
          </button>
        </div>
        <div className={styles.login_options}>
          <Link href="/accounts/forgotpassword">
            <span className={styles.login_options_forgotPassword}>
              Forgot Password?
            </span>
          </Link>
          <Link href="/accounts/signup">
            <span className={styles.login_options_signup}>Sign Up</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
