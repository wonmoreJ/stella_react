import "../styles/SideBar.css";
import { members } from "../data/members";
import PropTypes from "prop-types";
import sideIcon from "../assets/icon.png";
export default function SideBar({
  handleSideClick,
  setIsSidebarOpen,
  isSidebarOpen,
  memberInfo,
}) {
  return (
    <div className={`sidebar ${isSidebarOpen ? "" : "collapsed"}`}>
      <header>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>🟰</button>
      </header>

      <div className="sidebar-content">
        {members.map((member) => (
          <button
            key={member.id}
            onClick={() => handleSideClick(member.id)}
            className="none-button"
          >
            <div
              className={`sidebar-item ${member.id} ${
                member.id === memberInfo.id && "selected"
              }`}
            >
              <img src={member.image} alt={member.id} />
              <span>{member.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

SideBar.propTypes = {
  handleSideClick: PropTypes.func.isRequired,
  setIsSidebarOpen: PropTypes.func.isRequired,
  isSidebarOpen: PropTypes.bool,
  memberInfo: PropTypes.object,
};
