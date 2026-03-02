/**
 * ============================================
 * SERVICES.JS — Base de datos completa de servicios
 * Studio By Cote
 * ============================================
 */

var SERVICES_DATA = [
    // UÑAS — MANICURE
    { id: 'u1',  category: 'Uñas - Manicure', name: 'Limpieza completa', price: 10000, duration: 30, image: null,
      desc: 'Cutículas, exfoliación, hidratación y fortalecedor. Base para cualquier esmaltado o cuidado.',
      includes: ['Limpieza de cutículas', 'Exfoliación suave', 'Hidratación', 'Fortalecedor de uñas'], warning: null },
    { id: 'u2',  category: 'Uñas - Manicure', name: 'Esmaltado permanente (1-2 tonos/diseños)', price: 16000, duration: 60, image: null,
      desc: 'Esmaltado semipermanente de alta duración con diseños simples de hasta 2 tonos.',
      includes: ['Limpieza previa', 'Esmaltado permanente', 'Diseño simple', 'Secado UV'], warning: null },
    { id: 'u3',  category: 'Uñas - Manicure', name: 'Esmaltado permanente (2 o más diseños)', price: 18000, duration: 75, image: null,
      desc: 'Esmaltado con diseños elaborados usando múltiples colores y técnicas.',
      includes: ['Limpieza previa', 'Esmaltado multi-diseño', 'Secado UV', 'Aceite de cutículas'], warning: null },
    { id: 'u4',  category: 'Uñas - Manicure', name: 'Esmaltado permanente (francesa o degradé)', price: 20000, duration: 75, image: null,
      desc: 'Técnica clásica francesa o degradé moderno con acabado premium.',
      includes: ['Limpieza previa', 'Técnica francesa/degradé', 'Secado UV', 'Brillo final'], warning: null },
    { id: 'u5',  category: 'Uñas - Manicure', name: 'Baño de gel (1-2 tonos)', price: 23000, duration: 90, image: null,
      desc: 'Cobertura en gel que fortalece y alarga la uña natural con acabado brillante.',
      includes: ['Preparación de uña', 'Aplicación de gel', 'Diseño 1-2 tonos', 'Secado UV', 'Aceite de cutículas'], warning: null },
    { id: 'u6',  category: 'Uñas - Manicure', name: 'Baño de gel (2 o más diseños)', price: 24000, duration: 90, image: null,
      desc: 'Gel con diseños elaborados y múltiples colores para un look único.',
      includes: ['Preparación', 'Gel multi-diseño', 'Secado UV', 'Acabado premium'], warning: null },
    { id: 'u7',  category: 'Uñas - Manicure', name: 'Baño de gel (francesa o degradé)', price: 25000, duration: 90, image: null,
      desc: 'Francesa o degradé con gel, combinación de elegancia y durabilidad.',
      includes: ['Preparación', 'Gel francesa/degradé', 'Secado UV', 'Hidratación'], warning: null },
    { id: 'u8',  category: 'Uñas - Manicure', name: 'Polygel (simple hasta largo 1-2)', price: 26000, duration: 120, image: null,
      desc: 'Extensión con polygel liviano y resistente. Perfecto para lograr largo sin dañar la uña.',
      includes: ['Preparación de uña natural', 'Extensión polygel', 'Forma y limado', 'Esmaltado simple', 'Secado UV'], warning: null },
    { id: 'u9',  category: 'Uñas - Manicure', name: 'Polygel (francesa o degradé)', price: 30000, duration: 120, image: null,
      desc: 'Extensión polygel con diseño francés o degradé elegante.',
      includes: ['Extensión polygel', 'Diseño francesa/degradé', 'Limado perfecto', 'Secado UV'], warning: null },
    { id: 'u10', category: 'Uñas - Manicure', name: 'Polygel (full diseño)', price: 30000, duration: 150, image: null,
      desc: 'Extensión polygel con diseño completo personalizado. Ideal para ocasiones especiales.',
      includes: ['Extensión polygel', 'Diseño full personalizado', 'Piedras/foil opcionales', 'Secado UV'], warning: null },

    // RELLENOS
    { id: 'rl1', category: 'Rellenos', name: 'Relleno con set nuevo simple', price: 25000, duration: 90, image: null,
      desc: 'Relleno de crecimiento con material 100% nuevo. Diseño simple de 1-2 tonos.',
      includes: ['Retiro parcial', 'Relleno con set nuevo', 'Diseño simple', 'Secado UV'], warning: null },
    { id: 'rl2', category: 'Rellenos', name: 'Relleno con set nuevo intermedio', price: 26000, duration: 100, image: null,
      desc: 'Relleno con diseño intermedio usando material nuevo y sellado.',
      includes: ['Retiro parcial', 'Relleno set nuevo', 'Diseño intermedio', 'Secado UV'], warning: null },
    { id: 'rl3', category: 'Rellenos', name: 'Relleno con set nuevo full diseño', price: 28000, duration: 120, image: null,
      desc: 'Relleno completo con diseños elaborados y materiales premium.',
      includes: ['Retiro parcial', 'Relleno completo', 'Full diseño personalizado', 'Secado UV'], warning: null },

    // PEDICURE
    { id: 'p1', category: 'Pedicure', name: 'Pedicure', price: 24000, duration: 60, image: null,
      desc: 'Pedicure completo con limpieza, exfoliación y esmaltado permanente.',
      includes: ['Limpieza profunda de pies', 'Exfoliación', 'Limado y forma', 'Esmaltado permanente', 'Hidratación'], warning: null },
    { id: 'p2', category: 'Pedicure', name: 'Pedicure con polygel (máx. 2 uñas)', price: 26000, duration: 90, image: null,
      desc: 'Pedicure premium con extensión polygel en hasta 2 uñas grandes.',
      includes: ['Pedicure completo', 'Extensión polygel (2 uñas)', 'Esmaltado permanente', 'Hidratación'], warning: null },

    // EXTRAS
    { id: 'e1', category: 'Extras', name: 'Efecto aurora / aperlado', price: 5000, duration: 15, image: null,
      desc: 'Efecto tornasol brillante que cambia con la luz. Se agrega al servicio de uñas.',
      includes: ['Aplicación efecto aurora sobre esmaltado existente'], warning: 'Se aplica como complemento, no como servicio individual.' },
    { id: 'e2', category: 'Extras', name: 'Decoración premium (piedras, foil, stickers)', price: 3000, duration: 10, image: null,
      desc: 'Decoración con piedras, foil metálico o stickers premium por uña.',
      includes: ['Decoración personalizada por uña'], warning: 'Precio por uña. Consulta por diseños complejos.' },

    // RETIROS
    { id: 'r1', category: 'Retiros', name: 'Retiro Esmaltado (hecho en Studio)', price: 3000, duration: 15, image: null,
      desc: 'Retiro seguro de esmaltado semipermanente realizado previamente en nuestro studio.',
      includes: ['Retiro con acetona pura', 'Hidratación post-retiro'], warning: null },
    { id: 'r2', category: 'Retiros', name: 'Retiro Esmaltado (hecho en otro lugar)', price: 5000, duration: 20, image: null,
      desc: 'Retiro de esmaltado hecho en otro salón. Puede requerir más tiempo.',
      includes: ['Retiro con acetona', 'Limpieza de residuos', 'Hidratación'], warning: null },
    { id: 'r3', category: 'Retiros', name: 'Retiro Polygel (hecho en Studio)', price: 5000, duration: 30, image: null,
      desc: 'Retiro cuidadoso de polygel aplicado en nuestro studio.',
      includes: ['Lima suave', 'Retiro seguro', 'Hidratación'], warning: null },
    { id: 'r4', category: 'Retiros', name: 'Retiro Polygel (hecho en otro lugar)', price: 8000, duration: 40, image: null,
      desc: 'Retiro de polygel externo. Proceso más extenso para proteger la uña natural.',
      includes: ['Lima controlada', 'Retiro con cuidado', 'Reparación si es necesario', 'Hidratación'], warning: null },

    // FISH SPA
    { id: 'f1', category: 'Fish Spa', name: 'Fish Spa — 20 minutos', price: 10000, duration: 20, image: null,
      desc: 'Experiencia de relajación donde peces "Doctor Fish" realizan exfoliación natural en tus pies, mejorando circulación y suavidad.',
      includes: ['Limpieza previa de pies', 'Sesión de 20 min con Doctor Fish', 'Secado y crema hidratante'],
      warning: 'No recomendado si tienes heridas abiertas en los pies.' },

    // CEJAS
    { id: 'c1', category: 'Cejas', name: 'Diseño y perfilado de cejas', price: 15000, duration: 45, image: null,
      desc: 'Diseño personalizado según tu rostro. Perfilado con hilo, pinza y cera.',
      includes: ['Análisis de rostro', 'Diseño a medida', 'Perfilado mixto', 'Aplicación de sérum calmante'], warning: null },
    { id: 'c2', category: 'Cejas', name: 'Laminado de cejas', price: 25000, duration: 60, image: null,
      desc: 'Laminado profesional que alisa y fija las cejas en la dirección deseada. Efecto "cejas peinadas" dura 4-6 semanas.',
      includes: ['Diseño previo', 'Tratamiento de laminado', 'Tintura (opcional)', 'Fijación con nutrientes'], warning: null },
    { id: 'c3', category: 'Cejas', name: 'Tintura de cejas', price: 10000, duration: 30, image: null,
      desc: 'Tintura profesional para dar color y definición a las cejas.',
      includes: ['Selección de tono', 'Aplicación de tintura', 'Retoque de forma'], warning: null },
    { id: 'c4', category: 'Cejas', name: 'Henna de cejas', price: 18000, duration: 45, image: null,
      desc: 'Henna natural que tiñe piel y vello para efecto de "relleno" por 2-3 semanas.',
      includes: ['Diseño personalizado', 'Aplicación de henna', 'Retoque y limpieza'], warning: null },

    // PESTAÑAS
    { id: 'ps1', category: 'Pestañas', name: 'Lifting de pestañas', price: 20000, duration: 60, image: null,
      desc: 'Curvado permanente que levanta tus pestañas naturales. Dura 6-8 semanas.',
      includes: ['Limpieza de pestañas', 'Molde de curvatura', 'Tratamiento de lifting', 'Nutrición con keratina'], warning: null },
    { id: 'ps2', category: 'Pestañas', name: 'Lifting + tintura de pestañas', price: 25000, duration: 75, image: null,
      desc: 'Combo: lifting + tintura para pestañas más largas, curvadas y oscuras sin maquillaje.',
      includes: ['Lifting completo', 'Tintura personalizada', 'Nutrición con keratina', 'Sérum de cuidado'], warning: null },

    // TRATAMIENTOS FACIALES
    { id: 'tf1', category: 'Tratamientos Faciales', name: 'Limpieza facial profunda', price: 25000, duration: 60, image: null,
      desc: 'Limpieza profesional con extracción de comedones, exfoliación y máscara purificante.',
      includes: ['Desmaquillado', 'Vaporización', 'Extracción de comedones', 'Máscara purificante', 'Hidratación final'],
      warning: 'Puede causar enrojecimiento temporal post-extracción.' },
    { id: 'tf2', category: 'Tratamientos Faciales', name: 'Limpieza facial + hidratación', price: 35000, duration: 75, image: null,
      desc: 'Limpieza profunda complementada con tratamiento de hidratación intensiva y sérum especializado.',
      includes: ['Limpieza facial completa', 'Sérum de ácido hialurónico', 'Máscara hidratante', 'Masaje facial relajante'], warning: null },
    { id: 'tf3', category: 'Tratamientos Faciales', name: 'Tratamiento anti-acné', price: 30000, duration: 60, image: null,
      desc: 'Tratamiento enfocado en pieles con acné: limpieza, regulación sebácea y calma.',
      includes: ['Limpieza anti-bacterial', 'Extracción controlada', 'Máscara reguladora', 'Protector no comedogénico'],
      warning: 'No aplicar productos con retinol 48h antes.' },

    // MICROPIGMENTACIÓN
    { id: 'm1', category: 'Micropigmentación', name: 'Micropigmentación de cejas', price: 120000, duration: 120, image: null,
      desc: 'Pigmentación profesional de cejas pelo a pelo o efecto polvo. Resultado natural y duradero (12-18 meses). Incluye retoque a los 30 días.',
      includes: ['Diseño digital previo', 'Anestesia tópica', 'Micropigmentación completa', 'Crema cicatrizante', 'Retoque gratuito (30 días)'],
      warning: 'No apta para embarazadas o en periodo de lactancia. Evitar aspirina 48h antes.' },
    { id: 'm2', category: 'Micropigmentación', name: 'Micropigmentación Técnica Mixta', price: 140000, duration: 150, image: null,
      desc: 'Combina pelo a pelo + sombreado para cejas ultra-naturales con definición. Incluye retoque.',
      includes: ['Diseño digital', 'Anestesia tópica', 'Técnica mixta (microblading + sombreado)', 'Crema post', 'Retoque gratuito'],
      warning: 'No apta para embarazadas. Evitar anticoagulantes 48h antes.' },
    { id: 'm3', category: 'Micropigmentación', name: 'Micropigmentación Efecto Polvo', price: 130000, duration: 150, image: null,
      desc: 'Efecto de maquillaje suave y difuminado en las cejas. Ideal para quienes buscan look "powder brow".',
      includes: ['Diseño personalizado', 'Anestesia tópica', 'Técnica powder brow', 'Kit post-cuidado', 'Retoque gratuito'],
      warning: 'No apta para embarazadas.' },
    { id: 'm4', category: 'Micropigmentación', name: 'Micropigmentación de Cejas y Labios (combo)', price: 200000, duration: 240, image: null,
      desc: 'Paquete completo: cejas + neutralización/color de labios. Ahorro significativo vs servicios separados.',
      includes: ['Micropigmentación de cejas', 'Neutralización/color de labios', 'Anestesia tópica', 'Kit post-cuidado', 'Retoque de ambos'],
      warning: '⚠️ IMPORTANTE: Personas con historial de HERPES no pueden realizarse micropigmentación de labios ya que puede provocar un nuevo brote. Consultar antes con dermatólogo.' },
    { id: 'm5', category: 'Micropigmentación', name: 'Remoción Láser de micropigmentación', price: 40000, duration: 45, image: null,
      desc: 'Remoción progresiva de micropigmentación anterior con láser especializado. Pueden requerirse varias sesiones.',
      includes: ['Evaluación previa', 'Sesión de remoción láser', 'Crema cicatrizante'],
      warning: 'Puede requerir 3-5 sesiones. Precio es por sesión individual.' },
    { id: 'm6', category: 'Micropigmentación', name: 'Micropigmentación de labios / Neutralización', price: 100000, duration: 120, image: null,
      desc: 'Pigmentación de labios para color natural, corrección de tono o neutralización. Resultado dura 12-18 meses.',
      includes: ['Diseño de forma y color', 'Anestesia tópica', 'Micropigmentación completa', 'Kit post-cuidado', 'Retoque gratuito (30 días)'],
      warning: '⚠️ ATENCIÓN: Personas con historial de HERPES (herpes labial) NO pueden realizarse este servicio. El procedimiento puede reactivar el virus y causar un brote severo. Consulta con tu dermatólogo antes de agendar.' },

    // RETOQUE
    { id: 're1', category: 'Retoque', name: 'Retoque', price: 80000, duration: 30, image: null,
      desc: 'Retoque de trabajos previos. El valor se confirma conversando con la dueña.',
      includes: [], warning: null }
];

/** Showcase cards for index.html carousel */
var SHOWCASE_CARDS = {
    'micro':    { title: 'Micropigmentación',    price: 'Desde $100.000', duration: '45 - 240 min', icon: 'fas fa-eye',           glow: '#9D1C8F', filterCategory: 'Micropigmentación' },
    'cejas':    { title: 'Cejas',                 price: 'Desde $10.000',  duration: '30 - 60 min',  icon: 'fas fa-magic',         glow: '#DEA3D4', filterCategory: 'Cejas' },
    'pestanas': { title: 'Pestañas',              price: 'Desde $20.000',  duration: '60 - 75 min',  icon: 'fas fa-spa',           glow: '#641A63', filterCategory: 'Pestañas' },
    'faciales': { title: 'Tratamientos Faciales', price: 'Desde $25.000',  duration: '60 - 75 min',  icon: 'fas fa-user-md',       glow: '#b164ff', filterCategory: 'Tratamientos Faciales' },
    'unas':     { title: 'Uñas',                  price: 'Desde $10.000',  duration: '30 - 150 min', icon: 'fas fa-hand-sparkles', glow: '#ff65a3', filterCategory: 'Uñas - Manicure' },
    'fish':     { title: 'Fish Spa',              price: '$10.000',        duration: '20 min',       icon: 'fas fa-water',         glow: '#35D07F', filterCategory: 'Fish Spa' },
};

function formatCLP(n) { return '$' + n.toLocaleString('es-CL'); }
function getCategories() {
    var cats = [];
    SERVICES_DATA.forEach(function(s) { if (cats.indexOf(s.category) === -1) cats.push(s.category); });
    return cats;
}
