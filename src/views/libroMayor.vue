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
            rowData:[{ cod_nombreCuenta:0,cuenta: "",nombre_cuenta: "",referencia: "",debe: 0,haber: 0},
            {cod_nombreCuenta:0,cuenta: "",nombre_cuenta: "",referencia: "",debe: 0,haber: 0},
            {cod_nombreCuenta:0,cuenta: "",nombre_cuenta: "",referencia: "",debe: 0,haber: 0},
            {cod_nombreCuenta:0,cuenta: "",nombre_cuenta: "",referencia: "",debe: 0,haber: 0},
            {cod_nombreCuenta:0,cuenta: "",nombre_cuenta: "",referencia: "",debe: 0,haber: 0}
            ],
            columnDefs:[
                {headerName:"Cuenta",field:"cuenta",editable:true},
                {headerName:"Nombre de cuenta",field:"nombre_cuenta",editable:true},
                {headerName:"Referencia",field:"referencia",editable:true},
                {headerName:"Debe",field:"debe",editable:true,type: "numericColumn",valueParser: this.numberParser},
                {headerName:"Haber",field:"haber",editable:true,type: "numericColumn",valueParser: this.numberParser}
        ],
        defaultColDef: {
            flex: 1,
            resizable: true,
            onCellKeyDown: this.onCellKeyDown
            },
        }
    },
    methods:{
        
    },
    components:{
        sidebar,
        AgGridVue

    }
}
</script>

<template>
<sidebar>
<template #title>Libro Mayor</template>    
<div class=" flex flex-col ml-50">
    <div class="flex flex-row space-x-5">
        <p class=" text-slate-900 text-sm font-Nunito">Del 1 de Enero de 2025 al 31 de Diciembre de 2025</p>
    </div>
    <div class=" bg-gray-100 w-7xl h-10/12 rounded-lg p-8 ">
        <div class=" flex flex-row items-center space-x-4">
            <p class=" text-slate-900 text-sm font-Nunito">Buscar por NRO. comprobante</p>
            <input  type="text" class=" bg-white p-1.5 rounded-xl border border-gray-200  placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="nro comprobante">
            <button class=" bg-gray-300 p-1.5 rounded-lg text-slate-900 flex flex-row items-center text-sm font-Nunito"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><g fill="none" stroke="#0e0e0e" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="62" d="M13.5 3l5.5 5.5v11.5c0 0.55 -0.45 1 -1 1h-12c-0.55 0 -1 -0.45 -1 -1v-16c0 -0.55 0.45 -1 1 -1Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="62;0"/></path><path stroke-dasharray="34" stroke-dashoffset="34" d="M14.83 15.83c-1.56 1.56 -4.1 1.56 -5.66 0c-1.56 -1.56 -1.56 -4.1 0 -5.66c1.56 -1.56 4.1 -1.56 5.66 0c1.56 1.56 1.56 4.1 0 5.66l4.67 4.67"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.4s" to="0"/></path></g></svg>Buscar</button>
            <div class=" flex flex-row space-x-5">
                <button class=" p-1.5 bg-gray-300 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="#0e0e0e" d="M4.5 2.25a.75.75 0 0 1 .75.75v18a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75m12.907 1.464c1.146-.917 2.843-.1 2.843 1.367v13.838c0 1.468-1.697 2.284-2.843 1.367l-8.65-6.92a1.75 1.75 0 0 1 0-2.732z" stroke-width="0.5" stroke="#0e0e0e"/></svg></button>
                <button class=" p-1.5 bg-gray-300 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="#0e0e0e" d="M20.095 21a.75.75 0 0 1-.75-.75V3.75a.75.75 0 0 1 1.5 0v16.5a.74.74 0 0 1-.75.75m-3.4-9.589a2.25 2.25 0 0 1-.85 1.82l-9.11 7.09c-.326.247-.713.4-1.12.44h-.23a2.14 2.14 0 0 1-1-.22a2.2 2.2 0 0 1-.9-.81a2.17 2.17 0 0 1-.33-1.16V5.421a2.2 2.2 0 0 1 .31-1.12a2.25 2.25 0 0 1 .85-.8a2.18 2.18 0 0 1 2.24.1l9.12 6.08c.29.191.53.448.7.75a2.3 2.3 0 0 1 .32.98" stroke-width="0.5" stroke="#0e0e0e"/></svg></button>
            </div>
        </div>
        
        <div class=" grid grid-cols-3 gap-x-4 mt-8">
            <div class="flex flex-col">
                <label class=" text-sm font-Nunito text-slate-900" >Comprobante nro</label>
                <input  type="text" class=" bg-white p-1.5 rounded-xl border border-gray-200  placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="nro comprobante">    
            </div>
            <div class="flex flex-col">
                <label class=" text-sm font-Nunito text-slate-900" >Razon social</label>
                <input  type="text" class=" bg-white p-1.5 rounded-xl border border-gray-200  placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="razon social">    
            </div>
            <div class="flex flex-col">
                <label class=" text-sm font-Nunito text-slate-900" >Glosa</label>
                <input  type="text" class=" bg-white p-1.5 rounded-xl border border-gray-200  placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="fecha">    
            </div>
            
        </div>
        <div class=" grid grid-cols-4 gap-x-4">
            <div class="flex flex-col">
                <label class=" text-sm font-Nunito text-slate-900" >Metodo pago</label>
                <input  type="text" class=" bg-white p-1.5 rounded-xl border border-gray-200  placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="ufv">    
            </div>
            <div class="flex flex-col">
                <label class=" text-sm font-Nunito text-slate-900" >fecha</label>
                <input  type="text" class=" bg-white p-1.5 rounded-xl border border-gray-200  placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="ufv">    
            </div>
            <div class="flex flex-col">
                <label class=" text-sm font-Nunito text-slate-900" >T.C $us</label>
                <input  type="text" class=" bg-white p-1.5 rounded-xl border border-gray-200  placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="ufv">    
            </div>
            <div class="flex flex-col">
                <label class=" text-sm font-Nunito text-slate-900" >T.C ufv</label>
                <input  type="text" class=" bg-white p-1.5 rounded-xl border border-gray-200  placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="ufv">    
            </div>
        </div>
        <div class="w-6xl h-80 mx-auto mb-2 mt-5 bg-gray-300 overflow-y-auto border-2 border-slate-900 ag-theme-alpine">
            <AgGridVue ref="agGrid"
                class="w-full h-full font-Nunito"
                :columnDefs="columnDefs"
                :rowData="rowData"
                :defaultColDef="defaultColDef"
                
            />
        </div>
        <div class=" flex flex-row items-center space-x-4 mb-8 mr-8 justify-end">
            <label for="" class=" font-Nunito text-md font-semibold ">Totales:</label>
            <input  type="text" disabled  class=" bg-white rounded-xl border border-gray-300 p-1.5 placeholder:text-sm placeholder:text-slate-900 focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 text-slate-900  " placeholder="">
            <input   type="text" disabled  class=" bg-white rounded-xl border border-gray-300 p-1.5 placeholder:text-sm placeholder:text-slate-900 focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 text-slate-900  " placeholder="">
            <label for="" class=" font-Nunito text-sm font-semibold ">Diferencia:</label>
            <p class=" text-blue-800 font-Nunito text-sm" >0</p>
        </div>
    </div>
    <div class=" flex flex-row space-x-4 mt-5">
        <button type="submit"  class=" flex flex-row space-x-5 justify-center  w-xs bg-blue-950 rounded-lg p-2 font-Nunito text-white text-sm cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><g fill="none" fill-rule="evenodd"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="#fff" d="M12 2v6.5a1.5 1.5 0 0 0 1.356 1.493L13.5 10H20v10a2 2 0 0 1-1.85 1.995L18 22H6a2 2 0 0 1-1.995-1.85L4 20V4a2 2 0 0 1 1.85-1.995L6 2zm0 9.5a1 1 0 0 0-.993.883L11 12.5V14H9.5a1 1 0 0 0-.117 1.993L9.5 16H11v1.5a1 1 0 0 0 1.993.117L13 17.5V16h1.5a1 1 0 0 0 .117-1.993L14.5 14H13v-1.5a1 1 0 0 0-1-1m2-9.457a2 2 0 0 1 .877.43l.123.113L19.414 7a2 2 0 0 1 .502.84l.04.16H14z" stroke-width="0.5" stroke="#fff"/></g></svg>nuevo</button>
        <button type="button"  class=" flex flex-row items-center  justify-center w-xs bg-blue-950 rounded-lg p-2 font-Nunito text-white text-sm cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20"><rect width="20" height="20" fill="none"/><path fill="#fff" d="M10.2 3.28c3.53 0 6.43 2.61 6.92 6h2.08l-3.5 4l-3.5-4h2.32a4.44 4.44 0 0 0-4.32-3.45c-1.45 0-2.73.71-3.54 1.78L4.95 5.66a6.97 6.97 0 0 1 5.25-2.38m-.4 13.44c-3.52 0-6.43-2.61-6.92-6H.8l3.5-4c1.17 1.33 2.33 2.67 3.5 4H5.48a4.44 4.44 0 0 0 4.32 3.45c1.45 0 2.73-.71 3.54-1.78l1.71 1.95a6.95 6.95 0 0 1-5.25 2.38" stroke-width="0.5" stroke="#0e0e0e"/></svg>modificar</button>
        <button type="button"  class=" flex flex-row items-center justify-center  w-xs bg-blue-950 rounded-lg p-2 font-Nunito cursor-pointer text-white text-sm"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="#fff" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8" stroke-width="0.5" stroke="#fff"/><path fill="#fff" d="M12.5 7H11v6l5.25 3.15l.75-1.23l-4.5-2.67z" stroke-width="0.5" stroke="#fff"/></svg>Consultar</button>
    </div>
</div>
</sidebar>

</template>