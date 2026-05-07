<script>
import sidebar from '@/assets/layout/sidebar.vue';
import api from '@/services/api.js';
import Swal from 'sweetalert2';
import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';
import pdfPatrimonio from '@/components/generarPDFPatrimonio.vue'
import excelPatrimonio from '@/components/generarExcelPatrimonio.vue';
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
            dataPatrimonio:[],
            fecha_inicio:'',
            fecha_final:'',
            totalesPatrimonio:{
                total_inicio:0,
                total_gestion:0,
                total_final:0,
            },
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
            nombre_empresa:'',
            fechadata1:'',
            fechadata2:''

        }
    },
    mounted(){
        const sF1 = sessionStorage.getItem('fecha_inicio');
        const sF2 = sessionStorage.getItem('fecha_final');
        if (sF1 && sF2 ) {
            this.fecha_inicio = sF1;
            this.fecha_final = sF2;
            
            this.evolucionPatrimonio();
        } 
    },
    methods:{
        async evolucionPatrimonio() {
            const nombreEmpresa= CryptoJS.AES.decrypt(Cookies.get('dataEmp'),this.key).toString(CryptoJS.enc.Utf8); 
            this.nombre_empresa=nombreEmpresa.toUpperCase();

            const decryptEmpresa = CryptoJS.AES.decrypt(Cookies.get('emp'), this.key).toString(CryptoJS.enc.Utf8);
            const f1 = this.fecha_inicio || sessionStorage.getItem('fecha_inicio');
            const f2 = this.fecha_final || sessionStorage.getItem('fecha_final');  
            try {
                const datos = {
                    cod_empresa: parseInt(decryptEmpresa),
                    fecha_inicio:f1,
                    fecha_final:f2
                  };

                const responsePatrimonio = await api.post('/evolucionPatrimonio', datos);

                if (responsePatrimonio.data.status === 'ok') {
                    // Guardamos los detalles (las cuentas de nivel 5 con sus montos)
                    Toast.fire({
                      icon:'success',
                      text:'reporte generado correctamente'

                    })
                    this.dataPatrimonio = responsePatrimonio.data.detalles;
                    // Guardamos los totales horizontales para la última columna y filas de control
                    this.totalesPatrimonio = responsePatrimonio.data.totales_horizontales;
                    this.mostrarConsultarFecha=false
                      sessionStorage.setItem('fecha_inicio',f1);
                      sessionStorage.setItem('fecha_final',f2);
                       // Aseguramos que las variables locales de Vue tengan el valor
                        this.fecha_inicio = f1;
                        this.fecha_final = f2;
                        // calculo de fechas mostradas 
                        const resultado = this.fecha_inicio.split('-').reverse().join('-').replace(/-(\d{2})-/, (match, m) => `-${new Date(0, m - 1).toLocaleString('es', { month: 'long' })}-`).split('-').reverse().join('-');
                        this.fechadata1= resultado.split('-')
                        const resultado2=this.fecha_final.split('-').reverse().join('-').replace(/-(\d{2})-/, (match, m) => `-${new Date(0, m - 1).toLocaleString('es', { month: 'long' })}-`).split('-').reverse().join('-');
                        this.fechadata2=resultado2.split('-')
                } else {
                    Toast.fire({
                      icon:'warning',
                      text:'no se encontraron datos para el reporte'

                    })
                    this.mostrarConsultarFecha=false;
                    this.dataPatrimonio = [];
                    this.totalesPatrimonio = {};
                    
                }

            } catch (error) {
                console.error("Error al obtener la evolución del patrimonio:", error);
                Toast.fire({
                  icon:'error',
                  text:'error en el servidor intentelo mas tarde'
                })
                this.dataPatrimonio = [];
            }
        },
        formatNumber(value) {
        const num = parseFloat(value);
            if (isNaN(num)) return "0.00";
            return new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(num);
        },
        cerrarModalfecha(){
          this.mostrarConsultarFecha=false;
        }
    },
    components:{
        sidebar,
        pdfPatrimonio,
        excelPatrimonio,
        flatPickr,

    }
}
</script>



<template>
<sidebar>
<template #title>Estados Financieros</template>
<div class=" flex flex-col ml-45" >
    
    <div class="flex flex-row space-x-5">
        <p class=" text-slate-900 text-sm font-Nunito">Del {{ fechadata1[2] }} de {{fechadata1[1]}} de {{ fechadata1[0] }} al {{fechadata2[2]}} de {{fechadata2[1]}} de {{fechadata2[0]}}</p>
    </div>
    
    <div class=" flex bg-gray-100 w-7xl h-fit 2xl:w-7xl 2xl:h-fit mb-5 rounded-lg p-8 ">
        
        <!-- tabla lista libro mayor-->
<div class="flex flex-col bg-gray-100 border border-gray-200 w-full mt-5 p-4 rounded-lg overflow-hidden">
  <div class="flex flex-row px-4 space-x-2 mb-6">
    <button class="p-1.5 text-sm text-white bg-blue-950 rounded-lg font-Nunito shadow-sm">
      Evolución Estado Patrimonio
    </button>
    <button class="p-1.5 text-sm text-white bg-blue-950 rounded-lg font-Nunito shadow-sm">
    Flujo de estado
    </button>
  </div>

  <div class="flex-1 overflow-x-auto px-4">
    <table class="w-full text-xs text-left text-gray-500 border-separate border-spacing-0 border border-gray-300">
      <thead class="bg-gray-200 text-slate-950">
        <tr>
          <th class="p-3 border border-gray-300 min-w-50 text-center font-bold font-Nunito">
            DETALLE
          </th>
          <th v-for="col in dataPatrimonio" :key="'h-'+col.puct" class="p-3 border border-gray-300 text-center font-bold uppercase font-Nunito">
            {{ col.nombre }}
          </th>
          <th class="p-3 border border-gray-300 text-center font-bold bg-gray-300">
            TOTAL PATRIMONIO
          </th>
        </tr>
      </thead>

      <tbody class="bg-white">
        <tr v-if="!dataPatrimonio.length">
                <td colspan="3" class="text-center py-5 text-gray-400">No se encontraron datos</td>
              </tr>
        <tr v-if="totalesPatrimonio.total_inicio && parseFloat(totalesPatrimonio.total_inicio) !== 0" class="bg-gray-50">
          <td class="p-3 border border-gray-300 font-bold text-blue-900 uppercase">
            Saldos al inicio del periodo ({{ fecha_inicio }})
          </td>
          <td v-for="col in dataPatrimonio" :key="'si-'+col.puct" class="p-3 border border-gray-300 text-right tabular-nums">
            {{ formatNumber(col.monto_inicio) }}
          </td>
          <td class="p-3 border border-gray-300 text-right font-bold bg-gray-100 text-blue-900">
            {{ formatNumber(totalesPatrimonio.total_inicio) }}
          </td>
        </tr>

        <tr v-for="fila in dataPatrimonio" :key="'f-'+fila.puct" class="hover:bg-blue-50/30">
          <td class="p-3 border border-gray-300 font-medium text-gray-800">
            {{ fila.nombre }}
          </td>
          <td v-for="col in dataPatrimonio" :key="'cell-'+fila.puct+'-'+col.puct" class="p-3 border border-gray-300 text-right tabular-nums">
            <span v-if="fila.puct === col.puct" class="font-semibold text-slate-900">
              {{ formatNumber(fila.monto) }}
            </span>
            <span v-else class="text-gray-300">0.00</span>
          </td>
          <td class="p-3 border border-gray-300 text-right font-semibold bg-gray-50">
            {{ formatNumber(fila.monto) }}
          </td>
        </tr>

        <tr class="bg-blue-900 text-white font-bold">
          <td class="p-3 border border-blue-800 uppercase">
            SALDOS AL FINAL DEL PERIODO 
          </td>
          <td v-for="col in dataPatrimonio" :key="'sf-'+col.puct" class="p-3 border border-blue-800 text-right tabular-nums">
            {{ formatNumber(parseFloat(col.monto_inicio || 0) + parseFloat(col.monto || 0)) }}
          </td>
          <td class="p-3 border border-blue-800 text-right text-yellow-400 text-sm">
            {{ formatNumber(totalesPatrimonio.total_final) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
             
    </div>
   <div class="flex flex-row px-3 space-x-6 mt-5">
    <button @click="mostrarConsultarFecha=true" class=" bg-blue-950 p-2 w-40 rounded-lg text-white text-xs uppercase font-semibold cursor-pointer">Consultar Fecha</button>
    <pdfPatrimonio :datos="dataPatrimonio" :totales="totalesPatrimonio" 
                    :empresa="nombre_empresa" titulo="Evolución del Patrimonio" 
                    :fecha_inicio="fechadata1" :fecha_final="fechadata2"></pdfPatrimonio>
    <excelPatrimonio :datos="dataPatrimonio" :totales="totalesPatrimonio" 
                      :empresa="nombre_empresa" titulo="Evolución del Patrimonio" 
                      :fecha_inicio="fechadata1" :fecha_final="fechadata2"></excelPatrimonio>
  </div> 
    
</div>

<transition enter-active-class="transition duration-300 ease-out"
                    enter-from-class="opacity-0 scale-95"
                    enter-to-class="opacity-100 scale-100"
                    leave-active-class="transition duration-200 ease-in"
                    leave-from-class="opacity-100 scale-100"
                    leave-to-class="opacity-0 scale-95">
        <div v-if="mostrarConsultarFecha" class="fixed inset-0 flex items-center justify-around z-50">
        <div class="bg-gray-50 bg-opacity-80 text-white  ml-56 w-xl p-6 rounded-lg shadow-2xl flex flex-col space-x-2">
            <p class=" text-slate-900 font-Nunito text-md font-bold mb-5 mx-auto">CONSULTAR EVOLUCION DEL PATRIMONIO</p>
            <div class="flex flex-col">
                <div class="flex flex-col">
                    <form  @submit.prevent="evolucionPatrimonio">
                    
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