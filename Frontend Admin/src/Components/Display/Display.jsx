
import { collection, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import './Display.css';

function Display({ isSent, setIsSent }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const messagesRef = collection(db, 'messages');
    
    const unsubscribe = onSnapshot(messagesRef, 
      (querySnapshot) => {
        const messagesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setData(messagesData);
        setErrorMessage('');
        setIsLoading(false);
      },
      (error) => {
        setErrorMessage('Failed to load messages');
        setIsLoading(false);
        console.error("Firestore error:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isSent) {
      setTimeout(() => setIsSent(false), 3000);
    }
  }, [isSent, setIsSent]);



  if (isLoading) {
    return <div className="displayContainer"><div className="loadingContainer"><div>Loading...</div></div></div>;
  }

  if (isSent) {
    return <div className="displayContainer"><div className="displayArea"><div style={{transition: "1s" }}>Updating...</div></div></div>;
  }


  return (
    <> 
      <div className="displayContainer">
        <div className="displayArea">
        {errorMessage ? (
              <div className="error">{errorMessage}</div>
            ) : (
  
          <ul className="text">
            {data.map(item => (
              <li key={item._id}>{item.name}: {item.text}</li>
            ))}
          </ul>
            )}
        </div>
      </div>
    </>
  );
}

export default Display;