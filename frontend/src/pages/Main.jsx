import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import Modal from "./Modal";
import SideBar from "./SideBar";
import MainPage from "./MainPage";

import { members } from "../data/members";

import "../styles/Header.css";
export default function Main() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [member, setMember] = useState({
    id: "all",
    name: "전체",
    image: members[0].uni,
    banner: members[0].banner,
  });
  const [isModal, setIsModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
  }, [navigate, setUserInfo]);

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

  function handleSideClick(id) {
    const memData = members.find((mem) => mem.id === id);

    setMember(memData);
  }

  if (userInfo?.displayName) {
    return (
      <>
        <SideBar
          handleSideClick={handleSideClick}
          setIsSidebarOpen={setIsSidebarOpen}
          isSidebarOpen={isSidebarOpen}
          memberInfo={member}
        />
        <header className="header">
          <div className="header-title">검색창</div>
          <div className="profile-box" ref={profileRef}>
            {/* <span className="username">{userInfo.displayName}</span> */}
            <button
              onClick={() => setIsModal(!isModal)}
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

        <MainPage memberInfo={member} />
      </>
    );
  }
}
