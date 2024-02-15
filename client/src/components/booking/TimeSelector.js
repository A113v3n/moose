import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchTimeSlots, createBooking } from "../../actions/bookingActions";
import { format, parseISO } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

function TimeSelector() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const timeSlots = useSelector(state => state.booking.timeSlots);
  const selectedLocation = useSelector(state => state.booking.selectedLocation);
  const selectedDuration = useSelector(state => state.booking.selectedDuration);
  const selectedDate = useSelector(state => state.booking.selectedDate);

  useEffect(() => {
    dispatch(fetchTimeSlots(selectedLocation, selectedDuration, selectedDate));
  }, [dispatch, selectedLocation, selectedDuration, selectedDate]);

  const handleSelectTimeSlot = (timeSlot) => {
    dispatch(createBooking(selectedLocation, selectedDuration, selectedDate, timeSlot));
    navigate("/dashboard/confirmation");
  };

  return (
    <div>
      <h1>Select a Time Slot</h1>
      {timeSlots.map((timeSlot) => {
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const startTime = format(utcToZonedTime(parseISO(timeSlot.start), userTimezone), 'p');
        const endTime = format(utcToZonedTime(parseISO(timeSlot.end), userTimezone), 'p');

        return (
          <button key={timeSlot.id} onClick={() => handleSelectTimeSlot(timeSlot)}>
            {startTime} - {endTime}
          </button>
        );
      })}
    </div>
  );
}

export default TimeSelector;
