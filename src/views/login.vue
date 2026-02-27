<script>
import Swal from 'sweetalert2';
import api from '@/services/api.js';
import Cookies from 'js-cookie';
import logoAbencoado from '@/assets/logoAbencoado-removebg-preview.png';
import image2 from '@/assets/fondoAbencoado.jpg';
import axios from 'axios';
export default{
    name:'login',
    data(){
        return{
            image1:'/fondoAbencoado.jpg',
            image2:image2,
            imgExists:true,
            logo1:'/logoAbencoado-removebg-preview.png',
            logo2:logoAbencoado,
            correo:'',
            pass:'',
            nit:''
        }
    },
    mounted(){
        const img= new Image()
        img.src=this.image1
        img.onerror=()=>{ this.imgExists=false}
    },
    methods:{
        getBgurl(){
            return this.imgExists ? this.image1 : this.image2
        },
        registroNuevo(){
            this.$router.push({name:'RegistroNuevo'});
        },
        async enviarLogin(){
            try {
               const responselogin = await api.post('/authUser',{
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
                Swal.fire({
                    icon:'error',
                    title:'Abencoado Group',
                    text:'Error en el servidor , intente mas tarde'
                })
                console.error('error en el servidor:', error);
                this.correo=''; 
                this.pass='';
                this.nit='';
            }
            
        }
        
    }
}    
</script>

<template>
<div class="fixed min-h-screen min-w-screen bg-no-repeat bg-cover" :style="{ backgroundImage: `url(${getBgurl()})`}">
<div class="flex flex-col ml-15 w-xs">
    <img :src="logo1" @error="logo1=logo2"  alt="nose pudo cargar la imagen" width="180" height="180"  class="bg-cover bg-center ">
</div>
<div class="  flex flex-col w-lg bg-gray-50 mx-auto  rounded-xl space-y-3">
<p class=" font-Nunito text-xl mx-auto mt-5 mb-5 ">Sistema Contable</p>
<hr class=" w-lg  mx-auto border border-yellow-200 mb-4">
<form class="ml-5">
    <label class=" block font-Nunito text-sm text-slate-700">Nit</label>
    <input v-model="nit" type="text" class=" text-sm p-2 rounded-xl border border-gray-200 w-md placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="Nit ejemplo:68483849">
    <label class=" block font-Nunito text-sm text-slate-700">Usuario</label>
    <input v-model="correo" type="text" class=" text-sm p-2 rounded-xl border border-gray-200 w-md placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder=" correo electronico @">
    <label class=" block font-Nunito text-sm text-slate-700">Contraseña</label>
    <input v-model="pass" type="password" class=" text-sm p-2 rounded-xl border border-gray-200 w-md placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder=" ingrese tu contraseña">    
</form>
<button @click="enviarLogin" class=" bg-blue-600 rounded-lg p-2 w-md text-white mt-5 ml-5 cursor-pointer">Iniciar</button>
<div class=" flex flex-row mt-4 items-center justify-between ml-5 mr-10 mb-10">
        <button @click="registroNuevo" type="button" class=" bg-green-600 rounded-lg py-2 px-6 text-white cursor-pointer">Registro Nuevo</button>
        <a href="#" class="fon-Nunito text-slate-800 ">Olvidaste tu Contraseña?</a>
</div>
</div>

<footer>
    
</footer>
</div>    

</template>