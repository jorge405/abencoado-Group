<script>
import sidebar from '@/assets/layout/sidebar.vue';    
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import axios from 'axios';
export default {
    name:'perfilEmpresa',
    data(){
        return{
            gestion:[
                {value:'2027',text:'2027'},
                {value:'2026',text:'2026'},
                {value:'2025',text:'2025'},
                {value:'2024',text:'2024'},
                {value:'2023',text:'2023'},
                {value:'2022',text:'2022'},
                {value:'2021',text:'2021'},
                {value:'2020',text:'2020'},
                {value:'2019',text:'2019'},
                {value:'2018',text:'2018'},
                {value:'2017',text:'2017'},
                {value:'2016',text:'2016'},
                {value:'2015',text:'2015'},
                {value:'2014',text:'2014'},
                {value:'2013',text:'2013'},
                {value:'2012',text:'2012'},
                {value:'2011',text:'2011'},
            ],
            selectedGestion:'',
            infoEmpresa:[{
                cod_empresa:'',
                razon_social:'',
                nombre_propietario:'',
                nit:'',
                departamento:'',
                municipio:'',
                tipo_via:'',
                nombre_via:'',
                nro_testimonio:'',
                nro_poder:'',
                notaria:'',
                direccion:'',
                zona:'',
                nro_puerta:'',
                referencias:'',
                actividad_principal:''
            }],
            tipo_empresa:'',
            fecha_inscripcion:'',
            mostrarEmpresa:true,
            actividad_secundaria:[],
            cod_empresa:''

        }
    },
    mounted(){
        this.InfoEmpresa();
        
    },
    methods:{ 
        async InfoEmpresa(){
            const token = Cookies.get('token');
            try { 
                 
                const responseInfoEmpresa= await axios.post('http://localhost:3000/abencoado/infoEmpresa',{
                    token
                }) 
                if (responseInfoEmpresa.data.estado==='ok') {
                    console.log(responseInfoEmpresa.data.data)
                    this.infoEmpresa[0].cod_empresa=responseInfoEmpresa.data.data[0].cod_empresa;
                    this.infoEmpresa[0].razon_social=responseInfoEmpresa.data.data[0].razon_social;
                    this.infoEmpresa[0].nombre_propietario=responseInfoEmpresa.data.data[0].nombre_propietario;
                    this.infoEmpresa[0].nit=responseInfoEmpresa.data.data[0].nit;
                    this.infoEmpresa[0].departamento=responseInfoEmpresa.data.data[0].departamento;
                    this.infoEmpresa[0].municipio=responseInfoEmpresa.data.data[0].municipio;
                    this.infoEmpresa[0].tipo_via=responseInfoEmpresa.data.data[0].tipo_via;
                    this.infoEmpresa[0].nombre_via=responseInfoEmpresa.data.data[0].nombre_via;
                    this.infoEmpresa[0].nro_puerta=responseInfoEmpresa.data.data[0].nro_puerta;
                    this.infoEmpresa[0].nro_testimonio=responseInfoEmpresa.data.data[0].nro_testimonio;
                    this.infoEmpresa[0].nro_poder=responseInfoEmpresa.data.data[0].nro_poder;
                    this.infoEmpresa[0].notaria=responseInfoEmpresa.data.data[0].notaria;
                    this.tipo_empresa=responseInfoEmpresa.data.data[0].tipo_empresa;
                    this.fecha_inscripcion=responseInfoEmpresa.data.data[0].fecha_inscripcion;
                    this.infoEmpresa[0].zona=responseInfoEmpresa.data.data[0].zona;
                    this.infoEmpresa[0].referencias=responseInfoEmpresa.data.data[0].referencias;
                    this.infoEmpresa[0].actividad_principal=responseInfoEmpresa.data.data[0].actividad_principal;

                    const fecha=responseInfoEmpresa.data.data[0].fecha_inscripcion;
                    
                } 
             
                const responseActividadSecundaria= await axios.get(`http://localhost:3000/abencoado/infoActividadSecundaria/${parseInt(this.infoEmpresa[0].cod_empresa)}`)

                if (responseActividadSecundaria.data.estado==='vacio') {
                    return this.actividad_secundaria=[];
                }
                if(responseActividadSecundaria.data.estado==='ok'){
                    
                    this.actividad_secundaria=responseActividadSecundaria.data.rows[0].actividad_secundaria;
                    console.log(this.actividad_secundaria)
                }
            } catch (error) {
                console.error('error en el servidor:', error);
                Swal.fire({ 
                    icon:'error',
                    title:'Abencoado Group',
                    text:'Error al cargar la informacion de la empresa'
                }) 
            }
        },
        
    },
    watch:{
        tipo_empresa(newval){
            if (newval==='Unipersonal') {
                this.mostrarEmpresa=false
            }else{
                this.mostrarEmpresa=true;
            }
        }
    },
    computed:{
        formatFecha(){
            if (!this.fecha_inscripcion) return '';
            // Intenta parsear como fecha ISO/Date
            const d = new Date(this.fecha_inscripcion);
            if (!isNaN(d)){
                const day = String(d.getDate()).padStart(2,'0');
                const month = String(d.getMonth() + 1).padStart(2,'0');
                const year = d.getFullYear();
                return `${day}/${month}/${year}`;
            }
            // Fallback para formatos tipo 'YYYY-MM-DD' o 'YYYY/MM/DD'
            const parts = String(this.fecha_inscripcion).split(' ')[0].split(/[-\/]/);
            if (parts.length === 3 && parts[0].length === 4){
                return `${parts[2]}/${parts[1]}/${parts[0]}`;
            }
            // Si no se puede formatear, devuelve la cadena original
            return String(this.fecha_inscripcion);
        }
    },
    components:{
        sidebar
    }
}    
</script>

<template>
<sidebar>
    <template #title>Perfil Empresa</template>
    <div class="flex flex-row mx-auto space-x-5">
        <div class=" mt-10 bg-gray-200 p-5 rounded-lg w-3xl h-3/5 ml-40">
            <p class=" text-slate-900 font-Nunito text-xl mt-5 ">Informacion de la Empresa</p>
            <div class=" grid grid-cols-4 mx-2 ">
                <div class=" flex flex-col">
                    <p class=" text-slate-900 font-Nunito text-sm mt-5">Razon Social/Nombre </p>
                    <p class=" text-slate-900 font-Nunito text-md mt-2">{{infoEmpresa[0].nombre_propietario}} </p>
                </div>
                <div class=" flex flex-col">
                    <p class=" text-slate-900 font-Nunito text-sm mt-5">Nit </p>
                    <p class=" text-slate-950 font-Nunito text-md mt-2">{{ infoEmpresa[0].nit }} </p>
                </div>
                <div class=" flex flex-col">
                    <p class=" text-slate-900 font-Nunito text-sm mt-5">Fecha Inscripcion </p>
                    <p class=" text-slate-950 font-Nunito text-md mt-2">{{ formatFecha || '—' }}</p>
                </div>
                <div class=" flex flex-col">
                    <p class=" text-slate-900 font-Nunito text-sm mt-5">Departamento </p>
                    <p class=" text-slate-950 font-Nunito text-md mt-2">{{ infoEmpresa[0].departamento }} </p>
                </div>
                
            </div>
            <div class=" grid grid-cols-4 mx-2" v-if="mostrarEmpresa" >
                <div class=" flex flex-col">
                    <p class=" text-slate-900 font-Nunito text-sm mt-5">Nro Testimonio </p>
                    <p class=" text-slate-950 font-Nunito text-md mt-2">{{ infoEmpresa[0].nro_testimonio }} </p>
                </div>
                <div class=" flex flex-col">
                    <p class=" text-slate-900 font-Nunito text-sm mt-5">Nro Poder </p>
                    <p class=" text-slate-950 font-Nunito text-md mt-2">{{ infoEmpresa[0].nro_poder }} </p>
                </div>
                <div class=" flex flex-col">
                    <p class=" text-slate-900 font-Nunito text-sm mt-5">Notaria </p>
                    <p class=" text-slate-950 font-Nunito text-md mt-2">{{ infoEmpresa[0].notaria }} </p>
                </div>
                <div class=" flex flex-col">
                    <p class=" text-slate-900 font-Nunito text-sm mt-5">Departamento </p>
                    <p class=" text-slate-950 font-Nunito text-md mt-2">{{ infoEmpresa[0].departamento }} </p>
                </div>
            </div>
            <div class=" grid grid-cols-4 mx-2">
                <div class=" flex flex-col">
                    <p class=" text-slate-900 font-Nunito text-sm mt-5">Municipio </p>
                    <p class=" text-slate-950 font-Nunito text-md mt-2">{{ infoEmpresa[0].municipio }}</p>
                </div>
                <div class=" flex flex-col">
                    <p class=" text-slate-900 font-Nunito text-sm mt-5">Zona </p>
                    <p class=" text-slate-950 font-Nunito text-md mt-2">{{ infoEmpresa[0].zona }}</p>
                </div>
                <div class=" flex flex-col">
                    <p class=" text-slate-900 font-Nunito text-sm mt-5">Tipo via </p>
                    <p class=" text-slate-950 font-Nunito text-md mt-2">{{ infoEmpresa[0].tipo_via }}</p>
                </div>
                <div class=" flex flex-col">
                    <p class=" text-slate-900 font-Nunito text-sm mt-5">Nombre de via </p>
                    <p class=" text-slate-950 font-Nunito text-md mt-2">{{ infoEmpresa[0].nombre_via }}</p>
                </div>
            
            </div>
            <div class="grid grid-cols-4 mx-2">
                <div class=" flex flex-col">
                    <p class=" text-slate-900 font-Nunito text-sm mt-5">Nro puerta </p>
                    <p class=" text-slate-950 font-Nunito text-md mt-2">{{ infoEmpresa[0].nro_puerta }}</p>
                </div>
                <div class=" flex flex-col">
                    <p class=" text-slate-900 font-Nunito text-sm mt-5">Referencias </p>
                    <p class=" text-slate-950 font-Nunito text-md mt-2">{{ infoEmpresa[0].referencias }}</p>
                </div>
                <div class=" flex flex-col">
                    <p class=" text-slate-900 font-Nunito text-sm mt-5">Actividad Principal </p>
                    <p class=" text-slate-950 font-Nunito text-md mt-2">{{ infoEmpresa[0].actividad_principal }}</p>
                </div>
            </div>
            <div class="grid grid-cols-1 mx-2">
                <div class=" flex flex-col">
                    <p class=" text-slate-900 font-Nunito text-sm mt-5">Actividad Secundaria </p>
                    <ul class="flex flex-row flex-wrap gap-2">
                        <li v-for="(actividad,index) in actividad_secundaria" :key="index" class="bg-blue-400 px-3 py-1 rounded-lg text-slate-900 font-Nunito text-md">
                            {{ actividad }}
                        </li>
                    </ul>
                </div>
            </div>
            
            
        </div>
        <div class=" flex flex-col">
            <div class=" flex flex-col mx-auto cursor-pointer ">
                <p class="text-2xl font-Nunito font-semibold text-slate-900 mt-10 mx-auto">{{ infoEmpresa[0].razon_social || infoEmpresa[0].nombre_propietario }}</p>
                <img src="../assets/fotoPerfil.png" alt="no cargo la imagen" class=" w-50 h-50 rounded-full mt-10 mb-5 object-cover">
            </div>
            <div class=" flex flex-col space-x-5 items-center mt-15">
                <p class=" text-md font-Nunito text-slate-900">Gestion:</p>
                    <input v-model="selectedGestion"  type="text" class=" w-xs  rounded-xl border border-gray-300 p-2 placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 " placeholder=" Ingresa gestion ejemplo:2023">
            </div>
        <div class=" flex flex-row space-x-5">
            <button  class=" bg-blue-950 rounded-lg p-2 w-xs text-white mt-5 cursor-pointer">Crear Nueva gestion</button>
            <button  class=" bg-blue-950 rounded-lg p-2 w-xs text-white mt-5 cursor-pointer">Crear Reapertura</button>
        </div>
        </div>
        
        
        
    </div>
</sidebar>

</template>