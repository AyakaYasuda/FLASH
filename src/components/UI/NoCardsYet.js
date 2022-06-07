import React from "react";
import { useNavigate } from "react-router-dom";

import Button from "./Button";

const NoCardsYet = () => {
  const navigate = useNavigate();
  return (
    <div className="FlexColumn text-center mt-10 my-20">
      <h2>
        There're no cards yet...
        <br />
        Do you want to create a new card?
      </h2>
      <Button
        content="CREATE"
        className="mt-5"
        onClick={() => navigate("/new")}
      />
    </div>
  );
};

export default NoCardsYet;
