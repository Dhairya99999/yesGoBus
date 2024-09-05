import "regenerator-runtime/runtime";
import { useState, useEffect } from "react";

import SpeechRecognition, {
	useSpeechRecognition,
} from "react-speech-recognition";

// Initialize the speech recognition engine
import { Button, Drawer, Spin } from "antd";
import { LuMic } from "react-icons/lu";
import "./VoiceSearchWeb.scss";

const VoiceSearchWeb = ({
	setLocationQuery,
	setInputValue,
	setData,
	title,
}) => {
	// Initialize speech recognition state
	const {
		transcript,
		listening,
		resetTranscript,
		browserSupportsSpeechRecognition,
	} = useSpeechRecognition();

	// console.log("useSpeechRecognition hook:", {
	// 	transcript,
	// 	listening,
	// 	resetTranscript,
	// 	browserSupportsSpeechRecognition,
	// });

	// Local state for component
	const [isListening, setIsListening] = useState(false);
	const [open, setOpen] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [placeholder, setPlaceholder] = useState("Try saying something....");
	const [isTimedout, setIsTimedout] = useState(false);

	// Update search value when transcript changes
	useEffect(() => {
		if (transcript) {
			setSearchValue(transcript);
			console.log("Transcript updated:", transcript);
		}
	}, [transcript, open]);

	// useEffect(() => {
	// 	if (isListening) {
	// 		console.log("Speech recognition started");
	// 	} else {
	// 		console.log("Speech recognition stopped");
	// 	}
	// }, [isListening]);

	const startListening = () => {
		console.log("startListening function called");
		setOpen(true);
		setIsListening(true);
		SpeechRecognition.startListening({
			continuous: true,
			language: "en-IN",
		});
	};

	const stopListening = () => {
		setOpen(false);
		setIsListening(false);
		SpeechRecognition.stopListening();
	};

	// Handle reset event
	const handleReset = () => {
		resetTranscript();
		setSearchValue("");
		setIsTimedout(false);
	};

	// Handle no click event
	const handleNoClick = () => {
		handleReset();
		setOpen(true);
		setPlaceholder("Try again...");
	};

	// Handle yes click event
	const handleYesClick = () => {
		setInputValue(searchValue);
		setLocationQuery(searchValue);
		setData(searchValue);
		setOpen(false);
		stopListening();
		resetTranscript();
	};

	// Check if browser supports speech recognition
	if (!browserSupportsSpeechRecognition) {
		alert("Browser doesn't support speech recognition.");
		return null;
	}

	return (
		<div className="voice-search-wrapper">
			{/* Mic button */}
			<button type="button" className="modal-trigger" onClick={startListening}>
				<LuMic size={25} color="grey" style={{ marginBottom: "13px" }} />
			</button>

			{/* Drawer component */}
			<Drawer
				title={`Search ${title === "From" ? "Departure" : "Destination"}`}
				placement={"bottom"}
				closable={false}
				onClose={() => setOpen(false)}
				open={open}
				key={"bottom"}
				height={"250px"}
				classNames={{ body: "drawer-body" }}
			>
				<div className="drawer-content">
					<div
						className="modal-mic"
						style={{
							boxShadow: `${
								searchValue
									? ""
									: isTimedout
									? "0px 0px 5px 5px #33333355"
									: "0px 0px 5px 5px #fd5901"
							}`,
						}}
					>
						<LuMic
							size={30}
							color={`${
								searchValue ? "#fd5901" : isTimedout ? "gray" : "white"
							}`}
						/>
					</div>
					{!searchValue ? (
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: "0.5rem",
							}}
						>
							<p style={{ fontSize: "1.25rem" }}>{placeholder}</p>
							{!isTimedout && <Spin size="small" />}
						</div>
					) : (
						<p className={` ${searchValue ? "search-result" : ""}`}>
							Did you mean{" "}
							<span className="" style={{ color: "#fd5901" }}>
								{searchValue}
							</span>
							?
						</p>
					)}
				</div>
				<div className="action-buttons">
					{!isTimedout ? (
						searchValue && (
							<>
								<Button
									type="primary"
									onClick={handleYesClick}
									size="middle"
									htmlType="button"
									style={{ paddingInline: "2rem" }}
								>
									Yes
								</Button>
								<Button
									type="primary"
									danger
									onClick={handleNoClick}
									size="middle"
									htmlType="button"
									style={{ paddingInline: "2rem" }}
								>
									No
								</Button>
							</>
						)
					) : (
						<Button
							type="primary"
							onClick={handleNoClick}
							size="middle"
							htmlType="button"
							style={{ paddingInline: "2rem" }}
						>
							Retry
						</Button>
					)}
				</div>
			</Drawer>
		</div>
	);
};

export default VoiceSearchWeb;
