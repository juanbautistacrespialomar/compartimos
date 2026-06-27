# 💸 Dividir Gastos

App web para dividir gastos en grupo (estilo "quién puso qué") y calcular
automáticamente **quién le tiene que transferir a quién**, minimizando la
cantidad de transferencias. Pensada para fútbol, asados, viajes, cenas, etc.

Funciona 100% en el navegador, sin servidor ni cuentas: **todos los datos se
guardan en el propio dispositivo** (localStorage del navegador).

## Características

- **Proyectos independientes**: "Fútbol 5", "Cena con los pibes", "Viaje", cada
  uno con sus propias personas y gastos, sin mezclarse.
- **Carga de gastos** con monto, descripción, categoría, quién pagó y un
  selector de **entre quiénes se divide** (tildás solo a los involucrados).
- **Deudas simplificadas**: combina todo en saldos netos y propone el mínimo
  de transferencias posible.
- **Marcar como pagado**: cuando alguien te transfiere, das de baja ese
  pendiente y el resto se recalcula solo.
- **Gráfico de torta** de gastos por categoría o por quién pagó.
- **Exportar a foto (PNG)** para compartir el "quién paga a quién" en el grupo.
- **Exportar a CSV** y **backup/restore** completo en JSON.

## Cómo desplegarlo en GitHub Pages

1. Subí estos tres archivos a la raíz del repositorio:
   - `index.html`
   - `manifest.json`
   - `Logo.png` (cuadrado, idealmente 512×512 px)
2. En el repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
3. Elegí la rama `main` y la carpeta `/ (root)`. Guardá.
4. A los minutos queda publicada en `https://TU_USUARIO.github.io/NOMBRE_DEL_REPO/`.

## Instalarla como app en el celular (PWA)

- **Android (Chrome)**: abrí la URL → menú ⋮ → "Agregar a pantalla principal".
- **iPhone (Safari)**: abrí la URL → botón Compartir → "Agregar a inicio".

Queda con tu `Logo.png` como ícono y abre en pantalla completa.

## Privacidad

No hay backend ni analytics. Tus datos nunca salen del dispositivo salvo que
vos los exportes (CSV, foto o backup). Si limpiás los datos del navegador,
se borran: por eso conviene **descargar el backup cada tanto** desde Ajustes.

## Stack

HTML + CSS + JavaScript puro (vanilla), sin frameworks ni dependencias. Un solo
archivo. Gráficos en SVG y la foto generada con la Canvas API nativa.
