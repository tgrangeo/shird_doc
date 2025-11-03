<template>
  <div class="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 mx-auto justify-center w-fit transition">
    <img 
      :src="image" 
      :alt="title" 
      class="w-64 h-64 object-contain rounded-xl"
    />
    <div class="flex-1">
      <h3 class="text-2xl font-extrabold text-red-400 mb-3">
        {{ title }}
      </h3>
      <p class="text-lg text-gray-700 dark:text-gray-300 mb-4">
        {{ description }}
      </p>
      <a
        href="https://gitlab.xefi.fr/xefi/xefi-interne/flutter_auth_provider"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1 text-lg font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 transition"
      >
        <span>Go to the repo</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M14 3h7m0 0v7m0-7L10 14m-1 7H3v-6" />
        </svg>
      </a>
    </div>
  </div>
</template>

<script setup>
defineProps({
  image: {
    type: String,
    default: '/shird_like.png'
  },
  title: {
    type: String,
    default: 'Give Us A Like!'
  },
  description: {
    type: String,
    default: 'If you enjoyed this project, consider leaving a like on our repository.'
  }
})
</script>
