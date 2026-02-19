<script>
import Sidebar from '@/assets/layout/sidebar.vue';
import NestedList from '@/components/NestedList.vue';
import axios from 'axios';
import Swal from 'sweetalert2';

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
            cuenta_mayor:''
    }
  },
mounted(){
this.getNivelCuenta();
this.getTipoCuenta();
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
    modalview(){
        this.mostrarModal=true;
        this.cuenta_mayor = this.itemSeleccionado === null ? 0 : this.itemSeleccionado.nombre_cuenta;
    },
    capturarItem(item){
        this.itemSeleccionado=item;
        console.log(this.itemSeleccionado);
    },
    async envioForm(){
        
        try {
            const responseRegistroNombreCuenta = await axios.post('http://localhost:3000/abencoado/addCuenta',{
                nombre_cuenta:this.nombre_cuenta,
                puct:this.puct,
                cod_nivelCuenta:this.selectedNivel,
                cod_tpcuenta:this.selectedCuenta
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
            console.log('problemas con el servidor: ',error)
            Swal.fire({
                icon:'error',
                title:'Abencoado Group',
                text:'pronblemas con el servidor intentelo mas tarde!!'
            })
        }
    },
    async getNivelCuenta(){
        try {
            const responseNivelCuenta = await axios.get('http://localhost:3000/abencoado/getNivelcuenta')
            if (responseNivelCuenta.data.estado==='error') {
                this.nivelCuenta=[]
            }
            this.nivelCuenta=responseNivelCuenta.data.rows;
            
            
            
        } catch (error) {
            console.log('problemas al traer datos: ',error);
        }
    },
    async getTipoCuenta(){
        try {
            const responseTipoCuenta = await axios.get('http://localhost:3000/abencoado/gettipocuenta')
            if (responseTipoCuenta.data.estado==='error') {
                this.nivelCuenta=[]
            }
            this.tipoCuenta=responseTipoCuenta.data.rows;
        } catch (error) {
            console.log('problemas al traer datos: ',error);
        }
    },
    async getnombreCuenta(){
        try {
            const responsenombreCuenta= await axios.get('http://localhost:3000/abencoado/getnombreCuenta')
            if (responsenombreCuenta.data.estado==='vacio') {
                Swal.fire({
                    icon:'warning',
                    title:'Abencoado Group',
                    text:'No se encontraron datos'
                })
                return;
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
        
        console.log(this.dataCuenta);   
 
            //---/////
            
        } catch (error) {
            console.log('ha ocurrido un error:', error)
            Swal.fire({
                icon:'error',
                title:'Abencoado Group',
                text:'error en el servidor intentelo mas tarde'
            })
        }
    }
  },
computed:{
    
},  
watch:{
    selectedCuenta(newval){
        console.log(newval) 
    },
    selectedNivel(newval){
        if (newval===2) {
            console.log(this.dataCuenta)
            console.log(this.itemSeleccionado)
            const filterPuct=this.dataCuenta.filter(item=> item.cod_tpcuenta===this.itemSeleccionado.cod_tpcuenta)[0].children.length===0 ? [] : this.dataCuenta.filter(item=> item.cod_tpcuenta===this.itemSeleccionado.cod_tpcuenta)[0].children;
            console.log(filterPuct)
            if (filterPuct.length===0) {
                this.puct=`${this.itemSeleccionado.puct}${filterPuct.length+1}`
            }else{
                
                this.puct=`${this.itemSeleccionado.puct}${filterPuct.length+1}`
            } 
        }else if(newval===1){
            const filterlengthcuenta= this.dataCuenta.length+1;
            this.puct=`${filterlengthcuenta}`
        }else if(newval===3){
            console.log(this.dataCuenta)
            const filterPuct = this.dataCuenta.filter(item=> item.cod_tpcuenta===this.itemSeleccionado.cod_tpcuenta)[0].children.filter(item=> item.nombre_cuenta===this.itemSeleccionado.nombre_cuenta)[0].children.length===0 ? [] : this.dataCuenta.filter(item=>item.cod_tpcuenta===this.itemSeleccionado.cod_tpcuenta)[0].children.filter(item=> item.nombre_cuenta===this.itemSeleccionado.nombre_cuenta) ;
            console.log(filterPuct)
            if (filterPuct.length===0) {
                this.puct=`${this.itemSeleccionado.puct}${filterPuct.length+1}`    
            } else{
                this.puct=`${this.itemSeleccionado.puct}${filterPuct.length+1}`
            }
        }
    }
}
}

</script>

<template>
<Sidebar>
    <template #title>Plan de Cuentas</template>
    <div class="flex flex-col">
        <div class="flex flex-col bg-gray-100 p-4 w-3xl h-1/2 ml-50 rounded-lg">
      <NestedList :items="dataCuenta" @select="capturarItem">

      </NestedList>
    </div>
    <div class="grid grid-cols-3 gap-x-5 ml-50 mt-10 w-3xl">
        <button @click="modalview" class=" bg-blue-950 cursor-pointer text-white font-Nunito text-md rounded-lg p-2 flex flex-row justify-center">Nuevo<span class="mx-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1792 1792"><path fill="#fff" d="M381 1620q0 80-54.5 126T191 1792q-106 0-172-66l57-88q49 45 106 45q29 0 50.5-14.5T254 1626q0-64-105-56l-26-56q8-10 32.5-43.5t42.5-54t37-38.5v-1q-16 0-48.5 1t-48.5 1v53H32v-152h333v88l-95 115q51 12 81 49t30 88m2-627v159H21q-6-36-6-54q0-51 23.5-93T95 937t66-47.5t56.5-43.5t23.5-45q0-25-14.5-38.5T187 749q-46 0-81 58l-85-59q24-51 71.5-79.5T198 640q73 0 123 41.5T371 794q0 50-34 91.5T262 950t-75.5 50.5T151 1053h127v-60zm1409 319v192q0 13-9.5 22.5t-22.5 9.5H544q-13 0-22.5-9.5T512 1504v-192q0-14 9-23t23-9h1216q13 0 22.5 9.5t9.5 22.5M384 413v99H49v-99h107q0-41 .5-121.5T157 170v-12h-2q-8 17-50 54l-71-76L170 9h106v404zm1408 387v192q0 13-9.5 22.5t-22.5 9.5H544q-13 0-22.5-9.5T512 992V800q0-14 9-23t23-9h1216q13 0 22.5 9.5t9.5 22.5m0-512v192q0 13-9.5 22.5T1760 512H544q-13 0-22.5-9.5T512 480V288q0-13 9.5-22.5T544 256h1216q13 0 22.5 9.5t9.5 22.5"/></svg></span></button>
        <button class=" bg-blue-950 cursor-pointer text-white font-Nunito text-md rounded-lg p-2 flex flex-row justify-center">Modificar <span class="mx-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48"><defs><mask id="SVGVGTfpbzH"><g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"><path fill="#fff" stroke="#fff" d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20"/><path stroke="#000" d="M33.542 27c-1.274 4.057-5.064 7-9.542 7s-8.268-2.943-9.542-7v6m19.084-18v6c-1.274-4.057-5.064-7-9.542-7s-8.268 2.943-9.542 7"/></g></mask></defs><path fill="#fff" d="M0 0h48v48H0z" mask="url(#SVGVGTfpbzH)"/></svg></span></button>
        <button class=" bg-blue-950 cursor-pointer text-white font-Nunito text-md rounded-lg p-2 flex flex-row justify-center">Eliminar <span class="mx-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6z"/></svg></span></button>            
    </div>
    </div>

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
                            <label class=" text-sm font-Nunito text-slate-900 mb-2">Numero de cuenta</label>     
                            <p class="text-slate-900 text-md font-Nunito">1</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-x-5">
                        <div class="flex flex-col mt-5">
                            <label class=" text-sm font-Nunito text-slate-900 mb-2">Tipo</label>     
                            <select v-model="selectedCuenta"  class=" text-slate-900 w-xs p-2 border border-gray-200 rounded-lg placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10  ">
                                <option value="" selected disabled>Selecciona tipo de cuenta</option>
                                <option v-for="item in tipoCuenta "  :key="item.cod_tpcuenta" :value="item.cod_tpcuenta" >{{ item.tipo_cuenta }}</option>    
                            </select>
                        </div>
                        <div class="flex flex-col mt-5 justify-center">
                            <label class=" text-sm font-Nunito text-slate-900 mb-2">Puct</label>     
                            <p class=" text-slate-900 text-md font-Nutito">{{ puct || 0 }}</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-x-5">
                        <div class="flex flex-col mt-5">
                            <label class=" text-sm font-Nunito text-slate-900 mb-2">Nivel</label>     
                            <select v-model="selectedNivel"  class=" text-slate-900 w-xs p-2 border border-gray-200 rounded-lg placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10  ">
                                <option value="" selected disabled>Selecciona Nivel de cuenta</option>
                                <option v-for="item in nivelCuenta "  :key="item.cod_nivelCuenta" :value="item.nivel_cuenta" >{{ item.nivel_cuenta }}</option>    
                            </select>
                        </div>
                        <div class="flex flex-col mt-5 justify-center">
                            <label class=" text-sm font-Nunito text-slate-900 mb-2">Cuenta Mayor</label>     
                            <p class="text-slate-900 text-md font-Nunito">{{ cuenta_mayor || 0 }}</p>
                        </div>
                    </div>
                    <div class=" flex flex-row space-x-5 mt-5">
                        <button type="submit" class=" w-xs bg-blue-950 rounded-lg p-2 cursor-pointer text-white font-Nunito text-md flex flex-row justify-center ">Registrar Nuevo <span class="mx-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M21 7v12q0 .825-.587 1.413T19 21H5q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h12zm-9 11q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-6-8h9V6H6z"/></svg></span></button>
                        <button @click="cerrarModal" type="button" class="w-xs bg-blue-950 rounded-lg p-2 cursor-pointer text-white font-Nunito text-md flex flex-row justify-center">Cancelar <span class="mx-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m5 13.59L15.59 17L12 13.41L8.41 17L7 15.59L10.59 12L7 8.41L8.41 7L12 10.59L15.59 7L17 8.41L13.41 12z"/></svg></span></button>
                    </div>
                </form>
            </div>
        </div>        

    </transition>
</Sidebar>


</template>

