import SettingIcon from "@material-ui/icons/SettingsOutlined";
import WriteBlogIcon from "@material-ui/icons/CreateOutlined";
import ReadBlogIcon from "@material-ui/icons/AssignmentOutlined";
import styles from "./slug.module.scss";
import { useState, useEffect } from "react";
import api from "../../Components/api/api";
import Header from "../../Components/header";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import FilePond from "../../Components/FilePond/FilePond";
import { useRouter } from "next/router";

export default function Slug() {
  const router = useRouter();
  const [login, setLogin] = useState(true);

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const [profilePhoto, setProfilePhoto] = useState("/avatar.jpg");
  useEffect(async () => {
    const config = {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    };
    try {
      const data = await api.get("api/v1/auth/getuser", config);
      const user = { ...data.data.data.user };
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setEmail(user.email);
      setLogin(true);
      if (user.avatar) {
        setProfilePhoto(user.avatar);
      }
    } catch (err) {
      setLogin(false);
    }
  }, [login]);

  const HandleUserProfileChange = async () => {
    const config = {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    };
    const myPromise = api.patch(
      "/api/v1/auth/updateMe",
      {
        first_name,
        last_name,
        email,
      },
      config
    );
    toast.promise(myPromise, {
      loading: "Updating User Details..",
      success: (res) => {
        router.reload(window.location.pathname);
        return `Updated! Hope you enjoying our features`;
      },
      error: (err) => {
        return `${err.response.data.message}`;
      },
    });
  };

  const HandlePasswordChange = async () => {
    const config = {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    };
    const myPromise = api.patch(
      "/api/v1/auth/updatePassword",
      {
        currentPassword,
        newPassword,
        newPasswordConfirm,
      },
      config
    );
    toast.promise(myPromise, {
      loading: "Updating...",
      success: (res) => {
        return `Password Changed`;
      },
      error: (err) => {
        console.log(err.response);
        return `${err.response.data.message}`;
      },
    });
  };
  const HandleUpload = (messege) => {
    if (messege === "error") {
      toast.error("Server is Busy ! Please Try Again Later");
      return;
    }
    toast.success("Profile Picture Updated ! Hope you are enjoying");
    router.reload(window.location.pathname);
  };
  return login ? (
    <>
      <Header />
      <Toaster position="top-center" />
      <div className={styles.main}>
        <div className={styles.main_container}>
          <div className={styles.main_container_left}>
            <div className={styles.main_container_left_IconsData}>
              <SettingIcon fontSize="small" />
              <p>settings</p>
            </div>
            <div className={styles.main_container_left_IconsData}>
              <WriteBlogIcon fontSize="small" />
              <p>Write a Blog</p>
            </div>
            <div className={styles.main_container_left_IconsData}>
              <ReadBlogIcon fontSize="small" />
              <p>My Blogs</p>
            </div>
          </div>
          {/* Right */}
          <div className={styles.main_container_right}>
            <div className={styles.main_container_right_account}>
              <h4 className={styles.main_container_right_account_title}>
                your account settings
              </h4>
              <label
                htmlFor="name1"
                className={styles.main_container_right_account_label}
              >
                First Name
                <input
                  onChange={(e) => setFirstName(e.target.value)}
                  value={first_name}
                  id="name1"
                  type="text"
                />
              </label>
              <label
                htmlFor="name2"
                className={styles.main_container_right_account_label}
              >
                Last Name
                <input
                  onChange={(e) => setLastName(e.target.value)}
                  value={last_name}
                  id="name2"
                  type="text"
                />
              </label>
              <label
                htmlFor="email"
                className={styles.main_container_right_account_label}
              >
                Email Address
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  id="email"
                  type="email"
                />
              </label>
              <div className={styles.profile_photo}>
                <div className={styles.main_container_right_account_photo}>
                  <img
                    src={profilePhoto}
                    alt="User Profile"
                    className={styles.main_container_right_account_photo_avatar}
                  />
                </div>
                <div className={styles.FilePond}>
                  <FilePond HandleUpload={HandleUpload} />
                </div>
              </div>
              <span>
                <button onClick={HandleUserProfileChange}>Save Settings</button>
              </span>
            </div>
            <div className={styles.main_container_right_password}>
              <h4 className={styles.main_container_right_account_title}>
                password Change
              </h4>
              <label
                htmlFor="password-1"
                className={styles.main_container_right_account_label}
              >
                Current Password
                <input
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  id="password-1"
                  type="password"
                />
              </label>
              <label
                htmlFor="password-2"
                className={styles.main_container_right_account_label}
              >
                New Password
                <input
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  id="password-2"
                  type="password"
                />
              </label>
              <label
                htmlFor="password-3"
                className={styles.main_container_right_account_label}
              >
                Confirm Password
                <input
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                  placeholder="••••••••"
                  id="password-3"
                  type="password"
                />
              </label>
              <span>
                <button onClick={HandlePasswordChange}>Change Password</button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <div>
      <Header />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#f7f7f7",
          padding: "4rem",
          height: "90vh",
        }}
      >
        <h2>Oooops...</h2>
        <h2
          style={{
            marginTop: "1.5rem",
          }}
        >
          You Have Not Signed In
        </h2>
        <Link href="/accounts/login">
          <a
            style={{
              textDecoration: "none",
              marginTop: "1.5rem",
              color: "#000",
            }}
          >
            Click Here to{" "}
            <span>
              <p
                style={{
                  display: "inline",
                  textDecoration: "underline",
                  color: "#4979ff",
                }}
              >
                Login
              </p>
            </span>
          </a>
        </Link>
        <Link href="/accounts/signup">
          <a
            style={{
              textDecoration: "none",
              marginTop: "1.5rem",
              color: "#000",
            }}
          >
            Click Here to{" "}
            <span>
              <p
                style={{
                  display: "inline",
                  textDecoration: "underline",
                  color: "#4979ff",
                }}
              >
                Signup
              </p>
            </span>
          </a>
        </Link>
      </div>
    </div>
  );
}
