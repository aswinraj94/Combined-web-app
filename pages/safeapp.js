import React, {useState, useEffects} from 'react';
import styles from "../styles/Home.module.css";
import Link from 'next/link'
function App() {

  return (


    
    <div >
        <ul>
      <button className={styles.button}><Link href="/dashboard">Return to Dashboard</Link></button>
  </ul>
    <div className="App">
      <iframe seamless src="https://app.safe.global/" width={2030} height={1000} allow="fullscreen" ></iframe>
    </div>
    </div>
  );
}

export default App;