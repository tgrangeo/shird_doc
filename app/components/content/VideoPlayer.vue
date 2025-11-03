<template>
  <div class="flex-1 flex items-center justify-center">
    <video
      src="/bird.mp4"
      class="h-96 w-auto rounded-lg shadow-lg object-cover"
      autoplay
      muted
      loop
      playsinline
    ></video>
  </div>
</template>

<style scoped>
video {
  transition: transform 0.6s ease;
}
video:hover {
  transform: scale(1.03);
}
</style>
