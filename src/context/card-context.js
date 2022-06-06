import { useReducer, createContext } from "react";
import {
  getCards,
  getUserCards,
  getSingleCard,
  addCard,
  updateCard,
  deleteCard,
} from "../api/card-api";

export const CardContext = createContext();

const dispatchMiddleware = dispatch => {
  return async action => {
    switch (action.type) {
      case "GET_ALL_CARDS": {
        try {
          dispatch({ type: "SEND" });
          const loadedCards = await getCards();
          dispatch({ ...action, payload: loadedCards });
          dispatch({ type: "SUCCESS" });
        } catch (err) {
          dispatch({ type: "ERROR", payload: err });
        }
        break;
      }

      case "GET_USER_CARDS": {
        try {
          dispatch({ type: "SEND" });
          const loadedUserCards = await getUserCards(action.payload);
          dispatch({ ...action, payload: loadedUserCards });
          dispatch({ type: "SUCCESS" });
        } catch (err) {
          dispatch({ type: "ERROR", payload: err });
        }
        break;
      }

      case "GET_SINGLE_CARD": {
        try {
          dispatch({ type: "SEND" });
          const loadedCard = await getSingleCard(action.payload);
          dispatch({ ...action, payload: loadedCard });
          dispatch({ type: "SUCCESS" });
        } catch (err) {
          dispatch({ type: "ERROR", payload: err });
        }
        break;
      }

      case "ADD_CARD": {
        try {
          dispatch({ type: "SEND" });
          await addCard(action.payload.cardData);
          const loadedCards = await getUserCards(action.payload.uid);
          dispatch({ type: "GET_USER_CARDS", payload: loadedCards });
          dispatch({ type: "SUCCESS" });
        } catch (err) {
          dispatch({ type: "ERROR", payload: err });
        }
        break;
      }

      case "UPDATE_CARD": {
        try {
          dispatch({ type: "SEND" });
          await updateCard(action.payload.id, action.payload.data);
          const loadedCards = await getUserCards(action.payload.uid);
          dispatch({ type: "GET_USER_CARDS", payload: loadedCards });
          dispatch({ type: "SUCCESS" });
        } catch (err) {
          dispatch({ type: "ERROR", payload: err });
        }
        break;
      }

      case "DELETE_CARD": {
        try {
          dispatch({ type: "SEND" });
          await deleteCard(action.payload);
          dispatch(action);
          dispatch({ type: "SUCCESS" });
        } catch (err) {
          dispatch({ type: "ERROR", payload: err });
        }
        break;
      }

      default:
        return dispatch(action);
    }
  };
};

const cardReducer = (state, action) => {
  switch (action.type) {
    case "GET_ALL_CARDS":
      return {
        ...state,
        data: action.payload,
      };

    case "GET_USER_CARDS":
      return {
        ...state,
        data: action.payload,
      };

    case "GET_SINGLE_CARD":
      return {
        ...state,
        singleData: action.payload,
      };

    case "DELETE_CARD":
      return {
        ...state,
        data: state.data.filter(item => item.id !== action.payload),
        status: "deleted",
      };

    case "SEND":
      return {
        ...state,
        status: "pending",
      };

    case "SUCCESS":
      return {
        ...state,
        status: "completed",
      };

    case "ERROR":
      return {
        ...state,
        error: action.payload,
        status: "error",
      };

    default:
      return state;
  }
};

export const CardProvider = ({ children }) => {
  const initialState = {
    data: null,
    singleData: null,
    error: null,
    status: "",
  };

  const [cardState, dispatch] = useReducer(cardReducer, initialState);

  return (
    <CardContext.Provider
      value={{ dispatch: dispatchMiddleware(dispatch), ...cardState }}
    >
      {children}
    </CardContext.Provider>
  );
};
