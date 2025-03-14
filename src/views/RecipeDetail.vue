<template>
  <div>
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
      <p class="mt-2 text-gray-600">Loading recipe...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
      {{ error }}
    </div>

    <div v-else class="max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <button 
          @click="router.back()" 
          class="flex items-center text-gray-600 hover:text-emerald-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>
          Back
        </button>
        <div class="flex space-x-3">
          <button 
            @click="editRecipe" 
            class="flex items-center text-gray-600 hover:text-emerald-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path><path d="m15 5 4 4"></path></svg>
            Edit
          </button>
          <button 
            @click="confirmDelete" 
            class="flex items-center text-gray-600 hover:text-red-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
            Delete
          </button>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="h-64 bg-gray-200">
          <img 
            v-if="recipe.image" 
            :src="recipe.image" 
            :alt="recipe.name" 
            class="w-full h-full object-cover"
          >
          <div v-else class="w-full h-full flex items-center justify-center bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"></path><line x1="6" x2="18" y1="17" y2="17"></line></svg>
          </div>
        </div>

        <div class="p-6">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ recipe.name }}</h1>
          
          <div class="flex flex-wrap gap-4 mb-6">
            <div class="flex items-center text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <span>{{ recipe.ingredients.length }} ingredients</span>
            </div>
          </div>

          <div class="mb-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-2">Description</h2>
            <p class="text-gray-600">{{ recipe.description }}</p>
          </div>

          <div class="mb-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-3">Ingredients</h2>
            <ul class="space-y-2">
              <li 
                v-for="(ingredient, index) in recipe.ingredients" 
                :key="index"
                class="flex items-start"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500 mr-2 mt-0.5"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                <span>{{ ingredient.quantity }} {{ ingredient.ingredient }}</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 class="text-xl font-semibold text-gray-800 mb-3">Instructions</h2>
            <div class="space-y-4">
              {{ recipe.instructions }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md mx-4">
        <h3 class="text-lg font-bold mb-2">Delete Recipe</h3>
        <p class="text-gray-600 mb-4">Are you sure you want to delete this recipe? This action cannot be undone.</p>
        <div class="flex justify-end space-x-3">
          <button 
            @click="showDeleteModal = false" 
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            @click="deleteRecipe" 
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { fetchRecipeById, deleteRecipeById } from '../services/api';

const router = useRouter();
const route = useRoute();
const recipeId = route.params.id;

const recipe = ref({});
const loading = ref(true);
const error = ref(null);
const showDeleteModal = ref(false);

onMounted(async () => {
  try {
    recipe.value = await fetchRecipeById(recipeId);
  } catch (err) {
    error.value = 'Failed to load recipe. Please try again later.';
    console.error(err);
  } finally {
    loading.value = false;
  }
});

const editRecipe = () => {
  router.push(`/recipe/${recipeId}/edit`);
};

const confirmDelete = () => {
  showDeleteModal.value = true;
};

const deleteRecipe = async () => {
  try {
    await deleteRecipeById(recipeId);
    router.push('/');
  } catch (err) {
    error.value = 'Failed to delete recipe. Please try again later.';
    console.error(err);
    showDeleteModal.value = false;
  }
};
</script>