import React, { useContext, useState, useEffect, useCallback } from "react";

import { CardContext } from "../context/card-context";
import { AuthContext } from "../context/auth-context";

import Menu from "../components/UI/Menu";
import CardSwiper from "../components/Cards/CardSwiper";

const Cards = () => {
  const {
    data: loadedCards,
    error,
    status,
    dispatch,
  } = useContext(CardContext);
  const { authUser } = useContext(AuthContext);
  const [cards, setCards] = useState();

  const shuffle = arr => {
    let shuffledArr = [...arr];
    for (let i = shuffledArr.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArr[i], shuffledArr[j]] = [shuffledArr[j], shuffledArr[i]];
    }
    return shuffledArr;
  };

  useEffect(() => {
    if (authUser.uid) {
      const loginUserId = authUser.uid;
      dispatch({ type: "GET_USER_CARDS", payload: loginUserId });
    }
  }, [authUser]);

  const shuffleCardsHandler = useCallback(() => {
    const shuffledCards = shuffle(cards);
    setCards(shuffledCards);
  }, [cards]);

  useEffect(() => {
    setCards(loadedCards);
  }, [loadedCards]);

  return (
    <>
      <Menu onShuffle={shuffleCardsHandler} />
      {status === "pending" ? (
        <div>
          <h1>Loading...</h1>
        </div>
      ) : (
        <div>
          <CardSwiper cards={cards} />
        </div>
      )}
    </>
  );
};

export default Cards;
