<script>
import sidebar from '@/assets/layout/sidebar.vue';
import api from '@/services/api.js';
import Swal from 'sweetalert2';
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
        headers:['Clase','Grupo','Subgrupo','Cuenta principal','Cuenta analitica','Nombre de Cuenta','Debe','Haber','Saldo Debe', 'Saldo Haber'],
        dataSumaSaldos:[],
        key:'abencoadoGroup',
        mostrarSumaYSaldo:true
    }
},
mounted(){
    this.sumasYsaldos();
},
methods:{
    async sumasYsaldos(){
         const decryptEmpresa=CryptoJS.AES.decrypt(Cookies.get('emp'),this.key).toString(CryptoJS.enc.Utf8); 
        try {
            const responseSumasySaldos= await api.post('/getSumasySaldos',{
                cod_empresa:parseInt(decryptEmpresa)
            })
            
            if (responseSumasySaldos.data.status==='vacio') {
                Toast.fire({
                    icon:'info', 
                    text:'No se genero el reporte de sumas y saldos'
                })
                this.dataSumaSaldos=[]
            }else if(responseSumasySaldos.data.status==='ok'){
                Toast.fire({
                    icon:'success',
                    text:'Reporte generado exitosamente'
                })
                const arrayRestructurado= responseSumasySaldos.data.rows.map(item=>{
                    const cod=item.codigo_cuenta;
                    const valorSaldo= parseFloat(item.saldo || 0);
                    return{
                        ...item,
                        clase:cod.substring(0,1),
                        grupo:cod.substring(1,2),
                        subgrupo:cod.substring(2,3),
                        cuenta_principal:cod.substring(3,6),
                        cuenta_analitica:cod.substring(6,9),
                        saldo_debe:valorSaldo >= 0 ? valorSaldo.toFixed(2):"0.00",
                        saldo_haber:valorSaldo<= 0 ? valorSaldo.toFixed(2): "0.00"
                    }
                })
                this.dataSumaSaldos=arrayRestructurado;
                
            }
        } catch (error) {
            console.log('ha ocurido un error en el servidor: ',error);
            Toast.fire({
                icon:'error',
                text:'error en el servidor'
            })
        }
    },
    MostrarEstadoResultado(){
        this.$router.push('/estadoResultados');
        this.mostrarSumaYSaldo=false;
    },
    MostrarBalanceGeneral(){
        this.$router.push('/balanceGeneral');
        this.mostrarSumaYSaldo=false;
    }
},
computed: {
    // Calculamos los totales generales basados en el array de la View
   totalesSumasSaldos() {
    // Inicializamos el acumulador con las 4 columnas necesarias
    const inicial = { 
        debe: 0, 
        haber: 0, 
        s_debe: 0, 
        s_haber: 0 
    };
    
    const resultado = this.dataSumaSaldos.reduce((acc, fila) => {
        // 1. Sumamos las columnas de SUMAS (Totales de la View)
        acc.debe += parseFloat(fila.total_debe || 0);
        acc.haber += parseFloat(fila.total_haber || 0);

        // 2. Sumamos las columnas de SALDOS (Las que reestructuramos con signo)
        acc.s_debe += parseFloat(fila.saldo_debe || 0);
        acc.s_haber += parseFloat(fila.saldo_haber || 0);

        return acc;
    }, inicial);

    // Retornamos todo formateado a 2 decimales
    return {
        debe: resultado.debe.toFixed(2),
        haber: resultado.haber.toFixed(2),
        saldo_debe: resultado.s_debe.toFixed(2),
        // Aquí se mostrará la suma total, manteniendo los signos si los hay
        saldo_haber: resultado.s_haber.toFixed(2) 
    };
}
},
components:{
    sidebar
}




}
</script>


<template>
<sidebar>
<template v-if="mostrarSumaYSaldo" #title>Balance de SUMAS Y SALDOS</template> 
<!-- table de sumas y saldos-->    
<div class=" flex flex-col ml-45" v-if="mostrarSumaYSaldo">
    
    <div class="flex flex-row space-x-5">
        <p class="text-slate-900 text-sm font-Nunito">Del 1 de enero de 2025 al 31 de diciembre de 2025</p>
    </div>
    
    <div class=" flex bg-gray-100 w-7xl min-h-11/12 2xl:w-7xl 2xl:h-10/12 mb-5 rounded-lg p-8 ">
        
        <!-- tabla lista libro mayor-->
        <div class="flex flex-col bg-gray-100 border border-gray-200 w-6xl min-h-11/12 mt-5  p-4 rounded-lg">
            <div class="flex flex-row px-4">
                <button  class=" p-1.5 text-sm text-white bg-blue-950 rounded-lg font-Nunito cursor-pointer">Sumas Y Saldos</button>
                <button @click="MostrarEstadoResultado" class=" p-1.5 text-sm text-white bg-blue-950 rounded-lg font-Nunito cursor-pointer">Estado de Resultados</button>
                <button @click="MostrarBalanceGeneral" class=" p-1.5 text-sm text-white bg-blue-950 rounded-lg font-Nunito cursor-pointer">Balance General</button>
            </div>
            
            <div class="flex-1 mt-7  overflow-y-auto px-4 ">
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
                <tr v-if="!dataSumaSaldos.length" class=" flex  justify-center text-gray-500 mt-8 mx-auto h-52">
                    <td class=" text-sm font-Nunito ">No se encontraron Datos</td>
                </tr>
                <tr v-for="(prod, index) in dataSumaSaldos" :key="index" class="bg-white  hover:bg-gray-200 ">
                    <td  class="px-4 py-2  whitespace-nowrap cursor-pointer">
                    {{ prod.clase }}
                    </td>
                    
                    <td  class="px-4 py-2  whitespace-nowrap cursor-pointer">
                    {{ prod.grupo }}
                    </td>
                    <td class="px-4 py-2  whitespace-nowrap cursor-pointer">
                    {{ prod.subgrupo }}
                    </td>
                    <td class="px-4 py-2 cursor-pointer">
                    {{ prod.cuenta_principal }}
                    </td>
                    <td class="px-4 py-2 text-left cursor-pointer">
                    {{ prod.cuenta_analitica }}
                    </td>
                    <td class="px-4 py-2 text-left cursor-pointer">
                    {{ prod.nombre_cuenta }}
                    </td>
                    <td class="px-4 py-2  whitespace-nowrap cursor-pointer">
                    {{ prod.total_debe}}
                    </td>
                    <td class="px-4 py-2  whitespace-nowrap cursor-pointer">
                    {{ prod.total_haber}}
                    </td>
                    <td class="px-4 py-2  whitespace-nowrap cursor-pointer text-blue-800 font-semibold">
                    {{ prod.saldo_debe}}
                    </td>
                    <td class="px-4 py-2  whitespace-nowrap cursor-pointer" :class="{'text-red-600 font-semibold': prod.saldo_haber.startsWith('-')}">
                    {{ prod.saldo_haber}}
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
            <div class="grid grid-cols-2 w-full mt-8">
                
                <div class="flex flex-row px-3 space-x-2 items-end">
                    <button  class=" flex flex-row items-center justify-center w-40 h-10 cursor-pointer bg-blue-950 text-white font-Nunito p-1.5 text-xs font-bold rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="#568cf1" d="M8 21q-.825 0-1.412-.587T6 19v-2H4q-.825 0-1.412-.587T2 15v-4q0-1.275.875-2.137T5 8h14q1.275 0 2.138.863T22 11v4q0 .825-.587 1.413T20 17h-2v2q0 .825-.587 1.413T16 21zM18 7H6V5q0-.825.588-1.412T8 3h8q.825 0 1.413.588T18 5zm0 5.5q.425 0 .713-.288T19 11.5t-.288-.712T18 10.5t-.712.288T17 11.5t.288.713t.712.287M8 19h8v-4H8z"/></svg>Imprimir</button>
                </div>
                <div class=" flex flex-row space-x-2 items-center justify-end mr-15">
                    <p class=" text-sm font-Nunito text-slate-900">Totales</p>
                    <input :value="totalesSumasSaldos.debe" type="text" disabled class=" w-20 bg-white text-sm p-2 rounded-xl border border-gray-200  placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="">
                    <input :value="totalesSumasSaldos.haber" type="text" disabled class=" w-20 bg-white text-sm p-2 rounded-xl border border-gray-200  placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="">
                    <input :value="totalesSumasSaldos.saldo_debe" type="text" disabled class=" w-20 bg-white text-sm p-2 rounded-xl border border-gray-200  placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" placeholder="">
                    <input :value="totalesSumasSaldos.saldo_haber" type="text" disabled class=" w-20 bg-white text-sm p-2 rounded-xl border border-gray-200  placeholder:text-xs focus:border-sky-300 focus:outline-hidden focus:ring-3 focus:ring-sky-400/10" :class="{'text-red-600 font-semibold': totalesSumasSaldos.saldo_haber.startsWith('-')}" placeholder="">
                </div>
                
            </div>
        </div>
             
    </div>
    
</div>

</sidebar>    
</template>