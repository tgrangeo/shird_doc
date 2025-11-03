<!-- components/content/HeroTwoColumn.vue -->
<template>
  <div class="relative overflow-hidden min-h-[650px] pt-20">
    <!-- Content -->
    <div class="relative z-10 container mx-auto px-4 py-20">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Left: Video -->
        <div class="flex items-center justify-center">
          <ContentSlot :use="$slots.left" />
        </div>

        <!-- Right: Content -->
        <div class="flex flex-col space-y-6">
          <h1 class="text-6xl font-bold">
            <ContentSlot :use="$slots.title" unwrap="p" />
          </h1>
          <p class="text-xl">
            <ContentSlot :use="$slots.description" unwrap="p" />
          </p>
          <div>
            <ContentSlot :use="$slots.code" />
          </div>
          <div class="flex gap-4">
            <ContentSlot :use="$slots.links" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>