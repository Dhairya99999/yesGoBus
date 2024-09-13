import "./Input.scss";

const Input = ({
	title,
	type,
	placeholder,
	onChanged,
	givenName,
	isKyc,
	value,
	required,
}) => {
	//phoneNumber
	const handleChange = (e) => {
		e.preventDefault();
		onChanged((prev) => {
			return { ...prev, [givenName]: e.target.value };
		});
	};
	const handleOnChange = isKyc ? handleChange : onChanged;
	return (
		<div className="Input">
			{/* <span className="title">{title}</span> */}
			{givenName === "phoneNumber" ? (
				<div
					style={{
						display: "flex",
						alignItems: "center",
						width: "330px",
						border: "1px solid #d4d4d4",
						borderRadius: "5px",
						paddingLeft: "5px",
						fontSize: "14px",
						"&:focus": {
							borderColor: "#ff9822c1",
							boxShadow: "0 0 5px rgba(255, 111, 0, 0.3)",
						},
					}}
				>
					<p style={{ width: "30px", margin: "0px 5px" }}>+91</p>{" "}
					<input
						name={givenName}
						onChange={handleOnChange}
						type={type}
						placeholder={placeholder}
						value={value}
						required={required || false}
						style={{
							border: "none",
							margin: "0px 0",
							padding: "10px 0",
							boxShadow: "none",
						}}
					/>{" "}
				</div>
			) : (
				<input
					name={givenName}
					onChange={handleOnChange}
					type={type}
					placeholder={placeholder}
					value={value}
					required={required || false}
					style={{ marginRight: "0px", maxWidth: "355px", width: "100%" }}
				/>
			)}
		</div>
	);
};

export default Input;
