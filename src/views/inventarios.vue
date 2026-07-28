
<script>
import sidebar from '@/assets/layout/sidebar.vue';

export default{
    data(){
        return{
            headers:['Nombre producto','Cantidad','Precio','descripcion','Fecha ingreso','Fecha salida','Tipo inventario'],
            datoslibrofecha:[
                {id:1,nombreProducto:'Cuaderno espiral',cantidad:2,precio:10.00,descripcion:'cuaderno de 100 hojas',fechaIngreso:'2024-06-01',fechaSalida:'2024-06-10',tipo:'ingreso'},
                {id:2,nombreProducto:'boligrafo sabonis',cantidad:5,precio:4.50,descripcion:'boligrafo azul punta fina',fechaIngreso:'2024-06-01',fechaSalida:'2024-06-10',tipo:'egreso'},
                {id:3,nombreProducto:'goma eva blanca',cantidad:2,precio:3.50,descripcion:'goma eva color blanco con brillo',fechaIngreso:'2024-06-01',fechaSalida:'2024-06-10',tipo:'ingreso'}
            ],
            modalInventario:false,
            modalRegistroIngreso:false,
        }
    },
    methods:{
        abrirModalRegistro(){
            this.modalInventario=false;
            this.modalRegistroIngreso=true;
        }
    },
    components:{
        sidebar
    }
}


</script>
<template>
<sidebar>
    <template  #title>Inventarios</template>
<div class="flex flex-col  ml-55 bg-gray-200 p-6 w-6xl max-h-11/12 my-5 rounded-xl" >
    <div class="flex flex-row space-x-30 justify-between">
        <button @click="modalInventario=true" class="p-2 bg-blue-950 text-white text-Nunito
         text-xs rounded-xl w-50 cursor-pointer">Nuevo Inventario</button>
        <div class="flex flex-row w-full bg-transparent">
            <button class="p-2 bg-blue-950 text-white text-Nunito text-xs rounded-xl w-40 cursor-pointer">Lista Ingresos</button>
            <button class="p-2 bg-blue-950 text-white text-Nunito text-xs rounded-xl w-40 cursor-pointer">Lista Egresos</button>
        </div>
    </div>
    <div class="flex flex-row space-x-10 w-full mt-4">
        <input class="p-2 bg-white w-75 focus:outline-none focus:ring-2 focus:ring-sky-200 text-sm placeholder:text-gray-700 placeholder:text-xs font-Outfit rounded-xl" placeholder="Buscar producto" type="text">
    </div>
    
    <div class=" flex-1 mt-7 max-h-96 overflow-y-auto">            
        
            <table class="w-full  text-sm text-left text-gray-500">
                <!-- Encabezado Dinámico -->
                <thead class="text-xs font-Nunito text-gray-700 uppercase bg-gray-50 sticky top-0">
                <tr>
                    <th v-for="header in headers" :key="header" class="px-4 py-3">
                    {{ header }}
                    </th>
                </tr>
                </thead>
                
                <!-- Cuerpo de la Tabla -->
                <tbody class=" divide-y divide-gray-200 bg-white">
                <tr v-if="!datoslibrofecha.length" class="bg-white">
                    <td colspan="6" class="px-4 py-2 text-center text-md font-Nunito text-slate-900">
                        Datos no encontrados
                    </td>
                </tr>
                <tr v-for="prod in datoslibrofecha" :key="prod.id" class="bg-white  hover:bg-gray-100">
                    <td class="px-4 py-2 text-xs 2xl:text-sm font-Nunito  whitespace-nowrap cursor-pointer">
                    {{ prod.nombreProducto }}
                    </td>
                    <td class="px-4 py-2 text-xs 2xl:text-sm font-Nunito  whitespace-nowrap cursor-pointer">
                    {{ prod.cantidad }}
                    </td>
                    <td class="px-4 py-2 text-xs 2xl:text-sm font-Nunito cursor-pointer">
                    {{ prod.precio }}
                    </td>
                    <td class="px-4 py-2 text-xs 2xl:text-sm font-Nunito text-left cursor-pointer">
                    {{ prod.descripcion }}
                    </td>
                    <td  class="px-4 py-2 text-xs 2xl:text-sm font-Nunito text-left cursor-pointer">
                    {{ prod.fechaIngreso }}
                    </td>
                    <td class="px-4 py-2 text-xs 2xl:text-sm font-Nunito text-left cursor-pointer">
                    {{ prod.fechaSalida }}
                    </td>
                    <td class="px-4 py-2 text-xs 2xl:text-sm font-Nunito text-left cursor-pointer" :class=" prod.tipo==='ingreso' ? 'text-green-500' : 'text-red-600'">
                    {{ prod.tipo }}
                    </td>
                    
                </tr>
                </tbody>
            </table>
            </div>
</div>

<transition enter-active-class="transition duration-300 ease-out"
                    enter-from-class="opacity-0 scale-95"
                    enter-to-class="opacity-100 scale-100"
                    leave-active-class="transition duration-200 ease-in"
                    leave-from-class="opacity-100 scale-100"
                    leave-to-class="opacity-0 scale-95">
        <div v-if="modalInventario" class="fixed inset-0 flex items-center justify-around z-50">
        <div class="bg-gray-50 bg-opacity-80 text-white  ml-56 w-md p-6 rounded-lg shadow-2xl flex flex-col space-x-2">
            <p class=" text-slate-900 font-Nunito text-md font-bold mb-5 mx-auto">REGISTRO DE INVENTARIOS</p>
            <div class="flex flex-col">
                <div class="flex flex-row space-x-5">
                    <button @click="abrirModalRegistro" class="p-2 bg-blue-950 text-white text-Outfit text-xs rounded-xl w-40 cursor-pointer">Ingreso</button>
                    <button class="p-2 bg-blue-950 text-white text-Outfit text-xs rounded-xl w-40 cursor-pointer">Egreso</button>
                    <button @click="modalInventario=false" class="p-2 bg-red-800 text-white text-Outfit text-xs rounded-xl w-40 cursor-pointer">Cancelar</button>
                </div>
                
            </div>
        </div>
    </div>
</transition>
<!-- registro de inventario ingreso-->
<transition enter-active-class="transition duration-300 ease-out"
                    enter-from-class="opacity-0 scale-95"
                    enter-to-class="opacity-100 scale-100"
                    leave-active-class="transition duration-200 ease-in"
                    leave-from-class="opacity-100 scale-100"
                    leave-to-class="opacity-0 scale-95">
        <div v-if="modalRegistroIngreso" class="fixed inset-0 flex items-center justify-around z-50">
        <div class="bg-gray-50 bg-opacity-80 text-white  ml-56 w-3xl p-6 rounded-lg shadow-2xl flex flex-col space-x-2">
            <p class=" text-slate-900 font-Nunito text-md font-bold mb-5 mx-auto">REGISTRO DE INVENTARIOS</p>
            <div class="flex flex-col">
                <div class="flex flex-row space-x-10">
                    <div class="flex flex-col space-y-2">
                        <img alt="no se cargo la imagen" class=" w-30 h-auto bg-cover bg-gray-500 p-4 rounded-lg">
                        <button class="p-2 w-30 bg-green-700 text-xs font-Outfit rounded-xl cursor-pointer">Subir imagen</button>
                    </div>
                    <!-- formulario de registro-->
                     <div class="flex flex-col space-y-2">
                        <div class="flex flex-row space-x-5">
                            <div class="flex flex-col space-y-2">
                                <label class="text-xs font-outfit text-gray-500">Nombre producto</label>
                                <input class="border border-gray-300 w-60 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sky-200 text-xs font-Outfit placeholder:text-xs placeholder:text-gray-500" placeholder="nombre producto">
                            </div>
                            <div class="flex flex-col space-y-2">
                                <label class="text-xs font-outfit text-gray-500">Cantidad</label>
                                <input class="border border-gray-300 w-30 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sky-200 text-xs font-Outfit placeholder:text-xs placeholder:text-gray-500" placeholder="cantidad">
                            </div>
                            <div class="flex flex-col space-y-2">
                                <label class="text-xs font-outfit text-gray-500">Precio</label>
                                <input class="border border-gray-300 w-30 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sky-200 text-xs font-Outfit placeholder:text-xs placeholder:text-gray-500" placeholder="precio">
                            </div>
                        </div>
                        <div class="flex flex-row space-x-5">
                            <div class="flex flex-col space-y-2">
                                <label class="text-xs font-outfit text-gray-500">Fecha ingreso</label>
                                <input class="border border-gray-300 w-60 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sky-200 text-xs font-Outfit placeholder:text-xs placeholder:text-gray-500" placeholder="fecha ingreso">
                            </div>
                            <div class="flex flex-col space-y-2">
                                <label class="text-xs font-outfit text-gray-500">Fecha salida</label>
                                <input class="border border-gray-300 w-60 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sky-200 text-xs font-Outfit placeholder:text-xs placeholder:text-gray-500" placeholder="fecha salida">
                            </div>
                        </div>
                     </div>
                    
                </div>
                <div class="flex flex-col space-y-2 mt-2">
                    <textarea name="descripcion" id="" cols="20" rows="5" class=" text-gray-700 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sky-200 text-xs font-Outfit placeholder:text-xs placeholder:text-gray-500" placeholder="descripción del producto"></textarea>
                </div>
                
            </div>
            <div class="flex flex-row space-x-4 mt-5">
                <button class=" bg-blue-950 p-2 text-xs font-Outfit rounded-lg w-40 cursor-pointer">Registrar producto</button>
                <button @click="modalRegistroIngreso=false" class=" bg-red-800 p-2 text-xs font-Outfit rounded-lg w-40 cursor-pointer">Cancelar</button>
            </div>
        </div>
        
        
    </div>
</transition>
<!-- registro de inventario egreso-->
</sidebar>
</template>