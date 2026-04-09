<script>
import sidebar from '@/assets/layout/sidebar.vue';
import api from '@/services/api.js';
import Swal from 'sweetalert2';
import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';
import generarExcel from '@/components/generarExcel.vue';
import exportarPDF from '@/components/exportarPDF.vue';
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
            headers:['Cuenta','Nombre de Cuenta','Saldo'],
            listaBalanceGeneral:[],
            totales:{activo:0,pasivo:0,patrimonio:0,total_p_p:0},
            MostrarBalanceGeneral:true,
            key:'abencoadoGroup',
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
            fecha1:'',
            fecha2:'',
            fechadata1:[],
            fechadata2:[]

        }
    },
    mounted(){
        
        const sF2 = sessionStorage.getItem('fecha2');
        if ( sF2 ) {
            
            this.fecha2 = sF2;
            
            this.BalanceGeneral();
        } 
    },
    methods:{
        async BalanceGeneral(){
            const decryptEmpresa=CryptoJS.AES.decrypt(Cookies.get('emp'),this.key).toString(CryptoJS.enc.Utf8); 

            
            const f2 = this.fecha2 || sessionStorage.getItem('fecha2');  

            try {
                const responseBalanceGeneral= await api.post('/obtenerBalanceGeneral',{
                    cod_empresa:parseInt(decryptEmpresa),
                    fecha_final:f2
                })
                
                if (responseBalanceGeneral.data.status==='vacio') {
                    this.listaBalanceGeneral=[];
                    Toast.fire({
                        icon:'warning',
                        text:'No se genero el reporte de estado de resultados'
                    })
                }else if(responseBalanceGeneral.data.status==='ok'){
                    Toast.fire({
                        icon:'success',
                        text:'Reporte generado exitosamente'
                    });
                    this.listaBalanceGeneral = responseBalanceGeneral.data.detalles;
                    this.totales = responseBalanceGeneral.data.totales;
                    this.mostrarConsultarFecha=false;

                    
                    sessionStorage.setItem('fecha2',f2);
                    // Aseguramos que las variables locales de Vue tengan el valor
                        this.fecha2 = f2;
                    // calculo de fechas mostradas 
                        
                        const resultado2=this.fecha2.split('-').reverse().join('-').replace(/-(\d{2})-/, (match, m) => `-${new Date(0, m - 1).toLocaleString('es', { month: 'long' })}-`).split('-').reverse().join('-');
                        this.fechadata2=resultado2.split('-')    
                }
            } catch (error) {
                Toast.fire({
                    icon:'error',
                    text:'Ha ocurrido un error en el servidor'
                })

            }
        },
        // Función para aplicar estilos dinámicos según el nivel
        estiloFila(nivel) {
            switch (nivel) {
                case 1: return 'bg-blue-100 font-black text-blue-900 border-b-2 border-blue-200'; // Nivel raíz
                case 2: return 'bg-gray-50 font-extrabold text-gray-800';
                case 3: return 'font-bold text-gray-700';
                case 4: return 'font-semibold text-gray-600';
                default: return 'text-gray-500 italic'; // Nivel 5
            }
        },
        // Función para dar sangría (Padding) según el nivel
        sangriaNombre(nivel) {
            const padding = (nivel - 1) * 1.5; // 1.5rem por cada nivel
            return { paddingLeft: `${padding}rem` };
        },
        mostrarSumaYsaldo(){
            this.$router.push('/sumaySaldos');
            this.MostrarBalanceGeneral=false;
    
        },
        mostrarEstadoResultados(){
            this.$router.push('/estadoResultados');
            this.MostrarBalanceGeneral=false;
        }
    },
    components:{
        sidebar,
        generarExcel,
        flatPickr,
        exportarPDF
    }
}
</script>

<template>
<sidebar>
    <template v-if="MostrarBalanceGeneral" #title>Balance General</template>
<div class="flex flex-col w-6xl bg-transparent rounded-xl p-2 ml-45" v-if="MostrarBalanceGeneral">
    
      <div class="flex flex-col bg-white border border-gray-300 mx-auto w-5xl min-h-11/12 mt-5 rounded-lg shadow-lg">
        <div class="flex flex-row space-x-5 ml-5 mt-4">
            <p class=" text-slate-900 text-sm font-Nunito"> Al {{fechadata2[2]}} de {{fechadata2[1]}} de {{fechadata2[0]}}</p>
        </div>
        <div class="flex flex-row px-4 mt-4">
                <button @click="mostrarSumaYsaldo" class=" p-1.5 text-sm text-white bg-blue-950 rounded-lg font-Nunito cursor-pointer">Sumas Y Saldos</button>
                <button @click="mostrarEstadoResultados" class=" p-1.5 text-sm text-white bg-blue-950 rounded-lg font-Nunito cursor-pointer">Estado de Resultados</button>
                <button   class=" p-1.5 text-sm text-white bg-blue-950 rounded-lg font-Nunito cursor-pointer">Balance General</button>
        </div>
        <div class="flex-1 mt-7 overflow-y-auto px-4 max-h-120" id="tablaBalanceGeneral">
          <table class="w-full text-sm text-left border-collapse">
            <thead class="text-xs font-bold text-white uppercase bg-blue-950 sticky top-0">
              <tr>
                <th class="px-4 py-3 w-32">CUENTA</th>
                <th class="px-4 py-3">NOMBRE DE CUENTA</th>
                <th class="px-4 py-3 text-right">SALDO Bs</th>
              </tr>
            </thead>

            <tbody>
              <tr v-if="!listaBalanceGeneral.length">
                <td colspan="3" class="text-center py-10 text-gray-400">No se encontraron datos</td>
              </tr>

              <tr v-for="(item, index) in listaBalanceGeneral" 
                  :key="index" 
                  :class="estiloFila(item.nivel)"
                  class="hover:bg-yellow-50 transition-colors">
                
                <td class="px-4 py-2 font-mono text-xs">{{ item.puct }}</td>
                
                <td class="px-4 py-2" :style="sangriaNombre(item.nivel)">
                  {{ item.nombre }}
                </td>

                <td class="px-4 py-2 text-right font-bold">
                  {{ item.monto }}
                </td>
              </tr>

              <tr v-if="false" class="bg-red-500 text-white font-black text-lg">
                <td class="px-4 py-3" colspan="2">UTILIDAD / PÉRDIDA NETA DEL EJERCICIO</td>
                <td class="px-4 py-3 text-right border-t-4 border-double border-white">
                  {{ totales.utilidad }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class=" grid grid-cols-2 mx-10">
            <div class="flex flex-row my-10 space-x-4 border border-gray-300 p-4 ">
                <div class="flex flex-col justify-center items-center space-y-2">
                    <label class="text-xs font-nunito text-slate-900 font-semibold">ACTIVO</label>
                    <input :value="totales.activo" type="text" disabled class=" w-20 bg-white text-sm p-2 rounded-xl border border-gray-200  placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="">
                </div>
                <div class="flex flex-col justify-center items-center space-y-2">
                    <label class="text-xs font-nunito text-slate-900 font-semibold">PASIVO</label>
                    <input :value="totales.pasivo" type="text" disabled class=" w-20 bg-white text-sm p-2 rounded-xl border border-gray-200  placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="">
                </div>
                <div class="flex flex-col justify-center items-center space-y-2">
                    <label class="text-xs font-nunito text-slate-900 font-semibold">CAPITAL</label>
                    <input :value="totales.patrimonio" type="text" disabled class=" w-20 bg-white text-sm p-2 rounded-xl border border-gray-200  placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="">
                </div>
            </div>
            <div class="flex flex-row ml-10 my-10 space-x-4 border border-gray-300 p-4 ">
                
                <div class="flex flex-row justify-center items-center space-x-2">
                    <div class="flex flex-col justify-center items-center space-y-2">
                        <label class="text-xs font-nunito text-slate-900 font-semibold">ACTIVO =</label>
                        <input :value="totales.activo" type="text" disabled class=" w-20 bg-white text-sm p-2 rounded-xl border border-gray-200  placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="">
                    </div>
                    <div class=" flex flex-col space-y-2">
                        <label class="text-xs font-nunito text-slate-900 font-semibold">PASIVO + CAPITAL</label>
                        <input :value="totales.total_p_p"  type="text" disabled class=" w-20 bg-white text-sm p-2 rounded-xl border border-gray-200  placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="">
                    </div>
                    
                </div>
                
            </div>
        </div>
        
        <div class="p-4 bg-gray-50 rounded-b-lg border-t flex justify-between">
            <button @click="mostrarConsultarFecha=true" class="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 font-bold text-xs uppercase cursor-pointer">
                Consultar Reporte
            </button>
            <button  class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 font-bold text-xs uppercase cursor-pointer">
                Actualizar Reporte
            </button>
            <generarExcel :datos="listaBalanceGeneral" :totales="totales" :fecha2="fechadata2" titulo="BALANCE GENERAL" empresa="ABENCOADO GROUP"/>
            <exportarPDF :datos="listaBalanceGeneral" :totales="totales" :periodo="fechadata2"  :titulo="'BALANCE GENERAL'"/>
        </div>
      </div>
    </div>
    <!-- modal para consultar por fechas-->
    <transition enter-active-class="transition duration-300 ease-out"
                    enter-from-class="opacity-0 scale-95"
                    enter-to-class="opacity-100 scale-100"
                    leave-active-class="transition duration-200 ease-in"
                    leave-from-class="opacity-100 scale-100"
                    leave-to-class="opacity-0 scale-95">
        <div v-if="mostrarConsultarFecha" class="fixed inset-0 flex items-center justify-around z-50">
        <div class="bg-gray-50 bg-opacity-80 text-white  ml-56 w-xl p-6 rounded-lg shadow-2xl flex flex-col space-x-2">
            <p class=" text-slate-900 font-Nunito text-md font-bold mb-5 mx-auto">CONSULTAR BALANCE GENERAL</p>
            <div class="flex flex-col">
                <div class="flex flex-col">
                    <form  @submit.prevent="BalanceGeneral">
                    
                    <div class=" flex flex-row space-x-4 mb-5">
                        <div class=" flex flex-row items-center space-x-2">
                        <label for="" class=" font-Nunito text-sm font-semibold text-slate-900 ">De:</label>
                            <input  type="text" class=" w-40 bg-white 2xl:w-md text-sm p-2 rounded-xl border border-gray-200  placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="fecha actual" disabled>
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