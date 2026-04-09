<script>
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

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
    return { cargando: false };
  },
  methods: {
    generarPdf() {
      this.cargando = true;
      try {
        // 'l' para Landscape (Horizontal) porque la tabla es ancha
        const doc = new jsPDF('l', 'mm', 'letter');
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 15;

        // 1. Mapeo de datos según la imagen
        const filas = this.datos.map(item => [
          `${item.clase}.${item.grupo}.${item.subgrupo}`, // Estructura de código
          item.cuenta_principal,
          item.cuenta_analitica,
          item.nombre_cuenta.toUpperCase(),
          parseFloat(item.debe || 0).toFixed(2),
          parseFloat(item.haber || 0).toFixed(2),
          parseFloat(item.saldo_debe || 0).toFixed(2),
          parseFloat(item.saldo_haber || 0).toFixed(2)
        ]);

        // 2. Generar Tabla
        autoTable(doc,{
          head: [['COD.', 'C. PRINC.', 'C. ANALIT.', 'CUENTA', 'DEBE', 'HABER', 'SALDO DEBE', 'SALDO HABER']],
          body: filas,
          startY: 35,
          theme: 'grid',
          styles: { fontSize: 7, cellPadding: 2 },
          headStyles: { fillColor: [15, 23, 42], textColor: 255, halign: 'center' },
          columnStyles: {
            0: { cellWidth: 20 },
            3: { cellWidth: 'auto' },
            4: { halign: 'right' },
            5: { halign: 'right' },
            6: { halign: 'right' },
            7: { halign: 'right' }
          },
          didDrawPage: (data) => {
            // Cabecera
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text("BALANCE DE SUMAS Y SALDOS", margin, 15);
            
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            doc.text(`Empresa: ${this.empresa}`, margin, 22);
            doc.text(`Del: ${this.periodo1[0]} de ${this.periodo1[1]} del ${this.periodo1[2]} al ${this.periodo2[0]} de ${this.periodo2[1]} del ${this.periodo2[2]}`, margin, 27);


            // Fecha de impresión a la derecha
            const fechaRecibo = new Date().toLocaleString();
            doc.setFontSize(7);
            doc.text(`Impreso: ${fechaRecibo}`, pageWidth - margin, 10, { align: 'right' });
          }
        });

        // 3. Totales al final de la tabla
        const finalY = doc.lastAutoTable.finalY + 5;
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        
        // Dibujamos una pequeña tabla de totales o textos alineados
        doc.text("TOTALES:", 140, finalY);
        doc.text(parseFloat(this.totales.debe).toFixed(2), 188, finalY, { align: 'right' });
        doc.text(parseFloat(this.totales.haber).toFixed(2), 218, finalY, { align: 'right' });
        doc.text(parseFloat(this.totales.sdebe).toFixed(2), 245, finalY, { align: 'right' });
        doc.text(parseFloat(this.totales.shaber).toFixed(2), 273, finalY, { align: 'right' });

        window.open(doc.output('bloburl'), '_blank');
      } catch (e) {
        console.error(e);
      } finally {
        this.cargando = false;
      }
    }
  }
};
</script>

<template>
  <button 
    @click="generarPdf" 
    :disabled="cargando"
    class="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white py-2 px-4 rounded-md text-sm transition-all"
  >
    <svg v-if="!cargando" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
    </svg>
    <span v-else class="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
    {{ cargando ? 'PROCESANDO...' : 'IMPRIMIR SUMAS Y SALDOS' }}
  </button>
</template>