import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Component, auth: { isAuthenticated, loading }, ...rest }) => {
    if (loading) {
        return <h4>Loading...</h4>;
    } else if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    } else {
        return <Component {...rest} />;
    }
};

PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
