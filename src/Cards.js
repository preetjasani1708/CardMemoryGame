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
          setIsUser1Turn((previousState) => !previousState);
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
    createCardBoard();
  };

  useEffect(() => {
    createCardBoard();
  }, []);

  useEffect(() => {
    if(openCards.length && openCards.length === images.length){
      setTimeout(() => reset(), 2000)
    }
  }, [openCards.length])

  return (
    <div className="main-wrapper">
      <div>User {isUser1Turn ? '1' : '2'} Turn</div>
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
