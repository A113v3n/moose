// We're importing the necessary modules here.
// React is the base library for creating components.
// useState is a React hook that allows us to create a local state in the component.
// connect is a function from react-redux library that allows us to connect this component to Redux store.
// Link and Navigate are components from the react-router-dom library for navigation.
// setAlert and register are Redux action creators that we'll dispatch from this component.
// PropTypes is a library for type checking the props that are passed to a component.
import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { setAlert } from "../../actions/alertActions";
import { register } from "../../actions/authActions";
import PropTypes from "prop-types";

// Here we're defining a functional component called Register.
// It receives several props: setAlert, register, and isAuthenticated.
// setAlert and register are action creators that we'll dispatch.
// isAuthenticated is a value from Redux state that we'll use to determine whether to redirect the user.
const Register = ({ setAlert, register, isAuthenticated }) => {
  // We're creating a local state called formData. It holds the values of the form fields.
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    password2: "",
    preferredTouch: "",
    areasToFocus: "",
    areasToAvoid: "",
    dateOfBirth: "",
    onMedication: false,
    medicationList: "",
    isPregnant: false,
    weeksPregnant: "",
  });

  // We're destructuring the formData object to get the values of the form fields.
  const {
    firstName,
    lastName,
    email,
    password,
    password2,
    phone,
    preferredTouch,
    areasToFocus,
    areasToAvoid,
    dateOfBirth,
    onMedication,
    medicationList,
    isPregnant,
    weeksPregnant,
  } = formData;

  // This is an event handler for changes in form fields.
  const onChange = (e) => {
    // Depending on the type of the form field, we're getting its current value.
    let value;
    if (e.target.type === "checkbox") {
      value = e.target.checked;
    } else if (e.target.type === "radio" && e.target.name === "isPregnant") {
      value = e.target.value === "true";
    } else if (e.target.type === "radio" && e.target.name === "onMedication") {
      value = e.target.value === "true";
    } else {
      value = e.target.value;
    }

    // We're updating the formData state with the new value of the form field.
    setFormData({ ...formData, [e.target.name]: value });
  };

  // This is an event handler for the form submission.
  const onSubmit = async (e) => {
    // We're preventing the default form submission.
    e.preventDefault();

    // If the passwords do not match, we're dispatching the setAlert action with a message and a type.
    if (password !== password2) {
      setAlert("Passwords do not match", "danger");
    } else {
      // Otherwise, we're dispatching the register action with the form data.
      register({
        firstName,
        lastName,
        email,
        password,
        password2,
        phone,
        preferredTouch,
        areasToFocus,
        areasToAvoid,
        dateOfBirth,
        onMedication,
        medicationList,
        isPregnant,
        weeksPregnant,
      });
    }
  };

// Check if the user is authenticated
if (isAuthenticated) {
  // If the user is authenticated, redirect to the dashboard
  return <Navigate to='/dashboard' />;
}

// If the user is not authenticated, display the sign up form
return (
  // Fragment is used to group list of children without adding extra nodes to the DOM
  <Fragment>
    <h1 className='large text-primary'>Sign Up</h1>
    <p className='lead'>
      <i className='fas fa-user'></i> Create Your Account
    </p>
    {/* onSubmit is the event that will be fired when the form is submitted */}
    <form className='form' onSubmit={(e) => onSubmit(e)}>
      {/* ...existing input fields... */}
      {/* Each form-group contains one input field */}
      <div className='form-group'>
        {/* Input field for first name */}
        <input
          type='text'
          placeholder='First Name'
          name='firstName'
          value={firstName}
          onChange={(e) => onChange(e)}
        />
      </div>
      {/* Input field for last name */}
      <div className='form-group'>
        <input
          type='text'
          placeholder='Last Name'
          name='lastName'
          value={lastName}
          onChange={(e) => onChange(e)}
        />
      </div>
      {/* Input field for email */}
      <div className='form-group'>
        <input
          type='email'
          placeholder='Email Address'
          name='email'
          value={email}
          onChange={(e) => onChange(e)}
        />
      </div>
      {/* Input field for phone number */}
      <div className='form-group'>
        <input
          type='tel'
          placeholder='Phone Number'
          name='phone'
          value={phone}
          onChange={(e) => onChange(e)}
        />
      </div>
      {/* Input field for password */}
      <div className='form-group'>
        <input
          type='password'
          placeholder='Password'
          name='password'
          value={password}
          onChange={(e) => onChange(e)}
        />
      </div>
      {/* Input field for confirm password */}
      <div className='form-group'>
        <input
          type='password'
          placeholder='Confirm Password'
          name='password2'
          value={password2}
          onChange={(e) => onChange(e)}
        />
      </div>
      {/* Dropdown for preferred touch */}
      <div className='form-group'>
        <label htmlFor='preferredTouch'>Preferred Touch:</label>
        <select
          name='preferredTouch'
          id='preferredTouch'
          value={preferredTouch}
          onChange={(e) => onChange(e)}
        >
          <option value=''>Choose an option</option>
          <option value='light'>Light</option>
          <option value='medium'>Medium</option>
          <option value='firm'>Firm</option>
        </select>
      </div>

  {/* The component continues by rendering form fields for the user to input their information */}

<div className='form-group'>
  <label htmlFor='areasToFocus'>Areas to Focus:</label>
  {/* This dropdown allows the user to select an area they would like to focus on */}
  <select
    name='areasToFocus'
    id='areasToFocus'
    value={areasToFocus}
    onChange={(e) => onChange(e)} // This onChange handler updates the `areasToFocus` state when the user selects an option
  >
    <option value=''>Choose an area</option>
    {/* These options represent different areas a user might want to focus on */}
    <option value='head'>Head</option>
    <option value='neck'>Neck</option>
            <option value='shoulders'>Shoulder</option>
            <option value='arms'>Arms</option>
            <option value='upper back'>Upper Back</option>
            <option value='lower back'>Lower Back</option>
            <option value='legs'>Legs</option>
            <option value='feet'>Feet</option>
          </select>
        </div>
        <div className='form-group'>
          <label htmlFor='areasToAvoid'>Areas to Avoid:</label>
          <select
            name='areasToAvoid'
            id='areasToAvoid'
            value={areasToAvoid}
            onChange={(e) => onChange(e)}
          >
            <option value=''>Choose an area</option>
            <option value='head'>Head</option>
            <option value='neck'>Neck</option>
            <option value='shoulders'>Shoulder</option>
            <option value='arms'>Arms</option>
            <option value='upper back'>Upper Back</option>
            <option value='lower back'>Lower Back</option>
            <option value='legs'>Legs</option>
            <option value='feet'>Feet</option>
          </select>
        </div>
        <div className='form-group'>
          <label htmlFor='dateOfBirth'>Birthdate:</label>
          <input
            type='date'
            name='dateOfBirth'
            id='dateOfBirth'
            value={dateOfBirth}
            onChange={(e) => onChange(e)}
          />
        </div>

        <div className='form-group'>
  {/* The `isPregnant` field is a set of radio buttons, allowing for a yes/no response */}
  <label htmlFor='isPregnant'>Are you pregnant?</label>
  <div>
    <>
      <input
        type='radio'
        name='isPregnant'
        id='isPregnantYes'
        value='true'
        checked={isPregnant === true} // This checks the `isPregnant` state and marks this input as selected if it's true
        onChange={(e) => onChange(e)} // This onChange handler updates the `isPregnant` state when the user selects this option
      />
      <label htmlFor='isPregnantYes'>Yes</label>
            </>
            <>
              <input
                type='radio'
                name='isPregnant'
                id='isPregnantNo'
                value='false'
                checked={isPregnant === false}
                onChange={(e) => onChange(e)}
              />
              <label htmlFor='isPregnantNo'>No</label>
            </>
          </div>
        </div>
        {isPregnant && (
          <div className='form-group'>
            <label htmlFor='weeksPregnant'>Weeks pregnant:</label>
            <select
              name='weeksPregnant'
              id='weeksPregnant'
              value={weeksPregnant}
              onChange={(e) => onChange(e)}
            >
              <option value=''>Choose a week</option>
              {Array.from({ length: 40 }, (_, i) => (
                <option value={i + 1} key={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className='form-group'>
          <label htmlFor='onMedication'>Are you on medication?</label>
          <div>
            <>
              <input
                type='radio'
                name='onMedication'
                id='onMedicationYes'
                value='true'
                checked={onMedication === true}
                onChange={(e) => onChange(e)}
              />
              <label htmlFor='onMedicationYes'>Yes</label>
            </>
            <>
              <input
                type='radio'
                name='onMedication'
                id='onMedicationNo'
                value='false'
                checked={onMedication === false}
                onChange={(e) => onChange(e)}
              />
              <label htmlFor='onMedicationNo'>No</label>
            </>
          </div>
        </div>
        {onMedication && (
          <div className='form-group'>
            <label htmlFor='medicationList'>List the medication:</label>
            <input
              type='text'
              name='medicationList'
              id='medicationList'
              value={medicationList}
              onChange={(e) => onChange(e)}
            />
          </div>
        )}

{/* The form concludes with a 'Register' button, which when clicked, will submit the form data */}
<input type='submit' className='btn btn-primary' value='Register' />
</form>
<p className='my-1'>
  {/* If the user already has an account, they can click this link to be navigated to the Login page */}
  Already have an account? <Link to='/Login'>Sign In</Link>
</p>
</Fragment>
  );
};

// `propTypes` is used for type checking in React. It checks that the correct types of props are passed to the component
Register.propTypes = {
  setAlert: PropTypes.func.isRequired, // `setAlert` function is required as a prop
  register: PropTypes.func.isRequired, // `register` function is required as a prop
  isAuthenticated: PropTypes.bool, // `isAuthenticated` is expected to be a boolean
};

// `mapStateToProps` is a function used with Redux. It allows us to pull state from the Redux store and map it to the props of our component
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated, // This line maps `state.auth.isAuthenticated` from the Redux store to the `isAuthenticated` prop of this component
});

// `connect` is a function from `react-redux`. It connects a React component to the Redux store
// Here it connects the `mapStateToProps` and the `setAlert` and `register` action creators to the `Register` component
export default connect(mapStateToProps, { setAlert, register })(Register);