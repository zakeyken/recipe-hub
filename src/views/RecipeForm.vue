<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { fetchRecipeById, createRecipe, updateRecipe } from '../services/api';

const router = useRouter();
const route = useRoute();
const recipeId = route.params.id;

const isEditing = computed(() => !!recipeId);
const loading = ref(isEditing.value);
const saving = ref(false);
const error = ref(null);

const form = ref({
  name: '',
  instructions: '',
  ingredients: [{ quantity: '', ingredient: '' }]
});

onMounted(async () => {
  if (isEditing.value) {
    try {
      const recipe = await fetchRecipeById(recipeId);
      form.value = {
        name: recipe.name,
        instructions: recipe.instructions,
        ingredients: recipe.ingredients
      };
    } catch (err) {
      error.value = 'Failed to load recipe. Please try again later.';
      console.error(err);
    } finally {
      loading.value = false;
    }
  }
});

const addIngredient = () => {
  form.value.ingredients.push({ quantity: '', ingredient: '' });
};

const removeIngredient = (index) => {
  if (form.value.ingredients.length > 1) {
    form.value.ingredients.splice(index, 1);
  }
};

const saveRecipe = async () => {
  const cleanedForm = {
    ...form.value,
    ingredients: form.value.ingredients.filter(i => i.ingredient.trim()),
    instructions: form.value.instructions.trim()
  };

  if (!cleanedForm.name.trim()) {
    error.value = 'Recipe name is required';
    return;
  }

  if (!cleanedForm.ingredients.length) {
    error.value = 'At least one ingredient is required';
    return;
  }

  if (!cleanedForm.instructions.trim()) {
    error.value = 'Instructions are required';
    return;
  }

  saving.value = true;
  error.value = null;

  try {
    if (isEditing.value) {
      await updateRecipe(recipeId, cleanedForm);
    } else {
      await createRecipe(cleanedForm);
    }
    router.push(isEditing.value ? `/recipe/${recipeId}` : '/');
  } catch (err) {
    error.value = 'Failed to save recipe. Please try again later.';
    console.error(err);
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <button 
        @click="router.back()" 
        class="flex items-center text-gray-600 hover:text-emerald-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>
        Back
      </button>
      <h1 class="text-2xl font-bold text-gray-800">{{ isEditing ? 'Edit Recipe' : 'Add New Recipe' }}</h1>
      <div class="w-20"></div>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
      <p class="mt-2 text-gray-600">Loading recipe...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
      {{ error }}
    </div>

    <form v-else @submit.prevent="saveRecipe" class="bg-white rounded-lg shadow-md p-6">
      <div class="grid grid-cols-1 gap-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Recipe Name</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Enter recipe name"
          />
        </div>

        <div>
          <h3 class="text-lg font-medium text-gray-800 mb-3">Ingredients</h3>
          
          <div 
            v-for="(ingredient, index) in form.ingredients" 
            :key="`ingredient-${index}`"
            class="flex items-center gap-3 mb-3"
          >
            <input
              v-model="ingredient.quantity"
              type="text"
              class="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Quantity"
            />
            <input
              v-model="ingredient.ingredient"
              type="text"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Ingredient name"
            />
            <button 
              type="button" 
              @click="removeIngredient(index)" 
              class="p-2 text-gray-500 hover:text-red-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
            </button>
          </div>

          <button 
            type="button" 
            @click="addIngredient" 
            class="flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
            Add Ingredient
          </button>
        </div>

        <div>
          <h3 class="text-lg font-medium text-gray-800 mb-3">Instructions</h3>
          <textarea
            v-model="form.instructions"
            rows="5"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Enter cooking instructions"
          ></textarea>
        </div>
      </div>

      <div class="mt-8 flex justify-end space-x-3">
        <button 
          type="button" 
          @click="router.back()" 
          class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          class="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          :disabled="saving"
        >
          {{ saving ? 'Saving...' : (isEditing ? 'Update Recipe' : 'Save Recipe') }}
        </button>
      </div>
    </form>
  </div>
</template>