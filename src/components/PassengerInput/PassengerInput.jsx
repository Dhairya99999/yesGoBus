import { useState, useEffect, useRef } from "react";
import "./PassengerInput.scss";
import { Spin } from "antd";

const PassengerInput = ({
  title,
  suggestions,
  value,
  loading,
  userData,
  //setLocationQuery={setLocationOneQuery}
  setUserData,
  name1,
  name2,
  age,
  gender,
}) => {
  const [inputValue, setInputValue] = useState(value);
  console.log(name1,
    name2,
    age,
    gender,);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  //const delay = 1000;

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setUserData((prev) => {
      return { ...prev, [name1]: e.target.value };
    });
  };

  const handleSuggestionClick = (suggestion) => {
    console.log(suggestion)
    setInputValue(suggestion.paxName.split(" ")[0]);
    setUserData((prev) => {
      return {
        ...prev,
        [name1]: suggestion.paxName.split(" ")[1],
        [name2]: suggestion.paxName.split(" ")[1],
        [age]:suggestion.paxAge,
        [gender]:suggestion.seatName.split(",")[1]
      };
    });
    setShowSuggestions(false);
  };

  const handleClickOutside = (e) => {
    if (!inputRef.current.contains(e.target)) {
      setShowSuggestions(false);
    }
  };

  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     setLocation(inputValue);
  //   }, delay);

  //   return () => {
  //     clearTimeout(timeoutId);
  //   };
  // }, [inputValue]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleInputClick = () => {
    setShowSuggestions(true);
  };
  return (
    <div className="PassengerInput" ref={inputRef}>
      <p>{title}</p>
      <input
        type="search"
        value={inputValue}
        onInput={handleInputChange}
        onClick={handleInputClick}
      />
      {showSuggestions && (
        <ul className="suggestion-list">
          {loading ? (
            <li className="loading-spinner">
              <Spin size="small" />
            </li>
          ) : (
            suggestions.map((suggestion) => (
              <li
                key={suggestion._id}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.paxName}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default PassengerInput;
