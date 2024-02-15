import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Routes, Route } from "react-router-dom";
import { fetchLocations, setSelectedLocation } from "../../actions/bookingActions";
import DurationSelector from "./DurationSelector";

function LocationSelector() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const locations = useSelector(state => state.booking.locations);
  useEffect(() => {
    dispatch(fetchLocations());
  }, [dispatch]);

  const handleSelectLocation = async (locationId) => {
    await dispatch(setSelectedLocation(locationId));
    navigate('/dashboard/duration');
  };
  

  return (
    <div>
      <h1>Select a Location</h1>
      {locations.map((location) => (
        <button key={location._id} onClick={() => handleSelectLocation(location._id)}>
          {location.name}
        </button>
      ))}
    </div>
  );
}

export default LocationSelector;
