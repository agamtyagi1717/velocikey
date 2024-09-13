import React, { useEffect, useRef, useState } from "react";
import { generate } from "random-words";
import { useAuth0 } from "@auth0/auth0-react";
import Confetti from "react-confetti";
import Modal from "./Modal";

const TypingBox = () => {
  const [gameTime, setGameTime] = useState(15);
  const [highscore, setHighScore] = useState("requires sign up");
  const [wpm, setWpm] = useState(0);
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [wordsArray] = useState(() => {
    return generate(200);
  });
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { user } = useAuth0();

  const addClass = (el, name) => {
    el.className += " " + name;
  };
  const removeClass = (el, name) => {
    el.className = el.className.replace(name, " ");
  };

  const getHighScore = async () => {
    if (!user) return;

    const username = user.nickname;
    // console.log(user);
    // http://localhost:8000 :: localhost server
    // https://velocikeys.onrender.com :: production server

    const response = await fetch("https://velocikeys.onrender.com/highscore", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    const data = await response.json();
    setHighScore(data.highScore);
  };

  const submitScore = async (result) => {
    if (user && !scoreSubmitted) {
      if (result > highscore) {
        // Confetti run
        setShowConfetti(true);
      }

      const username = user.nickname;
      // console.log(username);
      await fetch("https://velocikeys.onrender.com/submit-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, score: result }),
      });

      setScoreSubmitted(true);
    }
  };
  useEffect(() => {
    getHighScore();
  });

  useEffect(() => {
    if (user && gameTime <= 0 && !scoreSubmitted) {
      submitScore(wpm);
    }
  }, [gameTime, user, wpm, scoreSubmitted]);

  useEffect(() => {
    window.timer = null;
    window.gameStart = null;
    const divElement = divRef.current;

    // game over function
    const gameOver = () => {
      clearInterval(window.timer);
      addClass(document.getElementById("game"), "over");
      setIsModalOpen(true);
    };

    // result logic
    const getWPM = () => {
      const words = [...document.querySelectorAll(".word")];
      const lastWord = document.querySelector(".word.current");
      const lastIndex = words.indexOf(lastWord);
      const total = words.slice(0, lastIndex);

      const correct = total.filter((word) => {
        const letters = [...word.children];
        const wrong = letters.filter((letter) =>
          letter.className.includes("incorrect")
        );
        const right = letters.filter((letter) =>
          letter.className.includes("correct")
        );

        return wrong.length === 0 && right.length === letters.length;
      });

      return correct.length * 4;
    };

    // Logic for the typing functionality
    const handleKeyDown = (event) => {
      const keyPressed = event.key;

      const currentWord = document.querySelector(".word.current");
      const currentLetter = document.querySelector(".letter.current");
      const expected = currentLetter?.innerHTML || " ";
      const isLetter = keyPressed.length === 1 && keyPressed !== " ";
      const isSpace = keyPressed === " ";
      const isBackspace = keyPressed === "Backspace";
      const isFirstLetter = currentLetter === currentWord.firstChild;
      const isFirstWord =
        currentWord === document.getElementById("words").firstChild;

      if (document.getElementById("game").classList.contains("over")) {
        return;
      }

      const result = getWPM();
      setWpm(result);

      console.log({ keyPressed, expected });

      if (!window.timer && isLetter) {
        window.timer = setInterval(() => {
          if (!window.gameStart) {
            window.gameStart = new Date().getTime();
          }
          const currentTime = new Date().getTime();
          const msPassed = currentTime - window.gameStart;
          const sPassed = Math.round(msPassed / 1000);
          const sLeft = gameTime - sPassed;
          setGameTime(sLeft);

          if (sLeft <= 0) {
            gameOver();
            return;
          }
        }, 1000);
      }

      if (isLetter) {
        if (currentLetter) {
          addClass(
            currentLetter,
            keyPressed === expected ? "correct" : "incorrect"
          );
          removeClass(currentLetter, "current");
          if (currentLetter.nextSibling) {
            addClass(currentLetter.nextSibling, "current");
          }
        } else {
          const incorrectLetter = document.createElement("span");
          incorrectLetter.innerHTML = keyPressed;
          incorrectLetter.className = "letter incorrect extra";
          currentWord.appendChild(incorrectLetter);
        }
      }
      if (isSpace) {
        if (expected !== " ") {
          const lettersToInvalidate = [
            ...document.querySelectorAll(".word.current .letter:not(.correct)"),
          ];

          lettersToInvalidate.forEach((letter) => {
            addClass(letter, "incorrect");
          });
        }
        removeClass(currentWord, "current");
        addClass(currentWord.nextSibling, "current");

        if (currentLetter) {
          removeClass(currentLetter, "current");
        }
        addClass(currentWord.nextSibling.firstChild, "current");
      }
      if (isBackspace) {
        if (currentLetter && isFirstLetter) {
          if (isFirstWord) {
            return;
          }

          removeClass(currentWord, "current");
          addClass(currentWord.previousSibling, "current");
          removeClass(currentLetter, "current");
          addClass(currentWord.previousSibling.lastChild, "current");
          removeClass(currentWord.previousSibling.lastChild, "incorrect");
          removeClass(currentWord.previousSibling.lastChild, "correct");
        }
        if (currentLetter && !isFirstLetter) {
          const isExtraLetter = currentLetter.classList.contains("extra");

          removeClass(currentLetter, "current");
          addClass(currentLetter.previousSibling, "current");
          removeClass(currentLetter.previousSibling, "incorrect");
          removeClass(currentLetter.previousSibling, "correct");
          if (isExtraLetter) {
            currentLetter.remove();
          }
        }
        if (!currentLetter) {
          addClass(currentWord.lastChild, "current");
          removeClass(currentWord.lastChild, "incorrect");
          removeClass(currentWord.lastChild, "correct");
        }
      }

      // scrolling logic

      if (currentWord.getBoundingClientRect().top > 220) {
        const words = document.getElementById("words");
        const margin = parseInt(words.style.marginTop || "0px");
        words.style.marginTop = margin - 70 + "px";
      }

      // cursor logic

      const nextLetter = document.querySelector(".letter.current");
      const nextWord = document.querySelector(".word.current");
      const cursor = document.getElementById("cursor");

      if (nextLetter) {
        cursor.style.top = nextLetter.getBoundingClientRect().top + 2 + "px";
        cursor.style.left = nextLetter.getBoundingClientRect().left + "px";
      } else {
        cursor.style.top = nextWord.getBoundingClientRect().top + 10 + "px";
        cursor.style.left = nextWord.getBoundingClientRect().right - 20 + "px";
      }
    };

    if (divElement) {
      divElement.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      if (divElement) {
        divElement.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [isFocused]);

  return (
    <div
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      tabIndex={0}
      ref={divRef}
      id="game"
      className="flex gap-10 flex-col items-center relative overflow-hidden"
      style={{ outline: "none" }}
    >
      {!isFocused && (
        <div className="text-black text-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          Click here to focus
        </div>
      )}
      <div id="cursor"></div>
      <Confetti
        run={showConfetti}
        recycle={false}
        className="fixed top-0 left-14"
      />

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="flex flex-col gap-10">
          <h2>Test over!</h2>
          <h2>WPM: {wpm}</h2>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#F0A45D] text-white px-6 py-2 text-2xl"
          >
            Restart
          </button>
        </div>
      </Modal>

      {/* confetti animation that runs whenever use beats prev highscore  */}
      <div
        className={`min-w-80 wordsContainer font-thin m-12 h-[330px] overflow-hidden ${
          isFocused ? "blur-none" : "blur-sm"
        }`}
      >
        <div id="words" className="flex flex-wrap">
          {wordsArray.map((word, wordIndex) => (
            <span
              key={wordIndex}
              className={`word pr-5 pb-5 ${wordIndex === 0 ? "current" : ""}`}
            >
              {word.split("").map((char, charIndex) => (
                <span
                  key={charIndex}
                  className={`letter ${
                    wordIndex === 0 && charIndex === 0 ? "current" : ""
                  }`}
                >
                  {char}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
      <div className="border bg-[#F0A45D] bg-opacity-10 px-5 py-2 rounded-lg text-[#F0A45D] flex flex-col md:flex-row items-center w-full justify-between">
        <h1 className="text-6xl">{gameTime}</h1>
        <h1 className="">wpm:{wpm}</h1>
        <h1>High-score: {highscore}</h1>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#F0A45D] text-white px-6 py-2 text-2xl"
        >
          Restart
        </button>
      </div>
    </div>
  );
};

export default TypingBox;
