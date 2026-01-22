// Test script to verify API configuration
console.log('Environment variables:');
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('MODE:', import.meta.env.MODE);

// Test API call
fetch('/api/packages/classes/list')
  .then(response => {
    console.log('API Response status:', response.status);
    return response.json();
  })
  .then(data => console.log('API Response data:', data))
  .catch(error => console.error('API Error:', error));
