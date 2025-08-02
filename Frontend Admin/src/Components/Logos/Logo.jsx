import { useState, useEffect } from 'react';
import './Logo.css';
import ToolShed from '../../assets/toolshed.png';

function Display() {


  return (
    <> 
    <div className='logo-Container'>
      <img src={ToolShed} className="logo toolshed" alt="Toolshed logo" />
    </div>
    </>
  );
}

export default Display;