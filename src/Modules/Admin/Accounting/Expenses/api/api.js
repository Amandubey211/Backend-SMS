export const fetchApi = async (url, method, data, token) => {
    const headers = {
      'Content-Type': 'application/json',
      'Authentication': `${token}`,
    };
  
    const config = {
      method: method,
      headers: headers,
    };
    if (data && (method === 'POST' || method === 'PUT' || method === 'DELETE')) {
      config.body = JSON.stringify(data);
    }
  
    const response = await fetch(url, config);
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    return await response.json();
  }
  