import { createRouter, createWebHistory } from 'vue-router';
import RecipeList from '../views/RecipeList.vue';
import RecipeDetail from '../views/RecipeDetail.vue';
import RecipeForm from '../views/RecipeForm.vue';
import MealPlan from '../views/MealPlan.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: RecipeList
  },
  {
    path: '/recipe/add',
    name: 'add-recipe',
    component: RecipeForm
  },
  {
    path: '/recipe/:id',
    name: 'recipe-detail',
    component: RecipeDetail
  },
  {
    path: '/recipe/:id/edit',
    name: 'edit-recipe',
    component: RecipeForm
  },
  {
    path: '/meal-plan',
    name: 'meal-plan',
    component: MealPlan
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;