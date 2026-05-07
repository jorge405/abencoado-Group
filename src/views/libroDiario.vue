
<script>
import sidebar from '@/assets/layout/sidebar.vue';
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
//import { AgGridVue } from 'ag-grid-vue3';
//import "ag-grid-community/styles/ag-grid.css"
//import "ag-grid-community/styles/ag-theme-alpine.css"
import axios from 'axios'; 
import api from '@/services/api.js';
import Swal from 'sweetalert2';
//import NestedList from '@/components/NestedList.vue';
import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';
import registroLibroDiario from '@/components/libroDiario/registroLibroDiario.vue';
import modificarLibroDiario from '@/components/libroDiario/modificarLibroDiario.vue';


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
    data(){
        return{
            verModal:false,
            verEditar:false,
            key:'abencoadoGroup',
            comprobanteSeleccionado:null, 
            comprobante:[
                {value:1,text:'ingreso'},
                {value:2,text:'egreso'},
                {value:3,text:'traspaso'}
            ], 
            headers:['Nro comprobante','razon social','fecha comprobante','metodo pago','tipo comprobante','Total debe','Total haber','acciones'],
            mostrartabla:true,
            mostrarRegistro:false,
            mostrarRegistroEdit:false,
            tipo_comprobante:'',
            
            flatpickrTimeConfig:{
            enableTime: true,
            noCalendar: true,
            dateFormat: 'Y-m-d',
            locale:'es',
            time_24hr: true,
            minuteIncrement: 1,
            wrap: false,
            }, 
            
            mostrarConsultaLibro:false,
            mostrarCuenta:false,
            cuentaSeleccionada:null,
            cuentaRowIndex:null,
            empresas:[],
            tipoCuenta:[],
            itemSeleccionado:null,
            fecha1:'',
            fecha2:'',
            tipoComprobante_consulta:'',
            datoslibrofecha:[],
            mostrarValorNeto:false,
            mostrarModal:false,
            mostrarModalNuevo: false,
            seleccionarCuenta:null,
            cuenta_mayor:'',
            
        } 
    },
    mounted(){
        this.getallLibro(); 
    },
    methods:{
        numberParser(params) {
            return Number(params.newValue) || 0
        },
    
        mostrarlibroTabla(){
            this.verModal=true;
            
        },
        mostrarEditRegistro(item){
            console.log(item);
            // show form and hide table
            this.comprobanteSeleccionado=item;
            this.verEditar=true;
            // populate simple fields
            
        },
        finalizarRegistro(){
            this.verModal=false;
            this.getallLibro();
        },
        actualizarLista(){
            this.verEditar=false;
            this.getallLibro();
        },    
    async consultarlibrofechas(){
        const decryptEmpresa= CryptoJS.AES.decrypt(Cookies.get('emp'),this.key).toString(CryptoJS.enc.Utf8); 
        const comprobante= this.tipoComprobante_consulta.toLocaleUpperCase();
        const datos={
            fecha1:this.fecha1,
            fecha2:this.fecha2,
            tipo_comprobante:comprobante.toLocaleLowerCase(),
            cod_empresa:parseInt(decryptEmpresa)
        }
        try {
            const responselibrofecha= await api.post('/getlibroFecha',datos);
            if (responselibrofecha.data.status==='vacio') {
                Toast.fire({
                    icon:'info',
                    title:'Abencoado Group',
                    text:'no se encontraron datos'
                })
            }else if(responselibrofecha.data.status==='ok'){
                Toast.fire({
                    icon:'success',
                    title:'Abencoado Group',
                    text:'datos encontrados'
                });
                const rows=responselibrofecha.data.rows;
                const agrupados= rows.reduce((acc,current)=>{
                    const {cod_comprobante}= current
                    if (!acc[cod_comprobante]) {
                        // sino existe , creamos la cabecera del comprobante
                        acc[cod_comprobante]={
                            ...current,
                            asientos:[] // aqui meteremos las cuentas que varian
                        };
                    }
                    // añadimos solo los que varian a la lista de asientos
                    acc[cod_comprobante].asientos.push({
                        cod_asiento: current.cod_asiento,
                        cod_nombreCuenta: current.cod_nombreCuenta, // preserve account id for edits
                        nombre_cuenta: current.nombre_cuenta,
                        puct: current.puct,
                        debe: current.debe,
                        haber: current.haber,
                        referencia: current.referencia
                    });
                    return acc;

                },{});

                this.datoslibrofecha=Object.values(agrupados);
                console.log(this.datoslibrofecha)
                
            }
        } catch (error) {
            console.log('ha ocurrido un error :',error)
            Toast.fire({
                icon:'error',
                title:'Abencoado Group',
                text:'hubo un error en el servidor'
            })
        }
    },
    async getallLibro(){
        const cod_empresa= CryptoJS.AES.decrypt(Cookies.get('emp'),this.key).toString(CryptoJS.enc.Utf8); 
        
        try {
            const responseAll= await api.get(`/getallLibro/${cod_empresa}`);
            if (responseAll.data.status==='vacio') {
                return this.datoslibrofecha=[]
            }else if(responseAll.data.status==='ok'){
                const rows=responseAll.data.rows;
                const agrupados= rows.reduce((acc,current)=>{
                    const {cod_comprobante}= current
                    if (!acc[cod_comprobante]) {
                        // sino existe , creamos la cabecera del comprobante
                        acc[cod_comprobante]={
                            ...current,
                            asientos:[] // aqui meteremos las cuentas que varian
                        };
                    }
                    // añadimos solo los que varian a la lista de asientos
                    acc[cod_comprobante].asientos.push({
                        cod_asiento: current.cod_asiento,
                        cod_nombreCuenta: current.cod_nombreCuenta, // preserve account id for edits
                        nombre_cuenta: current.nombre_cuenta,
                        puct: current.puct,
                        debe: current.debe,
                        haber: current.haber,
                        referencia: current.referencia
                    });
                    return acc;
 
                },{});

                this.datoslibrofecha=Object.values(agrupados);
                console.log(this.datoslibrofecha)
            }
        } catch (error) {
            console.log(error)
        }
    },
    async getTipoCuenta(){
        try {
            const responseTipoCuenta = await api.get('/gettipocuenta')
            if (responseTipoCuenta.data.estado==='error') {
                this.tipoCuenta=[]
            }
            this.tipoCuenta=responseTipoCuenta.data.rows;
        } catch (error) {
            console.log('problemas al traer datos');
        }
    }, 
    
    },
    watch:{
        
    },
    components:{
        sidebar,
        flatPickr,
        
        registroLibroDiario,
        modificarLibroDiario
    }
}

</script>

<template>
<sidebar>
<template #title>Libro Diario</template>
    <!-- tabla libro diario-->
    <div v-if="mostrartabla" class=" flex flex-col ml-45 mt-5 space-y-5">
        <div class="flex flex-col  bg-gray-100 w-6xl  2xl:w-7xl  p-4 rounded-lg">
            <p class=" font-Nunito text-lg text-slate-900">Lista Libro Diario</p>
            <div class=" flex flex-row mt-5 items-center space-x-4">
            <label class=" font-Nunito text-sm">Buscar</label>
            <input  type="text" class=" text-sm p-2 bg-white rounded-xl border border-gray-300 w-xs placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="buscar comprobante">
            </div>
            <div class=" flex-1 mt-7 max-h-96 overflow-y-auto">
            
            <table class="w-full   text-sm text-left text-gray-500">
                <!-- Encabezado Dinámico -->
                <thead class="text-xs font-Nunito text-gray-700 uppercase bg-gray-50 sticky top-0">
                <tr>
                    <th v-for="header in headers" :key="header" class="px-4 py-3">
                    {{ header }}
                    </th>
                </tr>
                </thead>
                
                <!-- Cuerpo de la Tabla -->
                <tbody class=" divide-y divide-gray-200 bg-white">
                <tr v-if="!datoslibrofecha.length" class="bg-white">
                    <td colspan="6" class="px-4 py-2 text-center text-md font-Nunito text-slate-900">
                        Datos no encontrados
                    </td>
                </tr>
                <tr v-for="prod in datoslibrofecha" :key="prod.cod_comprobante" class="bg-white  hover:bg-gray-200">
                    <td v-show="false">
                    {{ prod.cod_comprobante }}
                    </td>
                    <td class="px-4 py-2 text-xs 2xl:text-sm font-Nunito  whitespace-nowrap cursor-pointer">
                    {{ prod.nro_comprobante }}
                    </td>
                    <td class="px-4 py-2 text-xs 2xl:text-sm font-Nunito cursor-pointer">
                    {{ prod.razon }}
                    </td>
                    <td class="px-4 py-2 text-xs 2xl:text-sm font-Nunito text-left cursor-pointer">
                    {{ prod.fecha_comprobante }}
                    </td>
                    <td v-show="false" class="px-4 py-2 text-xs 2xl:text-sm font-Nunito text-left cursor-pointer">
                    {{ prod.glosa }}
                    </td>
                    <td class="px-4 py-2 text-xs 2xl:text-sm font-Nunito text-left cursor-pointer">
                    {{ prod.metodo_pago }}
                    </td>
                    <td class="px-4 py-2 text-xs 2xl:text-sm font-Nunito text-left cursor-pointer">
                    {{ prod.tipo_comprobante }}
                    </td>
                    <td v-show="false" class="p-0">
                        <table class="w-full text-xs bg-gray-50">
                            <tr v-for="asiento in prod.asientos" :key="asiento.cod_asiento" class="border-b border-gray-100 last:border-0" >
                                <td class="p-2 text-green-700 font-medium text-right">{{ asiento.cod_asiento }}</td>
                                <td class="p-2 w-1/2">{{ asiento.nombre_cuenta }} PUCT:{{ asiento.puct }}</td>
                                <td class="p-2 text-green-700 font-medium text-right">{{ asiento.debe }}</td>
                                <td class="p-2 text-red-700 font-medium text-right">{{ asiento.haber }}</td>
                                <td v-show="false">{{ asiento.referencia }}</td>
                            </tr>
                        </table>
                    </td>
                    <td class="px-4 py-2 text-xs 2xl:text-sm text-green-700 font-Nunito text-left cursor-pointer ">{{ prod.total_debe }}</td>
                    <td class="px-4 py-2 text-xs 2xl:text-sm text-red-700 font-Nunito text-left cursor-pointer">{{ prod.total_haber }}</td>
                    <td class="px-2 py-2 text-left cursor-pointer" @click="mostrarEditRegistro(prod)">
                        <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="#928f8f" d="M15 3c1.296 0 2.496.41 3.477 1.11l-9.134 9.133a1 1 0 1 0 1.414 1.414l9.134-9.134A6 6 0 0 1 21 9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm6.657-.657a1 1 0 0 1 0 1.414L19.89 5.523a6 6 0 0 0-1.414-1.414l1.766-1.766a1 1 0 0 1 1.414 0Z" stroke-width="0.5" stroke="#928f8f"/></g></svg></span>
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
            <div class="flex flex-row mt-5 space-x-5">
            <button @click="mostrarlibroTabla" class=" flex flex-row items-center justify-center bg-blue-950 text-white text-xs 2xl:text-sm font-Nunito  p-2 rounded-xl w-[288px] cursor-pointer font-bold transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><g fill="none" fill-rule="evenodd"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="#fff" d="M12 2v6.5a1.5 1.5 0 0 0 1.356 1.493L13.5 10H20v10a2 2 0 0 1-1.85 1.995L18 22H6a2 2 0 0 1-1.995-1.85L4 20V4a2 2 0 0 1 1.85-1.995L6 2zm0 9.5a1 1 0 0 0-.993.883L11 12.5V14H9.5a1 1 0 0 0-.117 1.993L9.5 16H11v1.5a1 1 0 0 0 1.993.117L13 17.5V16h1.5a1 1 0 0 0 .117-1.993L14.5 14H13v-1.5a1 1 0 0 0-1-1m2-9.457a2 2 0 0 1 .877.43l.123.113L19.414 7a2 2 0 0 1 .502.84l.04.16H14z" stroke-width="0.5" stroke="#fff"/></g></svg>Nuevo</button>
            <button @click="mostrarConsultaLibro=true" class=" flex flex-row items-center justify-center bg-blue-950 text-white text-xs 2xl:text-sm font-Nunito border  p-2 rounded-xl w-[288px] cursor-pointer font-bold transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="#fff" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8" stroke-width="0.5" stroke="#fff"/><path fill="#fff" d="M12.5 7H11v6l5.25 3.15l.75-1.23l-4.5-2.67z" stroke-width="0.5" stroke="#fff"/></svg>Consultar por fechas</button>
            </div>
        </div>
    </div>
    <!-- formulario de registro libro diario-->
    <transition enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95">
    
    <registroLibroDiario titulo="Registro de  Libro Diario" :mostrarRegistro="verModal" @cerrar="verModal=false" @registro-exitoso="finalizarRegistro">

    </registroLibroDiario>           
    </transition>

    <!-- modal de editar libro diario-->
    <transition enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95">
    <modificarLibroDiario :mostrarRegistroEditar="verEditar" :comprobanteSeleccionado="comprobanteSeleccionado" titulo="Modificar libro diario" @cerrar="verEditar=false" @registro-exitoso="actualizarLista">

    </modificarLibroDiario>
               
    </transition>
    <div class="flex flex-col ml-50 space-y-5" v-if="false">
        <form @submit.prevent="envioLibro">
        <div class=" bg-gray-100 w-7xl h-10/12 rounded-lg p-8 ">
        <div class=" flex flex-row space-x-5">
            <p class=" font-Nunito text-lg text-slate-900 font-semibold">Registro de Comprobante Diario</p>
            <div class=" flex flex-row space-x-5">
                <button class=" p-1.5 bg-gray-300 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="#0e0e0e" d="M4.5 2.25a.75.75 0 0 1 .75.75v18a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75m12.907 1.464c1.146-.917 2.843-.1 2.843 1.367v13.838c0 1.468-1.697 2.284-2.843 1.367l-8.65-6.92a1.75 1.75 0 0 1 0-2.732z" stroke-width="0.5" stroke="#0e0e0e"/></svg></button>
                <button class=" p-1.5 bg-gray-300 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="#0e0e0e" d="M20.095 21a.75.75 0 0 1-.75-.75V3.75a.75.75 0 0 1 1.5 0v16.5a.74.74 0 0 1-.75.75m-3.4-9.589a2.25 2.25 0 0 1-.85 1.82l-9.11 7.09c-.326.247-.713.4-1.12.44h-.23a2.14 2.14 0 0 1-1-.22a2.2 2.2 0 0 1-.9-.81a2.17 2.17 0 0 1-.33-1.16V5.421a2.2 2.2 0 0 1 .31-1.12a2.25 2.25 0 0 1 .85-.8a2.18 2.18 0 0 1 2.24.1l9.12 6.08c.29.191.53.448.7.75a2.3 2.3 0 0 1 .32.98" stroke-width="0.5" stroke="#0e0e0e"/></svg></button>
            </div>
        </div>
        <div class=" grid grid-cols-2 space-x-2 ">
            <div class=" grid grid-cols-2 mt-5 gap-x-4">
            <div class=" flex flex-col">
                <label class=" block font-Nunito text-sm text-slate-700">Comprobante Nro</label>
                <input v-model="nro_comprobante"  type="text" class=" bg-white p-1.5 rounded-xl border border-gray-200  placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="Nit ejemplo:68483849">
            </div>
            <div class=" flex flex-col">
                <label class=" block font-Nunito text-sm text-slate-700">Tipo de comprobante</label>
                <select v-model="tipo_comprobante" class=" bg-white text-sm font-Nunito p-2 border border-gray-200 rounded-xl placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10  ">
                    <option value="" selected disabled class="">Selecciona tipo comprobante</option>
                    <option v-for="item in comprobante"  :key="item.value" :value="item.value" >{{ item.text }}</option>    
                </select>
            </div>
        </div>
        <div class=" grid grid-cols-3 space-x-2 items-center mt-5">
            <div class=" flex flex-col">
                <label class="text-sm font-Nunito text-slate-800 ">Fecha</label>
                <div class="flex flex-row relative">
                            <flat-pickr
                            v-model="fecha_comprobante"
                            :config="flatpickrConfig"
                            class=" w-sm  appearance-none rounded-xl border border-gray-300  bg-white p-2   text-sm text-slate-800 shadow-theme-xs placeholder:text-gray-700 focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10"
                            placeholder="ingrese fecha"/>
                            <span
                            class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                            <svg
                            class="fill-current"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M6.66659 1.5415C7.0808 1.5415 7.41658 1.87729 7.41658 2.2915V2.99984H12.5833V2.2915C12.5833 1.87729 12.919 1.5415 13.3333 1.5415C13.7475 1.5415 14.0833 1.87729 14.0833 2.2915V2.99984L15.4166 2.99984C16.5212 2.99984 17.4166 3.89527 17.4166 4.99984V7.49984V15.8332C17.4166 16.9377 16.5212 17.8332 15.4166 17.8332H4.58325C3.47868 17.8332 2.58325 16.9377 2.58325 15.8332V7.49984V4.99984C2.58325 3.89527 3.47868 2.99984 4.58325 2.99984L5.91659 2.99984V2.2915C5.91659 1.87729 6.25237 1.5415 6.66659 1.5415ZM6.66659 4.49984H4.58325C4.30711 4.49984 4.08325 4.7237 4.08325 4.99984V6.74984H15.9166V4.99984C15.9166 4.7237 15.6927 4.49984 15.4166 4.49984H13.3333H6.66659ZM15.9166 8.24984H4.08325V15.8332C4.08325 16.1093 4.30711 16.3332 4.58325 16.3332H15.4166C15.6927 16.3332 15.9166 16.1093 15.9166 15.8332V8.24984Z"
                            fill=""/></svg>
                            </span>
                </div>
            </div>
            <div class=" flex flex-col">
                <label class=" block font-Nunito text-sm text-slate-700">T.C $us</label>
                <input v-model="dolar" type="text" class=" bg-white p-1.5 rounded-xl border border-gray-200  placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="Nit ejemplo:68483849">            
            </div>
            <div class=" flex flex-col">
                <label class=" block font-Nunito text-sm text-slate-700">T.C Ufv</label>
                <input v-model="ufv" type="text" class=" bg-white p-1.5 rounded-xl border border-gray-200  placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="Nit ejemplo:68483849">            
            </div>
        </div>
        </div>
        <div class="grid grid-cols-3 space-x-4">
            <div class=" flex flex-col">
                <label class=" block font-Nunito text-sm text-slate-700">Razon social/propietario</label>
                <select v-model="selectedEmpresa" class=" bg-white p-2 text-sm border border-gray-200 rounded-xl placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10  ">
                    <option value="" selected disabled class=" font-Nunito text-sm  ">Selecciona empresa</option>
                    <option  v-for="item in empresas" :key="item.cod_empresa" :value="item.cod_empresa">{{ item.razon_social || item.nombre_propietario }}</option>
                </select>    
            </div>
            <div class=" flex flex-col">
                <label class=" block font-Nunito text-sm text-slate-700">Glosa</label>
                <input v-model="glosa" type="text" class=" bg-white p-2 rounded-xl border text-sm border-gray-200  placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="ingrese glosa">            
            </div>
            <div class=" flex flex-col">
                <label class=" block font-Nunito text-sm text-slate-700">Metodo de Pago</label>
                <select v-model="metodo_pago" class=" bg-white text-sm font-Nunito p-2 border border-gray-200 rounded-xl placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10  ">
                    <option value="" selected disabled class="font-Nunito text-sm  ">Selecciona el metodo de pago</option>
                    <option v-for="item in pago"  :key="item.value" :value="item.text" >{{ item.text }}</option>    
                </select>
            </div>
        </div>
        <!-- tabla debe haber-->
        <div class="w-6xl h-80 mx-auto mb-2 mt-10 bg-gray-300 overflow-y-auto border-2 border-slate-900 ag-theme-alpine">
            <AgGridVue ref="agGrid"
                class="w-full h-full font-Nunito"
                :columnDefs="columnDefs"
                :rowData="rowData"
                :defaultColDef="defaultColDef"
                :stopEditingWhenCellsLoseFocus="true"
                @cell-value-changed="onCellValueChanged"
                @cell-blur="onCellBlur"
                @cell-key-down="onCellKeyDown"
                @cell-clicked="onCellClicked"
            />
        </div>
        <div class=" flex flex-row items-center space-x-4 mb-8 mr-8 justify-end">
            <label for="" class=" font-Nunito text-md font-semibold ">Totales:</label>
            <input  type="text" disabled :value="total_debe.toFixed(2)" class=" bg-white rounded-xl border border-gray-300 p-1.5 placeholder:text-sm placeholder:text-slate-900 focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 text-slate-900  " placeholder="">
            <input   type="text" disabled :value="total_haber.toFixed(2)" class=" bg-white rounded-xl border border-gray-300 p-1.5 placeholder:text-sm placeholder:text-slate-900 focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 text-slate-900  " placeholder="">
            <label for="" class=" font-Nunito text-sm font-semibold ">Diferencia:</label>
            <p class=" text-blue-800 font-Nunito text-sm" :class="diferencia> 0 ? 'border-red-500' :'border-green-500'">{{ diferencia.toFixed(2) }}</p>
        </div>
        </div>
    <div class=" flex flex-row space-x-4 mt-5">
        <button type="submit" :disabled="diferencia>0" :class="diferencia>0 ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-50' :'bg-blue-800 text-white hover:bg-green-600'" class=" w-xs bg-blue-950 rounded-lg p-2 font-Nunito text-white text-sm cursor-pointer">{{diferencia>0 ? 'Diferencia pendiente' : 'Registrar Comprobante'}}</button>
        <button type="button" @click="mostrarViewRegistro" class=" w-xs bg-blue-950 rounded-lg p-2 font-Nunito cursor-pointer text-white text-sm">Cancelar</button>
    </div>
    </form>
    </div>
    <!-- MODAL PARA CONSULTAR LIBRO-->
    <transition enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95">
    <div v-if="mostrarConsultaLibro" class="fixed inset-0 flex items-center justify-around z-50">
        <div class="bg-gray-50 bg-opacity-80 text-white  ml-56 w-xl p-6 rounded-lg shadow-2xl flex flex-col space-x-2">
            <p class=" text-slate-900 font-Nunito text-md font-bold mb-5 mx-auto">CONSULTAR LIBRO</p>
            <div class="flex flex-col">
                <form  @submit.prevent="consultarlibrofechas">
                <div class=" flex flex-row space-x-4">
                    <div class=" flex flex-row items-center">
                    <label for="" class=" font-Nunito text-sm font-semibold text-slate-900 ">De:</label>
                        <div class="flex flex-row relative ml-2">
                            <flat-pickr
                            v-model="fecha1"
                            :config="flatpickrConfig"
                            class="  appearance-none rounded-xl border border-gray-300  bg-white p-2.5   text-sm text-slate-800 shadow-theme-xs placeholder:text-gray-700 focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10"
                            placeholder="ingrese fecha"/>
                            <span
                            class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                            <svg
                            class="fill-current"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M6.66659 1.5415C7.0808 1.5415 7.41658 1.87729 7.41658 2.2915V2.99984H12.5833V2.2915C12.5833 1.87729 12.919 1.5415 13.3333 1.5415C13.7475 1.5415 14.0833 1.87729 14.0833 2.2915V2.99984L15.4166 2.99984C16.5212 2.99984 17.4166 3.89527 17.4166 4.99984V7.49984V15.8332C17.4166 16.9377 16.5212 17.8332 15.4166 17.8332H4.58325C3.47868 17.8332 2.58325 16.9377 2.58325 15.8332V7.49984V4.99984C2.58325 3.89527 3.47868 2.99984 4.58325 2.99984L5.91659 2.99984V2.2915C5.91659 1.87729 6.25237 1.5415 6.66659 1.5415ZM6.66659 4.49984H4.58325C4.30711 4.49984 4.08325 4.7237 4.08325 4.99984V6.74984H15.9166V4.99984C15.9166 4.7237 15.6927 4.49984 15.4166 4.49984H13.3333H6.66659ZM15.9166 8.24984H4.08325V15.8332C4.08325 16.1093 4.30711 16.3332 4.58325 16.3332H15.4166C15.6927 16.3332 15.9166 16.1093 15.9166 15.8332V8.24984Z"
                            fill=""/></svg>
                            </span>
                        </div>
                    </div>
                    <div class=" flex flex-row items-center">
                    <label for="" class=" font-Nunito text-sm text-slate-900 font-semibold ">Hasta:</label>
                        <div class="flex flex-row relative ml-2">
                            <flat-pickr
                            v-model="fecha2"
                            :config="flatpickrConfig"
                            class=" appearance-none rounded-xl border border-gray-300  bg-white p-2.5   text-sm text-slate-800 shadow-theme-xs placeholder:text-gray-700 focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10"
                            placeholder="ingrese fecha"/>
                            <span
                            class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                            <svg
                            class="fill-current"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M6.66659 1.5415C7.0808 1.5415 7.41658 1.87729 7.41658 2.2915V2.99984H12.5833V2.2915C12.5833 1.87729 12.919 1.5415 13.3333 1.5415C13.7475 1.5415 14.0833 1.87729 14.0833 2.2915V2.99984L15.4166 2.99984C16.5212 2.99984 17.4166 3.89527 17.4166 4.99984V7.49984V15.8332C17.4166 16.9377 16.5212 17.8332 15.4166 17.8332H4.58325C3.47868 17.8332 2.58325 16.9377 2.58325 15.8332V7.49984V4.99984C2.58325 3.89527 3.47868 2.99984 4.58325 2.99984L5.91659 2.99984V2.2915C5.91659 1.87729 6.25237 1.5415 6.66659 1.5415ZM6.66659 4.49984H4.58325C4.30711 4.49984 4.08325 4.7237 4.08325 4.99984V6.74984H15.9166V4.99984C15.9166 4.7237 15.6927 4.49984 15.4166 4.49984H13.3333H6.66659ZM15.9166 8.24984H4.08325V15.8332C4.08325 16.1093 4.30711 16.3332 4.58325 16.3332H15.4166C15.6927 16.3332 15.9166 16.1093 15.9166 15.8332V8.24984Z"
                            fill=""/></svg>
                            </span>
                        </div>
                    </div>    
                </div>
                <div class=" flex flex-col mt-4 mb-5">
                    <label class=" font-Nunito text-sm text-slate-900 font-semibold ">Tipo de comprobante</label>
                    <select v-model="tipoComprobante_consulta" class=" bg-white text-sm text-slate-950 p-2 border border-gray-200 rounded-xl placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10  ">
                        <option value="" selected disabled>Selecciona tipo comprobante</option>
                        <option v-for="item in comprobante"  :key="item.value" :value="item.text" >{{ item.text }}</option>    
                    </select>
                </div>    
                <div class=" flex flex-row space-x-4 justify-center">
                    <button type="submit" @click="mostrarConsultaLibro=false" class=" bg-blue-950 w-xs  text-sm rounded-lg p-2 cursor-pointer">Aceptar</button>
                    <button type="button" @click="mostrarConsultaLibro=false" class=" bg-red-800 w-xs text-sm rounded-lg p-2 cursor-pointer">Cancelar</button>
                </div>
                </form>
            </div>
        </div>
    </div>            

    </transition>

    <!-- MODAL PARA CONSULTAR CUENTA-->
    
    <!-- modal para crear nuevo plan de cuenta-->
    <transition enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95">
        <div v-if="mostrarModal" class="fixed inset-0 flex items-center justify-around z-50">
            <div class=" bg-gray-50 bg-opacity-80 text-white  ml-56 w-3xl p-6 rounded-lg shadow-2xl flex flex-col space-x-2">
                <p class="text-slate-900 text-xl mx-auto font-Nunito">Registro de Cuenta</p>
                <form @submit.prevent="envioRegistroCuenta">
                    <div class="grid grid-cols-2 gap-x-5">
                        <div class="flex flex-col mt-5">
                            <label class=" text-sm font-Nunito text-slate-900 mb-2">Nombre de Cuenta</label>     
                            <input v-model="datosEdit.nombre_cuenta"  type="text" class=" w-xs rounded-xl border border-gray-300 p-2 placeholder:text-sm placeholder:text-slate-900 focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 text-slate-900  " placeholder=" Ingrese nombre de cuenta">
                        </div>
                        <div class="flex flex-col mt-5 justify-center">
                            <label class=" text-sm font-Nunito text-slate-900 mb-2">Puct</label>     
                            <p class=" text-slate-900 text-md font-Nutito">{{ datosEdit.puct || 0 }}</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-x-5">
                        
                        <div  class="flex flex-col mt-5 justify-center">
                            <label class=" text-sm font-Nunito text-slate-900 mb-2">Tipo cuenta</label>     
                            <p class=" text-slate-900 text-md font-Nutito">{{ datosEdit.selectedCuenta }}</p>
                        </div>
                        <div class="flex flex-col mt-5 justify-center">
                            <label class=" text-sm font-Nunito text-slate-900 mb-2">Nivel</label>     
                            <p class=" text-slate-900 text-md font-Nutito">{{ datosEdit.selectedNivel }}</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-x-5">
                        <div class="flex flex-col mt-5 justify-center">
                            <label class=" text-sm font-Nunito text-slate-900 mb-2">Cuenta Mayor</label>     
                            <p class="text-slate-900 text-md font-Nunito">{{ cuenta_mayor }}</p>
                        </div>
                    </div>
                    <div class=" flex flex-row space-x-5 mt-5">
                        <button type="submit" class=" w-xs bg-blue-950 rounded-lg p-2 cursor-pointer text-white font-Nunito text-sm flex flex-row justify-center ">Registrar Nuevo <span class="mx-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M21 7v12q0 .825-.587 1.413T19 21H5q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h12zm-9 11q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-6-8h9V6H6z"/></svg></span></button>
                        <button @click="cerrarModalRegistroCuenta" type="button" class="w-xs bg-blue-950 rounded-lg p-2 cursor-pointer text-white font-Nunito text-sm flex flex-row justify-center">Cancelar <span class="mx-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m5 13.59L15.59 17L12 13.41L8.41 17L7 15.59L10.59 12L7 8.41L8.41 7L12 10.59L15.59 7L17 8.41L13.41 12z"/></svg></span></button>
                    </div>
                </form>
            </div>
        </div>        

    </transition>
    <!-- MODA PARA EL VALOR NETO IVA Y IT-->
    <transition enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95">
    <div v-if="mostrarValorNeto" class="fixed inset-0 flex items-center justify-around z-50">
        <div class="bg-gray-50 bg-opacity-80   ml-56 w-xs p-6 rounded-lg shadow-2xl flex flex-col space-x-2">
            <div class="flex flex-col space-y-5 justify-center text-white items-center">
                <button class=" w-28 bg-blue-950 p-1.5 rounded-lg text-sm font-Nunito">Valor neto 87%</button>
                <button class="w-28 bg-blue-950 p-1.5 rounded-lg text-sm font-Nunito">Total IVA 13%</button>
                <button class="w-28 bg-blue-950 p-1.5 rounded-lg text-sm font-Nunito">(IT 3%)</button>
            </div>
        </div>
    </div>

    </transition>

    
</sidebar>

</template>