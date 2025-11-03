<script setup>
defineProps({
  emoji: { type: String, required: false, default: "\u{1F44B}" },
  title: { type: String, required: false, default: "title" }
});
</script>

<template>
  <div class="h-full w-full flex items-start justify-start bg-sky-50">
    <div class="flex items-start justify-start h-full">
      <div class="flex flex-col justify-center items-center px-20 w-full h-full text-center">
        <p class="text-[120px] mx-auto text-center font-bold mb-0">
          {{ emoji }}
        </p>
        <h1 class="text-[60px] font-bold" style="display: block; line-clamp: 2; text-overflow: ellipsis;">
          {{ title }}
        </h1>
      </div>
    </div>
  </div>
</template>
