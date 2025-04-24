import "../styles/Search.css";
export default function Search() {
  return (
    <div className="yt-search-container">
      <input type="text" className="yt-search-input" placeholder="검색" />
      <button className="yt-search-button">🔍</button>
    </div>
  );
}
