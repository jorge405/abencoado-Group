
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
import NestedList from '@/components/NestedList.vue';
import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';

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
            key:'abencoadoGroup',
            gridOptions: {
                 enterNavigatesVertically: true,
                enterNavigatesVerticallyAfterEdit: true
            },
            comprobante:[
                {value:1,text:'ingreso'},
                {value:2,text:'egreso'},
                {value:3,text:'traspaso'}
            ],
            headers:['Nro comprobante','razon social/propietario','fecha comprobante','glosa','metodo pago','tipo comprobante','acciones'],
            mostrartabla:true,
            mostrarRegistro:false,
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
                cod_nombreCuenta:0,
                cuenta: "",
                nombre_cuenta: "",
                referencia: "",
                debe: 0,
                haber: 0
            },
            {   
                cod_nombreCuenta:0,
                cuenta: "",
                nombre_cuenta: "",
                referencia: "",
                debe: 0,
                haber: 0
            },
            {   cod_nombreCuenta:0,
                cuenta: "",
                nombre_cuenta: "",
                referencia: "",
                debe: 0,
                haber: 0
            },
            {   cod_nombreCuenta:0,
                cuenta: "",
                nombre_cuenta: "",
                referencia: "",
                debe: 0,
                haber: 0
            },
            {   cod_nombreCuenta:0,
                cuenta: "",
                nombre_cuenta: "",
                referencia: "",
                debe: 0,
                haber: 0
            }
            
            ],
            mostrarConsultaLibro:false,
            mostrarCuenta:false,
            cuentaSeleccionada:null,
            cuentaRowIndex:null,
            empresas:[],
            selectedEmpresa:'',
            nro_comprobante:'',
            fecha_comprobante:'',
            dolar:'',
            ufv:'',
            glosa:'',
            total_debe:0.00,
            total_haber:0.00,
            diferencia:0.00,
            dataCuenta:[],
            itemSeleccionado:null,
            fecha1:'',
            fecha2:'',
            tipoComprobante_consulta:'',
            datoslibrofecha:[],
            indiceActual:0
        }
    },
    mounted(){
        this.getEmpresas();
        this.getnombreCuenta();
        this.getallLibro(); 
    },
    methods:{
        numberParser(params) {
            return Number(params.newValue) || 0
        },
        mostrarlibroTabla(){
            this.mostrarRegistro=true;
            this.mostrartabla=false;
        },
        mostrarViewRegistro(){
            this.mostrarRegistro=false;
            this.mostrartabla=true;
        },
        mostrarEditRegistro(item){
            console.log(item)
            this.mostrarRegistro=true;
            this.nro_comprobante=item.nro_comprobante;
        },
        cargarDatosItem(){
            if (this.datoslibrofecha.length===0) return;

            const item= this.datoslibrofecha[this.indiceActual];
            // llenar todos los campos 
            this.nro_comprobante=item.nroComprobante || '';
            this.tipo_comprobante=item.tipo_comprobante || '';
            this.fecha_comprobante=item.fecha_comprobante || '';
            this.glosa= item.glosa || '';
            this.selectedEmpresa= item.razon_social || '';
            this.metodo_pago= item.metodo_pago || '';
            this.dolar= item.dolar || '';
            this.ufv = item.ufv || '';
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

    if(params.event.key === 'Enter'){

        // ABRIR MODAL SI ESTA EN CUENTA
        if(params.colDef.field === 'cuenta'){

            params.event.preventDefault()

            this.cuentaSeleccionada = params.data
            this.cuentaRowIndex = params.rowIndex

            this.mostrarCuenta = true

            return
        }

        // TU LOGICA ACTUAL PARA HABER
        if(params.colDef.field === 'haber'){

            params.event.preventDefault()
            params.event.stopPropagation()

            const filaActual = params.data
            const rowIndex = params.rowIndex

            if (filaActual.cuenta.trim()==="" || filaActual.nombre_cuenta.trim()==="" ) {
                Swal.fire({
                    icon:'warning',
                    title:'Abencoado group',
                    text:'Por favor completar los campos faltantes'
                })
                return
            }

            let siguienteFila = rowIndex + 1

            if (rowIndex === this.rowData.length - 1) {
                this.rowData.push({
                    cuenta: "",
                    nombre_cuenta: "", 
                    referencia: "",
                    debe: 0.00,
                    haber: 0.00
                })
            }

            setTimeout(() => {
                this.$refs.agGrid.api.setFocusedCell(siguienteFila,'cuenta')

                this.$refs.agGrid.api.startEditingCell({
                    rowIndex:siguienteFila,
                    colKey:'cuenta'
                })

            },50)

        }

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
    async envioLibro(){
        const filasCompletas=this.obtenerFilasCompletas();
        
        const datos={
            nro_comprobante:this.nro_comprobante,
            tipo_comprobante:this.tipo_comprobante,
            fecha_comprobante:this.fecha_comprobante,
            cod_empresa:this.selectedEmpresa,
            glosa:this.glosa,
            metodo_pago:this.metodo_pago,
            total_debe:this.total_debe,
            total_haber:this.total_haber,
            estado:'activo',
            asiento:filasCompletas.map(fila=>({
                cod_nombreCuenta:fila.cod_nombreCuenta,
                referencia:fila.referencia,
                debe:Number(fila.debe).toFixed(2),
                haber:Number(fila.haber).toFixed(2)
            }))

        }
        try {
            const responselibro= await api.post('/addComprobante',datos)
        if (responselibro.data.status==='error') {
            console.log(responselibro.data)
            Swal.fire({
                icon:'error',
                title:'Abencoado Group',
                text:' hubo un error al momento de registrar el libro diario'
            })
        }else if(responselibro.data.status==='ok'){
            Swal.fire({
                icon:'success',
                title:'Abencoado Group',
                text:' datos registrados correctamente'
            }) 
            this.nro_comprobante='';
            this.tipo_comprobante='';
            this.fecha_comprobante='';
            this.dolar='';
            this.ufv='';
            this.selectedEmpresa='';
            this.glosa='';
            this.metodo_pago='';
            this.total_debe=0.00;
            this.total_haber=0.00;
            this.rowData=[
                {cod_nombreCuenta:0,cuenta:'',nombre_cuenta:'',referencia:'',debe:0.00,haber:0.00},
                {cod_nombreCuenta:0,cuenta:'',nombre_cuenta:'',referencia:'',debe:0.00,haber:0.00},
                {cod_nombreCuenta:0,cuenta:'',nombre_cuenta:'',referencia:'',debe:0.00,haber:0.00},
                {cod_nombreCuenta:0,cuenta:'',nombre_cuenta:'',referencia:'',debe:0.00,haber:0.00},
                {cod_nombreCuenta:0,cuenta:'',nombre_cuenta:'',referencia:'',debe:0.00,haber:0.00}
            ]
        }     
        } catch (error) {
            console.log(error)
            Swal.fire({
                icon:'error',
                title:'Abencoado Group',
                text:'Hubo un error en el servidor intentelo mas tarde'
            })   
        }
        
        
    },
    async getnombreCuenta(){
        
        try {
            const responsenombreCuenta= await api.get('/getnombreCuenta')
            if (responsenombreCuenta.data.estado==='vacio') {
                Swal.fire({
                    icon:'warning',
                    title:'Abencoado Group',
                    text:'No se encontraron datos'
                })
                return this.dataCuenta=[];
            } 
             
            //----///
            console.log(responsenombreCuenta.data.rows)
            
           const organizarPorNivel = (items) => {
                const mapa = {};
                    items.forEach(item => {
                        mapa[item.cod_nombreCuenta] = {
                        ...item,
                        children: [],
                        open: false
                        };
                    });

                const raiz = [];

                // Ordenar por nivel y por puct
                const ordenados = [...items].sort((a, b) => a.puct - b.puct);

                ordenados.forEach(item => {
                    if (item.cod_nivelCuenta === 1) {
                    raiz.push(mapa[item.cod_nombreCuenta]);
                    } else {
                    // buscar el padre correcto
                    const padre = ordenados
                        .filter(p =>
                        p.cod_nivelCuenta === item.cod_nivelCuenta - 1 &&
                        String(item.puct).startsWith(String(p.puct))
                        )
                        .sort((a, b) => b.puct - a.puct)[0]; // el más cercano

                    if (padre) {
                        mapa[padre.cod_nombreCuenta].children.push(
                        mapa[item.cod_nombreCuenta]
                        );
                    }
                    }
                });

                return raiz;
            };
        this.dataCuenta=organizarPorNivel(responsenombreCuenta.data.rows)  
            //---/////
            console.log(this.dataCuenta);
        } catch (error) {
            console.log('ha ocurrido un error con el servidor')
            
        }
    },
    capturarItem(item){
        this.itemSeleccionado=item; 
        console.log(this.itemSeleccionado)
        if(this.cuentaRowIndex !== null){

        // Actualizamos SOLO la fila donde se abrió el modal
        this.rowData[this.cuentaRowIndex].cod_nombreCuenta=item.cod_nombreCuenta;
        this.rowData[this.cuentaRowIndex].cuenta = item.puct;
        this.rowData[this.cuentaRowIndex].nombre_cuenta = item.nombre_cuenta;

        // Refrescar grilla
        this.$refs.agGrid.api.refreshCells({
            rowNodes: [ this.$refs.agGrid.api.getDisplayedRowAtIndex(this.cuentaRowIndex) ]
        })

        // Cerrar modal
        this.mostrarCuenta = false

        // Mover foco a Referencia automáticamente (opcional pero PRO 🔥)
        setTimeout(() => {
            this.$refs.agGrid.api.setFocusedCell(this.cuentaRowIndex, 'referencia')
            this.$refs.agGrid.api.startEditingCell({
                rowIndex: this.cuentaRowIndex,
                colKey: 'referencia'
            })
        }, 50)

    }
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
                this.datoslibrofecha=responselibrofecha.data.rows;
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
            const responseAll= await api.get(`/getallLibro/${parseInt(cod_empresa)}`);
            if (responseAll.data.status==='vacio') {
                return this.datoslibrofecha=[]
            }else if(responseAll.data.status==='ok'){
                this.datoslibrofecha=responseAll.data.rows;
            }
        } catch (error) {
            console.log(error)
        }
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
        
        
        },
        onCellClicked(){
            if(params.colDef.field === 'cuenta'){

        this.cuentaSeleccionada = params.data
        this.cuentaRowIndex = params.rowIndex

        this.mostrarCuenta = true
    }
        }
    },
    components:{
        sidebar,
        flatPickr,
        AgGridVue,
        NestedList
    }
}

</script>

<template>
<sidebar>
<template #title>Libro Diario</template>
    <!-- tabla libro diario-->
    <div v-if="mostrartabla" class=" flex flex-col ml-50 space-y-5">
        <div class="flex flex-col  bg-gray-100 w-7xl mt-5 h-5/6 p-4 rounded-lg">
            <p class=" font-Nunito text-lg text-slate-900">Lista Libro Diario</p>
            <div class=" flex flex-row mt-5 items-center space-x-4">
            <label class=" font-Nunito text-sm">Buscar</label>
            <input  type="text" class=" text-sm p-2 rounded-xl border border-gray-300 w-xs placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="buscar comprobante">
            </div>
            <div class=" flex-1 mt-7 overflow-y-auto">
            
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
                <tr v-if="!datoslibrofecha.length" class="bg-white">
                    <td colspan="6" class="px-4 py-2 text-center text-md font-Nunito text-slate-900">
                        Datos no encontrados
                    </td>
                </tr>
                <tr v-for="(prod, index) in datoslibrofecha" :key="index" class="bg-white  hover:bg-gray-50">
                    <td class="px-4 py-2  whitespace-nowrap cursor-pointer">
                    {{ prod.nro_comprobante }}
                    </td>
                    <td class="px-4 py-2 cursor-pointer">
                    {{ prod.razon_social }}
                    </td>
                    <td class="px-4 py-2 text-left cursor-pointer">
                    {{ prod.fecha_comprobante }}
                    </td>
                    <td class="px-4 py-2 text-left cursor-pointer">
                    {{ prod.glosa }}
                    </td>
                    <td class="px-4 py-2 text-left cursor-pointer">
                    {{ prod.metodo_pago }}
                    </td>
                    <td class="px-4 py-2 text-left cursor-pointer">
                    {{ prod.tipo_comprobante }}
                    </td>
                    <td class="px-2 py-2 text-left cursor-pointer" @click="mostrarEditRegistro(prod)">
                        <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="#928f8f" d="M15 3c1.296 0 2.496.41 3.477 1.11l-9.134 9.133a1 1 0 1 0 1.414 1.414l9.134-9.134A6 6 0 0 1 21 9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm6.657-.657a1 1 0 0 1 0 1.414L19.89 5.523a6 6 0 0 0-1.414-1.414l1.766-1.766a1 1 0 0 1 1.414 0Z" stroke-width="0.5" stroke="#928f8f"/></g></svg></span>
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
            <div class="flex flex-row mt-5 space-x-5">
            <button @click="mostrarlibroTabla" class=" bg-blue-950 text-white  text-sm font-Nunito border border-blue-600 p-2 rounded-xl w-[288px] cursor-pointer font-bold transition-colors">Nuevo</button>
            <button @click="mostrarConsultaLibro=true" class=" bg-blue-950 text-white  text-sm font-Nunito border border-blue-600 p-2 rounded-xl w-[288px] cursor-pointer font-bold transition-colors">Consultar por fechas</button>
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
    <div class="fixed inset-0 flex items-center justify-around ml-40 z-50" v-if="mostrarRegistro">
        <form @submit.prevent="envioLibro">
        <div class=" bg-gray-100 w-6xl h-2/3 rounded-lg p-8 ">
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
        <div class="w-5xl h-70 mx-auto mb-2 mt-5 bg-gray-300 overflow-y-auto border-2 border-slate-900 ag-theme-alpine">
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
        <div class=" flex flex-row items-center space-x-4 mr-8 justify-end">
            <label for="" class=" font-Nunito text-md font-semibold ">Totales:</label>
            <input  type="text" disabled :value="total_debe.toFixed(2)" class=" bg-white rounded-xl border border-gray-300 p-1.5 placeholder:text-sm placeholder:text-slate-900 focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 text-slate-900  " placeholder="">
            <input   type="text" disabled :value="total_haber.toFixed(2)" class=" bg-white rounded-xl border border-gray-300 p-1.5 placeholder:text-sm placeholder:text-slate-900 focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 text-slate-900  " placeholder="">
            
        </div>
        <div class="flex flex-row items-center space-x-4 justify-end mr-10">
            <label for="" class=" font-Nunito text-sm font-semibold ">Diferencia:</label>
            <p class=" text-blue-800 font-Nunito text-sm" :class="diferencia> 0 ? 'border-red-500' :'border-green-500'">{{ diferencia.toFixed(2) }}</p>
        </div>    
            <div class=" flex flex-row space-x-4 mt-5">
            <button type="submit" :disabled="diferencia>0" :class="diferencia>0 ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-50' :'bg-blue-800 text-white hover:bg-blue-800'" class=" w-xs bg-blue-950 rounded-lg p-2 font-Nunito text-white text-sm cursor-pointer">{{diferencia>0 ? 'Diferencia pendiente' : 'Registrar Comprobante'}}</button>
            <button type="button" @click="mostrarViewRegistro" class=" w-xs bg-blue-950 rounded-lg p-2 font-Nunito cursor-pointer text-white text-sm">Cancelar</button>
            </div>
        </div>
    
    </form>
    </div>
               
    </transition>
    <div class="">

    </div>
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
    <transition enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95" >
    <div v-if="mostrarCuenta" class="fixed inset-0 flex items-center justify-around z-50">
        <div class="bg-gray-50 bg-opacity-80   ml-56 w-3xl p-6 rounded-lg shadow-2xl flex flex-col space-x-2">
            <p class="text-slate-900 font-Nunito mb-5">PLAN DE CUENTAS</p>
             <NestedList :items="dataCuenta" @select="capturarItem">
                <span v-if="dataCuenta" class=" font-Nunito text-sm text-slate-900">No se cargaron las cuentas..</span>
            </NestedList>
        
            <div class=" flex flex-row space-x-5 mt-10">
                <button class=" bg-blue-950 text-white rounded-lg p-2 text-sm w-xs cursor-pointer">Seleccionar</button>
                <button @click="mostrarCuenta=false" class=" bg-blue-950 text-white rounded-lg p-2 text-sm w-xs cursor-pointer">Cancelar</button>
            </div>
        </div>
        
    </div>
    </transition>
</sidebar>

</template>