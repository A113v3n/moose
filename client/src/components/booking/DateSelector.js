import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSelectedDate } from "../../actions/bookingActions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function DateSelector() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSelectDate = (date) => {
    dispatch(setSelectedDate(date));
    navigate("/dashboard/time");
  };

  return (
    <div>
      <h1>Select a Date</h1>
      <DatePicker selected={new Date()} onChange={handleSelectDate} />
    </div>
  );
}

export default DateSelector;
