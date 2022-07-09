import React, { useState, useEffect } from 'react';
import { data, cardBackImage } from './Data';

export default function Cards() {
  const [images, setImages] = useState([]);
  const [cardsChosen, setCardsChosen] = useState([]);
  const [cardsChosenIds, setCardsChosenIds] = useState([]);
  const [isUser1Turn, setIsUser1Turn] = useState(true);
  const [pointsOfUser1, setPointsOfUser1] = useState(0);
  const [pointsOfUser2, setPointsOfUser2] = useState(0);
  const [openCards, setOpenCards] = useState([]);
  const [winner, setWinner] = useState('');
  const [countdownForResetGame, setCountdownForResetGame] = useState(5);

  let intervalId;

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const createCardBoard = () => {
    const resultData = data.concat(...data);
    const resultSuffled = shuffle(resultData);
    setImages(resultSuffled);
  };

  const flipCard = (image, index) => {
    if (cardsChosenIds?.length === 1 && cardsChosenIds[0] === index) {
      return;
    }
    if (cardsChosen.length < 2) {
      setCardsChosen((cardsChosen) => cardsChosen?.concat(image));
      setCardsChosenIds((cardsChosenIds) => cardsChosenIds?.concat(index));
      if (cardsChosen.length === 1) {
        if (cardsChosen[0] === image) {
          setOpenCards((previousState) =>
            previousState.concat([cardsChosen[0], image])
          );
          if (isUser1Turn) {
            setPointsOfUser1((previousState) => previousState + 1);
          } else {
            setPointsOfUser2((previousState) => previousState + 1);
          }
        } else {
          setTimeout(
            () => setIsUser1Turn((previousState) => !previousState),
            1000
          );
        }
        setTimeout(() => {
          setCardsChosenIds([]);
          setCardsChosen([]);
        }, 1000);
      }
    }
  };

  const isCardChosen = (image, index) => {
    return cardsChosenIds?.includes(index) || openCards?.includes(image);
  };

  const reset = () => {
    setImages([]);
    setCardsChosen([]);
    setCardsChosenIds([]);
    setIsUser1Turn(true);
    setPointsOfUser1(0);
    setPointsOfUser2(0);
    setOpenCards([]);
    setWinner('');
    setCountdownForResetGame(5);
    createCardBoard();
  };

  useEffect(() => {
    createCardBoard();
  }, []);

  useEffect(() => {
    if (openCards.length && openCards.length === images.length) {
      if (pointsOfUser1 > pointsOfUser2) {
        setWinner('Winner is User 1');
      } else {
        setWinner('Winner is User 2');
      }
      intervalId =
        !intervalId &&
        setInterval(() => {
          if (countdownForResetGame > 0) {
            setCountdownForResetGame((previousState) => previousState - 1);
          }
        }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [openCards.length]);

  useEffect(() => {
    if (countdownForResetGame === 0) {
      clearInterval(intervalId);
      reset();
    }
  }, [countdownForResetGame]);

  return (
    <div className="main-wrapper">
      {winner ? (
        <>
          <div className="winner-info">{winner}</div>
          <div className="reset-game-info">
            Game Reset in {countdownForResetGame}.
          </div>
        </>
      ) : (
        <div className="user-turn-info">
          Now User {isUser1Turn ? '1' : '2'} Turn
        </div>
      )}

      {images.length ? (
        <div className="card-images-wrapper">
          {images?.map((image, index) => {
            return (
              <div key={index} onClick={() => flipCard(image, index)}>
                <img
                  src={isCardChosen(image, index) ? image : cardBackImage}
                  alt=""
                  className="card-image"
                />
              </div>
            );
          })}
        </div>
      ) : (
        <></>
      )}

      <div className="point-section">
        <div>User 1 : {pointsOfUser1}</div>
        <div>
          <button onClick={reset}>Reset</button>
        </div>
        <div>User 2 : {pointsOfUser2}</div>
      </div>
    </div>
  );
}
