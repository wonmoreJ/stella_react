import { useEffect, useContext } from "react";
import "./../styles/Login.css";
import LogoImg from "../assets/logo.png";
import GoogleImg from "../assets/googleLogin.png";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function Login() {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useContext(UserContext);
  const baseURL = process.env.REACT_APP_API_BASE;
  console.log(baseURL);
  useEffect(() => {
    fetch(`${baseURL}/api/me`, {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("not authenticated");
      })
      .then((data) => {
        setUserInfo(data.user);
        navigate("/main");
      })
      .catch(() => {
        navigate("/");
      });
  }, []);

  const handleGoogleLogin = () => {
    window.location.href = `${baseURL}/auth/google`;
  };

  return (
    <div className="login-wrapper">
      <div className="image-toggle-box">
        <img src={LogoImg} alt="로고" className="logo-img" tabIndex={-1} />
        <button onClick={handleGoogleLogin} className="google-button">
          <img
            src={GoogleImg}
            alt="구글 로그인"
            className="google-img"
            tabIndex={-1}
          />
        </button>
      </div>
    </div>
  );
}
