import { useState } from 'react';
import './FormPage.css';  // Import the CSS file

// import { traffix_ICP_backend } from 'declarations/traffix_ICP_backend';

function FormPage() {
  const [greeting, setGreeting] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const name = event.target.elements.name.value;
    traffix_ICP_backend.greet(name).then((greeting) => {
      setGreeting(greeting);
    });
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form">
        <input
          id="name"
          type="text"
          placeholder="Enter your name"
          className="input"
        />
        <button type="submit" className="button">
          Click Me!
        </button>
      </form>
      <div className={`greeting ${greeting ? 'show' : ''}`}>{greeting}</div>
    </div>
  );
}

export default FormPage;
