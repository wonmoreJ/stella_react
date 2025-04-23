import "../styles/MainPage.css";
import PropTypes from "prop-types";

export default function MainPage({ memberInfo }) {
  return (
    <div className="main-container">
      <img src={memberInfo.banner} alt="banner" />
    </div>
  );
}

MainPage.propTypes = {
  memberInfo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    banner: PropTypes.string.isRequired,
  }).isRequired,
};
