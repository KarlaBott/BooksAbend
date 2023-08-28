import React from 'react';
import "../style/Profile.css"

const Modal = ({ title, closeModal, children }) => {
    return (
        <div className={`modal open`}>
            <div className="modal-content">
                <h2>{title}</h2>
                {children}
                <button className="profile-button" onClick={closeModal}>Close</button>
            </div>
        </div>
    );
};

export default Modal;