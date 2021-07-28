import styles from "./resetpassword.module.scss";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import api from "../../Components/api/api";
import Link from "next/link";
export default function resetpassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmNewPassword] = useState("");
  const router = useRouter();
  const HandleResetPassword = async () => {
    const { resetpassword } = router.query;
    const myPromise = api.patch(`/api/v1/auth/resetPassword/${resetpassword}`, {
      password,
      passwordConfirm: confirmPassword,
    });
    toast.promise(myPromise, {
      loading: `Sending..`,
      success: (res) => {
        router.push("/accounts/login");
        return `Password Changed Successfully`;
      },
      error: (err) => {
        return `Link Expired or You Cannot Change password twice with one Link`;
      },
    });
  };
  return (
    <div className={styles.container}>
      <Toaster position="top-center" />
      <div className={styles.login}>
        <div className={styles.login_form}>
          <h5 className={styles.login_form_title}>
            PLEASE RESET YOUR PASSWORD!
          </h5>
          <span className={styles.login_form_input}>
            <input
              className={styles.login_form_input_data}
              autoCapitalize="off"
              spellCheck="false"
              placeholder="Enter New Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </span>
          <span className={styles.login_form_input}>
            <input
              className={styles.login_form_input_data}
              autoCapitalize="off"
              spellCheck="false"
              placeholder="Confirm Your New Password"
              type="password"
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </span>
          <button
            onClick={HandleResetPassword}
            className={styles.login_btn}
            data-no-border="true"
          >
            Reset Password
          </button>
        </div>
        <div className={styles.login_options}>
          <Link href="/accounts/login">
            <span className={styles.login_options_forgotPassword}>SIGN IN</span>
          </Link>
          <Link href="/accounts/signup">
            <span className={styles.login_options_signup}>Sign Up</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
