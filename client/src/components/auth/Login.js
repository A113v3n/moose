import React, { Fragment, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login } from "../../actions/authActions";

const Login = ({ login, isAuthenticated }) => {
  // State using the useState hook to manage form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  // Event handler for input change
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Event handler for form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    login(email, password); // Call the login action with email and password
    console.log("SUCCESS");
  };

  // If the user is already authenticated, redirect to the dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  // Render the login form
  return (
    <Fragment>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Sign Into Your Account
      </p>
      {/* Login form */}
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => onChange(e)}
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      {/* Registration link */}
      <p className="my-1">
        Don't have an account? <Link to="/Register">Sign Up</Link>
      </p>
    </Fragment>
  );
};

// PropTypes for type checking
Login.propTypes = {
  login: PropTypes.func.isRequired, // login action
  isAuthenticated: PropTypes.bool, // authentication status
};

// Map the isAuthenticated state from Redux to component props
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

// Connect the component to Redux and export it
export default connect(mapStateToProps, { login })(Login);
