<script>
import sidebar from '@/assets/layout/sidebar.vue';
import Swal from 'sweetalert2';
import { AgGridVue } from 'ag-grid-vue3';
import * as  XLSX from 'xlsx';
export default{
    name:'cotizaciones',
    data(){
        return{
            file:null,
            headers:['Fecha','Dolar','UFV'],
            rows:[],
            error:null,
            rowData:[],
            columnDefs:[{headerName:'Fecha',field:'fecha',editable:true},
                        {headerName:'Dolar',field:'dolar',editable:true},
                        {headerName:'UFV',field:'ufv',editable:true}
            ],
            defaultColDef:{
                editable:true,
                sortable:true,
                filter:true,
                resizable:true
            },
            gridApi: null
        }
    },    
    methods:{
        async onFileUpload(e){
            const file = e.target.files[0]
            const reader = new FileReader()

            reader.onload = (evt) => {
                const data = new Uint8Array(evt.target.result)
                const workbook = XLSX.read(data, { type: 'array',cellDates:true })
                const sheet = workbook.Sheets[workbook.SheetNames[0]]

                const json = XLSX.utils.sheet_to_json(sheet, {
                header: ['fecha', 'dolar', 'ufv'],
                skipHeader: true
                })

                this.rowData = json
            }

            reader.readAsArrayBuffer(file)
        },
        onGridReady(params) {
            this.gridApi = params.api
        }
    },
    components:{
        sidebar,
        AgGridVue
    }
}
</script>

<template>
<sidebar>
    <template #title>Cotizaciones</template>
    <div class=" flex flex-col">
        <p class=" font-Nunito text-slate-900 font-semibold text-lg ml-50">Tipos de cambios Dolar $ / UFV</p>
        <!-- previsualizacion del excel-->
        <div class=" w-3xl h-96 ml-50 mt-10 bg-gray-300 overflow-y-auto border-2 border-slate-900 ag-theme-alpine">
            <AgGridVue
                class="w-full h-full"
                :rowData="rowData"
                :columnDefs="columnDefs"
                :defaultColDef="defaultColDef"
                rowSelection="single"
                @grid-ready="onGridReady"
                />
        </div>
        <div class=" flex flex-row space-x-10 ml-50 mt-5">
            <div class=" bg-green-500 p-2 rounded-lg flex flex-row items-center">
                <p class="  text-white font-Nunito text-md flex flex-row">importar excel: <span class=" text-white ml-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48"><defs><mask id="SVGjWkfddWq"><g fill="none" stroke="#fff" stroke-linecap="round" stroke-width="4"><path stroke-linejoin="round" d="M8 15V6a2 2 0 0 1 2-2h28a2 2 0 0 1 2 2v36a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-9"/><path d="M31 15h3m-6 8h6m-6 8h6"/><path fill="#555555" stroke-linejoin="round" d="M4 15h18v18H4z"/><path stroke-linejoin="round" d="m10 21l6 6m0-6l-6 6"/></g></mask></defs><path fill="#fff" d="M0 0h48v48H0z" mask="url(#SVGjWkfddWq)"/></svg></span> </p>
                <input type="file" accept=".xlsx,xls" @change="onFileUpload" class="text-white" >    
            </div>
            <p v-if="error" style="color:red" class="text-Nunito font-semibold text-sm">{{ error }}</p>            
            <button class=" cursor-pointer p-2 bg-blue-600 rounded-lg text-white font-Nunito flex flex-row ">Guardar <span class=" ml-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h11.175q.4 0 .763.15t.637.425l2.85 2.85q.275.275.425.638t.15.762V19q0 .825-.587 1.413T19 21zm7-3q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-5-8h7q.425 0 .713-.288T15 9V7q0-.425-.288-.712T14 6H7q-.425 0-.712.288T6 7v2q0 .425.288.713T7 10"/></svg></span></button>
            <button class=" cursor-pointer p-2 bg-red-500 rounded-lg text-white font-Nunito flex flex-row ">Eliminar <span class=" ml-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M20 6a1 1 0 0 1 .117 1.993L20 8h-.081L19 19a3 3 0 0 1-2.824 2.995L16 22H8c-1.598 0-2.904-1.249-2.992-2.75l-.005-.167L4.08 8H4a1 1 0 0 1-.117-1.993L4 6zm-6-4a2 2 0 0 1 2 2a1 1 0 0 1-1.993.117L14 4h-4l-.007.117A1 1 0 0 1 8 4a2 2 0 0 1 1.85-1.995L10 2z"/></svg></span></button>
        </div>
    </div>
</sidebar>

</template>