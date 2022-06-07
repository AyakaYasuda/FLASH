import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { CardContext } from "../context/card-context";
import { AuthContext } from "../context/auth-context";

import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "../components/UI/Button";

const EditCard = () => {
  const cardId = useParams().cid;
  const navigate = useNavigate();
  const { dispatch, singleData, status } = useContext(CardContext);
  const { authUser } = useContext(AuthContext);

  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [example, setExample] = useState("");
  const [comment, setComment] = useState("");
  const [level, setLevel] = useState("");

  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    dispatch({ type: "GET_SINGLE_CARD", payload: cardId });
  }, []);

  useEffect(() => {
    setFront(singleData?.front);
    setBack(singleData?.back);
    setExample(singleData?.example);
    setComment(singleData?.comment);
    setLevel(singleData?.level);
  }, [singleData]);

  const updatedCard = {
    id: cardId,
    front,
    back,
    example,
    comment,
    level,
  };

  const updateHandler = () => {
    dispatch({
      type: "UPDATE_CARD",
      payload: { id: cardId, data: updatedCard, uid: authUser.uid },
    });
    setIsDone(true);
  };

  useEffect(() => {
    if (isDone && status === "completed") {
      navigate("/my-cards");
    }
  }, [isDone, status]);

  return (
    <div className="WhiteContainer my-8 sm:my-10">
      <div className="FlexColumn mb-5 w-full">
        <h1 className="mb-8">Edit</h1>
        <div className="FlexColumn sm:flex-row">
          <TextField
            id="outlined-basic"
            label="front"
            multiline
            fullWidth
            rows={4}
            variant="outlined"
            sx={{ margin: "15px" }}
            value={front}
            onChange={e => setFront(e.target.value)}
          />
          <TextField
            id="outlined-basic"
            label="back"
            multiline
            fullWidth
            rows={4}
            variant="outlined"
            sx={{ margin: "15px" }}
            value={back}
            onChange={e => setBack(e.target.value)}
          />
        </div>
        <div className="FlexColumn sm:flex-row">
          <TextField
            id="outlined-basic"
            label="example sentence"
            multiline
            fullWidth
            rows={4}
            variant="outlined"
            sx={{ margin: "15px" }}
            value={example}
            onChange={e => setExample(e.target.value)}
          />
          <TextField
            id="outlined-basic"
            label="comment"
            multiline
            fullWidth
            rows={4}
            variant="outlined"
            sx={{ margin: "15px" }}
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
        </div>
        <FormControl sx={{ width: 225, margin: "15px" }}>
          <InputLabel id="demo-simple-select-autowidth-label">Level</InputLabel>
          <Select
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            value={level || "Normal"}
            onChange={e => setLevel(e.target.value)}
            autoWidth
            label="Level"
          >
            <MenuItem value={"Critical"}>Critical</MenuItem>
            <MenuItem value={"High"}>High</MenuItem>
            <MenuItem value={"Normal"}>Normal</MenuItem>
            <MenuItem value={"Low"}>Low</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className="FlexCenter">
        <Button onClick={updateHandler} content="SAVE" />
        <Link to="/my-cards">
          <Button
            content="CANCEL"
            className="bg-accent bg-opacity-40 text-danger ml-2"
          />
        </Link>
      </div>
    </div>
  );
};

export default EditCard;
