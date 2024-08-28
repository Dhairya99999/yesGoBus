import React, { useState, useEffect, useRef } from "react";
import "./BusRouteCard.scss";
import { Spin } from "antd";
import { LuCalendarDays } from "react-icons/lu";
import { LuMic } from "react-icons/lu";
import { useSelector } from "react-redux";
import { selectIsMobileApp } from "../../stores/slices/designSlice";
import Calendar from "../Calendar/Calendar";

const BusRouteCard = ({
  title,
  location,
  setLocation,
  date,
  suggestions,
  loading,
  setLocationQuery,
  style,
  color,
  setData,
}) => {
  const isMobileApp = useSelector(selectIsMobileApp);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, "0");
    const day = String(new Date().getDate()).padStart(2, "0");
    const currentDate = `${day}-${month}-${year}`;
    
    if (date) {
      setInputValue(currentDate);
    } else {
      setInputValue(location);
    }
  }, [location, date]);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Sorry, your browser doesn't support speech recognition.");
    } else {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setData(transcript);
        setLocationQuery(transcript);
        setShowSuggestions(true);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [setLocationQuery, setData]);

  const handleInputChange = (e) => {
    const newInputValue = e.target.value;
    setInputValue(newInputValue);
    setData(newInputValue);
    setLocationQuery(newInputValue);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setData(suggestion);
    setShowSuggestions(false);
  };

  const handleClickOutside = (e) => {
    if (!inputRef.current.contains(e.target)) {
      setShowSuggestions(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const day = date.getDate();
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    return `${dayName} ${day}-${monthName}`;
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleInputClick = () => {
    setShowSuggestions(true);
  };

  const startListening = () => {
    setIsListening(true);
    recognitionRef.current.start();
  };

  return (
    <div className="BusRouteCard" ref={inputRef} style={style}>
      <p style={color}>{title}</p>
      {date ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            color: "#fd5901",
          }}
        >
          <input
            placeholder="dd-mm-yyyy"
            value={formatDate(location)}
            onClick={() => {
              setOpenCalendar(true);
            }}
          />
          <LuCalendarDays style={{ marginLeft: "auto", cursor: "pointer" }} />
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="search"
            value={inputValue}
            onInput={handleInputChange}
            onClick={handleInputClick}
            style={{ flex: 1 }}
          />
          <LuMic
            onClick={startListening}
            style={{ marginLeft: "auto", cursor: "pointer", color: isListening ? 'red' : 'inherit' }}
          />
        </div>
      )}
      {showSuggestions && (
        <ul className="suggestion-list">
          {loading ? (
            <li className="loading-spinner">
              <Spin size="small" />
            </li>
          ) : (
            suggestions
              .filter(({ name }) => !/\d/.test(name) && !name.includes(" "))
              .map((suggestion) => (
                <li
                  key={suggestion._id}
                  onClick={() => handleSuggestionClick(suggestion.name)}
                >
                  {suggestion.name}
                </li>
              ))
          )}
        </ul>
      )}
      {openCalendar && (
        <Calendar
          setOpenCalendar={setOpenCalendar}
          setDate={setData}
          setInputValue={setInputValue}
        />
      )}
    </div>
  );
};

export default BusRouteCard;
