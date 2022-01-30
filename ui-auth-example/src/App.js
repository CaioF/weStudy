import logo from './logo.svg';
import './App.css';
import GoogleLogin from 'react-google-login';

function App() {
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            buttonText="Log in with Google"
            onSuccess={handleLogin}
            onFailure={handleLogin}
            cookiePolicy={'single_host_origin'}
        />

      </header>
    </div>
  );
}

// post auth data to server
const handleLogin = async googleData => {
  const res = await fetch("http://localhost:3001/api/auth", {
      method: "POST",
      body: JSON.stringify({ token: googleData.tokenId }),
    headers: {
      "Content-Type": "application/json"
    }
  })
  const data = await res.json()
  // store returned user somehow
}

export default App;
