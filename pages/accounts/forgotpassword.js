import styles from "./forgotpassword.module.scss";
import { useState } from "react";
import api from "../../Components/api/api";
import toast, { Toaster } from "react-hot-toast";

export default function login() {
  const [email, setEmail] = useState("");

  const HandlerSubmit = async (e) => {
    const myPromise = api.post("/api/v1/auth/forgotPassword", {
      email,
    });
    toast.promise(myPromise, {
      loading: `Sending...`,
      success: (res) => {
        return `Password Reset Link Sent Successfully to your Email Valid only for 10 minutes`;
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
          <h5 className={styles.login_form_title}>
            ENTER EMAIL OF YOUR ACCOUNT!
          </h5>
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
          <button
            onClick={HandlerSubmit}
            className={styles.login_btn}
            data-no-border="true"
          >
            Forgot Password
          </button>
        </div>
      </div>
    </div>
  );
}
