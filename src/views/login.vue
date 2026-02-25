<script>
import Swal from 'sweetalert2';
import axios from 'axios';
import Cookies from 'js-cookie';
export default{
    name:'login',
    data(){
        return{
            correo:'',
            pass:'',
            nit:''
        }
    },
    methods:{
        registroNuevo(){
            this.$router.push({name:'RegistroNuevo'});
        },
        async enviarLogin(){
            try {
               const responselogin = await axios.post('http://localhost:3000/abencoado/authUser',{
                correo:this.correo,
                pass:this.pass,
                nit:this.nit
               }) 
              
               if (responselogin.data.estado==='error') {
                Swal.fire({
                    icon:'error',
                    title:'Abencoado Group',
                    text:'contraseña o usuario incorrecto'
                })
                this.correo='';
                this.pass='';
                // this.nit='';
               }else if(responselogin.data.estado==='ok'){
                Swal.fire({
                    icon:'success',
                    title:'Abencoado Group',
                    text:'Bienvenido al sistema'
                })
                Cookies.set('token',responselogin.data.token,{expires:1})
                this.$router.push('/perfilEmpresa')
               }
            } catch (error) {
                console.error('error en el servidor:', error);
            }
            
        }
        
    }
}    
</script>

<template>
<div class="fixed min-h-screen min-w-screen  bg-[url(@/assets/fondoAbencoado.jpg)] bg-no-repeat bg-cover">
<div class="flex flex-col ml-15 w-xs">
    <img src="../assets/logoAbencoado-removebg-preview.png"  alt="nose pudo cargar la imagen" width="200" height="200"  class="bg-cover bg-center ">
</div>
<div class="  flex flex-col w-xl bg-gray-50 mx-auto  rounded-xl space-y-3">
<p class=" font-Nunito text-xl mx-auto mt-5 mb-5 ">Sistema Contable</p>
<hr class=" w-lg  mx-auto border border-yellow-200 mb-4">
<form class="ml-5">
    <label class=" block font-Nunito text-sm text-slate-700">Nit</label>
    <input v-model="nit" type="text" class=" p-2 rounded-xl border border-gray-200 w-lg placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="Nit ejemplo:68483849">
    <label class=" block font-Nunito text-sm text-slate-700">Usuario</label>
    <input v-model="correo" type="text" class=" p-2 rounded-xl border border-gray-200 w-lg placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder=" correo electronico @">
    <label class=" block font-Nunito text-sm text-slate-700">Contraseña</label>
    <input v-model="pass" type="password" class=" p-2 rounded-xl border border-gray-200 w-lg placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder=" ingrese tu contraseña">    
</form>
<button @click="enviarLogin" class=" bg-blue-600 rounded-lg p-2 w-lg text-white mt-5 ml-5 cursor-pointer">Iniciar</button>
<div class=" flex flex-row mt-4 items-center justify-between ml-5 mr-10 mb-10">
        <button @click="registroNuevo" type="button" class=" bg-green-600 rounded-lg py-2 px-6 text-white cursor-pointer">Registro Nuevo</button>
        <a href="#" class="fon-Nunito text-slate-800 ">Olvidaste tu Contraseña?</a>
</div>
</div>

<footer>
    
</footer>
</div>    

</template>