import { useEffect, useRef, useState } from "react";
import "../styles/IFrameModal.css";

export default function IFrameModal({
  songInfo,
  playListView,
  handlePlayListView,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const playerRef = useRef(null);
  const playerInstance = useRef(null);

  useEffect(() => {
    const loadYTScript = () => {
      if (!window.YT) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
      }

      // YT 준비되었는지 polling
      const checkYTReady = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(checkYTReady);
          playerInstance.current = new window.YT.Player(playerRef.current, {
            height: "360",
            width: "640",
            videoId: songInfo.videoId,
          });
        }
      }, 100);
    };

    loadYTScript();

    return () => {
      if (playerInstance.current) {
        playerInstance.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (playerInstance.current && songInfo.videoId && playListView) {
      playerInstance.current.loadVideoById(songInfo.videoId);
    }
  }, [songInfo]);

  useEffect(() => {
    if (playerInstance.current) {
      playerInstance.current.setSize("100%", isExpanded ? "450" : "0");
    }
  }, [isExpanded]);

  const handlePlay = () => {
    playerInstance.current?.playVideo();
  };

  const handlePause = () => {
    playerInstance.current?.pauseVideo();
  };

  return (
    <div className={playListView ? "video-card" : "none"}>
      <div className="video-header">
        <div className="video-title-wrap">
          <span className="video-title-text">{songInfo.title}</span>
          {!isExpanded && (
            <>
              <button onClick={handlePlay}>🔊</button>
              <button onClick={handlePause}>⏸</button>
            </>
          )}
        </div>

        <div className="video-toggle-buttons">
          <button onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? "⬇️" : "⬆️"}
          </button>
          <button
            onClick={() => {
              handlePause();
              setIsExpanded(false);
              handlePlayListView(false);
            }}
          >
            ✖️
          </button>
        </div>
      </div>
      <div
        className="youtube-player"
        style={{
          height: isExpanded ? "450px" : "0px",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transition: "height 0.3s ease",
          paddingBottom: isExpanded ? "16px" : "0px",
        }}
      >
        <div ref={playerRef}></div>
      </div>
    </div>
  );
}
