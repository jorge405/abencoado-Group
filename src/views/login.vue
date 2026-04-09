<script>
import Swal from 'sweetalert2';
import api from '@/services/api.js';
import Cookies from 'js-cookie';
import logoAbencoado from '@/assets/logoAbencoado-removebg-preview.png';
import image2 from '@/assets/fondoAbencoado.jpg';
import axios from 'axios';


const Toast= Swal.mixin({
    toast:true,
    position:"top-end",
    showConfirmButton:false,
    timer:3000,
    timerProgressBar: true,
    didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
})
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
            nit:'',
            mostrarLoginRegister:false,
            correo_register:'',
            pass_register:''
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
        
        async enviarLogin(){
            try {
               const responselogin = await api.post('/authUser',{
                correo:this.correo,
                pass:this.pass,
                nit:this.nit
               }) 
              
               if (responselogin.data.estado==='vacio') {
                Swal.fire({
                    icon:'error',
                    title:'Abencoado Group',
                    text:'contraseña o usuario incorrecto'
                })
                this.correo='';
                this.pass='';
                this.nit='';
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
             
        },
        async loginRegister(){
             this.mostrarLoginRegister=true;
            try {
                const responseLogin= await api.post('/getUserRegister',{
                    correo:this.correo_register,
                    pass:this.pass_register
                })
                
                if (responseLogin.data.status==='vacio') {
                    Toast.fire({
                        icon:'error',
                        text:'credenciales incorrectas'
                    })
                    this.mostrarLoginRegister=false;
                    this.correo_register='';
                    this.pass_register=''
                }else if(responseLogin.data.status==='ok'){
                    Toast.fire({
                        icon:'success',
                        text:'credenciales correctas'
                    });
                     this.mostrarLoginRegister=false;
                    this.$router.push('/registroNuevo');
                }
            } catch (error) {
                console.log(error)
                Toast.fire({
                    icon:'error',
                    text:'problemas con el servidor'
                })
            }
        },
        mostrarModal(){
            this.mostrarLoginRegister=true
        },
        cerrarModal(){
            this.mostrarLoginRegister=false;
            this.correo_register='';
            this.pass_register='';
        }
        
    }
}    
</script>

<template>
<div class="fixed min-h-screen min-w-screen bg-no-repeat bg-cover" :style="{ backgroundImage: `url(${getBgurl()})`}">
<div class="flex flex-col ml-15 w-xs">
    <img :src="logo1" @error="logo1=logo2"  alt="nose pudo cargar la imagen" width="180" height="180"  class="bg-cover bg-center ">
</div>
<div class="  flex flex-col w-md 2xl:w-lg h-96 bg-gray-50 mx-auto  rounded-xl space-y-3">
<p class=" font-Nunito text-xl mx-auto mt-5 mb-5 ">Sistema Contable</p>
<hr class=" w-lg  mx-auto border border-yellow-200 mb-4">
<form class="ml-5">
    <div class=" flex flex-col justify-center mx-auto">
            <label class=" block font-Nunito text-sm text-slate-700">Nit</label>
            <input v-model="nit" type="text" class=" w-sm 2xl:w-md text-sm p-2 rounded-xl border border-gray-200  placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="Nit ejemplo:68483849">
            <label class=" block font-Nunito text-sm text-slate-700">Usuario</label>
            <input v-model="correo" type="text" class=" w-sm 2xl:w-md text-sm p-2 rounded-xl border border-gray-200  placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder=" correo electronico @">
            <label class=" block font-Nunito text-sm text-slate-700">Contraseña</label>
            <input v-model="pass" type="password" class=" w-sm 2xl:w-md text-sm p-2 rounded-xl border border-gray-200 placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder=" ingrese tu contraseña">    
    </div>
    
</form>
<button @click="enviarLogin" class=" bg-blue-600 rounded-lg p-2 w-sm 2xl:w-md text-white text-sm font-Nunito mt-5 ml-5 cursor-pointer">Iniciar</button>
<div class=" flex flex-row  items-center justify-between ml-5 mr-10 mb-10">
        <button @click="mostrarModal" type="button" class=" bg-green-600 rounded-lg py-1.5 px-6 text-white text-sm font-Nunito cursor-pointer">Registro Nuevo</button>
        <a href="#" class="font-Nunito text-sm text-slate-800 ">Olvidaste tu Contraseña?</a>
</div>
</div>
<transition enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95">
    <div v-if="mostrarLoginRegister" class="fixed inset-0 flex items-center justify-around z-50">
        <div class="bg-gray-50 bg-opacity-80 text-white  ml-56 w-md p-6 rounded-lg shadow-2xl flex flex-col space-x-2">
            <form @submit.prevent="loginRegister">
                <p class=" text-md flex justify-center font-Nunito text-slate-900">Login Registro</p>
                <div class="flex flex-col ml-5 ">
                    <div class="flex flex-col ">
                        <label class=" text-sm font-Nunito text-slate-900" >Correo</label>
                        <input v-model="correo_register" type="text" class=" w-xs  text-sm p-2 text-slate-900 rounded-xl border border-gray-200  placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="correo electronico">
                    </div>
                    <div class="flex flex-col ">
                        <label class=" text-sm font-Nunito text-slate-900" >Contraseña</label>
                        <input v-model="pass_register"  type="password" class=" w-xs  text-sm p-2 text-slate-900 rounded-xl border border-gray-200  placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="*************">
                    </div>
                    <div class=" flex flex-row mt-4 space-x-8">
                        <button type="submit" class=" bg-blue-800 p-2 w-35 text-sm font-Nunito rounded-lg cursor-pointer text-white">Ingresar</button>
                        <button type="button" @click="cerrarModal" class=" bg-red-800 p-2 w-35 text-sm font-Nunito rounded-lg cursor-pointer text-white">Cancelar</button>
                    </div>

                </div>
            </form>
        </div>
    </div>
</transition>

<footer>
    
</footer>
</div>    

</template>