<script>
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export default {
  name: 'BotonExcelSumasSaldos',
  props: {
    datos: { type: Array, required: true },
    totales: { type: Object, required: true },
    empresa: { type: String, default: 'SOBOCE S.A.' },
    periodo: { type: String, default: 'Gestión 2025' }
  },
  data() {
    return { exportando: false };
  },
  methods: {
    async exportarExcel() {
  this.exportando = true;
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sumas y Saldos');

    // 1. Configuración de 10 Columnas (A-J)
    worksheet.columns = [
      { key: 'clase', width: 8 },
      { key: 'grupo', width: 8 },
      { key: 'subgrupo', width: 10 },
      { key: 'cp', width: 15 },
      { key: 'ca', width: 15 },
      { key: 'nombre', width: 40 },
      { key: 'debe', width: 15 },
      { key: 'haber', width: 15 },
      { key: 'sdebe', width: 15 },
      { key: 'shaber', width: 15 },
    ];

    // 2. Encabezados de Título (Empresa y Reporte)
    worksheet.mergeCells('A1:J1');
    const title = worksheet.getCell('A1');
    title.value = this.empresa;
    title.font = { size: 14, bold: true };

    worksheet.mergeCells('A2:J2');
    const subtitle = worksheet.getCell('A2');
    subtitle.value = 'BALANCE DE SUMAS Y SALDOS - ' + this.periodo;
    subtitle.font = { size: 11, bold: true };

    // 3. CABECERA DOBLE (Según la imagen)
    // Fila 4: Títulos superiores
    worksheet.mergeCells('A4:E4'); // Codificación
    worksheet.getCell('A4').value = 'CODIFICACION DE LA CUENTA';
    
    worksheet.mergeCells('F4:F5'); // Nombre (Vertical)
    worksheet.getCell('F4').value = 'NOMBRE DE LA CUENTA';
    
    worksheet.mergeCells('G4:H4'); // Sumas
    worksheet.getCell('G4').value = 'SUMAS';
    
    worksheet.mergeCells('I4:J4'); // Saldos
    worksheet.getCell('I4').value = 'SALDOS';

    // Fila 5: Subtítulos
    const row5 = worksheet.getRow(5);
    row5.values = ['CLASE', 'GRUPO', 'SUBGRUPO', 'CUENTA PRINCIPAL', 'CUENTA ANALÍTICA', '', 'DEBE', 'HABER', 'DEUDOR', 'ACREEDOR'];

    // Estilo de las cabeceras (Filas 4 y 5)
    [4, 5].forEach(rowNum => {
      const row = worksheet.getRow(rowNum);
      row.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'none' };
        cell.font = { color: { argb: 'FF000000' }, bold: true, size: 8 };
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FF000000' } },
          left: { style: 'thin', color: { argb: 'FF000000' } },
          bottom: { style: 'thin', color: { argb: 'FF000000' } },
          right: { style: 'thin', color: { argb: 'FF000000' } }
        };
      });
    });

    // 4. Agregar Datos (Inicia en fila 6)
    this.datos.forEach(item => {
      const row = worksheet.addRow([
        item.clase,
        item.grupo,
        item.subgrupo,
        item.cuenta_principal,
        item.cuenta_analitica,
        item.nombre_cuenta.toUpperCase(),
        parseFloat(item.total_debe || 0),
        parseFloat(item.total_haber || 0),
        parseFloat(item.saldo_debe || 0),
        parseFloat(item.saldo_haber || 0)
      ]);

      // Formato numérico y bordes para datos
      row.eachCell((cell, colNumber) => {
        cell.border = { 
            top: { style: 'thin' }, left: { style: 'thin' }, 
            bottom: { style: 'thin' }, right: { style: 'thin' } 
        };
        if (colNumber >= 7) {
          cell.numFmt = '#,##0.00';
          cell.alignment = { horizontal: 'right' };
        }
      });
    });

    // 5. Fila de Totales
    const totalRow = worksheet.addRow([
      '', '', '', '', '', 'TOTALES', 
      parseFloat(this.totales.debe), 
      parseFloat(this.totales.haber), 
      parseFloat(this.totales.saldo_debe), 
      parseFloat(this.totales.saldo_haber)
    ]);

    totalRow.font = { bold: true };
    totalRow.eachCell((cell, colNumber) => {
      if (colNumber >= 6) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
        if (colNumber >= 7) cell.numFmt = '#,##0.00';
      }
    });

    // 6. Generar archivo y descargar
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Sumas_Saldos_${new Date().getTime()}.xlsx`);

  } catch (error) {
    console.error("Error generando Excel:", error);
  } finally {
    this.exportando = false;
  }
}
  }
};
</script>

<template>
  <button 
    @click="exportarExcel" 
    :disabled="exportando"
    class="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white py-2 px-4 rounded-md text-sm transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
  >
    <svg v-if="!exportando" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
    <span v-else class="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
    {{ exportando ? 'EXPORTANDO...' : 'EXPORTAR EXCEL' }}
  </button>
</template>