import React, { useState } from 'react';

const App = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [inputPrompt, setInputPrompt] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  const handleInputChange = (event) => {
    setInputPrompt(event.target.value);
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const queryAPI = async () => {
    try {
      if (!inputPrompt) {
        console.error('Please enter a prompt.');
        return;
      }

      let modelEndpoint = "";

      switch (activeCategory) {
        case 'Retro':
          modelEndpoint = "https://api-inference.huggingface.co/models/sd-dreambooth-library/retro3d";
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

      console.log(`fetching ${activeCategory}...`);
      const response = await fetch(
        modelEndpoint,
        {
          headers: {
            Authorization: "Bearer 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",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ "inputs": inputPrompt }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }

      console.log(`getting ${activeCategory} blob`);

      const blob = await response.blob();
      console.log(`here is the ${activeCategory} blob`);
      console.log(blob); // Log the binary blob received

      const imageUrl = URL.createObjectURL(blob);
      setImageUrl(imageUrl);
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={() => handleCategoryClick('Retro')}
          style={{ padding: '10px 20px', fontSize: '16px', marginRight: '10px', backgroundColor: activeCategory === 'Retro' ? 'lightblue' : 'transparent', border: '1px solid black', borderRadius: '5px' }}
        >
          Retro
        </button>
        <button
          onClick={() => handleCategoryClick('Cartoon')}
          style={{ padding: '10px 20px', fontSize: '16px', marginRight: '10px', backgroundColor: activeCategory === 'Cartoon' ? 'lightblue' : 'transparent', border: '1px solid black', borderRadius: '5px' }}
        >
          Cartoon
        </button>
        <button
          onClick={() => handleCategoryClick('Hergé')}
          style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: activeCategory === 'Hergé' ? 'lightblue' : 'transparent', border: '1px solid black', borderRadius: '5px' }}
        >
          Hergé
        </button>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={inputPrompt}
          onChange={handleInputChange}
          placeholder="Enter prompt..."
          style={{ padding: '10px', fontSize: '16px', width: '300px', textAlign: 'center' }}
        />
      </div>
      {imageUrl && <img src={imageUrl} alt="Generated Image" style={{ maxWidth: '100%', marginBottom: '20px' }} />}
      <button onClick={queryAPI} style={{ padding: '10px 20px', fontSize: '16px' }}>Generate</button>
    </div>
  );
};

export default App;
