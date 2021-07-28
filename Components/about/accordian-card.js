import styles from "./accordian.module.scss";
export default function AccordianCard({
  Active,
  HandleAccordian,
  index,
  Question,
  Answer,
}) {
  const check = () => {
    if (parseInt(Active) === parseInt(index)) {
      return true;
    } else {
      return false;
    }
  };
  return (
    <div
      data-index={index}
      onClick={HandleAccordian}
      className={styles.accordian_card}
    >
      <h4 data-index={index} className={styles.accordian_card_title}>
        {Question}
      </h4>
      <p
        data-index={index}
        className={`${styles.accordian_card_paragraph} ${
          check() === true ? styles.show : styles.not_show
        }`}
      >
        {Answer}
      </p>
    </div>
  );
}
