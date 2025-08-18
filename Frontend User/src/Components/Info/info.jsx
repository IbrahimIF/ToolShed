import { useState } from 'react'
import { IoMdClose } from "react-icons/io";

import './info.css'
function Info() {

    const [isModalOpen, setIsModalOpen] = useState(false);

    // Function to open the modal
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Function to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="info-container">
          <button className="info-button" onClick={openModal}><span>i</span></button>
          <div className={`modal-overlay ${isModalOpen ? 'active' : ''}`} onClick={closeModal}>
          </div>
          <div className={`modal ${isModalOpen ? 'active' : ''}`} >
            <div className="modal-header">
              <h2 className="title">Project Information</h2>
              <button className="close-button" onClick={closeModal}> <IoMdClose /> </button>
            </div>
            <div className="modal-body">
              <p>
                This application is part of a two-way system. <br/>
                The public-facing site you are using now and an admin portal. <br/>
                The content you see has been edited and managed via the admin portal.
                The admin side allows me to add, edit, and organise all the data, demonstrating a complete full-stack architecture.<br/>
                Access to the admin portal however is restricted and not shared publicly (can be shared to you if you ask).
              </p>
            </div>
          </div>
        </div>
    );
}


export default Info;
