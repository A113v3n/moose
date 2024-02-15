import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { format, parseISO } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { fetchTherapists, fetchLocations } from "../../actions/bookingActions";

function BookingConfirmation() {
  const booking = useSelector(state => state.booking.booking);
  const locations = useSelector(state => state.booking.locations);
  const therapists = useSelector(state => state.booking.therapists);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchTherapists());
    dispatch(fetchLocations());
  }, [dispatch]);

  if (!booking) {
    return (
      <div>
        <h1>No booking data available</h1>
      </div>
    );
  }

  // Find the location object with the matching ID
  const location = locations.find(loc => loc._id === booking.location);
  // Find the therapist object with the matching ID
  const therapist = therapists.find(therapist => therapist._id === booking.therapist);

  // Show booking confirmation
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const startTime = format(utcToZonedTime(booking.start, userTimezone), 'p');
  const endTime = format(utcToZonedTime(booking.end, userTimezone), 'p');
  const bookingDate = format(parseISO(booking.date), 'yyyy-MM-dd');

  return (
    <div>
      <h1>Booking Confirmation</h1>
      <p>Your booking has been confirmed. Here are the details:</p>
      <ul>
        <li>Location: {location ? location.name : "Unknown"}</li>
        <li>Duration: {booking.duration}</li>
        <li>Date: {bookingDate}</li>
        <li>Time Slot: {startTime} - {endTime}</li>
        <li>Therapist: {therapist ? `${therapist.firstName} ${therapist.lastName}` : "Unknown"}</li>
      </ul>
    </div>
  );
}

export default BookingConfirmation;
