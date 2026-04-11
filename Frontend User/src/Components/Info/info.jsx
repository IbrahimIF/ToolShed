import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoMdClose } from "react-icons/io";

import './info.css'

function Info() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
          <button className="info-button" onClick={() => setIsModalOpen(true)}>
            <span>i</span>
          </button>

          <AnimatePresence>
            {isModalOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="modal-overlay"
                  onClick={() => setIsModalOpen(false)}
                />
                <div className="modal-wrapper">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="modal"
                >
                  <div className="modal-header">
                    <h2 className="title">Project Information</h2>
                    <button className="close-button" onClick={() => setIsModalOpen(false)}>
                      <IoMdClose />
                    </button>
                  </div>
                  <div className="modal-body">
                    <p>
                      This application is part of a two-way system: the public-facing site you are
                      using now and an admin portal.
                    </p>
                    <p>
                      The content you see has been edited and managed via the admin portal. The admin
                      side allows adding, editing, and organising all the data, demonstrating a
                      complete full-stack architecture.
                    </p>
                    <p>
                      Access to the admin portal is restricted and not shared publicly (can be shared
                      upon request).
                    </p>
                  </div>
                </motion.div>
                </div>
              </>
            )}
          </AnimatePresence>
        </>
    );
}

export default Info;
