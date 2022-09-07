import React from 'react';

const Spinner = () => {
    return (
        <div className="spinner">
            <div className="spinner__gradient">
                <div className="spinner__blocker"></div>
                <div className="spinner__round-head"></div>
            </div>
        </div>
    );
};

export default Spinner;
