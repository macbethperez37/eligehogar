const mongoose = require('mongoose');
const Property = require('../models/Property');
const User = require('../models/User');

const sampleProperties = [
  {
    title: "Villa Serenity",
    description: "Una villa exclusiva ubicada en La Zagaleta, Marbella, con vistas espectaculares y acabados de lujo. Esta propiedad cuenta con amplios espacios, piscina infinita y tecnología de última generación.",
    price: 4250000,
    currency: "€",
    location: {
      address: "Calle de la Luna, 15",
      city: "Marbella",
      state: "Málaga",
      country: "España",
      coordinates: {
        latitude: 36.5103,
        longitude: -4.8817
      }
    },
    propertyType: "Villa",
    features: {
      size: 850,
      bedrooms: 5,
      bathrooms: 6,
      parkingSpaces: 4,
      yearBuilt: 2020,
      furnished: true
    },
    amenities: ["Piscina", "Gimnasio", "Bodega", "Domótica", "Jardín", "Seguridad 24h"],
    images: [
      {
        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSr8hnr8DaOWjuHpJYpVfUy5Trh6UDSMFTk0gqk33yxHgpwpDPyTn3At8kNfUsBfZICANSWUb3pqQkKCRbGCRi00hzMxBrclBfuqzD51HXeHHkokxACHK5Dw8xq96XvTtB5zHMrXUWjNbKbnXkZLzscEGYhb2LwStp7Sdleu7fbyRLY4M_YqOnqXTsa0PNGrFCmYExywci4a34f1_caTriCk1S0c5pFpHta-D9NcQtVqrrrT01twNUn7gwgCZVqtyo39jd-sKoq9Tk",
        alt: "Villa Serenity - Fachada principal",
        isPrimary: true
      }
    ],
    status: "disponible",
    agent: {
      name: "Carlos Rodriguez",
      email: "carlos@luxe-estate.com",
      phone: "+34 600 123 456",
      photo: ""
    }
  },
  {
    title: "Blue Horizon Mansion",
    description: "Mansion de lujo en primera línea de mar en Andratx, Mallorca. Con vistas impresionantes al Mediterráneo y diseño arquitectónico contemporáneo.",
    price: 7800000,
    currency: "€",
    location: {
      address: "Paseo Marítimo, 42",
      city: "Andratx",
      state: "Islas Baleares",
      country: "España",
      coordinates: {
        latitude: 39.5892,
        longitude: 2.4328
      }
    },
    propertyType: "Mansión",
    features: {
      size: 1200,
      bedrooms: 7,
      bathrooms: 8,
      parkingSpaces: 6,
      yearBuilt: 2021,
      furnished: true
    },
    amenities: ["Piscina Infinity", "Gimnasio", "Spa", "Cocina Profesional", "Vista al Mar", "Seguridad 24h", "Cine en Casa"],
    images: [
      {
        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDT4wIGmutQh2QEDOceUy3TH03bZYt4oRvAL8xeEYAzphblVmLJWn6sSkdf1RtlEs20XLADAAts7ddQRM5EUTyLZmmMO4bYCiRStfZmzBlpso8up3r9vxLVDv_zwmi4Gi2XKUPyXWszON98WczA-IizIcQRIxBOm-Mq4mtCtRbld9ZQdvI-RRrLZnulDok59ufy6j-i7NvADpQjejHv2vh435drLLoAkgb0HC0k0X9x2jcOCM4rDN5tDvUfBeiInvRBQvucdRqp4OnC",
        alt: "Blue Horizon Mansion - Vista marítima",
        isPrimary: true
      }
    ],
    status: "disponible",
    agent: {
      name: "Maria Garcia",
      email: "maria@luxe-estate.com",
      phone: "+34 600 789 012",
      photo: ""
    }
  },
  {
    title: "Skyline Penthouse",
    description: "Ático de lujo en el exclusivo barrio de Salamanca, Madrid. Con vistas panorámicas de la ciudad y acabados de alta gama.",
    price: 2950000,
    currency: "€",
    location: {
      address: "Calle Serrano, 120",
      city: "Madrid",
      state: "Madrid",
      country: "España",
      coordinates: {
        latitude: 40.4168,
        longitude: -3.7038
      }
    },
    propertyType: "Penthouse",
    features: {
      size: 320,
      bedrooms: 3,
      bathrooms: 4,
      parkingSpaces: 2,
      yearBuilt: 2019,
      furnished: true
    },
    amenities: ["Domótica", "Terraza", "Vista Panorámica", "Seguridad 24h", "Cocina Equipada"],
    images: [
      {
        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAEdlQASqHE_tO_SoXFxW8PTPpKnNlXl8sZY-d-Joe-H1RW-3vxVueGOdmDJGVHV8D12ujvDNItdSHZOhRPjMVGcunP7YsHnzDnkPYzar6H90dJcbYdZ5jVWn4oeFSL5dtqWXEazuYd-ovPNBs8bpx1T13m01w7vRVqjzPNCTWrgyCZDmx9tJtqXhnr2OqJBzUuaGxiSN7yjJJx1lvPei-8rccoNPPnbOaCf0z3ZYqvSnUToGGh9M_Mc1F0JqigawStpZErsNbtb2Nr",
        alt: "Skyline Penthouse - Interior living",
        isPrimary: true
      }
    ],
    status: "disponible",
    agent: {
      name: "Lopez Fernandez",
      email: "lopez@luxe-estate.com",
      phone: "+34 600 345 678",
      photo: ""
    }
  },
  {
    title: "Forest Retreat Villa",
    description: "Villa moderna en Sotogrande, Cádiz, integrada con la naturaleza. Diseño brutalista con materiales de alta calidad y vistas impresionantes.",
    price: 1850000,
    currency: "€",
    location: {
      address: "Calle Robles, 8",
      city: "Sotogrande",
      state: "Cádiz",
      country: "España",
      coordinates: {
        latitude: 36.1855,
        longitude: -5.5986
      }
    },
    propertyType: "Villa",
    features: {
      size: 450,
      bedrooms: 4,
      bathrooms: 3,
      parkingSpaces: 3,
      yearBuilt: 2022,
      furnished: false
    },
    amenities: ["Piscina Infinity", "Jardín", "Seguridad 24h", "Terraza", "Vista a la Montaña"],
    images: [
      {
        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAX9sHBRAyicdp7PHKWNyzAjdCNsAZCTYDFR89Xu3SXC_-cj9cHaxCuXJ6b5s4yqt4vKAllHfDENJrfMH0nvcmQalMxbnuaqSEZ2H3ZSP0dxkyDfAxHWZ-xgHSEHe_uNCAI1a0KDajo72ZCmjbwGQBqezXWOOW-jXbal2pyFDLSjrMObMRSfT0iyRp_9g6YYTV-Klnri-GDc_7okv4QANh8cVtstpjEjx8Zuez5a2kGyB3zUTOfARWK7o25Mz8WYDB_W8vEbJxKq3H8",
        alt: "Forest Retreat Villa - Fachada exterior",
        isPrimary: true
      }
    ],
    status: "disponible",
    agent: {
      name: "Ana Martínez",
      email: "ana@luxe-estate.com",
      phone: "+34 600 901 234",
      photo: ""
    }
  },
  {
    title: "Golden Coast Apartment",
    description: "Exclusivo apartamento en primera línea de costa en Costa del Sol. Con acabados de lujo y acceso privado a la playa.",
    price: 1200000,
    currency: "€",
    location: {
      address: "Avenida del Mar, 35",
      city: "Fuengirola",
      state: "Málaga",
      country: "España",
      coordinates: {
        latitude: 36.5444,
        longitude: -4.6253
      }
    },
    propertyType: "Apartamento",
    features: {
      size: 180,
      bedrooms: 2,
      bathrooms: 2,
      parkingSpaces: 1,
      yearBuilt: 2023,
      furnished: true
    },
    amenities: ["Piscina Comunitaria", "Vista al Mar", "Seguridad 24h", "Gimnasio Comunitario", "Cocina Equipada"],
    images: [
      {
        url: "https://example.com/golden-coast.jpg",
        alt: "Golden Coast Apartment - Vista marítima",
        isPrimary: true
      }
    ],
    status: "disponible",
    agent: {
      name: "David Pérez",
      email: "david@luxe-estate.com",
      phone: "+34 600 567 890",
      photo: ""
    }
  },
  {
    title: "Mountain View Estate",
    description: "Finca de lujo en las montañas de Sierra Nevada. Privacidad absoluta con vistas impresionantes y naturaleza circundante.",
    price: 3500000,
    currency: "€",
    location: {
      address: "Camino de las Estrellas, 15",
      city: "Granada",
      state: "Granada",
      country: "España",
      coordinates: {
        latitude: 37.1882,
        longitude: -3.6067
      }
    },
    propertyType: "Finca",
    features: {
      size: 650,
      bedrooms: 4,
      bathrooms: 3,
      parkingSpaces: 4,
      yearBuilt: 2021,
      furnished: false
    },
    amenities: ["Piscina", "Jardín", "Bodega", "Vista a la Montaña", "Seguridad 24h"],
    images: [
      {
        url: "https://example.com/mountain-view.jpg",
        alt: "Mountain View Estate - Vista panorámica",
        isPrimary: true
      }
    ],
    status: "disponible",
    agent: {
      name: "Sofía López",
      email: "sofia@luxe-estate.com",
      phone: "+34 600 234 567",
      photo: ""
    }
  }
];

const initDatabase = async () => {
  try {
    // Clear existing data
    await Property.deleteMany({});
    await User.deleteMany({});
    
    console.log('Cleared existing data');
    
    // Create sample properties
    const createdProperties = await Property.insertMany(sampleProperties);
    console.log(`Created ${createdProperties.length} properties`);
    
    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@luxe-estate.com',
      password: 'admin123',
      role: 'admin',
      profile: {
        phone: '+34 900 123 456',
        bio: 'Administrator account'
      }
    });
    
    await adminUser.save();
    console.log('Created admin user');
    
    // Create sample agent user
    const agentUser = new User({
      name: 'Agent Carlos',
      email: 'agent@luxe-estate.com',
      password: 'agent123',
      role: 'agent',
      profile: {
        phone: '+34 600 123 456',
        bio: 'Luxury real estate agent',
        company: 'Luxe Estate'
      }
    });
    
    await agentUser.save();
    console.log('Created agent user');
    
    console.log('Database initialization completed');
    process.exit();
    
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

// Run initialization if this file is executed directly
if (require.main === module) {
  initDatabase();
}

module.exports = { initDatabase, sampleProperties };