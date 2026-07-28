<script>
import sidebar from '@/assets/layout/sidebar.vue';    
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import api from '@/services/api.js'

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


export default {
    name:'perfilEmpresa',
    data(){
        return{
            gestion:[
                {value:'2027',text:'2027'},
                {value:'2026',text:'2026'},
                {value:'2025',text:'2025'},
                {value:'2024',text:'2024'},
                {value:'2023',text:'2023'},
                {value:'2022',text:'2022'},
                {value:'2021',text:'2021'},
                {value:'2020',text:'2020'},
                {value:'2019',text:'2019'},
                {value:'2018',text:'2018'},
                {value:'2017',text:'2017'},
                {value:'2016',text:'2016'},
                {value:'2015',text:'2015'},
                {value:'2014',text:'2014'},
                {value:'2013',text:'2013'},
                {value:'2012',text:'2012'},
                {value:'2011',text:'2011'},
            ],
            selectedGestion:'',
            infoEmpresa:[{
                cod_empresa:'',
                razon_social:'',
                nombre_propietario:'',
                nit:'',
                departamento:'',
                municipio:'',
                tipo_via:'',
                nombre_via:'',
                nro_testimonio:'',
                nro_poder:'',
                notaria:'',
                direccion:'',
                zona:'',
                nro_puerta:'',
                referencias:'',
                actividad_principal:''
            }],
            tipo_empresa:'',
            fecha_inscripcion:'',
            mostrarEmpresa:true,
            actividad_secundaria:[],
            cod_empresa:'',
            key:'abencoadoGroup',
            modalFirmas:false,
            agregaFirmas:[],
            modalFirmas:false,
            firmas:'',
            mostrarHora:null,
            mostrarFecha:null,
            listFirmas:[]

        }
    },
    mounted(){
        this.InfoEmpresa();
        this.getConfiguracion();
    },
    methods:{ 
        async InfoEmpresa(){
            const token = Cookies.get('token');
            try { 
                 
                const responseInfoEmpresa= await api.post('/infoEmpresa',{
                    token
                }) 
                
                if (responseInfoEmpresa.data.estado==='ok') {
                    const datosencrpyt= responseInfoEmpresa.data.rows[0].razon_social==='' ? responseInfoEmpresa.data.rows[0].nombre_propietario : responseInfoEmpresa.data.rows[0].razon_social;
                    
                    if (datosencrpyt==='') {
                        return '';
                    }else{
                      const encryptDatosEmpresa= CryptoJS.AES.encrypt(String(datosencrpyt),this.key).toString();
                      Cookies.set('dataEmp',encryptDatosEmpresa,{expires:1,secure:true});     
                    }
                    
                    const encryptEmpresa=CryptoJS.AES.encrypt(String(responseInfoEmpresa.data.rows[0].cod_empresa),this.key).toString();
                    Cookies.set('emp',encryptEmpresa,{expires:1,secure:true});
                    
                    this.infoEmpresa[0].cod_empresa=responseInfoEmpresa.data.rows[0].cod_empresa;
                    this.infoEmpresa[0].razon_social=responseInfoEmpresa.data.rows[0].razon_social;
                    this.infoEmpresa[0].nombre_propietario=responseInfoEmpresa.data.rows[0].nombre_propietario;
                    this.infoEmpresa[0].nit=responseInfoEmpresa.data.rows[0].nit;
                    this.infoEmpresa[0].departamento=responseInfoEmpresa.data.rows[0].departamento;
                    this.infoEmpresa[0].municipio=responseInfoEmpresa.data.rows[0].municipio;
                    this.infoEmpresa[0].tipo_via=responseInfoEmpresa.data.rows[0].tipo_via;
                    this.infoEmpresa[0].nombre_via=responseInfoEmpresa.data.rows[0].nombre_via;
                    this.infoEmpresa[0].nro_puerta=responseInfoEmpresa.data.rows[0].nro_puerta;
                    this.infoEmpresa[0].nro_testimonio=responseInfoEmpresa.data.rows[0].nro_testimonio;
                    this.infoEmpresa[0].nro_poder=responseInfoEmpresa.data.rows[0].nro_poder;
                    this.infoEmpresa[0].notaria=responseInfoEmpresa.data.rows[0].notaria;
                    this.tipo_empresa=responseInfoEmpresa.data.rows[0].tipo_empresa;
                    this.fecha_inscripcion=responseInfoEmpresa.data.rows[0].fecha_inscripcion;
                    this.infoEmpresa[0].zona=responseInfoEmpresa.data.rows[0].zona;
                    this.infoEmpresa[0].referencias=responseInfoEmpresa.data.rows[0].referencias;
                    this.infoEmpresa[0].actividad_principal=responseInfoEmpresa.data.rows[0].actividad_principal;
                    this.actividad_secundaria=responseInfoEmpresa.data.rows[0].actividad_secundaria;

                    
                } 
                console.log(this.actividad_secundaria)
             
                
            } catch (error) {
                console.error('error en el servidor:', error);
                Swal.fire({ 
                    icon:'error',
                    title:'Abencoado Group',
                    text:'Error al cargar la informacion de la empresa'
                }) 
            }
        },
        async getConfiguracion(){
            try {
                const responseConfiguracion= await api.get('/getConfiguracion')
                if (responseConfiguracion.data.status=='vacio') {
                    console.log('vacio')
                }else if(responseConfiguracion.data.status==='ok'){
                    const config= responseConfiguracion.data.rows[0];
                    console.log(config)
                    
    
                    // 1. Extraemos el valor original
                    let firmasRaw = config.firmas;

                    // 2. Si el valor es un String que empieza con "[", lo parseamos
                    if (typeof firmasRaw === 'string' && firmasRaw.startsWith('[')) {
                        try {
                            this.listFirmas = JSON.parse(firmasRaw);
                        } catch (e) {
                            this.listFirmas = [firmasRaw]; // Fallback: meter el string en un array
                        }
                    } 
                    // 3. Si YA es un array, pero el primer elemento es un string JSON (Caso raro de BD)
                    else if (Array.isArray(firmasRaw) && typeof firmasRaw[0] === 'string' && firmasRaw[0].startsWith('[')) {
                        try {
                            this.listFirmas = JSON.parse(firmasRaw[0]);
                        } catch (e) {
                            this.listFirmas = firmasRaw;
                        }
                    }
                    // 4. Si ya es un array limpio o cualquier otra cosa
                    else {
                        this.listFirmas = Array.isArray(firmasRaw) ? firmasRaw : [firmasRaw];
                    }
                    
                    this.mostrarHora=responseConfiguracion.data.rows[0].mostrarHora===1 ? true : false;
                    this.mostrarFecha=responseConfiguracion.data.rows[0].mostrarFecha===1 ? true : false; 
                    
                }
            } catch (error) {
                console.log(error)
            }
        },
        agregarFirmas(){
            if(this.firmas.trim()==='') return;
            this.agregaFirmas.push(this.firmas);
            this.firmas='';
        },
        quitarFirmas(){
            this.agregaFirmas.pop();
        },
        async EliminarFirmas(index){
                try {
                    const responseEliminarFirmas= await api.patch('/deleteFirmas',{
                        index:index
                    })

                    if (responseEliminarFirmas.data.status==='vacio') {
                        Toast.fire({
                            icon:'warning',
                            text:'no se encontro el elemento a eliminar'
                        })
                    }else if(responseEliminarFirmas.data.status==='ok'){
                        Toast.fire({
                            icon:'success',
                            text:'el elemento seleccionado se elimino correctamente'
                        })
                        this.getConfiguracion();
                    }
                } catch (error) {
                    console.log(error)
                    Toast.fire({
                            icon:'error',
                            text:'error en el servidor intentelo mas tarde'
                        })
                }
        },
        cerrarModalFirmas(){
            this.modalFirmas=false;
            this.agregaFirmas=[];
        },
        limpiarFirmas(datos) {
        if (!datos) return [];
        
        try {
            let resultado = datos;
            // Si es un string, lo parseamos (hasta 2 veces por si hay doble serialización)
            while (typeof resultado === 'string') {
                resultado = JSON.parse(resultado);
            }
            
            // Si el resultado final es un array, lo devolvemos
            if (Array.isArray(resultado)) {
                return resultado;
            }
            
            // Si es un solo elemento, lo metemos en un array
            return [resultado];
        } catch (e) {
            // Si falla el parseo (es un string normal), devolvemos el valor original en un array
            return Array.isArray(datos) ? datos : [datos];
        }
    },
        async actualizarConfiguracion(){
            try {
                const responseConfiguracion= await api.patch('/updateConfiguracion',{
                    mostrarHora:this.mostrarHora===false ? 0 : 1,
                    mostrarFecha:this.mostrarFecha===false ? 0 : 1,
                    firmas:this.agregaFirmas
                })

                if (responseConfiguracion.data.status==='vacio') {
                    Toast.fire({
                        icon:'warning',
                        text:'no se pudo modificar'
                    })
                    this.modalFirmas=false;
                }else if(responseConfiguracion.data.status==='ok'){
                    Toast.fire({
                        icon:'success',
                        text:'Configuracion actualizada correctamente'
                    })
                    this.modalFirmas=false;
                    this.agregaFirmas=[];
                }


            } catch (error) {
                console.log(error)
                Toast.fire({
                    icon:'error',
                    text:'error en el servidor intentelo mas tarde'
                })
            }
        },
        async AddConfiguracion(){
            try {
                const responseAddConfiguracion= await api.patch('/addConfiguracion',{
                    firmas:this.agregaFirmas
                })

                if (responseAddConfiguracion.data.status==='vacio') {
                    return
                }else if(responseAddConfiguracion.data.status==='ok'){
                    Toast.fire({
                        icon:'success',
                        text:'firmas agregadas con exito'
                    });
                    this.agregaFirmas=[];
                    this.getConfiguracion();
                }
                
            } catch (error) {
                console.log(error)
                Toast.fire({ 
                    icon:'error',
                    text:'error en el servidor intentelo mas tarde'
                })
            }
        }
    },
    watch:{
        tipo_empresa(newval){
            if (newval==='Unipersonal') {
                this.mostrarEmpresa=false
            }else{
                this.mostrarEmpresa=true;
            }
        }
    },
    computed:{
        formatFecha(){
            if (!this.fecha_inscripcion) return '';
            // Intenta parsear como fecha ISO/Date
            const d = new Date(this.fecha_inscripcion);
            if (!isNaN(d)){
                const day = String(d.getDate()).padStart(2,'0');
                const month = String(d.getMonth() + 1).padStart(2,'0');
                const year = d.getFullYear();
                return `${day}/${month}/${year}`;
            }
            // Fallback para formatos tipo 'YYYY-MM-DD' o 'YYYY/MM/DD'
            const parts = String(this.fecha_inscripcion).split(' ')[0].split(/[-\/]/);
            if (parts.length === 3 && parts[0].length === 4){
                return `${parts[2]}/${parts[1]}/${parts[0]}`;
            }
            // Si no se puede formatear, devuelve la cadena original
            return String(this.fecha_inscripcion);
        },
        
    },
    components:{
        sidebar
    }
}    
</script>

<template>
<sidebar>
    <template #title>Perfil Empresa</template>
    <div class="flex flex-col ml-55 space-x-5">
        <div class=" flex flex-row items-center space-x-10">
            <div class=" flex flex-col cursor-pointer ">
                <p class="text-2xl font-Nunito font-semibold text-slate-900 mt-10 ">{{ infoEmpresa[0].razon_social || infoEmpresa[0].nombre_propietario }}</p>
                <img src="../assets/fotoPerfil.png" alt="no cargo la imagen" class=" w-40 h-40 rounded-full mt-10 mb-5 object-cover">
            </div>
            <div v-show="false" class=" flex flex-col space-x-5 items-center mt-5">
                <p class=" text-md font-Nunito text-slate-900">Gestion:</p>
                <input v-model="selectedGestion"  type="text" class=" w-xs  rounded-xl border border-gray-300 p-2 placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 " placeholder=" Ingresa gestion ejemplo:2023">
                <div class=" flex flex-row  space-x-4">
                <button  class=" w-38 bg-blue-950 rounded-lg p-2 text-sm font-Nunito text-white mt-5 cursor-pointer">Crear Nueva gestion</button>
                <button  class=" w-38 bg-blue-950 rounded-lg p-2 text-sm font-Nunito text-white mt-5 cursor-pointer">Crear Reapertura</button>
            </div>
            </div> 
            <div class="flex flex-row space-x-5 ">
                <button @click="modalFirmas=true" class=" p-2 bg-blue-950 text-white font-Nunito w-40 rounded-lg text-sm cursor-pointer">Configuraciones</button>
            </div>
        </div>
        <div class=" mt-10 mb-10 bg-gray-100 p-5 rounded-lg w-5xl h-3/5 2xl:w-3xl 2xl:h-3/5">
            <p class=" text-slate-900 font-Nunito text-xl mt-5 ">Informacion de la Empresa</p>
            <div class=" grid grid-cols-4 mx-2 ">
                <div class=" flex flex-col">
                    <p class=" text-slate-900 font-Nunito font-bold text-xs 2xl:text-xs mt-5">{{ infoEmpresa[0].razon_social ? 'Razon Social' : 'Nombre Propietario'  }} </p>
                    <p class=" text-slate-900 font-Nunito text-xs 2xl:text-xs mt-2 uppercase">{{infoEmpresa[0].nombre_propietario}} </p>
                </div>
                <div class=" flex flex-col">
                    <p class=" text-slate-900 font-Nunito font-bold text-xs 2xl:text-xs mt-5">Nit </p>
                    <p class=" text-slate-950 font-Nunito text-xs 2xl:text-xs mt-2">{{ infoEmpresa[0].nit }} </p>
                </div>
                <div class=" flex flex-col">
                    <p class=" text-slate-900 font-Nunito font-bold text-xs 2xl:text-xs mt-5">Fecha Inscripcion </p>
                    <p class=" text-slate-950 font-Nunito text-xs  2xl:text-xs mt-2">{{ formatFecha || '—' }}</p>
                </div>
                <div class=" flex flex-col" v-show="infoEmpresa[0].nro_testimonio">
                    <p class=" text-slate-900 font-Nunito font-bold text-xs 2xl:text-xs mt-5">Nro Testimonio </p>
                    <p class=" text-slate-950 font-Nunito text-xs 2xl:text-xs mt-2">{{ infoEmpresa[0].nro_testimonio }} </p>
                </div>
                <div class=" flex flex-col" v-show="!infoEmpresa[0].nro_testimonio">
                    <p class=" text-slate-900 font-Nunito font-bold text-xs 2xl:text-xs mt-5">Departamento </p>
                    <p class=" text-slate-950 font-Nunito text-xs 2xl:text-xs mt-2 uppercase">{{ infoEmpresa[0].departamento }} </p>
                </div>
                
                
            </div>
            <div class=" grid grid-cols-4 mx-2">
                
                <div class=" flex flex-col" v-show="infoEmpresa[0].nro_poder">
                    <p class=" text-slate-900 font-Nunito font-bold text-xs 2xl:text-xs mt-5">Nro Poder </p>
                    <p class=" text-slate-950 font-Nunito text-xs 2xl:text-xs mt-2">{{ infoEmpresa[0].nro_poder }} </p>
                </div>
                <div class=" flex flex-col" v-show="infoEmpresa[0].notaria">
                    <p class=" text-slate-900 font-Nunito font-bold text-xs 2xl:text-xs mt-5">Notaria </p>
                    <p class=" text-slate-950 font-Nunito text-xs 2xl:text-xs mt-2 uppercase">{{ infoEmpresa[0].notaria }} </p>
                </div>
                <div class=" flex flex-col" v-show="infoEmpresa[0].nro_testimonio">
                    <p class=" text-slate-900 font-Nunito font-bold text-xs 2xl:text-xs mt-5">Departamento </p>
                    <p class=" text-slate-950 font-Nunito text-xs 2xl:text-xs mt-2 uppercase">{{ infoEmpresa[0].departamento }} </p>
                </div>
                <div class=" flex flex-col">
                    <p class=" text-slate-900 font-Nunito font-bold text-xs 2xl:text-xs mt-5">Municipio </p>
                    <p class=" text-slate-950 font-Nunito text-xs 2xl:text-xs mt-2 uppercase">{{ infoEmpresa[0].municipio }}</p>
                </div>
                <div class=" flex flex-col" v-show="!infoEmpresa[0].nro_poder">
                    <p class=" text-slate-900 font-Nunito font-bold text-xs 2xl:text-xs mt-5">Zona </p>
                    <p class=" text-slate-950 font-Nunito text-xs 2xl:text-xs mt-2 uppercase">{{ infoEmpresa[0].zona }}</p>
                </div>
                <div class=" flex flex-col" v-show="!infoEmpresa[0].notaria">
                    <p class=" text-slate-900 font-Nunito font-bold text-xs 2xl:text-xs mt-5">Tipo via </p>
                    <p class=" text-slate-950 font-Nunito text-xs 2xl:text-xs mt-2 uppercase">{{ infoEmpresa[0].tipo_via }}</p>
                </div>
            </div>
            <div class=" grid grid-cols-4 mx-2">
                
                <div class=" flex flex-col" v-show="infoEmpresa[0].nro_poder">
                    <p class=" text-slate-900 font-Nunito font-bold text-xs 2xl:text-xs mt-5">Zona </p>
                    <p class=" text-slate-950 font-Nunito text-xs 2xl:text-xs mt-2 uppercase">{{ infoEmpresa[0].zona }}</p>
                </div>
                <div class=" flex flex-col" v-show="infoEmpresa[0].notaria">
                    <p class=" text-slate-900 font-Nunito font-bold text-xs 2xl:text-xs mt-5">Tipo via </p>
                    <p class=" text-slate-950 font-Nunito text-xs 2xl:text-xs mt-2 uppercase">{{ infoEmpresa[0].tipo_via }}</p>
                </div>
                <div class=" flex flex-col">
                    <p class=" text-slate-900 font-Nunito font-bold text-xs  2xl:text-xs mt-5">Nombre de via </p>
                    <p class=" text-slate-950 font-Nunito text-xs 2xl:text-xs mt-2 uppercase">{{ infoEmpresa[0].nombre_via }}</p>
                </div>
                <div class=" flex flex-col">
                    <p class=" text-slate-900 font-Nunito font-bold text-xs 2xl:text-xs mt-5">Nro puerta </p>
                    <p class=" text-slate-950 font-Nunito text-xs 2xl:text-xs mt-2">{{ infoEmpresa[0].nro_puerta }}</p>
                </div>
                <div class=" flex flex-col" v-show="!infoEmpresa[0].nro_testimonio">
                    <p class=" text-slate-900 font-Nunito font-bold text-xs  2xl:text-xs mt-5">Referencias </p>
                    <p class=" text-slate-950 font-Nunito text-xs 2xl:text-xs mt-2 uppercase">{{ infoEmpresa[0].referencias }}</p>
                </div>
            </div>
            <div class="grid grid-cols-4 mx-2">
                
                <div class=" flex flex-col" v-show="infoEmpresa[0].nro_testimonio">
                    <p class=" text-slate-900 font-Nunito font-bold text-xs  2xl:text-xs mt-5">Referencias </p>
                    <p class=" text-slate-950 font-Nunito text-xs 2xl:text-xs mt-2 uppercase">{{ infoEmpresa[0].referencias }}</p>
                </div>
                <div class=" flex flex-col">
                    <p class=" text-slate-900 font-Nunito font-bold text-xs 2xl:text-xs mt-5">Actividad Principal </p>
                    <p class=" text-slate-950 font-Nunito text-xs 2xl:text-xs mt-2 uppercase">{{ infoEmpresa[0].actividad_principal }}</p>
                </div>
            </div>
            <div class="grid grid-cols-1 mx-2">
                    <div class="flex flex-col">
                        <p class="text-slate-900 font-Nunito font-bold text-xs 2xl:text-xs mt-5">Actividad Secundaria</p>
                        
                        <ul class="flex flex-row flex-wrap gap-2 mt-2">
                            <li v-for="(actividad, index) in (typeof actividad_secundaria === 'string' ? JSON.parse(actividad_secundaria) : actividad_secundaria)" 
                                :key="index" 
                                class="bg-blue-400 px-3 py-1 rounded-lg text-slate-900 font-Nunito text-xs uppercase">
                                {{ actividad }}
                            </li>
                        </ul>
                    </div>
            </div>
            
            
        </div>
        
        
        
        
    </div>
    <transition  enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95">
        <div v-if="modalFirmas" class="fixed inset-0 flex items-center justify-around z-50">
            <div class="bg-gray-50 bg-opacity-80   ml-56 w-2xl p-6 rounded-lg shadow-2xl flex flex-col space-x-2">
                <div class="flex flex-col space-y-4">
                    <p class="font-Nunito text-md text-slate-900 font-semibold ">Agregar Configuraciones</p>
                    <hr class="flex border border-gray-200">
                    <form @submit.prevent="AddConfiguracion">
                    <div class="flex flex-row space-x-4 items-center my-4 ">
                            <span class="font-Nunito text-sm text-slate-900 flex flex-row items-center space-x-4 ">Firmas:
                            <ul class="flex flex-row  items-center space-x-4" >
                                <li v-for="(firma, index) in agregaFirmas" :key="index" class=" text-gray-800 text-sm  mr-2 ml-2">
                                    {{ firma }}
                                </li>
                                <li v-show="agregaFirmas.length>0" @click="quitarFirmas" class=" bg-red-800 rounded-full text-xs p-2 cursor-pointer text-white flex flex-row justify-center items-center"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="#fff" d="M20 6a1 1 0 0 1 .117 1.993L20 8h-.081L19 19a3 3 0 0 1-2.824 2.995L16 22H8c-1.598 0-2.904-1.249-2.992-2.75l-.005-.167L4.08 8H4a1 1 0 0 1-.117-1.993L4 6zm-9.489 5.14a1 1 0 0 0-1.218 1.567L10.585 14l-1.292 1.293l-.083.094a1 1 0 0 0 1.497 1.32L12 15.415l1.293 1.292l.094.083a1 1 0 0 0 1.32-1.497L13.415 14l1.292-1.293l.083-.094a1 1 0 0 0-1.497-1.32L12 12.585l-1.293-1.292l-.094-.083zM14 2a2 2 0 0 1 2 2a1 1 0 0 1-1.993.117L14 4h-4l-.007.117A1 1 0 0 1 8 4a2 2 0 0 1 1.85-1.995L10 2z" stroke-width="0.5" stroke="#fff"/></svg></li>
                            </ul>
                        </span>
                        </div>
                        <div class="flex flex-row  space-x-2">
                            <label class="font-Nunito text-xs text-slate-800">Agregar firmas (Hasta 2 firmas)</label>
                            <input v-model="firmas"  type="text"  class=" bg-white text-sm rounded-xl border border-gray-300 p-1.5 placeholder:text-sm placeholder:text-slate-400 focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 text-slate-900  " placeholder="agregar">
                            <button type="button" @click="agregarFirmas" class=" p-2 bg-emerald-900 text-white text-sm w-40 rounded-lg cursor-pointer"> Agregar</button>
                        </div>
                        <div class="flex flex-row space-x-10 mt-4">
                            <button type="submit"  class=" flex flex-row justify-center items-center w-2xs bg-blue-950 rounded-lg p-2 font-Nunito cursor-pointer text-white text-xs">Guardar Configuraciones</button>
                        </div>
                        </form>
                    <p class="font-Nunito text-md text-slate-900 font-semibold ">Editar Configuraciones</p>
                    <hr class="flex border border-gray-200">
                    <p class="font-Nunito text-sm text-slate-900 mt-4">Configuraciones de impresion</p>
                    <form @submit.prevent="actualizarConfiguracion">
                        <div class="flex flex-row space-x-4 my-4">
                            <label class="font-Nunito text-xs text-slate-900">Mostrar Hora impresion</label>
                            <input type="checkbox" v-model="mostrarHora" class="w-5 h-5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500">
                            <label class="font-Nunito text-xs text-slate-900">Mostrar Fecha impresion</label>
                            <input type="checkbox" v-model="mostrarFecha" class="w-5 h-5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500">
                        </div>
                        
                        <div class="flex flex-row space-x-4 items-center mt-4">
                            <span class="font-Nunito text-sm text-slate-900 flex flex-row items-center space-x-4 ">Firmas:
                            <ul class="flex flex-row space-x-2 items-center">
                                <li v-for="(firma, index) in limpiarFirmas(listFirmas)" :key="'firma-'+index" class=" flex flex-row space-x-2 text-white text-xs p-2 bg-blue-950 rounded-lg mr-2 ml-2 lowercase">
                                    {{ firma }}<span @click="EliminarFirmas(index)" class=" bg-red-800 rounded-full text-xs p-1.5 cursor-pointer text-white flex flex-row justify-center items-center" ><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="#fff" d="M20 6a1 1 0 0 1 .117 1.993L20 8h-.081L19 19a3 3 0 0 1-2.824 2.995L16 22H8c-1.598 0-2.904-1.249-2.992-2.75l-.005-.167L4.08 8H4a1 1 0 0 1-.117-1.993L4 6zm-9.489 5.14a1 1 0 0 0-1.218 1.567L10.585 14l-1.292 1.293l-.083.094a1 1 0 0 0 1.497 1.32L12 15.415l1.293 1.292l.094.083a1 1 0 0 0 1.32-1.497L13.415 14l1.292-1.293l.083-.094a1 1 0 0 0-1.497-1.32L12 12.585l-1.293-1.292l-.094-.083zM14 2a2 2 0 0 1 2 2a1 1 0 0 1-1.993.117L14 4h-4l-.007.117A1 1 0 0 1 8 4a2 2 0 0 1 1.85-1.995L10 2z" stroke-width="0.5" stroke="#fff"/></svg></span> 
                                </li>
                                
                            </ul>
                            
                        </span>    
                        </div>
                        <div class="flex flex-row space-x-10 mt-8">
                            <button type="submit"  class=" flex flex-row justify-center items-center w-xs bg-blue-950 rounded-lg p-2 font-Nunito cursor-pointer text-white text-xs">Guardar Configuraciones</button>
                            <button type="button" @click="cerrarModalFirmas" class=" text-sm bg-red-900 text-white font-Nunito w-40 rounded-lg cursor-pointer">Cancelar</button>
                        </div>
                        </form>
                </div>
            </div>
        </div>
    </transition>           
</sidebar>

</template>