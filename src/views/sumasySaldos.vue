<script>
import sidebar from '@/assets/layout/sidebar.vue';
import api from '@/services/api.js';
import Swal from 'sweetalert2';
import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';
import sumasYsaldosPDF from '@/components/sumasYsaldosPDF.vue';
import sumasYsaldosEXCEL from '@/components/sumasYsaldosEXCEL.vue';
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'


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
        headers:['Clase','Grupo','Subgrupo','Cuenta principal','Cuenta analitica','Nombre de Cuenta','Debe','Haber','Saldo Debe', 'Saldo Haber'],
        dataSumaSaldos:[],
        key:'abencoadoGroup',
        mostrarSumaYSaldo:true,
        nombreEmpresa:'',
        fecha_inicio:'',
        fecha_final:'',
        mostrarConsultarFecha:false,
        flatpickrTimeConfig:{
            enableTime: true,
            noCalendar: true,
            dateFormat: 'Y-m-d',
            locale:'es',
            time_24hr: true,
            minuteIncrement: 1,
            wrap: false,
        },
        fechadata1:'',
        fechadata2:'' 
    }
},
mounted(){
    const sF1 = sessionStorage.getItem('fechaOne');
    const sF2 = sessionStorage.getItem('fechaTwo');
        if (sF1 && sF2 ) {
            this.fecha_inicio = sF1;
            this.fecha_final = sF2;
            
            this.sumasYsaldos();
        }
},
methods:{
    async sumasYsaldos(){
            const nombreEmpresa= CryptoJS.AES.decrypt(Cookies.get('dataEmp'),this.key).toString(CryptoJS.enc.Utf8); 
            this.nombreEmpresa=nombreEmpresa.toUpperCase();
            
         const decryptEmpresa=CryptoJS.AES.decrypt(Cookies.get('emp'),this.key).toString(CryptoJS.enc.Utf8); 

         const f1 = this.fecha_inicio || sessionStorage.getItem('fechaOne');
         const f2 = this.fecha_final || sessionStorage.getItem('fechaTwo');  
        try {
            const datos = {
                    cod_empresa: parseInt(decryptEmpresa),
                    fecha_inicio:f1,
                    fecha_final:f2
                  };

            const responseSumasySaldos= await api.post('/getSumasySaldos',datos)
            console.log(responseSumasySaldos.data.rows)
            if (responseSumasySaldos.data.status==='vacio') {
                Toast.fire({
                    icon:'info', 
                    text:'No se genero el reporte de sumas y saldos'
                })
                this.dataSumaSaldos=[]
            }else if(responseSumasySaldos.data.status==='ok'){
                Toast.fire({
                    icon:'success',
                    text:'Reporte generado exitosamente'
                })
                const arrayRestructurado= responseSumasySaldos.data.rows.map(item=>{
                    const cod=item.codigo_cuenta;
                    const valorSaldo= parseFloat(item.saldo || 0);
                    return{
                        ...item,
                        clase:cod.substring(0,1),
                        grupo:cod.substring(1,2),
                        subgrupo:cod.substring(2,3),
                        cuenta_principal:cod.substring(3,6),
                        cuenta_analitica:cod.substring(6,9),
                        saldo_debe:valorSaldo >= 0 ? valorSaldo.toFixed(2):"0.00",
                        saldo_haber:valorSaldo<= 0 ? valorSaldo.toFixed(2): "0.00"
                    }
                })
                this.dataSumaSaldos=arrayRestructurado;
                this.mostrarConsultarFecha=false;
                sessionStorage.setItem('fechaOne',f1);
                sessionStorage.setItem('fechaTwo',f2);
                       // Aseguramos que las variables locales de Vue tengan el valor
                        this.fecha_inicio = f1;
                        this.fecha_final = f2;
                const resultado = this.fecha_inicio.split('-').reverse().join('-').replace(/-(\d{2})-/, (match, m) => `-${new Date(0, m - 1).toLocaleString('es', { month: 'long' })}-`).split('-').reverse().join('-');
                        this.fechadata1= resultado.split('-')
                        const resultado2=this.fecha_final.split('-').reverse().join('-').replace(/-(\d{2})-/, (match, m) => `-${new Date(0, m - 1).toLocaleString('es', { month: 'long' })}-`).split('-').reverse().join('-');
                        this.fechadata2=resultado2.split('-')        
            }
        } catch (error) {
            console.log('ha ocurido un error en el servidor: ',error);
            Toast.fire({
                icon:'error',
                text:'error en el servidor'
            })
        }
    },
    MostrarEstadoResultado(){
        this.$router.push('/estadoResultados');
        this.mostrarSumaYSaldo=false;
    },
    MostrarBalanceGeneral(){
        this.$router.push('/balanceGeneral');
        this.mostrarSumaYSaldo=false;
    },
    cerrarModalfecha(){
        this.mostrarConsultarFecha=false;
    }
},
computed: {
    // Calculamos los totales generales basados en el array de la View
   totalesSumasSaldos() {
    // Inicializamos el acumulador con las 4 columnas necesarias
    const inicial = { 
        debe: 0, 
        haber: 0, 
        s_debe: 0, 
        s_haber: 0 
    };
    
    const resultado = this.dataSumaSaldos.reduce((acc, fila) => {
        // 1. Sumamos las columnas de SUMAS (Totales de la View)
        acc.debe += parseFloat(fila.total_debe || 0);
        acc.haber += parseFloat(fila.total_haber || 0);

        // 2. Sumamos las columnas de SALDOS (Las que reestructuramos con signo)
        acc.s_debe += parseFloat(fila.saldo_debe || 0);
        acc.s_haber += parseFloat(fila.saldo_haber || 0);

        return acc;
    }, inicial);

    // Retornamos todo formateado a 2 decimales
    return {
        debe: resultado.debe.toFixed(2),
        haber: resultado.haber.toFixed(2),
        saldo_debe: resultado.s_debe.toFixed(2),
        // Aquí se mostrará la suma total, manteniendo los signos si los hay
        saldo_haber: resultado.s_haber.toFixed(2) 
    };
}
},
components:{
    sidebar,
    sumasYsaldosPDF,
    sumasYsaldosEXCEL,
    flatPickr
}




}
</script>


<template>
<sidebar>
<template v-if="mostrarSumaYSaldo" #title>Balance de SUMAS Y SALDOS</template> 
<!-- table de sumas y saldos-->    
<div class=" flex flex-col ml-45" v-if="mostrarSumaYSaldo">
    
    <div class="flex flex-row space-x-5">
        <p class=" text-slate-900 text-sm font-Nunito">Del {{ fechadata1[2] }} de {{fechadata1[1]}} de {{ fechadata1[0] }} al {{fechadata2[2]}} de {{fechadata2[1]}} de {{fechadata2[0]}}</p>
    </div>
    
    <div class=" flex bg-gray-100 w-7xl h-fit 2xl:w-7xl 2xl:h-fit mb-5 rounded-lg p-8 ">
        
        <!-- tabla lista libro mayor-->
        <div class="flex flex-col bg-gray-100 border border-gray-200 w-6xl min-h-11/12 mt-5  p-4 rounded-lg">
            <div class="flex flex-row px-4">
                <button  class=" p-1.5 text-sm text-white bg-blue-950 rounded-lg font-Nunito cursor-pointer">Sumas Y Saldos</button>
                <button @click="MostrarEstadoResultado" class=" p-1.5 text-sm text-white bg-blue-950 rounded-lg font-Nunito cursor-pointer">Estado de Resultados</button>
                <button @click="MostrarBalanceGeneral" class=" p-1.5 text-sm text-white bg-blue-950 rounded-lg font-Nunito cursor-pointer">Balance General</button>
            </div>
            
            <div class="flex-1 mt-7  overflow-y-auto px-4 ">
            <table class="w-full text-sm text-left text-gray-500">
                <!-- Encabezado Dinámico -->
                <thead class="text-xs font-Nunito text-gray-700 uppercase bg-gray-50 sticky top-0">
                <tr>
                    <th v-for="header in headers" :key="header" class="px-4 py-3">
                    {{ header }}
                    </th>
                </tr>
                </thead>

                <!-- Cuerpo de la Tabla -->
                <tbody>
                <tr v-if="!dataSumaSaldos.length" class=" flex  justify-center text-gray-500 mt-8 mx-auto h-52">
                    <td class=" text-sm font-Nunito ">No se encontraron Datos</td>
                </tr>
                <tr v-for="(prod, index) in dataSumaSaldos" :key="index" class="bg-white  hover:bg-gray-200 ">
                    <td  class="px-4 py-2  whitespace-nowrap cursor-pointer">
                    {{ prod.clase }}
                    </td>
                    
                    <td  class="px-4 py-2  whitespace-nowrap cursor-pointer">
                    {{ prod.grupo }}
                    </td>
                    <td class="px-4 py-2  whitespace-nowrap cursor-pointer">
                    {{ prod.subgrupo }}
                    </td>
                    <td class="px-4 py-2 cursor-pointer">
                    {{ prod.cuenta_principal }}
                    </td>
                    <td class="px-4 py-2 text-left cursor-pointer">
                    {{ prod.cuenta_analitica }}
                    </td>
                    <td class="px-4 py-2 text-left cursor-pointer">
                    {{ prod.nombre_cuenta }}
                    </td>
                    <td class="px-4 py-2  whitespace-nowrap cursor-pointer">
                    {{ prod.total_debe}}
                    </td>
                    <td class="px-4 py-2  whitespace-nowrap cursor-pointer">
                    {{ prod.total_haber}}
                    </td>
                    <td class="px-4 py-2  whitespace-nowrap cursor-pointer text-blue-800 font-semibold">
                    {{ prod.saldo_debe}}
                    </td>
                    <td class="px-4 py-2  whitespace-nowrap cursor-pointer" :class="{'text-red-600 font-semibold': prod.saldo_haber.startsWith('-')}">
                    {{ prod.saldo_haber}}
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
            <div class="grid grid-cols-2 w-full mt-8">
                
                <div class="flex flex-row px-3 space-x-2 items-end">
                    <sumasYsaldosPDF :datos="dataSumaSaldos" :totales="totalesSumasSaldos" :empresa="nombreEmpresa" :periodo1="fechadata1" :periodo2="fechadata2" ></sumasYsaldosPDF>
                    <sumasYsaldosEXCEL :datos="dataSumaSaldos" :totales="totalesSumasSaldos" :empresa="nombreEmpresa" ></sumasYsaldosEXCEL>
                    <button @click="mostrarConsultarFecha=true" class="bg-blue-950 text-white font-Nunito text-sm p-2 w-40 rounded-md uppercase cursor-pointer">Consultar</button>                                    
                </div>
                <div class=" flex flex-row space-x-2 items-center justify-end mr-15">
                    <p class=" text-sm font-Nunito text-slate-900">Totales</p>
                    <input :value="totalesSumasSaldos.debe" type="text" disabled class=" w-20 bg-white text-sm p-2 rounded-xl border border-gray-200  placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="">
                    <input :value="totalesSumasSaldos.haber" type="text" disabled class=" w-20 bg-white text-sm p-2 rounded-xl border border-gray-200  placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="">
                    <input :value="totalesSumasSaldos.saldo_debe" type="text" disabled class=" w-20 bg-white text-sm p-2 rounded-xl border border-gray-200  placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="">
                    <input :value="totalesSumasSaldos.saldo_haber" type="text" disabled class=" w-20 bg-white text-sm p-2 rounded-xl border border-gray-200  placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" :class="{'text-red-600 font-semibold': totalesSumasSaldos.saldo_haber.startsWith('-')}" placeholder="">
                </div>
                
            </div>
        </div>
             
    </div>
    
</div>

<!-- modal para consultar por fechas -->
 <transition enter-active-class="transition duration-300 ease-out"
                    enter-from-class="opacity-0 scale-95"
                    enter-to-class="opacity-100 scale-100"
                    leave-active-class="transition duration-200 ease-in"
                    leave-from-class="opacity-100 scale-100"
                    leave-to-class="opacity-0 scale-95">
        <div v-if="mostrarConsultarFecha" class="fixed inset-0 flex items-center justify-around z-50">
        <div class="bg-gray-50 bg-opacity-80 text-white  ml-56 w-xl p-6 rounded-lg shadow-2xl flex flex-col space-x-2">
            <p class=" text-slate-900 font-Nunito text-md font-bold mb-5 mx-auto">CONSULTAR SUMAS Y SALDOS</p>
            <div class="flex flex-col">
                <div class="flex flex-col">
                    <form  @submit.prevent="sumasYsaldos">
                    
                    <div class=" flex flex-row space-x-4 mb-5">
                        <div class=" flex flex-row items-center">
                        <label for="" class=" font-Nunito text-sm font-semibold text-slate-900 ">De:</label>
                            <div class="flex flex-row relative ml-2">
                                <flat-pickr
                                v-model="fecha_inicio"
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
                                v-model="fecha_final"
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
                    
                    <div class=" flex flex-row space-x-4 justify-center">
                        <button type="submit"  class=" bg-blue-950 w-50  text-sm rounded-lg p-2 cursor-pointer">Aceptar</button>
                        <button type="button" @click="cerrarModalfecha" class=" bg-red-800 w-50 text-sm rounded-lg p-2 cursor-pointer">Cancelar</button>
                        
                    </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    </transition>
</sidebar>    
</template>