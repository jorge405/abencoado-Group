<script>
import { toCanvas } from 'html-to-image';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import api from '@/services/api.js';

export default{
    props:{
        dataComprobante:Array,
        titulo:String,
        datosExtra: Object,     // Recibirá todo el objeto datosEdit del padre
        convertirMontoALetras: Function, // Pasamos la función como prop o la defines aquí
        nombreEmpresa:String,
        firmas:Array

    },
    data(){
        return{
            horaActual:'',
            HeadersComprobante:null,
            mostrarHora:null,
            mostrarFecha:null,
            configuracion:null,
            firmas:[]
        }

    },
    mounted() {
            this.actualizarHora();
            this.getConfiguraciones();
    },
    methods:{
        actualizarHora() {
          this.horaActual = new Date().toLocaleTimeString('es-ES', { 
            hour: '2-digit', minute: '2-digit', hour12: false 
          });
        },
        // --- LÓGICA DE CONVERSIÓN DE NÚMEROS A LETRAS ---
        convertirMontoALetras(total) {
              if (!total || isNaN(total)) return "CERO 00/100 BOLIVIANOS";
              
              const numero = parseFloat(total);
              const enteros = Math.floor(numero);
              const centavos = Math.round((numero - enteros) * 100);
              
              const letras = this.numeroALetras(enteros);
              const centavosFormateados = centavos.toString().padStart(2, '0');
              
              return `${letras} ${centavosFormateados}/100 BOLIVIANOS`.toUpperCase();
        },

        numeroALetras(n) {
              const unidades = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
              const decenas = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISEIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
              const decenas2 = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
              const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

              if (n === 0) return 'CERO';
              if (n === 100) return 'CIEN';

              let output = '';

              if (n >= 1000000) {
                let millones = Math.floor(n / 1000000);
                output += (millones === 1 ? 'UN MILLON ' : this.numeroALetras(millones) + ' MILLONES ');
                n %= 1000000;
              }

              if (n >= 1000) {
                let miles = Math.floor(n / 1000);
                output += (miles === 1 ? 'MIL ' : this.numeroALetras(miles) + ' MIL ');
                n %= 1000;
              }

              if (n >= 100) {
                output += centenas[Math.floor(n / 100)] + ' ';
                n %= 100;
              }

              if (n >= 20) {
                let d = Math.floor(n / 10);
                output += decenas2[d];
                if (n % 10 > 0) output += ' Y ' + unidades[n % 10];
              } else if (n >= 10) {
                output += decenas[n - 10];
              } else if (n > 0) {
                output += unidades[n];
              }

              return output.trim();
        },
        // --- GENERACIÓN DEL PDF ---
    async generarPDF(accion = 'preview') {
      const elemento = this.$refs.pdfContent;
      try {

        const responseConfiguracion= await api.get('/getConfiguracion');
        
        if (responseConfiguracion.data.status==='ok') {
            
            this.mostrarHora=responseConfiguracion.data.rows[0].mostrarHora===1 ? true : false;
            this.mostrarFecha=responseConfiguracion.data.rows[0].mostrarFecha ===1 ? true : false;        
        }else if(responseConfiguracion.data.status==='vacio'){
            this.mostrarHora=true;
            this.mostrarFecha=true;
        }
        this.actualizarHora();
        await this.$nextTick();
        await new Promise(resolve => setTimeout(resolve, 400)); // Espera para renderizado

        const canvas = await toCanvas(elemento, {
          backgroundColor: '#ffffff',
          pixelRatio: 3,
          width: 800,
        });

        const dataUrl = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'letter');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const anchoConMargen = pdfWidth - 20;
        const altoFinal = (canvas.height * anchoConMargen) / canvas.width;

        pdf.addImage(dataUrl, 'PNG', 10, 10, anchoConMargen, altoFinal, undefined, 'MEDIUM');

        if (accion === 'preview') {
          window.open(pdf.output('bloburl'), '_blank');
        } else {
          pdf.save(`Comprobante_${this.datosExtra.nro_comprobanteEdit}.pdf`);
        }
      } catch (error) {
        console.error("Error PDF:", error);
      }
    },
    async getConfiguraciones(){
      try {
        const responseConfiguraciones= await api.get('/getConfiguracion')

        if (responseConfiguraciones.data.status==='vacio') {
          return configuracion
        }else if(responseConfiguraciones.data.status==='ok'){
          this.mostrarFecha=responseConfiguraciones.data.rows[0].mostrarFecha;
          this.mostrarHora=responseConfiguraciones.data.rows[0].mostrarHora;
          this.firmas=responseConfiguraciones.data.rows[0].firmas
          console.log(this.firmas)
        }  
      } catch (error) {
        console.log(error);

      }
    }
    },
    watch: {
      // Vigilamos la prop que viene del padre
      dataComprobante: {
        handler(newVal) {
          console.log("Los datos del comprobante se han actualizado");
          console.log(newVal) 
          // Aquí NO llames a generarPDF() a menos que 
          // realmente quieras que salga el PDF sin hacer clic.
        },
        deep: true // Importante para detectar cambios dentro del Array
      },
      datosExtra:{
        handler(newval){
          console.log(newval)
        },
        deep:true
      },
      firmas:{
        handler(newval){
          console.log(newval)
        },
        deep:true
      }
    }
} 

</script>


<template>
  <div style="position: absolute; top: 0; left: 0; width: 100%; height: 0; overflow: hidden; z-index: -1000;">
    <div ref="pdfContent" class="bg-white p-10" style="width: 800px;">
      
      <div class="flex flex-row justify-between items-center mb-8">
        <div class="text-center">
          <h1 class="text-3xl font-black uppercase tracking-tighter text-slate-800">Comprobante de {{ titulo }}</h1>
          <p class="text-xs font-bold text-slate-400 tracking-widest uppercase">Documento Interno de Contabilidad</p>
        </div>
        <div class="flex flex-col text-right border-l-4 border-slate-800 pl-4" >
          <p v-show="mostrarFecha" class="text-[10px] font-black text-slate-400">Fecha: <span class="text-black text-sm">{{ new Date().toLocaleDateString() }}</span></p>
          <p v-show="mostrarHora" class="text-[10px] font-black text-slate-400">Hora: <span class="text-black text-sm">{{ horaActual }}</span></p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 mb-8 bg-slate-50 p-6 rounded-xl border border-slate-200">
        <div class="space-y-2">
          <p class="text-xs font-black text-slate-500 uppercase">Empresa</p>
          <p class="text-sm font-bold text-slate-900 uppercase bg-white border border-slate-200 p-2 rounded">{{ nombreEmpresa }}</p>
          <p class="text-xs font-black text-slate-500 uppercase">Nro Comprobante</p>
          <p class="text-sm font-bold text-slate-900 bg-white border border-slate-200 p-2 rounded">{{ datosExtra.nro_comprobanteEdit || datosExtra.nro_comprobante }}</p>
          <p class="text-xs font-black text-slate-500 uppercase mt-4">Razon Social</p>
          <p class="text-sm font-bold text-slate-900 uppercase italic">{{ datosExtra.razon_social || datosExtra.selectedEmpresa }}</p>
        </div>
        <div class="space-y-2 text-right">
          <p class="text-xs font-black text-slate-500 uppercase">Glosa General</p>
          <p class="text-sm text-slate-700 leading-tight">{{ datosExtra.glosaEdit || datosExtra.glosa }}</p>
          <div class="grid grid-cols-2 gap-2 mt-4">
            <div>
              <p class="text-[10px] font-black text-slate-400">T.C $us</p>
              <p class="text-xs font-bold">{{ datosExtra.dolarEdit || datosExtra.dolar }}</p>
            </div>
             <div>
              <p class="text-[10px] font-black text-slate-400">UFV</p>
              <p class="text-xs font-bold">{{ datosExtra.ufvEdit || datosExtra.ufv }}</p>
            </div>
          </div>
          <div>
              <p class="text-[10px] font-black text-slate-400">METODO</p>
              <p class="text-xs font-bold uppercase">{{ datosExtra.metodo_pagoEdit || datosExtra.metodo_pago }}</p>
          </div>
        </div>
      </div>

      <div class="overflow-hidden rounded-lg border border-slate-300">
        <table class="w-full text-sm">
          <thead class="bg-slate-800 text-white uppercase text-[11px]">
            <tr>
              <th class="p-4 text-left">Código</th>
              <th class="p-4 text-left">Descripción de Cuenta</th>
              <th class="p-4 text-right">Debe</th>
              <th class="p-4 text-right">Haber</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="(item, index) in dataComprobante.filter(r => r.cuenta)" :key="index">
              <td class="p-4 font-bold text-slate-600">{{ item.cuenta }}</td>
              <td class="p-4 text-slate-800 uppercase text-[10px]">{{ item.nombre_cuenta }}</td>
              <td class="p-4 text-right font-mono font-bold">{{ item.debe }}</td>
              <td class="p-4 text-right font-mono font-bold">{{ item.haber }}</td>
            </tr>
          </tbody>
          <tfoot class="bg-slate-800 text-white font-black">
            <tr>
              <td colspan="2" class="p-4 text-right uppercase text-xs">Totales</td>
              <td class="p-4 text-right text-blue-300">{{ datosExtra.total_debe }}</td>
              <td class="p-4 text-right text-red-300">{{ datosExtra.total_haber }}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="mt-6 px-4 border-l-4 border-slate-300">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Importe en letras</p>
        <p class="text-xs font-bold text-slate-700 italic">
          {{ convertirMontoALetras(datosExtra.total_debe) }}
        </p>
      </div>

      
      <!-- 1. El contenedor PADRE tiene el flex -->
      <div class="flex flex-row flex-wrap justify-center space-x-4 mx-auto mt-32">
          
          <!-- 2. El HIJO tiene el v-for -->
          <div v-for="(item, index) in (typeof firmas==='string' ? JSON.parse(firmas) : firmas)" :key="index" class="text-center">
              <div class="border-t-2 border-slate-800 w-40 mb-1"></div>
              <p class="text-[10px] font-black text-slate-500 uppercase">{{ item }}</p>
          </div>

      </div>
        
      
    </div>
  </div>
</template>