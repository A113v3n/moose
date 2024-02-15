// Importing necessary elements from various libraries
import React, { Fragment, useState } from "react"; // Importing React and hooks from 'react'
import { connect } from "react-redux"; // To connect our component to the Redux store
import { Link, Navigate } from "react-router-dom"; // For routing and navigation
import PropTypes from "prop-types"; // To document the intended types of properties passed to components
import moment from "moment"; // A JavaScript library for parsing, validating, manipulating, and displaying dates and times
import DayAvailability from "../../utils/dayAvailability"; // Importing a utility file
import { setAlert } from "../../actions/alertActions"; // Action from the Redux alert actions
import { register } from "../../actions/authActions"; // Action from the Redux auth actions
import {
  convertToMinutes,
  isDuplicateTimeRange,
  generateTimeOptions,
} from "../../utils/timeRange"; // Importing utility functions for time range manipulation

// TherapistRegister is a functional component that receives props
const TherapistRegister = ({ setAlert, register, isAuthenticated }) => {

  // The useState hook allows React function components to have state
  // Here, we initialize our form data state with default values
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    password2: "",
    phone: "",
    availability: {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    },
  });

  // Destructuring data from formData state so we can use these as variables
  const {
    firstName,
    lastName,
    email,
    password,
    password2,
    phone,
    availability,
  } = formData;

  // generateTimeOptions is a utility function that creates an array of time options
  const timeOptions = generateTimeOptions();

  // onChange is a function that handles form input changes
  // It updates the formData state with the new value of the input field
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // onSubmit is a function that handles the form submission
  const onSubmit = async (e) => {
    e.preventDefault(); // Prevents the page from reloading upon form submission
    if (password !== password2) {
      setAlert("Passwords do not match", "danger"); // Show alert if passwords do not match
    } else {
      // If passwords match, we format the availability data and register the user
      // Other business logic can be added here as required
      const formattedAvailability = Object.entries(availability).flatMap(
        ([day, timeRanges]) =>
          timeRanges.map(({ startTime, endTime }) => {
            const startDate = moment(startTime, "h:mm A");
            const endDate = moment(endTime, "h:mm A");

            return {
              day,
              startTime: startDate.toISOString(),
              endTime: endDate.toISOString(),
            };
          })
      );

      register({
        accountType: 2, // Set accountType to 2 for therapists
        firstName,
        lastName,
        email,
        password,
        password2,
        phone,
        availability: formattedAvailability,
      });
    }
  };
  // addTimeRange is a function that adds a new time range to a specific day in the therapist's availability.
  const addTimeRange = (day) => {
    // Here we set the default start and end time for the new time range.
    const newStartTime = "12:00 AM";
    const newEndTime = "01:00 AM";

    // We then check if this new time range is a duplicate of an existing time range for the same day.
    // isDuplicateTimeRange is a helper function that checks if a given time range overlaps with existing time ranges for the same day.
    if (isDuplicateTimeRange(day, availability, newStartTime, newEndTime)) {
      // If it is a duplicate, we use the setAlert function to display an error message.
      setAlert("Duplicate time range not allowed", "danger");
    } else {
      // If it is not a duplicate, we update our state to include this new time range.
      setFormData({
        ...formData,
        availability: {
          ...formData.availability,
          [day]: [
            ...formData.availability[day],
            { startTime: newStartTime, endTime: newEndTime },
          ],
        },
      });
    }
  };

  // updateTimeRange is a function that updates an existing time range for a specific day in the therapist's availability.
  const updateTimeRange = (day, index, field, value) => {
    // We first create a new time range object, updatedTimeRange, with the updated field.
    const updatedTimeRange = {
      ...formData.availability[day][index],
      [field]: value,
    };

    // We then check if this updated time range overlaps with any other time ranges for the same day.
    // isDuplicateTimeRange is a helper function that checks if a given time range overlaps with existing time ranges for the same day.
    const isOverlapping = isDuplicateTimeRange(
      day,
      availability,
      updatedTimeRange.startTime,
      updatedTimeRange.endTime,
      index
    );

    if (isOverlapping) {
      // If it does overlap, we use the setAlert function to display an error message.
      setAlert("Overlapping time range not allowed", "danger");
    } else {
      // If it does not overlap, we update our state to include this updated time range.
      const updatedDay = formData.availability[day].map((timeRange, i) =>
        i === index ? updatedTimeRange : timeRange
      );

      setFormData({
        ...formData,
        availability: {
          ...formData.availability,
          [day]: updatedDay,
        },
      });
    }
  };

  // removeTimeRange is a function that removes a specific time range from a specific day in the therapist's availability.
  const removeTimeRange = (day, index) => {
    // We update our state to exclude the specified time range.
    setFormData({
      ...formData,
      availability: {
        ...formData.availability,
        [day]: formData.availability[day].filter((_, i) => i !== index),
      },
    });
  };

  // If the user is already authenticated, we redirect them to the dashboard.
  if (isAuthenticated) {
    return <Navigate to='/dashboard' />;
  }

  // Here you would return your component's JSX which is not shown in this code snippet.
  return (
<Fragment>
  {/* A heading is created with the text "Therapist Sign Up". 
  The 'large' and 'text-primary' classes are being used for styling. */}
  <h1 className='large text-primary'>Therapist Sign Up</h1>

  {/* A paragraph is added with some text and an icon. */}
  <p className='lead'>
    <i className='fas fa-user'></i> Create Your Therapist Account
  </p>

  {/* A form is created with an onSubmit event that triggers the onSubmit function when the form is submitted. */}
  <form className='form' onSubmit={(e) => onSubmit(e)}>
    {/* The following are form groups for input fields. Each of them has an onChange event that updates the respective state variable when the input value changes. */}
    <div className='form-group'>
      <input
        type='text'
        placeholder='First Name'
        name='firstName'
        value={firstName}
        onChange={(e) => onChange(e)}
      />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Last Name'
            name='lastName'
            value={lastName}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={password}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm Password'
            name='password2'
            value={password2}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='tel'
            placeholder='Phone Number'
            name='phone'
            value={phone}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <h3>Availability</h3>
          {Object.entries(availability).map(([day, timeRanges]) => (
            <DayAvailability
              key={day}
              day={day}
              timeRanges={timeRanges}
              timeOptions={timeOptions}
              updateTimeRange={updateTimeRange}
              removeTimeRange={removeTimeRange}
              addTimeRange={addTimeRange}
              isDuplicateTimeRange={isDuplicateTimeRange}
            />
          ))}
        </div>
        <input type='submit' className='btn btn-primary' value='Register' />
      </form>
      <p className='my-1'>
    Already have an account? <Link to='/Login'>Sign In</Link>
  </p>
</Fragment>
);

// Here we define the propTypes for the component. This is a way of checking that the right types of props are passed to the component.
TherapistRegister.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
}};

// mapStateToProps is a function that takes the current state and returns an object that gets passed as props to the component. In this case, it's taking the isAuthenticated property from the auth part of the state.
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

// The connect function from react-redux is used to connect our TherapistRegister component to the Redux store. The mapStateToProps function and the action creators (setAlert and register) are passed as arguments to the connect function.
export default connect(mapStateToProps, { setAlert, register })(
  TherapistRegister
);
