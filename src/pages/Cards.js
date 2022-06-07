import React, { useContext, useState, useEffect, useCallback } from "react";

import { CardContext } from "../context/card-context";
import { AuthContext } from "../context/auth-context";

import Bug from "../assets/icons/bug.png";
import Menu from "../components/UI/Menu";
import CardSwiper from "../components/Cards/CardSwiper";
import NoCardsYet from "../components/UI/NoCardsYet";

const Cards = () => {
  const { data: loadedCards, status, dispatch } = useContext(CardContext);
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

  let content;
  if (status === "pending") {
    content = (
      <div className="FlexCenter my-10">
        <h2>Loading...</h2>
        <img src={Bug} alt="Bug" className="h-12 w-auto ml-2" />
      </div>
    );
  } else if (cards && cards.length > 0) {
    content = <CardSwiper cards={cards} />;
  } else {
    content = <NoCardsYet />;
  }

  return (
    <>
      <Menu onShuffle={shuffleCardsHandler} />
      {content}
    </>
  );
};

export default Cards;
