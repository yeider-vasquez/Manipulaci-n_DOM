// 1. Seleccionar elementos clave del DOM
const listaCursos = document.querySelector("#listaCursos");
const formulario = document.querySelector("#formCurso");
const buscador = document.querySelector("#buscador");
const mensaje = document.querySelector("#mensaje");
const contadorCursos = document.querySelector("#contadorCursos");

// 2. Arreglo inicial de cursos (Estado de la aplicación)
let cursos = [
    {
        nombre: "HTML y desarrollo web",
        descripcion: "Aprende a construir la estructura semántica y accesible de páginas web modernas."
    },
    {
        nombre: "Diseño con CSS",
        descripcion: "Aprende a diseñar interfaces atractivas, fluidas y totalmente adaptables con Flexbox y Grid."
    },
    {
        nombre: "Programación con JavaScript",
        descripcion: "Aprende a crear páginas web dinámicas, manipular el DOM y gestionar lógica interactiva."
    }
];

// 3. Función pura para mostrar/renderizar los cursos en el DOM
function mostrarCursos(datos) {
    // Limpieza previa y segura del contenedor
    listaCursos.replaceChildren();

    // Actualizar contador visual
    if (contadorCursos) {
        contadorCursos.textContent = `${datos.length} ${datos.length === 1 ? 'Curso' : 'Cursos'}`;
    }

    // Si no hay resultados de búsqueda o el catálogo está vacío
    if (datos.length === 0) {
        const noResultados = document.createElement("p");
        noResultados.textContent = "No se encontraron cursos que coincidan con la búsqueda.";
        noResultados.style.gridColumn = "1 / -1";
        noResultados.style.color = "#64748b";
        noResultados.style.padding = "20px";
        listaCursos.append(noResultados);
        return;
    }

    // Renderizar cada tarjeta de forma segura
    datos.forEach(function(curso) {
        const tarjeta = document.createElement("article");
        tarjeta.classList.add("curso");

        const titulo = document.createElement("h3");
        titulo.textContent = curso.nombre;

        const descripcion = document.createElement("p");
        descripcion.textContent = curso.descripcion;

        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar curso";
        botonEliminar.classList.add("btn-eliminar");

        // Evento para eliminar un curso específico
        botonEliminar.addEventListener("click", function() {
            cursos = cursos.filter(function(elemento) {
                return elemento !== curso;
            });

            // Re-renderizar catálogo filtrando la búsqueda activa si la hay
            const textoBusqueda = buscador.value.toLowerCase().trim();
            const cursosFiltrados = cursos.filter(c => c.nombre.toLowerCase().includes(textoBusqueda));
            
            mostrarCursos(cursosFiltrados);
            notificarUsuario(`El curso "${curso.nombre}" fue eliminado correctamente.`, "info");
        });

        tarjeta.append(titulo, descripcion, botonEliminar);
        listaCursos.append(tarjeta);
    });
}

// 4. Función para notificar acciones al usuario
function notificarUsuario(texto, tipo = "exito") {
    mensaje.className = `alerta-mensaje ${tipo}`;
    mensaje.removeAttribute("hidden");
    mensaje.textContent = texto;

    // Autocerrar el mensaje después de 4 segundos
    setTimeout(() => {
        mensaje.setAttribute("hidden", "true");
    }, 4000);
}

// 5. Registrar un nuevo curso desde el formulario
formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();

    // Validar requerimientos del HTML5
    if (!formulario.checkValidity()) {
        formulario.reportValidity();
        return;
    }

    const nombreInput = document.querySelector("#nombreCurso");
    const descripcionInput = document.querySelector("#descripcion");

    const nombre = nombreInput.value.trim();
    const descripcion = descripcionInput.value.trim();

    if (nombre.length < 3 || descripcion.length < 10) {
        notificarUsuario("El nombre debe tener al menos 3 caracteres y la descripción 10.", "error");
        return;
    }

    // Agregar nuevo curso al arreglo
    cursos.push({
        nombre: nombre,
        descripcion: descripcion
    });

    // Limpiar buscador si había un filtro activo para ver el nuevo curso
    buscador.value = "";
    mostrarCursos(cursos);

    formulario.reset();
    notificarUsuario(`¡Curso "${nombre}" registrado con éxito!`, "exito");
});

// 6. Filtrar cursos en tiempo real (Evento Input)
buscador.addEventListener("input", function() {
    const texto = buscador.value.toLowerCase().trim();

    const resultados = cursos.filter(function(curso) {
        return curso.nombre.toLowerCase().includes(texto);
    });

    mostrarCursos(resultados);
});

// 7. Carga inicial del catálogo
mostrarCursos(cursos);