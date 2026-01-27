<script>
import sidebar from '@/assets/layout/sidebar.vue';    
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
            selectedGestion:''
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
    <div class="flex flex-col mx-auto">
        <div class=" flex flex-col mx-auto cursor-pointer ">
        <p class="text-2xl font-Nunito font-semibold text-slate-900 mt-10 mx-auto">Lidita Group</p>
        <img src="../assets/fotoPerfil.png" alt="no cargo la imagen" class=" w-60 h-60 rounded-full mt-10 mb-5 object-cover">
        </div>
        <div class=" flex flex-row space-x-5 items-center">
        <p class=" text-md font-Nunito text-slate-900">Gestion:</p>
        <div>
            <select v-model="selectedGestion" class=" p-2 border w-sm border-gray-200 rounded-xl placeholder:text-sm focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10">
            <option value="" class=" text-gray-700 font-Nunito text-md"  selected disabled>selecciona una opcion</option>
            <option v-for="item in gestion"  :key="item.value" :value="item.text" >{{ item.text }}</option>    
            </select>
        </div>
        </div>
        <div class=" flex flex-row space-x-5">
            <button  class=" bg-green-600 rounded-lg p-2 w-lg text-white mt-5 cursor-pointer">Crear Nueva gestion</button>
            <button  class=" bg-green-600 rounded-lg p-2 w-lg text-white mt-5 cursor-pointer">Crear Reapertura</button>
        </div>
        <div class=" mt-10 bg-gray-200 p-5 rounded-lg w-7xl">
            <p class=" text-slate-900 font-Nunito text-xl mt-5 ">Informacion de la Empresa</p>
            <div class=" grid grid-cols-4">
                <div class=" flex flex-col">
                    <p class=" text-slate-900 font-Nunito text-sm mt-5">Razon Social/Nombre </p>
                    <p class=" text-slate-900 font-Nunito text-md mt-2">Ejemplo </p>
                </div>
                <div class=" flex flex-col">
                    <p class=" text-slate-900 font-Nunito text-sm mt-5">Nit </p>
                    <p class=" text-slate-950 font-Nunito text-md mt-2">68483935 </p>
                </div>
                <div class=" flex flex-col">
                    <p class=" text-slate-900 font-Nunito text-sm mt-5">Fecha Inscripcion </p>
                    <p class=" text-slate-950 font-Nunito text-md mt-2">31/09/2015</p>
                </div>
                <div class=" flex flex-col">
                    <p class=" text-slate-900 font-Nunito text-sm mt-5">Departamento </p>
                    <p class=" text-slate-950 font-Nunito text-md mt-2">Lapaz </p>
                </div>
                
            </div>
            <div class=" grid grid-cols-4">
                <div class=" flex flex-col">
                    <p class=" text-slate-900 font-Nunito text-sm mt-5">Municipio </p>
                    <p class=" text-slate-950 font-Nunito text-md mt-2"> nuestra señora lapaz</p>
                </div>
                <div class=" flex flex-col">
                    <p class=" text-slate-900 font-Nunito text-sm mt-5">Tipo division geografica </p>
                    <p class=" text-slate-950 font-Nunito text-md mt-2"> ladera</p>
                </div>
                <div class=" flex flex-col">
                    <p class=" text-slate-900 font-Nunito text-sm mt-5">Tipo via </p>
                    <p class=" text-slate-950 font-Nunito text-md mt-2"> avenida</p>
                </div>
                <div class=" flex flex-col">
                    <p class=" text-slate-900 font-Nunito text-sm mt-5">Nombre de via </p>
                    <p class=" text-slate-950 font-Nunito text-md mt-2"> av heroes del pacifico</p>
                </div>
                
                
            </div>
            
            <div></div>
        </div>
    </div>
</sidebar>

</template>