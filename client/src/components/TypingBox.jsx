import React, { useEffect, useRef, useState } from "react";
import { generate } from "random-words";

const TypingBox = () => {
  const [gameTime, setGameTime] = useState(15);
  const [wpm, setWpm] = useState(0);
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [wordsArray] = useState(() => {
    return generate(200);
  });

  const addClass = (el, name) => {
    el.className += " " + name;
  };
  const removeClass = (el, name) => {
    el.className = el.className.replace(name, " ");
  };

  useEffect(() => {
    window.timer = null;
    window.gameStart = null;
    const divElement = divRef.current;

    // game over function
    const gameOver = () => {
      clearInterval(window.timer);
      addClass(document.getElementById("game"), "over");
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

          if (sLeft <= 0) {
            gameOver();
            return;
          }

          setGameTime(sLeft);
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
          removeClass(currentWord, "current");
          addClass(currentWord.previousSibling, "current");
          removeClass(currentLetter, "current");
          addClass(currentWord.previousSibling.lastChild, "current");
          removeClass(currentWord.previousSibling.lastChild, "incorrect");
          removeClass(currentWord.previousSibling.lastChild, "correct");
        }
        if (currentLetter && !isFirstLetter) {
          removeClass(currentLetter, "current");
          addClass(currentLetter.previousSibling, "current");
          removeClass(currentLetter.previousSibling, "incorrect");
          removeClass(currentLetter.previousSibling, "correct");
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
      className="flex gap-10 flex-col items-center relative"
      style={{ outline: "none" }}
    >
      {!isFocused && (
        <div className="text-black text-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          Click here to focus
        </div>
      )}
      <div id="cursor"></div>
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
      <div className="text-[#F5B1CC] flex w-full justify-between">
        <h1 className="text-6xl">{gameTime}</h1>
        <h1 className="text-6xl">wpm:{wpm}</h1>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#F5B1CC] text-white px-6 py-2 text-2xl"
        >
          Restart
        </button>
      </div>
    </div>
  );
};

export default TypingBox;
