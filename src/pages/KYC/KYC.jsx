//import { useNavigate } from "react-router-dom";
// import { back, front } from "../../assets/KYC";
// import axiosInstance from "../../utils/service";
import {
  AadharModal,
  Button,
  Input,
  KycNavbar,
  SignModal,
} from "../../components";
import "./KYC.scss";
import { useState } from "react";
import KycPaymentModal from "./KycPaymentModal/KycPaymentModal";
import axios from "axios";

const KYC = () => {
  //const navigate = useNavigate();

  // *modals
  const [showModal, setShowModal] = useState(false);
  const [showAadharModal, setShowAadharModal] = useState(false);
  const [showPancardModal, setShowPancardModal] = useState(false);
  const [showDLModal, setShowDLModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  // *states
  const [user, setUser] = useState({});
  const [driverId, setDriverId] = useState(null);
  const handleRegister = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/driver/signup`,
        user,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Set the content type to JSON
          },
        }
      );
      setDriverId(response.data.data._id);
      // navigate(`/cabs/kyc/payment`, {
      //   state: {
      //     driverId,
      //   }
      // });
      setShowPaymentModal(true);
    } catch (error) {
      alert("Something went wrong");
      console.error("Error registering user:", error);
    }
  };

  // useEffect(() => {
  //   const authenticateAndGetToken = async () => {
  //     try {
  //       const response = await axiosInstance.get(
  //         `${import.meta.env.VITE_BASE_URL}/api/kyc/authenticate`
  //       );
  //       setAccessToken(response.data.access_token);
  //     } catch (error) {
  //       console.error("Error:", error);
  //     }
  //   };

  //   authenticateAndGetToken();
  // }, []);

  const verifyBank = async () => {
    try {
      const requestData = {
        account_number: user.bankAccNum,
        ifsc: user.ifsc,
      };
      const token = localStorage.getItem("token")
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/kyc/bank/verify`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Set the content type to JSON
          },
        }
      );
      if (
        response.data?.status === "success" &&
        response.data?.data?.full_name
          .replace(/\s/g, "")
          .toLowerCase()
          .includes(user.accHolderName.replace(/\s/g, "").toLowerCase())
      ) {
        alert("Account verified");
      } else {
        alert("Invalid");
      }
    } catch (err) {
      console.error("Error while verifying bank details:", err);
    }
  };
  return (
    <div className="KYC">
      <KycNavbar />
      {showPaymentModal && (
        <KycPaymentModal onCancel={setShowPaymentModal} driverId={driverId} />
      )}
      {showModal && <SignModal onCancel={setShowModal} />}
      {showAadharModal && (
        <AadharModal
          user={user}
          setUser={setUser}
          typeOfDocument={"Aadhar"}
          onCancel={setShowAadharModal}
        />
      )}
      {showPancardModal && (
        <AadharModal
          user={user}
          setUser={setUser}
          typeOfDocument={"Pancard"}
          onCancel={setShowPancardModal}
        />
      )}
      {showDLModal && (
        <AadharModal
          user={user}
          setUser={setUser}
          typeOfDocument={"Driving License"}
          onCancel={setShowDLModal}
        />
      )}
      <div className="details">
        <h1>Complete KYC</h1>
        <p>Personal Details</p>
        <div className="detailsContainer">
          <h4>Enter your details</h4>
          <hr style={{ margin: 0 }} />
          <div className="inputs">
            <Input
              onChanged={setUser}
              givenName={"firstName"}
              title={"First Name"}
              type={"text"}
              isKyc={true}
            />
            <Input
              onChanged={setUser}
              givenName={"lastName"}
              title={"Last Name"}
              type={"text"}
              isKyc={true}
            />
            <Input
              onChanged={setUser}
              givenName={"phNum"}
              title={"Mobile"}
              type={"number"}
              isKyc={true}
            />
            <Input
              onChanged={setUser}
              givenName={"email"}
              title={"Email"}
              type={"email"}
              isKyc={true}
            />
            <Input
              onChanged={setUser}
              givenName={"password"}
              title={"Password"}
              type={"password"}
              isKyc={true}
            />
            <Input
              onChanged={setUser}
              givenName={"pincode"}
              title={"Pin Code"}
              type={"number"}
              isKyc={true}
            />
            <Input
              onChanged={setUser}
              givenName={"vehicleNumber"}
              title={"Vehicle Number"}
              type={"text"}
              isKyc={true}
            />
          </div>
        </div>
      </div>

      <div className="id">
        <p>ID Proof</p>
        <div className="idContainer">
          <h4>Enter your details</h4>
          <hr style={{ margin: 0 }} />
          <div className="idWrapper">
            <div className="left">
              <div className="buttons">
                <Button
                  onClicked={() => setShowAadharModal(true)}
                  text={"Aadhar Card"}
                />
                <Button
                  onClicked={() => setShowPancardModal(true)}
                  text={"Pan Card"}
                />
                <Button
                  onClicked={() => setShowDLModal(true)}
                  text={"Driving License"}
                />
              </div>
              <h5>Upload ID Proof</h5>
            </div>
            <hr style={{ margin: 0 }} />
            <div className="right">
              {/* <img src={front} alt="" />
              <img src={back} alt="" /> */}
            </div>
          </div>
        </div>
      </div>

      <div className="bankingDetails">
        <p>Banking Details</p>
        <div className="bankingDetailsContainer">
          <h4>Enter account details</h4>
          <hr style={{ margin: 0 }} />
          <div className="inputs">
            <Input
              onChanged={setUser}
              givenName={"accHolderName"}
              title={"Account Holder Name"}
              type={"text"}
              isKyc={true}
            />
            <Input
              onChanged={setUser}
              givenName={"bankAccNum"}
              title={"Account Number"}
              type={"number"}
              isKyc={true}
            />
            <Input
              onChanged={setUser}
              title={"Re-enter Account Number"}
              type={"number"}
              isKyc={true}
            />
            <Input
              onChanged={setUser}
              givenName={"ifsc"}
              title={"IFSC Code"}
              type={"text"}
              isKyc={true}
            />
          </div>
          <Button onClicked={verifyBank} text={"Verify"} />
        </div>
      </div>
      <div className="nextButton">
        <Button onClicked={handleRegister} text={"Next"} />
      </div>
    </div>
  );
};

export default KYC;
