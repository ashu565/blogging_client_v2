import { useState } from "react";
import Modal from "../../Components/Modal";
import api from "../../Components/api/api";
import toast, { Toaster } from "react-hot-toast";
import styles from "./signup.module.scss";
import { useRouter } from "next/router";

export default function signUp() {
  const router = useRouter();
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState("");

  const HandlerSubmit = () => {
    // Post data using axios
    const myPromise = api.post("/api/v1/auth/signup", {
      first_name,
      last_name,
      email,
      password,
      passwordConfirm,
    });

    toast.promise(
      myPromise,
      {
        loading: "Sending...",
        success: (res) => {
          const { token } = res.data.data;
          localStorage.setItem("token", token);
          router.push("/");
          return "success";
        },
        error: (err) => {
          return `${err.response.data.message}`;
        },
      },
      {
        style: {
          fontSize: "16px",
        },
      }
    );
  };

  return (
    <div className={styles.container}>
      <Toaster position="top-center" />
      <div className={styles.signup}>
        {/* <img className={styles.signup_logo} src="/blog4.png" alt="Blogger" /> */}
        <div className={styles.signup_form}>
          <h5 className={styles.signup_form_title}>Create your account!</h5>
          <label className={styles.signup_form_input}>
            <input
              className={styles.signup_form_input_data}
              onChange={(e) => setFirst_name(e.target.value)}
              autoCapitalize="off"
              autoComplete="off"
              spellCheck="false"
              placeholder="First Name"
              name="first_name"
            />
          </label>
          <label className={styles.signup_form_input}>
            <input
              className={styles.signup_form_input_data}
              autoCapitalize="off"
              autoComplete="off"
              spellCheck="false"
              placeholder="Last Name"
              name="last_name"
              onChange={(e) => setLast_name(e.target.value)}
            />
          </label>
          <label className={styles.signup_form_input}>
            <input
              className={styles.signup_form_input_data}
              autoCapitalize="off"
              autoComplete="off"
              spellCheck="false"
              placeholder="Password"
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <label className={styles.signup_form_input}>
            <input
              className={styles.signup_form_input_data}
              autoCapitalize="off"
              autoComplete="off"
              spellCheck="false"
              placeholder="Confirm Password"
              type="password"
              name="passwordConfirm"
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </label>
          <label className={styles.signup_form_input}>
            <input
              className={styles.signup_form_input_data}
              autoCapitalize="off"
              autoComplete="off"
              spellCheck="false"
              placeholder="Email-address"
              type="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <button
            className={styles.signup_form_btn}
            data-no-border="true"
            onClick={HandlerSubmit}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
