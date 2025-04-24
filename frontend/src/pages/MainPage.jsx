import "../styles/MainPage.css";
import PropTypes from "prop-types";

export default function MainPage({ memberInfo, handleItemClick }) {
  return (
    <div className="main-container">
      <img src={memberInfo.banner} alt="banner" />

      <div className="playlist-outer">
        <div className="playlist-wrapper">
          {memberInfo.playListData.map((list) => (
            <button
              key={list.resourceId.videoId}
              onClick={() =>
                handleItemClick(
                  list.title,
                  list.resourceId.videoId,
                  list.thumbnails.medium.url
                )
              }
              className="none-button"
            >
              <div className="playlist-item">
                <img src={list.thumbnails.medium.url} alt={list.title} />
                <p>{list.title}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

MainPage.propTypes = {
  memberInfo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    banner: PropTypes.string.isRequired,
    playListData: PropTypes.object,
  }).isRequired,
};
