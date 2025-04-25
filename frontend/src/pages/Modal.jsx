import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import "../styles/Modal.css";

export default function Modal({ onClose }) {
  const { userInfo } = useContext(UserContext);
  const baseURL = process.env.REACT_APP_API_BASE;

  function logOut() {
    fetch(`${baseURL}/api/logout`, {
      method: "POST",
      credentials: "include",
    }).then(() => {
      window.location.href = "/";
    });
  }
  return (
    <div className="modal-container" onClick={(e) => e.stopPropagation()}>
      <button className="modal-close" onClick={onClose}>
        ×
      </button>
      <img src={userInfo.photo} alt="프로필" className="modal-img" />
      <p className="modal-name">{userInfo.displayName}님, 대박박~</p>
      <button className="modal-btn" onClick={logOut}>
        로그아웃
      </button>
    </div>
  );
}
