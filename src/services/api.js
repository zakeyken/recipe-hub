// API base URL - replace with your actual API Gateway URL
const API_BASE_URL = 'https://067gs6t455.execute-api.us-east-1.amazonaws.com/dev';

// Get API key from environment variable
const API_KEY = import.meta.env.VITE_API_KEY;

// Helper function for API requests
async function apiRequest(endpoint, method = 'GET', data = null) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY
  };
  
  const options = {
    method,
    headers,
    mode: 'cors'
  };
  
  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }
  
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API request failed with status ${response.status}`);
  }
  
  return response.json();
}

// Recipe API functions
export async function fetchRecipes() {
  return apiRequest('/recipes');
}

export async function fetchRecipeById(id) {
  return apiRequest(`/recipes/${id}`);
}

export async function createRecipe(recipeData) {
  return apiRequest('/recipes', 'POST', recipeData);
}

export async function updateRecipe(id, recipeData) {
  return apiRequest(`/recipes/${id}`, 'PUT', recipeData);
}

export async function deleteRecipeById(id) {
  return apiRequest(`/recipes/${id}`, 'DELETE');
}

// Meal Plan API functions
export async function fetchMealPlan() {
  return apiRequest('/meal-plan');
}