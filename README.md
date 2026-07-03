# 💸 Compartimos

App web para dividir gastos en grupo (estilo "quién puso qué") y calcular
automáticamente **quién le tiene que transferir a quién**, minimizando la
cantidad de transferencias. Pensada para fútbol, asados, viajes, cenas y
cualquier junta donde después hay que arreglar las cuentas.

Funciona como **PWA instalable** (se agrega a la pantalla de inicio y abre a
pantalla completa) y está hecha en **HTML + CSS + JavaScript puro**, sin
frameworks ni dependencias en tiempo de ejecución.

---

## Características

### Gastos y grupos
- **Grupos independientes**: "Fútbol 5", "Asado del finde", "Viaje", cada uno
  con sus propias personas, foto, emoji y gastos, sin mezclarse.
- **Foto de portada** por grupo (estilo Splitwise): se elige del carrete, se
  comprime en el dispositivo y se muestra en el encabezado. Si el grupo está
  compartido, **la foto se sincroniza y todos ven la misma**.
- **Carga de gastos** con monto, descripción, categoría, quién pagó y un
  selector de **entre quiénes se divide** (se tildan solo los involucrados).
- **Categorías** con color: Cancha, Comida, Bebida, Supermercado, Transporte,
  Entradas, Alojamiento, Servicios, Regalos y Otros.

### Cálculo y liquidación
- **Deudas simplificadas**: combina todo en saldos netos y propone el **mínimo
  de transferencias posible**.
- **Marcar como pagado**: cuando alguien transfiere, se da de baja ese
  pendiente y el resto se recalcula solo.
- **Balances por persona** (quién puso de más y quién de menos).
- **Gráfico de torta** de gastos por categoría o por quién pagó.

### Compartir y exportar
- **Compartir el grupo por link**: los amigos entran, cargan gastos y todo se
  sincroniza entre los dispositivos.
- **Exportar a foto (PNG)**: imagen prolija con el resumen y el "quién le paga
  a quién", lista para mandar al grupo.
- **Exportar a CSV** y **backup/restore** completo en JSON (desde Ajustes).

### Organización
- **Grupos liquidados**: se puede "cerrar" un grupo para que no aparezca en el
  inicio; queda guardado en Ajustes y se puede reabrir cuando haga falta.

---

## Arquitectura

La app tiene dos partes:

1. **Front (este repo)** — un único `index.html` servido por GitHub Pages.
   Guarda los datos localmente en `localStorage`, así que funciona sola incluso
   sin conexión y sin cuentas.

2. **Backend de sincronización (opcional, por grupo)** — un Cloudflare Worker
   (`compartimos-api`) con base de datos D1. Solo se usa cuando un grupo se
   **comparte**: ahí los gastos, personas, liquidaciones, nombre, emoji y foto
   se suben al servidor y se reparten entre todos los que tienen el link.

Mientras un grupo no se comparte, es 100% local y nunca sale del dispositivo.

### Cómo funciona la sincronización
- Cada cambio se agrega a una **cola** en `localStorage` y se sube al Worker en
  cuanto hay conexión (con reintento automático si estás offline).
- La app hace **polling** cada pocos segundos del grupo activo compartido para
  traer los cambios de los demás.
- El servidor lleva un número de revisión (`rev`) por proyecto; si no cambió,
  la app no vuelve a dibujar (ahorra datos y batería).

---

## Puesta en marcha

### 1. Front (GitHub Pages)
1. Subí a la raíz del repositorio: `index.html`, `sw.js`, `manifest.json` y los
   íconos (`Logo.png`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`).
2. En el repo: **Settings → Pages → Source: Deploy from a branch**, rama `main`,
   carpeta `/ (root)`.
3. A los minutos queda publicada en
   `https://TU_USUARIO.github.io/NOMBRE_DEL_REPO/`.

### 2. Backend (solo si querés grupos compartidos)
La sincronización usa un Cloudflare Worker con una base D1 con tres tablas:
`proyectos`, `personas`, `gastos` y `liquidaciones`. El proyecto usa una tabla
`proyectos` con columnas `id`, `nombre`, `emoji`, `foto`, `creado` y `rev`.

El endpoint del Worker se configura en `index.html`, en la constante `API`.

---

## Instalarla como app (PWA)

- **Android (Chrome)**: abrí la URL → menú ⋮ → "Agregar a pantalla principal".
- **iPhone (Safari)**: abrí la URL → botón Compartir → "Agregar a inicio".

Queda con el `Logo.png` como ícono y abre a pantalla completa.

---

## Publicar una actualización (importante)

La app se **actualiza sola** en todos los dispositivos mediante un cartel
"Hay una versión nueva" con un botón para aplicarla en el momento. Nadie tiene
que reinstalar nada.

Para publicar cambios:

1. Editá lo que quieras en `index.html`.
2. En `sw.js`, subí el número de versión: `const VERSION = "v6";` → `"v7"` →
   `"v8"`, etc. **Este cambio de número es lo que dispara el cartel.**
3. Subí a GitHub **los dos archivos** (`index.html` y `sw.js`).

La próxima vez que cada persona abra o vuelva a la app, le aparece el cartel;
toca "Actualizar" y la app se recarga con la última versión.

> Nota: la primera vez que se introdujo este sistema, hubo que cerrar y
> reabrir la app una vez para que quedara instalado el mecanismo. De ahí en
> adelante, todas las actualizaciones son automáticas.

### Cómo cachea el Service Worker
- **HTML / navegación**: *network-first* (si hay red, siempre trae la última
  versión; el cache es solo para uso offline).
- **Resto de assets**: *cache-first*.
- Las llamadas al Worker de datos **nunca** se cachean: siempre van a la red
  para tener datos en vivo.

---

## Privacidad

No hay analytics ni seguimiento. Los datos de un grupo **no compartido** nunca
salen del dispositivo. Al **compartir** un grupo, sus datos (gastos, personas,
liquidaciones, nombre, emoji y foto) se guardan en el backend para poder
sincronizarlos entre los integrantes.

Si limpiás los datos del navegador se borra lo local: conviene **descargar el
backup cada tanto** desde Ajustes.

---

## Stack

HTML + CSS + JavaScript puro (vanilla), sin frameworks ni dependencias en
runtime. Un solo archivo para el front. Gráficos en SVG, la foto de resumen
generada con la Canvas API nativa, y sincronización opcional sobre un
Cloudflare Worker + D1.
