import { useState } from "react";
import "../styles/PlayListModal.css";

export default function PlayListModal({ playlist, handleListClick, song }) {
  const [isPlayListModal, setIsPlayListModal] = useState(false);

  return (
    <aside className="playlistmodal-modal">
      <div className="playlistmodal-header">
        <h2 className="playlistmodal-title">재생목록</h2>
        <div className="playlistmodal-buttons">
          <button
            className="playlist-scroll-btn"
            onClick={() => setIsPlayListModal(!isPlayListModal)}
          >
            {isPlayListModal ? "▼" : "▲"}
          </button>
        </div>
      </div>

      <div
        className="playlistmodal-scroll"
        id="playlistScrollContainer"
        style={{
          height: isPlayListModal ? "444px" : "0px",
          paddingTop: isPlayListModal ? "4px" : "0px",
          paddingBottom: isPlayListModal ? "4px" : "0px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "stretch",
          transition: "height 0.3s ease, padding 0.3s ease",
          marginTop: isPlayListModal ? "14px" : "0px",
        }}
      >
        {playlist.map((list) => (
          <button
            className="none-button"
            key={list.title}
            onClick={() => handleListClick(list.title, list.videoId, list.url)}
          >
            <div
              className={`playlistmodal-item ${
                song.title === list.title ? "selected" : ""
              }`}
            >
              <img src={list.src} alt="썸네일" />
              <span className="playlistmodal-text">{list.title}</span>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
