<template>
  <ul class="pl-4 border-l border-gray-300 space-y-1">
    <li v-for="item in items" :key="item.cod_nombreCuenta">

      <!-- Título -->
      <div
        class="flex items-center justify-between cursor-pointer select-none
               hover:text-blue-600 transition-colors"
        @click="toggle(item)"
      >
        <span @click="$emit('select',item)">{{ item.puct }}{{ item.nombre_cuenta }}</span>

        <span
          v-if="item.children?.length"
          class="text-sm font-bold"
        >
          {{ item.open ? "−" : "+" }}
        </span>
      </div>

      <!-- Sublista animada -->
      <transition
        name="collapse"
        @enter="enter"
        @after-enter="afterEnter"
        @leave="leave"
      >
        <div
          v-show="item.open && item.children?.length"
          class="overflow-hidden"
        >
          <NestedList :items="item.children" />
        </div>
      </transition>

    </li>
  </ul>
</template>

<script>
export default {
  name: "NestedList",
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  methods: {
    toggle(item) {
      item.open = !item.open
    },

    // Animación height auto
    enter(el) {
      el.style.height = "0"
      el.style.opacity = "0"

      requestAnimationFrame(() => {
        el.style.height = el.scrollHeight + "px"
        el.style.opacity = "1"
      })
    },

    afterEnter(el) {
      el.style.height = "auto"
    },

    leave(el) {
      el.style.height = el.scrollHeight + "px"
      el.style.opacity = "1"

      requestAnimationFrame(() => {
        el.style.height = "0"
        el.style.opacity = "0"
      })
    }
  }
}
</script>

<style scoped>
.collapse-enter-active,
.collapse-leave-active {
  transition: height 0.25s ease, opacity 0.2s ease;
}
</style>