import { useState } from "react";
import {
	Button,
	TextField,
	Card,
	CardContent,
	Typography,
	Box,
	Checkbox,
	FormControlLabel,
	Switch,
} from "@mui/material";
import { useNavigate, Navigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import axiosInstance from "../../../utils/service";

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function AdminLoginPage() {
	const navigate = useNavigate();
	const [emailOrMobile, setEmailOrMobile] = useState("");
	const [password, setPassword] = useState("");
	const [isOtpLogin, setIsOtpLogin] = useState(false);
	const [otpSent, setOtpSent] = useState(false);
	const [otp, setOtp] = useState("");
	const [loading, setLoading] = useState(false);
	const [isAgent, setIsAgent] = useState(false);
	const [orderId, setOrderId] = useState("");

	const loggedInAdmin = localStorage.getItem("adminUser");
	if (loggedInAdmin) {
		const adminUser = JSON.parse(loggedInAdmin);
		if (adminUser.email === "busbookingadmin@gmail.com") {
			return <Navigate to="/admin/busbooking" replace />;
		} else if (adminUser.email === "tourandtravelsadmin@gmail.com") {
			return <Navigate to="/admin/tourandtravels" replace />;
		} else if (adminUser.email === "agentadmin@gmail.com") {
			return <Navigate to="/admin/agent" replace />;
		} else if (adminUser.email === "superadmin@gmail.com") {
			return <Navigate to="/admin/superadmin" replace />;
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (isAgent) {
			if (isOtpLogin) {
				if (otpSent) {
					console.log("Verifying OTP:", {
						mobile: emailOrMobile,
						otp,
						isAgent,
					});
					setLoading(true);
					const loadingToast = toast.loading("Verifying OTP...");
					try {
						const response = await axios.post(
							`${baseUrl}/api/admin/agents/verifyOtp`,
							{
								mobile: emailOrMobile,
								otp,
								orderId,
							}
						);
						if (response.status === 200) {
							toast.dismiss(loadingToast);
							toast.success("OTP Verified", {
								duration: 2000,
								position: "top-center",
								style: {
									background: "green",
									color: "white",
								},
							});
							localStorage.setItem("agentToken", response.data.data.token);
							localStorage.setItem(
								"agentUser",
								JSON.stringify(response.data.data.user)
							);
							localStorage.setItem(
								"agentCode",
								response.data.data.user.agentCode
							);
							setLoading(false);
							navigate("/admin/agent");
						}
						if (response.status === 201 || response.status === 202) {
							toast.dismiss(loadingToast);
							toast.error(response.data.message, {
								duration: 2000,
								position: "top-center",
								style: {
									background: "red",
									color: "white",
								},
							});
							setLoading(false);
						}
					} catch (error) {
						toast.dismiss(loadingToast);
						toast.error("Error", {
							duration: 2000,
							position: "top-center",
							style: {
								background: "red",
								color: "white",
							},
						});
						setLoading(false);
					}
				} else {
					console.log("Sending OTP to:", emailOrMobile);
					setOtpSent(true);
					setLoading(true);
					const loadingToast = toast.loading("Sending OTP...");
					try {
						const response = await axios.post(
							`${baseUrl}/api/admin/agents/sendOtp`,
							{
								mobile: emailOrMobile,
							}
						);
						if (response.status === 200) {
							toast.dismiss(loadingToast);
							setOrderId(response.data.data.orderId);
							toast.success("OTP Sent", {
								duration: 2000,
								position: "top-center",
								style: {
									background: "green",
									color: "white",
								},
							});
							setLoading(false);
						}
						if (response.status === 201 || response.status === 202) {
							toast.dismiss(loadingToast);
							toast.error(response.data.message, {
								duration: 2000,
								position: "top-center",
								style: {
									background: "red",
									color: "white",
								},
							});
							setLoading(false);
						}
					} catch (error) {
						toast.dismiss(loadingToast);
						toast.error("Error", {
							duration: 2000,
							position: "top-center",
							style: {
								background: "red",
								color: "white",
							},
						});
						setLoading(false);
					}
				}
			} else {
				setLoading(true);
				const loadingToast = toast.loading("Logging in...");
				try {
					const response = await fetch(`${baseUrl}/api/agent/login`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ emailMobile: emailOrMobile, password }),
					});
					if (response.status === 200) {
						toast.dismiss(loadingToast);
						toast.success("Login Successful", {
							duration: 2000,
							position: "top-center",
							style: {
								background: "green",
								color: "white",
							},
						});
						const result = await response.json();

						localStorage.setItem("agentToken", result.token);
						localStorage.setItem("agentCode", result.data.agentCode);
						setLoading(false);
						navigate("/admin/agent");
					}
					if (response.status === 201 || response.status === 202) {
						toast.dismiss(loadingToast);
						toast.error(response.data.message, {
							duration: 2000,
							position: "top-center",
							style: {
								background: "red",
								color: "white",
							},
						});
						setLoading(false);
					}
				} catch (error) {
					toast.dismiss(loadingToast);
					toast.error("Error", {
						duration: 2000,
						position: "top-center",
						style: {
							background: "red",
							color: "white",
						},
					});
					setLoading(false);
				}
			}
		} else {
			if (isOtpLogin) {
				if (otpSent) {
					console.log("Verifying OTP:", {
						mobile: emailOrMobile,
						otp,
						isAgent,
					});
					setLoading(true);
					const loadingToast = toast.loading("Verifying OTP...");
					try {
						const response = await axiosInstance.post("/api/admin/verifyOTP", {
							mobile: emailOrMobile,
							otp,
							isAgent,
						});
						if (response.status === 200) {
							toast.dismiss(loadingToast);
							toast.success("OTP Verified", {
								duration: 2000,
								position: "top-center",
								style: {
									background: "green",
									color: "white",
								},
							});
							localStorage.setItem("adminToken", response.data.data.token);
							localStorage.setItem(
								"adminUser",
								JSON.stringify(response.data.data.user)
							);
							setLoading(false);
							navigate("/admin/busbooking");
						}
						if (response.status === 201 || response.status === 202) {
							toast.dismiss(loadingToast);
							toast.error(response.data.message, {
								duration: 2000,
								position: "top-center",
								style: {
									background: "red",
									color: "white",
								},
							});
							setLoading(false);
						}
					} catch (error) {
						toast.dismiss(loadingToast);
						toast.error("Error", {
							duration: 2000,
							position: "top-center",
							style: {
								background: "red",
								color: "white",
							},
						});
						setLoading(false);
					}
				} else {
					console.log("Sending OTP to:", emailOrMobile);
					setOtpSent(true);
					setLoading(true);
					const loadingToast = toast.loading("Sending OTP...");
					try {
						const response = await axiosInstance.post("/api/admin/sendOTP", {
							mobile: emailOrMobile,
							isAgent,
						});
						if (response.status === 200) {
							toast.dismiss(loadingToast);
							toast.success("OTP Sent", {
								duration: 2000,
								position: "top-center",
								style: {
									background: "green",
									color: "white",
								},
							});
							setLoading(false);
						}
						if (response.status === 201 || response.status === 202) {
							toast.dismiss(loadingToast);
							toast.error(response.data.message, {
								duration: 2000,
								position: "top-center",
								style: {
									background: "red",
									color: "white",
								},
							});
							setLoading(false);
						}
					} catch (error) {
						toast.dismiss(loadingToast);
						toast.error("Error", {
							duration: 2000,
							position: "top-center",
							style: {
								background: "red",
								color: "white",
							},
						});
						setLoading(false);
					}
				}
			} else {
				setLoading(true);
				const loadingToast = toast.loading("Logging in...");
				try {
					const response = await axios.post(`${baseUrl}/api/admin/signIn`, {
						email: emailOrMobile,
						password,
						isAgent,
					});
					if (response.status === 200) {
						toast.dismiss(loadingToast);
						toast.success("Login Successful", {
							duration: 2000,
							position: "top-center",
							style: {
								background: "green",
								color: "white",
							},
						});
						localStorage.setItem("adminToken", response.data.token);
						localStorage.setItem(
							"adminUser",
							JSON.stringify(response.data.data)
						);
						setLoading(false);
						if (response.data.data.email === "busbookingadmin@gmail.com") {
							navigate("/admin/busbooking");
						} else if (
							response.data.data.email === "tourandtravelsadmin@gmail.com"
						) {
							navigate("/admin/tourandtravels");
						} else if (response.data.data.email === "superadmin@gmail.com") {
							navigate("/admin/superadmin");
						}
					}
					if (response.status === 201 || response.status === 202) {
						toast.dismiss(loadingToast);
						toast.error(response.data.message, {
							duration: 2000,
							position: "top-center",
							style: {
								background: "red",
								color: "white",
							},
						});
						setLoading(false);
					}
				} catch (error) {
					toast.dismiss(loadingToast);
					toast.error("Error", {
						duration: 2000,
						position: "top-center",
						style: {
							background: "red",
							color: "white",
						},
					});
					setLoading(false);
				}
			}
		}
	};

	const handleEditMobile = () => {
		setOtpSent(false);
		setOtp("");
	};

	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				minHeight: "100vh",
				background: "linear-gradient(to bottom right, #4a90e2, #7e57c2)",
			}}
		>
			<Card sx={{ width: 350, padding: 2 }}>
				<CardContent>
					<Typography variant="h5" component="div" gutterBottom>
						Admin Login
					</Typography>
					<Typography variant="body2" color="text.secondary" gutterBottom>
						Enter your credentials to access the admin panel
					</Typography>
					<form onSubmit={handleSubmit}>
						<FormControlLabel
							control={
								<Checkbox
									checked={isOtpLogin}
									onChange={(e) => {
										setIsOtpLogin(e.target.checked);
										setOtpSent(false);
										setOtp("");
									}}
								/>
							}
							label="Login with OTP"
						/>
						{!otpSent && (
							<TextField
								label={isOtpLogin ? "Mobile" : "Email"}
								variant="outlined"
								fullWidth
								margin="normal"
								value={emailOrMobile}
								onChange={(e) => setEmailOrMobile(e.target.value)}
								type={isOtpLogin ? "tel" : "email"}
								required
							/>
						)}
						{!isOtpLogin && (
							<TextField
								label="Password"
								type="password"
								variant="outlined"
								fullWidth
								margin="normal"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						)}
						{isOtpLogin && otpSent && (
							<>
								<Typography variant="body2" gutterBottom>
									OTP sent to: {emailOrMobile}
								</Typography>
								<TextField
									label="Enter OTP"
									variant="outlined"
									fullWidth
									margin="normal"
									value={otp}
									onChange={(e) => setOtp(e.target.value)}
									required
								/>
							</>
						)}
						<FormControlLabel
							control={
								<Switch
									checked={isAgent}
									onChange={(e) => setIsAgent(e.target.checked)}
									color="primary"
								/>
							}
							label="Is Agent"
						/>
						<Button
							type="submit"
							variant="contained"
							color="primary"
							fullWidth
							sx={{ mt: 2 }}
							disabled={loading}
						>
							{isOtpLogin ? (otpSent ? "Verify OTP" : "Send OTP") : "Login"}
						</Button>
						{isOtpLogin && otpSent && (
							<Button
								variant="outlined"
								color="secondary"
								fullWidth
								sx={{ mt: 1 }}
								onClick={handleEditMobile}
								disabled={loading}
							>
								Edit Mobile
							</Button>
						)}
					</form>
				</CardContent>
			</Card>
			<Toaster />
		</Box>
	);
}
