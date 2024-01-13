import React from 'react';
import { ToastContainer, Zoom } from 'react-toastify';
const Notifier = function () {
    return (
        <ToastContainer
            transition={Zoom}
            position="top-right"
            autoClose={1000}
            limit={1}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable={false}
            pauseOnHover
            theme="colored"
        />
    );
};

export default Notifier;
