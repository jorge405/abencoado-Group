<script>
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
import generarPDF from '@/components/generarPDF.vue';

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
    props:{ 
        titulo:String,
        mostrarRegistroEditar:Boolean,
        comprobanteSeleccionado:Object
        
    },
    data(){
        return{
            key:'abencoadoGroup',
            mostrarCuenta:false,
            mostrarModal:false,
            datosModificar:{
                cod_comprobante:'',
                nro_comprobante:'',
                tipo_comprobante:'',
                fecha_comprobante:'',
                dolar:'',
                ufv:'',
                selectedEmpresa:'',
                glosa:'',
                metodo_pago:'',
                total_debe:0.00,
                total_haber:0.00
            },
            cuentaSeleccionada:null,
            cuentaRowIndex:null,
            total_debe:0.00,
            total_haber:0.00,
            diferencia:0.00,
            seleccionarCuenta:null,
            dataCuenta:[],    
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
            datosEdit:{
                nombre_cuenta:'',
                selectedCuenta:'',
                puct:'',
                selectedNivel:''
            },
            gridOptions: {
                stopEditingWhenCellsLoseFocus: true
            },
            comprobante:[
                {value:1,text:'ingreso'},
                {value:2,text:'egreso'},
                {value:3,text:'traspaso'}
            ],
            pago:[{value:1,text:'CHEQUE'},{value:2,text:'TRANSFERENCIA ENTRE ENTIDADES FINANCIERAS(ACH)'},{value:4,text:'QR'},{value:5,text:'BILLETERA MOVIL'},{value:6,text:'TARJETA DEBITO/CREDITO'},{value:7,text:'DEPOSITO EN CUENTA'},{value:8,text:'CARTAS DE CREDITO'},{value:9,text:'SIGEP'},{value:6,text:'CARTAS DE CREDITO'},{value:7,text:'EFECTIVO'}],
            skipFechaWatcher:false,
            skipTipoWatcher:false,
            nombreEmpresa:''
        }
    },
     mounted(){  
        this.getnombreCuenta();
    },
    methods:{
        numberParser(params) {
            return Number(params.newValue) || 0
        },
        async envioEditarLibro(){
            const decryptEmpresa= CryptoJS.AES.decrypt(Cookies.get('emp'),this.key);
            const empresa= decryptEmpresa.toString(CryptoJS.enc.Utf8);
            const filasCompletas=this.obtenerFilasCompletas();
            const [anio,mes,dia]= this.datosModificar.fecha_comprobante.split('-')
                const datos={
                    cod_comprobante:this.datosModificar.cod_comprobante,
                    nro_comprobante:this.datosModificar.nro_comprobante,
                    tipo_comprobante:this.datosModificar.tipo_comprobante,
                    fecha_comprobante:this.datosModificar.fecha_comprobante,
                    razon_social:this.datosModificar.selectedEmpresa,
                    glosa:this.datosModificar.glosa,
                    metodo_pago:this.datosModificar.metodo_pago.toLocaleLowerCase(),
                    total_debe:this.total_debe,
                    total_haber:this.total_haber,
                    estado:'activo',
                    dolar:Number(this.datosModificar.dolar).toFixed(2),
                    ufv:Number(this.datosModificar.ufv).toFixed(2),
                    anio:anio,
                    cod_empresa:parseInt(empresa),
                    asiento:filasCompletas.map(fila=>({
                        cod_asiento:fila.cod_asiento || null,
                        cod_nombreCuenta:fila.cod_nombreCuenta,
                        referencia:fila.referencia,
                        debe:Number(fila.debe).toFixed(2),
                        haber:Number(fila.haber).toFixed(2)
                    }))

                }
        console.log(datos)
        /*try {
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
            //this.skipTipoWatcher = true;
            this.tipo_comprobante='';
            //this.skipFechaWatcher = true;
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
            this.$emit('registro-exitoso')
        }     
        } catch (error) {
            console.log(error)
            Swal.fire({
                icon:'error',
                title:'Abencoado Group',
                text:'Hubo un error en el servidor intentelo mas tarde'
            })   
        } */
        
      
        },
        // metodos del ag-grid
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
        recalcularTotales(){
            const filasCompletas=this.obtenerFilasCompletas();
            // sumar debe y haber 
            this.datosModificar.total_debe=filasCompletas.reduce((sum,fila)=> sum + (Number(fila.debe) || 0),0);
            this.datosModificar.total_haber=filasCompletas.reduce((sum,fila)=> sum +(Number(fila.haber) || 0),0);
            // calcular diferencia 
            this.diferencia = Math.abs(this.datosModificar.total_debe - this.datosModificar.total_haber);
            //console.log(`Debe: ${this.total_debe.toFixed(2)} | haber:${this.total_haber.toFixed(2)} | Diferencia: ${this.diferencia.toFixed(2)}`);
        },
        obtenerFilasCompletas(){
            return this.rowData.filter(fila=> this.esFilaCompleta(fila));
        },
         esFilaCompleta(fila) {
            return fila.cuenta.trim() !== "" && 
                   fila.nombre_cuenta.trim() !== "" &&
                   fila.referencia.trim() !== "" &&
                   (fila.debe > 0 || fila.haber > 0);
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

                        this.mostrarCuenta = true;

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
        onCellContextMenu(params){
            if (params.colDef.field==='debe') {
                // bloqueamos el menu contextual por defecto del navegador
               if (params.event) {
                params.event.preventDefault();
                params.event.stopPropagation();
                }
                // guardamos la informacion de la fila seleccionada 
                //this.cuentaSeleccionada = params.data;
                //this.cuentaRowIndex = params.rowIndex;
                // 4. Tu lógica para abrir el modal
                // Supongamos que tienes un modal específico para ajustes del "debe"
                this.mostrarValorNeto = true;
            }
        },
        cerrarViewEdit(){
            // hide form and show table again
            this.$emit('cerrar')
            
            //this.mostrartabla=true;

            // reset all input fields to their initial values
            this.datosModificar.nro_comprobante='';
            this.skipTipoWatcher = true;
            this.datosModificar.tipo_comprobante='';
            this.skipFechaWatcher = true;
            this.datosModificar.fecha_comprobante='';
            this.datosModificar.selectedEmpresa='';
            this.datosModificar.metodo_pago='';
            this.datosModificar.dolar='';
            this.datosModificar.ufv='';
            this.datosModificar.glosa='';
            this.total_debe=0.00;
            this.total_haber=0.00;
            this.diferencia=0.00;

            // restore empty rows for the grid
            this.rowData = [
                {cod_nombreCuenta:0, cuenta:'', nombre_cuenta:'', referencia:'', debe:0.00, haber:0.00},
                {cod_nombreCuenta:0, cuenta:'', nombre_cuenta:'', referencia:'', debe:0.00, haber:0.00},
                {cod_nombreCuenta:0, cuenta:'', nombre_cuenta:'', referencia:'', debe:0.00, haber:0.00},
                {cod_nombreCuenta:0, cuenta:'', nombre_cuenta:'', referencia:'', debe:0.00, haber:0.00},
                {cod_nombreCuenta:0, cuenta:'', nombre_cuenta:'', referencia:'', debe:0.00, haber:0.00}
            ];
        },
        async getComprobante(fecha,tipo_comprobante){
        try {
            const responseComprobante= await api.post('/getComprobante',{
                fecha_comprobante:fecha,
                tipo_comprobante:tipo_comprobante
            })
            console.log(responseComprobante.data);
            if (responseComprobante.data.estado==='vacio') {
                const puct= '0001'
                return puct
            }else if(responseComprobante.data.estado==='ok'){
                const comprobanteOne= responseComprobante.data.total_comprobantes ===9  ? `00${responseComprobante.data.total_comprobantes+1}` : `000${responseComprobante.data.total_comprobantes+1}`;
                console.log(comprobanteOne)
                return comprobanteOne

            }
        } catch (error) {
            console.log(error);
            return 0;
        }
        },
        async getCotizacionOne(fecha){
        try {
            const responsefecha= await api.post('/getCotizacionOne',{fecha_comprobante:fecha})
            this.datosModificar.dolar=responsefecha.data.estado==='vacio' ? '': responsefecha.data.rows[0].dolar;
            this.datosModificar.ufv=responsefecha.data.estado==='vacio' ? '': responsefecha.data.rows[0].ufv;
        } catch (error) {
            console.log(error)
        }
    },
    capturarItem(item){
        this.itemSeleccionado=item; 
        console.log(this.itemSeleccionado)
        if(this.cuentaRowIndex !== null){

            if(this.itemSeleccionado.cod_nivelCuenta===5 ){

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

            }else{
                Toast.fire({
                    icon:'warning',
                    text:'solo seleccionar cuentas de nivel 5'
                })
            }
        }
    },
    abrirModalRegistro(item) {
            console.log(item)
            if (item.cod_nivelCuenta!==4) { 
                Toast.fire({
                    icon:'warning',
                    text:'solo se puede crear apartir de nivel 5'
                })
            }else if(item.cod_nivelCuenta===4){
                this.seleccionarCuenta = item; // Guardamos la cuenta padre
                this.mostrarModalNuevo = true;  // ¡Abrimos el modal aquí mismo!
                this.cuenta_mayor=item.nombre_cuenta;
                this.datosEdit.selectedCuenta= item.cod_tpcuenta===1 ? 'ACTIVO' : item.cod_tpcuenta===2 ? 'PASIVO' : item.cod_tpcuenta===3 ? 'CAPITAL' : item.cod_tpcuenta===4 ? 'INGRESO' : 'GASTO';
                this.datosEdit.selectedNivel=parseInt(item.cod_nivelCuenta)+1;
                if (item.children.length===0) {
                    this.datosEdit.puct=`${item.puct}001` 
                }else if(item.children.length>0){
                    const calcularpuct=item.children.length>9 ? `0${item.chidren.length+1}` : item.children.length>99 ? `${item-children.length+1}`: `00${item.children.length+1}`;
                    this.datosEdit.puct=`${item.puct}${calcularpuct}`
                }
                
                this.mostrarModal=true;
            }
            
        
    },
    cerrarModalRegistroCuenta(){
            
            this.mostrarModal=false;
            this.datosEdit.nombre_cuenta='';
            this.datosEdit.puct='';
            this.datosEdit.selectedCuenta='';
            this.datosEdit.selectedNivel='';
        },
    mostrarRegistroCuenta(){
        if (this.itemSeleccionado.cod_nivelCuenta!==4) {
            Toast.fire({
                icon:'warning',
                text:'solo se pueden crear de nivel 5'
            })
        }else if(this.itemSeleccionado.cod_nivelCuenta===4){
            this.mostrarModal=true;
        }
    },
    async getnombreCuenta(){
        const decryptEmpresa= CryptoJS.AES.decrypt(Cookies.get('emp'),this.key);
        const empresa= decryptEmpresa.toString(CryptoJS.enc.Utf8);
        const nombreEmpresa= CryptoJS.AES.decrypt(Cookies.get('dataEmp'),this.key).toString(CryptoJS.enc.Utf8); 
        this.nombreEmpresa=nombreEmpresa;
        try {
            const responsenombreCuenta= await api.get(`/getnombreCuenta/${empresa}`);
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
    async envioRegistroCuenta(){
        
        const decryptEmpresa= CryptoJS.AES.decrypt(Cookies.get('emp'),this.key);
        const empresa= decryptEmpresa.toString(CryptoJS.enc.Utf8);
        const datos={
            nombre_cuenta:this.datosEdit.nombre_cuenta,
            puct:this.datosEdit.puct,
            cod_empresa:parseInt(empresa),
            cod_nivelCuenta:parseInt(this.datosEdit.selectedNivel),
            cod_tpcuenta:this.datosEdit.selectedCuenta==='ACTIVO'? 1 : this.datosEdit.selectedCuenta==='PASIVO' ? 2 : this.datosEdit.selectedCuenta==='CAPITAL' ? 3 : this.datosEdit.selectedCuenta==='INGRESO' ? 4 : 5 
        }
        try {
            const responseCuenta= await api.post('/addCuenta',datos)
            if (responseCuenta.data.estado==='error') {
                Toast.fire({
                    icon:'error',
                    title:'Abencoado Group',
                    text:'problemas al registar intentelo mas tarde !'
                })
            
            }
            Toast.fire({
                icon:'success',
                title:'Abencoado Group',
                text:'registro exitoso!!'
            })
            this.datosEdit.nombre_cuenta='';
            this.datosEdit.puct='';
            this.datosEdit.selectedCuenta='';
            this.datosEdit.selectedNivel='';
            this.getnombreCuenta();
            this.mostrarModal=false;
            
        } catch (error) {
            Toast.fire({
                icon:'error',
                text:'error en el servidor intentelo mas tarde !'
            })
        }
        
    },
    imprimirReporte(accion) {
            // Llamamos al método generarPDF del componente hijo
            this.$refs.pdfHijo.generarPDF(accion);
    },
    },
    watch:{
        comprobanteSeleccionado(newval){
            console.log(newval)
            this.datosModificar.cod_comprobante=newval.cod_comprobante || '';
            this.datosModificar.nro_comprobante=newval.nro_comprobante || '';
            this.skipFechaWatcher = true;
            this.datosModificar.fecha_comprobante=newval.fecha_comprobante || ''; 
            this.datosModificar.selectedEmpresa=newval.razon || '';
            this.datosModificar.glosa=newval.glosa || '';
            this.datosModificar.dolar=newval.dolar || '';
            this.datosModificar.ufv=newval.ufv || '';
            this.datosModificar.metodo_pago=newval.metodo_pago.toUpperCase() || '';
            this.skipTipoWatcher = true;
            this.datosModificar.tipo_comprobante=newval.tipo_comprobante || '';

            // map asiento rows into grid format
            if (newval.asientos && Array.isArray(newval.asientos) && newval.asientos.length) {
                this.rowData = newval.asientos.map(a => ({
                    // prefer the real account id if available, fallback to asiento id
                    cod_asiento:a.cod_asiento || 0,
                    cod_nombreCuenta: a.cod_nombreCuenta || 0,
                    cuenta: a.puct || '',
                    nombre_cuenta: a.nombre_cuenta || '',
                    referencia: a.referencia || '',
                    debe: Number(a.debe || 0).toFixed(2),
                    haber: Number(a.haber || 0).toFixed(2)
                }));

                // add a few empty rows so user can continue adding entries
                if (this.rowData.length < 5) {
                    const faltantes = 5 - this.rowData.length;
                    for (let i = 0; i < faltantes; i++) {
                        this.rowData.push({cod_nombreCuenta:0,cuenta:'',nombre_cuenta:'',referencia:'',debe:0.00,haber:0.00});
                    }
                }
            } else {
                // fallback to blank rows
                this.rowData = [
                    {cod_nombreCuenta:0, cuenta:'', nombre_cuenta:'', referencia:'', debe:0.00, haber:0.00},
                    {cod_nombreCuenta:0, cuenta:'', nombre_cuenta:'', referencia:'', debe:0.00, haber:0.00},
                    {cod_nombreCuenta:0, cuenta:'', nombre_cuenta:'', referencia:'', debe:0.00, haber:0.00},
                    {cod_nombreCuenta:0, cuenta:'', nombre_cuenta:'', referencia:'', debe:0.00, haber:0.00},
                    {cod_nombreCuenta:0, cuenta:'', nombre_cuenta:'', referencia:'', debe:0.00, haber:0.00}
                ];
            }

            // update totals based on edited data
            this.recalcularTotales();
            
        },
        async 'datosModificar.tipo_comprobante'(newval, oldval){
            // only run when user manually changes the field
            if (this.skipTipoWatcher) {
                this.skipTipoWatcher = false;
                return;
            }
            if (this.datosModificar.fecha_comprobante==='') {
                return; 
            }else{
                const tipo_comprobante= newval==='ingreso' ? 1 : newval==='egreso' ? 2 : 3;
                
                
                const [ano,mes,dia] = this.datosModificar.fecha_comprobante.split(/\/|-/) ;
                
                const fecha= new Date(ano,mes -1,dia);
    
                const mesFormato= fecha=== '' ? (fechaformateada.getMonth()+1).toString().padStart(2,'0') : (fecha.getMonth()+1).toString().padStart(2,'0');
                
                const nroComprobante= await this.getComprobante(this.datosModificar.fecha_comprobante,newval);
                this.datosModificar.nro_comprobante=`${tipo_comprobante}${mesFormato}${nroComprobante}`
            }
 
        },
        async 'datosModificar.fecha_comprobante'(newval){
            console.log(newval)
            // only run when user manually changes the field
            if (this.skipFechaWatcher) {
                this.skipFechaWatcher = false;
                return;
            }
            if(!newval) return;   
            this.getCotizacionOne(newval);
            
            // Parsear manualmente para evitar problemas de zona horaria 
            const [ano, mes, dia] = newval.split('-');
            
            const fecha = new Date(ano, mes - 1, dia);
            console.log(fecha)
            const tipo_comprobante= this.datosModificar.tipo_comprobante==='ingreso' ? 1 : this.datosModificar.tipo_comprobante==='egreso' ? 2 : 3;
            const diaFormato = fecha.getDate().toString().padStart(2,'0');
            const mesFormato = (fecha.getMonth() + 1).toString().padStart(2,'0');
            const anoFormato = fecha.getFullYear();
            const nroComprobante= await this.getComprobante(newval,this.datosModificar.tipo_comprobante)
            
            this.datosModificar.nro_comprobante= `${tipo_comprobante}${mesFormato}${nroComprobante}`
                
        
        }
    },
    components:{
         flatPickr,
        AgGridVue,
        NestedList,
        generarPDF
    }
}
</script>


<template>
<!-- modal de editar libro diario-->
    <transition enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95">
    <div class="fixed inset-0 flex items-center justify-around ml-40 z-50" v-if="mostrarRegistroEditar">
        <form @submit.prevent="envioEditarLibro">
        <div class=" bg-gray-100 w-5xl 2xl:w-6xl h-2/4 2xl:h-2/3 rounded-lg p-8 ">
        <div class=" flex flex-row space-x-5">
            <p class=" font-Nunito text-lg text-slate-900 font-semibold">{{ titulo }}</p>
            <div class=" flex flex-row space-x-5">
                <button class=" p-1.5 bg-gray-300 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="#0e0e0e" d="M4.5 2.25a.75.75 0 0 1 .75.75v18a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75m12.907 1.464c1.146-.917 2.843-.1 2.843 1.367v13.838c0 1.468-1.697 2.284-2.843 1.367l-8.65-6.92a1.75 1.75 0 0 1 0-2.732z" stroke-width="0.5" stroke="#0e0e0e"/></svg></button>
                <button class=" p-1.5 bg-gray-300 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="#0e0e0e" d="M20.095 21a.75.75 0 0 1-.75-.75V3.75a.75.75 0 0 1 1.5 0v16.5a.74.74 0 0 1-.75.75m-3.4-9.589a2.25 2.25 0 0 1-.85 1.82l-9.11 7.09c-.326.247-.713.4-1.12.44h-.23a2.14 2.14 0 0 1-1-.22a2.2 2.2 0 0 1-.9-.81a2.17 2.17 0 0 1-.33-1.16V5.421a2.2 2.2 0 0 1 .31-1.12a2.25 2.25 0 0 1 .85-.8a2.18 2.18 0 0 1 2.24.1l9.12 6.08c.29.191.53.448.7.75a2.3 2.3 0 0 1 .32.98" stroke-width="0.5" stroke="#0e0e0e"/></svg></button>
            </div>
        </div>
        <div class=" grid grid-cols-2 space-x-2 ">
            <div class=" grid grid-cols-2 mt-5 gap-x-2">
            <div class=" flex flex-col">
                <label class=" block font-Nunito text-xs 2xl:text-sm text-slate-700">Comprobante Nro</label>
                <input v-model="datosModificar.nro_comprobante"  type="text" class=" bg-white text-sm p-1.5 rounded-xl border border-gray-200  placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="ingrese nro comprobante">
            </div>
            <div class=" flex flex-col">
                <label class=" block font-Nunito text-xs 2xl:text-sm text-slate-700">Tipo de comprobante</label>
                <select v-model="datosModificar.tipo_comprobante" class=" bg-white text-sm font-Nunito p-2 border border-gray-200 rounded-xl placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10  ">
                    <option value="" selected disabled >Selecciona tipo comprobante</option>
                    <option v-for="item in comprobante"  :key="item.value" :value="item.text" >{{ item.text }}</option>    
                </select>
            </div>
        </div>
        <div class=" flex flex-row space-x-2 items-center mt-5">
            <div class=" flex flex-col">
                <label class="text-xs 2xl:text-sm font-Nunito text-slate-800 ">Fecha</label>
                <div class="flex flex-row relative">
                            <flat-pickr
                            v-model="datosModificar.fecha_comprobante"
                            :config="flatpickrConfig"
                            class=" w-60  appearance-none rounded-xl border border-gray-300  bg-white p-2   text-sm text-slate-800 shadow-theme-xs placeholder:text-gray-700 focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10"
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
                <label class=" block font-Nunito text-xs 2xl:text-sm text-slate-700">T.C $us</label>
                <input v-model="datosModificar.dolar" type="text" class=" bg-white w-28 text-sm p-2 rounded-xl border border-gray-200  placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="$us">            
            </div>
            <div class=" flex flex-col">
                <label class=" block font-Nunito text-xs 2xltext-sm text-slate-700">T.C Ufv</label>
                <input v-model="datosModificar.ufv" type="text" class=" bg-white w-28 text-sm p-2 rounded-xl border border-gray-200  placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="UFV">            
            </div>
        </div>
        </div>
        <div class="grid grid-cols-3 space-x-4">
            <div class=" flex flex-col">
                <label class=" block font-Nunito text-xs 2xl:text-sm text-slate-700">Razon social</label>
                <input v-model="datosModificar.selectedEmpresa" type="text" class=" bg-white  text-sm p-2 rounded-xl border border-gray-200  placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="razon social">            
            </div>
            <div class=" flex flex-col">
                <label class=" block font-Nunito text-xs 2xl:text-sm text-slate-700">Glosa</label>
                <input v-model="datosModificar.glosa" type="text" class=" bg-white p-2 rounded-xl border text-sm border-gray-200  placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="ingrese glosa">            
            </div>
            <div class=" flex flex-col">
                <label class=" block font-Nunito text-xs 2xl:text-sm text-slate-700">Metodo de Pago</label>
                <select v-model="datosModificar.metodo_pago" class=" bg-white text-sm font-Nunito p-2 border border-gray-200 rounded-xl placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10  ">
                    <option value="" selected disabled class="font-Nunito text-sm  ">Selecciona el metodo de pago</option>
                    <option v-for="item in pago"  :key="item.value" :value="item.text" >{{ item.text }}</option>    
                </select>
            </div>
        </div>
        <!-- tabla debe haber-->
        <div class=" w-4xl 2xl:w-5xl h-60 2xl:h-70 mx-auto mb-2 mt-5 bg-gray-300 overflow-y-auto border-2 border-slate-900 ag-theme-alpine">
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
        <div class=" flex flex-row items-center space-x-4 mr-8 justify-end">
            <label for="" class=" font-Nunito text-sm 2xl:text-md font-semibold ">Totales:</label>
            <input  type="text" disabled :value="datosModificar.total_debe.toFixed(2)" class=" bg-white text-sm  rounded-xl border border-gray-300 p-1.5 placeholder:text-sm placeholder:text-slate-900 focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 text-slate-900  " placeholder="">
            <input   type="text" disabled :value="datosModificar.total_haber.toFixed(2)" class=" bg-white text-sm rounded-xl border border-gray-300 p-1.5 placeholder:text-sm placeholder:text-slate-900 focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 text-slate-900  " placeholder="">
            
        </div>
        <div class="flex flex-row items-center space-x-4 justify-end mr-10">
            <label for="" class=" font-Nunito text-sm font-semibold ">Diferencia:</label>
            <p class=" text-blue-800 font-Nunito text-sm" :class="diferencia> 0 ? 'border-red-500' :'border-green-500'">{{ diferencia.toFixed(2) }}</p>
        </div>    
            <div class=" flex flex-row space-x-4 mt-5">
            <button type="submit" :disabled="diferencia>0" :class="diferencia>0 ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-50' :'bg-blue-800 text-white hover:bg-blue-800'" class=" flex flex-row items-center justify-center w-xs bg-blue-950 rounded-lg p-2 font-Nunito text-white text-xs cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20"><path fill="#fff" d="M7.707 10.293a1 1 0 1 0-1.414 1.414l3 3a1 1 0 0 0 1.414 0l3-3a1 1 0 0 0-1.414-1.414L11 11.586V6h5a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5v5.586zM9 4a1 1 0 0 1 2 0v2H9z"/></svg>{{diferencia>0 ? 'Diferencia pendiente' : 'Registrar Comprobante'}}</button>
            <button type="button" @click="imprimirReporte('preview')" class=" flex flex-row justify-center items-center w-xs bg-blue-950 rounded-lg p-2 font-Nunito cursor-pointer text-white text-xs">Imprimir Comprobante</button>
            <button type="button" @click="cerrarViewEdit" class=" flex flex-row justify-center items-center w-xs bg-blue-950 rounded-lg p-2 font-Nunito cursor-pointer text-white text-xs"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="#fff" d="m8.4 17l3.6-3.6l3.6 3.6l1.4-1.4l-3.6-3.6L17 8.4L15.6 7L12 10.6L8.4 7L7 8.4l3.6 3.6L7 15.6zm3.6 5q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"/></svg>Cancelar</button>
            
            </div>
        </div>
    
    </form>
    </div>
               
    </transition>
<!-- modal para consultar cuenta-->
    <transition enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95" >
    <div v-if="mostrarCuenta" class="fixed inset-0 flex items-center justify-around z-50">
        <div class="bg-gray-50 bg-opacity-80   ml-56 w-3xl p-6 rounded-lg shadow-2xl flex flex-col space-x-2">
            <p class="text-slate-900 font-Nunito mb-5">PLAN DE CUENTAS</p>
             <NestedList :items="dataCuenta" @select="capturarItem" @abrir-registro="abrirModalRegistro">
                <span v-if="dataCuenta" class=" font-Nunito text-sm text-slate-900">No se cargaron las cuentas..</span>
            </NestedList>
        
            <div class=" flex flex-row space-x-5 mt-10">
                <button class=" bg-blue-950 text-white rounded-lg p-2 text-sm w-xs cursor-pointer">Seleccionar</button>
                <button @click="mostrarRegistroCuenta" class="bg-blue-950 text-white rounded-lg p-2 text-sm w-xs cursor-pointer">Nuevo</button>
                <button @click="mostrarCuenta=false" class=" bg-blue-950 text-white rounded-lg p-2 text-sm w-xs cursor-pointer">Cancelar</button>
            </div>
        </div>
        
    </div>
    </transition>
    
    <generarPDF 
    ref="pdfHijo" 
    :dataComprobante="rowData" 
    :titulo="datosModificar.tipo_comprobante.toUpperCase()" 
    :datosExtra="datosModificar"
    :convertirMontoALetras="convertirMontoALetras"
    :nombreEmpresa="nombreEmpresa"
/>
</template>

