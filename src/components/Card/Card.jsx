import Button from "../Button/Button";
import "./Card.scss";
import { useNavigate } from "react-router-dom";



const Card = ({ img, title, subtitle, text, link }) => {

  const navigate = useNavigate();

  const send = () => {
    if (text === "Send Mail") navigate(`/contactus/?mailto=${link}`);
    else if (text === "Call Us") navigate(`/contactus/?tel=${link}`);
  };
  return (
    <div className="card">
      <div className="firstContainer">
        <img src={img} alt="" />
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {text && <Button text={text} onClicked={send} />}
    </div>
  );
};

export default Card;
