const lista = document.getElementById("lista-gastos");
const JSON_NAME = "control_de_gastos.json";

function cargar() {
  mostrarGastos();
  actualizarTotales();
}

// Mostrar gastos
function mostrarGastos() {
  lista.innerHTML = "";
  const gastos = JSON.parse(localStorage.getItem("gastos")) || [];

  gastos.forEach((g, i) => {
    const div = document.createElement("div");
    div.className = "tarjeta";

    div.innerHTML = `
      <h3>🧾 Gasto Nº ${i + 1}</h3>
      <p>📅 Fecha: ${g.fecha}</p>
      <p>📦 Categoría: ${g.categoria}</p>
      <p>💶 Importe: ${g.importe} €</p>
      <p>💳 Método: ${g.metodo}</p>
      <p>🏷️ Tipo: ${g.tipoGasto}</p>
      <p>💡 Estado: ${g.estado}</p>
      <p>📝 Descripción: ${g.descripcion || "Sin detalles"}</p>
      <button class="borrar" onclick="borrarGasto(${i})">🗑️ Borrar</button>
    `;

    lista.appendChild(div);
  });
}

// Añadir gasto
document.getElementById("agregar").addEventListener("click", () => {
  const fecha = document.getElementById("fecha").value;
  const categoria = document.getElementById("categoria").value;
  const importe = document.getElementById("importe").value;
  const metodo = document.getElementById("metodo").value;
  const tipoGasto = document.getElementById("tipoGasto").value;
  const estado = document.getElementById("estado").value;
  const descripcion = document.getElementById("descripcion").value.trim();

  if (!fecha || !categoria || !importe || !metodo || !tipoGasto || !estado) {
    alert("Completa todos los campos.");
    return;
  }

  const gastos = JSON.parse(localStorage.getItem("gastos")) || [];

  gastos.push({
    fecha,
    categoria,
    importe,
    metodo,
    tipoGasto,
    estado,
    descripcion,
  });

  localStorage.setItem("gastos", JSON.stringify(gastos));

  mostrarGastos();
  actualizarTotales();
  //poner aquí el reset
  // 🔄 Limpiar formulario que me ha dicho mi maestro
  document.getElementById("fecha").value = "";
  document.getElementById("categoria").value = "";
  document.getElementById("importe").value = "";
  document.getElementById("metodo").value = "";
  document.getElementById("tipoGasto").value = "";
  document.getElementById("estado").value = "";
  document.getElementById("descripcion").value = "";
});

// Borrar gasto
function borrarGasto(i) {
  const gastos = JSON.parse(localStorage.getItem("gastos")) || [];
  gastos.splice(i, 1);
  localStorage.setItem("gastos", JSON.stringify(gastos));
  mostrarGastos();
  actualizarTotales();
}

// Totales
function actualizarTotales() {
  const gastos = JSON.parse(localStorage.getItem("gastos")) || [];
  const now = new Date();

  const mes = gastos.filter(
    (g) => new Date(g.fecha).getMonth() === now.getMonth()
  );
  const ano = gastos.filter(
    (g) => new Date(g.fecha).getFullYear() === now.getFullYear()
  );

  const totalMes = mes.reduce((sum, g) => sum + Number(g.importe), 0);
  const totalAno = ano.reduce((sum, g) => sum + Number(g.importe), 0);

  document.getElementById("totalMes").textContent = `${totalMes} €`;
  document.getElementById("totalAno").textContent = `${totalAno} €`;
}

// Exportar JSON
document.getElementById("btnExport").addEventListener("click", () => {
  const data = localStorage.getItem("gastos") || "[]";
  const now = new Date();
  const name = `control_de_gastos_${String(now.getDate()).padStart(
    2,
    "0"
  )}-${String(now.getMonth() + 1).padStart(2, "0")}-${now.getFullYear()}.json`;

  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();

  URL.revokeObjectURL(url);
});

// Importar JSON
document
  .getElementById("btnImport")
  .addEventListener("click", () =>
    document.getElementById("fileInput").click()
  );

document.getElementById("fileInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const json = JSON.parse(ev.target.result);
      localStorage.setItem("gastos", JSON.stringify(json));
      mostrarGastos();
      actualizarTotales();
      alert("Datos importados correctamente.");
    } catch {
      alert("JSON no válido.");
    }
  };
  reader.readAsText(file);
});

// Exportar PDF
document.getElementById("exportarPDF").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("📉 Control de Gastos - Aerografía79", 10, 15);
  doc.setFontSize(11);

  let y = 30;
  const gastos = JSON.parse(localStorage.getItem("gastos")) || [];

  gastos.forEach((g, i) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.text(`Gasto Nº ${i + 1}`, 10, y);
    y += 6;
    doc.text(`Fecha: ${g.fecha}`, 10, y);
    y += 6;
    doc.text(`Categoría: ${g.categoria}`, 10, y);
    y += 6;
    doc.text(`Importe: ${g.importe} €`, 10, y);
    y += 6;
    doc.text(`Método: ${g.metodo}`, 10, y);
    y += 6;
    doc.text(`Tipo: ${g.tipoGasto}`, 10, y);
    y += 6;
    doc.text(`Estado: ${g.estado}`, 10, y);
    y += 6;
    doc.text(`Descripción: ${g.descripcion || "Sin detalles"}`, 10, y);
    y += 10;
  });

  doc.save("control_de_gastos.pdf");
});

cargar();
