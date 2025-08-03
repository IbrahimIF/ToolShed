import './Logo.css';
import Logo from '../../assets/logo.png';

function Display() {


  return (
    <> 
    <div className='logo-Container'>
      <img src={Logo} className="logo toolshed" alt="Toolshed logo" />
    </div>
    </>
  );
}

export default Display;