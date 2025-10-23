import { NavLink } from "react-router-dom";
import "./Layout.css";

export default function Sidebar() {
  return (
    <aside className="dashboard-sidebar">
      <nav>
        <ul className="sidebar-nav">
          <li>
            <NavLink to="/patient-dashboard">Home</NavLink>
          </li>
          <li>
            <NavLink to="/my-appointments">Calendar</NavLink>
          </li>
          <li>
            <NavLink to="/help-feedback">Help / Feedback</NavLink>
          </li>
          <li>
            <NavLink to="/settings">Settings</NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
