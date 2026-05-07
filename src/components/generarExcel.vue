<script>

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export default{
    name: 'BotonExcelContable',
    props: {
        datos: { type: Array, required: true },    // Detalles del reporte
        totales: { type: Object, required: true },  // Objeto con activo, pasivo, utilidad, etc.
        titulo: { type: String, required: true },   // "BALANCE GENERAL" o "ESTADO DE RESULTADOS"
        empresa: { type: String, default: 'ABENCOADO GROUP' },
        fecha1:Array,
        fecha2:Array,
        

    },
    methods:{
        async exportarExcel() {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Reporte');

            // 1. Configuración de Columnas
            worksheet.columns = [
                { key: 'puct', width: 20 },
                { key: 'nombre', width: 50 },
                { key: 'monto', width: 18 }
            ];

            // 2. Encabezados Superiores
            worksheet.mergeCells('A1:C1');
            const cellEmpresa = worksheet.getCell('A1');
            cellEmpresa.value = this.empresa.toUpperCase();
            cellEmpresa.font = { bold: true, size: 14 };
            cellEmpresa.alignment = { horizontal: 'center' };

            worksheet.mergeCells('A2:C2');
            const cellTitulo = worksheet.getCell('A2');
            cellTitulo.value = this.titulo;
            cellTitulo.font = { bold: true, size: 12, color: { argb: '1E3A8A' } };
            cellTitulo.alignment = { horizontal: 'center' };

            worksheet.mergeCells('A3:C3');
            const cellFechas = worksheet.getCell('A3');
            cellFechas.value = this.titulo.includes('BALANCE') 
                ? `Por el periodo terminado Al: ${this.fecha2[2]} de ${this.fecha2[1]} de ${this.fecha2[0]}` 
                : `Del: ${this.fecha1[2]} de ${this.fecha1[1]} de ${this.fecha1[0]} Al: ${this.fecha2[2]} de ${this.fecha2[1]} de ${this.fecha2[0]}`;
            cellFechas.font = { italic: true, size: 10 };
            cellFechas.alignment = { horizontal: 'center' };

            worksheet.addRow([]); // Fila vacía

            // 3. ENCABEZADOS DE LA TABLA
            const headerRow = worksheet.getRow(5); // Fila 5 para los encabezados
            headerRow.values = ['CÓDIGO', 'CUENTA', 'BOLIVIANOS'];
            
            headerRow.eachCell((cell) => {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1E3A8A' } };
                cell.font = { color: { argb: 'FFFFFF' }, bold: true };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
            });

            // --- EL CAMBIO CLAVE: FILTRADO ---
            const datosFiltrados = this.datos.filter(item => {
                const monto = parseFloat(item.monto);
                return !isNaN(monto) && monto !== 0;
            });

            // 4. CARGA DE DATOS FILTRADOS
            datosFiltrados.forEach((item) => {
                const row = worksheet.addRow({
                    puct: item.puct,
                    nombre: item.nombre,
                    monto: parseFloat(item.monto)
                });

                // Estilos por nivel (Negritas y Colores)
                if (item.nivel === 1) {
                    row.font = { bold: true };
                    row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F3F4F6' } };
                } else if (item.nivel <= 3) {
                    row.font = { bold: true };
                }

                // Sangría (Indent) en la columna Nombre (Columna 2)
                // Usamos Math.max para asegurar que el nivel no sea menor a 1
                row.getCell(2).alignment = { indent: Math.max(0, (item.nivel - 1) * 2) };
                
                // Formato numérico en la columna Bolivianos (Columna 3)
                const cellMonto = row.getCell(3);
                cellMonto.numFmt = '#,##0.00;[Red]-#,##0.00';
            });

            // 5. TOTALES DINÁMICOS
            worksheet.addRow([]); 
            const esBalance = this.titulo.toUpperCase().includes('BALANCE');

            if (esBalance) {
                const filaActivo = worksheet.addRow(['', 'TOTAL ACTIVO', parseFloat(this.totales.activo)]);
                filaActivo.font = { bold: true };
                filaActivo.getCell(3).numFmt = '#,##0.00';

                const filaPP = worksheet.addRow(['', 'TOTAL PASIVO + PATRIMONIO', parseFloat(this.totales.total_p_p)]);
                filaPP.font = { bold: true, size: 11 };
                filaPP.getCell(3).numFmt = '#,##0.00';
                filaPP.getCell(3).border = { top: { style: 'thin' }, bottom: { style: 'double' } };
            } else {
                const filaIngresos = worksheet.addRow(['', 'TOTAL INGRESOS', parseFloat(this.totales.ingresos)]);
                filaIngresos.font = { bold: true };
                filaIngresos.getCell(3).numFmt = '#,##0.00';

                const filaGastos = worksheet.addRow(['', 'TOTAL GASTOS', parseFloat(this.totales.gastos)]);
                filaGastos.font = { bold: true };
                filaGastos.getCell(3).numFmt = '#,##0.00';

                const filaUtilidad = worksheet.addRow(['', 'UTILIDAD NETA', parseFloat(this.totales.utilidad)]);
                filaUtilidad.font = { bold: true, size: 12, color: { argb: '065F46' } };
                filaUtilidad.getCell(3).numFmt = '#,##0.00';
                filaUtilidad.getCell(3).border = { top: { style: 'thin' }, bottom: { style: 'double' } };
            }

            // 6. DESCARGA
            const buffer = await workbook.xlsx.writeBuffer();
            const fileName = `${this.titulo.replace(/ /g, '_')}.xlsx`;
            saveAs(new Blob([buffer]), fileName);
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
    EXPORTAR A EXCEL
  </button>
</template>