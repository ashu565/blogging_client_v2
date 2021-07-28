import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Header from "../Components/header";
import styles from "./premium.module.scss";
import api from "../Components/api/api";
export default function premium() {
  const [render, setRender] = useState(false);
  const [user, setUser] = useState({});
  const router = useRouter();
  useEffect(async () => {
    setRender(true);
    const config = {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    };
    const data = await api.get("/api/v1/auth/getuser", config);
    const user = { ...data.data.data.user };
    setUser(user);
  }, []);
  if (render) {
    if (!localStorage.getItem("token")) {
      router.push("/accounts/login");
    }
  }
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const displayRazorpay = async () => {
    const response = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!response) {
      toast.error("RazorPay Failed to Load ! Are u online ?");
      return;
    }
    const config = {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    };
    const res = await api.post("/api/v1/premium/razorpay", {}, config);
    const options = {
      key: "rzp_test_rlTMKT4q3pPLQJ", // This is Test Mode API_KEY
      amount: res.data.amount,
      currency: res.data.currency,
      name: "Blogger's World",
      description:
        "Did you get bored on watching free Blog ! Time to Become Premium Now",
      image: "/blog4.png",
      order_id: res.data.id, // This Comes from the Backend
      handler: async function (response) {
        // alert(response.razorpay_payment_id);
        // alert(response.razorpay_order_id);
        // alert(response.razorpay_signature);
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
          response;
        toast.success("Payment Sucessfull ! Thanks for Subcribing");
        const data = await api.patch(
          "/api/v1/auth/updateMe",
          {
            premium: true,
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
          },
          config
        );
        router.reload(window.location.pathname);
      },
      prefill: {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
      },
      theme: {
        color: "#3399cc",
      },
    };
    const paymentObject = new Razorpay(options);
    paymentObject.open();
  };

  return render ? (
    <>
      <Toaster position="top-center" />
      <Header />
      <div className={styles.container}>
        <div className={styles.payment_card}>
          <h2 className={styles.payment_card_title}>
            Please Read the Details Before purchasing
          </h2>
          <p className={styles.payment_card_description}>
            Once Paid Money Cannot be refunded
          </p>
          <p className={styles.payment_card_description}>
            You Can Read all the Premium Blogs
          </p>
          <p className={styles.payment_card_description}>
            You Can Write Premium Blogs from Now
          </p>
          <p className={styles.payment_card_description}>
            You Can be one of our admin if you are lucky
          </p>
          {user.premium === false ? (
            <button onClick={displayRazorpay}>Pay Rs 500</button>
          ) : (
            <button>You are already a premium member</button>
          )}
        </div>
      </div>
    </>
  ) : null;
}
