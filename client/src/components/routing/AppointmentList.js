// src/components/AppointmentsList.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const res = await axios.get("/api/appointments");
      setAppointments(res.data);
    };
    fetchAppointments();
  }, []);

  const bookAppointment = async (id) => {
    try {
      const res = await axios.post(`/api/appointments/${id}/book`);
      setAppointments(
        appointments.map((appointment) =>
          appointment._id === id ? res.data : appointment
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Available Appointments</h2>
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment._id}>
            {appointment.date} - {appointment.time}
            <button onClick={() => bookAppointment(appointment._id)}>
              Book
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default AppointmentsList;
