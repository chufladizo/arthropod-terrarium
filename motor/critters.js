// Arthropod Design — librería de bichos (SVG). Uso: bugSVG(tipo,colorHex)
// v2: hormigas paramétricas -> antV2({color,caste,vital}). El resto de especies
// se parametrizará en el fan-out por especie (silueta=colonia, forma=casta,
// color=estado, tamaño=actividad).
function shade(hex,f){let n=parseInt(hex.slice(1),16),r=(n>>16)&255,g=(n>>8)&255,b=n&255;
  r=Math.max(0,Math.min(255,Math.round(r*f)));g=Math.max(0,Math.min(255,Math.round(g*f)));b=Math.max(0,Math.min(255,Math.round(b*f)));
  return "#"+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);}
function legs(ps,col){return ps.map(p=>`<path d="${p}" stroke="${col}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`).join("");}
function eye(x,y,r){return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/><circle cx="${x+r*0.2}" cy="${y}" r="${r*0.5}" fill="#222"/>`;}

// ---- HORMIGAS PARAMÉTRICAS -------------------------------------------------
// o = { color:"#rrggbb"(estado), caste:"obrera|legionaria|cortadora|cosechadora|
//       carpintera|tejedora|melifera|bala|reina", vital:"ok|sleep|dead" }
function antV2(o){
  const c=o.color||"#b4502e", caste=o.caste||"obrera", vital=o.vital||"ok";
  const d=shade(c,.55), l=shade(c,1.34);
  let eyes;
  if(vital==="dead")      eyes=`<path d="M66 44 l6 6 M72 44 l-6 6" stroke="${d}" stroke-width="2.1" stroke-linecap="round"/>`;
  else if(vital==="sleep")eyes=`<path d="M66 47 q4 3 8 0" stroke="${d}" stroke-width="2.1" fill="none" stroke-linecap="round"/>`;
  else                    eyes=eye(70,46,3);
  // Tres pares con codo visible: la silueta se reconoce como hormiga incluso
  // a tamaño pequeño y conserva el lenguaje de tinta sepia del terrario.
  let legsArr=["M51 51 L43 43 L32 39","M50 55 L40 56 L29 54","M51 59 L43 67 L35 76","M58 51 L67 42 L76 38","M59 55 L70 56 L80 54","M58 59 L68 67 L76 75"];
  let head   =`<circle cx="66" cy="48" r="10" fill="${c}"/>`;
  let abd    =`<ellipse cx="34" cy="56" rx="15" ry="12" fill="${c}"/>`;
  let petiole=`<ellipse cx="52" cy="54" rx="8" ry="8" fill="${c}"/>`;
  let ant    =`<path d="M64 40 L69 33 L76 29 M67 41 L74 36 L82 36" stroke="${d}" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  let wings="", stinger="", mand="", carry="", crown="";
  switch(caste){
    case "legionaria":
      head=`<circle cx="67" cy="48" r="12" fill="${c}"/>`;
      mand=`<path d="M78 43 q8 1 9 -4 M78 53 q8 1 9 7" stroke="${d}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
      break;
    case "cortadora":
      carry=`<path d="M62 38 L72 24" stroke="${d}" stroke-width="2" stroke-linecap="round"/>`+
            `<g transform="translate(70,16) rotate(20)"><path d="M0 8 Q11 -7 24 1 Q13 13 0 8 Z" fill="#5bb04a" stroke="#3f7d33" stroke-width="1.4"/><path d="M3 7 L20 1" stroke="#3f7d33" stroke-width="1"/></g>`;
      break;
    case "cosechadora":
      mand=`<path d="M75 46 l4 1 M75 52 l4 0" stroke="${d}" stroke-width="2.2" stroke-linecap="round"/>`;
      carry=`<ellipse cx="84" cy="50" rx="6" ry="4.6" fill="#caa64e" stroke="#8f7327" stroke-width="1.2"/>`;
      break;
    case "carpintera":
      head=`<circle cx="66" cy="48" r="11" fill="${c}"/>`;
      carry=`<rect x="76" y="43" width="12" height="7" rx="1.5" fill="#9c6b3a" stroke="#6f4a25" stroke-width="1.2" transform="rotate(12 82 46)"/>`;
      break;
    case "tejedora":
      carry=`<path d="M76 48 q12 -7 19 4 q-9 7 -15 -1" fill="none" stroke="#e9f1ff" stroke-width="2"/><circle cx="95" cy="52" r="2.6" fill="#e9f1ff"/>`;
      break;
    case "melifera":
      abd=`<circle cx="29" cy="58" r="20" fill="${l}" opacity=".92"/><circle cx="29" cy="58" r="20" fill="none" stroke="${d}" stroke-width="1.6"/>`+
          `<path d="M20 53 q9 5 18 0 M21 62 q8 4 16 0" stroke="${d}" stroke-width="1.1" fill="none" opacity=".45"/>`;
      break;
    case "bala":
      head=`<circle cx="66" cy="48" r="11" fill="${c}"/>`;
      stinger=`<path d="M21 62 l-7 4 M22 56 l-8 2" stroke="${d}" stroke-width="2.4" stroke-linecap="round"/>`;
      mand=`<path d="M76 45 l6 -1 M76 51 l6 1" stroke="${d}" stroke-width="2.4" stroke-linecap="round"/>`;
      break;
    case "reina":
      abd=`<ellipse cx="31" cy="58" rx="20" ry="15" fill="${c}"/>`;
      wings=`<ellipse cx="46" cy="38" rx="22" ry="9" fill="#eef4ff" opacity=".55" transform="rotate(-18 46 38)"/>`+
            `<ellipse cx="41" cy="47" rx="17" ry="7" fill="#eef4ff" opacity=".5" transform="rotate(-7 41 47)"/>`;
      crown=`<path d="M59 39 l2 -8 l3 5 l3 -7 l3 6 l3 -5 l1 8 Z" fill="#f2c14e" stroke="${d}" stroke-width="1"/>`;
      break;
    default: break;
  }
  return `<g>${wings}${legs(legsArr,d)}${stinger}${ant}${abd}${petiole}${head}${carry}${mand}${crown}${eyes}</g>`;
}


const crit_ant=antV2;

// ---- beetle ----
// Arthropod Design — Escarabajos (Sistemas/PC Windows)
// Castas: rinoceronte|ciervo|tigre|gorgojo|bombardero|joya|obrero
// color base #3f7f9c · viewBox 100x100
// Globales requeridos: shade(hex,f), legs(ps,col), eye(x,y,r)

function crit_beetle(o){
  const c=o.color||"#3f7f9c", caste=o.caste||"obrero", vital=o.vital||"ok";
  const d=shade(c,.55), l=shade(c,1.34);

  // Ojos según estado vital
  let eyeEl;
  if(vital==="dead"){
    eyeEl=`<path d="M43 30 l5 5 M48 30 l-5 5" stroke="${d}" stroke-width="2.2" stroke-linecap="round"/>
            <path d="M57 30 l5 5 M62 30 l-5 5" stroke="${d}" stroke-width="2.2" stroke-linecap="round"/>`;
  } else if(vital==="sleep"){
    eyeEl=`<path d="M43 33 q2.5 3 7 0" stroke="${d}" stroke-width="2.1" fill="none" stroke-linecap="round"/>
            <path d="M57 33 q2.5 3 7 0" stroke="${d}" stroke-width="2.1" fill="none" stroke-linecap="round"/>`;
  } else {
    eyeEl=eye(46,31,2.8)+eye(58,31,2.8);
  }

  // Patas base de escarabajo (3 pares, simétricas)
  const legsArr=[
    "M38 52 L22 42","M38 60 L20 60","M38 68 L22 78",
    "M62 52 L78 42","M62 60 L80 60","M62 68 L78 78"
  ];

  // Cuerpo base: cabeza + élitros
  let head  = `<circle cx="50" cy="32" r="11" fill="${d}"/>`;
  let elytra= `<ellipse cx="50" cy="62" rx="26" ry="28" fill="${c}"/>`;
  let sutura= `<path d="M50 35 L50 88" stroke="${d}" stroke-width="3" stroke-linecap="round"/>`;
  // línea alar anterior (costura entre élitros y pronoto)
  let collar= `<path d="M32 48 Q50 44 68 48" stroke="${d}" stroke-width="2.4" fill="none"/>`;

  // Añadidos por casta
  let extra="";

  switch(caste){

    // RINOCERONTE — Meclorhina torquata — hardware/infra/arranque/BIOS
    // Seña: cuerno largo en la frente
    case "rinoceronte":
      extra=`<path d="M50 21 L50 4 Q50 0 53 2" stroke="${d}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
             <ellipse cx="50" cy="22" rx="14" ry="12" fill="${d}"/>`;
      head=`<ellipse cx="50" cy="30" rx="12" ry="11" fill="${d}"/>`;
      break;

    // CIERVO-VOLANTE — Lucanus cervus — drivers/BIOS/conflictos/DirectX
    // Seña: dos mandíbulas ramificadas a los lados de la cabeza
    case "ciervo":
      extra=`<path d="M36 30 Q24 24 18 16 M24 22 Q22 14 26 10" stroke="${d}" stroke-width="3.2" fill="none" stroke-linecap="round"/>
             <path d="M64 30 Q76 24 82 16 M76 22 Q78 14 74 10" stroke="${d}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
      head=`<circle cx="50" cy="31" r="12" fill="${d}"/>`;
      break;

    // TIGRE — Cicindela campestris — rendimiento/velocidad/GPU/optimización
    // Seña: mandíbulas pequeñas en V + rayas en los élitros
    case "tigre":
      extra=`<path d="M37 38 Q30 34 27 30" stroke="${d}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
             <path d="M63 38 Q70 34 73 30" stroke="${d}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
             <path d="M36 56 Q50 52 64 56" stroke="${l}" stroke-width="2" fill="none" opacity=".7"/>
             <path d="M34 66 Q50 62 66 66" stroke="${l}" stroke-width="2" fill="none" opacity=".7"/>
             <path d="M36 76 Q50 72 64 76" stroke="${l}" stroke-width="2" fill="none" opacity=".5"/>`;
      break;

    // GORGOJO — Curculio nucum — bugs/errores/crashes/diagnóstico
    // Seña: rostro/trompa larga en la cabeza
    case "gorgojo":
      head=`<circle cx="50" cy="33" r="10" fill="${d}"/>`;
      extra=`<path d="M50 44 L50 58" stroke="${d}" stroke-width="5" stroke-linecap="round"/>
             <ellipse cx="50" cy="60" rx="6" ry="4" fill="${d}"/>`;
      elytra=`<ellipse cx="50" cy="68" rx="22" ry="22" fill="${c}"/>`;
      sutura=`<path d="M50 50 L50 88" stroke="${d}" stroke-width="3" stroke-linecap="round"/>`;
      collar=`<path d="M35 54 Q50 50 65 54" stroke="${d}" stroke-width="2.4" fill="none"/>`;
      break;

    // BOMBARDERO — Brachinus crepitans — seguridad/BitLocker/antivirus/cifrado
    // Seña: abdomen abultado con "cañón" posterior + chorro
    case "bombardero":
      extra=`<ellipse cx="50" cy="74" rx="18" ry="12" fill="${d}" opacity=".7"/>
             <path d="M50 86 L50 96" stroke="${d}" stroke-width="5" stroke-linecap="round"/>
             <circle cx="50" cy="97" r="3.5" fill="${l}" opacity=".8"/>
             <path d="M44 96 Q50 100 56 96" stroke="${l}" stroke-width="2" fill="none" opacity=".6"/>`;
      break;

    // JOYA — Chrysochroa fulminans — personalización/estética/LEDs/UI/temas
    // Seña: élitros iridiscentes con puntos de brillo y reflejos
    case "joya":
      extra=`<ellipse cx="50" cy="62" rx="26" ry="28" fill="none" stroke="${l}" stroke-width="3" opacity=".7"/>
             <circle cx="40" cy="60" r="3.5" fill="${l}" opacity=".85"/>
             <circle cx="60" cy="60" r="3.5" fill="${l}" opacity=".85"/>
             <circle cx="44" cy="74" r="2.8" fill="${l}" opacity=".7"/>
             <circle cx="56" cy="74" r="2.8" fill="${l}" opacity=".7"/>
             <circle cx="50" cy="50" r="2.2" fill="${l}" opacity=".6"/>`;
      break;

    // OBRERO — Bolitophagus reticulatus — cajón de sastre / diagnóstico genérico
    default: break;
  }

  // Antenas
  const antennae=`<path d="M42 22 Q34 14 28 10" stroke="${d}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
                  <path d="M58 22 Q66 14 72 10" stroke="${d}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;

  return `<g>${legs(legsArr,d)}${elytra}${sutura}${collar}${head}${extra}${antennae}${eyeEl}</g>`;
}

// ---- butterfly ----
// Arthropod Design — Mariposas paramétricas (area: Visualización/Artefactos)
// o = { color:"#rrggbb", caste:"monarca|morpho|cometa|polilla|pavon", vital:"ok|sleep|dead" }
// Globals shade/legs/eye provided by critters.js environment

function crit_butterfly(o){
  const c=o.color||"#9a5cf0", caste=o.caste||"monarca", vital=o.vital||"ok";
  const d=shade(c,.55), l=shade(c,1.34);

  // Ojos según vital
  let eyes;
  if(vital==="dead")
    eyes=`<path d="M47 29 l5 5 M52 29 l-5 5" stroke="${d}" stroke-width="2.2" stroke-linecap="round"/>`;
  else if(vital==="sleep")
    eyes=`<path d="M46 31 q4 3 8 0" stroke="${d}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
  else
    eyes=eye(50,30,2.6);

  // Antenas base
  const antenas=`<path d="M48 28 L42 18 M52 28 L58 18" stroke="${d}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <circle cx="42" cy="17" r="2.2" fill="${d}"/><circle cx="58" cy="17" r="2.2" fill="${d}"/>`;

  // Cuerpo (abdomem + torax) base
  const cuerpo=`<ellipse cx="50" cy="52" rx="4.5" ry="22" fill="${d}"/>
    <ellipse cx="50" cy="31" rx="4" ry="7" fill="${d}"/>`;

  let alas_sup_izq, alas_sup_der, alas_inf_izq, alas_inf_der;
  let marcas="", colas="";

  switch(caste){

    // MONARCA: alas grandes redondeadas, nervios marcados, manchas blancas en borde
    // -> paneles grandes/artefactos vistosos
    case "monarca":
      alas_sup_izq =`<ellipse cx="28" cy="38" rx="22" ry="17" fill="${c}" opacity=".93"/>`;
      alas_sup_der =`<ellipse cx="72" cy="38" rx="22" ry="17" fill="${c}" opacity=".93"/>`;
      alas_inf_izq =`<ellipse cx="30" cy="62" rx="18" ry="14" fill="${c}" opacity=".88"/>`;
      alas_inf_der =`<ellipse cx="70" cy="62" rx="18" ry="14" fill="${c}" opacity=".88"/>`;
      // Nervios
      marcas=`<path d="M46 34 Q28 38 18 52" stroke="${d}" stroke-width="1.6" fill="none" opacity=".6"/>
        <path d="M54 34 Q72 38 82 52" stroke="${d}" stroke-width="1.6" fill="none" opacity=".6"/>
        <path d="M46 40 Q30 62 26 74" stroke="${d}" stroke-width="1.3" fill="none" opacity=".5"/>
        <path d="M54 40 Q70 62 74 74" stroke="${d}" stroke-width="1.3" fill="none" opacity=".5"/>`;
      // Manchas blancas en bordes
      marcas+=`<circle cx="18" cy="38" r="2.8" fill="#fff" opacity=".75"/>
        <circle cx="18" cy="46" r="2.2" fill="#fff" opacity=".65"/>
        <circle cx="82" cy="38" r="2.8" fill="#fff" opacity=".75"/>
        <circle cx="82" cy="46" r="2.2" fill="#fff" opacity=".65"/>
        <circle cx="24" cy="68" r="2.2" fill="#fff" opacity=".6"/>
        <circle cx="76" cy="68" r="2.2" fill="#fff" opacity=".6"/>`;
      break;

    // MORPHO: alas anchas y redondeadas, lustre iridiscente (banda clara central)
    // -> visual brillante/wow
    case "morpho":
      alas_sup_izq =`<ellipse cx="26" cy="37" rx="24" ry="18" fill="${c}" opacity=".95"/>`;
      alas_sup_der =`<ellipse cx="74" cy="37" rx="24" ry="18" fill="${c}" opacity=".95"/>`;
      alas_inf_izq =`<ellipse cx="28" cy="63" rx="19" ry="15" fill="${c}" opacity=".9"/>`;
      alas_inf_der =`<ellipse cx="72" cy="63" rx="19" ry="15" fill="${c}" opacity=".9"/>`;
      // Banda iridiscente central (lustre)
      marcas=`<ellipse cx="50" cy="38" rx="18" ry="10" fill="${l}" opacity=".45"/>
        <ellipse cx="50" cy="38" rx="10" ry="6" fill="#fff" opacity=".22"/>
        <ellipse cx="50" cy="62" rx="14" ry="8" fill="${l}" opacity=".35"/>`;
      // Ocelos (ojo de mariposa morpho)
      marcas+=`<circle cx="26" cy="37" r="5.5" fill="${d}" opacity=".35"/>
        <circle cx="26" cy="37" r="3" fill="${l}" opacity=".5"/>
        <circle cx="74" cy="37" r="5.5" fill="${d}" opacity=".35"/>
        <circle cx="74" cy="37" r="3" fill="${l}" opacity=".5"/>`;
      break;

    // COMETA (swallowtail): colas distintivas en alas inferiores, alas angulosas
    // -> dashboards con estilo
    case "cometa":
      alas_sup_izq =`<path d="M46 36 Q22 24 16 42 Q20 54 46 56 Z" fill="${c}" opacity=".93"/>`;
      alas_sup_der =`<path d="M54 36 Q78 24 84 42 Q80 54 54 56 Z" fill="${c}" opacity=".93"/>`;
      alas_inf_izq =`<path d="M46 54 Q18 60 20 72 Q26 80 46 70 Z" fill="${c}" opacity=".88"/>`;
      alas_inf_der =`<path d="M54 54 Q82 60 80 72 Q74 80 54 70 Z" fill="${c}" opacity=".88"/>`;
      // Colas
      colas=`<path d="M26 74 L20 90 Q24 93 28 88" stroke="${d}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
        <path d="M74 74 L80 90 Q76 93 72 88" stroke="${d}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
      // Marcas angulosas
      marcas=`<path d="M22 38 L42 52" stroke="${d}" stroke-width="1.4" fill="none" opacity=".5"/>
        <path d="M78 38 L58 52" stroke="${d}" stroke-width="1.4" fill="none" opacity=".5"/>
        <circle cx="28" cy="68" r="3.5" fill="${d}" opacity=".4"/>
        <circle cx="72" cy="68" r="3.5" fill="${d}" opacity=".4"/>`;
      break;

    // POLILLA: alas triangulares planas, patron discreto, sin brillo
    // -> utilidades internas/discretas
    case "polilla":
      alas_sup_izq =`<path d="M46 38 Q18 28 16 46 Q22 56 46 58 Z" fill="${d}" opacity=".82"/>`;
      alas_sup_der =`<path d="M54 38 Q82 28 84 46 Q78 56 54 58 Z" fill="${d}" opacity=".82"/>`;
      alas_inf_izq =`<path d="M46 56 Q20 58 22 70 Q30 76 46 68 Z" fill="${d}" opacity=".72"/>`;
      alas_inf_der =`<path d="M54 56 Q80 58 78 70 Q70 76 54 68 Z" fill="${d}" opacity=".72"/>`;
      // Patron discreto — bandas suaves
      marcas=`<path d="M18 42 Q32 50 46 50" stroke="${c}" stroke-width="1.8" fill="none" opacity=".45"/>
        <path d="M82 42 Q68 50 54 50" stroke="${c}" stroke-width="1.8" fill="none" opacity=".45"/>
        <circle cx="26" cy="52" r="3" fill="${c}" opacity=".3"/>
        <circle cx="74" cy="52" r="3" fill="${c}" opacity=".3"/>`;
      break;

    // PAVO (pavon/peacock): ojo grande en cada ala superior, muy ornamental
    // -> artefactos decorativos/juegos/diseño
    case "pavon":
      alas_sup_izq =`<ellipse cx="27" cy="36" rx="21" ry="16" fill="${c}" opacity=".95"/>`;
      alas_sup_der =`<ellipse cx="73" cy="36" rx="21" ry="16" fill="${c}" opacity=".95"/>`;
      alas_inf_izq =`<ellipse cx="29" cy="62" rx="17" ry="14" fill="${c}" opacity=".9"/>`;
      alas_inf_der =`<ellipse cx="71" cy="62" rx="17" ry="14" fill="${c}" opacity=".9"/>`;
      // Ocelo grande (ojo de pavoreal)
      marcas=`<circle cx="27" cy="36" r="9" fill="${d}" opacity=".5"/>
        <circle cx="27" cy="36" r="6" fill="${l}" opacity=".5"/>
        <circle cx="27" cy="36" r="3.5" fill="${d}" opacity=".7"/>
        <circle cx="27" cy="36" r="1.6" fill="${l}" opacity=".9"/>
        <circle cx="73" cy="36" r="9" fill="${d}" opacity=".5"/>
        <circle cx="73" cy="36" r="6" fill="${l}" opacity=".5"/>
        <circle cx="73" cy="36" r="3.5" fill="${d}" opacity=".7"/>
        <circle cx="73" cy="36" r="1.6" fill="${l}" opacity=".9"/>`;
      // Manchas en inf
      marcas+=`<circle cx="28" cy="64" r="3.5" fill="${d}" opacity=".35"/>
        <circle cx="72" cy="64" r="3.5" fill="${d}" opacity=".35"/>`;
      break;

    default:
      // default = monarca
      alas_sup_izq =`<ellipse cx="28" cy="38" rx="22" ry="17" fill="${c}" opacity=".93"/>`;
      alas_sup_der =`<ellipse cx="72" cy="38" rx="22" ry="17" fill="${c}" opacity=".93"/>`;
      alas_inf_izq =`<ellipse cx="30" cy="62" rx="18" ry="14" fill="${c}" opacity=".88"/>`;
      alas_inf_der =`<ellipse cx="70" cy="62" rx="18" ry="14" fill="${c}" opacity=".88"/>`;
      marcas=`<circle cx="18" cy="38" r="2.8" fill="#fff" opacity=".75"/>
        <circle cx="82" cy="38" r="2.8" fill="#fff" opacity=".75"/>`;
      break;
  }

  return `<g>${colas}${alas_inf_izq}${alas_inf_der}${alas_sup_izq}${alas_sup_der}${marcas}${cuerpo}${antenas}${eyes}</g>`;
}

// ---- spider ----
// Arthropod Design — Arañas paramétricas (Raspberry/Servidores caseros)
// o = { color:"#rrggbb", caste:"orbweaver|jumper|wolf|widow|crab", vital:"ok|sleep|dead" }
// Globals requeridos (definidos en critters.js): shade(hex,f), legs(ps,col), eye(x,y,r)

function crit_spider(o){
  const c=o.color||"#2f9b5e", caste=o.caste||"orbweaver", vital=o.vital||"ok";
  const d=shade(c,.55), l=shade(c,1.34);

  // Ojos según vital
  let eyes;
  if(vital==="dead")
    eyes=`<path d="M44 41 l5 5 M49 41 l-5 5" stroke="${d}" stroke-width="2" stroke-linecap="round"/>`+
         `<path d="M53 41 l5 5 M58 41 l-5 5" stroke="${d}" stroke-width="2" stroke-linecap="round"/>`;
  else if(vital==="sleep")
    eyes=`<path d="M44 44 q3 3 6 0" stroke="${d}" stroke-width="2" fill="none" stroke-linecap="round"/>`+
         `<path d="M53 44 q3 3 6 0" stroke="${d}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  else
    eyes=eye(46,42,2.6)+eye(54,42,2.6);

  // Cuerpo base: abdomen + cefalotórax + patas base
  let legsArr=["M44 52 Q24 40 16 48","M44 58 Q22 56 14 62","M44 64 Q24 72 18 80","M44 68 Q26 80 22 88",
                "M56 52 Q76 40 84 48","M56 58 Q78 56 86 62","M56 64 Q76 72 82 80","M56 68 Q74 80 78 88"];
  let abd    =`<ellipse cx="50" cy="64" rx="19" ry="17" fill="${c}"/>`;
  let ceph   =`<circle cx="50" cy="42" r="11" fill="${d}"/>`;
  let pedicel=`<ellipse cx="50" cy="54" rx="5" ry="5" fill="${d}"/>`;
  let spinnerets="", web="", marking="", extra="";

  switch(caste){

    // ORBE-TEJEDORA — Araneus diadematus
    // Servicios web / servidores HTTP — construye redes/estructuras persistentes
    case "orbweaver":
      legsArr=["M44 52 Q24 40 16 48","M44 58 Q22 56 14 62","M44 64 Q24 72 18 80","M44 68 Q26 80 22 88",
               "M56 52 Q76 40 84 48","M56 58 Q78 56 86 62","M56 64 Q76 72 82 80","M56 68 Q74 80 78 88"];
      abd=`<ellipse cx="50" cy="65" rx="20" ry="18" fill="${c}"/>`;
      // Cruz característica en el abdomen
      marking=`<path d="M50 50 L50 80 M36 62 L64 62" stroke="${d}" stroke-width="2.4" opacity=".5" stroke-linecap="round"/>`;
      // Tela de araña en esquina superior
      web=`<path d="M12 12 L50 42 M12 12 L12 42 M12 12 L42 12" stroke="${d}" stroke-width="1.2" opacity=".45" fill="none"/>` +
          `<path d="M14 26 Q31 24 44 42 M26 12 Q28 29 44 42" stroke="${d}" stroke-width="0.9" opacity=".35" fill="none"/>`;
      spinnerets=`<path d="M44 82 l-4 7 M50 83 l0 7 M56 82 l4 7" stroke="${d}" stroke-width="2" stroke-linecap="round"/>`;
      break;

    // SALTARINA — Phidippus regius
    // Scripts cortos / jobs / tareas one-shot — ágil, ejecuta y termina
    case "jumper":
      legsArr=["M44 52 Q32 44 26 48","M44 58 Q30 56 24 60","M44 64 Q32 70 28 76","M44 68 Q34 76 30 82",
               "M56 52 Q68 44 74 48","M56 58 Q70 56 76 60","M56 64 Q68 70 72 76","M56 68 Q66 76 70 82"];
      // Cefalotórax grande y cuadrado = rasgos de saltarina
      ceph=`<rect x="38" y="30" width="24" height="20" rx="5" fill="${d}"/>`;
      abd=`<ellipse cx="50" cy="63" rx="14" ry="13" fill="${c}"/>`;
      pedicel=`<ellipse cx="50" cy="51" rx="4" ry="4" fill="${d}"/>`;
      // Ojos anteriores medios muy grandes (trait definitorio)
      eyes= vital==="dead"
        ? `<path d="M44 36 l5 5 M49 36 l-5 5" stroke="${l}" stroke-width="2.2" stroke-linecap="round"/>`+
          `<path d="M53 36 l5 5 M58 36 l-5 5" stroke="${l}" stroke-width="2.2" stroke-linecap="round"/>`
        : vital==="sleep"
        ? `<path d="M44 39 q3 3 6 0" stroke="${l}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`+
          `<path d="M53 39 q3 3 6 0" stroke="${l}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`
        : `<circle cx="47" cy="37" r="4.5" fill="#fff"/><circle cx="47.8" cy="37" r="2.5" fill="#111"/>`+
          `<circle cx="55" cy="37" r="4.5" fill="#fff"/><circle cx="55.8" cy="37" r="2.5" fill="#111"/>`;
      marking=`<path d="M44 56 q6 4 12 0" stroke="${l}" stroke-width="1.6" fill="none" opacity=".55"/>`;
      break;

    // LOBO — Lycosa tarantula
    // Monitorización / hunting de procesos — patrulla activa, caza en suelo
    case "wolf":
      legsArr=["M44 52 Q26 38 18 42","M44 58 Q22 54 14 58","M44 64 Q26 74 20 82","M44 68 Q28 82 24 90",
               "M56 52 Q74 38 82 42","M56 58 Q78 54 86 58","M56 64 Q74 74 80 82","M56 68 Q72 82 76 90"];
      abd=`<ellipse cx="50" cy="65" rx="17" ry="15" fill="${c}"/>`;
      ceph=`<ellipse cx="50" cy="42" rx="13" ry="12" fill="${d}"/>`;
      // Franja dorsal característica de lobo
      marking=`<path d="M40 48 Q50 44 60 48 L58 78 Q50 82 42 78 Z" fill="${d}" opacity=".28"/>`;
      // Saco de huevos en spinnerets (cargan sus crías)
      spinnerets=`<circle cx="50" cy="80" r="6" fill="${l}" stroke="${d}" stroke-width="1.2"/>`;
      // Hileras
      extra=`<path d="M46 83 l-2 5 M54 83 l2 5" stroke="${d}" stroke-width="1.8" stroke-linecap="round"/>`;
      break;

    // VIUDA — Latrodectus mactans
    // Seguridad / firewall / reglas de acceso — peligrosa, conspicua, control total
    case "widow":
      legsArr=["M44 52 Q22 36 14 40","M44 58 Q20 54 12 58","M44 64 Q22 76 16 84","M44 68 Q24 84 18 92",
               "M56 52 Q78 36 86 40","M56 58 Q80 54 88 58","M56 64 Q78 76 84 84","M56 68 Q76 84 82 92"];
      abd=`<ellipse cx="50" cy="66" rx="21" ry="20" fill="${c}"/>`;
      ceph=`<circle cx="50" cy="43" r="10" fill="${d}"/>`;
      // Marca roja en reloj de arena — seña inequívoca de viuda
      marking=`<path d="M46 60 L54 60 L56 72 L50 75 L44 72 Z" fill="#c0392b" opacity=".88"/>` +
               `<path d="M46 60 L50 57 L54 60" fill="#c0392b" opacity=".88"/>`;
      spinnerets=`<path d="M46 85 l-3 6 M50 86 l0 6 M54 85 l3 6" stroke="${d}" stroke-width="2" stroke-linecap="round"/>`;
      break;

    // CANGREJO — Thomisus onustus
    // Almacenamiento / NAS / backup — quieta, emboscada, patas laterales extendidas
    case "crab":
      // Patas I y II muy extendidas hacia los lados (rasgo cangrejo)
      legsArr=["M44 50 Q26 34 10 32","M44 56 Q28 44 14 46","M44 64 Q32 72 26 78","M44 68 Q34 78 30 86",
               "M56 50 Q74 34 90 32","M56 56 Q72 44 86 46","M56 64 Q68 72 74 78","M56 68 Q66 78 70 86"];
      // Abdomen ancho y aplanado
      abd=`<ellipse cx="50" cy="64" rx="22" ry="16" fill="${c}"/>`;
      ceph=`<ellipse cx="50" cy="44" rx="14" ry="10" fill="${d}"/>`;
      pedicel=`<ellipse cx="50" cy="55" rx="6" ry="4" fill="${d}"/>`;
      // Marcas de camuflaje (almacenamiento = pasivo, quieto)
      marking=`<ellipse cx="42" cy="64" rx="5" ry="7" fill="${d}" opacity=".22"/>` +
               `<ellipse cx="58" cy="64" rx="5" ry="7" fill="${d}" opacity=".22"/>`;
      // Cilindro de NAS / disco
      extra=`<rect x="60" y="56" width="16" height="10" rx="3" fill="${l}" stroke="${d}" stroke-width="1.4"/>` +
            `<rect x="60" y="58" width="16" height="2" fill="${d}" opacity=".3"/>` +
            `<rect x="60" y="62" width="16" height="2" fill="${d}" opacity=".3"/>`;
      break;

    default: break;
  }

  return `<g>${web}${legs(legsArr,d)}${abd}${pedicel}${ceph}${marking}${spinnerets}${extra}${eyes}</g>`;
}

// ---- bee ----
// sp_bee.js — Abejas paramétricas (área: Negocio/Ideas, color base #e6a417)
// Castas basadas en tipos reales de abeja por utilidad de negocio:
//   obrera-melifera  → ingresos directos / operativa establecida (Apis mellifera)
//   exploradora      → scouting / nuevas ideas / investigación (Apis mellifera forager)
//   zangano          → experimentos / apuestas / especulación (Apis mellifera drone)
//   carpintera       → infra / montar el negocio / construcción (Xylocopa)
//   reina            → modelo de negocio / estrategia central (Apis mellifera queen)
//
// Señas de forma (NUNCA por color):
//   obrera-melifera  → cestillas de polen en patas traseras (bolas amarillas)
//   exploradora      → alas más largas y prominentes, antenas alargadas
//   zangano          → ojos compuestos grandes (toda la cabeza), sin aguijón, cuerpo robusto
//   carpintera       → sin bandas, tórax peludo prominente, mandíbulas marcadas
//   reina            → abdomen alargado, corona, alas simétricas grandes
//
// Globals esperados del entorno: shade(hex,f), legs(ps,col), eye(x,y,r)

function crit_bee(o){
  const c=o.color||"#e6a417", caste=o.caste||"obrera-melifera", vital=o.vital||"ok";
  const d=shade(c,.55), l=shade(c,1.34);

  // Ojos según vital
  let eyes;
  if(vital==="dead")
    eyes=`<path d="M44 33 l5 5 M49 33 l-5 5" stroke="${d}" stroke-width="2.2" stroke-linecap="round"/>`+
         `<path d="M55 33 l5 5 M60 33 l-5 5" stroke="${d}" stroke-width="2.2" stroke-linecap="round"/>`;
  else if(vital==="sleep")
    eyes=`<path d="M44 35 q3 3 6 0" stroke="${d}" stroke-width="2" fill="none" stroke-linecap="round"/>`+
         `<path d="M54 35 q3 3 6 0" stroke="${d}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  else
    eyes=eye(47,34,2.8)+eye(57,34,2.8);

  // Patas base (3 pares, abeja)
  const legsArr=["M40 58 L26 68","M44 64 L36 78","M56 64 L64 78","M60 58 L74 68","M50 66 L50 80","M44 60 L30 56"];
  let legsStr=legs(legsArr,d);

  // Cuerpo base: tórax + abdomen + cabeza + antenas + alas base
  let head    =`<circle cx="50" cy="34" r="10" fill="${c}"/>`;
  let thorax  =`<ellipse cx="50" cy="52" rx="12" ry="10" fill="${c}"/>`;
  let abdomen =`<ellipse cx="50" cy="68" rx="16" ry="14" fill="${c}"/>`;
  // Bandas por defecto (obrera-melifera y exploradoras)
  let bands   =`<path d="M36 62 Q50 59 64 62 M34 70 Q50 67 66 70" stroke="${d}" stroke-width="4.5" fill="none" opacity=".55"/>`;
  let antennae=`<path d="M44 26 L38 16 M56 26 L62 16" stroke="${d}" stroke-width="2.2" stroke-linecap="round"/>`;
  // Alas base
  let wings   =`<ellipse cx="34" cy="40" rx="18" ry="10" fill="#eaf6ff" opacity=".82" transform="rotate(-14 34 40)"/>`+
               `<ellipse cx="66" cy="40" rx="18" ry="10" fill="#eaf6ff" opacity=".82" transform="rotate(14 66 40)"/>`;

  let extra="";

  switch(caste){

    case "obrera-melifera":
      // Cestillas de polen en patas traseras: bolas naranjas cargadas
      extra=`<circle cx="26" cy="68" r="5.5" fill="#f5c842" stroke="#c8962a" stroke-width="1.2" opacity=".95"/>`+
            `<circle cx="74" cy="68" r="5.5" fill="#f5c842" stroke="#c8962a" stroke-width="1.2" opacity=".95"/>`;
      break;

    case "exploradora":
      // Antenas extra largas, alas prominentes (más grandes), sin polen
      antennae=`<path d="M44 26 L34 12 M56 26 L66 12" stroke="${d}" stroke-width="2.4" stroke-linecap="round"/>`;
      wings=`<ellipse cx="30" cy="38" rx="23" ry="11" fill="#eaf6ff" opacity=".88" transform="rotate(-18 30 38)"/>`+
            `<ellipse cx="70" cy="38" rx="23" ry="11" fill="#eaf6ff" opacity=".88" transform="rotate(18 70 38)"/>`;
      extra=`<circle cx="34" cy="12" r="2.4" fill="${d}"/><circle cx="66" cy="12" r="2.4" fill="${d}"/>`;
      break;

    case "zangano":
      // Ojos compuestos gigantes (casi toda la cabeza), cuerpo más rechoncho, sin aguijón, antenas cortas
      head=`<circle cx="50" cy="34" r="12" fill="${c}"/>`+
           `<ellipse cx="42" cy="32" rx="8" ry="9" fill="${d}" opacity=".7"/>`+
           `<ellipse cx="58" cy="32" rx="8" ry="9" fill="${d}" opacity=".7"/>`;
      // ojos sobrescritos abajo
      if(vital==="dead")
        eyes=`<path d="M39 32 l4 4 M43 32 l-4 4" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>`+
             `<path d="M57 32 l4 4 M61 32 l-4 4" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>`;
      else if(vital==="sleep")
        eyes=`<path d="M38 34 q4 3 8 0" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round"/>`+
             `<path d="M54 34 q4 3 8 0" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
      else
        eyes=`<circle cx="42" cy="31" r="3.5" fill="#fff" opacity=".85"/><circle cx="43" cy="31" r="1.8" fill="#111"/>`+
             `<circle cx="58" cy="31" r="3.5" fill="#fff" opacity=".85"/><circle cx="59" cy="31" r="1.8" fill="#111"/>`;
      abdomen=`<ellipse cx="50" cy="68" rx="18" ry="15" fill="${c}"/>`;
      bands=`<path d="M33 65 Q50 62 67 65" stroke="${d}" stroke-width="4" fill="none" opacity=".45"/>`;
      antennae=`<path d="M45 25 L41 17 M55 25 L59 17" stroke="${d}" stroke-width="2" stroke-linecap="round"/>`;
      break;

    case "carpintera":
      // Sin bandas, tórax peludo prominente, mandíbulas marcadas, cuerpo más oscuro
      bands="";
      thorax=`<ellipse cx="50" cy="52" rx="14" ry="11" fill="${d}" opacity=".9"/>`+
             // pelaje (líneas cortas simétricas sobre tórax)
             `<path d="M38 48 l-4 -3 M42 46 l-2 -4 M50 45 l0 -4 M58 46 l2 -4 M62 48 l4 -3" stroke="${l}" stroke-width="1.4" stroke-linecap="round" opacity=".7"/>`;
      // mandíbulas
      extra=`<path d="M42 40 q-6 -2 -8 2" stroke="${d}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`+
            `<path d="M58 40 q6 -2 8 2" stroke="${d}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
      break;

    case "reina":
      // Abdomen alargado, alas grandes simétricas, corona
      abdomen=`<ellipse cx="50" cy="72" rx="13" ry="20" fill="${c}"/>`;
      bands=`<path d="M38 66 Q50 63 62 66 M37 74 Q50 71 63 74 M39 82 Q50 79 61 82" stroke="${d}" stroke-width="4" fill="none" opacity=".5"/>`;
      wings=`<ellipse cx="29" cy="38" rx="26" ry="12" fill="#eaf6ff" opacity=".88" transform="rotate(-16 29 38)"/>`+
            `<ellipse cx="71" cy="38" rx="26" ry="12" fill="#eaf6ff" opacity=".88" transform="rotate(16 71 38)"/>`;
      extra=`<path d="M40 25 l2 -8 l4 5 l4 -9 l4 7 l4 -5 l2 8 Z" fill="#f2c14e" stroke="${d}" stroke-width="1"/>`;
      break;

    default: break;
  }

  return `<g>${wings}${legsStr}${antennae}${abdomen}${bands}${thorax}${head}${extra}${eyes}</g>`;
}

// ---- scorpion ----
// Arthropod Design — Scorpion paramétrico
// sp_scorpion.js — crit_scorpion({color, caste, vital})
// Castas reales de escorpión por utilidad de proyecto:
//   emperador  (Pandinus imperator)      — arquitectura/banco de pruebas grande/simuladores
//   corteza    (Centruroides sculpturatus)— sensores pequeños críticos/análisis señal preciso
//   dorado     (Leiurus quinquestriatus)  — alimentación/potencia/documentación de referencia
//   vinagrillo (Mastigoproctus giganteus) — medición/cableado/herramientas de conexión
//   imperial   (Heterometrus spinifer)    — arquitectura media/proyectos mixtos/agente IA

// (helpers shade/legs/eye: definidos una sola vez al inicio del archivo)

// ---- ESCORPIONES PARAMÉTRICOS -----------------------------------------------
// o = { color:"#rrggbb", caste:"emperador|corteza|dorado|vinagrillo|imperial", vital:"ok|sleep|dead" }
function crit_scorpion(o){
  const c=o.color||"#cf3b2c", caste=o.caste||"imperial", vital=o.vital||"ok";
  const d=shade(c,.55), l=shade(c,1.34);

  // ----- ojos según vital -----
  let eyes;
  if(vital==="dead")
    eyes=`<path d="M44 56 l5 5 M49 56 l-5 5" stroke="${d}" stroke-width="2.1" stroke-linecap="round"/>`+
         `<path d="M55 56 l5 5 M60 56 l-5 5" stroke="${d}" stroke-width="2.1" stroke-linecap="round"/>`;
  else if(vital==="sleep")
    eyes=`<path d="M44 58 q3 3 6 0" stroke="${d}" stroke-width="2.1" fill="none" stroke-linecap="round"/>`+
         `<path d="M55 58 q3 3 6 0" stroke="${d}" stroke-width="2.1" fill="none" stroke-linecap="round"/>`;
  else
    eyes=eye(47,57,2.6)+eye(58,57,2.6);

  // ----- patas base (4 pares) -----
  const baseLegs=legs([
    "M40 62 L24 56","M40 66 L24 68","M40 70 L26 80",
    "M60 62 L76 56","M60 66 L76 68","M60 70 L74 80"
  ],d);

  // ----- tronco/mesosoma base -----
  let body    =`<ellipse cx="50" cy="64" rx="14" ry="16" fill="${c}"/>`;
  let head    =`<ellipse cx="50" cy="52" rx="10" ry="9" fill="${c}"/>`;

  // ----- cola base: curva hacia arriba/izquierda (metasoma) -----
  let tail    =`<path d="M50 80 Q58 90 72 86 Q84 82 82 70" stroke="${c}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  let stinger =`<path d="M82 70 Q88 64 84 60" stroke="${d}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  let bulb    =`<circle cx="84" cy="60" r="4.5" fill="${d}"/>`;

  // ----- queliceros (boca) -----
  let chelicera=`<path d="M45 46 q-3 -4 -2 -7 M55 46 q3 -4 2 -7" stroke="${d}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;

  // ----- pedipalpos/pinzas: default mediano -----
  let claws=`<path d="M44 56 Q30 48 22 50 Q16 50 14 46 M22 50 Q16 52 14 56" stroke="${d}" stroke-width="3" fill="none" stroke-linecap="round"/>`+
            `<path d="M56 56 Q70 48 78 50 Q84 50 86 46 M78 50 Q84 52 86 56" stroke="${d}" stroke-width="3" fill="none" stroke-linecap="round"/>`;

  // ----- extras por casta -----
  let extra="";

  switch(caste){

    // EMPERADOR: Pandinus imperator — cuerpo grande, pinzas enormes, cola gruesa
    case "emperador":
      body   =`<ellipse cx="50" cy="65" rx="18" ry="20" fill="${c}"/>`;
      head   =`<ellipse cx="50" cy="50" rx="13" ry="11" fill="${c}"/>`;
      claws  =`<path d="M42 55 Q26 44 16 46 Q9 46 7 40 M16 46 Q9 49 7 54" stroke="${d}" stroke-width="4.2" fill="none" stroke-linecap="round"/>`+
               `<path d="M58 55 Q74 44 84 46 Q91 46 93 40 M84 46 Q91 49 93 54" stroke="${d}" stroke-width="4.2" fill="none" stroke-linecap="round"/>`;
      tail   =`<path d="M50 85 Q62 96 78 92 Q93 87 90 74" stroke="${c}" stroke-width="9" fill="none" stroke-linecap="round"/>`;
      stinger=`<path d="M90 74 Q97 66 92 60" stroke="${d}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
      bulb   =`<circle cx="92" cy="60" r="5.5" fill="${d}"/>`;
      // segmentos del metasoma marcados
      extra  =`<path d="M52 80 Q60 83 66 78 M56 85 Q63 89 70 84 M58 90 Q64 94 73 90" stroke="${d}" stroke-width="1.2" fill="none" opacity=".55"/>`;
      break;

    // CORTEZA: Centruroides sculpturatus — pequeño, cola larga y delgada, pinzas finas
    case "corteza":
      body   =`<ellipse cx="50" cy="64" rx="10" ry="13" fill="${c}"/>`;
      head   =`<ellipse cx="50" cy="53" rx="8" ry="7" fill="${c}"/>`;
      claws  =`<path d="M44 57 Q32 51 26 53 Q22 53 20 50 M26 53 Q22 55 20 57" stroke="${d}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`+
               `<path d="M56 57 Q68 51 74 53 Q78 53 80 50 M74 53 Q78 55 80 57" stroke="${d}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
      // cola muy larga y fina: rasgo de Centruroides
      tail   =`<path d="M50 77 Q56 88 68 90 Q80 92 86 82 Q92 72 88 64" stroke="${c}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
      stinger=`<path d="M88 64 Q94 58 90 53" stroke="${d}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`;
      bulb   =`<circle cx="90" cy="53" r="3.5" fill="${d}"/>`;
      break;

    // DORADO: Leiurus quinquestriatus — cuerpo robusto, cola con bulbo prominente, venas en el dorso
    case "dorado":
      body   =`<ellipse cx="50" cy="64" rx="15" ry="17" fill="${c}"/>`;
      head   =`<ellipse cx="50" cy="51" rx="11" ry="10" fill="${c}"/>`;
      // pinzas medianas redondeadas
      claws  =`<path d="M43 56 Q28 47 20 50 Q14 50 12 44 M20 50 Q14 53 12 58" stroke="${d}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`+
               `<path d="M57 56 Q72 47 80 50 Q86 50 88 44 M80 50 Q86 53 88 58" stroke="${d}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
      // bulbo del aguijon muy prominente (alta potencia)
      tail   =`<path d="M50 81 Q60 92 74 88 Q86 84 84 72" stroke="${c}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
      stinger=`<path d="M84 72 Q90 65 86 58" stroke="${d}" stroke-width="3.8" fill="none" stroke-linecap="round"/>`;
      bulb   =`<circle cx="86" cy="58" r="6.5" fill="${l}" stroke="${d}" stroke-width="1.8"/>`;
      // venas dorsales = líneas de alta tensión
      extra  =`<path d="M43 58 Q50 54 57 58 M44 63 Q50 60 56 63 M45 69 Q50 66 55 69" stroke="${d}" stroke-width="1.1" fill="none" opacity=".45"/>`;
      break;

    // VINAGRILLO: Mastigoproctus giganteus — cola en látigo (telson delgadísimo), sin aguijón venenoso
    case "vinagrillo":
      body   =`<ellipse cx="50" cy="63" rx="12" ry="15" fill="${c}"/>`;
      head   =`<ellipse cx="50" cy="51" rx="9" ry="8" fill="${c}"/>`;
      // pinzas alargadas para sujetar cables
      claws  =`<path d="M43 56 Q28 49 22 52 Q18 52 16 48 M22 52 Q17 54 16 58" stroke="${d}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`+
               `<path d="M57 56 Q72 49 78 52 Q82 52 84 48 M78 52 Q83 54 84 58" stroke="${d}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
      // COLA LÁTIGO: muy fina y larga, sin bulbo venenoso, termina en punta
      tail   =`<path d="M50 78 Q55 86 64 86 Q76 86 82 78 Q88 70 90 60 Q92 50 94 42" stroke="${d}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
      stinger=`<path d="M94 42 Q96 36 95 30" stroke="${d}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
      bulb   =`<circle cx="95" cy="30" r="2" fill="${d}"/>`;
      // primer par de patas muy alargadas (característico del vinagrillo)
      extra  =`<path d="M40 62 L14 44 M60 62 L86 44" stroke="${d}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`;
      break;

    // IMPERIAL: Heterometrus spinifer — proporciones equilibradas, espinas dorsales
    case "imperial":
    default:
      // proporciones estándar heredadas de base; añadir espinas dorsales
      extra  =`<path d="M46 50 L42 43 M50 48 L50 41 M54 50 L58 43" stroke="${d}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
      break;
  }

  return `<g>${baseLegs}${tail}${stinger}${bulb}${extra}${body}${head}${chelicera}${claws}${eyes}</g>`;
}

// ---- centipede ----
// Arthropod Design — CIEMPIES parametrico
// Area: Comunidades/Datos (VPostal) · Color base: #dd4f86
// Castas: escolopendra | escutigera | geofilida | miriapoda | lithobiida
// o = { color, caste, vital }

function crit_centipede(o) {
  const c = o.color || "#dd4f86", caste0 = o.caste || "escolopendra", vital = o.vital || "ok";
  // Mapa casta funcional (castas.json) -> forma anatomica, segun el campo `sp` de cada casta.
  // rastreador=Lithobius->lithobiida | indexador=Scutigera->escutigera
  // fusionador/desplegador/recolector=Scolopendromorpha->escolopendra
  // ensamblador/mensajero/segador/alcantarillero=Geophilomorpha->geofilida
  // (los nombres anatomicos siguen siendo validos como alias de compatibilidad)
  const CENTI_FORMA = {
    rastreador: "lithobiida", indexador: "escutigera",
    fusionador: "escolopendra", desplegador: "escolopendra", recolector: "escolopendra",
    ensamblador: "geofilida", mensajero: "geofilida", segador: "geofilida", alcantarillero: "geofilida"
  };
  const caste = CENTI_FORMA[caste0] || caste0;
  const d = shade(c, .55), l = shade(c, 1.34);

  // ---- OJOS segun vital ----
  let eyes;
  if (vital === "dead")
    eyes = `<path d="M16 37 l5 5 M21 37 l-5 5" stroke="${d}" stroke-width="2" stroke-linecap="round"/>`;
  else if (vital === "sleep")
    eyes = `<path d="M15 40 q3 3 7 0" stroke="${d}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  else
    eyes = eye(16, 39, 2.5) + eye(23, 38, 2.5);

  // ---- ANTENAS base ----
  let ant = `<path d="M13 34 L8 26 M19 33 L18 23" stroke="${d}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;

  // ---- SWITCH DE CASTA ----
  // Cada casta modifica: segmentos, patas, antenas, apendices

  if (caste === "escolopendra") {
    // Escolopendra: cuerpo largo, 9 segmentos bien definidos, patas robustas
    // pipeline de datos largo — muchos segmentos encadenados
    const pts = [[22,44],[31,48],[40,50],[49,51],[58,51],[67,50],[76,48],[85,46],[91,43]];
    let body = "";
    // patas por segmento (robustas, cortas, paralelas)
    pts.forEach((p, i) => {
      body += `<path d="M${p[0]} ${p[1]} l-5 9 M${p[0]} ${p[1]} l5 9" stroke="${d}" stroke-width="2.8" stroke-linecap="round"/>`;
    });
    // patas traseras forcipuladas (veneno) — ultimas patas largas
    body += `<path d="M91 43 l7 10 M91 43 l-3 12" stroke="${d}" stroke-width="2.4" stroke-linecap="round"/>`;
    // segmentos (cabeza grande, resto medianos)
    pts.forEach((p, i) => {
      const r = i === 0 ? 10 : 7;
      const fill = i === 0 ? d : c;
      body += `<circle cx="${p[0]}" cy="${p[1]}" r="${r}" fill="${fill}"/>`;
    });
    // segmentos: linea dorsal
    body += `<path d="M31 48 Q58 51 91 43" stroke="${d}" stroke-width="1.2" fill="none" opacity=".4"/>`;
    return `<g>${body}${ant}${eyes}</g>`;

  } else if (caste === "escutigera") {
    // Escutigera: cuerpo corto, patas MUY largas y finas, antenas larguisimas
    // scraping rapido, patas que llegan lejos
    const pts = [[28,46],[38,50],[48,52],[58,52],[68,50],[78,47]];
    let body = "";
    // patas largas y finas (llegan a los bordes del viewBox)
    const legOffsetsL = [[-18,14],[-20,8],[-20,0],[-18,-8],[-14,-16],[-10,-22]];
    const legOffsetsR = [[12,14],[14,8],[16,0],[14,-8],[12,-16],[10,-22]];
    pts.forEach((p, i) => {
      body += `<path d="M${p[0]} ${p[1]} l${legOffsetsL[i][0]} ${legOffsetsL[i][1]}" stroke="${d}" stroke-width="1.6" stroke-linecap="round"/>`;
      body += `<path d="M${p[0]} ${p[1]} l${legOffsetsR[i][0]} ${legOffsetsR[i][1]}" stroke="${d}" stroke-width="1.6" stroke-linecap="round"/>`;
    });
    pts.forEach((p, i) => {
      const r = i === 0 ? 9 : 6.5;
      const fill = i === 0 ? d : c;
      body += `<circle cx="${p[0]}" cy="${p[1]}" r="${r}" fill="${fill}"/>`;
    });
    // antenas larguisimas (el rasgo distintivo de escutigera)
    const antEscutigera = `<path d="M23 41 L4 22 M28 39 L18 16" stroke="${d}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    return `<g>${body}${antEscutigera}${eyes}</g>`;

  } else if (caste === "geofilida") {
    // Geofilido: cuerpo MUY largo y delgado, segmentos numerosos y pequenos
    // datos enterrados / bases de datos / correcciones profundas
    const nSeg = 14;
    let body = "";
    // trayectoria sinuosa (como geofilido excavando)
    const pts14 = [];
    for (let i = 0; i < nSeg; i++) {
      const x = 10 + i * 6.2;
      const y = 50 + Math.round(Math.sin(i * 0.9) * 7);
      pts14.push([Math.round(x), y]);
    }
    pts14.forEach((p, i) => {
      // patas muy cortas y numerosas
      body += `<path d="M${p[0]} ${p[1]} l-3 6 M${p[0]} ${p[1]} l3 6" stroke="${d}" stroke-width="1.8" stroke-linecap="round"/>`;
    });
    pts14.forEach((p, i) => {
      const r = i === 0 ? 7 : 4.5;
      const fill = i === 0 ? d : c;
      body += `<circle cx="${p[0]}" cy="${p[1]}" r="${r}" fill="${fill}"/>`;
    });
    // antenas cortas (vive bajo tierra, no las necesita largas)
    const antGeo = `<path d="M7 46 L4 40 M10 44 L9 37" stroke="${d}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
    const eyesGeo = vital === "dead"
      ? `<path d="M6 43 l3 3 M9 43 l-3 3" stroke="${d}" stroke-width="1.6" stroke-linecap="round"/>`
      : vital === "sleep"
      ? `<path d="M5 44 q2 2 5 0" stroke="${d}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`
      : eye(6, 43, 1.8) + eye(11, 42, 1.8);
    return `<g>${body}${antGeo}${eyesGeo}</g>`;

  } else if (caste === "miriapoda") {
    // Milpies (diplopoda): cuerpo REDONDEADO, segmentos esfericos apilados, DOS pares de patas por segmento
    // acumulacion / archivado / recursos almacenados
    const pts = [[22,50],[32,48],[42,47],[52,47],[62,47],[72,48],[80,50],[86,54]];
    let body = "";
    pts.forEach((p, i) => {
      // dos pares de patas por segmento (milpies = 2 pares/seg)
      body += `<path d="M${p[0]} ${p[1]-2} l-5 8 M${p[0]} ${p[1]+2} l-4 8" stroke="${d}" stroke-width="1.8" stroke-linecap="round"/>`;
      body += `<path d="M${p[0]} ${p[1]-2} l5 8 M${p[0]} ${p[1]+2} l4 8" stroke="${d}" stroke-width="1.8" stroke-linecap="round"/>`;
    });
    pts.forEach((p, i) => {
      // segmentos esfericos, mas anchos (acumulacion)
      const r = i === 0 ? 10 : 8;
      const fill = i === 0 ? d : c;
      body += `<circle cx="${p[0]}" cy="${p[1]}" r="${r}" fill="${fill}"/>`;
    });
    // segmento terminal redondeado (cola roma del milpies)
    body += `<ellipse cx="90" cy="55" rx="5" ry="4" fill="${d}"/>`;
    return `<g>${body}${ant}${eyes}</g>`;

  } else if (caste === "lithobiida") {
    // Lithobius: 7 segmentos medianos, forma clasica de ciempies de piedra
    // estructura base / soporte / catalogacion
    const pts = [[24,44],[33,48],[42,51],[51,52],[60,51],[69,48],[78,44]];
    let body = "";
    pts.forEach((p, i) => {
      body += `<path d="M${p[0]} ${p[1]} l-5 9 M${p[0]} ${p[1]} l5 9" stroke="${d}" stroke-width="2.4" stroke-linecap="round"/>`;
    });
    pts.forEach((p, i) => {
      const r = i === 0 ? 9 : 7;
      const fill = i === 0 ? d : c;
      body += `<circle cx="${p[0]}" cy="${p[1]}" r="${r}" fill="${fill}"/>`;
    });
    return `<g>${body}${ant}${eyes}</g>`;

  } else {
    // fallback = escolopendra
    const pts = [[22,44],[31,48],[40,50],[49,51],[58,51],[67,50],[76,48],[85,46]];
    let body = "";
    pts.forEach((p, i) => {
      body += `<path d="M${p[0]} ${p[1]} l-5 9 M${p[0]} ${p[1]} l5 9" stroke="${d}" stroke-width="2.6" stroke-linecap="round"/>`;
    });
    pts.forEach((p, i) => {
      const r = i === 0 ? 10 : 7.5;
      const fill = i === 0 ? d : c;
      body += `<circle cx="${p[0]}" cy="${p[1]}" r="${r}" fill="${fill}"/>`;
    });
    return `<g>${body}${ant}${eyes}</g>`;
  }
}

// ---- dung ----
// Peloteros (dung beetles) — Arthropod Design v2
// Castas: rodador | sagrado | minotauro | tunelador
// viewBox 100x100; globales shade/legs/eye requeridos en scope

function crit_dung(o) {
  const c = o.color || "#16a890", caste = o.caste || "rodador", vital = o.vital || "ok";
  const d = shade(c, .55), l = shade(c, 1.34);

  // Ojos segun vital
  let eyes;
  if (vital === "dead")
    eyes = `<path d="M58 49 l5 5 M63 49 l-5 5" stroke="${d}" stroke-width="2" stroke-linecap="round"/>`;
  else if (vital === "sleep")
    eyes = `<path d="M58 52 q3 3 7 0" stroke="${d}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  else
    eyes = eye(61, 51, 2.8);

  // Patas base: 3 pares
  const legsBase = legs([
    "M54 58 L42 68", "M58 62 L52 78", "M64 58 L76 68",
    "M46 56 L36 52", "M48 62 L38 72", "M70 62 L80 72"
  ], d);

  // Cabeza base
  let head = `<circle cx="62" cy="52" r="10" fill="${c}"/>`;

  // Bola de estiercol (elemento comun)
  let ball = `<circle cx="26" cy="64" r="20" fill="#7a5a30" stroke="#5a4020" stroke-width="2"/>
    <circle cx="20" cy="58" r="4" fill="#5a4020" opacity=".5"/>
    <circle cx="32" cy="70" r="3" fill="#5a4020" opacity=".45"/>
    <circle cx="24" cy="74" r="2.2" fill="#5a4020" opacity=".35"/>`;

  // Cuerpo (elytros)
  let body = `<ellipse cx="58" cy="62" rx="18" ry="17" fill="${c}"/>
    <path d="M58 46 L58 79" stroke="${d}" stroke-width="2.8"/>
    <path d="M42 56 Q58 52 74 56" stroke="${d}" stroke-width="2" fill="none"/>`;

  // Pronoto (cabeza-torax union)
  let thorax = `<ellipse cx="54" cy="54" rx="8" ry="6" fill="${c}"/>`;

  // Cuernos / rasgos por casta
  let horns = "", ballExtra = "", legExtra = "";

  switch (caste) {
    case "rodador":
      // Scarabaeus-tipo liso: empuja la bola con las patas traseras
      // bola grande, patas traseras extendidas hacia la bola
      ball = `<circle cx="24" cy="66" r="22" fill="#7a5a30" stroke="#5a4020" stroke-width="2"/>
        <circle cx="18" cy="58" r="4.5" fill="#5a4020" opacity=".5"/>
        <circle cx="30" cy="74" r="3.5" fill="#5a4020" opacity=".45"/>
        <circle cx="20" cy="76" r="2.5" fill="#5a4020" opacity=".35"/>`;
      legExtra = `<path d="M54 66 L36 70" stroke="${d}" stroke-width="3.2" stroke-linecap="round"/>
        <path d="M56 70 L38 78" stroke="${d}" stroke-width="3.2" stroke-linecap="round"/>`;
      break;

    case "sagrado":
      // Scarabaeus sacer: cabeza en forma de abanico (corona)
      head = `<circle cx="62" cy="52" r="10" fill="${c}"/>`;
      horns = `<path d="M56 43 l-4 -7 M60 42 l-2 -8 M64 42 l2 -8 M68 43 l4 -7" stroke="${d}" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M54 44 Q62 40 70 44" stroke="${d}" stroke-width="2" fill="none"/>`;
      break;

    case "minotauro":
      // Typhaeus/Minotaurus: cuernos prominentes en el torax
      head = `<circle cx="62" cy="53" r="10" fill="${c}"/>`;
      horns = `<path d="M51 50 Q44 42 42 36" stroke="${d}" stroke-width="3.6" fill="none" stroke-linecap="round"/>
        <path d="M53 47 Q50 40 52 34" stroke="${d}" stroke-width="3.2" fill="none" stroke-linecap="round"/>
        <path d="M55 46 Q56 38 58 33" stroke="${d}" stroke-width="2.8" fill="none" stroke-linecap="round"/>
        <circle cx="42" cy="35" r="3" fill="${d}"/>
        <circle cx="52" cy="33" r="2.5" fill="${d}"/>
        <circle cx="58" cy="32" r="2.2" fill="${d}"/>`;
      body = `<ellipse cx="58" cy="62" rx="18" ry="17" fill="${c}"/>
        <path d="M58 46 L58 79" stroke="${d}" stroke-width="2.8"/>
        <path d="M42 55 Q58 50 74 55" stroke="${d}" stroke-width="2.2" fill="none"/>
        <path d="M44 62 Q58 58 72 62" stroke="${d}" stroke-width="1.6" fill="none" opacity=".5"/>`;
      break;

    case "tunelador":
      // Geotrupes/Copris: cuerpo mas robusto/redondeado, pequena bola (trabaja bajo tierra)
      ball = `<circle cx="28" cy="68" r="13" fill="#7a5a30" stroke="#5a4020" stroke-width="2"/>
        <circle cx="23" cy="63" r="3" fill="#5a4020" opacity=".5"/>
        <circle cx="31" cy="72" r="2" fill="#5a4020" opacity=".4"/>`;
      body = `<ellipse cx="58" cy="63" rx="20" ry="19" fill="${c}"/>
        <path d="M58 45 L58 82" stroke="${d}" stroke-width="2.8"/>
        <path d="M40 56 Q58 51 76 56" stroke="${d}" stroke-width="2" fill="none"/>
        <path d="M39 64 Q58 59 77 64" stroke="${d}" stroke-width="1.5" fill="none" opacity=".45"/>
        <path d="M41 72 Q58 67 75 72" stroke="${d}" stroke-width="1.2" fill="none" opacity=".35"/>`;
      head = `<circle cx="62" cy="51" r="11" fill="${c}"/>`;
      // rayas de tierra en la bola (tunel)
      ballExtra = `<path d="M18 68 Q24 62 30 68" stroke="#5a4020" stroke-width="1.2" fill="none" opacity=".7"/>
        <path d="M20 74 Q26 70 32 74" stroke="#5a4020" stroke-width="1" fill="none" opacity=".5"/>`;
      break;
  }

  return `<g>${ball}${ballExtra}${legsBase}${legExtra}${body}${thorax}${head}${horns}${eyes}</g>`;
}

// ---- snail ----
// Arthropod Design — Caracol paramétrico (área: Linux/Migración SO)
// crit_snail({color, caste, vital}) → <g> SVG viewBox 100×100
// Castas:
//   jardin  — caracol de jardín: migración paso a paso, análisis comparativo
//             concha espiral grande, tentáculos largos con ojos en las puntas
//   babosa  — babosa sin concha: CLI/terminal, sin GUI, minimalista
//             cuerpo alargado bajo, tentáculos cortos, sin concha
//   mar     — caracol marino (distro): elegir distro/arranque/setup
//             concha cónica puntiaguda (no espiral), cuerpo más esbelto

function crit_snail(o){
  const c=o.color||"#6d6ef0", caste=o.caste||"jardin", vital=o.vital||"ok";
  const d=shade(c,.55), l=shade(c,1.34);

  // ojos en las puntas de tentáculos — cambian según vital
  function tentEye(x,y,r){
    if(vital==="dead")   return `<path d="M${x-r} ${y-r} l${r*2} ${r*2} M${x+r} ${y-r} l${-r*2} ${r*2}" stroke="${d}" stroke-width="1.6" stroke-linecap="round"/>`;
    if(vital==="sleep")  return `<path d="M${x-r} ${y} q${r} ${r*1.2} ${r*2} 0" stroke="${d}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
    return eye(x,y,r);
  }

  switch(caste){
    case "babosa": {
      // Cuerpo alargado sin concha, rasante al suelo, tentáculos cortos
      const body=`<path d="M18 72 Q16 60 30 58 Q60 54 74 60 Q84 64 82 72 Q78 80 60 80 Q30 82 18 72 Z" fill="${c}" stroke="${d}" stroke-width="1.8"/>`;
      // cola que se afina a la izquierda
      const tail=`<path d="M18 72 Q10 68 12 62 Q14 56 22 60" fill="${c}" stroke="${d}" stroke-width="1.4"/>`;
      // manto dorsal (textura babosa)
      const manto=`<path d="M28 60 Q50 54 72 62" stroke="${l}" stroke-width="2.2" fill="none" opacity=".6"/>`;
      // tentáculos cortos con ojos (2 pares: 2 largos ópticos + 2 olfativos)
      const t1=`<path d="M70 60 L74 50" stroke="${d}" stroke-width="2" stroke-linecap="round"/>`;
      const t2=`<path d="M78 62 L84 54" stroke="${d}" stroke-width="2" stroke-linecap="round"/>`;
      const t3=`<path d="M65 60 L67 55" stroke="${d}" stroke-width="1.5" stroke-linecap="round"/>`;
      const t4=`<path d="M74 60 L76 56" stroke="${d}" stroke-width="1.5" stroke-linecap="round"/>`;
      const e1=tentEye(74,48,2.8);
      const e2=tentEye(84,52,2.8);
      return `<g>${body}${tail}${manto}${t1}${t2}${t3}${t4}${e1}${e2}</g>`;
    }
    case "mar": {
      // Concha cónica puntiaguda (no espiral): torre cónica con líneas de espira
      const shell=`<path d="M48 18 L72 70 Q66 78 58 76 Q40 78 34 70 L48 18 Z" fill="${c}" stroke="${d}" stroke-width="2"/>`;
      // líneas de espira en cono
      const spires=`<path d="M44 36 Q58 38 66 42 M42 50 Q56 52 68 56 M40 62 Q52 65 68 68" stroke="${d}" stroke-width="1.4" fill="none" opacity=".55"/>`;
      // punta brillante del cono
      const apex=`<circle cx="48" cy="18" r="2.8" fill="${l}"/>`;
      // cuerpo del molusco saliendo por la apertura (parte inferior del cono)
      const bodyOut=`<path d="M34 70 Q30 74 24 76 Q18 80 16 76 Q14 70 22 68 Q28 66 34 70 Z" fill="${c}" stroke="${d}" stroke-width="1.6"/>`;
      // cabeza con tentáculos estilizados y más largos
      const neck=`<path d="M24 74 Q20 66 22 58" stroke="${c}" stroke-width="6" stroke-linecap="round"/>`;
      const t1=`<path d="M20 58 L14 44" stroke="${d}" stroke-width="2.2" stroke-linecap="round"/>`;
      const t2=`<path d="M24 56 L22 42" stroke="${d}" stroke-width="2.2" stroke-linecap="round"/>`;
      const e1=tentEye(14,42,3);
      const e2=tentEye(22,40,3);
      return `<g>${shell}${spires}${apex}${bodyOut}${neck}${t1}${t2}${e1}${e2}</g>`;
    }
    default: // "jardin" — caracol de jardín con concha espiral grande
    {
      // Pie/cuerpo arrastrándose
      const foot=`<path d="M14 76 Q12 64 24 62 Q30 60 38 62" fill="${c}" stroke="${d}" stroke-width="1.8"/>`;
      const body=`<path d="M22 76 Q20 68 28 66 Q46 62 58 70 Q64 76 60 82 Q50 88 32 84 Q20 82 22 76 Z" fill="${c}" stroke="${d}" stroke-width="1.8"/>`;
      // cuello/cabeza hacia adelante (izquierda)
      const neck=`<path d="M24 68 Q18 62 16 54" stroke="${c}" stroke-width="7" stroke-linecap="round"/>`;
      const head=`<ellipse cx="16" cy="52" rx="7" ry="5.5" fill="${c}" stroke="${d}" stroke-width="1.6"/>`;
      // tentáculos oculares largos (par superior)
      const t1=`<path d="M14 48 L8 34" stroke="${d}" stroke-width="2.2" stroke-linecap="round"/>`;
      const t2=`<path d="M20 48 L18 32" stroke="${d}" stroke-width="2.2" stroke-linecap="round"/>`;
      // tentáculos olfativos cortos (par inferior)
      const t3=`<path d="M12 50 L8 44" stroke="${d}" stroke-width="1.5" stroke-linecap="round"/>`;
      const t4=`<path d="M19 50 L18 44" stroke="${d}" stroke-width="1.5" stroke-linecap="round"/>`;
      const e1=tentEye(8,32,3.2);
      const e2=tentEye(18,30,3.2);
      // Concha espiral centrada a la derecha-arriba del cuerpo
      const shell=`<circle cx="58" cy="52" r="26" fill="${c}" stroke="${d}" stroke-width="2"/>`;
      const spiral1=`<circle cx="58" cy="52" r="19" fill="none" stroke="${d}" stroke-width="2.8" opacity=".5"/>`;
      const spiral2=`<circle cx="58" cy="52" r="12" fill="none" stroke="${d}" stroke-width="2.8" opacity=".5"/>`;
      const spiral3=`<circle cx="58" cy="52" r="5.5" fill="none" stroke="${d}" stroke-width="2.4" opacity=".5"/>`;
      const umbilicus=`<circle cx="58" cy="52" r="2" fill="${d}" opacity=".7"/>`;
      // sutura / ornamento dorsal
      const suture=`<path d="M34 62 Q46 58 58 62" stroke="${d}" stroke-width="1.4" fill="none" opacity=".4"/>`;
      return `<g>${shell}${spiral1}${spiral2}${spiral3}${umbilicus}${suture}${foot}${body}${neck}${head}${t3}${t4}${t1}${t2}${e1}${e2}</g>`;
    }
  }
}

// ---- dragonfly ----
// sp_dragonfly.js — Libélulas paramétricas (Arthropod Design Terrarium)
// Área: Redes/Conectividad · Color base: #f5812f
// Castas: emperor (red troncal/router) · damsel (wifi/enlace pequeño) · hawk (VPN/largo alcance)
// Dependencias globales: shade(), legs(), eye() — ya presentes en critters.js
// viewBox 100×100. Sin emojis. Sin dependencias externas.

function crit_dragonfly(o) {
  const c = o.color || "#f5812f", caste = o.caste || "emperor", vital = o.vital || "ok";
  const d = shade(c, .55), l = shade(c, 1.34);

  // Ojos grandes (rasgo distintivo libélula) — compuestos, facetados
  let eyes;
  if (vital === "dead") {
    eyes = `<path d="M43 28 l5 5 M48 28 l-5 5" stroke="${d}" stroke-width="2.2" stroke-linecap="round"/>` +
           `<path d="M55 28 l5 5 M60 28 l-5 5" stroke="${d}" stroke-width="2.2" stroke-linecap="round"/>`;
  } else if (vital === "sleep") {
    eyes = `<path d="M43 31 q3 2.5 6 0" stroke="${d}" stroke-width="2" fill="none" stroke-linecap="round"/>` +
           `<path d="M55 31 q3 2.5 6 0" stroke="${d}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  } else {
    // Ojos compuestos grandes: dos esferas prominentes
    eyes = eye(46, 29, 4.5) + eye(57, 29, 4.5);
  }

  // Base anatómica compartida — cabeza con ojos grandes
  let head = `<circle cx="51" cy="28" r="11" fill="${c}"/>` +
              `<path d="M48 20 L44 14 M54 20 L58 14" stroke="${d}" stroke-width="2" stroke-linecap="round"/>`;

  // Cuerpo (abdomen): forma varía por casta
  let abdomen = "";
  // Alas: varían por casta
  let wings = "";
  // Extras por casta
  let extras = "";

  switch (caste) {

    // ── EMPEROR: Anax imperator — red troncal / router backbone
    // Cuerpo largo y GRUESO, alas largas y anchas (4 alas simétricas prominentes)
    case "emperor":
      abdomen =
        // Tórax robusto
        `<rect x="44" y="37" width="14" height="14" rx="5" fill="${c}"/>` +
        // Abdomen largo y grueso con segmentos marcados
        `<rect x="46" y="49" width="10" height="36" rx="4" fill="${c}"/>` +
        `<path d="M46 56 H56 M46 63 H56 M46 70 H56 M46 77 H56" stroke="${d}" stroke-width="1.4" opacity=".6"/>`;
      // 4 alas: par superior grande y ancho, par inferior más corto
      wings =
        `<ellipse cx="30" cy="38" rx="22" ry="8" fill="${l}" opacity=".72" transform="rotate(-15 30 38)"/>` +
        `<ellipse cx="72" cy="38" rx="22" ry="8" fill="${l}" opacity=".72" transform="rotate(15 72 38)"/>` +
        `<ellipse cx="28" cy="52" rx="18" ry="6.5" fill="${l}" opacity=".62" transform="rotate(8 28 52)"/>` +
        `<ellipse cx="74" cy="52" rx="18" ry="6.5" fill="${l}" opacity=".62" transform="rotate(-8 74 52)"/>` +
        // Nervadura en alas superiores
        `<path d="M12 38 L44 40 M16 44 L44 43" stroke="${d}" stroke-width=".8" opacity=".4"/>` +
        `<path d="M88 38 L56 40 M84 44 L56 43" stroke="${d}" stroke-width=".8" opacity=".4"/>`;
      // Indicador de router: pequeño icono backbone
      extras = `<circle cx="51" cy="42" r="3.5" fill="${d}" opacity=".5"/>`;
      break;

    // ── DAMSEL: Coenagrion (Zygoptera) — wifi / enlace local pequeño
    // Cuerpo MUY FINO y largo, alas plegadas hacia atrás en reposo (estrechas)
    case "damsel":
      abdomen =
        // Tórax fino
        `<rect x="47" y="37" width="8" height="12" rx="4" fill="${c}"/>` +
        // Abdomen ultra-fino, muy largo
        `<rect x="48.5" y="48" width="5" height="42" rx="2.5" fill="${c}"/>` +
        `<path d="M48.5 55 H53.5 M48.5 63 H53.5 M48.5 71 H53.5 M48.5 79 H53.5 M48.5 86 H53.5" stroke="${d}" stroke-width="1.1" opacity=".55"/>`;
      // Alas Zygoptera: ESTRECHAS y plegadas hacia atrás paralelas al cuerpo
      wings =
        `<ellipse cx="35" cy="45" rx="17" ry="4.5" fill="${l}" opacity=".7" transform="rotate(30 35 45)"/>` +
        `<ellipse cx="67" cy="45" rx="17" ry="4.5" fill="${l}" opacity=".7" transform="rotate(-30 67 45)"/>` +
        `<ellipse cx="33" cy="57" rx="14" ry="3.8" fill="${l}" opacity=".6" transform="rotate(22 33 57)"/>` +
        `<ellipse cx="69" cy="57" rx="14" ry="3.8" fill="${l}" opacity=".6" transform="rotate(-22 69 57)"/>`;
      // Señal wifi punteada: pequeño arco sobre cabeza
      extras =
        `<path d="M40 16 Q51 10 62 16" stroke="${d}" stroke-width="1.6" fill="none" opacity=".5" stroke-linecap="round"/>` +
        `<path d="M44 20 Q51 14 58 20" stroke="${d}" stroke-width="1.2" fill="none" opacity=".45" stroke-linecap="round"/>`;
      break;

    // ── HAWK: Aeshna cyanea — VPN / enlace largo alcance
    // Cuerpo largo y AERODINÁMICO, alas en posición extendida inclinadas hacia adelante
    case "hawk":
      abdomen =
        // Tórax intermedio-aerodinámico
        `<rect x="45" y="37" width="12" height="13" rx="5" fill="${c}"/>` +
        // Abdomen largo, ligeramente cónico hacia la punta
        `<path d="M48 50 L53 50 L54 88 L47 88 Z" rx="2" fill="${c}"/>` +
        `<path d="M47.5 57 L53.5 57 M47 65 L54 65 M47 73 L53.5 73 M47.5 81 L53 81" stroke="${d}" stroke-width="1.3" opacity=".55"/>`;
      // Alas inclinadas hacia ADELANTE como halcón en picado
      wings =
        `<ellipse cx="27" cy="33" rx="24" ry="7" fill="${l}" opacity=".74" transform="rotate(-25 27 33)"/>` +
        `<ellipse cx="75" cy="33" rx="24" ry="7" fill="${l}" opacity=".74" transform="rotate(25 75 33)"/>` +
        `<ellipse cx="26" cy="48" rx="19" ry="5.5" fill="${l}" opacity=".64" transform="rotate(-12 26 48)"/>` +
        `<ellipse cx="76" cy="48" rx="19" ry="5.5" fill="${l}" opacity=".64" transform="rotate(12 76 48)"/>` +
        // Nervadura larga tipo halcón
        `<path d="M8 30 L44 38 M10 40 L44 42" stroke="${d}" stroke-width=".9" opacity=".38"/>` +
        `<path d="M92 30 L56 38 M90 40 L56 42" stroke="${d}" stroke-width=".9" opacity=".38"/>`;
      // Punto de destino lejano: dos guiones indicando "túnel"
      extras =
        `<path d="M42 42 h4 M46 42 h4" stroke="${l}" stroke-width="1.4" stroke-linecap="round" opacity=".7"/>`;
      break;

    default:
      // Fallback: emperor
      abdomen =
        `<rect x="44" y="37" width="14" height="14" rx="5" fill="${c}"/>` +
        `<rect x="46" y="49" width="10" height="36" rx="4" fill="${c}"/>`;
      wings =
        `<ellipse cx="30" cy="38" rx="22" ry="8" fill="${l}" opacity=".72" transform="rotate(-15 30 38)"/>` +
        `<ellipse cx="72" cy="38" rx="22" ry="8" fill="${l}" opacity=".72" transform="rotate(15 72 38)"/>` +
        `<ellipse cx="28" cy="52" rx="18" ry="6.5" fill="${l}" opacity=".62" transform="rotate(8 28 52)"/>` +
        `<ellipse cx="74" cy="52" rx="18" ry="6.5" fill="${l}" opacity=".62" transform="rotate(-8 74 52)"/>`;
      extras = "";
      break;
  }

  return `<g>${wings}${abdomen}${extras}${head}${eyes}</g>`;
}

// ---- ladybug ----
// sp_ladybug.js — Mariquitas paramétricas (área: Recetas/Personal, color base #e8423f)
// Castas basadas en tipos reales de mariquita por utilidad:
//   siete-puntos  → recetas / proyectos personales elaborados (Coccinella septempunctata)
//   arlequin      → misceláneo doméstico / intereses variados (Harmonia axyridis)
//   dos-puntos    → notas rápidas / fragmentos / apuntes cortos (Adalia bipunctata)
//
// Señas de forma (NUNCA por color de estado):
//   siete-puntos  → 7 puntos en élitros (3+3+1 pronotum), línea central bien marcada
//   arlequin      → patrón irregular de manchas variables, élitros más anchos, antenas largas
//   dos-puntos    → solo 2 puntos grandes centrados, cuerpo más pequeño y redondeado
//
// Globals esperados del entorno: shade(hex,f), legs(ps,col), eye(x,y,r)

function crit_ladybug(o){
  const c=o.color||"#e8423f", caste=o.caste||"siete-puntos", vital=o.vital||"ok";
  const d=shade(c,.55), l=shade(c,1.34);

  // Ojos según vital
  let eyes;
  if(vital==="dead")
    eyes=`<path d="M43 46 l5 5 M48 46 l-5 5" stroke="#2a2a2a" stroke-width="2.1" stroke-linecap="round"/>`+
         `<path d="M54 46 l5 5 M59 46 l-5 5" stroke="#2a2a2a" stroke-width="2.1" stroke-linecap="round"/>`;
  else if(vital==="sleep")
    eyes=`<path d="M43 49 q3 3 6 0" stroke="#2a2a2a" stroke-width="2" fill="none" stroke-linecap="round"/>`+
         `<path d="M53 49 q3 3 6 0" stroke="#2a2a2a" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  else
    eyes=eye(46,47,2.4)+eye(56,47,2.4);

  // Cuerpo base de mariquita (compartido por todas las castas)
  let legsArr=["M40 52 L28 44","M40 60 L26 60","M40 68 L28 76","M60 52 L72 44","M60 60 L74 60","M60 68 L72 76"];
  // Cabeza negra
  let head=`<path d="M30 50 A24 24 0 0 1 70 50 Z" fill="#2a2a2a"/>`;
  // Línea central divisoria de élitros
  let spine=`<path d="M50 36 L50 84" stroke="#2a2a2a" stroke-width="2.8"/>`;
  // Élitros (cuerpo principal)
  let body=`<circle cx="50" cy="62" r="24" fill="${c}"/>`;
  // Antenas base
  let antennae=`<path d="M43 42 L36 30 M46 41 L42 28" stroke="#2a2a2a" stroke-width="2" stroke-linecap="round"/>`;
  // Puntos (se sobreescribe por caste)
  let dots="";
  // Extra por caste
  let extra="";

  switch(caste){

    // SIETE-PUNTOS — Coccinella septempunctata
    // Recetas elaboradas / proyectos personales de calidad — la más icónica, 7 puntos clásicos
    case "siete-puntos":
      // 3 puntos lado izq + 3 lado der + 1 central en pronotum
      dots=
        // Punto único en pronotum (zona negra de la cabeza)
        `<circle cx="50" cy="45" r="2.8" fill="${d}"/>` +
        // Fila superior: 2 puntos grandes
        `<circle cx="40" cy="56" r="4" fill="${d}"/>` +
        `<circle cx="60" cy="56" r="4" fill="${d}"/>` +
        // Fila media: 2 puntos
        `<circle cx="39" cy="67" r="3.4" fill="${d}"/>` +
        `<circle cx="61" cy="67" r="3.4" fill="${d}"/>` +
        // Fila inferior: 2 puntos pequeños
        `<circle cx="43" cy="76" r="2.8" fill="${d}"/>` +
        `<circle cx="57" cy="76" r="2.8" fill="${d}"/>`;
      break;

    // ARLEQUIN — Harmonia axyridis
    // Misceláneo doméstico / intereses variados — patrón irregular, muchas variantes
    case "arlequin":
      // Élitros un poco más anchos
      body=`<ellipse cx="50" cy="62" rx="25" ry="23" fill="${c}"/>`;
      // Antenas más largas (rasgo arlequín: son más activas, exploradoras)
      antennae=`<path d="M43 42 L33 28 M46 41 L40 26" stroke="#2a2a2a" stroke-width="2" stroke-linecap="round"/>`;
      // Patrón irregular: manchas de tamaños distintos, asimétricas
      dots=
        `<circle cx="38" cy="54" r="5" fill="${d}"/>` +
        `<circle cx="62" cy="55" r="3.2" fill="${d}"/>` +
        `<circle cx="61" cy="65" r="5" fill="${d}"/>` +
        `<circle cx="40" cy="67" r="2.8" fill="${d}"/>` +
        `<circle cx="44" cy="77" r="3.6" fill="${d}"/>` +
        `<circle cx="57" cy="76" r="2.4" fill="${d}"/>` +
        // Manchita extra irregular (rasgo arlequín)
        `<circle cx="52" cy="58" r="1.8" fill="${d}"/>`;
      // Borde de élitros ligeramente marcado (variante típica del arlequín)
      extra=`<ellipse cx="50" cy="62" rx="25" ry="23" fill="none" stroke="${d}" stroke-width="1.4" opacity=".3"/>`;
      break;

    // DOS-PUNTOS — Adalia bipunctata
    // Notas rápidas / apuntes cortos — minimalista, 2 puntos, cuerpo más pequeño
    case "dos-puntos":
      // Cuerpo más compacto
      body=`<ellipse cx="50" cy="63" rx="21" ry="20" fill="${c}"/>`;
      head=`<path d="M33 52 A21 20 0 0 1 67 52 Z" fill="#2a2a2a"/>`;
      spine=`<path d="M50 38 L50 83" stroke="#2a2a2a" stroke-width="2.4"/>`;
      // Solo 2 puntos grandes, uno por élitro — muy centrados y prominentes
      dots=
        `<circle cx="41" cy="65" r="6" fill="${d}"/>` +
        `<circle cx="59" cy="65" r="6" fill="${d}"/>`;
      break;

    default: break;
  }

  return `<g>${legs(legsArr,"#2a2a2a")}${antennae}${body}${extra}${spine}${head}${dots}${eyes}</g>`;
}

// ---- mite ----
// Arthropod Design — ACAROS parametricos (sp_mite.js)
// crit_mite({color, caste, vital}) -> <g> SVG viewBox 100x100
// Castas: polvo | garrapata | arana-roja | agua
// Globales requeridas: shade(), legs(), eye() (de critters.js)

function crit_mite(o) {
  const c = o.color || "#8a93a0";
  const caste = o.caste || "polvo";
  const vital = o.vital || "ok";
  const d = shade(c, 0.55);
  const l = shade(c, 1.34);

  // Ojos segun estado vital
  let eyes;
  if (vital === "dead") {
    eyes = `<path d="M46 44 l4 4 M50 44 l-4 4" stroke="${d}" stroke-width="2" stroke-linecap="round"/>` +
           `<path d="M54 44 l4 4 M58 44 l-4 4" stroke="${d}" stroke-width="2" stroke-linecap="round"/>`;
  } else if (vital === "sleep") {
    eyes = `<path d="M46 46 q4 3 8 0" stroke="${d}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  } else {
    eyes = eye(48, 44, 2.4) + eye(56, 44, 2.4);
  }

  // Cuerpo base (idiosoma): redondo y peludo
  // Gnatosoma (cabeza/boca) pequeño al frente
  let idiosoma = `<ellipse cx="50" cy="60" rx="22" ry="19" fill="${c}"/>`;
  let gnathosoma = `<ellipse cx="50" cy="43" rx="8" ry="6" fill="${d}"/>`;

  // Pelos del cuerpo (setas): base comun a todos los acaros
  let setae = `<path d="M34 54 l-4 -5 M30 63 l-5 -2 M34 72 l-4 4" stroke="${l}" stroke-width="1.4" stroke-linecap="round"/>` +
              `<path d="M66 54 l4 -5 M70 63 l5 -2 M66 72 l4 4" stroke="${l}" stroke-width="1.4" stroke-linecap="round"/>` +
              `<path d="M43 76 l-2 5 M50 78 l0 5 M57 76 l2 5" stroke="${l}" stroke-width="1.4" stroke-linecap="round"/>`;

  // Patas base: 4 pares = 8 patas (aracnido)
  let legsArr = [
    "M38 54 L24 44", "M36 62 L20 60", "M38 70 L24 78", "M36 76 L28 86",
    "M62 54 L76 44", "M64 62 L80 60", "M62 70 L76 78", "M64 76 L72 86"
  ];
  let legsG = legs(legsArr, d);

  // Variaciones por casta — forma, gnatosoma y setas distintas
  let extra = "";
  let rostrum = ""; // piezas bucales especificas

  switch (caste) {
    case "garrapata":
      // Cuerpo mas aplanado y ovalado; hipostoma largo y puntiagudo (se ancla)
      idiosoma = `<ellipse cx="50" cy="62" rx="24" ry="17" fill="${c}"/>`;
      gnathosoma = `<ellipse cx="50" cy="44" rx="7" ry="5" fill="${d}"/>`;
      // Hipostoma = organo de anclaje, largo y estrecho
      rostrum = `<rect x="47.5" y="36" width="5" height="10" rx="2" fill="${d}"/>` +
                `<path d="M47 38 l-3 2 M53 38 l3 2 M47 42 l-3 2 M53 42 l3 2" stroke="${l}" stroke-width="1.2" stroke-linecap="round"/>`;
      // Patas mas robustas y con garfios en extremos
      legsArr = [
        "M38 56 L22 46", "M36 64 L18 62", "M38 72 L22 80", "M36 77 L26 87",
        "M62 56 L78 46", "M64 64 L82 62", "M62 72 L78 80", "M64 77 L74 87"
      ];
      legsG = legs(legsArr, d);
      // Garfios en extremo de patas
      extra = `<circle cx="22" cy="46" r="2.2" fill="${d}"/><circle cx="18" cy="62" r="2.2" fill="${d}"/>` +
              `<circle cx="78" cy="46" r="2.2" fill="${d}"/><circle cx="82" cy="62" r="2.2" fill="${d}"/>`;
      // Setas escasas (cuerpo aplanado)
      setae = `<path d="M34 57 l-3 -4 M34 72 l-4 3" stroke="${l}" stroke-width="1.2" stroke-linecap="round"/>` +
              `<path d="M66 57 l3 -4 M66 72 l4 3" stroke="${l}" stroke-width="1.2" stroke-linecap="round"/>`;
      break;

    case "arana-roja":
      // Tetranychus urticae: cuerpo oval con manchas oscuras laterales visibles
      idiosoma = `<ellipse cx="50" cy="60" rx="20" ry="17" fill="${c}"/>` +
                 // Manchas laterales oscuras caracteristicas de araña roja
                 `<ellipse cx="38" cy="60" rx="6" ry="8" fill="${d}" opacity="0.45"/>` +
                 `<ellipse cx="62" cy="60" rx="6" ry="8" fill="${d}" opacity="0.45"/>`;
      gnathosoma = `<ellipse cx="50" cy="44" rx="7" ry="5.5" fill="${d}"/>`;
      // Queliceros estiliformes (agujan la hoja para succionar)
      rostrum = `<path d="M47 39 L45 32 M53 39 L55 32" stroke="${d}" stroke-width="1.8" stroke-linecap="round"/>` +
                `<circle cx="45" cy="32" r="1.8" fill="${l}"/>` +
                `<circle cx="55" cy="32" r="1.8" fill="${l}"/>`;
      // Setas largas y abundantes (caracteristica taxonomica)
      setae = `<path d="M32 53 l-5 -6 M29 62 l-6 -1 M32 71 l-5 5 M40 77 l-2 6 M50 79 l0 6 M60 77 l2 6" stroke="${l}" stroke-width="1.3" stroke-linecap="round"/>` +
              `<path d="M68 53 l5 -6 M71 62 l6 -1 M68 71 l5 5" stroke="${l}" stroke-width="1.3" stroke-linecap="round"/>`;
      // Patas largas y delgadas (muy activas)
      legsArr = [
        "M38 52 Q26 42 20 40", "M36 60 Q20 58 14 56", "M38 68 Q24 74 20 80", "M36 74 Q26 82 24 90",
        "M62 52 Q74 42 80 40", "M64 60 Q80 58 86 56", "M62 68 Q76 74 80 80", "M64 74 Q74 82 76 90"
      ];
      legsG = legs(legsArr, d);
      extra = "";
      break;

    case "agua":
      // Acaro acuatico / Hydrachnidia: cuerpo redondeado y liso, sin setas, patas remo
      idiosoma = `<circle cx="50" cy="61" r="21" fill="${c}"/>` +
                 // Patron dorsal suave (escudete)
                 `<ellipse cx="50" cy="58" rx="13" ry="10" fill="${l}" opacity="0.35"/>`;
      gnathosoma = `<circle cx="50" cy="44" r="7" fill="${d}"/>`;
      // Sin rostrum prominente
      rostrum = "";
      // Patas con frangias (pelos natatorios) = ensanchadas en extremos
      legsArr = [
        "M38 53 Q26 46 22 48", "M36 63 Q20 63 16 65", "M38 71 Q24 78 22 82", "M37 77 Q28 85 28 90",
        "M62 53 Q74 46 78 48", "M64 63 Q80 63 84 65", "M62 71 Q76 78 78 82", "M63 77 Q72 85 72 90"
      ];
      legsG = legs(legsArr, d);
      // Frangias natatorias en patas III y IV (lineas perpendiculares al eje)
      extra = `<path d="M22 48 l-3 3 M22 48 l3 3 M16 65 l-3 3 M16 65 l3 3" stroke="${l}" stroke-width="1.6" stroke-linecap="round"/>` +
              `<path d="M78 48 l-3 3 M78 48 l3 3 M84 65 l-3 3 M84 65 l3 3" stroke="${l}" stroke-width="1.6" stroke-linecap="round"/>`;
      // Sin setas — superficie lisa y brillante
      setae = `<ellipse cx="50" cy="61" rx="21" ry="21" fill="none" stroke="${l}" stroke-width="1" opacity="0.3"/>`;
      break;

    case "polvo":
    default:
      // Dermatophagoides: cuerpo redondeado, estraciones cuticulares transversales
      idiosoma = `<ellipse cx="50" cy="60" rx="22" ry="19" fill="${c}"/>` +
                 // Estraciones (cuticula segmentada visualmente)
                 `<path d="M30 53 Q50 50 70 53 M29 60 Q50 57 71 60 M30 67 Q50 64 70 67" stroke="${d}" stroke-width="1" fill="none" opacity="0.5"/>`;
      gnathosoma = `<ellipse cx="50" cy="44" rx="8" ry="6" fill="${d}"/>`;
      rostrum = `<path d="M46 40 L42 35 M54 40 L58 35" stroke="${d}" stroke-width="1.6" stroke-linecap="round"/>`;
      // Setas largas y dispersas (polvo)
      setae = `<path d="M34 54 l-4 -6 M30 63 l-6 -1 M34 72 l-4 5 M43 76 l-2 6 M57 76 l2 6" stroke="${l}" stroke-width="1.3" stroke-linecap="round"/>` +
              `<path d="M66 54 l4 -6 M70 63 l6 -1 M66 72 l4 5" stroke="${l}" stroke-width="1.3" stroke-linecap="round"/>`;
      extra = "";
      break;
  }

  return `<g>${legsG}${setae}${idiosoma}${gnathosoma}${rostrum}${extra}${eyes}</g>`;
}

// ---- mantis ----
// Arthropod Design — Mantis parametrica (colonia META: paneles/visualizaciones del terrario)
// Castas: religiosa=planificacion/sistema, orquidea=visual/artefactos, fantasma=infra/parsers/builds,
//         gigante=entrega completa/terrario, espinosa=prototipos/experimentos
// API: crit_mantis({color, caste, vital}) -> <g> SVG viewBox 100x100
// (helpers shade/legs/eye: definidos una sola vez al inicio del archivo)

// ---- MANTIS PARAMETRICA ----------------------------------------------------
// o = { color:"#rrggbb", caste:"religiosa|orquidea|fantasma|gigante|espinosa", vital:"ok|sleep|dead" }
function crit_mantis(o){
  const c=o.color||"#5fae46", caste=o.caste||"religiosa", vital=o.vital||"ok";
  const d=shade(c,.55), l=shade(c,1.34);

  // Ojos segun vital
  let eyes;
  if(vital==="dead")
    eyes=`<path d="M44 30 l5 5 M49 30 l-5 5" stroke="${d}" stroke-width="2" stroke-linecap="round"/>
          <path d="M53 30 l5 5 M58 30 l-5 5" stroke="${d}" stroke-width="2" stroke-linecap="round"/>`;
  else if(vital==="sleep")
    eyes=`<path d="M44 32 q3 2 6 0" stroke="${d}" stroke-width="2" fill="none" stroke-linecap="round"/>
          <path d="M53 32 q3 2 6 0" stroke="${d}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  else
    eyes=eye(47,31,2.8)+eye(56,31,2.8);

  // Antenas base (todas las castas las tienen)
  const antenas=`<path d="M46 24 Q40 14 36 10 M54 24 Q60 14 64 10" stroke="${d}" stroke-width="2" fill="none" stroke-linecap="round"/>`;

  // Patas caminadoras traseras (base comun)
  const walkLegs=legs(["M44 68 L32 80","M50 70 L44 84","M56 68 L68 80","M50 70 L56 84"],d);

  // Cuerpo base: cabeza triangular, torax, abdomen
  const cabeza=`<polygon points="50,20 40,38 60,38" fill="${c}"/>`;
  const torax=`<ellipse cx="50" cy="50" rx="9" ry="13" fill="${c}"/>`;
  const abdomen=`<ellipse cx="50" cy="68" rx="7" ry="16" fill="${c}"/>`;

  // Patas raptoras base (casta por defecto)
  let raptoras=`<path d="M43 40 Q30 36 28 26 Q27 20 32 18" stroke="${d}" stroke-width="3" fill="none" stroke-linecap="round"/>
                <path d="M57 40 Q70 36 72 26 Q73 20 68 18" stroke="${d}" stroke-width="3" fill="none" stroke-linecap="round"/>`;

  // Extras por casta
  let escudo="", apendices="", ornamento="";

  switch(caste){

    case "religiosa":
      // Religiosa: mantis rezando — patas raptoras elevadas y plegadas, escudo torax sobrio
      // Simboliza: planificacion y diseño del sistema (la mente del terrario)
      raptoras=`<path d="M43 40 Q28 32 26 20 Q26 14 32 14" stroke="${d}" stroke-width="3.2" fill="none" stroke-linecap="round"/>
                <path d="M57 40 Q72 32 74 20 Q74 14 68 14" stroke="${d}" stroke-width="3.2" fill="none" stroke-linecap="round"/>
                <path d="M32 14 Q35 22 40 26 M68 14 Q65 22 60 26" stroke="${d}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
      escudo=`<ellipse cx="50" cy="48" rx="11" ry="4" fill="${d}" opacity=".35"/>`;
      break;

    case "orquidea":
      // Orquidea: mantis orchid — ornamentos florales en torax, abdomen ancho decorado
      // Simboliza: artefactos visuales bonitos, HTML interactivo, dashboards
      raptoras=`<path d="M43 40 Q30 34 28 24 Q28 18 34 16" stroke="${d}" stroke-width="3" fill="none" stroke-linecap="round"/>
                <path d="M57 40 Q70 34 72 24 Q72 18 66 16" stroke="${d}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
      ornamento=`<ellipse cx="50" cy="68" rx="11" ry="18" fill="${l}" opacity=".6"/>
                 <ellipse cx="50" cy="52" rx="14" ry="6" fill="${l}" opacity=".45" transform="rotate(-10 50 52)"/>
                 <ellipse cx="50" cy="52" rx="14" ry="6" fill="${l}" opacity=".45" transform="rotate(10 50 52)"/>
                 <circle cx="50" cy="52" r="3" fill="${d}" opacity=".5"/>`;
      break;

    case "fantasma":
      // Fantasma: mantis ghost — cuerpo semitransparente, patas raptoras muy largas y finas, sin escudo visible
      // Simboliza: infra invisible (parsers, builds, datos, debug de herramientas)
      raptoras=`<path d="M43 42 Q24 36 20 22 Q19 14 26 12" stroke="${d}" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".75"/>
                <path d="M57 42 Q76 36 80 22 Q81 14 74 12" stroke="${d}" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".75"/>`;
      escudo=`<ellipse cx="50" cy="50" rx="9" ry="13" fill="${l}" opacity=".25"/>
              <ellipse cx="50" cy="68" rx="7" ry="16" fill="${l}" opacity=".2"/>`;
      apendices=`<path d="M44 60 L38 72 M56 60 L62 72" stroke="${d}" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".6"/>`;
      break;

    case "gigante":
      // Gigante: mantis giant — cuerpo ancho y robusto, escudo torax grande, patas raptoras gruesas
      // Simboliza: entrega completa del terrario, sesion principal, proyecto total
      raptoras=`<path d="M42 42 Q26 36 23 24 Q22 16 30 14" stroke="${d}" stroke-width="4" fill="none" stroke-linecap="round"/>
                <path d="M58 42 Q74 36 77 24 Q78 16 70 14" stroke="${d}" stroke-width="4" fill="none" stroke-linecap="round"/>
                <path d="M30 14 Q33 24 42 28 M70 14 Q67 24 58 28" stroke="${d}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
      escudo=`<ellipse cx="50" cy="49" rx="14" ry="8" fill="${d}" opacity=".3"/>
              <ellipse cx="50" cy="68" rx="11" ry="19" fill="${c}" stroke="${d}" stroke-width="1.4"/>`;
      break;

    case "espinosa":
      // Espinosa: mantis flower-spiny — apendices espinosos laterales en torax y abdomen
      // Simboliza: prototipos y experimentos visuales (vivos, puntiagudos, impredecibles)
      raptoras=`<path d="M43 40 Q30 34 28 22 Q28 16 34 14" stroke="${d}" stroke-width="3" fill="none" stroke-linecap="round"/>
                <path d="M57 40 Q70 34 72 22 Q72 16 66 14" stroke="${d}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
      apendices=`<path d="M41 46 L28 42 M41 52 L26 54 M41 58 L30 64" stroke="${d}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
                 <path d="M59 46 L72 42 M59 52 L74 54 M59 58 L70 64" stroke="${d}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
                 <circle cx="28" cy="42" r="2.2" fill="${d}"/><circle cx="26" cy="54" r="2.2" fill="${d}"/><circle cx="30" cy="64" r="2.2" fill="${d}"/>
                 <circle cx="72" cy="42" r="2.2" fill="${d}"/><circle cx="74" cy="54" r="2.2" fill="${d}"/><circle cx="70" cy="64" r="2.2" fill="${d}"/>`;
      break;

    default: break;
  }

  return `<g>${walkLegs}${raptoras}${antenas}${abdomen}${escudo}${ornamento}${torax}${cabeza}${apendices}${eyes}</g>`;
}

function critV2(key,o){switch(key){case 'ant':return crit_ant(o);case 'beetle':return crit_beetle(o);case 'butterfly':return crit_butterfly(o);case 'spider':return crit_spider(o);case 'bee':return crit_bee(o);case 'scorpion':return crit_scorpion(o);case 'centipede':return crit_centipede(o);case 'dung':return crit_dung(o);case 'snail':return crit_snail(o);case 'dragonfly':return crit_dragonfly(o);case 'ladybug':return crit_ladybug(o);case 'mite':return crit_mite(o);case 'mantis':return crit_mantis(o);}return antV2(o);}
function bugSVG2(key,o){return '<svg viewBox="0 0 100 100">'+critV2(key,o)+'</svg>';}
