<script>
import Sidebar from '@/assets/layout/sidebar.vue';
import NestedList from '@/components/NestedList.vue';
import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';
import axios from 'axios';
import api from '@/services/api.js';
import Swal from 'sweetalert2';

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

components:{
    Sidebar,
    NestedList
},
data() {
    return {
      menu:[{id:1,title:'1.Activo',children:
                [ 
                    {id:1,title:'1.1 Activo corriente',children:[
                        {id:1,title:'1.1.1 Efectivo y equivalentes de efectivo',children:[
                            {id:1,title:'1.1.1-001 CAJA'},
                            {id:2,title:'1.1.1-002 BANCOS'},
                            {id:3,title:'1.1.1-003 INVERSIONES AL VALOR RAZONABLE'},
                            {id:4,title:'1.1.1-004 INVERSIONES DISPONIBLES PARA LA VENTA'},
                            {id:5,title:'1.1.1-005 INVERSIONES EN CRIPTOACTIVOS '}]},
                        {id:2,title:'1.1.2 Exigible de corto plazo',children:[
                            {id:1,title:'1.1.2-001 CUENTAS POR COBRAR'}
                        ]}    
                    ]}
                ]},
                {id:2,title:'2.Pasivo'},
                {id:3,title:'3.Patrimonio'},
                {id:4,title:'4.Ingresos'},
                {id:5,title:'5.Egresos'}
            ],
            dataCuenta:[],
            mostrarModal:false,
            nivelCuenta:[],
            tipoCuenta:[],
            selectedCuenta:'',
            selectedNivel:'',
            nombre_cuenta:'',
            puct:'',
            itemSeleccionado:null,
            cuenta_mayor:'',
            key:'abencoadoGroup',
            mostrarModalmodificar:false,
            headers:['Razon social/Propietario','Tipo empresa','Fecha inscripcion','Nit','Actividad Principal','Info Empresa/plan cuenta'],
            empresa:[],
            mostrarPlancuenta:false,
            mostrarSelectTipo:true,
            datosUpdate:{
                nombre_cuenta:'',
                cod_nombreCuenta:null,
                puct:'',
                cod_tpcuenta:null,
                cod_nivelCuenta:null
            },
            mostrarModalPuct:false,
            archivoSeleccionado:null,
            cargando:false,

    }
  },
mounted(){
this.getNivelCuenta();
this.getTipoCuenta();
this.getAllEmpresas();
this.getnombreCuenta(); 
}, 
methods: {
    cerrarModal(){
            this.nombre_cuenta='';
            this.puct='';
            this.selectedNivel='';
            this.selectedCuenta='';
            this.itemSeleccionado=null;
            this.mostrarModal=false;    
    },
    cerrarModalmodificar(){
            this.datosUpdate.cod_nombreCuenta=null;
            this.datosUpdate.nombre_cuenta='';
            this.datosUpdate.puct='';
            this.selectedNivel='';
            this.cod_tpcuenta=null;
            this.cod_nivelCuenta=null
            this.itemSeleccionado=null;
            this.mostrarModalmodificar=false;    
    },
    Modalmodificar(){
        
        if (this.itemSeleccionado===null || this.itemSeleccionado.cod_nivelCuenta===4) {
            Swal.fire({
                icon:'warning',
                title:'Abencoado Group',
                text:'seleccione una cuenta de nivel 5'
            });
            this.mostrarModalmodificar=false;
        }else{
            this.mostrarModalmodificar=true
        }
    },
    modalview(){
        
        this.cuenta_mayor = this.itemSeleccionado === null ? 0 : this.itemSeleccionado.nombre_cuenta;
        // para cuenta tipo nivel 1
        if (this.itemSeleccionado===null) {
            //this.puct=`${this.dataCuenta.length+1}`;
            //this.selectedNivel='1';
            Swal.fire({
                icon:'warning',
                title:'Abencoado Group',
                text:'seleccione una cuenta de nivel 4 para crear una nueva cuenta'
            })

        }else if(this.itemSeleccionado.cod_nivelCuenta===1){ // para cuenta tipo nivel 2
            
            this.mostrarSelectTipo=false;
            this.selectedNivel='2';
            this.selectedCuenta= this.itemSeleccionado.cod_tpcuenta===1 ? 'ACTIVO' : this.itemSeleccionado.cod_tpcuenta===2 ? 'PASIVO' : this.itemSeleccionado.cod_tpcuenta===3 ? 'CAPITAL' : this.itemSeleccionado.cod_tpcuenta===4 ? 'INGRESO' : 'GASTO';
            const filterPuct = this.itemSeleccionado.children.length===0 ? []: this.itemSeleccionado;
            if (filterPuct.length===0) {
                this.puct=`${this.itemSeleccionado.puct}${filterPuct.length+1}`
            }else{
                this.puct=`${this.itemSeleccionado.puct}${filterPuct.children.length+1}`
            }
        } else if(this.itemSeleccionado.cod_nivelCuenta===2){ // para cuenta tipo nivel 3
            
            this.mostrarSelectTipo=false;
            this.selectedNivel='3';
            this.selectedCuenta= this.itemSeleccionado.cod_tpcuenta===1 ? 'ACTIVO' : this.itemSeleccionado.cod_tpcuenta===2 ? 'PASIVO' : this.itemSeleccionado.cod_tpcuenta===3 ? 'CAPITAL' : this.itemSeleccionado.cod_tpcuenta===4 ? 'INGRESO' : 'GASTO';
            const filterPuct = this.itemSeleccionado.children.length===0 ? []: this.itemSeleccionado;
            if (filterPuct.length===0) {
                this.puct=`${this.itemSeleccionado.puct}${filterPuct.length+1}`
            }else{
                this.puct=`${this.itemSeleccionado.puct}${filterPuct.children.length+1}`
            }
        }else if(this.itemSeleccionado.cod_nivelCuenta===3){ // para cuenta tipo nivel 4
            this.mostrarModal=true;
            this.mostrarSelectTipo=false;
            this.selectedNivel='4';
            this.selectedCuenta= this.itemSeleccionado.cod_tpcuenta===1 ? 'ACTIVO' : this.itemSeleccionado.cod_tpcuenta===2 ? 'PASIVO' : this.itemSeleccionado.cod_tpcuenta===3 ? 'CAPITAL' : this.itemSeleccionado.cod_tpcuenta===4 ? 'INGRESO' : 'GASTO';
            const filterPuct = this.itemSeleccionado.children.length=== 0 ? [] : this.itemSeleccionado.children;
            if (filterPuct.length===0) {
                this.puct=`${this.itemSeleccionado.puct}00${this.itemSeleccionado.children.length+1}`
            }else{
                this.puct=`${this.itemSeleccionado.puct}${this.itemSeleccionado.children.length > 9 ? '0' + (this.itemSeleccionado.children.length + 1) : '00' + (this.itemSeleccionado.children.length + 1)}`
            }
        }else if(this.itemSeleccionado.cod_nivelCuenta===4){
            this.mostrarModal=true;
            this.mostrarSelectTipo=false;
            this.selectedNivel='5';
            this.selectedCuenta= this.itemSeleccionado.cod_tpcuenta===1 ? 'ACTIVO' : this.itemSeleccionado.cod_tpcuenta===2 ? 'PASIVO' : this.itemSeleccionado.cod_tpcuenta===3 ? 'CAPITAL' : this.itemSeleccionado.cod_tpcuenta===4 ? 'INGRESO' : 'GASTO';
            const filterPuct = this.itemSeleccionado.children.length=== 0 ? [] : this.itemSeleccionado.children;
            if (filterPuct.length===0) {
                this.puct=`${this.itemSeleccionado.puct}00${this.itemSeleccionado.children.length+1}`
            }else{
                this.puct=`${this.itemSeleccionado.puct}${this.itemSeleccionado.children.length > 9 ? '0' + (this.itemSeleccionado.children.length + 1) : '00' + (this.itemSeleccionado.children.length + 1)}`
            }

        }else if(this.itemSeleccionado.cod_nivelCuenta===5){
            Toast.fire({
                icon:'warning',
                text:'Solo se puede crear apartir de nivel 5'
            })
            this.mostrarModal=false;
        }
        
    },
    capturarItem(item){
        console.log(item)
        if (item.cod_nivelCuenta===1 || item.cod_nivelCuenta ===2 ) {
            Toast.fire({
                icon:'warning',
                text:'Solo seleccionar de nivel 4 para crear o 5 para modificar'
            })
        }else{
            this.itemSeleccionado=item;
            this.datosUpdate.nombre_cuenta=item.nombre_cuenta;
            this.datosUpdate.cod_nombreCuenta=item.cod_nombreCuenta;
            this.datosUpdate.cod_tpcuenta=item.cod_tpcuenta;
            this.datosUpdate.puct=item.puct;
            this.datosUpdate.cod_nivelCuenta=item.cod_nivelCuenta;
            
        }
    },
    async envioForm(){
        
        const decryptEmpresa= CryptoJS.AES.decrypt(Cookies.get('emp'),this.key).toString(CryptoJS.enc.Utf8); 
        
        const tipo_cuenta= this.selectedNivel==='1' ? this.selectedCuenta : this.selectedCuenta==='ACTIVO' ? 1 : this.selectedCuenta==='PASIVO' ? 2 : this.selectedCuenta==='CAPITAL' ? 3 : this.selectedCuenta==='INGRESO' ? 4 : 5;
        
        try {
            const responseRegistroNombreCuenta = await api.post('/addCuenta',{
                nombre_cuenta:this.nombre_cuenta,
                puct:this.puct,
                cod_nivelCuenta:parseInt(this.selectedNivel),
                cod_tpcuenta:tipo_cuenta,
                cod_empresa:parseInt(decryptEmpresa)
                
            })

            if (responseRegistroNombreCuenta.data.estado==='error') {
                Swal.fire({
                    icon:'error',
                    title:'Abencoado Group',
                    text:'problemas al registar intentelo mas tarde !'
                })
            
            }
            Swal.fire({
                icon:'success',
                title:'Abencoado Group',
                text:'registro exitoso!!'
            })
            this.nombre_cuenta='';
            this.puct='';
            this.selectedNivel='';
            this.selectedCuenta='';
            this.itemSeleccionado=null;
            this.mostrarModal=false;
            this.cuenta_mayor=''
            this.getnombreCuenta();    
        } catch (error) {
            Swal.fire({
                icon:'error',
                title:'Abencoado Group',
                text:'pronblemas con el servidor intentelo mas tarde!!'
            })
        }
    },
    async envioEditar(){
        const decryptEmpresa= CryptoJS.AES.decrypt(Cookies.get('emp'),this.key).toString(CryptoJS.enc.Utf8); 
        const datos={
            nombre_cuenta:this.datosUpdate.nombre_cuenta,
            cod_empresa:parseInt(decryptEmpresa),
            cod_nombreCuenta:parseInt(this.datosUpdate.cod_nombreCuenta)
        }
        try {
            const responseUpdateCuenta= await api.patch('/updateCuenta',datos)
            if (responseUpdateCuenta.data.status==='vacio') {
                Toast.fire({
                    icon:'warning',
                    text:'No se encontraron registros para modificar verifique de nuevo'
                })
            }else if(responseUpdateCuenta.data.status==='ok'){
                Toast.fire({
                    icon:'success',
                    text:'Cuenta modificada con exito!'
                })
                this.cerrarModalmodificar();
                this.getnombreCuenta();
                
            }
        } catch (error) {
            
            Toast.fire({
                icon:'error',
                text:'error en el servidor intentelo mas tarde'
            })
        }
    },
    async getNivelCuenta(){
        try {
            const responseNivelCuenta = await api.get('/getNivelcuenta')
            if (responseNivelCuenta.data.estado==='error') {
                this.nivelCuenta=[]
            }
            this.nivelCuenta=responseNivelCuenta.data.rows;
            
            
            
        } catch (error) {
            console.log('problemas al traer datos: ');
        }
    },
    async getTipoCuenta(){
        try {
            const responseTipoCuenta = await api.get('/gettipocuenta')
            if (responseTipoCuenta.data.estado==='error') {
                this.tipoCuenta=[]
            }
            this.tipoCuenta=responseTipoCuenta.data.rows;
        } catch (error) {
            console.log('problemas al traer datos');
        }
    },
    async getnombreCuenta(){ 
        const decryptEmpresa= CryptoJS.AES.decrypt(Cookies.get('emp'),this.key);
        const empresa= decryptEmpresa.toString(CryptoJS.enc.Utf8);
        try {
            const responsenombreCuenta= await api.get(`/getnombreCuenta/${parseInt(empresa || 0)}`)
            if (responsenombreCuenta.data.estado==='vacio') {
                Swal.fire({
                    icon:'warning',
                    title:'Abencoado Group',
                    text:'No se encontraron datos'
                })
                return this.dataCuenta=[]; 
            } 
             
            //----///
            
            
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
    async getAllEmpresas(){
        try {
            const responseEmpresas= await api.get('/getAllEmpresas');
            if (responseEmpresas.data.status==='vacio') {
                return this.empresa=[]
            }
            this.empresa=responseEmpresas.data.rows
        } catch (error) {
            console.log(error)
        }
    },
    async planCuenta(item){
        const {cod_empresa} = item;
        
        try {
            const responseEmpresaCuenta= await api.get(`/getNombrecuenta/${cod_empresa}`)
            console.log(responseEmpresaCuenta)
            if (responseEmpresaCuenta.data.estado==='vacio') {
                return this.dataCuenta=[];
            } else if(responseEmpresaCuenta.data.estado==='ok'){ 
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
            this.dataCuenta=organizarPorNivel(responseEmpresaCuenta.data.rows) 
            console.log(this.dataCuenta)
            this.mostrarPlancuenta=true; 
            //---///// 
            console.log(this.dataCuenta);
            }
            
        } catch (error) {
            console.log(error)
        }
    },
    abrirModalRegistro(item) { 
            console.log(item)
            if (item.cod_nivelCuenta!==4 || item.cod_nivelCuenta!==3) { 
                Toast.fire({
                    icon:'warning',
                    text:'solo se puede crear apartir de nivel 5'
                })
            {
                
            }    
            }else if(item.cod_nivelCuenta===3){
                
                this.selectedCuenta=item;
                this.mostrarModalNuevo=true;
                this.cuenta_mayor=item.nombre_cuenta;
                this.datosEdit.selectedCuenta= item.cod_tpcuenta===1 ? 'ACTIVO' : item.cod_tpcuenta===2 ? 'PASIVO' : item.cod_tpcuenta===3 ? 'CAPITAL' : item.cod_tpcuenta===4 ? 'INGRESO' : 'GASTO';
                this.datosEdit.selectedNivel=parseInt(item.cod_nivelCuenta)+1;
                if (item.children.length===0) {
                    this.datosEdit.puct=`${item.puct}1` 
                }else if(item.children.length>0){
                    const calcularpuct=item.children.length>9 ? `${item.chidren.length+1}` : item.children.length>99 ? `${item-children.length+1}`: `${item.children.length+1}`;
                    this.datosEdit.puct=`${item.puct}${calcularpuct}`
                }
                
                this.mostrarModal=true;
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
    mostrarEjemploPuct(){
        this.mostrarModalPuct=true;
    },
    manejarSeleccionArchivo(event) {
      const file = event.target.files[0];
      if (file) {
        this.archivoSeleccionado = file;
      }
    },
    async procesarYSubir() {
      if (!this.archivoSeleccionado) return;

      this.cargando = true;
      const cod_empresa=CryptoJS.AES.decrypt(Cookies.get('emp'),this.key).toString(CryptoJS.enc.Utf8); 
      
      // FormData para enviar el archivo crudo
      const formData = new FormData();
      formData.append('archivo_plan', this.archivoSeleccionado);
      formData.append('cod_empresa',parseInt(cod_empresa));
      try {
        // --- AQUÍ LLAMAS A TU BACKEND ---
         const responsePuct = await api.post('/subirExcel',formData,{
            headers:{
                'Content-Type':'multipart/form-data'
            }
         }) 
        
        if (responsePuct.data.status==='vacio') {
            Toast.fire({
                icon:'warning',
                text:'No se pudo cargar el archivo excel'
            })    
        }else if(responsePuct.data.status==='ok'){
            Toast.fire({
                icon:'success',
                text:'archivo subido correctamente'
            });
            this.mostrarModalPuct=false;
            this.getnombreCuenta();
        }

      } catch (error) {
        console.error("Error al subir:", error);
        Toast.fire({
            icon:'error',
            text:'error en el servidor intentelo mas tarde'
        })
        this.cargando = false;
      } finally{
        this.cargando=false;
      }
    },
  },
computed:{ 
    
},  
watch:{
    selectedCuenta(newval){
        console.log(newval) 
    },
    selectedNivel(newval){     
        
    }
    
} 
}

</script>

<template>
<Sidebar>
    <template #title>Plan de Cuentas</template>
    <div class="flex flex-col">
        <!-- tabla lista de empresas-->
        <!--<div class="flex flex-col bg-gray-100 border border-gray-200 w-5xl mt-5  p-4 rounded-lg ml-45">
            <div class="flex flex-row px-4">
                <button class=" p-1.5 text-sm text-white bg-blue-950 rounded-lg font-Nunito cursor-pointer">Mayor</button>
                <button class=" p-1.5 text-sm text-white bg-blue-950 rounded-lg font-Nunito cursor-pointer">Saldos Continuos</button>
                <button class=" p-1.5 text-sm text-white bg-blue-950 rounded-lg font-Nunito cursor-pointer">Saldos Mensuales</button>
            </div>
            <div class="flex-1 mt-7  overflow-y-auto px-4 max-h-96">
            <p class=" font-Nunito text-lg text-slate-900 mb-4">Lista de Empresas</p>    
            <table class="w-full text-sm  text-left text-gray-500">
                Encabezado Dinámico 
                <thead class="text-xs font-Nunito text-gray-700 uppercase bg-gray-50 sticky top-0">
                <tr>
                    <th v-for="header in headers" :key="header" class="px-4 py-3">
                    {{ header }}
                    </th>
                </tr>
                </thead>

                 Cuerpo de la Tabla 
                <tbody>
                <tr v-if="!empresa.length" class=" flex  justify-center text-gray-500 mt-8 mx-auto h-52">
                    <td class=" text-sm font-Nunito ">No se encontraron Datos</td>
                </tr>
                <tr v-for="(emp, index) in empresa" :key="index" class="bg-white  hover:bg-gray-100">
                    <td v-show="false" class="px-4 py-2  whitespace-nowrap cursor-pointer">
                    {{ emp.cod_empresa }}
                    </td>
                    <td class="px-4 py-2  whitespace-nowrap cursor-pointer">
                    {{ emp.razon_social || emp.nombre_propietario }}
                    </td>
                    <td class="px-4 py-2 cursor-pointer">
                    {{ emp.cod_tpEmpresa }}
                    </td>
                    <td class="px-4 py-2 text-left cursor-pointer">
                    {{ emp.fecha_inscripcion}}
                    </td>
                    <td class="px-4 py-2 text-left cursor-pointer">
                    {{ emp.nit }}
                    </td>
                    <td class="px-4 py-2 text-left cursor-pointer">
                    {{ emp.actividad_principal }}
                    </td>
                    <td class="flex flex-row justify-center px-2 py-2 text-left cursor-pointer space-x-4">
                        <span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 14 14"><path fill="#568cf1" fill-rule="evenodd" d="M.658.44A1.5 1.5 0 0 1 1.718 0h5.587a1.5 1.5 0 0 1 1.06.44l3.414 3.414a1.5 1.5 0 0 1 .44 1.06V12.5a1.5 1.5 0 0 1-1.5 1.5h-9a1.5 1.5 0 0 1-1.5-1.5v-11c0-.398.158-.78.44-1.06ZM5.33 4.527a.75.75 0 0 1 .175 1.047L4.108 7.53a.75.75 0 0 1-1.14.094l-.838-.838a.75.75 0 0 1 1.06-1.06l.212.211l.882-1.234a.75.75 0 0 1 1.046-.175Zm.95 1.847a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75m0 3.969a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75m-.775-.738a.75.75 0 1 0-1.22-.872l-.883 1.235l-.212-.212a.75.75 0 0 0-1.06 1.06l.838.838a.75.75 0 0 0 1.14-.094z" clip-rule="evenodd"/></svg></span>
                        <span @click="planCuenta(emp)"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48"><path fill="#568cf1" fill-rule="evenodd" d="M16.905 1.359C19.511 1.173 23.323 1 28.5 1s8.99.173 11.595.359c3.55.253 6.293 2.997 6.546 6.546c.187 2.606.359 6.418.359 11.595s-.172 8.99-.359 11.595c-.253 3.55-2.997 6.293-6.546 6.546q-1.029.075-2.312.142q-.068 1.284-.142 2.312c-.253 3.55-2.997 6.293-6.546 6.546c-2.606.186-6.418.359-11.595.359s-8.99-.173-11.595-.359c-3.55-.253-6.293-2.997-6.546-6.546C1.173 37.489 1 33.677 1 28.5s.173-8.99.359-11.595c.253-3.55 2.997-6.293 6.546-6.546q1.028-.075 2.312-.142q.068-1.283.142-2.312c.253-3.55 2.997-6.293 6.546-6.546M32.912 41.63c-1.344-2.914-3.793-6.272-8.19-7.8a9 9 0 1 0-10.445 0c-4.395 1.529-6.844 4.887-8.188 7.801a3.08 3.08 0 0 1-.74-1.821C5.169 37.305 5 33.589 5 28.5s.17-8.805.349-11.31c.111-1.565 1.276-2.73 2.841-2.842C10.695 14.17 14.411 14 19.5 14s8.805.17 11.31.349c1.565.111 2.73 1.276 2.842 2.841c.178 2.505.348 6.221.348 11.31s-.17 8.805-.348 11.31a3.08 3.08 0 0 1-.74 1.82" clip-rule="evenodd"/></svg></span>
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
            <div class="grid grid-cols-2 w-full mt-5">
                <div class="flex flex-row px-3 space-x-2 items-end">
                    <button @click="mostrarModal=true" class=" flex flex-row items-center justify-center w-40 h-10 cursor-pointer bg-blue-950 text-white font-Nunito p-1.5 text-xs font-bold rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><circle cx="16" cy="16" r="4" fill="#fff"/><path fill="#fff" d="M30.94 15.66A16.69 16.69 0 0 0 16 5A16.69 16.69 0 0 0 1.06 15.66a1 1 0 0 0 0 .68A16.69 16.69 0 0 0 16 27a16.69 16.69 0 0 0 14.94-10.66a1 1 0 0 0 0-.68M16 22.5a6.5 6.5 0 1 1 6.5-6.5a6.51 6.51 0 0 1-6.5 6.5"/></svg>Mostrar Asiento</button>
                    <button @click="mostrarConsultarLibroMayor=true"  class=" flex flex-row items-center justify-center w-40 h-10 cursor-pointer bg-blue-950 text-white font-Nunito p-1.5 text-xs font-bold rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><circle cx="16" cy="16" r="4" fill="#fff"/><path fill="#fff" d="M30.94 15.66A16.69 16.69 0 0 0 16 5A16.69 16.69 0 0 0 1.06 15.66a1 1 0 0 0 0 .68A16.69 16.69 0 0 0 16 27a16.69 16.69 0 0 0 14.94-10.66a1 1 0 0 0 0-.68M16 22.5a6.5 6.5 0 1 1 6.5-6.5a6.51 6.51 0 0 1-6.5 6.5"/></svg>Consultar por Fecha</button>
                </div>
                <div class="flex flex-col">
                    <div class="flex flex-row justify-end items-center px-5 space-x-2 ">
                    <label class="text-slate-900 text-sm font-Nunito">Total Periodo:</label>
                    <input  type="text" disabled class=" w-24 bg-white text-sm p-2 rounded-xl border border-gray-200  placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="">
                    <input  type="text" disabled class=" w-24 bg-white text-sm p-2 rounded-xl border border-gray-200  placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="">
                </div>
                <div class="flex flex-row justify-end items-center px-5 space-x-2 ">
                    <label class="text-slate-900 text-sm font-Nunito">Total Acumulados:</label>
                    <input  type="text" disabled class=" w-24 bg-white text-sm p-2 rounded-xl border border-gray-200  placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="">
                    <input  type="text" disabled class=" w-24 bg-white text-sm p-2 rounded-xl border border-gray-200  placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="">
                </div>
                <div class="flex flex-row justify-end items-center px-5 space-x-2 space-y-2">
                    <label class="text-slate-900 text-sm font-Nunito">Saldo a la Fecha:</label>
                    <input  type="text" disabled class=" w-24 mr-26 bg-white text-sm p-2 rounded-xl border border-gray-200  placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="">
                    
                </div>
                </div>
                
            </div>
        </div>-->
        <!-- plan cuenta-->
            <div  class="flex flex-col bg-gray-100 p-4 w-3xl h-1/2 ml-50 rounded-lg">
            <p class="text-md font-Nunito text-slate-900 mb-4">Plan de cuentas:</p>
            <NestedList :items="dataCuenta" :selected="itemSeleccionado?.cod_nombreCuenta" @select="capturarItem" @abrir-registro="abrirModalRegistro">
                <span v-if="dataCuenta" class=" font-Nunito text-sm text-slate-900">No se cargaron las cuentas..</span>
            </NestedList>
        </div>    
                
        
        
        <div class=" flex flex-row" v-if="!dataCuenta.length">
            <button class="p-2 bg-blue-950 rounded-lg text-white font-Nunito text-sm">Cargar Plan de Cuentas</button>
        </div>
        <div class="grid grid-cols-4 gap-x-5 ml-50 mt-10 w-3xl">
            <button @click="modalview" class=" bg-blue-950 cursor-pointer text-white font-Nunito text-sm rounded-lg p-2 flex flex-row justify-center">Nuevo<span class="mx-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1792 1792"><path fill="#fff" d="M381 1620q0 80-54.5 126T191 1792q-106 0-172-66l57-88q49 45 106 45q29 0 50.5-14.5T254 1626q0-64-105-56l-26-56q8-10 32.5-43.5t42.5-54t37-38.5v-1q-16 0-48.5 1t-48.5 1v53H32v-152h333v88l-95 115q51 12 81 49t30 88m2-627v159H21q-6-36-6-54q0-51 23.5-93T95 937t66-47.5t56.5-43.5t23.5-45q0-25-14.5-38.5T187 749q-46 0-81 58l-85-59q24-51 71.5-79.5T198 640q73 0 123 41.5T371 794q0 50-34 91.5T262 950t-75.5 50.5T151 1053h127v-60zm1409 319v192q0 13-9.5 22.5t-22.5 9.5H544q-13 0-22.5-9.5T512 1504v-192q0-14 9-23t23-9h1216q13 0 22.5 9.5t9.5 22.5M384 413v99H49v-99h107q0-41 .5-121.5T157 170v-12h-2q-8 17-50 54l-71-76L170 9h106v404zm1408 387v192q0 13-9.5 22.5t-22.5 9.5H544q-13 0-22.5-9.5T512 992V800q0-14 9-23t23-9h1216q13 0 22.5 9.5t9.5 22.5m0-512v192q0 13-9.5 22.5T1760 512H544q-13 0-22.5-9.5T512 480V288q0-13 9.5-22.5T544 256h1216q13 0 22.5 9.5t9.5 22.5"/></svg></span></button>
            <button @click="Modalmodificar" class=" bg-blue-950 cursor-pointer text-white font-Nunito text-sm rounded-lg p-2 flex flex-row justify-center">Modificar <span class="mx-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48"><defs><mask id="SVGVGTfpbzH"><g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"><path fill="#fff" stroke="#fff" d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20"/><path stroke="#000" d="M33.542 27c-1.274 4.057-5.064 7-9.542 7s-8.268-2.943-9.542-7v6m19.084-18v6c-1.274-4.057-5.064-7-9.542-7s-8.268 2.943-9.542 7"/></g></mask></defs><path fill="#fff" d="M0 0h48v48H0z" mask="url(#SVGVGTfpbzH)"/></svg></span></button>
            <button v-show="false" class=" bg-blue-950 cursor-pointer text-white font-Nunito text-sm rounded-lg p-2 flex flex-row justify-center">Eliminar <span class="mx-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6z"/></svg></span></button>
            <button @click="mostrarEjemploPuct" class="p-2 bg-blue-950 rounded-lg text-white font-Nunito text-sm cursor-pointer">Cargar Plan de Cuentas</button>            
        </div>
    </div>
    <!-- modal para crear nuevo plan de cuenta-->
    <transition enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95">
        <div v-if="mostrarModal" class="fixed inset-0 flex items-center justify-around z-50">
            <div class=" bg-gray-50 bg-opacity-80 text-white  ml-56 w-3xl p-6 rounded-lg shadow-2xl flex flex-col space-x-2">
                <p class="text-slate-900 text-xl mx-auto font-Nunito">Registro de Cuenta</p>
                <form @submit.prevent="envioForm">
                    <div class="grid grid-cols-2 gap-x-5">
                        <div class="flex flex-col mt-5">
                            <label class=" text-sm font-Nunito text-slate-900 mb-2">Nombre de Cuenta</label>     
                            <input v-model="nombre_cuenta"  type="text" class=" w-xs rounded-xl border border-gray-300 p-2 placeholder:text-sm placeholder:text-slate-900 focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 text-slate-900  " placeholder=" Ingrese nombre de cuenta">
                        </div>
                        <div class="flex flex-col mt-5 justify-center">
                            <label class=" text-sm font-Nunito text-slate-900 mb-2">Puct</label>     
                            <p class=" text-slate-900 text-md font-Nutito">{{ puct || 0 }}</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-x-5">
                        <div v-if="mostrarSelectTipo" class="flex flex-col mt-5">
                            <label class=" text-sm font-Nunito text-slate-900 mb-2">Tipo cuenta</label>     
                            <select v-model="selectedCuenta"  class=" text-slate-900 w-xs p-2 border border-gray-200 rounded-lg placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10  ">
                                <option value="" selected disabled>Selecciona tipo de cuenta</option>
                                <option v-for="item in tipoCuenta "  :key="item.cod_tpcuenta" :value="item.cod_tpcuenta" >{{ item.tipo_cuenta }}</option>    
                            </select>
                        </div>
                        <div v-if="!mostrarSelectTipo" class="flex flex-col mt-5 justify-center">
                            <label class=" text-sm font-Nunito text-slate-900 mb-2">Tipo cuenta</label>     
                            <p class=" text-slate-900 text-md font-Nutito">{{ selectedCuenta }}</p>
                        </div>
                        <div class="flex flex-col mt-5 justify-center">
                            <label class=" text-sm font-Nunito text-slate-900 mb-2">Nivel</label>     
                            <p class=" text-slate-900 text-md font-Nutito">{{ selectedNivel }}</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-x-5">
                        <div class="flex flex-col mt-5 justify-center">
                            <label class=" text-sm font-Nunito text-slate-900 mb-2">Cuenta Mayor</label>     
                            <p class="text-slate-900 text-md font-Nunito">{{ cuenta_mayor || 0 }}</p>
                        </div>
                    </div>
                    <div class=" flex flex-row space-x-5 mt-5">
                        <button type="submit" class=" w-xs bg-blue-950 rounded-lg p-2 cursor-pointer text-white font-Nunito text-sm flex flex-row justify-center ">Registrar Nuevo <span class="mx-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M21 7v12q0 .825-.587 1.413T19 21H5q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h12zm-9 11q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-6-8h9V6H6z"/></svg></span></button>
                        <button @click="cerrarModal" type="button" class="w-xs bg-blue-950 rounded-lg p-2 cursor-pointer text-white font-Nunito text-sm flex flex-row justify-center">Cancelar <span class="mx-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m5 13.59L15.59 17L12 13.41L8.41 17L7 15.59L10.59 12L7 8.41L8.41 7L12 10.59L15.59 7L17 8.41L13.41 12z"/></svg></span></button>
                    </div>
                </form>
            </div>
        </div>        

    </transition>
    <!-- modal para modificar plan cuenta-->
    <transition enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95">
    
    <div v-if="mostrarModalmodificar" class="fixed inset-0 flex items-center justify-around z-50">
        <div class=" bg-gray-50 bg-opacity-80  ml-56 w-3xl p-6 rounded-lg shadow-2xl flex flex-col space-x-2">
            <p class="text-slate-900 text-xl mx-auto font-Nunito">Modificar Cuenta</p>
            <form @submit.prevent="envioEditar">
                    <div class="grid grid-cols-2 gap-x-5">
                        <div v-show="false" class="flex flex-col mt-5">
                            <label class=" text-sm font-Nunito text-slate-900 mb-2">Nombre de Cuenta</label>     
                            <input v-model="datosUpdate.cod_nombreCuenta"  type="text" class=" w-xs rounded-xl border border-gray-300 p-2 placeholder:text-sm placeholder:text-slate-900 focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 text-slate-900  " placeholder=" Ingrese nombre de cuenta">
                        </div>
                        <div class="flex flex-col mt-5">
                            <label class=" text-sm font-Nunito text-slate-900 mb-2">Nombre de Cuenta</label>     
                            <input v-model="datosUpdate.nombre_cuenta"  type="text" class=" w-xs rounded-xl border border-gray-300 p-2 placeholder:text-sm placeholder:text-slate-900 focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 text-slate-900  " placeholder=" Ingrese nombre de cuenta">
                        </div>
                        <div class="flex flex-col mt-5 justify-center">
                            <label class=" text-sm font-Nunito text-slate-900 mb-2">Puct</label>     
                            <p class=" text-slate-900 text-md font-Nutito">{{ datosUpdate.puct}}</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-x-5">
                        <div class="flex flex-col mt-5">
                            <label class=" text-sm font-Nunito text-slate-900 mb-2">Tipo</label>     
                            <p class=" text-slate-900 text-md font-Nutito">{{ datosUpdate.cod_tpcuenta===1 ? 'ACTIVO': datosUpdate.cod_tpcuenta===2 ? 'PASIVO' : datosUpdate.cod_tpcuenta===3 ? 'CAPITAL' : datosUpdate.cod_tpcuenta===4 ? 'INGRESO' : 'GASTO' }}</p>
                        </div>
                        <div class="flex flex-col mt-5">
                            <label class=" text-sm font-Nunito text-slate-900 mb-2">Nivel</label>     
                            <p class=" text-slate-900 text-md font-Nutito">{{ datosUpdate.cod_nivelCuenta }}</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-x-5">
                        <div class="flex flex-col mt-5 justify-center">
                            <label class=" text-sm font-Nunito text-slate-900 mb-2">Cuenta Mayor</label>     
                            <p class="text-slate-900 text-md font-Nunito">{{ cuenta_mayor || 0 }}</p>
                        </div>
                    </div>
                    <div class=" flex flex-row space-x-5 mt-5">
                        <button type="submit" class=" w-xs bg-blue-950 rounded-lg p-2 cursor-pointer text-white font-Nunito text-sm flex flex-row justify-center ">Modificar cuenta <span class="mx-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M21 7v12q0 .825-.587 1.413T19 21H5q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h12zm-9 11q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-6-8h9V6H6z"/></svg></span></button>
                        <button @click="cerrarModalmodificar" type="button" class="w-xs bg-blue-950 rounded-lg p-2 cursor-pointer text-white font-Nunito text-sm flex flex-row justify-center">Cancelar <span class="mx-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m5 13.59L15.59 17L12 13.41L8.41 17L7 15.59L10.59 12L7 8.41L8.41 7L12 10.59L15.59 7L17 8.41L13.41 12z"/></svg></span></button>
                    </div>
                </form>
        </div>
    </div>            
    </transition>
    <!-- modal para importar puct-->
     <transition enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95">
         
        <div v-if="mostrarModalPuct" class="fixed inset-0 flex items-center justify-around z-50">
            <div class=" bg-gray-50 bg-opacity-80  ml-56 w-2xl p-6 rounded-lg shadow-2xl flex flex-col space-x-2">
                <div class=" flex flex-col justify-center ">
                    <p class=" text-slate-900 font-Nunito font-bold text-sm uppercase my-4 mx-auto">Importar plan de cuentas</p>
                    <img src="../assets/ejemploPuct.png" alt="no se cargo la imagen" class=" object-cover w-md h-md">
                    <p class=" text-slate-900 font-Nunito text-sm my-5 font-semibold "> Para importar un nuevo plan de cuentas es neceario seguir las siguientes instrucciones:</p>
                    <ul class=" flex flex-col text-slate-900 font-Nunito text-sm list-disc ml-5 ">
                        <li>El archivo excel tiene que tener el formato CVS UTF-8 (separado por comas)</li>
                        <li>Como se muestra en la imagen debe tener los siguientes encabezados : nombre_cuenta,puct,cod_nivelCuenta,cod_tpcuenta</li>
                        <li>El plan de cuentas debe estar cargado hasta el nivel 4 </li>
                        <li>Como se muestra en la imagen debe estar ordenado jerarquicamente </li>
                        <li>En el encabezado cod_tpcuenta hace referencia al tipo de cuenta que son: 1 ACTIVO , 2 PASIVO, 3 PATRIMONIO, 4 INGRESOS 5 EGRESOS</li>
                        <li>En el encabezado cod_nivelCuenta hace referencia al nivel de cuenta 1 al 5 </li>
                    </ul>
                    <div v-if="archivoSeleccionado" class="mt-4 p-3 bg-green-100 border border-green-200 rounded-md flex items-center justify-between">
                    <span class="text-green-800 text-xs font-bold truncate">📄 {{ archivoSeleccionado.name }}</span>
                    <button @click="archivoSeleccionado = null" class="text-green-600 hover:text-red-500">✕</button>
            </div>
                </div>
                <input type="file" ref="fileInput" @change="manejarSeleccionArchivo" accept=".xlsx, .xls, .csv" class=" hidden">
                <div class=" flex flex-row space-x-2 my-4">
                    <button  @click="archivoSeleccionado ? procesarYSubir() : $refs.fileInput.click()" :disabled="cargando"
                    class="flex-1 p-2 bg-green-700 text-sm text-white rounded-lg cursor-pointer hover:bg-green-800 disabled:opacity-50 font-bold transition">
                        <span v-if="cargando">Subiendo archivo...</span>
                        <span v-else-if="archivoSeleccionado">Confirmar Importación</span>
                        <span v-else>Seleccionar Excel / CSV</span>
                    </button>
                    <button @click="mostrarModalPuct=false" class=" p-2 bg-red-600 text-sm font-Nunito text-white rounded-lg cursor-pointer">Cancelar</button>
                </div>
            </div>
        </div>        
     </transition>
</Sidebar>


</template>

