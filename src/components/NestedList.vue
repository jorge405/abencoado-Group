<template>
  <ul class="pl-4 border-l border-gray-300 space-y-1 max-h-96 overflow-y-auto">
    <li class="text-sm font-Nunito " v-for="item in items" :key="item.cod_nombreCuenta">

      <!-- Título -->
      <div
        class="flex items-center justify-between cursor-pointer select-none
               hover:text-blue-50 px-2 hover:bg-blue-400 rounded-lg  transition-colors"
               :class="item.cod_nombreCuenta===selected ? 'bg-blue-200 rounded-lg text-blue-600' : ''"
        @click="toggle(item)"
        @contextmenu.prevent.stop="openContextMenu($event, item)"
        tabindex="0"
      >
        <span  @click.stop="$emit('select',item)">{{ item.puct }}{{ item.nombre_cuenta }}</span>

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
          <NestedList :items="item.children" :selected="selected" @select="$emit('select',$event)"  @abrir-registro="$emit('abrir-registro', $event)"/>
        </div>
      </transition>

    </li> 
    <!-- EL TRUCO: Menú Contextual Flotante (Solo uno por instancia) -->
    <div 
      v-if="menuVisible" 
      :style="{ top: menuY + 'px', left: menuX + 'px' }"
      class="fixed z-100 bg-white shadow-xl border border-gray-200 rounded-md py-1 w-48 animate__animated animate__fadeIn animate__faster"
      
    >
      <button  @click="dispararEventoPadre" class="w-full text-left px-4 py-2 hover:text-blue-500 cursor-pointer  rounded-xl flex items-center space-x-2 transition-colors text-slate-900 font-Nunito text-sm">Agregar Sub-cuenta </button>
    </div>
  </ul>
</template>

<script>
export default {
  name: "NestedList",
  props: {
    items: {
      type: Array,
      required: true
    },
    selected:{type:[String,Number],default:null}
  },
  data(){
    return {
      menuVisible: false,
      menuX: 0,
      menuY: 0,
      itemContext: null
    };
  },
  methods: {
    toggle(item) {
      item.open = !item.open
    },
    // Abrir el pequeño modal en la posición del mouse
    openContextMenu(e, item) {

      this.menuVisible = false;
      
      // 2. Pequeño delay para re-renderizar la posición (opcional pero ayuda)
      this.$nextTick(() => {
        this.menuX = e.clientX;
        this.menuY = e.clientY;
        this.itemContext = item;
        this.menuVisible = true;
      });

      // Cerrar el menú si se hace clic en otro lado
      const close = () => {
        this.menuVisible = false;
        document.removeEventListener('click', close);
      };
      setTimeout(() => document.addEventListener('click', close), 10);
    },

    dispararEventoPadre() {
    // PASO 1: Emitimos el evento con el objeto preciso
      this.$emit('abrir-registro', this.itemContext);
      
      // PASO 2: Cerramos el menú pequeñito
      this.menuVisible = false;
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