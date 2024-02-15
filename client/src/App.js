import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Nav from "./components/layout/Navbar";
import Home from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Alert from "./components/layout/Alert";
import Dashboard from "./components/dashboard/Dashboard";
import PrivateRoute from "./components/routing/PrivateRoute";
import TherapistRegister from "./components/auth/TherapistRegister";
import LocationSelector from "./components/booking/LocationSelector";
import DurationSelector from "./components/booking/DurationSelector";
import DateSelector from "./components/booking/DateSelector";
import TimeSelector from "./components/booking/TimeSelector";
import BookingConfirmation from "./components/booking/BookConfirmation";
import "./App.css";
//Redux
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/authActions";
import setAuthToken from "./utils/setAuthToken";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Nav />
          <section className='container'>
            <Alert />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/TherapistRegister' element={<TherapistRegister />} />
              <Route path='/dashboard/*' element={<Dashboard />}>
                <Route index element={<PrivateRoute />} />
                <Route path='location' element={<LocationSelector />} />
                <Route path='duration' element={<DurationSelector />} />
                <Route path='date' element={<DateSelector />} />
                <Route path='time' element={<TimeSelector />} />
                <Route path='confirmation' element={<BookingConfirmation />} />
              </Route>
              <Route path='*' element={<NotFound />} />
            </Routes>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

const NotFound = () => {
  // Redirect to the home page if route not found
  return <Navigate to="/" />;
};
export default App;
