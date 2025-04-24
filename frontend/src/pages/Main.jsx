import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import Modal from "./Modal";
import SideBar from "./SideBar";
import MainPage from "./MainPage";
import IFrameModal from "./IFrameModal";
import PlayListModal from "./PlayListModal";
import Search from "./Search";
import { members as originalMembers } from "../data/members";

import "../styles/Header.css";
export default function Main() {
  let members = [...originalMembers];
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [member, setMember] = useState({
    id: "all",
    name: "전체",
    image: members[0].image,
    banner: members[0].banner,
    playListId: members[0].playListId,
    playListData: [],
  });
  const [song, setSong] = useState({ title: "", videoId: "" });
  const [playListView, setPlayListView] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [playlist, setPlaylist] = useState([]);
  const navigate = useNavigate();
  const profileRef = useRef();

  useEffect(() => {
    fetch("http://localhost:5000/api/me", {
      credentials: "include", //쿠키나 세션 같은 인증 정보를 같이 보내기 위해 꼭 들어가는 옵션
    })
      .then((res) => {
        if (!res.ok) throw new Error("not authenticated"); // ✅ 이거 무조건 있어야 함
        return res.json();
      })
      .then((data) => {
        setUserInfo(data.user);
        youtubePlaylistAPI();
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

  function handleItemClick(title, videoId, src) {
    setSong({ title: title, videoId: videoId });

    setPlaylist((prev) =>
      prev.some((item) => item.title === title)
        ? prev
        : [
            ...prev,
            {
              title: title,
              videoId: videoId,
              src: src,
            },
          ]
    );

    handlePlayListView(true);
  }

  function handleListClick(title, videoId, src) {
    setSong({ title: title, videoId: videoId });
    handlePlayListView(true);
  }
  function handlePlayListView(boolean) {
    setPlayListView(boolean);
  }
  function youtubePlaylistAPI() {
    fetch("http://localhost:5000/api/youtube", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ members }),
    })
      .then((res) => res.json())
      .then((data) => {
        data.forEach(setMembersAPI);
        const mem = members.find((m) => m.id === member.id);
        setMember(mem);
      })
      .catch((err) => {
        console.error("API호출실패: ", err);
      });
  }

  function setMembersAPI(d) {
    const member = members.find((m) => m.id === d.id);
    if (member) {
      member.playListData = d.playListData;
    }
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
          <div className="header-title">
            <Search />
          </div>
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
        <PlayListModal
          playlist={playlist}
          handleListClick={handleListClick}
          song={song}
        />
        <MainPage memberInfo={member} handleItemClick={handleItemClick} />
        <IFrameModal
          songInfo={song}
          playlistInfo={playlist}
          playListView={playListView}
          handlePlayListView={handlePlayListView}
          setSong={setSong}
        />
      </>
    );
  }
}
