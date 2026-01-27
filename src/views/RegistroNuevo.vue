<script>
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'

export default{

    name:'RegistroNuevo',
    data(){
        return{
        tip_empresa:[
            {value:'Juridica',text:'Juridica'},
            {value:'Sociedad de Responsabilidad Limitada (S.R.L)',text:'Sociedad de Responsabilidad Limitada (S.R.L)'},
            {value:'Sociedad Anonima (S.A)',text:'Sociedad Anonima (S.A)'},
            {value:'Sociedad de Economia Mixta',text:'Sociedad de Economia Mixta'},
            {value:'Unipersonal',text:'Unipersonal'}
        ],
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
        actividad_s:'',
        actividad_secundaria:[],
        flatpickrTimeConfig:{
            enableTime: true,
            noCalendar: true,
            dateFormat: 'H:i',
            time_24hr: false,
            minuteIncrement: 1,
            wrap: false,
        },
        selected_empresa:'',
        fecha_inscripcion:''
    }
    },
    methods:{
        agregarActividad(){
            if(this.actividad_s.trim()==='') return;
            this.actividad_secundaria.push(this.actividad_s);
            this.actividad_s='';
        }
    },
    components:{
        flatPickr
    }
    

}
</script>

<template>
<div class="grid grid-cols-2">
<div class="flex flex-col w-full mt-20 ml-10">
<p class=" font-Nunito text-lg text-slate-900 mb-5">Eres Nuevo/Registrate Aqui</p>    
<form>
<div class="grid grid-cols-3 gap-x-2 mb-4">
<div class="flex flex-col">
<label class=" font-Nunito text-sm text-slate-900 mb-2">Tipo de Empresa</label>
<select v-model="selected_empresa" class=" p-2 border border-gray-200 rounded-xl placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10  ">
<option value="" selected disabled class=" font-Nunito text-sm placeholder:text-sm ">Selecciona tipo empresa</option>
<option v-for="item in tip_empresa"  :key="item.value" :value="item.text" >{{ item.text }}</option>    
</select>
</div>
<div class="flex flex-col">
<label class=" text-sm font-Nunito text-slate-900 mb-2">Razon Social</label>     
<input type="text" class=" rounded-xl border border-gray-300 p-2 placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 " placeholder=" Ingresa la razon social de la empresa">
</div>
<div class="flex flex-col">
<label class=" text-sm font-Nunito text-slate-900 mb-2">Nombre</label>     
<input type="text" class=" rounded-xl border border-gray-300 p-2 placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 " placeholder=" Ingresa nombre completo">        
</div>
</div>
<div class="grid grid-cols-3 gap-x-2 mb-3">
<div class=" flex flex-col">
    <label class=" text-sm font-Nunito text-slate-900 mb-2">Nro testimonio</label>     
    <input type="text" class=" rounded-xl border border-gray-300 p-2 placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 " placeholder=" Ingresa nro notaria">
</div>    
<div class=" flex flex-col">
    <label class=" text-sm font-Nunito text-slate-900 mb-2">Nro Poder</label>     
    <input type="text" class=" rounded-xl border border-gray-300 p-2 placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 " placeholder=" Ingresa nro poder">
</div>
<div class=" flex flex-col">
    <label class=" text-sm font-Nunito text-slate-900 mb-2">Notaria</label>     
    <input type="text" class=" rounded-xl border border-gray-300 p-2 placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 " placeholder=" Ingresa la notaria">
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
<div class="flex flex-col">
<label class=" text-sm font-Nunito text-slate-900">Nit</label>
<input type="text" class=" rounded-xl border border-gray-300 p-2 placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="ingresa tu Nit ej:786848353">    
</div>
<div class="flex flex-col">
<label class=" text-sm font-Nunito text-slate-900">Direccion</label>
<input type="text" class=" rounded-xl border border-gray-300 p-2 placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="ingresa tu direccion">
</div>
</div> 
<div class="grid grid-cols-3 gap-x-2 mb-4">
<div class="flex flex-col">
<label class=" font-Nunito text-sm text-slate-900 mb-2">Departamento</label>
<select v-model="selected_empresa" class=" p-2 border border-gray-200 rounded-xl placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10  ">
<option value="" selected disabled>Selecciona el departamento</option>
<option v-for="item in departamento"  :key="item.value" :value="item.text" >{{ item.text }}</option>    
</select>
</div>    
<div class=" flex flex-col">
<label class=" text-sm font-Nunito text-slate-900 mb-2">Municipio</label>     
<input type="text" class="  rounded-xl border border-gray-300 p-2 placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 " placeholder=" Ingresa nombre completo">
</div>
<div class=" flex flex-col">
<label class=" text-sm font-Nunito text-slate-900 mb-2">Tipo de division geografica</label>     
<input type="text" class="  rounded-xl border border-gray-300 p-2 placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 " placeholder=" Ingresa nombre completo">
</div>
</div>
<div class="grid grid-cols-3 gap-x-2">
<div class=" flex flex-col">
<label class=" text-sm font-Nunito text-slate-900 mb-2">Tipo de via</label>     
<input type="text" class="  rounded-xl border border-gray-300 p-2 placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 " placeholder=" Ingresa nombre completo">
</div>
<div class="flex flex-col">
<label class=" text-sm font-Nunito text-slate-900 mb-2">Nombre de la via</label>     
<input type="text" class="  rounded-xl border border-gray-300 p-2 placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 " placeholder=" Ingresa nombre de la via">
</div>
<div class="flex flex-col">
<label class=" text-sm font-Nunito text-slate-900 mb-2">Numero puerta</label>     
<input type="text" class="  rounded-xl border border-gray-300 p-2 placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 " placeholder="numero de puerta">
</div>
</div>
<div class=" flex flex-col mt-4">
    <label class="text-sm font-Nunito text-slate-900 mb-2">Referencias</label>     
    <input type="text" class="  rounded-xl border border-gray-300 p-2 placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 " placeholder="referencias de la direccion">
</div>
<div class=" flex flex-col mt-4">
    <label class="text-sm font-Nunito text-slate-900 mb-2">Actividad principal</label>     
    <input type="text" class="  rounded-xl border border-gray-300 p-2 placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 " placeholder="actividad principal de la empresa">
</div>
<div class=" flex flex-col mt-4">
    <label class="text-sm font-Nunito text-slate-900 mb-2">Actividad secundaria</label>
    <div class=" flex flex-row space-x-2">
        <input v-model="actividad_s" type="text" class=" w-3xl rounded-xl border border-gray-300 p-2 placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 " placeholder="actividad secundaria de la empresa">
        <button @click="agregarActividad" type="button" class=" bg-gray-300 w-20 p-2 rounded-xl"><span class=" inline-block"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"/><path fill="#354745" d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4v4a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-4H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h4z"/></g></svg></span></button>
    </div>
    <div class=" mt-5 flex flex-row">
        <ul class="grid grid-cols-2 gap-x-18">
            <li class=" p-2 border-2 mb-2 border-gray-300 font-Nunito text-md w-sm rounded-lg" v-for="(item,index) in actividad_secundaria" :key="index">{{ item }}</li>
        </ul>
    </div>     
    
</div>
<div class="flex flex-col mt-4">
    <label class="text-sm font-Nunito text-slate-900 mb-2">Correo Electronico</label>     
    <input type="text" class="  rounded-xl border border-gray-300 p-2 placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10 " placeholder="ingrese correo electronico empresarial">
    <p class=" text-slate-900 text-sm font-Nunito">Una vez ingresado su correo electronico se creara una contraseña que se mandara al correo ingresado</p>
</div>
<div class=" flex flex-row mt-4 space-x-1">
<button class="bg-yellow-500 p-2 w-sm text-white font-Nunito text-md rounded-lg">Automatico</button>
<button class="bg-yellow-500 p-2 w-sm text-white font-Nunito text-md rounded-lg">Manual</button>
</div>
<p class=" text-slate-900 text-sm font-Nunito">Selecciona si los procesos de contabilidad seran automaticos o manuales</p>

</form>
<button type="button" class="w-3xl bg-green-500 p-2 rounded-lg text-white mt-5 mb-5 font-Nunito">Reistrar Nuevo</button>
</div>    
<div class=" flex flex-col mt-20 ml-30">
    <img src="@/assets/fondoRegistro.svg" alt="registro" width="500px" height="500px"> 
</div>
</div>


</template>