// Encryption utility using AES-CBC
async function encryptData(data) {
    const encoder = new TextEncoder();
    const keyBuffer = encoder.encode("akashabclamnabcyjbwoabredawabctr").slice(0, 16);
    const ivBuffer = encoder.encode("jtufabcdftabcdfg").slice(0, 16);
    
    // Import the key
    const cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: 'AES-CBC' },
        false,
        ['encrypt']
    );

    // Encrypt the data
    const encryptedData = await window.crypto.subtle.encrypt(
        { name: 'AES-CBC', iv: ivBuffer },
        cryptoKey,
        encoder.encode(data)
    );
    console.log('e-----',btoa(String.fromCharCode(...new Uint8Array(encryptedData))));
    

    // Convert encrypted ArrayBuffer to Base64 string
    return btoa(String.fromCharCode(...new Uint8Array(encryptedData)));
}

// Decryption utility using AES-CBC
async function decryptData(data) {
  
  try {
    const decoder = new TextDecoder();
    const keyBuffer = new TextEncoder().encode("akashabclamnabcyjbwoabredawabctr").slice(0, 16);;
    const ivBuffer = new TextEncoder().encode("jtufabcdftabcdfg").slice(0, 16);

    // Import the key
    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: 'AES-CBC' },
        false,
        ['decrypt']
    );

    // Convert Base64 to ArrayBuffer
    
    
    const encryptedArrayBuffer = Uint8Array.from(atob(data), c => c.charCodeAt(0));
    console.log('key--------',cryptoKey)
    // Decrypt the data
    const decryptedData = await crypto.subtle.decrypt(
        { name: 'AES-CBC', iv: ivBuffer },
        cryptoKey,
        encryptedArrayBuffer
    );
  
  return   decoder.decode(decryptedData)
  } catch (error) {
    console.log('err--------',error)
  }
    
}

export { encryptData, decryptData };
