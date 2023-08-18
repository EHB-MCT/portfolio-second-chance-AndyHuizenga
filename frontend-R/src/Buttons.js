export const handleClearData = () => {
  
    return fetch('http://localhost:3001/cleardata', {
      method: 'POST',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('OSC data cleared:', data);
        return data;
      })
      .catch((error) => {
        console.error('Error clearing OSC data:', error);
        throw error;
      });
  };


 
