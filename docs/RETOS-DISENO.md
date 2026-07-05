# Retos de diseño abiertos 🎨

Estos son los frentes donde el terrario puede mejorar visualmente. Cada uno está
pensado como un **issue `good first issue`**: acotado, sin tocar el núcleo del
motor, y con impacto visible. Ábrelos en la demo y propón.

> Demo: <https://chufladizo.github.io/arthropod-terrarium/> ·
> Guía: [docs/guia-diseno.html](guia-diseno.html)

---

## 1. 🐜 Rediseñar la hormiga obrera (especie piloto)
La colonia de hormigas es la que marca el patrón para las demás. Buscamos una
silueta de obrera más reconocible de un vistazo, que distinga bien sus castas
(obrera, soldado, exploradora) sin perder la estética de tinta sepia.
**Entrega:** propuesta SVG del bicho `ant` con sus castas. **Impacto:** alto (marca el estándar).

## 2. 🎨 Afinar la paleta de estados
Los 5 estados (activo, pendiente, atascado, hibernando, relevado) deben leerse
sin mirar la leyenda y ser accesibles para daltónicos. ¿Mejor contraste? ¿Un
segundo canal (forma/patrón) además del color?
**Entrega:** paleta propuesta + prueba en 2-3 bichos. **Impacto:** alto (legibilidad global).

## 3. 🕳 Mejorar el corte transversal de la colonia
Al entrar en una colonia se ve un corte subterráneo con 6 cámaras. Buscamos que
la jerarquía (reina arriba, vertedero abajo) y los túneles se lean mejor.
**Entrega:** boceto/SVG de la vista de cámaras. **Impacto:** medio-alto.

## 4. 🦋 Diferenciar visualmente a los que vuelan
Las especies con alas (mariposa, abeja, libélula) viven "en la net". ¿Cómo hacer
que se distingan de un vistazo de las local-first sin alas, más allá del ala en sí?
**Entrega:** propuesta de tratamiento visual para voladoras. **Impacto:** medio.

## 5. ✨ Micro-animaciones sutiles (opcional, sin romper la calma)
Un latido muy suave en los activos, una hoja que cae en los hibernando. Deben ser
apenas perceptibles y desactivables (respetar `prefers-reduced-motion`).
**Entrega:** CSS/SVG de la animación en un bicho. **Impacto:** medio (encanto).

## 6. 📱 Legibilidad en pantalla pequeña
El jardín se pensó para desktop. ¿Cómo se ve y se navega en móvil sin romper la
metáfora (nada de convertirlo en lista)?
**Entrega:** propuesta de adaptación responsive del overview. **Impacto:** medio.

## 7. 🏷 Iconografía de las lentes (comedero, compost, caminos)
Las lentes del overview necesitan iconos claros y coherentes con la lámina de
historia natural.
**Entrega:** set de iconos SVG para las lentes. **Impacto:** bajo-medio (pulido).

---

**¿Te animas con uno?** Comenta en su issue para que no lo pille otra persona a la
vez, abre la demo, y manda tu propuesta como captura o PR. Guía completa en
[CONTRIBUTING.md](../CONTRIBUTING.md).
