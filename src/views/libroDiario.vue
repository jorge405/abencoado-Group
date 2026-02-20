<script>
import sidebar from '@/assets/layout/sidebar.vue';
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { AgGridVue } from 'ag-grid-vue3';
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"
export default{
    data(){
        return{
            comprobante:[
                {value:1,text:'Ingreso'},
                {value:2,text:'Egreso'},
                {value:3,text:'Traspaso'}
            ],
            tipo_comprobante:'',
            pago:[{value:1,text:'QR'},{value:2,text:'EFECTIVO'},{value:3,text:'TARJETA DEBITO'}],
            metodo_pago:'',
            flatpickrTimeConfig:{
            enableTime: true,
            noCalendar: true,
            dateFormat: 'H:i',
            time_24hr: true,
            minuteIncrement: 1,
            wrap: false,
            },
            columnDefs:[
                {headerName:"Cuenta",field:"cuenta",editable:true},
                {headerName:"Nombre de cuenta",field:"nombre_cuenta",editable:true},
                {headerName:"Referencia",field:"referencia",editable:true},
                {headerName:"Debe",field:"debe",editable:true,type: "numericColumn",valueParser: this.numberParser},
                {headerName:"Haber",field:"haber",editable:true,type: "numericColumn",valueParser: this.numberParser}
            ],
            defaultColDef: {
            flex: 1,
            resizable: true
            },
            rowData: [
            {
                cuenta: "",
                nombre_cuenta: "",
                referencia: "",
                debe: 0,
                haber: 0
            }
            ],
            mostrarConsultaLibro:false
        }
    },
    methods:{
        numberParser(params) {
            return Number(params.newValue) || 0
        },
        onCellValueChanged(event) {
            console.log("Fila actualizada:", event.data)
        }
    },
    watch:{
        rowData(newval){
            console.log(newval[0])
        }
    },
    components:{
        sidebar,
        flatPickr,
        AgGridVue
    }
}

</script>

<template>
<sidebar>
<template #title>Libro Diario</template>
    <div class="flex flex-col ml-50 space-y-5">
        <div class=" bg-gray-100 w-7xl h-10/12 rounded-lg p-8 ">
        <p class=" font-Nunito text-lg text-slate-900 font-semibold">Registro de Comprobante Diario</p>
        <div class=" grid grid-cols-2 space-x-2 ">
            <div class=" grid grid-cols-2 mt-5 gap-x-4">
            <div class=" flex flex-col">
                <label class=" block font-Nunito text-sm text-slate-700">Comprobante Nro</label>
                <input v-model="nit" type="text" class=" bg-white p-2 rounded-xl border border-gray-200  placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="Nit ejemplo:68483849">
            </div>
            <div class=" flex flex-col">
                <label class=" block font-Nunito text-sm text-slate-700">Tipo de comprobante</label>
                <select v-model="tipo_comprobante" class=" bg-white p-2 border border-gray-200 rounded-xl placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10  ">
                    <option value="" selected disabled>Selecciona tipo comprobante</option>
                    <option v-for="item in comprobante"  :key="item.value" :value="item.text" >{{ item.text }}</option>    
                </select>
            </div>
        </div>
        <div class=" grid grid-cols-3 space-x-2 items-center mt-5">
            <div class=" flex flex-col">
                <label class="text-sm font-Nunito text-slate-800 ">Fecha</label>
                <div class="flex flex-row relative">
                            <flat-pickr
                            v-model="fecha_inscripcion"
                            :config="flatpickrConfig"
                            class=" w-sm  appearance-none rounded-xl border border-gray-300  bg-white p-2.5   text-sm text-slate-800 shadow-theme-xs placeholder:text-gray-700 focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10"
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
                <input v-model="nit" type="text" class=" bg-white p-2 rounded-xl border border-gray-200  placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="Nit ejemplo:68483849">            
            </div>
            <div class=" flex flex-col">
                <label class=" block font-Nunito text-sm text-slate-700">T.C Ufv</label>
                <input v-model="nit" type="text" class=" bg-white p-2 rounded-xl border border-gray-200  placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="Nit ejemplo:68483849">            
            </div>
        </div>
        </div>
        <div class="grid grid-cols-3 space-x-4">
            <div class=" flex flex-col">
                <label class=" block font-Nunito text-sm text-slate-700">Razon social/propietario</label>
                <input v-model="nit" type="text" class=" bg-white p-2 rounded-xl border border-gray-200  placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="Nit ejemplo:68483849">            
            </div>
            <div class=" flex flex-col">
                <label class=" block font-Nunito text-sm text-slate-700">Glosa</label>
                <input v-model="nit" type="text" class=" bg-white p-2 rounded-xl border border-gray-200  placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="Nit ejemplo:68483849">            
            </div>
            <div class=" flex flex-col">
                <label class=" block font-Nunito text-sm text-slate-700">Metodo de Pago</label>
                <select v-model="metodo_pago" class=" bg-white p-2 border border-gray-200 rounded-xl placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10  ">
                    <option value="" selected disabled>Selecciona el metodo de pago</option>
                    <option v-for="item in pago"  :key="item.value" :value="item.text" >{{ item.text }}</option>    
                </select>
            </div>
        </div>
        <!-- tabla debe haber-->
        <div class="w-6xl h-96 mx-auto mb-2 mt-10 bg-gray-300 overflow-y-auto border-2 border-slate-900 ag-theme-alpine">
            <AgGridVue class="w-full h-full font-Nunito"
                :columnDefs="columnDefs"
                :rowData="rowData"
                :defaultColDef="defaultColDef"
                :stopEditingWhenCellsLoseFocus="true"
                @cell-value-changed="onCellValueChanged"
            />
        </div>
        <div class=" flex flex-row items-center space-x-4 mb-3 mr-8 justify-end">
            <label for="" class=" font-Nunito text-lg font-semibold ">Totales:</label>
            <input   type="text" class=" bg-white rounded-xl border border-gray-300 p-2 placeholder:text-sm placeholder:text-slate-900 focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 text-slate-900  " placeholder="">
            <input   type="text" class=" bg-white rounded-xl border border-gray-300 p-2 placeholder:text-sm placeholder:text-slate-900 focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 text-slate-900  " placeholder="">
            <label for="" class=" font-Nunito text-md font-semibold ">Diferencia:</label>
            <p class=" text-blue-800 font-Nunito text-md">586</p>
        </div>
        </div>
    <div class=" flex flex-row space-x-4">
        <button class=" w-xs bg-blue-950 rounded-lg p-2 font-Nunito text-white text-md cursor-pointer">Nuevo</button>
        <button @click="mostrarConsultaLibro=true" class=" w-xs bg-blue-950 rounded-lg p-2 font-Nunito cursor-pointer text-white text-md">Consultar</button>
    </div>
    </div>
    <transition enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95">
    <div v-if="mostrarConsultaLibro" class="fixed inset-0 flex items-center justify-around z-50">
        <div class="bg-gray-50 bg-opacity-80 text-white  ml-56 w-xl p-6 rounded-lg shadow-2xl flex flex-col space-x-2">
            <p class=" text-slate-900 font-Nunito text-md font-bold mb-5 mx-auto">CONSULTA LIBRO</p>
            <div class="flex flex-col">
                <div class=" flex flex-row space-x-4">
                    <div class=" flex flex-row items-center">
                    <label for="" class=" font-Nunito text-md font-semibold text-slate-900 ">De:</label>
                        <div class="flex flex-row relative ml-2">
                            <flat-pickr
                            v-model="fecha_inscripcion"
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
                    <label for="" class=" font-Nunito text-md text-slate-900 font-semibold ">Hasta:</label>
                        <div class="flex flex-row relative ml-2">
                            <flat-pickr
                            v-model="fecha_inscripcion"
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
                    <label class=" font-Nunito text-md text-slate-900 font-semibold ">Tipo de comprobante</label>
                    <select v-model="tipo_comprobante" class=" bg-white text-slate-950 p-2 border border-gray-200 rounded-xl placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10  ">
                        <option value="" selected disabled>Selecciona tipo comprobante</option>
                        <option v-for="item in comprobante"  :key="item.value" :value="item.text" >{{ item.text }}</option>    
                    </select>
                </div>    
                <div class=" flex flex-row space-x-4 justify-center">
                    <button @click="mostrarConsultaLibro=false" class=" bg-blue-950 w-xs rounded-lg p-2 cursor-pointer">Aceptar</button>
                    <button @click="mostrarConsultaLibro=false" class=" bg-red-800 w-xs rounded-lg p-2 cursor-pointer">Cancelar</button>
                </div>
            </div>
        </div>
    </div>            

    </transition>
</sidebar>

</template>