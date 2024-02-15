import React, { useState, useEffect, useRef, Fragment } from "react";

// Importing SVG icons and components
import { ReactComponent as CogIcon } from "../../imgs/icons/cog.svg";
import { ReactComponent as ChevronIcon } from "../../imgs/icons/chevron.svg";
import { ReactComponent as ArrowIcon } from "../../imgs/icons/arrow.svg";
import { ReactComponent as BoltIcon } from "../../imgs/icons/bolt.svg";
import { ReactComponent as Logo } from "../../imgs/icons/logosmall.svg";
import { FiChevronDown, FiHome } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/authActions";
// Importing CSSTransition for animating menu transitions
import { CSSTransition } from "react-transition-group";

// Main Nav component
function Nav({ auth: { isAuthenticated, loading }, logout }) {
  const authLinks = (
    <ul
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: "10px",
        marginRight: "20px",
        listStyleType: "none",
      }}
    >
      <li style={{ marginRight: "10px" }}>
        <Link onClick={logout} to='/'>
          Logout
        </Link>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: "10px",
        marginRight: "20px",
        listStyleType: "none",
      }}
    >
      <li style={{ marginRight: "10px" }}>
        <Link to='/login'>Login</Link>
      </li>
      <li style={{ marginRight: "10px" }}>
        <Link to='/register'>Register</Link>
      </li>
    </ul>
  );
  return (
    <div>
      <Navbar>
        <NavLogo className='logo-button' icon={<Logo />} />
        <div className='nav-items-container'>
          {!loading && (
            <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
          )}

          <NavItem icon={<FiHome />} />
          <NavItem icon={<FiChevronDown />}>
            <DropdownMenu />
          </NavItem>
        </div>
      </Navbar>
    </div>
  );
}

// Navbar component
function Navbar(props) {
  return (
    <nav className='navbar'>
      <ul className='navbar-nav'>{props.children}</ul>
    </nav>
  );
}

// NavLogo component for displaying the logo
function NavLogo(props) {
  return (
    <li className='navbar-logo'>
      <a href='#' className='logo-button logo-button-logo'>
        {props.icon}
      </a>
    </li>
  );
}

// NavItem component for displaying individual navigation items
function NavItem(props) {
  const [open, setOpen] = useState(false);

  return (
    <li className='nav-item'>
      <a href='#' className='icon-button' onClick={() => setOpen(!open)}>
        {props.icon}
      </a>

      {open && props.children}
    </li>
  );
}

// DropdownMenu component for handling the dropdown menus
function DropdownMenu() {
  const [activeMenu, setActiveMenu] = useState("main");
  const [menuHeight, setMenuHeight] = useState(null);
  const dropdownRef = useRef(null);

  // Set the initial menu height
  useEffect(() => {
    setMenuHeight(dropdownRef.current?.firstChild.offsetHeight);
  }, []);

  // Calculate the height of the menu
  function calcHeight(el) {
    const height = el.offsetHeight;
    setMenuHeight(height);
  }

  // DropdownItem component for displaying individual dropdown items
  function DropdownItem(props) {
    return (
      <a
        href='#'
        className='menu-item'
        onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}
      >
        <span className='icon-button'>{props.leftIcon}</span>
        <span className='menu-item-text'>{props.children}</span>
        <span className='icon-right'>{props.rightIcon}</span>
      </a>
    );
  }

  // Return the dropdown menu with CSSTransitions for animating between menus
  return (
    <div className='dropdown' style={{ height: menuHeight }} ref={dropdownRef}>
      {/* Main menu */}
      <CSSTransition
        in={activeMenu === "main"}
        timeout={500}
        classNames='menu-primary'
        unmountOnExit
        onEnter={calcHeight}
      >
        <div className='menu'>
          <DropdownItem>My Profile</DropdownItem>
          <DropdownItem
            leftIcon={<CogIcon />}
            rightIcon={<ChevronIcon />}
            goToMenu='settings'
          >
            Settings
          </DropdownItem>
          <DropdownItem
            leftIcon='🦧'
            rightIcon={<ChevronIcon />}
            goToMenu='animals'
          >
            Animals
          </DropdownItem>
        </div>
      </CSSTransition>

      {/* Settings menu */}
      <CSSTransition
        in={activeMenu === "settings"}
        timeout={500}
        classNames='menu-secondary'
        unmountOnExit
        onEnter={calcHeight}
      >
        <div className='menu'>
          <DropdownItem goToMenu='main' leftIcon={<ArrowIcon />}>
            <h2>My Tutorial</h2>
          </DropdownItem>
          <DropdownItem leftIcon={<BoltIcon />}>HTML</DropdownItem>
          <DropdownItem leftIcon={<BoltIcon />}>CSS</DropdownItem>
          <DropdownItem leftIcon={<BoltIcon />}>JavaScript</DropdownItem>
          <DropdownItem leftIcon={<BoltIcon />}>Awesome!</DropdownItem>
        </div>
      </CSSTransition>

      {/* Animals menu */}
      <CSSTransition
        in={activeMenu === "animals"}
        timeout={500}
        classNames='menu-secondary'
        unmountOnExit
        onEnter={calcHeight}
      >
        <div className='menu'>
          <DropdownItem goToMenu='main' leftIcon={<ArrowIcon />}>
            <h2>Animals</h2>
          </DropdownItem>
          <DropdownItem leftIcon='🦘'>Kangaroo</DropdownItem>
          <DropdownItem leftIcon='🐸'>Frog</DropdownItem>
          <DropdownItem leftIcon='🦋'>Horse?</DropdownItem>
          <DropdownItem leftIcon='🦔'>Hedgehog</DropdownItem>
        </div>
      </CSSTransition>
    </div>
  );
}
Nav.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, { logout })(Nav);
