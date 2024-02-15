import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { updateProfile } from "../../../actions/therapistActions";
import moment from "moment";

// The TherapistProfile function component
const TherapistProfile = () => {
  // This uses the useDispatch hook from react-redux to dispatch actions
  const dispatch = useDispatch();

  // This uses the useSelector hook from react-redux to select the current user from the state
  const therapist = useSelector((state) => state.auth.user);

  // Initial state for the availability array
  const [availability, setAvailability] = useState([]);

  // Initial state for the form data object
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    experience: "",
    specializations: "",
  });

  // Array of the days of the week
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // The useEffect hook runs the provided function after render. In this case, it runs after the component mounts and whenever the therapist state changes
  useEffect(() => {
    if (therapist) {
      const therapistAvailability = therapist.availability || [];
      const fullAvailability = daysOfWeek.map((day) => {
        const existingDay = therapistAvailability.find((d) => d.day === day);
        return existingDay || { day, timeRanges: [] };
      });
      setAvailability(fullAvailability);
      setFormData({
        firstName: therapist.firstName,
        lastName: therapist.lastName,
        email: therapist.email,
        phone: therapist.phone,
        bio: therapist.bio,
        experience: therapist.experience,
        specializations: therapist.specializations?.join(", "),
      });
    }
  }, [therapist]);

  // handleAvailabilityChange function updates the selected time range for a specific day in the availability array
  const handleAvailabilityChange = (
    dayIndex,
    timeRangeIndex,
    field,
    value
  ) => {
    const updatedProfile = [...availability];
    const updatedTimeRange = {
      ...updatedProfile[dayIndex].timeRanges[timeRangeIndex],
    };
    const formattedDate = moment(value)
      .utc()
      .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    updatedTimeRange[field] = formattedDate;
    updatedProfile[dayIndex].timeRanges[timeRangeIndex] = updatedTimeRange;
    setAvailability(updatedProfile);
  };

  // addTimeRange function adds a new time range to a specific day in the availability array
  const addTimeRange = (dayIndex) => {
    const updatedProfile = [...availability];
    updatedProfile[dayIndex].timeRanges.push({
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
    });
    setAvailability(updatedProfile);
  };

  // removeTimeRange function removes a specific time range from a specific day in the availability array
  const removeTimeRange = (dayIndex, timeRangeIndex) => {
    const updatedProfile = [...availability];
    updatedProfile[dayIndex].timeRanges.splice(timeRangeIndex, 1);
    setAvailability(updatedProfile);
  };

  // handleInputChange function updates the value of a specific field in the formData object
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handleSubmit function dispatches the updateProfile action with the updated data
  const handleSubmit = () => {
    const updatedData = {
      ...formData,
      specializations: formData.specializations.split(","),
      availability: JSON.stringify(availability),
    };

    console.log("Updated Data:", updatedData);
    dispatch(updateProfile(updatedData));
  };


  return (
    <div>
{ /* This is the title of the Therapist Profile page */ }
<h1>Therapist Profile</h1>
<div>
{ /* This displays the therapist's profile image*/ }
  <img src={therapist.profileImage} alt='Profile' />
</div>

<div>
  <strong>First Name:</strong>
  { /* This is an input field for the therapist's first name. The value of this field comes from the formData state object. The onChange event handler updates the value of this field in the state object when the user types into the field. */ }
  <input
    type="text"
    name="firstName"
    value={formData.firstName}
    onChange={handleInputChange}
  />
</div>

{ /* The same logic applies to the rest of the input fields */ }
<div>
  <strong>Last Name:</strong>
  <input
    type="text"
    name="lastName"
    value={formData.lastName}
    onChange={handleInputChange}
  />
</div>
      <div>
      <strong>Last Name:</strong>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <strong>Email:</strong>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <strong>Phone:</strong>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <strong>Bio:</strong>
        <input
          type="text"
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <strong>Experience:</strong>
        <input
          type="text"
          name="experience"
          value={formData.experience}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <strong>Specializations:</strong>
        <input
          type="text"
          name="specializations"
          value={formData.specializations}
          onChange={handleInputChange}
        />
      </div>
      <div>
      { /* This displays the therapist's maximum number of clients at once */ }
  <strong>Max Clients At Once:</strong> {therapist.maxClientsAtOnce}
</div>

<div>
  <strong>Availability:</strong>
  { /* This maps over the availability array from the state object and displays the therapist's availability for each day of the week*/ }
  {availability.map((item, dayIndex) => (
    <div key={dayIndex}>
      <h4>{item.day}</h4>
      { /* For each day, this maps over the timeRanges array and displays the start and end times for each time range */ }
      {item.timeRanges.map((timeRange, timeRangeIndex) => {
              const startTime = new Date(timeRange.startTime);
              const endTime = new Date(timeRange.endTime);
              return (
                <div key={timeRangeIndex}>

                { /* The `DatePicker` component is used to select the `startTime` and `endTime` for the therapist's availability. */ }
                { /* The `selected` prop specifies the currently selected date in the DatePicker. In this case, the `startTime` and `endTime` from each `timeRange` are used. */ }
                { /* The `dateFormat` prop is used to format the date in the DatePicker. Here, the time is being formatted in 12-hour format with an "am/pm" indicator. */ }
                { /* The `onChange` prop is a function that is called whenever the date changes. It takes the new date as its argument. The function `handleAvailabilityChange` is called whenever the date changes. */ }
                { /* The `showTimeSelect` prop makes it so the DatePicker lets you select a time instead of a date. */ }
                { /* The `showTimeSelectOnly` prop makes it so the DatePicker only shows time to be selected. */ }
                { /* The `timeIntervals` prop sets the intervals for the time selections in the DatePicker. In this case, it's set to 30 minutes. */ }
                { /* The `timeCaption` prop is used to provide a label for the time dropdown. */ }
                <DatePicker
                    selected={startTime}
                    dateFormat="h:mm aa"
                    onChange={(date) =>
                      handleAvailabilityChange(
                        dayIndex,
                        timeRangeIndex,
                        "startTime",
                        date
                      )
                    }
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={30}
                    timeCaption="Time"
                  />

                  <DatePicker
                    selected={endTime}
                    dateFormat="h:mm aa"
                    onChange={(date) =>
                      handleAvailabilityChange(
                        dayIndex,
                        timeRangeIndex,
                        "endTime",
                        date
                      )
                    }
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={30}
                    timeCaption="Time"
                  />
                  { /* This button, when clicked, calls the `removeTimeRange` function with the current `dayIndex` and `timeRangeIndex` to remove the specific time range from the therapist's availability. */ }
                  <button onClick={() => removeTimeRange(dayIndex, timeRangeIndex)}>
                    Remove Time Range
                  </button>
                </div>
              );
            })}
            { /* This button, when clicked, calls the `addTimeRange` function with the current `dayIndex` to add a new time range to the therapist's availability for that day. */ }
            <button onClick={() => addTimeRange(dayIndex)}>Add Time Range</button>
          </div>
        ))}
      </div>
      { /* This button, when clicked, calls the `handleSubmit` function to submit the form and update the therapist's profile with the new data. */ }
      <button onClick={handleSubmit}>Submit Changes</button>
    </div>
  );
};

export default TherapistProfile;