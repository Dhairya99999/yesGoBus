import {
	facebook,
	google,
	//image,
	// linkedin,
	//logoblack,
} from "../../assets/login";
import logo from "../../assets/yegobus-logo.png";
import "./Login.scss";
import { Button, Input } from "../../components";
import { useNavigate, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/service";
import { facebookLoginAPI, googleLoginAPI } from "../../api/authentication";
import { LoginSocialFacebook } from "reactjs-social-login";
import toast, { Toaster } from "react-hot-toast";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { useSelector } from "react-redux";
import { auth, provider } from "../../utils/googleAuth";
import { signInWithPopup } from "firebase/auth";
import { selectIsMobileApp } from "../../stores/slices/designSlice";
//import ForgotPassword from "../../components/Shared/ForgotPassword/ForgotPassword";

const Login = () => {
	const loggedInUser = localStorage.getItem("loggedInUser");
	const navigate = useNavigate();
	const [showLogin, setShowLogin] = useState(true);
	const [showCreateAccount, setShowCreateAccount] = useState(false);
	const [loginData, setLoginData] = useState({});
	const [createAccountData, setCreateAccountData] = useState({
		fullName: "",
		email: "",
		phoneNumber: "",
		gender: "",
	});
	const [showOTP, setShowOTP] = useState(false);
	const [orderId, setOrderId] = useState("");
	const [loading, setLoading] = useState(false);
	const [showOtp, setShowOtp] = useState(false);
	useEffect(() => {
		GoogleAuth.initialize({
			clientId:
				"100318910449-h74ooih65luj6ambadl5ik50arsafo4a.apps.googleusercontent.com",
			scopes: ["profile", "email"],
			grantOfflineAccess: true,
		});
	}, []);
	if (loggedInUser) {
		return <Navigate to="/" replace />;
	}
	// const isMobileApp = useSelector(selectIsMobileApp);

	// const isMobilenumber = (num) => {
	//   let isIndianNumber = /^[6789]\d{11}$/;
	//   return isIndianNumber.test(num);
	// };

	const handleLoginChange = () => {
		setShowLogin(!showLogin);
		setShowCreateAccount(!showCreateAccount);
	};

	const handlePhChange = (e) => {
		setShowOTP(false);
		// if (isMobilenumber(e.target.value)) setShowOTP(true);
		setLoginData((prev) => {
			return { ...prev, [e.target.name]: e.target.value };
		});
	};

	const handleOtherLoginChanges = (e) => {
		setLoginData((prev) => {
			return { ...prev, [e.target.name]: e.target.value };
		});
	};

	// const handlePhChangeSingup = (e) => {
	//   setShowOTP(false);
	//   if (isMobilenumber(e.target.value)) setShowOTP(true);
	//   setCreateAccountData((prev) => {
	//     return { ...prev, [e.target.name]: e.target.value };
	//   });
	// };

	// const handleOtherSignupChanges = (e) => {
	//   setCreateAccountData((prev) => {
	//     return { ...prev, [e.target.name]: e.target.value };
	//   });
	// };
	const handleSubmit = async () => {
		if (showLogin) {
			setLoading(true);
			const loadingToast = toast.loading("Logging in...");
			try {
				const response = await axiosInstance.post(
					`${import.meta.env.VITE_BASE_URL}/api/user/signin`,
					{
						mobileNumber: loginData.phoneNumber,
					}
				);
				if (response.status === 201) {
					handleLoginChange();
					toast.dismiss(loadingToast);
					toast.error(response.data.message, {
						duration: 2000,
						position: "top-center",
						style: {
							background: "red",
							color: "white",
						},
					});
					return;
				}
				if (response.status === 200) {
					toast.dismiss(loadingToast);
					setOrderId(response.data.data.orderId);
					// const token = response.data.token;
					// const loggedInUser = response.data.data;
					// localStorage.setItem("token", token);
					// localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
					toast.success("OTP send Successful", {
						duration: 2000,
						position: "top-center",
						style: {
							background: "green",
							color: "white",
						},
					});
					setShowOtp(true);
				}
				// for testing purpose
				if (response.status === 203) {
					toast.dismiss(loadingToast);
					const token = response.data.data.token;
					const loggedInUser = response.data.data.user;
					localStorage.setItem("token", token);
					localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
					// const message = showLogin ? "Login Successful" : "Signup Successful";
					toast.success(response.message, {
						duration: 2000,
						position: "top-center",
						style: {
							background: "green",
							color: "white",
						},
					});
					setTimeout(() => {
						navigate("/");
					}, 2000);
				} else {
					toast.error("Invalid credentials", {
						duration: 2000,
						position: "top-center",
						style: {
							background: "red",
							color: "white",
						},
					});
				}
			} catch (error) {
				toast.error("Invalid credentials", {
					duration: 2000,
					position: "top-center",
					style: {
						background: "red",
						color: "white",
					},
				});
				console.error("Error logining user:", error);
			} finally {
				setLoading(false);
				toast.dismiss(loadingToast);
			}
		} else {
			if (
				createAccountData.phoneNumber === "" ||
				createAccountData.email === "" ||
				createAccountData.fullName === ""
			) {
				toast.error("Full Name, Phone Number and email required", {
					duration: 2000,
					position: "top-center",
					style: {
						background: "red",
						color: "white",
					},
				});
				return;
			}
			const loadingToast = toast.loading("Creating account...");
			try {
				setLoading(true);
				const response = await axiosInstance.post(
					`${import.meta.env.VITE_BASE_URL}/api/user/signup`,
					createAccountData
				);
				if (response.status === 201) {
					toast.dismiss(loadingToast);
					toast.error(response.data.message, {
						duration: 2000,
						position: "top-center",
						style: {
							background: "red",
							color: "white",
						},
					});
				}
				if (response.status === 200) {
					setLoading(false);
					console.log(response.data);
					setOrderId(response.data.data.orderId);
					toast.dismiss(loadingToast);
					toast.success("OTP send successfully", {
						duration: 2000,
						position: "top-center",
						style: {
							background: "green",
							color: "white",
						},
					});
					setShowOtp(true);
				}
			} catch (error) {
				console.log(error);
				toast.dismiss(loadingToast);
				if (error.response.status === 409) {
					toast.dismiss(loadingToast);
					toast.error("User already exists", {
						duration: 2000,
						position: "top-center",
						style: {
							background: "red",
							color: "white",
						},
					});
				} else {
					toast.error("Error", {
						duration: 2000,
						position: "top-center",
						style: {
							background: "red",
							color: "white",
						},
					});
					console.error("Error registering user:", error);
				}
			} finally {
				toast.dismiss(loadingToast);
				setLoading(false);
			}
		}
	};
	const handelLogin = async () => {
		setLoading(true);
		const loadingToast = toast.loading("Logging in...");
		try {
			if (showLogin) {
				const response = await axiosInstance.post(
					`${import.meta.env.VITE_BASE_URL}/api/user/verify_login_otp`,
					{
						mobileNumber: loginData.phoneNumber
							? loginData.phoneNumber
							: createAccountData.phoneNumber,
						orderId,
						otp: loginData.password,
					}
				);
				if (response.status === 200) {
					toast.dismiss(loadingToast);
					const token = response.data.data.token;
					const loggedInUser = response.data.data.user;
					localStorage.setItem("token", token);
					localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
					const message = showLogin ? "Login Successful" : "Signup Successful";
					toast.success(message, {
						duration: 2000,
						position: "top-center",
						style: {
							background: "green",
							color: "white",
						},
					});
					setTimeout(() => {
						navigate("/");
					}, 2000);
				} else {
					toast.error("Invalid credentials", {
						duration: 2000,
						position: "top-center",
						style: {
							background: "red",
							color: "white",
						},
					});
				}
			} else {
				const response = await axiosInstance.post(
					`${import.meta.env.VITE_BASE_URL}/api/user/verify_signup_otp`,
					{
						mobileNumber: loginData.phoneNumber
							? loginData.phoneNumber
							: createAccountData.phoneNumber,
						orderId,
						otp: loginData.password,
						email: createAccountData.email,
						fullName: createAccountData.fullName,
					}
				);
				if (response.status === 200) {
					toast.dismiss(loadingToast);
					const token = response.data.data.token;
					const loggedInUser = response.data.data.user;
					localStorage.setItem("token", token);
					localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
					const message = showLogin ? "Login Successful" : "Signup Successful";
					toast.success(message, {
						duration: 2000,
						position: "top-center",
						style: {
							background: "green",
							color: "white",
						},
					});
					setTimeout(() => {
						navigate("/");
					}, 2000);
				} else {
					toast.error("Invalid credentials", {
						duration: 2000,
						position: "top-center",
						style: {
							background: "red",
							color: "white",
						},
					});
				}
			}
		} catch (error) {
			toast.error("Invalid credentials", {
				duration: 2000,
				position: "top-center",
				style: {
					background: "red",
					color: "white",
				},
			});
			console.error("Error logining user:", error);
		} finally {
			setLoading(false);
			toast.dismiss(loadingToast);
		}
	};
	const resendOtp = async () => {
		setLoading(true);
		const loadingToast = toast.loading("Sending OTP in...");
		try {
			const response = await axiosInstance.post(
				`https://apis.yesgobus.com/api/user/resend_otp`,
				{
					orderId,
				}
			);
			console.log(response.data);
		} catch (error) {
			toast.dismiss(loadingToast);
			if (error.response.status === 409) {
				toast.dismiss(loadingToast);
				toast.error("User already exists", {
					duration: 2000,
					position: "top-center",
					style: {
						background: "red",
						color: "white",
					},
				});
			} else {
				toast.error("Error", {
					duration: 2000,
					position: "top-center",
					style: {
						background: "red",
						color: "white",
					},
				});
				console.error("Error registering user:", error);
			}
		} finally {
			toast.dismiss(loadingToast);
			setLoading(false);
		}
	};
	const login = (
		<>
			{!showOtp && (
				<div className={setShowOTP ? "otp" : ""}>
					<div style={{ display: "flex" }}>
						<Input
							title={"Enter Mobile Number"}
							type={"text"}
							placeholder={"Enter Mobile Number"}
							onChanged={handlePhChange}
							givenName={"phoneNumber"}
						/>
					</div>
				</div>
			)}
			{showOtp && (
				<>
					<Input
						title={"Enter OTP"}
						type={"text"}
						placeholder={"Enter OTP"}
						onChanged={handleOtherLoginChanges}
						givenName={"password"}
						style={{ maxWidth: "250px" }}
					/>{" "}
					<Button
						text={"Verify"}
						onClicked={handelLogin}
						disable={loading}
						style={{ padding: "10px 35px" }}
					/>
					<Button
						text={"Edit"}
						onClicked={() => {
							setShowOtp(false);
						}}
						disable={loading}
						style={{ padding: "10px 40px" }}
					/>
				</>
			)}

			{/* Forgot Password */}
			{/*<ForgotPassword />*/}
		</>
	);

	const createAccount = (
		<>
			{!showOtp && (
				<>
					<Input
						title={"Full Name"}
						type={"text"}
						placeholder={"Full Name"}
						onChanged={(e) => {
							setCreateAccountData({
								...createAccountData,
								fullName: e.target.value,
							});
						}}
						givenName={"fullName"}
					/>
					<Input
						title={"Mobile Number"}
						type={"text"}
						placeholder={"0000 0000 00"}
						onChanged={(e) => {
							setCreateAccountData({
								...createAccountData,
								phoneNumber: e.target.value,
							});
						}}
						givenName={"phoneNumber"}
					/>
					<Input
						title={"Email"}
						type={"email"}
						placeholder={"Email"}
						onChanged={(e) => {
							setCreateAccountData({
								...createAccountData,
								email: e.target.value,
							});
						}}
						givenName={"email"}
					/>
					<div className="genderContainer">
						{/* <label htmlFor={`gender_${index}`}>Gender *</label> */}
						<select
							// name={`gender_${index}`}
							// id={`gender_${index}`}
							// value={userData[`gender_${index}`] || ""}
							// onChange={(e) => handleInputChange(e, `gender`)}
							onChange={(e) => {
								setCreateAccountData({
									...createAccountData,
									gender: e.target.value,
								});
							}}
						>
							<option value="">Gender</option>
							<option value="M">Male</option>
							<option value="F">Female</option>
						</select>
					</div>
				</>
			)}
			{showOtp && (
				<>
					<Input
						title={"Enter OTP"}
						type={"text"}
						placeholder={"Enter OTP"}
						onChanged={handleOtherLoginChanges}
						givenName={"password"}
					/>{" "}
					<Button
						text={"Verify"}
						onClicked={handelLogin}
						disable={loading}
						style={{ padding: "10px 35px" }}
					/>
					<Button
						text={"Edit"}
						onClicked={() => {
							setShowOtp(false);
						}}
						disable={loading}
						style={{ padding: "10px 40px" }}
					/>
				</>
			)}
		</>
	);

	// Google sigin for mobile APP
	const googleLoginHandle = async () => {
		// let googleUser = await GoogleAuth.signIn();
		// console.log(googleUser.authentication.idToken);
		// const credential = googleUser.authentication.idToken;
		signInWithPopup(auth, provider).then((data) => {
			googleUserVerifyHandler({ credential: data.user.accessToken });
		});
	};

	const googleUserVerifyHandler = async ({ credential }) => {
		try {
			setLoading(true);
			// const loadingToast = toast.loading('Logging in...');
			const { data, token } = await googleLoginAPI(credential);
			localStorage.setItem("token", token);
			localStorage.setItem("loggedInUser", JSON.stringify(data));
			navigate("/busbooking");
		} catch (error) {
			console.log(error);
			navigate("/");
			toast.error("Error", {
				duration: 2000,
				position: "top-center",
				style: {
					background: "red",
					color: "white",
				},
			});
		} finally {
			setLoading(false);
			//toast.dismiss(loadingToast);
		}
	};

	const facebookLoginHanler = async (fbResponse) => {
		try {
			const { data, token } = await facebookLoginAPI(fbResponse);
			localStorage.setItem("token", token);
			localStorage.setItem("loggedInUser", JSON.stringify(data));
			toast.success(showLogin ? "Login Successful" : "Signup Successful", {
				duration: 2000,
				position: "top-center",
				style: {
					background: "green",
					color: "white",
				},
			});
			setTimeout(() => {
				navigate("/");
			}, 2000);
		} catch (error) {
			console.log("Error login in using facebook: ", error);
			toast.error("Error", {
				duration: 2000,
				position: "top-center",
				style: {
					background: "red",
					color: "white",
				},
			});
		}
	};

	return (
		<div className="Login">
			<div className="loginContainer">
				<img className="img" src={logo} alt="" />
				<hr />
				<div className="loginright">
					<div style={{ width: "100%" }}>
						<p>Welcome to YesGoBus</p>
						{showLogin ? (
							<>
								<h1 style={{ textAlign: "left", padding: "5px 0px" }}>
									Log In
								</h1>
								<p>
									Dont have an account?
									<span
										style={{ cursor: "pointer", color: "#fd5901" }}
										onClick={handleLoginChange}
									>
										{" "}
										Create an account
									</span>
								</p>
							</>
						) : (
							<>
								<h1 style={{ textAlign: "left", paddingTop: "5px" }}>
									Create an Account
								</h1>
								<p>
									Already have an account?
									<span
										style={{ cursor: "pointer", color: "#fd5901" }}
										onClick={handleLoginChange}
									>
										{" "}
										Click to Login
									</span>
								</p>
							</>
						)}
					</div>
					{showLogin ? login : createAccount}
					<p style={{ fontSize: "12px" }}>
						By Continuing, I agree to the{" "}
						<span style={{ color: "#fd5901" }}>Terms of Use</span> &{" "}
						<span style={{ color: "#fd5901" }}> Privacy Policy</span>
					</p>

					{showOtp ? (
						<div
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								paddingTop: "1rem",
							}}
						>
							<Button
								text={"Resend OTP"}
								onClicked={resendOtp}
								disable={loading}
							/>
						</div>
					) : (
						<Button
							text={showLogin ? "Login" : "Signup"}
							onClicked={handleSubmit}
							disable={loading}
							style={{ padding: "10px" }}
						/>
					)}
					<div className="or">
						<hr />
						<div
							style={{
								display: "flex",
								width: "100%",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<div
								style={{
									height: "1px",
									width: "100px",
									backgroundColor: "#7A7575",
								}}
							/>
							<p style={{ width: "35px" }}>Or</p>
							<div
								style={{
									height: "1px",
									width: "100px",
									backgroundColor: "#7A7575",
								}}
							/>
						</div>
						<hr />
					</div>

					<div className="links">
						<p>Continue with</p>
						<div className="linksContainer">
							{/* <div id="googlesignin" className="link"></div> */}
							<LoginSocialFacebook
								appId={import.meta.env.VITE_FACEBOOK_APP_ID}
								onReject={(error) => console.log(error)}
								onResolve={facebookLoginHanler}
							>
								<div className="link">
									<img src={facebook} alt="" />
									{/* <span>Facebook</span>*/}
								</div>
							</LoginSocialFacebook>
							<div className="link" onClick={googleLoginHandle}>
								<img src={google} alt="" id="googlesigninn" />
								{/*<span>Google</span>*/}
							</div>
							{/* <div className="link">
                <div
                  className="fb-login-button"
                  data-size="medium"
                  data-button-type="continue_with"
                  data-layout="default"
                  data-auto-logout-link="false"
                  data-use-continue-as="true"
                  data-width=""
                  data-scope="public_profile,email"
                  onClick={facebookLoginHandler}
                />
              </div> */}
							{/* 
              // <div className="link">
              //   <img src={google} alt="" id="googlesignin" />
              //   <span>Google</span>
              // </div> 
              <div className="link">
                <img src={facebook} alt="" />
                <span>Facebook</span>
              </div>
              <div className="link">
                <img src={linkedin} alt="" />
                <span>Linkedin</span>
              </div> 
              */}
						</div>
					</div>

					<Toaster />
				</div>
			</div>
		</div>
	);
};

export default Login;
