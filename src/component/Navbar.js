import React from "react";

export default function Navbar(props) {
  return (
    <React.Fragment>
      <nav
        id="topnav"
        className="defaultscroll is-sticky nav-sticky">
        <div
          className="container"
        >
          <div className="logo py-2" to="/">
            <img
              src="/logo.jpg"
              width="100"
              alt="Quiz logo"
            />
          </div>
        </div>
      </nav>
      {/* End Navbar  */}
    </React.Fragment>
  );
}
