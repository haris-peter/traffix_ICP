import { useNavigate } from 'react-router-dom';
import './LandingPage.css';  // Import CSS

function LandingPage() {
  const navigate = useNavigate();

  function handleStart() {
    navigate('/form');  // Redirect to form page
  }

  return (
    <div className="container">
      <img src="/logo2.svg" alt="DFINITY logo" className="logo" />
      <h1 className="title">Traffix - Road Safety Reporting DApp</h1>
      <p className="overview">
        Traffix is a decentralized application (DApp) that allows users to 
        <strong> report road safety issues anonymously</strong>. Built using React and Web3, 
        it leverages the blockchain to securely store reports, ensuring transparency and trustlessness.
      </p>

      <section className="features">
        <h2>Key Features</h2>
        <ul>
          <li><strong>Connect Wallet:</strong> Users can connect their Metamask wallet to the app.</li>
          <li><strong>Capture Image:</strong> Take photos of road safety issues directly via webcam.</li>
          <li><strong>Add Details:</strong> Provide additional information using a simple form.</li>
          <li><strong>Submit Report:</strong> Store reports securely and anonymously on the blockchain.</li>
          <li><strong>View Reports:</strong> Track ongoing issues reported by the community.</li>
        </ul>
      </section>

      <section className="technologies">
        <h2>Technologies Used</h2>
        <ul>
          <li><strong>React:</strong> For building the user interface.</li>
          <li><strong>Web3.js:</strong> For blockchain interaction and smart contract calls.</li>
          <li><strong>Metamask:</strong> For wallet integration and authentication.</li>
          <li><strong>IPFS:</strong> For decentralized image storage.</li>
          <li><strong>Pinata:</strong> For managing IPFS files efficiently.</li>
        </ul>
      </section>

      <button onClick={handleStart} className="start-button">
        Let’s Get Started
      </button>
    </div>
  );
}

export default LandingPage;
