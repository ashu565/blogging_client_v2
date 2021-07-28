import { useState, useEffect } from "react";
import AccordianCard from "./accordian-card";
import styles from "./accordian.module.scss";
export default function Accordian() {
  const [question, setQuestion] = useState([]);
  const [answer, setAnswer] = useState([]);
  const [order, setOrder] = useState([]);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const arr = [];
    arr.push("What exactly is Blogger World ?");
    arr.push("How do I take premium subcription ?");
    arr.push("How can I benefit from Blogger's World ?");
    arr.push("How can I write Blog ?");
    arr.push("How can I read Premium Blogs ?");
    arr.push(
      "What should I do if my money gets deducted and yet I don't get a premium subsciption ?"
    );
    setQuestion(arr);
    const arr2 = [];
    arr2.push(
      "Blogger World is a platform where user can write Blogs and can read blogs from various topics around the world !"
    );
    arr2.push(
      "You can see the premium button on the top of the website ! Just Click it and pay 500 and become premium and can able to read and wirte all the premium blogs !"
    );
    arr2.push(
      "You can make notes of the topic you don't know and can gain as much as knowledge you can from the blogger's world ! Keep writing the blogs and improve your skills !"
    );
    arr2.push(
      "Just go to your profile page and there you can see write a blog option to the left and by clicking there you can login to the admin and can write your blog !"
    );
    arr2.push(
      "To Read Premium Blogs All you have to do is to take premium subsription and the rest is explained in problem 2 ! Go and check that answer out !"
    );
    arr2.push(
      "If your money gets deducted and you can't see yourself premium just email your query at bloggerworld@gmail.com ! Thanks for visiting !"
    );
    setAnswer(arr2);
    let order = [];
    for (let i = 0; i < arr2.length; i++) {
      order.push(i);
    }
    setOrder(order);
  }, []);
  const HandleAccordian = (e) => {
    if (e.target.dataset.index) {
      const index = e.target.dataset.index;
      if (active !== index) {
        setActive(e.target.dataset.index);
      } else {
        setActive(-1);
      }
    } else {
      console.log("Never Possible");
    }
  };
  return (
    <div className={styles.accordian}>
      {order.map((index) => {
        return (
          <AccordianCard
            key={index}
            index={index}
            Question={question[index]}
            Answer={answer[index]}
            HandleAccordian={HandleAccordian}
            Active={active}
          />
        );
      })}
    </div>
  );
}
