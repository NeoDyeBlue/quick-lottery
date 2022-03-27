import Head from "next/head";
import styles from "../styles/Home.module.scss";
import Popup from "../components/Popup";
import { useState, useEffect } from "react";

let socket = null;

export async function getServerSideProps(context) {
  const { req } = context;

  return {
    props: {
      url: req.headers.host,
    },
  };
}

export default function Home({ url }) {
  const [bet, setBet] = useState({
    firstNum: "0",
    secondNum: "0",
    thirdNum: "0",
  });
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [socketData, setSocketData] = useState({
    timer: 0,
    results: [0, 0, 0],
    winnerCount: 0,
  });
  const [isSubmitted, setSubmitted] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isWin, setIsWin] = useState(false);

  useEffect(() => socketHandler(), []);
  useEffect(() => {
    if (socketData.timer == 10) {
      handleTimerEnd();
    }
  }, [socketData.timer]);

  async function socketHandler() {
    // await fetch("/api/socket");
    socket = new WebSocket((url = `ws://${url}`));
    socket.addEventListener("message", function (event) {
      //   console.log(JSON.parse(event.data));
      setSocketData(JSON.parse(event.data));
    });
  }

  function handleTimerEnd() {
    if (isSubmitted) {
      let betArray = [bet.firstNum, bet.secondNum, bet.thirdNum];
      console.log("bet", betArray);
      console.log("res", socketData.results);
      if (
        betArray.length === socketData.results.length &&
        betArray.every((value, index) => value === socketData.results[index])
      ) {
        setIsWin(true);
      } else {
        setIsWin(false);
      }
      popupHandler();
    }
    setSubmitted(false);
  }

  function popupHandler() {
    setIsPopupOpen((open) => !open);
  }

  function betInputHandler(event) {
    event.preventDefault();
    const { name } = event.target;

    // const newValue = value >= 0 && value <= 9 ? value : bet[name];
    const newValue = /[0-9]/.test(event.nativeEvent.data)
      ? event.nativeEvent.data
      : bet[name];

    setBet((prevBet) => ({
      ...prevBet,
      [name]: newValue,
    }));
  }

  function betSubmitHandler(event) {
    event.preventDefault();
    let isDuplicate =
      bet.firstNum == bet.secondNum ||
      bet.firstNum == bet.thirdNum ||
      bet.secondNum == bet.firstNum ||
      bet.secondNum == bet.thirdNum ||
      bet.thirdNum == bet.firstNum ||
      bet.thirdNum == bet.secondNum;

    setIsDuplicate(isDuplicate);

    if (!isDuplicate) {
      setSubmitted(true);
      socket.send(JSON.stringify([bet.firstNum, bet.secondNum, bet.thirdNum]));
    }
  }

  return (
    <div className={styles["l-container"]}>
      <Head>
        <title>QuickLottery</title>Will
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles["l-container__game"]}>
        <div className={styles["c-game"]}>
          {isPopupOpen && (
            <Popup
              message={isWin ? "You win!" : "Try again"}
              clickHandler={popupHandler}
            />
          )}
          <div className={styles["c-game__header-wrap"]}>
            <h1 className={styles["c-game__name"]}>
              <span className={styles["c-game__name-char"]}>Q</span>
              <span className={styles["c-game__name-char"]}>u</span>
              <span className={styles["c-game__name-char"]}>i</span>
              <span className={styles["c-game__name-char"]}>c</span>
              <span className={styles["c-game__name-char"]}>k</span>
              <span className={styles["c-game__name-char"]}>L</span>
              <span className={styles["c-game__name-char"]}>o</span>
              <span className={styles["c-game__name-char"]}>t</span>
              <span className={styles["c-game__name-char"]}>t</span>
              <span className={styles["c-game__name-char"]}>e</span>
              <span className={styles["c-game__name-char"]}>r</span>
              <span className={styles["c-game__name-char"]}>y</span>
            </h1>
          </div>
          <div className={styles["c-game__result-wrap"]}>
            <p className={styles["c-game__winners"]}>
              Winners{" "}
              <span className={styles["c-game__winners-count"]}>
                {socketData.winnerCount}
              </span>
            </p>
            <ul className={styles["c-game__result-list"]}>
              <li className={styles["c-game__result-item"]}>
                <p>{socketData.results[0]}</p>
              </li>
              <li className={styles["c-game__result-item"]}>
                <p>{socketData.results[1]}</p>
              </li>
              <li className={styles["c-game__result-item"]}>
                <p>{socketData.results[2]}</p>
              </li>
            </ul>
            <p className={styles["c-game__timer"]}>
              New result in{" "}
              <span className={styles["c-game__timer-count"]}>
                {socketData.timer}
              </span>
            </p>
          </div>
          <form onSubmit={betSubmitHandler} className={styles["c-game__form"]}>
            {!isSubmitted && (
              <p
                className={`${styles["c-game__text"]} ${
                  styles["c-game__text--margin-bottom"]
                } ${isDuplicate ? styles["c-game__text--margin-bottom"] : ""}`}
              >
                {isDuplicate
                  ? "No duplicate numbers!"
                  : "Input your numbers (0 - 9)"}
              </p>
            )}
            {isSubmitted && (
              <p
                className={`${styles["c-game__text"]} ${styles["c-game__text--margin-bottom"]}`}
              >
                . . .
              </p>
            )}
            <div className={styles["c-game__inputs-wrap"]}>
              <input
                className={styles["c-game__input"]}
                type="number"
                name="firstNum"
                min="0"
                max="9"
                size="1"
                readOnly={isSubmitted}
                value={bet.firstNum}
                // onKeyDown={betInputHandler}
                onInput={betInputHandler}
              />
              <input
                className={styles["c-game__input"]}
                type="number"
                name="secondNum"
                min="0"
                max="9"
                size="1"
                value={bet.secondNum}
                // onKeyDown={betInputHandler}
                readOnly={isSubmitted}
                onInput={betInputHandler}
              />
              <input
                className={styles["c-game__input"]}
                type="number"
                name="thirdNum"
                min="0"
                max="9"
                size="1"
                readOnly={isSubmitted}
                value={bet.thirdNum}
                // onKeyDown={betInputHandler}
                onInput={betInputHandler}
              />
            </div>
            <button
              className={`${styles["c-game__button"]} ${
                isSubmitted ? styles["c-game__button--submitted"] : ""
              }`}
              type="submit"
            >
              Submit
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
