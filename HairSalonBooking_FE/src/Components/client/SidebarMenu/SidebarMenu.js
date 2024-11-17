import { React } from "react";
import "./SidebarMenu.scss";
import { IoIosAperture } from "react-icons/io";
import { Link } from "react-router-dom";
export default function SidebarMenu({ show }) {
  return (
    <>
      <div className={show ? "sidebar active" : "sidebar"}>
        <IoIosAperture className="sidebar__logo" />
        <ul>
          <li>
            <Link to="#">User</Link>
          </li>
          <li>
            <Link to="#">About us</Link>
          </li>
          <li>
            <Link>Contact us</Link>
          </li>
        </ul>
      </div>
    </>
  );
}
