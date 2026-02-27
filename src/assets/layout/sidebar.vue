<script>
import Cookies  from 'js-cookie'; 
export default{
        data(){
                return{
                        menuAbierto:false,
                }
        },
        methods:{
                toggleMenu() {
                        this.menuAbierto = !this.menuAbierto;
                 },
                 cerrarSession(){
                        Cookies.remove('emp');
                   this.$router.push({name:'login'}) 
                 }
        }

}
</script>

<template>
<div class="relative">

<transition name="slide">
<div  class="fixed top-0 left-0  min-h-screen w-42 bg-blue-950 z-50  transition-transform durantion-300">

<div class="flex items-center justify-between px-6 mt-5 ">
     <img src="../logoAbencoado-removebg-preview.png" alt="no se pudo cargar la imagen" class="w-30 h-30 object-cover">     
          
</div>
<ul class="mt-5 space-y-4 px-6">
        <li>
                <router-link to="#">
                        <div class=" flex flex-row items-center">
                            <span class="cursor-pointer p-2 rounded-md transition-colors "><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="m21.743 12.331l-9-10c-.379-.422-1.107-.422-1.486 0l-9 10a1 1 0 0 0-.17 1.076c.16.361.518.593.913.593h2v7a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-4h4v4a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-7h2a.998.998 0 0 0 .743-1.669"/></svg></span>
                            <p class=" text-white font-Nunito text-xs">Dashboard</p>
                        </div>
                </router-link>
        </li>
        <li>
                <router-link to="/usuario" >
                    <div class=" flex flex-row items-center">
                        <span class=" cursor-pointer p-2 rounded-md"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M6.5 7.5a5.5 5.5 0 1 1 11 0a5.5 5.5 0 0 1-11 0M3 19a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v3H3z"/></svg></span>
                        <p class=" text-white font-Nunito text-xs">Usuarios</p>
                    </div>
                        
                </router-link>
        </li>
        <li>
                <router-link to="/cotizaciones" class="text-white font-Outfit  transition">
                        <div class=" flex flex-row items-center">
                            <span class=" cursor-pointer p-2 rounded-md"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 48 48"><path fill="#fff" fill-rule="evenodd" d="M24.039 6c-4.517 0-8.632 1.492-11.067 2.711q-.33.165-.616.322c-.378.206-.7.398-.956.567l2.77 4.078l1.304.519c5.096 2.571 11.93 2.571 17.027 0l1.48-.768L36.6 9.6a16 16 0 0 0-1.689-.957C32.488 7.437 28.471 6 24.04 6m-6.442 4.616a25 25 0 0 1-2.901-.728C16.978 8.875 20.377 7.8 24.04 7.8c2.537 0 4.936.516 6.92 1.17c-2.325.327-4.806.882-7.17 1.565c-1.86.538-4.034.48-6.192.081m15.96 5.064l-.246.124c-5.606 2.828-13.042 2.828-18.648 0l-.233-.118C6.008 24.927-.422 41.997 24.039 41.997S41.913 24.61 33.557 15.68M23 24a2 2 0 1 0 0 4zm2-2v-1h-2v1a4 4 0 0 0 0 8v4c-.87 0-1.611-.555-1.887-1.333a1 1 0 1 0-1.885.666A4 4 0 0 0 23 36v1h2v-1a4 4 0 0 0 0-8v-4c.87 0 1.611.555 1.887 1.333a1 1 0 1 0 1.885-.666A4 4 0 0 0 25 22m0 8v4a2 2 0 1 0 0-4" clip-rule="evenodd"/></svg></span>
                            <p class="text-white font-Nunito text-xs">Cotizaciones</p>
                        </div>
                        
                </router-link>
        </li>
        <li>
                <router-link to="/planCuentas" class="text-white font-Outfit  transition">
                        <div class=" flex flex-row items-center">
                            <span class=" cursor-pointer p-2 rounded-md"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 2048 2048"><path fill="#fff" d="M1792 256v1792H256V256h512q0-53 20-99t55-82t81-55t100-20q53 0 99 20t82 55t55 81t20 100zM640 384v128h768V384h-256V256q0-27-10-50t-27-40t-41-28t-50-10q-27 0-50 10t-40 27t-28 41t-10 50v128zm1024 0h-128v256H512V384H384v1536h1280zm-405 335q42 0 78 15t64 42t42 63t16 78q0 39-15 76t-43 65l-526 531l-358 68l75-351l526-530q28-28 65-42t76-15m51 249q21-23 21-51q0-31-20-50t-52-20q-14 0-27 4t-23 15l-499 503l-27 126l129-25z"/></svg></span>
                            <p class="text-white font-Nunito text-xs">Plan de Cuentas</p>
                        </div>
                        
                </router-link>
        </li>
        <li>
                <router-link to="/libroDiario" class="text-white font-Outfit  transition">
                        <div class=" flex flex-row items-center">
                            <span class=" cursor-pointer p-2 rounded-md"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1696 1536"><path fill="#fff" d="M1671 350q40 57 18 129l-275 906q-19 64-76.5 107.5T1215 1536H292q-77 0-148.5-53.5T44 1351q-24-67-2-127q0-4 3-27t4-37q1-8-3-21.5t-3-19.5q2-11 8-21t16.5-23.5T84 1051q23-38 45-91.5t30-91.5q3-10 .5-30t-.5-28q3-11 17-28t17-23q21-36 42-92t25-90q1-9-2.5-32t.5-28q4-13 22-30.5t22-22.5q19-26 42.5-84.5T372 283q1-8-3-25.5t-2-26.5q2-8 9-18t18-23t17-21q8-12 16.5-30.5t15-35t16-36t19.5-32T504.5 12t36-11.5T588 6l-1 3q38-9 51-9h761q74 0 114 56t18 130l-274 906q-36 119-71.5 153.5T1057 1280H188q-27 0-38 15q-11 16-1 43q24 70 144 70h923q29 0 56-15.5t35-41.5l300-987q7-22 5-57q38 15 59 43m-1064 2q-4 13 2 22.5t20 9.5h608q13 0 25.5-9.5T1279 352l21-64q4-13-2-22.5t-20-9.5H670q-13 0-25.5 9.5T628 288zm-83 256q-4 13 2 22.5t20 9.5h608q13 0 25.5-9.5T1196 608l21-64q4-13-2-22.5t-20-9.5H587q-13 0-25.5 9.5T545 544z"/></svg></span>
                            <p class="text-white font-Nunito text-xs">Libro diario</p>
                        </div>
                        
                </router-link>
        </li>
        <li>
                <router-link to="/perfilEmpresa" class="text-white font-Outfit  transition">
                        <div class=" flex flex-row items-center">
                            <span class=" cursor-pointer p-2 rounded-md"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16"><path fill="#fff" d="M13.5 0h-12C.675 0 0 .675 0 1.5v13c0 .825.675 1.5 1.5 1.5h12c.825 0 1.5-.675 1.5-1.5v-13c0-.825-.675-1.5-1.5-1.5M13 14H2V2h11zM4 9h7v1H4zm0 2h7v1H4zm1-6.5a1.5 1.5 0 1 1 3.001.001A1.5 1.5 0 0 1 5 4.5M7.5 6h-2C4.675 6 4 6.45 4 7v1h5V7c0-.55-.675-1-1.5-1"/></svg></span>
                            <p class="text-white font-Nunito text-xs">Perfil empresa</p>
                        </div>
                        
                </router-link>
        </li>                                
</ul>

</div>
</transition>        

<!-- barra superior-->
<div class="flex  justify-between items-center py-2 bg-transparent z-50 shadow-x/30 ">
        <h3 class="text-xl font-Nunito font-semibold ml-50 text-slate-800">
        <slot name="title">Título</slot>
        </h3>
        <div class="mx-5 flex-row flex space-x-2 items-center">
        <span class="font-Outfit text-sm font-semibold  text-slate-700 ">Usuario:Admin</span>        
        <img src="../fotoPerfil.png" alt="" class=" object-cover w-15 h-15 rounded-full p-2">
        <span @click="cerrarSession" class=" cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><path fill="#1b1d54" d="M18 2a16 16 0 1 0 16 16A16 16 0 0 0 18 2m.06 17.68a1.28 1.28 0 0 1-1.29-1.28V8.65a1.29 1.29 0 0 1 2.58 0v9.75a1.28 1.28 0 0 1-1.29 1.28M18 27.79a9.88 9.88 0 0 1-5.83-17.94a1.4 1.4 0 0 1 1.94.31a1.37 1.37 0 0 1-.31 1.92a7.18 7.18 0 1 0 11.43 5.8a7.07 7.07 0 0 0-3-5.76A1.37 1.37 0 0 1 22 10.2a1.4 1.4 0 0 1 1.94-.29A9.88 9.88 0 0 1 18 27.79" class="clr-i-solid clr-i-solid-path-1"/><path fill="none" d="M0 0h36v36H0z"/></svg></span>        
        </div>
</div>

<div  class=" flex flex-row min-h-screen bg-white transition-colors duration-300">
      <slot />
    </div>
</div>
</template>