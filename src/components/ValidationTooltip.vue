<template>
  <transition 
    enter-active-class="animate__animated animate__bounceIn"
    leave-active-class="animate__animated animate__fadeOut"
  >
    <div 
      v-if="show" 
      class="absolute z-10 -top-8 left-0 flex items-center"
    >
      <div class="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md relative uppercase tracking-wider">
        {{ message }}
        <div class="absolute -bottom-1 left-2 w-2 h-2 bg-red-500 rotate-45"></div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: ['show', 'message']
}
</script>

<style scoped>
/* Ya no necesitas CSS manual aquí, Animate.css se encarga de todo */
.animate__animated {
  --animate-duration: 0.5s; /* Opcional: para que sea más rápido */
}
</style>