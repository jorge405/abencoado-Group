
<script>
export default{

    data(){
        return{
            cargando:false
        }
    }
}


</script>

<template>


<div class="fixed inset-0 flex items-center justify-around z-50">
        <div class="bg-gray-50 bg-opacity-80 ml-56 w-3xl p-6 rounded-lg shadow-2xl flex flex-col space-x-2">
            <p>hola mundo</p>
            <button @click="$emit('cancelar')" class="bg-blue-300">cerrar</button>
        </div>
</div>


</template>