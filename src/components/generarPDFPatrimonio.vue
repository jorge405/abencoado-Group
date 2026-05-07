<script>
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default {
  name: 'PdfEvolucionPatrimonio',
  props: {
    datos: { type: Array, required: true },    // Cuentas nivel 5
    totales: { type: Object, required: true },  // Totales horizontales
    titulo: { type: String, default: 'ESTADO DE EVOLUCIÓN DEL PATRIMONIO NETO' },
    empresa: { type: String, default: 'ABENCOADO GROUP' },
    fecha_inicio: { type: String, default: '' },
    fecha_final: { type: String, default: '' }
  },
  data() {
    return { cargando: false };
  },
  methods: {
    formatNumber(value) {
      const num = parseFloat(value);
      return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num || 0);
    },

    generarVistaPrevia() {
      this.cargando = true;
      try {
        const doc = new jsPDF('l', 'mm', 'letter'); 
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 15;
        const ahora = new Date().toLocaleString();

        // 1. CONSTRUCCIÓN DE ENCABEZADOS
        const encabezados = [
          'DETALLE',
          ...this.datos.map(c => c.nombre),
          'TOTAL PATRIMONIO'
        ];

        // 2. CONSTRUCCIÓN DINÁMICA DE FILAS
        const filasCuerpo = [];

        // --- FILA INICIAL (Sólo si hay saldo) ---
        const haySaldoInicial = this.totales.total_inicio && parseFloat(this.totales.total_inicio) !== 0;
        if (haySaldoInicial) {
          filasCuerpo.push([
            `SALDOS AL INICIO `,
            ...this.datos.map(c => this.formatNumber(c.monto_inicio)),
            this.formatNumber(this.totales.total_inicio)
          ]);
        }

        // --- FILAS DE MOVIMIENTOS (Matriz) ---
        // Generamos una fila por cada cuenta para mostrar su movimiento individual
        this.datos.forEach((fila) => {
          const celdas = [fila.nombre];
          this.datos.forEach((col) => {
            // Si la cuenta de la fila es la misma que la de la columna, ponemos el monto
            celdas.push(fila.puct === col.puct ? this.formatNumber(fila.monto) : '0.00');
          });
          celdas.push(this.formatNumber(fila.monto)); // Total horizontal de la fila
          filasCuerpo.push(celdas);
        });

        // --- FILA FINAL (Siempre visible) ---
        const filaFinal = [
          `SALDOS AL FINAL DEL PERIODO `,
          ...this.datos.map(c => this.formatNumber(parseFloat(c.monto_inicio || 0) + parseFloat(c.monto || 0))),
          this.formatNumber(this.totales.total_final)
        ];
        filasCuerpo.push(filaFinal);

        // 3. RENDERIZAR TABLA
        autoTable(doc, {
          head: [encabezados],
          body: filasCuerpo,
          startY: 35,
          theme: 'grid',
          styles: { 
            fontSize: 7, 
            cellPadding: 2, 
            halign: 'right', 
            valign: 'middle'
          },
          headStyles: { 
            fillColor: [30, 58, 138], 
            textColor: 255, 
            fontStyle: 'bold', 
            halign: 'center'
          },
          columnStyles: {
            0: { halign: 'left', fontStyle: 'bold', fillColor: [245, 245, 245], cellWidth: 45 },
            [encabezados.length - 1]: { fillColor: [240, 240, 240], fontStyle: 'bold' }
          },
          didParseCell: (data) => {
            // Estilo para la última fila (Saldos Finales)
            if (data.section === 'body' && data.row.index === filasCuerpo.length - 1) {
              data.cell.styles.fillColor = [30, 58, 138];
              data.cell.styles.textColor = 255;
              data.cell.styles.fontStyle = 'bold';
            }
          },
          didDrawPage: (data) => {
            doc.setFontSize(8);
            doc.setTextColor(100);
            doc.text(`Generado: ${ahora}`, pageWidth - margin, 10, { align: 'right' });
            
            doc.setFontSize(14);
            doc.setTextColor(0);
            doc.setFont("helvetica", "bold");
            doc.text(this.empresa, margin, 15);
            doc.setFontSize(11);
            doc.setTextColor(30, 58, 138);
            doc.text(this.titulo, margin, 22);
            doc.setFontSize(9);
            doc.setFont("helvetica", "italic");
            doc.text(`Periodo: ${this.fecha_inicio} al ${this.fecha_final}`, margin, 28);
          }
        });

        // 4. FIRMAS
        const finalY = doc.lastAutoTable.finalY + 25;
        doc.setFontSize(9);
        doc.setTextColor(0);
        doc.line(margin, finalY, margin + 60, finalY);
        doc.text("CONTADOR GENERAL", margin + 30, finalY + 5, { align: 'center' });
        doc.line(pageWidth - margin - 60, finalY, pageWidth - margin, finalY);
        doc.text("GERENTE GENERAL", pageWidth - margin - 30, finalY + 5, { align: 'center' });

        window.open(doc.output('bloburl'), '_blank');
      } catch (error) {
        console.error("Error al generar PDF:", error);
      } finally {
        this.cargando = false;
      }
    }
  }
};
</script>

<template>
  <button 
    @click="generarVistaPrevia" 
    :disabled="cargando"
    class="bg-blue-950 hover:bg-blue-900 text-white font-bold py-2 px-6 rounded-lg text-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
  >
    {{ cargando ? 'GENERANDO...' : 'VISTA PREVIA PDF' }}
  </button>
</template>