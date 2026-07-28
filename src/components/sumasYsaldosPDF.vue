<script>
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import api from '@/services/api.js';

export default {
  name: 'BotonPdfSumasSaldos',
  props: {
    datos: { type: Array, required: true },
    totales: { type: Object, required: true }, // { debe: 0, haber: 0, sdebe: 0, shaber: 0 }
    empresa: { type: String, default: 'ABENCOADO GROUP' },
    periodo1: { type: Array, default: 'Del 1 de enero al 31 de diciembre de ?' },
    periodo2:{type:Array,default:'Del 1 de enero al 31 de diciembre de ?'}
  },
  data() {
    return { 
      cargando: false,
      configImpresion: {
      mostrarHora: 0,
      mostrarFecha: 0
    },
    firmasDinamicas:[]

     };
  
    },
  mounted() {
     this.getConfiguracion();    
  },
  methods: {
    async getConfiguracion(){
      try {
        const responseConfiguracion= await api.get('/getConfiguracion');
        
        if (responseConfiguracion.data.status==='vacio') {
          this.firmasDinamicas=['CONTADOR','AUX CONTADOR'];
        }else if(responseConfiguracion.data.status==='ok'){
        const config= responseConfiguracion.data.rows[0];
        this.configImpresion.mostrarHora = responseConfiguracion.data.rows[0].mostrarHora;
        this.configImpresion.mostrarFecha = responseConfiguracion.data.rows[0].mostrarFecha;

        let firmasRaw = config.firmas;

          if (typeof firmasRaw === 'string') {
            try {
              this.firmasDinamicas = JSON.parse(firmasRaw);
            } catch (e) {
              this.firmasDinamicas = [firmasRaw]; // Fallback si no es JSON válido
            }
          } else {
            this.firmasDinamicas = Array.isArray(firmasRaw) ? firmasRaw : ['CONTADOR', 'AUX CONTADOR'];
          }
        }
      } catch (error) {
        console.log(error)

      }
    },
    generarPdf() {
      this.cargando = true;
      try {
        const doc = new jsPDF('l', 'mm', 'letter');
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 15;

        // 1. Mapeo de datos
        const filas = this.datos.map(item => [
          item.clase,
          item.grupo,
          item.subgrupo,
          item.cuenta_principal,
          item.cuenta_analitica,
          item.nombre_cuenta.toUpperCase(),
          parseFloat(item.total_debe || 0).toFixed(2),
          parseFloat(item.total_haber || 0).toFixed(2),
          parseFloat(item.saldo_debe || 0).toFixed(2),
          parseFloat(item.saldo_haber || 0).toFixed(2)
        ]);

        // 2. Definición de Cabecera
        const encabezado = [
          [
            { content: 'CODIFICACIÓN DE LA CUENTA', colSpan: 5, styles: { halign: 'center' } },
            { content: 'NOMBRE DE LA CUENTA', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
            { content: 'SUMAS', colSpan: 2, styles: { halign: 'center' } },
            { content: 'SALDOS', colSpan: 2, styles: { halign: 'center' } }
          ],
          [
            'CLASE', 'GRUPO', 'SUBGRUPO', 'CUENTA PRINCIPAL', 'CUENTA ANALÍTICA',
            'DEBE', 'HABER', 'DEUDOR', 'ACREEDOR'
          ]
        ];

        autoTable(doc, {
          head: encabezado,
          body: filas,
          startY: 35,
          theme: 'grid',
          styles: { fontSize: 6, cellPadding: 1.5 },
          headStyles: { fillColor: [15, 23, 42], textColor: 255, halign: 'center' },
          columnStyles: {
            0: { cellWidth: 12 }, 1: { cellWidth: 12 }, 2: { cellWidth: 15 },
            3: { cellWidth: 18 }, 4: { cellWidth: 18 }, 5: { cellWidth: 'auto' },
            6: { halign: 'right', cellWidth: 22 }, 7: { halign: 'right', cellWidth: 22 },
            8: { halign: 'right', cellWidth: 22 }, 9: { halign: 'right', cellWidth: 22 }
          },
          didDrawPage: (data) => {
            
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text("BALANCE DE SUMAS Y SALDOS", margin, 15);
            
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            doc.text(`Empresa: ${this.empresa}`, margin, 22);
            doc.text(`Del: ${this.periodo1[2]} de ${this.periodo1[1]} del ${this.periodo1[0]} al ${this.periodo2[2]} de ${this.periodo2[1]} del ${this.periodo2[0]}`, margin, 27);

            const fechaRecibo = new Date().toLocaleString();
            const formatDate= fechaRecibo.split(",")
            
            doc.setFontSize(7);
            
            doc.text(`${this.configImpresion.mostrarFecha===1 ? formatDate[0] : ''} ${this.configImpresion.mostrarHora===1 ?formatDate[1] : ''}`, pageWidth - margin, 10, { align: 'right' });
            
            
          }
        });

        // 3. Totales
        let finalY = doc.lastAutoTable.finalY + 8;
        
        // Verificar si los totales y las firmas caben en la página, si no, crear nueva página
        if (finalY + 40 > pageHeight) {
          doc.addPage('l', 'mm', 'letter');
          finalY = 30; // Resetear posición en la nueva página
        }

        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text("TOTALES:", 155, finalY);
        doc.text(parseFloat(this.totales.debe).toFixed(2), 195, finalY, { align: 'right' });
        doc.text(parseFloat(this.totales.haber).toFixed(2), 218, finalY, { align: 'right' });
        doc.text(parseFloat(this.totales.saldo_debe).toFixed(2), 240, finalY, { align: 'right' });
        doc.text(parseFloat(this.totales.saldo_haber).toFixed(2), 265, finalY, { align: 'right' });

        // --- SECCIÓN DE FIRMAS DINÁMICAS ---
        if (this.firmasDinamicas.length > 0) {
          const totalFirmas = this.firmasDinamicas.length;
          const firmaY = finalY + 30;
          const anchoLinea = 50;
          
          // Calculamos el espacio disponible para distribuir las firmas equitativamente
          const espacioDisponible = pageWidth - (margin * 2);
          const intervalo = espacioDisponible / (totalFirmas + 1);

          // Verificamos si hay espacio en la página
          if (firmaY + 15 > pageHeight) {
            doc.addPage('l', 'mm', 'letter');
            finalY = 20;
          }

          doc.setFontSize(9);
          doc.setFont("helvetica", "bold");

          this.firmasDinamicas.forEach((nombreFirma, index) => {
            const xCentro = margin + (intervalo * (index + 1));
            const xInicioLinea = xCentro - (anchoLinea / 2);

            // Dibujar línea
            doc.line(xInicioLinea, firmaY, xInicioLinea + anchoLinea, firmaY);
            // Dibujar texto (convertido a mayúsculas)
            doc.text(nombreFirma.toUpperCase(), xCentro, firmaY + 5, { align: 'center' });
          });
        }
        window.open(doc.output('bloburl'), '_blank');
      } catch (e) {
        console.error(e);
      } finally {
        this.cargando = false;
      }
    }
  },
  watch:{
    empresa(newval){
      console.log(newval)
    }
  }
};
</script>

<template>
  <button 
    @click="generarPdf" 
    :disabled="cargando"
    class="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white py-2 px-4 rounded-md text-sm transition-all cursor-pointer"
  >
    <svg v-if="!cargando" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
    </svg>
    <span v-else class="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
    {{ cargando ? 'PROCESANDO...' : 'IMPRIMIR ' }}
  </button>
</template>