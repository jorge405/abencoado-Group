<script>
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default {
  name: 'BotonVistaPreviaPdf',
  props: {
    datos: { type: Array, required: true },
    totales: { type: Object, required: true },
    titulo: { type: String, required: true },
    empresa: { type: String, default: 'ABENCOADO GROUP' },
    periodo: { type: Array, default: () => [] } // [2025, 07, 04]
  },
  data() {
    return { cargando: false };
  },
  computed: {
    fechaCorte() {
      if (this.periodo?.length === 3) {
        const [anio, mes, dia] = this.periodo;
        return `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${anio}`;
      }
      return '';
    }
  },
  methods: {
    generarVistaPrevia() {
      this.cargando = true;
      
      try {
        const doc = new jsPDF('p', 'mm', 'letter');
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 15;
        const ahora = new Date().toLocaleString();

        // 1. CONFIGURACIÓN DE DATOS PARA AUTOTABLE
        // Transformamos tus datos a filas que entiende el plugin
        // PASO 1: Filtrar los datos originales primero
        const datosFiltrados = this.datos.filter(item => parseFloat(item.monto) !== 0);
        // PASO 2: Mapear para la tabla usando la lista ya filtrada
        const filasTabla = datosFiltrados.map(item => [
        item.puct,
        item.nombre,
        parseFloat(item.monto).toLocaleString('en-US', { minimumFractionDigits: 2 })
        ]);

        // 2. DIBUJAR TABLA CON AUTO-PAGINACIÓN
        autoTable(doc,{
          head: [['CÓDIGO', 'CUENTA', 'BOLIVIANOS']],
          body: filasTabla,
          startY: 35,
          margin: { top: 35, bottom: 40 }, // Márgenes para dejar espacio a cabecera y firmas
          theme: 'grid',
          styles: { fontSize: 8, cellPadding: 1.5 },
          headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold', halign: 'center' },
          columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 35, halign: 'right' }
          },
          // Lógica de estilos por nivel (Negritas y Sangrías)
          didParseCell: (data) => {
            if (data.section === 'body') {
              const item = datosFiltrados[data.row.index];
              // Aplicar sangría al nombre de la cuenta (columna 1)
              if (item) {
                if (data.column.index === 1) {
                  data.cell.styles.cellPadding = { left: item.nivel * 4 };
                }
                // Poner en negrita niveles principales
                if (item.nivel <= 3) {
                  data.cell.styles.fontStyle = 'bold';
                  if (item.nivel === 1) data.cell.styles.fillColor = [245, 245, 245];
                }
              }
            }
          },
          // Encabezados en cada página
          didDrawPage: (data) => {
            // Fecha y Página (Derecha)
            doc.setFontSize(8);
            doc.setTextColor(100);
            doc.text(`Generado: ${ahora}`, pageWidth - margin, 10, { align: 'right' });
            doc.text(`Página ${doc.internal.getNumberOfPages()}`, pageWidth - margin, 14, { align: 'right' });

            // Empresa y Título (Izquierda)
            doc.setFontSize(14);
            doc.setTextColor(0);
            doc.setFont("helvetica", "bold");
            doc.text(this.empresa, margin, 15);
            doc.setFontSize(11);
            doc.setTextColor(30, 58, 138);
            doc.text(this.titulo, margin, 22);
            doc.setFontSize(9);
            doc.setFont("helvetica", "italic");
            doc.text(`Por el peridodo terminado al: ${this.fechaCorte}`, margin, 28);
          }
        });

        // 3. SECCIÓN DE TOTALES Y FIRMAS (Después de la tabla)
        let finalY = doc.lastAutoTable.finalY + 10;
        
        // Si no hay espacio al final de la última página, saltamos
        if (finalY > pageHeight - 50) {
          doc.addPage();
          finalY = 30;
        }

        this.dibujarFinal(doc, finalY, pageWidth, pageHeight, margin);

        // 4. ABRIR VISTA PREVIA
        window.open(doc.output('bloburl'), '_blank');

      } catch (error) {
        console.error("Error al construir PDF:", error);
      } finally {
        this.cargando = false;
      }
    },

    dibujarFinal(doc, y, pageWidth, pageHeight, margin) {
      const esResultado = this.titulo.toUpperCase().includes('RESULTADO');
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0);

      if (esResultado) {
        doc.text(`TOTAL INGRESOS: Bs. ${this.totales.ingresos}`, pageWidth - margin, y, { align: 'right' });
        doc.text(`TOTAL GASTOS: Bs. ${this.totales.gastos}`, pageWidth - margin, y + 6, { align: 'right' });
        doc.text(`UTILIDAD NETA: Bs. ${this.totales.utilidad}`, pageWidth - margin, y + 14, { align: 'right' });
      } else {
        doc.text(`TOTAL ACTIVO: Bs. ${this.totales.activo}`, pageWidth - margin, y, { align: 'right' });
        doc.text(`TOTAL PASIVO + PATRIMONIO: Bs. ${this.totales.total_p_p}`, pageWidth - margin, y + 8, { align: 'right' });
      }

      // Firmas al final de la página
      const firmaY = pageHeight - 25;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.line(margin, firmaY, margin + 55, firmaY);
      doc.text("CONTADOR GENERAL", margin + 27, firmaY + 5, { align: 'center' });
      
      doc.line(pageWidth - margin - 55, firmaY, pageWidth - margin, firmaY);
      doc.text("GERENTE GENERAL", pageWidth - margin - 27, firmaY + 5, { align: 'center' });
    }
  },
  watch:{
    empresa(newval){
      
    }
  }
};
</script>

<template>
  <button 
    @click="generarVistaPrevia" 
    :disabled="cargando"
    class="flex items-center gap-2 bg-blue-950 hover:bg-blue-900 text-white font-bold py-2 px-6 rounded-lg text-xs transition-all shadow-md active:scale-95 disabled:opacity-50"
  >
    <span v-if="cargando" class="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
    {{ cargando ? 'CONSTRUYENDO PDF...' : 'VISTA PREVIA PDF' }}
  </button>
</template>