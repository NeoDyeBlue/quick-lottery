import styles from "./Popup.module.scss";

export default function Popup(props) {
  return (
    <div className={styles["c-popup"]} onClick={props.clickHandler}>
      <div className={styles["c-popup__wrap"]}>
        <div className={styles["c-popup__message-wrap"]}>
          <p className={styles["c-popup__message"]}>{props.message}</p>
          <p className={styles["c-popup__instruction"]}>
            Click or Tap anywhere to close
          </p>
        </div>
      </div>
    </div>
  );
}
