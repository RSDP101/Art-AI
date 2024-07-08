import React, { useState } from 'react';
import './App.css'; // Import your CSS file

const App = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [inputPrompt, setInputPrompt] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleInputChange = (event) => {
    setInputPrompt(event.target.value);
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const resizeImage = (blob) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 512, 512);
        canvas.toBlob(resolve, 'image/png');
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(blob);
    });
  };

  const queryAPI = async () => {
    try {
      if (!inputPrompt) {
        console.error('Please enter a prompt.');
        return;
      }

      let modelEndpoint = "";
      let headers = {
        Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
        "Content-Type": "application/json",
      };

      switch (activeCategory) {
        case 'Retro':
          modelEndpoint = "https://izmliqxjrmai0a47.us-east-1.aws.endpoints.huggingface.cloud";
          headers = {
            ...headers,
            Accept: "image/png",
          };
          break;
        case 'Cartoon':
          modelEndpoint = "https://api-inference.huggingface.co/models/sd-dreambooth-library/smiling-friends-cartoon-style";
  
          break;
        case 'Hergé':
          modelEndpoint = "https://api-inference.huggingface.co/models/sd-dreambooth-library/herge-style";

          break;
        default:
          console.warn('Please select a category.');
          return;
      }

      setLoading(true);
      setError(false);
      setImageUrl('');

      console.log(`Fetching ${activeCategory}...`);
      const response = await fetch(
        modelEndpoint,
        {
          headers,
          method: "POST",
          body: JSON.stringify({ inputs: inputPrompt }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }

      console.log(`Getting ${activeCategory} blob`);
      const blob = await response.blob();
      console.log(`Here is the ${activeCategory} blob`);
      console.log(blob); // Log the binary blob received

      let resizedBlob = blob;
      if (activeCategory === 'Retro' ) {
        resizedBlob = await resizeImage(blob);
      }

      const imageUrl = URL.createObjectURL(resizedBlob);
      setImageUrl(imageUrl);
      console.log(`Image URL created: ${imageUrl}`);
    } catch (error) {
      console.error('Error fetching image:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI - ART</h1>
      </header>
      <div className="chat-container">
        <div className="button-container">
          <button
            onClick={() => handleCategoryClick('Retro')}
            className={`button ${activeCategory === 'Retro' ? 'active' : ''}`}
          >
            Retro
          </button>
          <button
            onClick={() => handleCategoryClick('Cartoon')}
            className={`button ${activeCategory === 'Cartoon' ? 'active' : ''}`}
          >
            Cartoon
          </button>
          <button
            onClick={() => handleCategoryClick('Hergé')}
            className={`button ${activeCategory === 'Hergé' ? 'active' : ''}`}
          >
            Hergé
          </button>
        </div>
        <textarea
          value={inputPrompt}
          onChange={handleInputChange}
          placeholder="Enter prompt..."
          className="input-box"
        />
        <div className="answer-box">
          <div className="image-container">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Model currently unavailable (try again, or try Retro style).</p>
            ) : (
              imageUrl ? (
                <img src={imageUrl} alt="Generated" className="generated-image" />
              ) : (
                <p>No image to display</p>
              )
            )}
          </div>
        </div>
        <button onClick={queryAPI} className="button">Generate</button>
      </div>
    </div>
  );
};

export default App;
