import styles from "./footer.module.scss";
import Link from "next/link";
export default function footer() {
  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.footer_left}>
          <div className={styles.footer_left_copyright}>
            Copyright © 2021 Blogger's World
          </div>
          <p>Help Center</p>
          <Link href="/aboutus">
            <p>About Us</p>
          </Link>
          <p>Terms and condition</p>
          <Link href="/premium">
            <p>Go Premium</p>
          </Link>
          <p>Privacy Policy</p>
        </div>
        <div className={styles.footer_right}>
          <img src="/india.png" alt="India"></img>
          <p>India</p>
        </div>
      </footer>
    </>
  );
}
