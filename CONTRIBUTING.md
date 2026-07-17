# Contribuir al Terrario 🦗

¡Gracias por pasarte! Este proyecto vive de la gente que lo mira, lo trastea y
propone cómo hacerlo **más bonito y más legible**. No hace falta ser experto: si
sabes abrir un HTML en el navegador, ya puedes ayudar.

> **La demo en vivo:** <https://chufladizo.github.io/arthropod-terrarium/>

---

## Formas de ayudar (de menos a más técnica)

1. **Dar tu opinión de diseño.** Abre la demo y cuéntame qué se entiende y qué no,
   qué bicho no se lee bien, qué color confunde. Abre un issue de tipo
   **💅 Mejora visual** — con una captura vale.
2. **Proponer una especie o casta nueva.** ¿Se te ocurre una anatomía mejor para
   una colonia? Usa la plantilla **🐛 Nueva especie / casta**.
3. **Reportar un fallo.** Algo se dibuja mal o el motor peta → **🐞 Bug**.
4. **Mandar un Pull Request.** Retoca un SVG, ajusta una paleta, mejora una
   animación. Mira los issues con la etiqueta [`good first issue`](https://github.com/chufladizo/arthropod-terrarium/labels/good%20first%20issue).

No hace falta que abras código para opinar: **las mejores contribuciones aquí son
de diseño y de legibilidad.**

---

## Antes de tocar nada: entiende el sistema visual

Todo el proyecto se apoya en **6 ejes de lectura** (el estado se lee *en el dibujo*,
no en el texto). Antes de proponer un cambio visual, hojea:

- **[Guía de diseño para colaboradores](docs/guia-diseno.html)** — ábrela en el
  navegador: muestra los 6 ejes dibujados en vivo, la arquitectura y los retos
  abiertos.
- **[docs/DISENO.md](docs/DISENO.md)** — el sistema visual en texto.
- **[docs/TAXONOMIA.md](docs/TAXONOMIA.md)** — la tabla especie ↔ área.

**Reglas de oro que no se rompen** (si tu idea las rompe, propónlo igual, pero
dilo explícitamente):

- Nada de **cuadrículas ni ventanas**: es un jardín, no un dashboard.
- **Halo verde = activo**, **punto naranja = próximo paso**, **tamaño = actividad**.
- Poco texto, muy ilustrativo. Estética de **lámina de historia natural** (papel
  con grano, tinta sepia). Todo **SVG paramétrico**, sin fotos ni webfonts.
- El flujo es **reina → colonia → detalle**.

---

## Montar el proyecto en local

Es un panel HTML estático: no necesitas servidor.

```bash
git clone https://github.com/chufladizo/arthropod-terrarium.git
cd arthropod-terrarium
npm install
npm run build     # construye la demo (ejemplo/ → demo/index.html)
npm run verify:all # juego, oficios, cuidadores, árboles y vista clásica
```

Luego abre `demo/index.html` en el navegador. Todo lo visual sale del motor en
`motor/` y de los datos ficticios en `ejemplo/` — **nunca uses datos reales en un PR.**

---

## Flujo de Pull Request

1. Haz un **fork** y una rama descriptiva: `git checkout -b diseno/hormiga-obrera`.
2. Cambia lo mínimo para tu propuesta. Si tocas SVG/paletas, **adjunta un antes/después**.
3. Ejecuta `npm test` — el PR debe reconstruir y superar toda la batería.
4. Abre el PR con la plantilla. Explica **qué eje visual** tocas y **por qué mejora
   la legibilidad**.

No pasa nada si el PR es imperfecto: se revisa con cariño y se itera.

---

## Código de conducta

Sé amable. Es un proyecto de hobby hecho con gusto por los bichos: se trata de
disfrutar diseñando, no de tener razón. Las críticas van al diseño, nunca a la persona.

## Licencia

Al contribuir aceptas que tu aportación se publique bajo [MIT](LICENSE).
