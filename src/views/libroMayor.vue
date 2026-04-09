<script>
import sidebar from '@/assets/layout/sidebar.vue';
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { AgGridVue } from 'ag-grid-vue3';
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"
import mostrarAsiento from '@/components/libroDiario/mostrarAsiento.vue';
import api from '@/services/api.js';
import Swal from 'sweetalert2';
import NestedList from '@/components/NestedList.vue';
import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';
import { toCanvas } from 'html-to-image';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
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
    data(){
        return{
            mostrarModalfecha:true,
            mostrarCuenta:false,
            mostrarSaldosMensuales:false,
            cod_nombreCuenta:0,
            nombre_cuenta:'',
            dataCuenta:[],
            headers:['Fecha','Nro comprobante','Razon social','Glosa','Referencia','Debe','Haber','Asiento'],
            headresSaldo:['Fecha','Nro comprobante','Razon social','Glosa','Referencia','TC','Debe','Haber','Saldo','Asiento'],
            headersMensual:['MES','DEBE','HABER','SALDO bs'],
            productos:[{fecha:'2025-01-02',nro_comprobante:'1030004',razon_social:'Burger king',glosa:'por apertura de gestion 2025',referencia:'',debe:450.00,haber:450.00},
                {fecha:'2025-01-02',nro_comprobante:'1030004',razon_social:'Burger king',glosa:'por apertura de gestion 2025',referencia:'',debe:450.00,haber:450.00},
                {fecha:'2025-01-02',nro_comprobante:'1030004',razon_social:'Burger king',glosa:'por apertura de gestion 2025',referencia:'',debe:450.00,haber:450.00},
                {fecha:'2025-01-02',nro_comprobante:'1030004',razon_social:'Burger king',glosa:'por apertura de gestion 2025',referencia:'',debe:450.00,haber:450.00},
                {fecha:'2025-01-02',nro_comprobante:'1030004',razon_social:'Burger king',glosa:'por apertura de gestion 2025',referencia:'',debe:450.00,haber:450.00},
                {fecha:'2025-01-02',nro_comprobante:'1030004',razon_social:'Burger king',glosa:'por apertura de gestion 2025',referencia:'',debe:450.00,haber:450.00},
                {fecha:'2025-01-02',nro_comprobante:'1030004',razon_social:'Burger king',glosa:'por apertura de gestion 2025',referencia:'',debe:450.00,haber:450.00},
                {fecha:'2025-01-02',nro_comprobante:'1030004',razon_social:'Burger king',glosa:'por apertura de gestion 2025',referencia:'',debe:450.00,haber:450.00},
                {fecha:'2025-01-02',nro_comprobante:'1030004',razon_social:'Burger king',glosa:'por apertura de gestion 2025',referencia:'',debe:450.00,haber:450.00},
                {fecha:'2025-01-02',nro_comprobante:'1030004',razon_social:'Burger king',glosa:'por apertura de gestion 2025',referencia:'',debe:450.00,haber:450.00},
                {fecha:'2025-01-02',nro_comprobante:'1030004',razon_social:'Burger king',glosa:'por apertura de gestion 2025',referencia:'',debe:450.00,haber:450.00},
                {fecha:'2025-01-02',nro_comprobante:'1030004',razon_social:'Burger king',glosa:'por apertura de gestion 2025',referencia:'',debe:450.00,haber:450.00}
                
            ],
            libromes:[{value:'01',text:'enero'},{value:'02',text:'febrero'},{value:'03',text:'marzo'},{value:'04',text:'abril'},{value:'05',text:'mayo'},{value:'06',text:'junio'},{value:'07',text:'julio'},{value:'08',text:'agosto'},{value:'09',text:'septiembre'},{value:'10',text:'octubre'},{value:'11',text:'noviembre'},{value:'12',text:'diciembre'}],
            mostrarModal:false,
            producto:[],
            mostrarConsultarLibroMayor:false,
            fecha1:'',
            fecha2:'',
            flatpickrTimeConfig:{
            enableTime: true,
            noCalendar: true,
            dateFormat: 'Y-m-d',
            locale:'es',
            time_24hr: true,
            minuteIncrement: 1,
            wrap: false,
            }, 
            key:'abencoadoGroup',
            moneda:[{value:1,text:'bolivianos'},{value:2,text:'dolares'}],
            tipo_moneda:'',
            datoslibroMayor:[],
            datosSaldosContinuos:[],
            datosMensuales:[],
            mostrarEditLibroDiario:false,
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
            gridOptions: {
                stopEditingWhenCellsLoseFocus: true
            },
            gridOptions: {
                enterNavigatesVertically: true,
                enterNavigatesVerticallyAfterEdit: true
            },
            datosEdit:{
                nro_comprobanteEdit:'',
                razon_social:'',
                tipo_comprobanteEdit:'',
                fecha_comprobanteEdit:'',
                dolarEdit:'',
                ufvEdit:'',
                selectedEmpresaEdit:'',
                glosaEdit:'',
                metodo_pagoEdit:'',
                total_debe:'',
                total_haber:''
            },
            mostrarLibroMayor:true,
            mostrarSaldosContinuos:false,
            total_periododebe:0.00,
            total_periodohaber:0.00,
            total_acumulado:0.00,
            saldo_fecha:0.00,
            datos:[],
            gastosMensuales:[],
            total_debeSaldo:0.00,
            total_haberSaldo:0.00,
            total_Saldo:0.00,
            fechadata1:[],
            fechadata2:[],
            nombreEmpresa:''


        }
    },
    mounted(){
        const sF1 = sessionStorage.getItem('fecha1');
        const sF2 = sessionStorage.getItem('fecha2');
        const cCuenta = Cookies.get('cuenta');

        if (sF1 && sF2 && cCuenta) {
            this.fecha1 = sF1;
            this.fecha2 = sF2;
            const bytes = CryptoJS.AES.decrypt(cCuenta, this.key);
            this.cod_nombreCuenta = bytes.toString(CryptoJS.enc.Utf8);

            this.getlibroMayorFechas();
        } 
    }, 
    methods:{
       async getlibroMayorFechas(){
            
            const empresa= CryptoJS.AES.decrypt(Cookies.get('dataEmp'),this.key).toString(CryptoJS.enc.Utf8); 
            this.nombreEmpresa=empresa;

            const cuentaDecrypt= Cookies.get('cuenta') ? CryptoJS.AES.decrypt(Cookies.get('cuenta'),this.key).toString(CryptoJS.enc.Utf8) : null;
            const finalCuenta = this.cod_nombreCuenta || cuentaDecrypt;

            const f1 = this.fecha1 || sessionStorage.getItem('fecha1');
            const f2 = this.fecha2 || sessionStorage.getItem('fecha2');    

            if (!finalCuenta || !f1 || !f2) {
                this.mostrarLibroMayor = true;
                this.mostrarSaldosContinuos = false;
                this.mostrarSaldosMensuales = false;
                return; 
            }
            
                    const decryptEmpresa=CryptoJS.AES.decrypt(Cookies.get('emp'),this.key).toString(CryptoJS.enc.Utf8); 
                    
                    const datos={
                    fecha1:f1,
                    fecha2:f2,
                    cod_empresa:parseInt(decryptEmpresa),
                    cod_nombreCuenta:parseInt(finalCuenta)
                    } 
                    //console.log(datos)
           
                try {
                    const responselibrofecha= await api.post('/getLibroMayor',datos);
                        
                    if (responselibrofecha.data.status==='vacio') {
                        Toast.fire({
                            icon:'info',
                            title:'Abencoado Group', 
                            text:'no se encontraron datos'
                        })
                        this.mostrarLibroMayor=true;
                        this.mostrarSaldosContinuos=false;
                        this.mostrarSaldosMensuales=false;
                    }else if(responselibrofecha.data.status==='ok'){
                        // guardar localstorage las fechas
                        sessionStorage.setItem('fecha1',f1);
                        sessionStorage.setItem('fecha2',f2);
                        // Aseguramos que las variables locales de Vue tengan el valor
                        this.fecha1 = f1;
                        this.fecha2 = f2;
                        this.cod_nombreCuenta = finalCuenta;

                        // encrypt cuenta
                        const encryptcuenta=CryptoJS.AES.encrypt(String(finalCuenta),this.key).toString();
                        Cookies.set('cuenta',encryptcuenta,{expires:1,secure:true})
                        //-----//
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

                        this.datoslibroMayor=Object.values(agrupados);
                        
                        
                        let totalDebeGlobal = 0;
                        let totalHaberGlobal = 0;
        
                        this.datoslibroMayor.forEach(comprobante => {
                            // Verificamos que 'asientos' sea un arreglo antes de iterar
                            if (comprobante.asientos && Array.isArray(comprobante.asientos)) {
                                comprobante.asientos.forEach(asiento => {
                                    // Convertimos a número de forma explícita
                                    const d = parseFloat(asiento.debe) || 0;
                                    const h = parseFloat(asiento.haber) || 0;
                                    
                                    totalDebeGlobal += d;
                                    totalHaberGlobal += h;
                                });
                            }
                        }); 
                        //---------
                        this.total_periododebe = totalDebeGlobal.toFixed(2);
                        this.total_periodohaber = totalHaberGlobal.toFixed(2);
                        this.saldo_fecha = (totalDebeGlobal - totalHaberGlobal).toFixed(2);
                        
                        // --------------------
                        // calculo de fechas mostradas 
                        const resultado = this.fecha1.split('-').reverse().join('-').replace(/-(\d{2})-/, (match, m) => `-${new Date(0, m - 1).toLocaleString('es', { month: 'long' })}-`).split('-').reverse().join('-');
                        this.fechadata1= resultado.split('-')
                        const resultado2=this.fecha2.split('-').reverse().join('-').replace(/-(\d{2})-/, (match, m) => `-${new Date(0, m - 1).toLocaleString('es', { month: 'long' })}-`).split('-').reverse().join('-');
                        this.fechadata2=resultado2.split('-')


                        this.mostrarConsultarLibroMayor=false;
                        this.mostrarLibroMayor=true;
                        this.mostrarSaldosContinuos=false;
                        this.mostrarSaldosMensuales=false;

                        console.log(this.datoslibroMayor)
                        
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
       async mostrarMayor(){ 
             if (!Cookies.get('FH') && !Cookies.get('FH2') && !Cookies.get('cuenta')) {
                this.mostrarLibroMayor=true;
                this.mostrarSaldosMensuales=false;
                this.mostrarSaldosContinuos=false;
             } else{
                    const decryptEmpresa=CryptoJS.AES.decrypt(Cookies.get('emp'),this.key).toString(CryptoJS.enc.Utf8); 
             const decryptfecha1=CryptoJS.AES.decrypt(Cookies.get('FH'),this.key).toString(CryptoJS.enc.Utf8); 
             const decryptfecha2=CryptoJS.AES.decrypt(Cookies.get('FH2'),this.key).toString(CryptoJS.enc.Utf8); 
             const decryptcuenta=CryptoJS.AES.decrypt(Cookies.get('cuenta'),this.key).toString(CryptoJS.enc.Utf8); 
                    const datos={
                    fecha1:decryptfecha1,
                    fecha2:decryptfecha2,
                    cod_empresa:parseInt(decryptEmpresa),
                    cod_nombreCuenta:parseInt(decryptcuenta)
                }
                try {
                    const responselibrofecha= await api.post('/getLibroMayor',datos);
                        console.log(responselibrofecha.data.rows)
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

                        this.datoslibroMayor=Object.values(agrupados);
                        this.mostrarLibroMayor=true;
                        this.mostrarSaldosContinuos=false;
                        this.mostrarSaldosMensuales=false;
                        let totalDebeGlobal = 0;
                        let totalHaberGlobal = 0;
        
                        this.datoslibroMayor.forEach(comprobante => {
                            // Verificamos que 'asientos' sea un arreglo antes de iterar
                            if (comprobante.asientos && Array.isArray(comprobante.asientos)) {
                                comprobante.asientos.forEach(asiento => {
                                    // Convertimos a número de forma explícita
                                    const d = parseFloat(asiento.debe) || 0;
                                    const h = parseFloat(asiento.haber) || 0;
                                    
                                    totalDebeGlobal += d;
                                    totalHaberGlobal += h;
                                });
                            }
                        }); 


                        this.total_periododebe = totalDebeGlobal.toFixed(2);
                        this.total_periodohaber = totalHaberGlobal.toFixed(2);
                        this.saldo_fecha = (totalDebeGlobal - totalHaberGlobal).toFixed(2);
                        
                        // --------------------
                        this.fecha1='';
                        this.fecha2='';
                        this.nombre_cuenta='';
                        this.cod_nombreCuenta='';
                        
                    }
                } catch (error) {
                    console.log('ha ocurrido un error :',error)
                    Toast.fire({
                        icon:'error',
                        title:'Abencoado Group',
                        text:'hubo un error en el servidor'
                    })
                }
             }
             
       },
       async envioEditLibro(){

       },
       async mostrarEdit(item){
        console.log(item)
        const decryptEmpresa= CryptoJS.AES.decrypt(Cookies.get('emp'),this.key).toString(CryptoJS.enc.Utf8); 

        try {
            const responseGetcomprobante= await api.post('/getLibroMayorOne',{
                cod_empresa:parseInt(decryptEmpresa),
                cod_comprobante:parseInt(item.cod_comprobante)    
            })
            
            if (responseGetcomprobante.data.status==='vacio') {
                return 
            }else if(responseGetcomprobante.data.status==='ok'){
                
                const rows=responseGetcomprobante.data.rows;
        
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
                 this.datos=Object.values(agrupados);
                console.log(this.datos) 
                this.mostrarEditLibroDiario=true;
                this.mostrarSaldosMensuales=false;
                this.datosEdit.selectedEmpresaEdit=this.datos[0].empresa;
                this.datosEdit.nro_comprobanteEdit=this.datos[0].nro_comprobante;
                this.datosEdit.fecha_comprobanteEdit=this.datos[0].fecha_comprobante;
                this.datosEdit.tipo_comprobanteEdit=this.datos[0].tipo_comprobante;
                this.datosEdit.glosaEdit=this.datos[0].glosa;
                this.datosEdit.razon_social=this.datos[0].razon_social;
                this.datosEdit.metodo_pagoEdit=this.datos[0].metodo_pago;
                this.datosEdit.dolarEdit=this.datos[0].dolar;
                this.datosEdit.ufvEdit=this.datos[0].ufv;
                this.datosEdit.total_debe=this.datos[0].total_debe;
                this.datosEdit.total_haber=this.datos[0].total_haber;
                
                if (this.datos[0].asientos && Array.isArray(this.datos[0].asientos) && this.datos[0].asientos.length) {
                    
                    this.rowData = this.datos[0].asientos.map(a => ({
                    // prefer the real account id if available, fallback to asiento id
                    cod_nombreCuenta: a.cod_nombreCuenta || a.cod_asiento || 0,
                    cuenta: a.puct || '',
                    nombre_cuenta: a.nombre_cuenta || '',
                    referencia: a.referencia || '',
                    debe: Number(a.debe || 0),
                    haber: Number(a.haber || 0)
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

            }
        } catch (error) {
            console.log(error)
            Toast.fire({
                icon:'error',
                text:'Error en el Servidor intentelo mas tarde'
            })
        }
        
            
       },
       cerrarModalEdit(){
        this.mostrarEditLibroDiario=false;
        
        if (this.mostrarSaldosContinuos===true) {
            this.mostrarSaldosContinuos=true;
            this.mostrarLibroMayor=false;
            this.mostrarSaldosMensuales=false;
        }else if(this.mostrarLibroMayor===true){
            this.mostrarSaldosContinuos=false;
            this.mostrarLibroMayor=true;
            this.mostrarSaldosMensuales=false;
        }
        
        // limpiamos los datos
        this.datosEdit.nro_comprobanteEdit='';
        this.datosEdit.tipo_comprobanteEdit='';
        this.datosEdit.fecha_comprobanteEdit='';
        this.datosEdit.dolarEdit='';
        this.datosEdit.ufvEdit='';
        this.datosEdit.razon_social='';
        this.datosEdit.glosaEdit='';
        this.datosEdit.metodo_pagoEdit='';
        this.rowData=[{   
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
            }]

       },
       async SaldosMensuales(){
        if(!Cookies.get('cuenta')){
            this.mostrarSaldosMensuales=true;
            this.mostrarLibroMayor=false;
            this.mostrarSaldosContinuos=false;    
        }else{
            const decryptEmpresa=CryptoJS.AES.decrypt(Cookies.get('emp'),this.key).toString(CryptoJS.enc.Utf8); 
            const decryptCuenta=CryptoJS.AES.decrypt(Cookies.get('cuenta'),this.key).toString(CryptoJS.enc.Utf8); 
            try {
                const responseGastosMensuales= await api.post('/getSaldosMensuales',{
                    cod_empresa:parseInt(decryptEmpresa),
                    cod_nombreCuenta:parseInt(decryptCuenta),
                    cod_nivelCuenta:5
                })
                if (responseGastosMensuales.data.status==='vacio') {
                    Toast.fire({
                        icon:'warning',
                        text:'Datos no encontrados'
                    })
                }else if(responseGastosMensuales.data.status==='ok'){
                    this.gastosMensuales=responseGastosMensuales.data.rows;
                    console.log(this.gastosMensuales)
                }
                this.mostrarSaldosMensuales=true;
                this.mostrarLibroMayor=false;
                this.mostrarSaldosContinuos=false;
            } catch (error) {
                
            }
        }
        
       },  
        mostrarCuentas(){
            this.getnombreCuenta();
            this.mostrarCuenta=true;
        },
        async mostrarSaldo(){
            if (!sessionStorage.getItem('fecha1') || !sessionStorage.getItem('fecha2') || !Cookies.get('cuenta')) {
                this.mostrarSaldosContinuos=true;
                this.mostrarSaldosMensuales=false;
                this.mostrarLibroMayor=false;
            }else{
                const fecha1= sessionStorage.getItem('fecha1');
                const fecha2=sessionStorage.getItem('fecha2')
                const decryptEmpresa=CryptoJS.AES.decrypt(Cookies.get('emp'),this.key).toString(CryptoJS.enc.Utf8); 
                const decryptcuenta=CryptoJS.AES.decrypt(Cookies.get('cuenta'),this.key).toString(CryptoJS.enc.Utf8);
                const datos={
                    fecha1:fecha1,
                    fecha2:fecha2,
                    cod_empresa:parseInt(decryptEmpresa),
                    cod_nombreCuenta:parseInt(decryptcuenta)
                }
            try {
                const responselibrofecha= await api.post('/getLibroMayor',datos);
                console.log(responselibrofecha.data.rows)
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
                let saldoRastreador = 0; // Esta variable es la clave, no se reinicia hasta terminar todos los rows

            const agrupados = rows.reduce((acc, current) => {
                const { cod_comprobante } = current;

                if (!acc[cod_comprobante]) {
                    acc[cod_comprobante] = {
                        ...current,
                        asientos: []
                    };
                }

                const debe = parseFloat(current.debe || 0);
                const haber = parseFloat(current.haber || 0);

                // REGLA DE ORO: Saldo = Saldo Anterior + Debe - Haber
                saldoRastreador = saldoRastreador + debe - haber;

                acc[cod_comprobante].asientos.push({
                    ...current,
                    debe: debe.toFixed(2),
                    haber: haber.toFixed(2),
                    saldo: saldoRastreador.toFixed(2) // Guardamos el acumulado real
                });

                return acc;
            }, {});

            this.datosSaldosContinuos = Object.values(agrupados);
                
            }
            } catch (error) {
                Toast.fire({
                    icon:'error',
                    text:'Problemas con el servidor intentelo mas tarde!'
                })
            }
            this.mostrarSaldosContinuos=true;
            this.mostrarLibroMayor=false;
            this.mostrarSaldosMensuales=false;
            }
            
        },
        cerrarModalCuenta(){ 
            this.mostrarConsultarLibroMayor=false;
            this.fecha1='';
            this.fecha2='';
            this.cod_nombreCuenta=null,
            this.nombre_cuenta=''
        },
        capturarItem(item){
            console.log(item)
            if(item.cod_nivelCuenta !==5){
                Toast.fire({
                    icon:'error',
                    text:'debes seleccionar solo cuentas de nivel 5'
                })
            }else{
                this.nombre_cuenta=item.nombre_cuenta;
                this.cod_nombreCuenta=item.cod_nombreCuenta;
                console.log(this.nombre_cuenta);
                console.log(this.cod_nombreCuenta);
                this.mostrarCuenta=false;
            }
            
        },
        async getnombreCuenta(){
        const decryptEmpresa= CryptoJS.AES.decrypt(Cookies.get('emp'),this.key);
        const empresa= decryptEmpresa.toString(CryptoJS.enc.Utf8);
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
        imprimirReporte(accion) {
            // Llamamos al método generarPDF del componente hijo
            this.$refs.pdfHijo.generarPDF(accion);
        },
        
    },
    computed:{
        total_debeSaldo() {
            // Sumamos el 'debe' de cada comprobante en la lista
            const total = this.datosSaldosContinuos.reduce((sum, item) => {
                return sum + parseFloat(item.debe || 0);
            }, 0);
            return total.toFixed(2);
        },

        total_haberSaldo() {
            // Sumamos el 'haber' de cada comprobante en la lista
            const total = this.datosSaldosContinuos.reduce((sum, item) => {
                return sum + parseFloat(item.haber || 0);
            }, 0);
            return total.toFixed(2);
        },

        total_Saldo() {
        // MODIFICACIÓN: Suma directa de la columna 'saldo' calculada
        const totalSumaSaldos = this.datosSaldosContinuos.reduce((sum, item) => {
            // Accedemos al saldo del comprobante (el que calculamos con el rastreador)
            // Si el saldo está dentro del array de asientos, tomamos el último.
            const valorSaldo = item.asientos && item.asientos.length > 0 
                               ? item.asientos[item.asientos.length - 1].saldo 
                               : 0;
            return sum + parseFloat(valorSaldo);
        }, 0);
        
            return totalSumaSaldos.toFixed(2);
        },
        
    },
    watch:{
        
    },
    components:{
        sidebar,
        AgGridVue,
        mostrarAsiento,
        flatPickr,
        NestedList,
        generarPDF
        

    }
}
</script>

<template>
<sidebar>
<template #title>Libro Mayor</template> 
<!-- seccion libro mayor-->   
<div v-if="mostrarLibroMayor" class=" flex flex-col ml-45">
    <div class="flex flex-row space-x-5">
        <p class=" text-slate-900 text-sm font-Nunito">Del {{ fechadata1[2] }} de {{fechadata1[1]}} de {{ fechadata1[0] }} al {{fechadata2[2]}} de {{fechadata2[1]}} de {{fechadata2[0]}}</p>
    </div>
    <div class=" bg-gray-100 w-6xl  2xl:w-7xl 2xl:h-10/12 mb-5 rounded-lg p-8 ">
        <div class=" flex flex-row items-center space-x-4">
            <p class=" text-slate-900 text-sm font-Nunito">Buscar por NRO. comprobante</p>
            <input  type="text" class=" bg-white text-sm p-2 rounded-xl border border-gray-200  placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="nro comprobante">
            <button class=" bg-blue-950 p-1.5 rounded-lg text-white flex flex-row items-center cursor-pointer text-sm font-Nunito"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><g fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="62" d="M13.5 3l5.5 5.5v11.5c0 0.55 -0.45 1 -1 1h-12c-0.55 0 -1 -0.45 -1 -1v-16c0 -0.55 0.45 -1 1 -1Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="62;0"/></path><path stroke-dasharray="34" stroke-dashoffset="34" d="M14.83 15.83c-1.56 1.56 -4.1 1.56 -5.66 0c-1.56 -1.56 -1.56 -4.1 0 -5.66c1.56 -1.56 4.1 -1.56 5.66 0c1.56 1.56 1.56 4.1 0 5.66l4.67 4.67"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.4s" to="0"/></path></g></svg>Buscar</button>
            <button class=" bg-blue-950 p-1.5 w-48 text-white text-sm font-Nunito rounded-lg cursor-pointer">Seleccionar cuenta</button>
            
        </div>
        
        <div class=" grid grid-cols-2 w-4xl gap-x-4 mt-8">
            <div class="flex flex-col">
                <label class=" text-sm font-Nunito text-slate-900" >Cuenta</label>
                <input  type="text" class=" bg-white text-sm p-2 rounded-xl border border-gray-200  placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder=" nro cuenta">    
            </div>
            <div class="flex flex-col">
                <label class=" text-sm font-Nunito text-slate-900" >Nombre de Cuenta</label>
                <input  type="text" class=" bg-white text-sm p-2 rounded-xl border border-gray-200  placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="nombre cuenta">    
            </div>
        </div>
        <!-- tabla lista libro mayor-->
        <div class="flex flex-col bg-gray-100 border border-gray-200 w-5xl mt-5  p-4 rounded-lg">
            <div class="flex flex-row px-4">
                <button  class=" p-1.5 text-sm text-white bg-blue-950 rounded-lg font-Nunito cursor-pointer">Mayor</button>
                <button @click="mostrarSaldo" class=" p-1.5 text-sm text-white bg-blue-950 rounded-lg font-Nunito cursor-pointer">Saldos Continuos</button>
                <button @click="SaldosMensuales" class=" p-1.5 text-sm text-white bg-blue-950 rounded-lg font-Nunito cursor-pointer">Saldos Mensuales</button>
            </div>
            <div class="flex-1 mt-7  overflow-y-auto px-4 max-h-80">
            <table class="w-full text-sm  text-left text-gray-500">
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
                <tr v-if="!datoslibroMayor.length" class=" flex  justify-center text-gray-500 mt-8 mx-auto h-52">
                    <td class=" text-sm font-Nunito ">No se encontraron Datos</td>
                </tr>
                <tr v-for="(prod, index) in datoslibroMayor" :key="index" class="bg-white  hover:bg-gray-200 ">
                    <td v-show="false" class="px-4 py-2  whitespace-nowrap cursor-pointer">
                    {{ prod.empresa }}
                    </td>
                    
                    <td v-show="false" class="px-4 py-2  whitespace-nowrap cursor-pointer">
                    {{ prod.cod_comprobante }}
                    </td>
                    <td class="px-4 py-2  whitespace-nowrap cursor-pointer">
                    {{ prod.fecha_comprobante }}
                    </td>
                    <td class="px-4 py-2 cursor-pointer">
                    {{ prod.nro_comprobante }}
                    </td>
                    <td class="px-4 py-2 text-left cursor-pointer">
                    {{ prod.razon_social }}
                    </td>
                    <td class="px-4 py-2 text-left cursor-pointer">
                    {{ prod.glosa }}
                    </td>
                    <td v-show="false" class="px-4 py-2  whitespace-nowrap cursor-pointer">
                    {{ prod.metodo_pago }}
                    </td>
                    <td v-show="false" class="px-4 py-2  whitespace-nowrap cursor-pointer">
                    {{ prod.total_debe }}
                    </td>
                    <td v-show="false" class="px-4 py-2  whitespace-nowrap cursor-pointer">
                    {{ prod.total_haber }}
                    </td>
                    <td class="px-4 py-2 text-left cursor-pointer">
                    {{ prod.referencia }}
                    </td>
                    <td class="px-4 py-2 text-left cursor-pointer">
                    {{ prod.debe }}
                    </td>
                    <td class="px-4 py-2 text-left cursor-pointer">
                    {{ prod.haber }}
                    </td>
                    <td class="px-4 py-2 text-left cursor-pointer">
                        <button @click="mostrarEdit(prod)" class=" flex flex-row items-center justify-center w-35 h-10 cursor-pointer bg-blue-950 text-white font-Nunito p-1.5 text-xs rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><circle cx="16" cy="16" r="4" fill="#fff"/><path fill="#fff" d="M30.94 15.66A16.69 16.69 0 0 0 16 5A16.69 16.69 0 0 0 1.06 15.66a1 1 0 0 0 0 .68A16.69 16.69 0 0 0 16 27a16.69 16.69 0 0 0 14.94-10.66a1 1 0 0 0 0-.68M16 22.5a6.5 6.5 0 1 1 6.5-6.5a6.51 6.51 0 0 1-6.5 6.5"/></svg>Mostrar Asiento</button>
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
            <div class="grid grid-cols-2 w-full mt-5">
                <div class="flex flex-row px-3 space-x-2 items-end">
    
                    <button  @click="mostrarConsultarLibroMayor=true"  class=" flex flex-row items-center justify-center w-40 h-10 cursor-pointer bg-blue-950 text-white font-Nunito p-1.5 text-xs font-bold rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><circle cx="16" cy="16" r="4" fill="#fff"/><path fill="#fff" d="M30.94 15.66A16.69 16.69 0 0 0 16 5A16.69 16.69 0 0 0 1.06 15.66a1 1 0 0 0 0 .68A16.69 16.69 0 0 0 16 27a16.69 16.69 0 0 0 14.94-10.66a1 1 0 0 0 0-.68M16 22.5a6.5 6.5 0 1 1 6.5-6.5a6.51 6.51 0 0 1-6.5 6.5"/></svg>Consultar por Fecha</button>
                </div>
                <div class="flex flex-col mr-35">
                    <div class="flex flex-row justify-end items-center px-5 space-x-2 ">
                    <label class="text-slate-900 text-sm font-Nunito">Total Periodo:</label>
                    <input :value="total_periododebe"  type="text" disabled class=" w-24 bg-white text-sm p-2 rounded-xl border border-gray-200  placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="">
                    <input :value="total_periodohaber" type="text" disabled class=" w-24 bg-white text-sm p-2 rounded-xl border border-gray-200  placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="">
                </div> 
                <div class="flex flex-row justify-end items-center px-5 space-x-2 "> 
                    <label  class="text-slate-900 text-sm font-Nunito">Total Acumulados:</label>
                    <input :value="total_periododebe" type="text" disabled class=" w-24 bg-white text-sm p-2 rounded-xl border border-gray-200  placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="">
                    <input :value="total_periodohaber"  type="text" disabled class=" w-24 bg-white text-sm p-2 rounded-xl border border-gray-200  placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="">
                </div>
                <div class="flex flex-row justify-end items-center px-5 space-x-2 space-y-2">
                    <label class="text-slate-900 text-sm font-Nunito">Saldo a la Fecha:</label>
                    <input :value="saldo_fecha" type="text" disabled class=" w-24 mr-26 bg-white text-sm p-2 rounded-xl border border-gray-200  placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="">
                    
                </div>
                </div>
                
            </div>
        </div>
             
    </div>
    
</div>
<!-- modal para mostrar consultar fechas-->
<transition enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95">
    <div v-if="mostrarConsultarLibroMayor" class="fixed inset-0 flex items-center justify-around z-50">
    <div class="bg-gray-50 bg-opacity-80 text-white  ml-56 w-xl p-6 rounded-lg shadow-2xl flex flex-col space-x-2">
        <p class=" text-slate-900 font-Nunito text-md font-bold mb-5 mx-auto">CONSULTAR LIBRO MAYOR</p>
        <div class="flex flex-col">
            <div class="flex flex-col">
                <form  @submit.prevent="getlibroMayorFechas">
                <div class=" flex flex-row items-center my-8 space-x-2">
                        <button type="button" @click="mostrarCuentas" class=" bg-blue-950 w-28 text-sm rounded-lg p-2 cursor-pointer">Seleccionar</button>
                        <div class=" flex flex-row space-x-2 items-center">
                            <label class="text-sm font-Nunito text-slate-950">Cuenta</label>
                            <input v-show="false" v-model="cod_nombreCuenta" type="text" class=" w-72 text-slate-950 bg-white text-sm p-1.5 rounded-xl border border-gray-200  placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="cuenta">
                            <input v-model="nombre_cuenta" type="text" class=" w-72 text-slate-950 bg-white text-sm p-1.5 rounded-xl border border-gray-200  placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="cuenta">
                        </div>
                </div>        
                <div class=" flex flex-row space-x-4 mb-5">
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
                
                <div class=" flex flex-row space-x-4 justify-center">
                    <button type="submit"  class=" bg-blue-950 w-50  text-sm rounded-lg p-2 cursor-pointer">Aceptar</button>
                    <button type="button" @click="cerrarModalCuenta" class=" bg-red-800 w-50 text-sm rounded-lg p-2 cursor-pointer">Cancelar</button>
                    
                </div>
                </form>
            </div>
        </div>
    </div>
 </div>
</transition>

<!-- modal para editar libro diario-->    
<transition enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95">
    <div class="fixed inset-0 flex items-center justify-around ml-40 z-50" v-if="mostrarEditLibroDiario">
        <form @submit.prevent="envioEditLibro">
        <div class=" bg-gray-100 w-5xl 2xl:w-6xl h-2/4 2xl:h-2/3 rounded-lg p-8 ">
        <div class=" flex flex-row space-x-5">
            <p class=" font-Nunito text-lg text-slate-900 font-semibold"> Comprobante Diario</p>
            <div class=" flex flex-row space-x-5">
                <button class=" p-1.5 bg-gray-300 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="#0e0e0e" d="M4.5 2.25a.75.75 0 0 1 .75.75v18a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75m12.907 1.464c1.146-.917 2.843-.1 2.843 1.367v13.838c0 1.468-1.697 2.284-2.843 1.367l-8.65-6.92a1.75 1.75 0 0 1 0-2.732z" stroke-width="0.5" stroke="#0e0e0e"/></svg></button>
                <button class=" p-1.5 bg-gray-300 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="#0e0e0e" d="M20.095 21a.75.75 0 0 1-.75-.75V3.75a.75.75 0 0 1 1.5 0v16.5a.74.74 0 0 1-.75.75m-3.4-9.589a2.25 2.25 0 0 1-.85 1.82l-9.11 7.09c-.326.247-.713.4-1.12.44h-.23a2.14 2.14 0 0 1-1-.22a2.2 2.2 0 0 1-.9-.81a2.17 2.17 0 0 1-.33-1.16V5.421a2.2 2.2 0 0 1 .31-1.12a2.25 2.25 0 0 1 .85-.8a2.18 2.18 0 0 1 2.24.1l9.12 6.08c.29.191.53.448.7.75a2.3 2.3 0 0 1 .32.98" stroke-width="0.5" stroke="#0e0e0e"/></svg></button>
            </div>
        </div>
        <div class=" grid grid-cols-2 space-x-2 ">
            <div class=" grid grid-cols-2 mt-5 gap-x-2">
            <div class=" flex flex-col">
                <label class=" block font-Nunito text-xs 2xl:text-sm text-slate-700">Comprobante Nro</label>
                <input v-model="datosEdit.nro_comprobanteEdit"  type="text" class=" bg-white text-sm p-1.5 rounded-xl border border-gray-200  placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="ingrese nro comprobante">
            </div>
            <div class=" flex flex-col">
                <label class=" block font-Nunito text-xs 2xl:text-sm text-slate-700">Tipo de comprobante</label>
                <input v-model="datosEdit.tipo_comprobanteEdit" type="text" class=" bg-white p-2 rounded-xl border text-sm border-gray-200  placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="tipo comprobante">            
            </div>
        </div>
        <div class=" flex flex-row space-x-2 items-center mt-5">
            <div class=" flex flex-col">
                <label class="text-xs 2xl:text-sm font-Nunito text-slate-800 ">Fecha</label>
                <div class="flex flex-row relative">
                            <flat-pickr
                            v-model="datosEdit.fecha_comprobanteEdit"
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
                <input v-model="datosEdit.dolarEdit" type="text" class=" bg-white w-28 text-sm p-2 rounded-xl border border-gray-200  placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="$us">            
            </div>
            <div class=" flex flex-col">
                <label class=" block font-Nunito text-xs 2xltext-sm text-slate-700">T.C Ufv</label>
                <input v-model="datosEdit.ufvEdit" type="text" class=" bg-white w-28 text-sm p-2 rounded-xl border border-gray-200  placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="UFV">            
            </div>
        </div>
        </div>
        <div class="grid grid-cols-3 space-x-4">
            <div class=" flex flex-col">
                <label class=" block font-Nunito text-xs 2xl:text-sm text-slate-700">Razon social/propietario</label>
                <input v-model="datosEdit.razon_social" type="text" class=" bg-white p-2 rounded-xl border text-sm border-gray-200  placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="razon social">            
            </div>
            <div class=" flex flex-col">
                <label class=" block font-Nunito text-xs 2xl:text-sm text-slate-700">Glosa</label>
                <input v-model="datosEdit.glosaEdit" type="text" class=" bg-white p-2 rounded-xl border text-sm border-gray-200  placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="ingrese glosa">            
            </div>
            <div class=" flex flex-col">
                <label class=" block font-Nunito text-xs 2xl:text-sm text-slate-700">Metodo de Pago</label>
                <input v-model="datosEdit.metodo_pagoEdit" type="text" class=" bg-white p-2 rounded-xl border text-sm border-gray-200  placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="metodo pago">            
            </div>
        </div>
        <!-- tabla debe haber-->
        <div class=" w-4xl 2xl:w-5xl h-60 2xl:h-70 mx-auto mb-2 mt-5 bg-gray-300 overflow-y-auto border-2 border-slate-900 ag-theme-alpine">
            <AgGridVue ref="agGrid"
                class="w-full h-full font-Nunito ag-theme-quartz"
                theme="legacy"   
                :columnDefs="columnDefs"
                :rowData="rowData"
                :defaultColDef="defaultColDef"
                :stopEditingWhenCellsLoseFocus="true"
                
                
            />
        </div>
        <div class=" flex flex-row items-center space-x-4 mr-8 justify-end">
            <label for="" class=" font-Nunito text-sm 2xl:text-md font-semibold ">Totales:</label>
            <input  type="text" disabled v-model="datosEdit.total_debe" class=" bg-white text-sm  rounded-xl border border-gray-300 p-1.5 placeholder:text-sm placeholder:text-slate-900 focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 text-slate-900  " placeholder="">
            <input   type="text" disabled v-model="datosEdit.total_haber" class=" bg-white text-sm rounded-xl border border-gray-300 p-1.5 placeholder:text-sm placeholder:text-slate-900 focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 text-slate-900  " placeholder="">
            
        </div>
        <div class="flex flex-row space-x-4 mt-8">
            <button v-show="false" class="bg-blue-950 p-1.5 w-50 text-white font-Nunito cursor-pointer rounded-lg text-sm flex flex-row space-x-4 justify-center items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="#568cf1" fill-rule="evenodd" clip-rule="evenodd"><path d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352z"/><path d="M19.846 4.318a2.2 2.2 0 0 0-.437-.692a2 2 0 0 0-.654-.463a1.92 1.92 0 0 0-1.544 0a2 2 0 0 0-.654.463l-.546.578l2.852 3.02l.546-.579a2.1 2.1 0 0 0 .437-.692a2.24 2.24 0 0 0 0-1.635M17.45 8.721L14.597 5.7L9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.5.5 0 0 0 .255-.145l4.778-5.06Z"/></g></svg>Modificar</button>
            <button @click="imprimirReporte('preview')" class="bg-blue-950 p-1.5 w-55 text-white font-Nunito cursor-pointer rounded-lg text-sm flex flex-row space-x-4 justify-center items-center"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="#568cf1" d="M16 16a1 1 0 0 1 .993.883L17 17v4a1 1 0 0 1-.883.993L16 22H8a1 1 0 0 1-.993-.883L7 21v-4a1 1 0 0 1 .883-.993L8 16zm3-9a3 3 0 0 1 3 3v7a2 2 0 0 1-2 2h-1v-3a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3H4a2 2 0 0 1-2-2v-7a3 3 0 0 1 3-3zm-2 2h-2a1 1 0 0 0-.117 1.993L15 11h2a1 1 0 0 0 .117-1.993zm0-7a1 1 0 0 1 1 1v2H6V3a1 1 0 0 1 1-1z"/></g></svg>Imprimir Comprobante</button>
            <button v-if="false" class="bg-blue-950 p-1.5 w-55 text-white font-Nunito cursor-pointer rounded-lg text-sm flex flex-row space-x-4 justify-center items-center"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="#568cf1" d="M16 16a1 1 0 0 1 .993.883L17 17v4a1 1 0 0 1-.883.993L16 22H8a1 1 0 0 1-.993-.883L7 21v-4a1 1 0 0 1 .883-.993L8 16zm3-9a3 3 0 0 1 3 3v7a2 2 0 0 1-2 2h-1v-3a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3H4a2 2 0 0 1-2-2v-7a3 3 0 0 1 3-3zm-2 2h-2a1 1 0 0 0-.117 1.993L15 11h2a1 1 0 0 0 .117-1.993zm0-7a1 1 0 0 1 1 1v2H6V3a1 1 0 0 1 1-1z"/></g></svg>Imprimir Libro Diario</button>
            <button @click="cerrarModalEdit" class="bg-blue-950 p-1.5 w-50 text-white font-Nunito cursor-pointer rounded-lg text-sm flex flex-row space-x-4 justify-center items-center"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="#568cf1" d="m12 13.4l2.9 2.9q.275.275.7.275t.7-.275t.275-.7t-.275-.7L13.4 12l2.9-2.9q.275-.275.275-.7t-.275-.7t-.7-.275t-.7.275L12 10.6L9.1 7.7q-.275-.275-.7-.275t-.7.275t-.275.7t.275.7l2.9 2.9l-2.9 2.9q-.275.275-.275.7t.275.7t.7.275t.7-.275zm0 8.6q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"/></svg>Cancelar</button>
        </div>
        <!--<div class=" flex flex-row space-x-4 mt-5">
                <button type="submit" :disabled="diferencia>0" :class="diferencia>0 ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-50' :'bg-blue-800 text-white hover:bg-blue-800'" class=" flex flex-row items-center justify-center w-xs bg-blue-950 rounded-lg p-2 font-Nunito text-white text-xs cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20"><path fill="#fff" d="M7.707 10.293a1 1 0 1 0-1.414 1.414l3 3a1 1 0 0 0 1.414 0l3-3a1 1 0 0 0-1.414-1.414L11 11.586V6h5a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5v5.586zM9 4a1 1 0 0 1 2 0v2H9z"/></svg>{{diferencia>0 ? 'Diferencia pendiente' : 'Registrar Comprobante'}}</button>
                <button type="button" @click="cerrarViewEdit" class=" flex flex-row justify-center items-center w-xs bg-blue-950 rounded-lg p-2 font-Nunito cursor-pointer text-white text-xs"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="#fff" d="m8.4 17l3.6-3.6l3.6 3.6l1.4-1.4l-3.6-3.6L17 8.4L15.6 7L12 10.6L8.4 7L7 8.4l3.6 3.6L7 15.6zm3.6 5q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"/></svg>Cancelar</button>
        </div>-->
        </div>
    
    </form>
    </div>
               
</transition>

<!-- modal de cuenta de nivel 5-->
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


<!-- comprobante PDF-->
<generarPDF 
    ref="pdfHijo" 
    :dataComprobante="rowData" 
    :titulo="datosEdit.tipo_comprobanteEdit" 
    :datosExtra="datosEdit"
    :convertirMontoALetras="convertirMontoALetras"
    :nombreEmpresa="nombreEmpresa"
/>

<!-- seccion saldos continuos-->
 <div v-if="mostrarSaldosContinuos" class=" flex flex-col ml-45">
    <div class="flex flex-row space-x-5">
        <p class=" text-slate-900 text-sm font-Nunito">Del {{ fechadata1[2] }} de {{fechadata1[1]}} de {{ fechadata1[0] }} al {{fechadata2[2]}} de {{fechadata2[1]}} de {{fechadata2[0]}}</p>
    </div>
    <div class=" bg-gray-100 w-7xl  2xl:w-7xl 2xl:h-10/12 mb-5 rounded-lg p-8 ">
        <div class=" flex flex-row items-center space-x-4">
            <p class=" text-slate-900 text-sm font-Nunito">Buscar por NRO. comprobante</p>
            <input  type="text" class=" bg-white text-sm p-2 rounded-xl border border-gray-200  placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="nro comprobante">
            <button class=" bg-blue-950 p-1.5 rounded-lg text-white flex flex-row items-center cursor-pointer text-sm font-Nunito"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><g fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="62" d="M13.5 3l5.5 5.5v11.5c0 0.55 -0.45 1 -1 1h-12c-0.55 0 -1 -0.45 -1 -1v-16c0 -0.55 0.45 -1 1 -1Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="62;0"/></path><path stroke-dasharray="34" stroke-dashoffset="34" d="M14.83 15.83c-1.56 1.56 -4.1 1.56 -5.66 0c-1.56 -1.56 -1.56 -4.1 0 -5.66c1.56 -1.56 4.1 -1.56 5.66 0c1.56 1.56 1.56 4.1 0 5.66l4.67 4.67"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.4s" to="0"/></path></g></svg>Buscar</button>
            <button class=" bg-blue-950 p-1.5 w-48 text-white text-sm font-Nunito rounded-lg cursor-pointer">Seleccionar cuenta</button>
            
        </div>
        
        <div class=" grid grid-cols-2 w-4xl gap-x-4 mt-8">
            <div class="flex flex-col">
                <label class=" text-sm font-Nunito text-slate-900" >Cuenta</label>
                <input  type="text" class=" bg-white text-sm p-2 rounded-xl border border-gray-200  placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder=" nro cuenta">    
            </div>
            <div class="flex flex-col">
                <label class=" text-sm font-Nunito text-slate-900" >Nombre de Cuenta</label>
                <input  type="text" class=" bg-white text-sm p-2 rounded-xl border border-gray-200  placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="nombre cuenta">    
            </div>
        </div>
        <!-- tabla lista libro mayor-->
        <div class="flex flex-col bg-gray-100 border border-gray-200 w-6xl mt-5  p-2 rounded-lg">
            <div class="flex flex-row px-4">
                <button @click="getlibroMayorFechas" class=" p-1.5 text-sm text-white bg-blue-950 rounded-lg font-Nunito cursor-pointer">Mayor</button>
                <button  class=" p-1.5 text-sm text-white bg-blue-950 rounded-lg font-Nunito cursor-pointer">Saldos Continuos</button>
                <button @click="SaldosMensuales" class=" p-1.5 text-sm text-white bg-blue-950 rounded-lg font-Nunito cursor-pointer">Saldos Mensuales</button>
            </div>
            <div class="flex-1 mt-5  overflow-y-auto px-2 max-h-96">
            <table class="w-full text-sm  text-left text-gray-500">
                <!-- Encabezado Dinámico -->
                <thead class="text-xs font-Nunito text-gray-700 uppercase bg-gray-50 sticky top-0">
                <tr>
                    <th v-for="header in headresSaldo" :key="header" class="px-4 py-3">
                    {{ header }}
                    </th>
                </tr>
                </thead>

                <!-- Cuerpo de la Tabla -->
                <tbody>
                <tr v-if="!datosSaldosContinuos.length" class=" flex  justify-center text-gray-500 mt-8 mx-auto h-52">
                    <td class=" text-sm font-Nunito ">No se encontraron Datos</td>
                </tr>
                <tr v-for="(prod, index) in datosSaldosContinuos" :key="index" class="bg-white  hover:bg-gray-200">
                    <td v-show="false" class="px-4 py-2  whitespace-nowrap cursor-pointer">
                    {{ prod.cod_comprobante }}
                    </td>
                    <td class="px-4 py-2  whitespace-nowrap cursor-pointer">
                    {{ prod.fecha_comprobante }}
                    </td>
                    <td class="px-4 py-2 cursor-pointer">
                    {{ prod.nro_comprobante }}
                    </td>
                    <td class="px-4 py-2 text-left cursor-pointer">
                    {{ prod.razon_social }}
                    </td>
                    <td class="px-4 py-2 text-left cursor-pointer">
                    {{ prod.glosa }}
                    </td>
                    <td class="px-4 py-2 text-left cursor-pointer">
                    {{ prod.referencia }}
                    </td>
                    <td class="px-4 py-2 text-left cursor-pointer">
                    {{ prod.dolar }}
                    </td>
                    <td class="px-4 py-2 text-left cursor-pointer">
                    {{ prod.debe }}
                    </td>
                    <td class="px-4 py-2 text-left cursor-pointer">
                    {{ prod.haber }}
                    </td>
                    <td class="px-4 py-2 text-right font-semibold text-blue-900">
                    {{ prod.asientos[prod.asientos.length - 1].saldo }}
                    </td>
                    <td class="px-4 py-2 text-left cursor-pointer">
                        <button @click="mostrarEdit(prod)" class=" flex flex-row items-center justify-center w-35 h-10 cursor-pointer bg-blue-950 text-white font-Nunito p-1.5 text-xs rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><circle cx="16" cy="16" r="4" fill="#fff"/><path fill="#fff" d="M30.94 15.66A16.69 16.69 0 0 0 16 5A16.69 16.69 0 0 0 1.06 15.66a1 1 0 0 0 0 .68A16.69 16.69 0 0 0 16 27a16.69 16.69 0 0 0 14.94-10.66a1 1 0 0 0 0-.68M16 22.5a6.5 6.5 0 1 1 6.5-6.5a6.51 6.51 0 0 1-6.5 6.5"/></svg>Mostrar Asiento</button>
                    </td>
                    
                </tr>
                </tbody>
            </table>
            </div>
            <div class="grid grid-cols-1 w-full mt-5">
                
                <div class="flex flex-row space-x-15 items-center justify-end-safe mr-35 ">
                    <p class=" font-Nunito text-md ">Totales</p>
                    <div class="flex flex-row">
                        <input v-model="total_debeSaldo"  type="text" disabled class=" w-24 bg-white text-sm p-2 rounded-xl border border-gray-200  placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="">
                        <input v-model="total_haberSaldo" type="text" disabled class=" w-24 bg-white text-sm p-2 rounded-xl border border-gray-200  placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="">
                        <input v-model="total_Saldo"  type="text" disabled class=" w-24 bg-white text-sm p-2 rounded-xl border border-gray-200  placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="">
                    </div>
                </div>
                
            </div>
        </div>
             
    </div>
    
</div>
<div v-if="mostrarSaldosMensuales" class=" flex flex-col ml-45">
    <div class="flex flex-row space-x-5">
        <p class=" text-slate-900 text-sm font-Nunito">Del {{ fechadata1[2] }} de {{fechadata1[1]}} de {{ fechadata1[0] }} al {{fechadata2[2]}} de {{fechadata2[1]}} de {{fechadata2[0]}}</p>
    </div>
    <div class=" bg-gray-100 w-6xl  2xl:w-7xl 2xl:h-10/12 mb-5 rounded-lg p-8 ">
        <div class=" flex flex-row items-center space-x-4">
            <p class=" text-slate-900 text-sm font-Nunito">Buscar por NRO. comprobante</p>
            <input  type="text" class=" bg-white text-sm p-2 rounded-xl border border-gray-200  placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="nro comprobante">
            <button class=" bg-blue-950 p-1.5 rounded-lg text-white flex flex-row items-center cursor-pointer text-sm font-Nunito"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><g fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="62" d="M13.5 3l5.5 5.5v11.5c0 0.55 -0.45 1 -1 1h-12c-0.55 0 -1 -0.45 -1 -1v-16c0 -0.55 0.45 -1 1 -1Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="62;0"/></path><path stroke-dasharray="34" stroke-dashoffset="34" d="M14.83 15.83c-1.56 1.56 -4.1 1.56 -5.66 0c-1.56 -1.56 -1.56 -4.1 0 -5.66c1.56 -1.56 4.1 -1.56 5.66 0c1.56 1.56 1.56 4.1 0 5.66l4.67 4.67"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.4s" to="0"/></path></g></svg>Buscar</button>
            <button class=" bg-blue-950 p-1.5 w-48 text-white text-sm font-Nunito rounded-lg cursor-pointer">Seleccionar cuenta</button>
            
        </div>
        
        <div class=" grid grid-cols-2 w-4xl gap-x-4 mt-8">
            <div class="flex flex-col">
                <label class=" text-sm font-Nunito text-slate-900" >Cuenta</label>
                <input  type="text" class=" bg-white text-sm p-2 rounded-xl border border-gray-200  placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder=" nro cuenta">    
            </div>
            <div class="flex flex-col">
                <label class=" text-sm font-Nunito text-slate-900" >Nombre de Cuenta</label>
                <input  type="text" class=" bg-white text-sm p-2 rounded-xl border border-gray-200  placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="nombre cuenta">    
            </div>
        </div>
        <!-- tabla lista libro mayor-->
        <div class="flex flex-col bg-gray-100 border border-gray-200 w-5xl mt-5  p-2 rounded-lg">
            <div class="flex flex-row px-4">
                <button @click="getlibroMayorFechas" class=" p-1.5 text-sm text-white bg-blue-950 rounded-lg font-Nunito cursor-pointer">Mayor</button>
                <button @click="mostrarSaldo" class=" p-1.5 text-sm text-white bg-blue-950 rounded-lg font-Nunito cursor-pointer">Saldos Continuos</button>
                <button class=" p-1.5 text-sm text-white bg-blue-950 rounded-lg font-Nunito cursor-pointer">Saldos Mensuales</button>
            </div>
            <div class="flex-1 mt-5  overflow-y-auto px-2 max-h-96">
            <table class="w-full text-sm  text-left text-gray-500">
                <!-- Encabezado Dinámico -->
                <thead class="text-xs font-Nunito text-gray-700 uppercase bg-gray-50 sticky top-0">
                <tr>
                    <th v-for="header in headersMensual" :key="header" class="px-4 py-3">
                    {{ header }}
                    </th>
                </tr>
                </thead>

                <!-- Cuerpo de la Tabla -->
                <tbody>
                <tr v-if="!gastosMensuales.length" class=" flex  justify-center text-gray-500 mt-8 mx-auto h-52">
                    <td class=" text-sm font-Nunito ">No se encontraron Datos</td>
                </tr>
                <tr v-for="(prod, index) in gastosMensuales" :key="index" class="bg-white  hover:bg-gray-200">
                    <td  class="px-4 py-2  whitespace-nowrap cursor-pointer">
                    {{ prod.nombre_mes }}
                    </td>
                    <td class="px-4 py-2  whitespace-nowrap cursor-pointer">
                    {{ prod.total_debe_mes }}
                    </td>
                    <td class="px-4 py-2 cursor-pointer">
                    {{ prod.total_haber_mes }}
                    </td>
                    <td class="px-4 py-2 text-left cursor-pointer">
                    {{ prod.saldo_al_cierre }}
                    </td>
                    
                </tr>
                </tbody>
            </table>
            </div>
            
        </div>
             
    </div>
</div>
</sidebar>

</template>