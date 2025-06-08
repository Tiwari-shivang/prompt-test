import React from 'react';
import "./loader.scss";

const Loader = () => (
    <div className='loader'>
        <div className="text-center">
            <div className="spinner-border" role="status">
                <span className="sr-only"></span>
            </div>
        </div>
    </div>
);

export default Loader;
