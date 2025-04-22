import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import Modal from "./Modal";
import SideBar from "./SideBar";
import MainPage from "./MainPage";

import "../styles/Header.css";
export default function Main() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [isModal, setIsModal] = useState(false);
  const navigate = useNavigate();
  const profileRef = useRef();

  useEffect(() => {
    fetch("http://localhost:5000/api/me", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("not authenticated"); // ✅ 이거 무조건 있어야 함
        return res.json();
      })
      .then((data) => {
        setUserInfo(data.user);
      })
      .catch(() => {
        navigate("/"); // ❌ 인증 실패 → 홈으로
      });
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        isModal &&
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setIsModal(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModal]);

  if (userInfo?.displayName) {
    return (
      <>
        <SideBar />
        <header className="header">
          <div className="header-title">Stellive</div>
          <div className="profile-box" ref={profileRef}>
            {/* <span className="username">{userInfo.displayName}</span> */}
            <button
              onClick={() => setIsModal(isModal ? false : true)}
              className="profile-button"
            >
              <img
                src={userInfo.photo}
                alt="프로필사진"
                className="profile-img"
              />
            </button>
            {isModal && <Modal onClose={() => setIsModal(false)} />}
          </div>
        </header>

        <MainPage />
      </>
    );
  }
}
