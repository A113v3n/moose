import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSelectedDuration } from "../../actions/bookingActions";



function DurationSelector() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSelectDuration = (duration) => {
    dispatch(setSelectedDuration(duration));
    navigate('/dashboard/date');
  };

  return (
    <div>
      <h1>Select Duration</h1>
      <button onClick={() => handleSelectDuration(30)}>30 minutes</button>
      <button onClick={() => handleSelectDuration(45)}>45 minutes</button>
      <button onClick={() => handleSelectDuration(60)}>60 minutes</button>
      <button onClick={() => handleSelectDuration(90)}>90 minutes</button>
    </div>
  );
}

export default DurationSelector;
