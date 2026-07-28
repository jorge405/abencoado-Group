<script>
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import axios from 'axios';
import Swal from 'sweetalert2';
import fondoRegistro from '@/assets/fondoRegistro.svg';
import api from '@/services/api.js';
import ValidationTooltip from '@/components/ValidationTooltip.vue';




export default{

    name:'RegistroNuevo',
    data(){
        return{
        image1:'/fondoRegistro.svg',
        image2:fondoRegistro,
        tip_empresa:[],
        departamento:[
            {value:'La Paz',text:'La Paz'},
            {value:'Santa Cruz',text:'Santa Cruz'},
            {value:'Cochabamba',text:'Cochabamba'},
            {value:'Chuquisaca/Sucre',text:'Chuquisaca/Sucre'},
            {value:'Tarija',text:'Tarija'},
            {value:'Potosi',text:'Potosi'},
            {value:'Oruro',text:'Oruro'},
            {value:'Beni',text:'Beni'},
            {value:'Pando',text:'Pando'}
        ],
        tipo_via:[
            {value:'Avenida',text:'Avenida'},
            {value:'Calle',text:'Calle'},
            {value:'Carretera',text:'Carretera'},
            {value:'Pasaje',text:'Pasaje'},
            {value:'Calzada',text:'Calzada'},
        ],
        tipos:['Comercial','No comercial'],
        actividad_s:'',
        actividad_secundaria:[],
        flatpickrTimeConfig:{
            enableTime: true,
            noCalendar: true,
            dateFormat: 'H:i',
            time_24hr: true,
            minuteIncrement: 1,
            wrap: false
        },
        selected_empresa:'',
        fecha_inscripcion:'',
        activeRazonSocial:false,
        activeNombrePropietario:false,
        razon_social:'',
        nombre_propietario:'',
        nro_testimonio:'',
        nro_poder:'',
        notaria:'', 
        nit:null,
        direccion:'',
        municipio:'',
        zona:'',
        selected_departamento:'',
        via:'',
        nombre_via:'',
        nro_puerta:'',
        referencias:'',
        actividad_principal:'',
        correo_electronico:'',
        pass:'',
        errors:{
            razon_social:false,
            nit:false,
            correo_electronico:false,
            fecha_inscripcion:false,
            actividad_principal:false,
            password:false,
            empresa:false
        }

    }
    },
    mounted(){
        this.getTipoEmpresa();
    },
    methods:{
        validaciones(){
            this.errors.razon_social=this.razon_social.trim()==='';
            // NIT
            if (!this.nit) {
            this.errors.nit = true;
             } else {
            const nitStr = this.nit.toString();
            // Marcamos error si: NO es número O es menor/igual a 8 O es mayor a 10
            this.errors.nit = isNaN(this.nit) || nitStr.length <= 8 || nitStr.length > 10;
            }
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                // Agregamos validación de que no esté vacío también si es obligatorio
                if (this.correo_electronico.trim() === '') {
                    this.errors.correo_electronico = true;
                } else {
                    this.errors.correo_electronico = !regex.test(this.correo_electronico);
                }
            this.errors.fecha_inscripcion= this.fecha_inscripcion.trim()==='';
            this.errors.actividad_principal=this.actividad_principal.trim()===''; 
            // PASSWORD
            if (this.pass==='') {
            this.errors.password = true;
             } else {
            const nitStr = this.pass.toString();
            // Marcamos error si: NO es número O es menor/igual a 8 O es mayor a 10
            this.errors.password = nitStr.length < 8 || nitStr.length > 12;
            }
            // empresa unipersonal
            this.errors.empresa= this.selected_empresa==='UNIPERSONAL' && this.nombre_propietario.trim()===''
            if (this.selected_empresa==='UNIPERSONAL') {
                this.errors.razon_social=false;
            }

        },
        agregarActividad(){
            if(this.actividad_s.trim()==='') return;
            this.actividad_secundaria.push(this.actividad_s);
            this.actividad_s='';
        },
        async getTipoEmpresa(){
            try {
                const responseTipoEmpresa= await api.get('/getTipEmpresa')
                if (responseTipoEmpresa.data.estado==='error') {
                    return this.tip_empresa=[];
                }else if(responseTipoEmpresa.data.estado==='ok'){
                    this.tip_empresa=responseTipoEmpresa.data.rows;
                    console.log(this.tip_empresa)
                }
            } catch (error) {
                console.log('problemas al obtener tipo de empresa:', error)
            }
        },
        async registroNuevo(){
            const filterTipEmpresa= this.tip_empresa.filter(item => item.tipo_empresa===this.selected_empresa);
            this.validaciones();
            if (!this.errors.razon_social && !this.errors.nit && !this.errors.correo_electronico && !this.errors.fecha_inscripcion && !this.errors.actividad_principal && !this.errors.password  && !this.errors.empresa ) {
                
                try {

                const datos={
                    razon_social:this.razon_social,
                    nombre_propietario:this.nombre_propietario,
                    nro_testimonio:this.nro_testimonio,
                    nro_poder:this.nro_poder,
                    notaria:this.notaria,
                    nit:this.nit,
                    fecha_inscripcion:this.fecha_inscripcion,
                    direccion:this.direccion,
                    municipio:this.municipio,
                    zona:this.zona,
                    departamento:this.selected_departamento,
                    tipo_via:this.via,
                    nombre_via:this.nombre_via,
                    nro_puerta:this.nro_puerta,
                    referencias:this.referencias,
                    actividad_principal:this.actividad_principal,
                    cod_tpEmpresa:filterTipEmpresa[0].cod_tpEmpresa,
                    actividad_secundaria:this.actividad_secundaria,
                    usuario:{
                        correo_electronico:this.correo_electronico,
                        pass:this.pass,
                        cod_tipUser:2,
                        // fatla aqui el cod_empresa
                    }

                } 
                const responseRegistroNuevo= await api.post('/addEmpresa',datos) 
                if (responseRegistroNuevo.data.status==='error'){
                    Swal.fire({
                        icon:'error',
                        title:'Registro no completado',
                        text:'No se pudo completar el registro, por favor intente nuevamente'
                    })
                    this.razon_social='';
                    this.nombre_propietario='';
                    this.nro_testimonio='';
                    this.nro_poder='';
                    this.notaria='';
                    this.nit='';
                    this.fecha_inscripcion='';
                    this.direccion='';
                    this.municipio='';
                    this.zona='';
                    this.selected_departamento='';
                    this.via='';
                    this.nombre_via='';
                    this.nro_puerta='';
                    this.referencias='';
                    this.actividad_principal='';
                    this.correo_electronico='';
                    this.pass='';
                    this.selected_empresa='';
                    this.actividad_secundaria=[];
                    this.activeRazonSocial=false;
                    this.activeNombrePropietario=false;
                    this.$router.push('/')
                }else if(responseRegistroNuevo.data.status==='ok'){
                    Swal.fire({
                        icon:'success',
                        title:'Abencoado Group',
                        text:'Empresa creada exitosamente, ya puedes iniciar session'
                    })
                    this.$router.push('/');
                    this.razon_social='';
                    this.nombre_propietario='';
                    this.nro_testimonio='';
                    this.nro_poder='';
                    this.notaria='';
                    this.nit='';
                    this.fecha_inscripcion='';
                    this.direccion='';
                    this.municipio='';
                    this.zona='';
                    this.selected_departamento='';
                    this.via='';
                    this.nombre_via='';
                    this.nro_puerta='';
                    this.referencias='';
                    this.actividad_principal='';
                    this.correo_electronico='';
                    this.pass='';
                    this.selected_empresa='';
                    this.actividad_secundaria=[];
                    this.activeRazonSocial=false;
                    this.activeNombrePropietario=false;
                }
            
                    
                

            } catch (error) {
                console.log('problemas en el servidor: ',error)
                Swal.fire({
                    icon:'warning',
                    title:'Error del servidor',
                    text:'Por favor intente mas tarde'
                });
                return ; 
            } 
            }else{
                Swal.fire({
                    icon:'warning',
                    text:'Faltan campos por completar'
                })
            }
            
        },
        
    },
    watch:{
        selected_empresa(newval){
            this.selected_empresa=newval;
            if (newval==='UNIPERSONAL') { 
                this.activeRazonSocial=true;
                this.activeNombrePropietario=false;
                this.razon_social='';
                this.nro_testimonio='';
                this.nro_poder='';
                this.notaria=''
            }else{
                this.activeRazonSocial=false;
                this.activeNombrePropietario=true;
            }
        }
    },
    components:{
        flatPickr,
        ValidationTooltip
    }
    

}
</script>

<template>
<div class="grid grid-cols-2">
<div class="flex flex-col w-full mt-20 ml-10">
<p class=" font-Nunito text-lg text-slate-900 mb-5">Eres Nuevo/Registrate Aqui</p>    
<form @submit.prevent="registroNuevo">
<div class="grid grid-cols-3 gap-x-2 mb-4">
<div class="flex flex-col">
<label class=" font-Nunito text-sm text-slate-900 mb-2">Tipo de Empresa</label>
<select v-model="selected_empresa" class=" text-sm p-2 border border-gray-200 rounded-xl placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10  ">
<option value="" selected disabled class=" font-Nunito text-sm placeholder:text-sm ">Selecciona tipo empresa</option>
<option v-for="item in tip_empresa"  :key="item.cod_tpEmpresa" :value="item.tipo_empresa" >{{ item.tipo_empresa }}</option>    
</select>
</div>
<div class="flex flex-col relative">
<label class=" text-sm font-Nunito text-slate-900 mb-2">Razon Social</label>     
<input v-model="razon_social" @blur="validateRazon_social"   :disabled="activeRazonSocial" :class="activeRazonSocial ===true ?'bg-gray-300' : 'bg-transparent'" type="text" class=" rounded-xl border border-gray-300 p-2 placeholder:text-sm  focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 uppercase placeholder:lowercase " placeholder=" Ingresa la razon social de la empresa">
<p v-show="errors.razon_social" class=" text-xs text-red-600 animate__animated animate__backInUp">! campo es obligatorio</p>
</div>
<div class="flex flex-col">
<label class=" text-sm font-Nunito text-slate-900 mb-2">Propietario/Representante Legal</label>     
<input v-model="nombre_propietario"  type="text" class=" rounded-xl border border-gray-300 p-2 placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 uppercase placeholder:lowercase " placeholder=" Ingresa nombre completo">        
<p v-show="errors.empresa" class=" text-xs text-red-600 animate__animated animate__backInUp">!campo es obligatorio</p>
</div>
</div>
<div class="grid grid-cols-3 gap-x-2 mb-3">
<div class=" flex flex-col">
    <label class=" text-sm font-Nunito text-slate-900 mb-2">Nro testimonio</label>     
    <input v-model="nro_testimonio" :disabled="activeRazonSocial" :class="activeRazonSocial===true ?'bg-gray-300' :'bg-transparent'" type="text" class=" rounded-xl border border-gray-300 p-2 placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 uppercase placeholder:lowercase " placeholder=" Ingresa nro notaria">
</div>    
<div class=" flex flex-col">
    <label class=" text-sm font-Nunito text-slate-900 mb-2">Nro Poder</label>     
    <input v-model="nro_poder" :disabled="activeRazonSocial" :class="activeRazonSocial===true ?'bg-gray-300' :'bg-transparent'" type="text" class=" rounded-xl border border-gray-300 p-2 placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 uppercase placeholder:lowercase " placeholder=" Ingresa nro poder">
</div>
<div class=" flex flex-col">
    <label class=" text-sm font-Nunito text-slate-900 mb-2">Notaria</label>     
    <input v-model="notaria" :disabled="activeRazonSocial" :class="activeRazonSocial===true ?'bg-gray-300' :'bg-transparent'" type="text" class=" rounded-xl border border-gray-300 p-2 placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 uppercase placeholder:lowercase " placeholder=" Ingresa la notaria">
</div>
</div>    
<div class="grid grid-cols-3 gap-x-2 mb-4">
<div class=" flex flex-col">
    <label class="text-sm font-Nunito text-slate-800 ">Fecha Inscripcion</label>
    <div class="flex flex-row relative">
                            <flat-pickr
                            v-model="fecha_inscripcion"
                            :config="flatpickrConfig"
                            class=" w-2xs  appearance-none rounded-xl border border-gray-300 bg-transparent bg-none p-2.5   text-sm text-slate-800 shadow-theme-xs placeholder:text-gray-700 focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10"
                            placeholder="ingrese fecha"/>
                            <span
                            class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-10 top-1/2 dark:text-gray-400">
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
    <p v-show="errors.fecha_inscripcion" class=" text-xs text-red-600 animate__animated animate__backInUp">!Este campo es obligatorio fecha vacia</p>
</div>
<div class="flex flex-col">
<label class=" text-sm font-Nunito text-slate-900">Nit</label>
<input v-model="nit" type="text" class=" rounded-xl border border-gray-300 p-2 placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 uppercase placeholder:lowercase" placeholder="ingresa tu Nit ej:786848353">    
<p v-show="errors.nit" class=" text-xs text-red-600 animate__animated animate__backInUp">!campo obligatorio / numero invalido</p>
</div>
<div class="flex flex-col">
    <label class="text-sm font-Nunito text-slate-900  ">Sector empresa</label>    
    <select class=" text-sm p-2 border border-gray-200 rounded-xl placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10">    
    <option value="" disabled selected>Seleccione</option>
    <option v-for="(item,index) in tipos" :key="index">{{ item }}</option>
</select>

</div>
</div> 
<div class=" flex flex-col mt-4">
    <label class="text-sm font-Nunito text-slate-900 mb-2">Actividad principal</label>     
    <input v-model="actividad_principal" type="text" class="  rounded-xl border border-gray-300 p-2 placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 uppercase placeholder:lowercase " placeholder="actividad principal de la empresa">
    <p v-show="errors.actividad_principal" class=" text-xs text-red-600 animate__animated animate__backInUp">!Este campo es obligatorio actividad principal vacio</p>
</div>
<div class=" flex flex-col mt-4">
    <label class="text-sm font-Nunito text-slate-900 mb-2">Actividad secundaria</label>
    <div class=" flex flex-row space-x-2">
        <input v-model="actividad_s" type="text" class=" w-2xl rounded-xl border border-gray-300 p-2 placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 uppercase placeholder:lowercase " placeholder="actividad secundaria de la empresa">
        <button @click="agregarActividad" type="button" class=" text-slate-950 cursor-pointer bg-gray-300 w-20 p-2 rounded-xl">Agregar</button>
    </div>
    <div class=" mt-5 flex flex-row">
        <ul class="grid grid-cols-4 gap-x-5">
            <li class=" p-2  border-2 mb-2 border-gray-300 font-Nunito text-md w-3sm rounded-lg" v-for="(item,index) in actividad_secundaria" :key="index">{{ item }}</li>
        </ul>
    </div>     
    
</div>
<!-- division direccion de la empresa-->
 <p class=" font-Nunito text-lg text-slate-900 mb-4">Direccion de la empresa</p>
<div class="grid grid-cols-3 gap-x-2 mb-4">
<div class="flex flex-col">
<label class=" font-Nunito text-sm text-slate-900 mb-2">Departamento</label>
<select v-model="selected_departamento" class=" p-2 border border-gray-200 rounded-xl placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10  ">
<option value="" selected disabled>Selecciona el departamento</option>
<option v-for="item in departamento"  :key="item.value" :value="item.text" >{{ item.text }}</option>    
</select>
</div>    
<div class=" flex flex-col">
<label class=" text-sm font-Nunito text-slate-900 mb-2">Municipio</label>     
<input v-model="municipio" type="text" class="  rounded-xl border border-gray-300 p-2 placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 uppercase placeholder:lowercase " placeholder=" Ingresa nombre completo">
</div>
<div class=" flex flex-col">
<label class=" text-sm font-Nunito text-slate-900 mb-2">Zona</label>     
<input v-model="zona" type="text" class="  rounded-xl border border-gray-300 p-2 placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 uppercase placeholder:lowercase " placeholder=" Ingresa nombre completo">
</div>
</div>
<div class="grid grid-cols-3 gap-x-2">
<div class=" flex flex-col">
<label class=" text-sm font-Nunito text-slate-900 mb-2">Tipo de via</label>     
<select v-model="via" class=" p-2 border border-gray-200 rounded-xl placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10  ">
    <option value="" selected disabled>Selecciona tipo de via</option>
    <option v-for="item in tipo_via"  :key="item.value" :value="item.text" >{{ item.text }}</option>    
</select>
</div>
<div class="flex flex-col">
<label class=" text-sm font-Nunito text-slate-900 mb-2">Nombre de la via</label>     
<input v-model="nombre_via" type="text" class="  rounded-xl border border-gray-300 p-2 placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 uppercase placeholder:lowercase " placeholder=" Ingresa nombre de la via">
</div>
<div class="flex flex-col">
<label class=" text-sm font-Nunito text-slate-900 mb-2">Numero domicilio/ puerta</label>     
<input v-model="nro_puerta" type="text" class="  rounded-xl border border-gray-300 p-2 placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 uppercase placeholder:lowercase " placeholder="numero de puerta">
</div>
</div>
<div class=" flex flex-col mt-4">
    <label class="text-sm font-Nunito text-slate-900 mb-2">Referencias</label>     
    <input v-model="referencias" type="text" class="  rounded-xl border border-gray-300 p-2 placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 uppercase placeholder:lowercase " placeholder="referencias de la direccion">
</div>
<p class=" font-Nunito text-lg text-slate-900 mt-4 mb-4">Registro Usuario en el sistema</p>
<div class="grid grid-cols-2 gap-x-2 mt-4">
    <div class="flex flex-col">
        <label class="text-sm font-Nunito text-slate-900 mb-2">Correo Electronico</label>     
        <input v-model="correo_electronico" type="text" class="  rounded-xl border border-gray-300 p-2 placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 " placeholder="ingrese correo electronico empresarial">
        <p v-show="errors.correo_electronico" class=" text-xs text-red-600 animate__animated animate__backInUp">!Este campo es obligatorio/correo invalido</p>
    </div>
    <div class="flex flex-col">
        <label class="text-sm font-Nunito text-slate-900 mb-2">Contraseña</label>     
        <input v-model="pass" type="text" class="  rounded-xl border border-gray-300 p-2 placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 " placeholder="ingrese una contraseña segura mayor a 8 y menor a 12 caracteres">
        <p v-show="errors.password" class=" text-xs text-red-600 animate__animated animate__backInUp">!campo obligatorio contraseña/ contraseña invalida</p>
    </div>
    
</div>
<p class=" font-Nunito text-lg text-slate-900 mt-4 mb-4">Procesos de Contabilidad</p>
<div class=" grid grid-cols-2 mt-4 gap-x-1 ">
<button type="button" disabled class="bg-yellow-500 p-2 w-2sm text-white font-Nunito text-md rounded-lg">Automatico</button>
<button type="button" disabled class="bg-yellow-500 p-2 w-2sm text-white font-Nunito text-md rounded-lg">Manual</button>
</div>
<p class=" text-slate-900 text-sm font-Nunito">Selecciona si los procesos de contabilidad seran automaticos o manuales</p>


<button type="submit"   class=" w-full bg-green-500 py-2 px-8 rounded-lg text-white mt-5 mb-5 font-Nunito cursor-pointer">Registrar Nuevo</button>
</form>
</div>    
<div class=" flex flex-col mt-20 ml-30">
    <img :src="image1" @error="image1=image2" alt="no se pudo cargar la imagen" width="500px" height="500px"> 
</div>
</div>


</template>