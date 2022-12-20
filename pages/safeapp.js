import React, {useState, useEffects} from 'react';

const DynamicComponentWithNoSSR = <>Some JSX</>


function App() {


//   [a,setA] = useState();
//   useEffect(() => {
//       setA(<DynamicComponentWithNoSSR/>)
//     });

// // For a new iframe
// const iframe = document.createElement("iframe");

// iframe.onload = function() {
//   console.log("The iframe is loaded");
// };
// iframe.onerror = function() {
//   console.log("Something wrong happened");
// };

// iframe.src = "https://logrocket.com/";
// document.body.appendChild(iframe);

// // For an existing iframe
// //const iframe = document.querySelector('.my-iframe');

// iframe.onload = function() {
//   console.log("The iframe is loaded");
// }
// iframe.onerror = function() {
//   console.log("Something wrong happened");
// }




  //const myiframe = document.getElementById('myIframe')


  return (
    <div className="App">
      <iframe seamless src="https://app.safe.global/" width={2030} height={1000} allow="fullscreen" ></iframe>
    </div>
  );
}

export default App;