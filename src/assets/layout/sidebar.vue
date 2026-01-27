<script>
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
                   this.$router.push({name:'login'}) 
                 }
        }

}
</script>

<template>
<div class="relative">

<transition name="slide">
<div  class="fixed top-0 left-0  min-h-screen w-42 bg-blue-600 z-50 border-r-4  border-yellow-400 transition-transform durantion-300">

<div class="flex items-center justify-between px-6 mt-10 ">
          <span class="text-white font-bold text-lg" ><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.235 2.374c-.368.152-.697.482-1.356 1.14c-.659.66-.989.989-1.14 1.356a2 2 0 0 0 0 1.531c.151.368.48.697 1.14 1.356c.658.659.988.989 1.356 1.14a2 2 0 0 0 1.53 0c.368-.151.697-.48 1.356-1.14s.988-.988 1.14-1.356a2 2 0 0 0 0-1.53c-.152-.368-.48-.697-1.14-1.356s-.988-.989-1.356-1.141a2 2 0 0 0-1.53 0M4.87 8.738c-.367.152-.697.481-1.355 1.14c-.66.66-.989.989-1.141 1.356a2 2 0 0 0 0 1.531c.152.368.482.697 1.14 1.356c.66.659.989.988 1.356 1.14a2 2 0 0 0 1.531 0c.368-.152.697-.481 1.356-1.14s.988-.988 1.14-1.356a2 2 0 0 0 0-1.53c-.152-.368-.48-.698-1.14-1.357s-.988-.988-1.356-1.14a2 2 0 0 0-1.53 0m11.372 1.14c-.659.66-.988.989-1.14 1.356a2 2 0 0 0 0 1.531c.152.368.481.697 1.14 1.356s.989.988 1.356 1.14a2 2 0 0 0 1.53 0c.368-.152.698-.481 1.357-1.14s.987-.988 1.14-1.356a2 2 0 0 0 0-1.53c-.153-.368-.481-.698-1.14-1.357c-.66-.659-.989-.988-1.356-1.14a2 2 0 0 0-1.531 0c-.367.152-.697.481-1.356 1.14m-5.008 5.224c-.368.152-.697.482-1.356 1.14c-.659.66-.989.989-1.14 1.357a2 2 0 0 0 0 1.53c.151.368.48.697 1.14 1.356c.658.659.988.989 1.356 1.14a2 2 0 0 0 1.53 0c.368-.151.697-.48 1.356-1.14s.988-.988 1.14-1.356c.203-.49.203-1.04 0-1.53c-.152-.368-.48-.698-1.14-1.356c-.659-.66-.988-.989-1.356-1.141a2 2 0 0 0-1.53 0"/></svg></span>
          
</div>
<ul class="mt-15 space-y-4 px-6">
        <li>
                <router-link to="#">
                        <div class=" flex flex-row items-center">
                            <span class="cursor-pointer p-2 rounded-md transition-colors "><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="m21.743 12.331l-9-10c-.379-.422-1.107-.422-1.486 0l-9 10a1 1 0 0 0-.17 1.076c.16.361.518.593.913.593h2v7a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-4h4v4a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-7h2a.998.998 0 0 0 .743-1.669"/></svg></span>
                            <p class=" text-white font-Nunito text-sm">Dashboard</p>
                        </div>
                </router-link>
        </li>
        <li>
                <router-link to="/usuario" >
                    <div class=" flex flex-row items-center">
                        <span class=" cursor-pointer p-2 rounded-md"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M6.5 7.5a5.5 5.5 0 1 1 11 0a5.5 5.5 0 0 1-11 0M3 19a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v3H3z"/></svg></span>
                        <p class=" text-white font-Nunito text-sm">Usuarios</p>
                    </div>
                        
                </router-link>
        </li>
        <li>
                <router-link to="/cotizaciones" class="text-white font-Outfit  transition">
                        <div class=" flex flex-row items-center">
                            <span class=" cursor-pointer p-2 rounded-md"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 48 48"><path fill="#fff" fill-rule="evenodd" d="M24.039 6c-4.517 0-8.632 1.492-11.067 2.711q-.33.165-.616.322c-.378.206-.7.398-.956.567l2.77 4.078l1.304.519c5.096 2.571 11.93 2.571 17.027 0l1.48-.768L36.6 9.6a16 16 0 0 0-1.689-.957C32.488 7.437 28.471 6 24.04 6m-6.442 4.616a25 25 0 0 1-2.901-.728C16.978 8.875 20.377 7.8 24.04 7.8c2.537 0 4.936.516 6.92 1.17c-2.325.327-4.806.882-7.17 1.565c-1.86.538-4.034.48-6.192.081m15.96 5.064l-.246.124c-5.606 2.828-13.042 2.828-18.648 0l-.233-.118C6.008 24.927-.422 41.997 24.039 41.997S41.913 24.61 33.557 15.68M23 24a2 2 0 1 0 0 4zm2-2v-1h-2v1a4 4 0 0 0 0 8v4c-.87 0-1.611-.555-1.887-1.333a1 1 0 1 0-1.885.666A4 4 0 0 0 23 36v1h2v-1a4 4 0 0 0 0-8v-4c.87 0 1.611.555 1.887 1.333a1 1 0 1 0 1.885-.666A4 4 0 0 0 25 22m0 8v4a2 2 0 1 0 0-4" clip-rule="evenodd"/></svg></span>
                            <p class="text-white font-Nunito text-sm">Cotizaciones</p>
                        </div>
                        
                </router-link>
        </li>
        <li>
                <router-link to="#" class="text-white font-Outfit  transition">
                        <div class=" flex flex-row items-center">
                            <span class=" cursor-pointer p-2 rounded-md"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1696 1536"><path fill="#fff" d="M1671 350q40 57 18 129l-275 906q-19 64-76.5 107.5T1215 1536H292q-77 0-148.5-53.5T44 1351q-24-67-2-127q0-4 3-27t4-37q1-8-3-21.5t-3-19.5q2-11 8-21t16.5-23.5T84 1051q23-38 45-91.5t30-91.5q3-10 .5-30t-.5-28q3-11 17-28t17-23q21-36 42-92t25-90q1-9-2.5-32t.5-28q4-13 22-30.5t22-22.5q19-26 42.5-84.5T372 283q1-8-3-25.5t-2-26.5q2-8 9-18t18-23t17-21q8-12 16.5-30.5t15-35t16-36t19.5-32T504.5 12t36-11.5T588 6l-1 3q38-9 51-9h761q74 0 114 56t18 130l-274 906q-36 119-71.5 153.5T1057 1280H188q-27 0-38 15q-11 16-1 43q24 70 144 70h923q29 0 56-15.5t35-41.5l300-987q7-22 5-57q38 15 59 43m-1064 2q-4 13 2 22.5t20 9.5h608q13 0 25.5-9.5T1279 352l21-64q4-13-2-22.5t-20-9.5H670q-13 0-25.5 9.5T628 288zm-83 256q-4 13 2 22.5t20 9.5h608q13 0 25.5-9.5T1196 608l21-64q4-13-2-22.5t-20-9.5H587q-13 0-25.5 9.5T545 544z"/></svg></span>
                            <p class="text-white font-Nunito text-sm">Libro diario</p>
                        </div>
                        
                </router-link>
        </li>
        <li>
                <router-link to="/perfilEmpresa" class="text-white font-Outfit  transition">
                        <div class=" flex flex-row items-center">
                            <span class=" cursor-pointer p-2 rounded-md"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16"><path fill="#fff" d="M13.5 0h-12C.675 0 0 .675 0 1.5v13c0 .825.675 1.5 1.5 1.5h12c.825 0 1.5-.675 1.5-1.5v-13c0-.825-.675-1.5-1.5-1.5M13 14H2V2h11zM4 9h7v1H4zm0 2h7v1H4zm1-6.5a1.5 1.5 0 1 1 3.001.001A1.5 1.5 0 0 1 5 4.5M7.5 6h-2C4.675 6 4 6.45 4 7v1h5V7c0-.55-.675-1-1.5-1"/></svg></span>
                            <p class="text-white font-Nunito text-sm">Perfil empresa</p>
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
        <span class="font-Outfit text-sm  text-slate-700 ">Usuario:Admin</span>        
        <img src="../fotoPerfil.png" alt="" class=" object-cover w-15 h-15 rounded-full p-2">
        <span @click="cerrarSession" class=" cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><path fill="#e70a12" d="M18 2a16 16 0 1 0 16 16A16 16 0 0 0 18 2m.06 17.68a1.28 1.28 0 0 1-1.29-1.28V8.65a1.29 1.29 0 0 1 2.58 0v9.75a1.28 1.28 0 0 1-1.29 1.28M18 27.79a9.88 9.88 0 0 1-5.83-17.94a1.4 1.4 0 0 1 1.94.31a1.37 1.37 0 0 1-.31 1.92a7.18 7.18 0 1 0 11.43 5.8a7.07 7.07 0 0 0-3-5.76A1.37 1.37 0 0 1 22 10.2a1.4 1.4 0 0 1 1.94-.29A9.88 9.88 0 0 1 18 27.79" class="clr-i-solid clr-i-solid-path-1"/><path fill="none" d="M0 0h36v36H0z"/></svg></span>        
        </div>
</div>

<div  class=" flex flex-row min-h-screen bg-white transition-colors duration-300">
      <slot />
    </div>
</div>
</template>