<script>
export default{
    name:'login',
    methods:{
        registroNuevo(){
            this.$router.push({name:'RegistroNuevo'});
        }
    }
}    
</script>

<template>
<div class="fixed min-h-screen min-w-screen  bg-[url(@/assets/fondoAbencoado.jpg)] bg-no-repeat bg-cover">

<div class="  flex flex-col w-xl bg-gray-50 mx-auto mt-40 rounded-xl space-y-3">
<p class=" font-Nunito text-2xl mx-auto mt-5 mb-5 ">Sistema Contable</p>
<hr class=" w-lg  mx-auto border border-yellow-200 mb-4">
<form class="ml-5">
    <label class=" block font-Nunito text-sm text-slate-700">Nit</label>
    <input type="text" class=" p-2 rounded-xl border border-gray-200 w-lg placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="Nit ejemplo:68483849">
    <label class=" block font-Nunito text-sm text-slate-700">Usuario</label>
    <input type="text" class=" p-2 rounded-xl border border-gray-200 w-lg placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder=" correo electronico @">
    <label class=" block font-Nunito text-sm text-slate-700">Contraseña</label>
    <input type="text" class=" p-2 rounded-xl border border-gray-200 w-lg placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder=" ingrese tu contraseña">
    <button class=" bg-blue-600 rounded-lg p-2 w-lg text-white mt-5 cursor-pointer">Iniciar</button>
</form>
<div class=" flex flex-row mt-4 items-center justify-between ml-5 mr-10 mb-10">
        <button @click="registroNuevo" class=" bg-green-600 rounded-lg py-2 px-6 text-white cursor-pointer">Registro Nuevo</button>
        <a href="#" class="fon-Nunito text-slate-800 ">Olvidaste tu Contraseña?</a>
</div>
</div>

<footer>
<div class=" ml-15">
<p class=" text-6xl font-Nunito">Abencoado</p>
<p class="text-3xl font-Nunito">Group</p>
</div>    
</footer>
</div>    



</template>