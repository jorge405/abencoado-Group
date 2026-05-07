<script>
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export default {
  name: 'BotonExcelPatrimonio',
  props: {
    datos: { type: Array, required: true },
    totales: { type: Object, required: true },
    empresa: { type: String, default: 'ABENCOADO GROUP' },
    fecha_inicio: { type: String, required: true },
    fecha_final: { type: String, required: true }
  },
  methods: {
    async exportarExcel() {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Evolución Patrimonio');

      // 1. Filtrar cuentas que tienen movimiento (para no crear columnas vacías)
      const cuentas = this.datos.filter(c => parseFloat(c.monto) !== 0);
      
      // Configuración de Columnas
      const columns = [
        { header: 'CONCEPTO', key: 'concepto', width: 45 },
        ...cuentas.map(c => ({ header: c.nombre.toUpperCase(), key: c.puct, width: 20 })),
        { header: 'TOTAL', key: 'total', width: 20 }
      ];
      worksheet.columns = columns;

      // 2. Encabezados (Merge dinámico según cantidad de columnas)
      const totalCol = columns.length;
      const range = `${this.getColName(1)}1:${this.getColName(totalCol)}1`;
      
      worksheet.mergeCells(range);
      const cellEmpresa = worksheet.getCell('A1');
      cellEmpresa.value = this.empresa.toUpperCase();
      cellEmpresa.font = { bold: true, size: 14 };
      cellEmpresa.alignment = { horizontal: 'center' };

      worksheet.mergeCells(`${this.getColName(1)}2:${this.getColName(totalCol)}2`);
      const cellTitulo = worksheet.getCell('A2');
      cellTitulo.value = 'ESTADO DE EVOLUCIÓN DEL PATRIMONIO NETO';
      cellTitulo.font = { bold: true, size: 12, color: { argb: '1E3A8A' } };
      cellTitulo.alignment = { horizontal: 'center' };

      worksheet.addRow([]); // Espacio

      // 3. Estilo de los encabezados de la tabla
      const headerRow = worksheet.getRow(5);
      headerRow.values = columns.map(c => c.header);
      headerRow.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1E3A8A' } };
        cell.font = { color: { argb: 'FFFFFF' }, bold: true, size: 9 };
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      });

      // --- 4. LOGICA DE FILAS ---

      // FILA SALDO INICIAL: Solo si es mayor a 0
      const saldoIni = parseFloat(this.totales.total_inicio || 0);
      if (saldoIni !== 0) {
        const rowInicial = { 
            concepto: `SALDOS INICIALES AL ${this.fecha_inicio}`,
            total: saldoIni 
        };
        const r1 = worksheet.addRow(rowInicial);
        r1.font = { italic: true };
        this.formatMoneyRow(r1);
      }

      // FILAS DE MOVIMIENTOS (Cuentas individuales)
      cuentas.forEach((cuenta) => {
        const monto = parseFloat(cuenta.monto);
        const rowData = {
          concepto: cuenta.nombre.toUpperCase(),
          [cuenta.puct]: monto,
          total: monto
        };
        const r = worksheet.addRow(rowData);
        this.formatMoneyRow(r);
      });

      worksheet.addRow([]); // Espacio

      // FILA SALDO FINAL
      const rowFinal = {
        concepto: `SALDOS FINAL AL PERIODO `,
        total: parseFloat(this.totales.total_final || 0)
      };
      
      // Sumar los montos a las columnas de la fila final
      cuentas.forEach(c => {
        rowFinal[c.puct] = parseFloat(c.monto);
      });

      const rf = worksheet.addRow(rowFinal);
      rf.font = { bold: true };
      rf.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F3F4F6' } };
      this.formatMoneyRow(rf);
      
      // Borde doble inferior para el cierre
      rf.eachCell(cell => {
        cell.border = { 
            top: { style: 'thin' }, 
            bottom: { style: 'double' } 
        };
      });

      // 5. Descarga
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), `Evolucion_Patrimonio.xlsx`);
    },

    // Helper para obtener letra de columna (A, B, C...)
    getColName(n) {
      return (n > 26 ? this.getColName(Math.floor((n - 1) / 26)) : '') + String.fromCharCode((n - 1) % 26 + 65);
    },

    formatMoneyRow(row) {
      row.eachCell((cell, colNumber) => {
        if (colNumber > 1) {
          cell.numFmt = '#,##0.00;[Red]-#,##0.00';
        }
      });
    }
  }
}
</script>

<template>
  <button 
    @click="exportarExcel" 
    class="flex items-center justify-center gap-2 bg-emerald-800 hover:bg-green-800 text-white font-bold py-2 px-6 rounded-lg text-xs transition-all shadow-md active:scale-95 cursor-pointer"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
      <path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6m4 18H6V4h7v5h5v11m-10-2h8v-2h-8v2m0-4h8v-2h-8v2m0-4h5v-2h-5v2Z"/>
    </svg>
    EXPORTAR EXCEL PATRIMONIO
  </button>
</template>