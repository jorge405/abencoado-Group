
<script>
import sidebar from '@/assets/layout/sidebar.vue';
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { AgGridVue } from 'ag-grid-vue3';
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"
import axios from 'axios'; 
import api from '@/services/api.js';
import Swal from 'sweetalert2';



export default{
    data(){
        return{
            gridOptions: {
                 enterNavigatesVertically: true,
                enterNavigatesVerticallyAfterEdit: true
            },
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
            dateFormat: 'Y-m-d',
            locale:'es',
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
            resizable: true,
            onCellKeyDown: this.onCellKeyDown
            },
            gridOptions: {
                stopEditingWhenCellsLoseFocus: true
            },
            rowData: [
            {
                cuenta: "",
                nombre_cuenta: "",
                referencia: "",
                debe: 0,
                haber: 0
            },
            {
                cuenta: "",
                nombre_cuenta: "",
                referencia: "",
                debe: 0,
                haber: 0
            },
            {
                cuenta: "",
                nombre_cuenta: "",
                referencia: "",
                debe: 0,
                haber: 0
            },
            {
                cuenta: "",
                nombre_cuenta: "",
                referencia: "",
                debe: 0,
                haber: 0
            },
            {
                cuenta: "",
                nombre_cuenta: "",
                referencia: "",
                debe: 0,
                haber: 0
            }
            
            ],
            mostrarConsultaLibro:false,
            empresas:[],
            selectedEmpresa:'',
            nro_comprobante:'',
            fecha_comprobante:'',
            dolar:'',
            ufv:'',
            glosa:'',
            total_debe:0.00,
            total_haber:0.00,
            diferencia:0.00
        }
    },
    mounted(){
        this.getEmpresas();
    },
    methods:{
        numberParser(params) {
            return Number(params.newValue) || 0
        },
        // Validar que una fila esté completa
        esFilaCompleta(fila) {
            return fila.cuenta.trim() !== "" && 
                   fila.nombre_cuenta.trim() !== "" &&
                   fila.referencia.trim() !== "" &&
                   (fila.debe > 0 || fila.haber > 0);
        },
        obtenerFilasCompletas(){
            return this.rowData.filter(fila=> this.esFilaCompleta(fila));
        },
        recalcularTotales(){
            const filasCompletas=this.obtenerFilasCompletas();
            // sumar debe y haber 
            this.total_debe=filasCompletas.reduce((sum,fila)=> sum + (Number(fila.debe) || 0),0);
            this.total_haber=filasCompletas.reduce((sum,fila)=> sum +(Number(fila.haber) || 0),0);
            // calcular diferencia 
            this.diferencia = Math.abs(this.total_debe - this.total_haber);
            console.log(`Debe: ${this.total_debe.toFixed(2)} | haber:${this.total_haber.toFixed(2)} | Diferencia: ${this.diferencia.toFixed(2)}`);
        },
        onCellValueChanged(event) {
            console.log("Fila actualizada:", event.data)

            // formatear debe y haber a 2 decimales 
            if (event.colDef.field==='debe') {
                event.data.debe=Number(event.data.debe || 0).toFixed(2)
                // fuerza  actualizacion en la grilla
                event.api.refreshCells({rowNodes:[event.node]});
            }

            if (event.colDef.field==='haber') {
                event.data.haber=Number(event.data.haber ||0 ).toFixed(2);
                event.api.refreshCells({rowNodes:[event.node]})
            }
            

            // Agregar nueva fila vacía si estamos en la última
            if (event.rowIndex === this.rowData.length - 1) {
                this.rowData.push({
                    cuenta:"",
                    nombre_cuenta:"", 
                    referencia:"", 
                    debe: "0.00",
                    haber: "0.00"
                })
            } 
            // recalcular totales y diferencias 
            this.recalcularTotales();
            console.log("Filas completas: ",this.obtenerFilasCompletas())
        },
        onCellBlur(params){
                if (params.colDef.field === 'debe' || params.colDef.field === 'haber') {
                    params.data[params.colDef.field] = Number(params.data[params.colDef.field] || 0).toFixed(2);
                    params.api.refreshCells({ rowNodes: [params.node] });
                    this.recalcularTotales();
                 }
        },
        onCellKeyDown(params){
            // Verificar si se presionó Enter en la celda "haber"
    if (params.event.key === 'Enter' && params.colDef.field === 'haber') {
        params.event.preventDefault();
        params.event.stopPropagation();
        
        const filaActual = params.data;
        const rowIndex = params.rowIndex;

        if (filaActual.cuenta.trim()==="" || filaActual.nombre_cuenta.trim()==="" ) {
            Swal.fire({
                icon:'warning',
                title:'Abencoado group',
                text:'Por favor completar los campos faltantes'
            })
            return
        }
        // ⭐ ESTO ES LO QUE FALTABA
        //params.api.stopEditing();


        let siguienteFila = rowIndex + 1;

        // Si es la última fila → crear nueva fila
        if (rowIndex === this.rowData.length - 1) {
            this.rowData.push({
                cuenta: "",
                nombre_cuenta: "", 
                referencia: "",
                debe: 0.00,
                haber: 0.00
            });
        }

        // MOVER FOCO SIEMPRE A LA SIGUIENTE FILA → CUENTA
        setTimeout(() => {
            if (this.$refs.agGrid) {
                this.$refs.agGrid.api.setFocusedCell(siguienteFila, 'cuenta');
                this.$refs.agGrid.api.startEditingCell({
                    rowIndex: siguienteFila,
                    colKey: 'cuenta'
                });
            }
        }, 50);

        console.log("Fila guardada:", filaActual);
        }
    },
    async getEmpresas(){
            try {
                const responseEmpresas= await axios.get('http://localhost:3000/abencoado/getEmpresas');
                if (responseEmpresas.data.estado==='vacio') {
                    return this.empresas=[]
                }
                this.empresas=responseEmpresas.data.rows;
                console.log(this.empresas);
            } catch (error) {
                console.log('ocurrio un error en el servidor',error);
            }
    },
    async getCotizacionOne(fecha){
        try {
            const responsefecha= await axios.post('http://localhost:3000/abencoado/getCotizacionOne',{fecha_comprobante:fecha})
            this.dolar=responsefecha.data.estado==='vacio' ? '': responsefecha.data.rows[0].dolar;
            this.ufv=responsefecha.data.estado==='vacio' ? '': responsefecha.data.rows[0].ufv;
        } catch (error) {
            console.log(error)
        }
    },
    async getComprobante(fecha){
        try {
            const responseComprobante= await api.post('/getComprobante',{
                fecha_comprobante:fecha
            })
            console.log(responseComprobante.data);
            if (responseComprobante.data.estado==='vacio') {
                const puct= '0001'
                return puct
            }else if(responseComprobante.data.estado==='ok'){
                const comprobanteOne= responseComprobante.data.total_comprobante ===9  ? `00${responseComprobante.data.total_comprobante+1}` : `000${responseComprobante.data.total_comprobante+1}`;
                return comprobanteOne

            }
        } catch (error) {
            console.log(error);
            return 0;
        }
    },
    envioLibro(){
        const filasCompletas=this.obtenerFilasCompletas();
        const datos={
            nro_comprobante:this.nro_comprobante,
            tipo_comprobante:this.tipo_comprobante,
            fecha_comprobante:this.fecha_comprobante,
            dolar:this.dolar,
            ufv:this.ufv,
            razon_social:this.selectedEmpresa,
            glosa:this.glosa,
            metodo_pago:this.metodo_pago,
            total_debe:this.total_debe,
            total_haber:this.total_haber,
            asiento:filasCompletas.map(fila=>({
                cuenta:fila.cuenta,
                nombre_cuenta:fila.nombre_cuenta,
                referencia:fila.referencia,
                debe:Number(fila.debe).toFixed(2),
                haber:Number(fila.haber).toFixed(2)
            }))

        }

        console.log(datos)
    }
    },
    watch:{
        async tipo_comprobante(newval){
            console.log(this.tipo_comprobante)
            if (this.fecha_comprobante==='') {
                return; 
            }else{
                
                const fecha= new Date(this.fecha_comprobante);
                const mesFormato= (fecha.getMonth()+1).toString().padStart(2,'0');
                const nroComprobante= await this.getComprobante(this.fecha_comprobante);
                this.nro_comprobante=`${this.tipo_comprobante}${mesFormato}${nroComprobante}`
            }

        },
        
        async fecha_comprobante(newval){
            
             if(!newval) return
        this.getCotizacionOne(newval);
        // Parsear manualmente para evitar problemas de zona horaria 
        const [ano, mes, dia] = newval.split('-');
        const fecha = new Date(ano, mes - 1, dia);
        
        const diaFormato = fecha.getDate().toString().padStart(2,'0');
        const mesFormato = (fecha.getMonth() + 1).toString().padStart(2,'0');
        const anoFormato = fecha.getFullYear();
        const nroComprobante= await this.getComprobante(newval)
        
        this.nro_comprobante= `${this.tipo_comprobante}${mesFormato}${nroComprobante}`
        
        
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
        <form @submit.prevent="envioLibro">
        <div class=" bg-gray-100 w-7xl h-10/12 rounded-lg p-8 ">
        <p class=" font-Nunito text-lg text-slate-900 font-semibold">Registro de Comprobante Diario</p>
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
                    <option  v-for="item in empresas" :key="item.cod_empresa" :value="item.razon_social">{{ item.razon_social || item.nombre_propietario }}</option>
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
        <button type="submit" :disabled="diferencia>0" :class="diferencia>0 ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-50' :'bg-green-500 text-white hover:bg-green-600'" class=" w-xs bg-blue-950 rounded-lg p-2 font-Nunito text-white text-sm cursor-pointer">{{diferencia>0 ? 'Diferencia pendiente' : 'Registrar Comprobante'}}</button>
        <button type="button" @click="mostrarConsultaLibro=true" class=" w-xs bg-blue-950 rounded-lg p-2 font-Nunito cursor-pointer text-white text-sm">Consultar</button>
    </div>
    </form>
    </div>
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
                <div class=" flex flex-row space-x-4">
                    <div class=" flex flex-row items-center">
                    <label for="" class=" font-Nunito text-sm font-semibold text-slate-900 ">De:</label>
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
                    <label for="" class=" font-Nunito text-sm text-slate-900 font-semibold ">Hasta:</label>
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
                    <label class=" font-Nunito text-sm text-slate-900 font-semibold ">Tipo de comprobante</label>
                    <select v-model="tipo_comprobante" class=" bg-white text-sm text-slate-950 p-2 border border-gray-200 rounded-xl placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10  ">
                        <option value="" selected disabled>Selecciona tipo comprobante</option>
                        <option v-for="item in comprobante"  :key="item.value" :value="item.text" >{{ item.text }}</option>    
                    </select>
                </div>    
                <div class=" flex flex-row space-x-4 justify-center">
                    <button @click="mostrarConsultaLibro=false" class=" bg-blue-950 w-xs  text-sm rounded-lg p-2 cursor-pointer">Aceptar</button>
                    <button @click="mostrarConsultaLibro=false" class=" bg-red-800 w-xs text-sm rounded-lg p-2 cursor-pointer">Cancelar</button>
                </div>
            </div>
        </div>
    </div>            

    </transition>
</sidebar>

</template>