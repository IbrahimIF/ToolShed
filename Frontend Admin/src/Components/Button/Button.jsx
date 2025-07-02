import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../../firebase';
import './Button.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload }  from '@fortawesome/free-solid-svg-icons';



function Button({onDataSent}) {
  const [name, setName] = useState('');
  const [text, setText] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await addDoc(collection(db, 'messages'), {
        name: name,
        text: text,
        timestamp: serverTimestamp() // Better than Date.now()
      });
      
      onDataSent();
      setName('');
      setText('');
    } catch (error) {
      console.error("Error writing to Firestore:", error);
    }
  };


  return (
    <>
    
    <div className="buttonContainer">
      <form onSubmit={handleSubmit}>
        <div className="inputContainer">
          <div className="input-Animated">
            <input type="text" name="text" className="input" placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            />
            <div className="highlight"></div>
          </div>

          <div className="input-Animated">
            <input type="text" name="text" className="input" placeholder="Enter Text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            />
            <div className="highlight"></div>
          </div>

        </div>
        <div className="submitButtonContainer">
        <button type="submit"> <FontAwesomeIcon icon={faUpload} /> &nbsp; Send </button>
        </div>
      </form>
    </div>
    </>
  );
}

export default Button;


