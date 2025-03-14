<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">My Recipes</h2>
      <button 
        @click="navigateToAddRecipe" 
        class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
        Add Recipe
      </button>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
      <p class="mt-2 text-gray-600">Loading recipes...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
      {{ error }}
    </div>

    <div v-else-if="recipes.length === 0" class="text-center py-12">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto text-gray-400 mb-4"><path d="M15 11h.01"></path><path d="M11 15h.01"></path><path d="M16 16h.01"></path><path d="M2 9a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7v6a7 7 0 0 1-7 7H9a7 7 0 0 1-7-7z"></path></svg>
      <h3 class="text-lg font-medium text-gray-800">No recipes yet</h3>
      <p class="text-gray-600 mt-1">Add your first recipe to get started</p>
      <button 
        @click="navigateToAddRecipe" 
        class="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md"
      >
        Add Recipe
      </button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="recipe in recipes" 
        :key="recipe.id" 
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      >
        <div class="h-48 bg-gray-200 relative">
          <img 
            v-if="recipe.image" 
            :src="recipe.image" 
            :alt="recipe.title" 
            class="w-full h-full object-cover"
          >
          <div v-else class="w-full h-full flex items-center justify-center bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"></path><line x1="6" x2="18" y1="17" y2="17"></line></svg>
          </div>
          <div class="absolute top-2 right-2 flex space-x-2">
            <button 
              @click.stop="editRecipe(recipe.id)" 
              class="p-1.5 bg-white rounded-full shadow hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path><path d="m15 5 4 4"></path></svg>
            </button>
            <button 
              @click.stop="confirmDelete(recipe.id)" 
              class="p-1.5 bg-white rounded-full shadow hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
            </button>
          </div>
        </div>
        <div class="p-4">
          <h3 class="font-bold text-lg text-gray-800 mb-1">{{ recipe.name }}</h3>
          <p class="text-gray-600 text-sm mb-2">
            <span class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              {{ recipe.ingredients.length }} ingredients
            </span>
          </p>
          <p class="text-gray-600 text-sm line-clamp-2">{{ recipe.description }}</p>
          <button 
            @click="viewRecipe(recipe.id)" 
            class="mt-3 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
          >
            View Recipe →
          </button>
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
import { useRouter } from 'vue-router';
import { fetchRecipes, deleteRecipeById } from '../services/api';

const router = useRouter();
const recipes = ref([]);
const loading = ref(true);
const error = ref(null);
const showDeleteModal = ref(false);
const recipeToDelete = ref(null);

onMounted(async () => {
  try {
    recipes.value = await fetchRecipes();
  } catch (err) {
    error.value = 'Failed to load recipes. Please try again later.';
    console.log(err.body);
  } finally {
    loading.value = false;
  }
});

const navigateToAddRecipe = () => {
  router.push('/recipe/add');
};

const viewRecipe = (id) => {
  router.push(`/recipe/${id}`);
};

const editRecipe = (id) => {
  router.push(`/recipe/${id}/edit`);
};

const confirmDelete = (id) => {
  recipeToDelete.value = id;
  showDeleteModal.value = true;
};

const deleteRecipe = async () => {
  try {
    await deleteRecipeById(recipeToDelete.value);
    recipes.value = recipes.value.filter(recipe => recipe.id !== recipeToDelete.value);
    showDeleteModal.value = false;
  } catch (err) {
    error.value = 'Failed to delete recipe. Please try again later.';
    console.error(err);
  }
};
</script>