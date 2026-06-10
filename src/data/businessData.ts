export interface ServiceItem {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string; // Lucide icon identifier (e.g., 'ShoppingBag', 'Wrench', 'ShieldCheck')
  highlights: string[];
}

export interface PostItem {
  id: string;
  brand: string;
  title: string;
  content: string;
  imageUrl: string;
  date: string;
  likes: number;
  commentsCount: number;
  shares: number;
  tags: string[];
}

export interface ContactInfo {
  phoneNumbers: {
    label: string;
    number: string;
    whatsappFormatted: string;
    isWhatsApp: boolean;
  }[];
  emails: string[];
  address: {
    street: string;
    neighborhood: string;
    city: string;
    department: string;
    country: string;
    googleMapsUrl: string;
  };
  website: string;
}

export interface BusinessSchedule {
  timezone: string; // e.g. 'America/Bogota'
  weekdays: {
    days: number[]; // 1 = Monday, ..., 5 = Friday
    label: string;
    ranges: { start: string; end: string }[]; // e.g. [{start: '08:00', end: '12:30'}, {start: '14:00', end: '18:00'}]
  }[];
  saturdays: {
    days: number[]; // [6]
    label: string;
    ranges: { start: string; end: string }[];
  }[];
  sundays: {
    days: number[]; // [0]
    label: string;
    ranges: { start: string; end: string }[]; // empty means closed
  }[];
}

export interface BusinessData {
  name: string;
  slogan: string;
  experienceYears: number;
  city: string;
  whatsappPrimary: string;
  contact: ContactInfo;
  services: ServiceItem[];
  posts: PostItem[];
  schedule: BusinessSchedule;
}

export const businessData: BusinessData = {
  name: 'Mundo Gas',
  slogan: '¡Calor a tu medida con Mundo Gas!',
  experienceYears: 25,
  city: 'Manizales',
  whatsappPrimary: '+573136076305',
  contact: {
    phoneNumbers: [
      { label: 'Celular / WhatsApp Principal', number: '313 6076305', whatsappFormatted: '+573136076305', isWhatsApp: true },
      { label: 'Celular de Soporte', number: '310 4656411', whatsappFormatted: '+573104656411', isWhatsApp: true },
      { label: 'Teléfono Fijo', number: '3729561', whatsappFormatted: '', isWhatsApp: false }
    ],
    emails: ['almacenmundogas25@gmail.com'],
    address: {
      street: 'Calle 25 #21-43',
      neighborhood: 'Centro',
      city: 'Manizales',
      department: 'Caldas',
      country: 'Colombia',
      googleMapsUrl: 'https://maps.app.goo.gl/yLz74NqC5Xm2V9aDA' // Placeholder link to actual Manizales Center
    },
    website: 'mundogasmanizales.com'
  },
  services: [
    {
      id: 'venta',
      title: 'Modelos y Marcas Diversas',
      shortDescription: 'Contamos con una selección impresionante de calentadores a gas de las mejores marcas del mercado.',
      fullDescription: 'En Mundo Gas te ofrecemos un amplio portafolio de calentadores de marcas líderes mundiales como Bosch, Clasic, Challenger y más. Encontrarás calentadores de tiro natural, tiro forzado y de acumulación, adaptados a la presión de agua de tu hogar y con capacidades desde 5.5 litros hasta 20 litros.',
      iconName: 'Flame',
      highlights: ['Calentadores Bosch y Clasic originales', 'Garantía directa de fábrica', 'Asesoría experta para elegir la capacidad correcta']
    },
    {
      id: 'instalacion',
      title: 'Instalación Profesional',
      shortDescription: 'Servicio de instalación de calentadores garantizado por técnicos altamente certificados.',
      fullDescription: 'La seguridad es lo primero cuando se trata de gas. Por eso, nuestro equipo técnico cuenta con las debidas certificaciones exigidas por el sector para realizar instalaciones limpias, seguras y cumpliendo a cabalidad con la norma técnica colombiana NTC 3567. Evita fugas y mala combustión.',
      iconName: 'BadgeCheck',
      highlights: ['Técnicos certificados', 'Cumplimiento estricto de normas de seguridad', 'Pruebas de hermeticidad en cada servicio']
    },
    {
      id: 'mantenimiento',
      title: 'Mantenimiento y Reparación',
      shortDescription: 'Cuidado preventivo y correctivo para prolongar la vida útil de tu equipo y asegurar su eficiencia.',
      fullDescription: '¿Tu calentador no calienta como antes, arroja llama amarilla o tiene apagones repentinos? Realizamos mantenimiento preventivo completo (limpieza de quemadores, calibración de sensores, revisión de válvula de gas y cambio de baterías) y reparación técnica experta con repuestos 100% originales.',
      iconName: 'Wrench',
      highlights: ['Mantenimiento preventivo anual', 'Diagnóstico preciso de fallas', 'Repuestos originales Bosch, Clasic y multimarca']
    },
    {
      id: 'redes-chimeneas',
      title: 'Redes y Chimeneas a Gas',
      shortDescription: 'Instalación de redes de gas y chimeneas a gas (directas, conteo remoto) o alcohol.',
      fullDescription: 'Expertos en diseño e instalación de redes de gas residenciales y comerciales. Además, instalamos y realizamos mantenimiento a chimeneas a gas (directas y de conteo remoto) y modernas chimeneas en alcohol. Soluciones seguras y estéticas para su hogar.',
      iconName: 'Flame',
      highlights: ['Redes de gas', 'Chimeneas a gas (directas y conteo remoto)', 'Chimeneas en alcohol']
    }
  ],
  posts: [
    {
      id: 'post-bosch',
      brand: 'Bosch',
      title: 'Calentador Bosch de Paso - ¡Calor al instante!',
      content: '¡Elige el tuyo! 🔥 ¿Necesitas un calentador a gas que se ajuste a tus necesidades únicas? En Mundo Gas te traemos los mejores calentadores Bosch de última tecnología alemana con corazón colombiano. Modelos modernos con displays digitales que permiten regular la temperatura exacta de tu baño. Disponibles en capacidades de 10, 13 y 16 Litros. ¡Ahorra hasta un 60% en tu consumo de gas! Contáctanos y solicita tu cotización con instalación incluida.',
      imageUrl: '/images/heater_bosch.jpg',
      date: 'Hace 2 días',
      likes: 124,
      commentsCount: 18,
      shares: 12,
      tags: ['MundoGas', 'CalentadoresAGas', 'BoschManizales', 'CalefaccionEficiente']
    },
    {
      id: 'post-clasic',
      brand: 'Clasic',
      title: 'Línea de Calentadores Clasic - Excelente calidad y precio',
      content: '¿Buscas una opción duradera, eficiente y que se ajuste a tu presupuesto? Los calentadores a gas Clasic son ideales para el clima de Manizales. Diseñados para trabajar con baja presión de agua, ideales para apartamentos o zonas altas. Cuenta con doble sensor de seguridad y encendido electrónico automático. Visítanos en la Calle 25 #21-43 Centro y con gusto te asesoramos.',
      imageUrl: '/images/heater_classic.jpg',
      date: 'Hace 5 días',
      likes: 89,
      commentsCount: 9,
      shares: 4,
      tags: ['MundoGas', 'CalentadoresClasic', 'HogarCalentito', 'Manizales']
    },
    {
      id: 'post-mantenimiento',
      brand: 'Servicio Técnico',
      title: '¿Llama amarilla en tu calentador? ¡Cuidado!',
      content: 'Un calentador con llama amarilla o roja es señal de mala combustión y acumulación de monóxido de carbono ⚠️. La llama en tu calentador siempre debe ser azul vibrante. Evita riesgos de salud y aumenta la vida útil de tu calentador realizando tu mantenimiento preventivo anual con Mundo Gas. Contamos con técnicos certificados listos para visitarte en Manizales y municipios aledaños.',
      imageUrl: '/images/maintenance_service.jpg',
      date: 'Hace 1 semana',
      likes: 156,
      commentsCount: 22,
      shares: 28,
      tags: ['MundoGas', 'SeguridadEnElHogar', 'MantenimientoCalentadores', 'TecnicosCertificados']
    }
  ],
  schedule: {
    timezone: 'America/Bogota',
    weekdays: [
      {
        days: [1, 2, 3, 4, 5],
        label: 'Lunes a Viernes',
        ranges: [
          { start: '08:00', end: '12:30' },
          { start: '14:00', end: '18:00' }
        ]
      }
    ],
    saturdays: [
      {
        days: [6],
        label: 'Sábados',
        ranges: [
          { start: '08:00', end: '13:30' }
        ]
      }
    ],
    sundays: [
      {
        days: [0],
        label: 'Domingos y Festivos',
        ranges: [] // Closed
      }
    ]
  }
};
