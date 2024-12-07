// Encryption utility using AES-CBC
async function encryptData(data) {
  try {
    if (typeof data !== 'string') {
      data = String(data); // Convert non-string data to a string
  }
      const encoder = new TextEncoder();
      const keyBuffer = encoder.encode(process.env.REACT_APP_CRYPTO_SECERT)
      const ivBuffer = encoder.encode(process.env.REACT_APP_CRYPTO_IV)

      const cryptoKey = await crypto.subtle.importKey(
          'raw',
          keyBuffer,
          { name: 'AES-CBC' },
          false,
          ['encrypt']
      );

      const dataBuffer = encoder.encode(data); // Encode the data into a Uint8Array

      const encryptedData = await crypto.subtle.encrypt(
          { name: 'AES-CBC', iv: ivBuffer },
          cryptoKey,
          dataBuffer
      );

      // Convert ArrayBuffer to Base64 string
      const encryptedArray = new Uint8Array(encryptedData);
      const encryptedBase64 = btoa(
          encryptedArray.reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
console.log('en',encryptedBase64);

      return encryptedBase64;
  } catch (error) {
      console.error('Encryption failed:', error);
      throw error;
  }
}

// Decryption utility using AES-CBC
async function decryptData(data) {
  try {
      const decoder = new TextDecoder();
      const keyBuffer = new TextEncoder().encode(process.env.REACT_APP_CRYPTO_SECERT)
      const ivBuffer = new TextEncoder().encode(process.env.REACT_APP_CRYPTO_IV)

      const cryptoKey = await crypto.subtle.importKey(
          'raw',
          keyBuffer,
          { name: 'AES-CBC' },
          false,
          ['decrypt']
      );

      const encryptedArrayBuffer = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));

      const decryptedData = await crypto.subtle.decrypt(
          { name: 'AES-CBC', iv: ivBuffer },
          cryptoKey,
          encryptedArrayBuffer
      );

      const decryptedString = decoder.decode(decryptedData);

      // Check if it's a number
      const parsedNumber = Number(decryptedString);
      if (!isNaN(parsedNumber)) {
        console.log('dn',parsedNumber,typeof(parsedNumber));
        
          return parsedNumber; // Return as a number
      }
      console.log('ds',decryptedString);
      return decryptedString; // Return as a string if not a number
  } catch (error) {
      console.error('Decryption failed:', error);
      throw error;
  }
}


export {  decryptData ,encryptData};
