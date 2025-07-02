import { useState, useEffect } from 'react';
import './Logo.css';
import Firebase from '../../assets/Firebase.png';
import Reacts from '../../assets/React.png';
import Vite from '../../assets/Vitejs-logo.png';

/*font awesome*/
/*import { FontAwesomeIcon } from "@fortawesome/free-brands-svg-icons";*/



function Display() {


  return (
    <> 
    <div className='logo-Container'>
      <img src={Firebase} className="logo firebase" alt="Firebase logo" />
      <img src={Reacts} className="logo react" alt="Reacts logo" />
      <img src={Vite} className="logo vite" alt="Vite logo" />
    </div>
    </>
  );
}

export default Display;