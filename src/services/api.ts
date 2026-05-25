export const API_URL = 'http://127.0.0.1:3000'; // IP local para pruebas en el navegador web


export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const createProduct = async (productData: any) => {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Network response was not ok');
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Error creating product:', error);
    throw error; // Throw so the UI can catch it
  }
};

export const upgradeUser = async (seller: string) => {
  try {
    const response = await fetch(`${API_URL}/products/upgrade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seller }),
    });
    if (!response.ok) throw new Error('Failed to upgrade user');
    return await response.json();
  } catch (error) {
    console.error('Error upgrading user:', error);
    throw error;
  }
};

export const getWalletSummary = async (userId: string) => {
  try {
    const response = await fetch(`${API_URL}/wallet/summary?userId=${userId}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching wallet summary:', error);
    return null;
  }
};

export const depositToWallet = async (userId: string, amount: number) => {
  try {
    const response = await fetch(`${API_URL}/wallet/deposit-simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, amount }),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error depositing to wallet:', error);
    return null;
  }
};

export const freezeFunds = async (buyerId: string, amount: number, productId: string) => {
  try {
    const response = await fetch(`${API_URL}/wallet/freeze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ buyerId, amount, productId }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to freeze funds');
    }
    return await response.json();
  } catch (error) {
    console.error('Error freezing funds:', error);
    throw error;
  }
};

export const releaseFunds = async (buyerId: string, sellerId: string, amount: number, productId: string) => {
  try {
    const response = await fetch(`${API_URL}/wallet/release`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ buyerId, sellerId, amount, productId }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to release funds');
    }
    return await response.json();
  } catch (error) {
    console.error('Error releasing funds:', error);
    throw error;
  }
};
