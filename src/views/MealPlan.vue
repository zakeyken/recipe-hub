<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Weekly Meal Plan</h1>

    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
      <p class="mt-2 text-gray-600">Loading meal plan...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
      {{ error }}
    </div>

    <div v-else>
      <div class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div class="grid grid-cols-1 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x">
          <div 
            v-for="(day, index) in mealPlan.days" 
            :key="index"
            class="p-4"
          >
            <h3 class="font-semibold text-gray-800 mb-2">{{ day.name }}</h3>
            
            <div v-if="day.recipes.length" class="space-y-4">
              <div 
                v-for="recipe in day.recipes" 
                :key="recipe.id" 
                class="group"
              >
                <div class="h-24 bg-gray-100 rounded-md overflow-hidden mb-2">
                  <div class="w-full h-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"></path><line x1="6" x2="18" y1="17" y2="17"></line></svg>
                  </div>
                </div>
                <h4 class="font-medium text-gray-800 mb-1 line-clamp-1">{{ recipe.title }}</h4>
                <router-link 
                  :to="`/recipe/${recipe.id}`" 
                  class="text-sm text-emerald-600 hover:text-emerald-700"
                >
                  View Recipe
                </router-link>
              </div>
            </div>
            
            <div v-else class="flex flex-col items-center justify-center h-48 bg-gray-50 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400 mb-2"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
              <p class="text-sm text-gray-500">No meals planned</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Shopping List</h2>
        
        <div v-if="!mealPlan.shoppingList.length" class="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto text-gray-400 mb-3"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          <p class="text-gray-600">Your shopping list is empty</p>
        </div>
        
        <ul v-else class="space-y-2">
          <li 
            v-for="(item, index) in mealPlan.shoppingList" 
            :key="index"
            class="flex items-start p-2 hover:bg-gray-50 rounded-md"
          >
            <input
              :id="`item-${index}`"
              v-model="item.checked"
              type="checkbox"
              class="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <label :for="`item-${index}`" class="ml-3 flex-1">
              <span :class="{ 'line-through text-gray-400': item.checked }">
                {{ item.quantity }} {{ item.name }}
              </span>
            </label>
          </li>
        </ul>
        
        <div class="mt-6 flex justify-end">
          <button 
            @click="regenerateMealPlan" 
            class="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
            Generate New Meal Plan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchMealPlan } from '../services/api';

const mealPlan = ref({
  days: [],
  shoppingList: []
});
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  await loadMealPlan();
});

const loadMealPlan = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const data = await fetchMealPlan();
    
    // Transform the data structure to match our component needs
    mealPlan.value = {
      days: data.meal_plan.map((dayMeals, index) => ({
        name: getDayName(index),
        recipes: dayMeals.map(recipe => ({
          id: recipe.id,
          title: recipe.name,
          image: null,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions
        }))
      })),
      shoppingList: Object.entries(data.shopping_list).map(([name, quantity]) => ({
        name,
        quantity,
        checked: false
      }))
    };
  } catch (err) {
    error.value = 'Failed to load meal plan. Please try again later.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const getDayName = (index) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return days[index];
};

const regenerateMealPlan = async () => {
  await loadMealPlan();
};
</script>