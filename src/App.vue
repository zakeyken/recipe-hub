<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <div class="container mx-auto px-4 py-6">
        <nav class="flex items-center justify-between">
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-600 mr-2"><path d="M15 11h.01"></path><path d="M11 15h.01"></path><path d="M16 16h.01"></path><path d="M2 9a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7v6a7 7 0 0 1-7 7H9a7 7 0 0 1-7-7z"></path></svg>
            <h1 class="text-xl font-bold text-gray-800">Recipe Hub</h1>
          </div>
          <div class="flex space-x-4">
            <router-link to="/" class="text-gray-600 hover:text-emerald-600">Recipes</router-link>
            <router-link to="/meal-plan" class="text-gray-600 hover:text-emerald-600">Meal Plan</router-link>
          </div>
        </nav>
      </div>
    </header>

    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>

    <footer class="bg-white border-t mt-12 py-6">
      <div class="container mx-auto px-4 text-center text-gray-500 text-sm">
        &copy; {{ new Date().getFullYear() }} Recipe Hub. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<style>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
</style>