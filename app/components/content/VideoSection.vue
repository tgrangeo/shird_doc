<template>
  <div
    class="flex flex-col md:flex-row items-center gap-6 md:gap-18 p-4 md:p-6 mx-auto justify-center w-fit max-w-full transition"
  >
    <div
      ref="videoContainer"
      class="flex-shrink-0 rounded-xl overflow-hidden bg-black"
      :style="{
        width: videoWidth,
        height: videoHeight,
        aspectRatio: aspectRatio,
      }"
    >
      <video
        ref="videoElement"
        :src="video"
        :poster="poster"
        class="w-full h-full object-cover rounded-xl"
        muted
        playsinline
      ></video>
    </div>

 <div class="md:text-left max-w-md md:max-w-lg">
  <h2 class="text-xl md:text-5xl font-extrabold text-teal-500 mb-2 md:mb-3">
    Our Goals
  </h2>
  <p class="text-base md:text-xl text-gray-700 dark:text-gray-300 mb-3 md:mb-4">
    Our goal is to contribute to the Flutter community by building tools that simplify development and 
    enhance productivity. We focus on improving the authentication flow with fewer dependencies, 
    ensuring it remains lightweight, secure, and easy to integrate. By sharing our work openly, 
    we aim to help developers create faster, more maintainable, and reliable apps — empowering 
    teams to focus on what really matters: delivering great user experiences.
  </p>
</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  video: {
    type: String,
    default: '/drift2.mp4'
  },
  poster: {
    type: String,
    default: ''
  },
  aspectRatio: {
    type: String,
    default: '12 / 16'
  },
  videoWidth: {
    type: String,
    default: '400px'
  },
  videoHeight: {
    type: String,
    default: 'auto'
  }
})

const videoElement = ref(null)
const videoContainer = ref(null)
let observer = null
let hasPlayed = false

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      const [entry] = entries
      if (entry.isIntersecting && !hasPlayed) {
        hasPlayed = true
        videoElement.value?.play()
        observer.disconnect()
      }
    },
    { threshold: 0.6 }
  )

  if (videoContainer.value) observer.observe(videoContainer.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>
