import { useRef } from "react";
import "../styles/Search.css";
export default function Search({ handleSearchList }) {
  const str = useRef();
  return (
    <div className="yt-search-container">
      <input
        ref={str}
        type="text"
        className="yt-search-input"
        placeholder="검색"
      />
      <button
        className="yt-search-button"
        onClick={() => handleSearchList(str.current.value)}
      >
        🔍
      </button>
    </div>
  );
}

//클릭 -> 사이드셋, data셋(members랑 비교) (파라미터: 검색어)
