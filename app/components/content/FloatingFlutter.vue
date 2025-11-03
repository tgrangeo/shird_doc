<template>
  <div class="flex-1 flex items-center justify-center">
    <NuxtImg
      :src="image" 
      class="h-42 floating-logo"
      alt="Nuxt 3D Logo"
    />
  </div>
</template>

<script setup>
defineProps({
  image: {
    type: String,
    default: '/shird_ok.png'
  },
})
</script>

<style>
.floating-logo {
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.group:hover .floating-logo {
  transform: translateY(-10px);
}
</style>