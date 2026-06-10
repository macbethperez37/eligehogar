const { getDB } = require('./database');
const fs = require('fs');
const path = require('path');

const sampleProperties = [
  {
    title: "Villa Serenity",
    description: "Una villa exclusiva ubicada en La Zagaleta, Marbella, con vistas espectaculares y acabados de lujo. Esta propiedad cuenta con amplios espacios, piscina infinita y tecnología de última generación.",
    price: 4250000,
    currency: "€",
    location: JSON.stringify({
      address: "Calle de la Luna, 15",
      city: "Marbella",
      state: "Málaga",
      country: "España",
      coordinates: {
        latitude: 36.5103,
        longitude: -4.8817
      }
    }),
    propertyType: "Villa",
    features: JSON.stringify({
      size: 850,
      bedrooms: 5,
      bathrooms: 6,
      parkingSpaces: 4,
      yearBuilt: 2020,
      furnished: true
    }),
    amenities: JSON.stringify(["Piscina", "Gimnasio", "Bodega", "Domótica", "Jardín", "Seguridad 24h"]),
    images: JSON.stringify([{
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSr8hnr8DaOWjuHpJYpVfUy5Trh6UDSMFTk0gqk33yxHgpwpDPyTn3At8kNfUsBfZICANSWUb3pqQkKCRbGCRi00hzMxBrclBfuqzD51HXeHHkokxACHK5Dw8xq96XvTtB5zHMrXUWjNbKbnXkZLzscEGYhb2LwStp7Sdleu7fbyRLY4M_YqOnqXTsa0PNGrFCmYExywci4a34f1_caTriCk1S0c5pFpHta-D9NcQtVqrrrT01twNUn7gwgCZVqtyo39jd-sKoq9Tk",
      alt: "Villa Serenity - Fachada principal",
      isPrimary: true
    }]),
    status: "disponible",
    agentName: "Carlos Rodriguez",
    agentEmail: "carlos@luxe-estate.com",
    agentPhone: "+34 600 123 456"
  },
  {
    title: "Blue Horizon Mansion",
    description: "Mansion de lujo en primera línea de mar en Andratx, Mallorca. Con vistas impresionantes al Mediterráneo y diseño arquitectónico contemporáneo.",
    price: 7800000,
    currency: "€",
    location: JSON.stringify({
      address: "Paseo Marítimo, 42",
      city: "Andratx",
      state: "Islas Baleares",
      country: "España",
      coordinates: {
        latitude: 39.5892,
        longitude: 2.4328
      }
    }),
    propertyType: "Mansión",
    features: JSON.stringify({
      size: 1200,
      bedrooms: 7,
      bathrooms: 8,
      parkingSpaces: 6,
      yearBuilt: 2021,
      furnished: true
    }),
    amenities: JSON.stringify(["Piscina Infinity", "Gimnasio", "Spa", "Cocina Profesional", "Vista al Mar", "Seguridad 24h", "Cine en Casa"]),
    images: JSON.stringify([{
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDT4wIGmutQh2QEDOceUy3TH03bZYt4oRvAL8xeEYAzphblVmLJWn6sSkdf1RtlEs20XLADAAts7ddQRM5EUTyLZmmMO4bYCiRStfZmzBlpso8up3r9vxLVDv_zwmi4Gi2XKUPyXWszON98WczA-IizIcQRIxBOm-Mq4mtCtRbld9ZQdvI-RRrLZnulDok59ufy6j-i7NvADpQjejHv2vh435drLLoAkgb0HC0k0X9x2jcOCM4rDN5tDvUfBeiInvRBQvucdRqp4OnC",
      alt: "Blue Horizon Mansion - Vista marítima",
      isPrimary: true
    }]),
    status: "disponible",
    agentName: "Maria Garcia",
    agentEmail: "maria@luxe-estate.com",
    agentPhone: "+34 600 789 012"
  },
  {
    title: "Skyline Penthouse",
    description: "Ático de lujo en el exclusivo barrio de Salamanca, Madrid. Con vistas panorámicas de la ciudad y acabados de alta gama.",
    price: 2950000,
    currency: "€",
    location: JSON.stringify({
      address: "Calle Serrano, 120",
      city: "Madrid",
      state: "Madrid",
      country: "España",
      coordinates: {
        latitude: 40.4168,
        longitude: -3.7038
      }
    }),
    propertyType: "Penthouse",
    features: JSON.stringify({
      size: 320,
      bedrooms: 3,
      bathrooms: 4,
      parkingSpaces: 2,
      yearBuilt: 2019,
      furnished: true
    }),
    amenities: JSON.stringify(["Domótica", "Terraza", "Vista Panorámica", "Seguridad 24h", "Cocina Equipada"]),
    images: JSON.stringify([{
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAEdlQASqHE_tO_SoXFxW8PTPpKnNlXl8sZY-d-Joe-H1RW-3vxVueGOdmDJGVHV8D12ujvDNItdSHZOhRPjMVGcunP7YsHnzDnkPYzar6H90dJcbYdZ5jVWn4oeFSL5dtqWXEazuYd-ovPNBs8bpx1T13m01w7vRVqjzPNCTWrgyCZDmx9tJtqXhnr2OqJBzUuaGxiSN7yjJJx1lvPei-8rccoNPPnbOaCf0z3ZYqvSnUToGGh9M_Mc1F0JqigawStpZErsNbtb2Nr",
      alt: "Skyline Penthouse - Interior living",
      isPrimary: true
    }]),
    status: "disponible",
    agentName: "Lopez Fernandez",
    agentEmail: "lopez@luxe-estate.com",
    agentPhone: "+34 600 345 678"
  },
  {
    title: "Forest Retreat Villa",
    description: "Villa moderna en Sotogrande, Cádiz, integrada con la naturaleza. Diseño brutalista con materiales de alta calidad y vistas impresionantes.",
    price: 1850000,
    currency: "€",
    location: JSON.stringify({
      address: "Calle Robles, 8",
      city: "Sotogrande",
      state: "Cádiz",
      country: "España",
      coordinates: {
        latitude: 36.1855,
        longitude: -5.5986
      }
    }),
    propertyType: "Villa",
    features: JSON.stringify({
      size: 450,
      bedrooms: 4,
      bathrooms: 3,
      parkingSpaces: 3,
      yearBuilt: 2022,
      furnished: false
    }),
    amenities: JSON.stringify(["Piscina Infinity", "Jardín", "Seguridad 24h", "Terraza", "Vista a la Montaña"]),
    images: JSON.stringify([{
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAX9sHBRAyicdp7PHKWNyzAjdCNsAZCTYDFR89Xu3SXC_-cj9cHaxCuXJ6b5s4yqt4vKAllHfDENJrfMH0nvcmQalMxbnuaqSEZ2H3ZSP0dxkyDfAxHWZ-xgHSEHe_uNCAI1a0KDajo72ZCmjbwGQBqezXWOOW-jXbal2pyFDLSjrMObMRSfT0iyRp_9g6YYTV-Klnri-GDc_7okv4QANh8cVtstpjEjx8Zuez5a2kGyB3zUTOfARWK7o25Mz8WYDB_W8vEbJxKq3H8",
      alt: "Forest Retreat Villa - Fachada exterior",
      isPrimary: true
    }]),
    status: "disponible",
    agentName: "Ana Martínez",
    agentEmail: "ana@luxe-estate.com",
    agentPhone: "+34 600 901 234"
  },
  {
    title: "Golden Coast Apartment",
    description: "Exclusivo apartamento en primera línea de costa en Costa del Sol. Con acabados de lujo y acceso privado a la playa.",
    price: 1200000,
    currency: "€",
    location: JSON.stringify({
      address: "Avenida del Mar, 35",
      city: "Fuengirola",
      state: "Málaga",
      country: "España",
      coordinates: {
        latitude: 36.5444,
        longitude: -4.6253
      }
    }),
    propertyType: "Apartamento",
    features: JSON.stringify({
      size: 180,
      bedrooms: 2,
      bathrooms: 2,
      parkingSpaces: 1,
      yearBuilt: 2023,
      furnished: true
    }),
    amenities: JSON.stringify(["Piscina Comunitaria", "Vista al Mar", "Seguridad 24h", "Gimnasio Comunitario", "Cocina Equipada"]),
    images: JSON.stringify([{
      url: "https://example.com/golden-coast.jpg",
      alt: "Golden Coast Apartment - Vista marítima",
      isPrimary: true
    }]),
    status: "disponible",
    agentName: "David Pérez",
    agentEmail: "david@luxe-estate.com",
    agentPhone: "+34 600 567 890"
  },
  {
    title: "Mountain View Estate",
    description: "Finca de lujo en las montañas de Sierra Nevada. Privacidad absoluta con vistas impresionantes y naturaleza circundante.",
    price: 3500000,
    currency: "€",
    location: JSON.stringify({
      address: "Camino de las Estrellas, 15",
      city: "Granada",
      state: "Granada",
      country: "España",
      coordinates: {
        latitude: 37.1882,
        longitude: -3.6067
      }
    }),
    propertyType: "Finca",
    features: JSON.stringify({
      size: 650,
      bedrooms: 4,
      bathrooms: 3,
      parkingSpaces: 4,
      yearBuilt: 2021,
      furnished: false
    }),
    amenities: JSON.stringify(["Piscina", "Jardín", "Bodega", "Vista a la Montaña", "Seguridad 24h"]),
    images: JSON.stringify([{
      url: "https://example.com/mountain-view.jpg",
      alt: "Mountain View Estate - Vista panorámica",
      isPrimary: true
    }]),
    status: "disponible",
    agentName: "Sofía López",
    agentEmail: "sofia@luxe-estate.com",
    agentPhone: "+34 600 234 567"
  }
];

const initDatabase = async () => {
  try {
    // Connect to database first
    const { connectDB } = require('./database');
    await connectDB();
    const db = getDB();
    
    // Clear existing data
    await db.execute('DELETE FROM properties');
    await db.execute('DELETE FROM users WHERE role IN (?, ?)', ['admin', 'agent']);
    await db.execute('DELETE FROM newsletter_subscriptions');
    await db.execute('DELETE FROM contacts');
    
    console.log('Cleared existing data');

    // Create admin user
    const adminPassword = 'admin123';
    const [adminResult] = await db.execute(
      `INSERT INTO users (name, email, password, role, profile) 
       VALUES (?, ?, ?, ?, ?)`,
      ['Admin User', 'admin@luxe-estate.com', adminPassword, 'admin', JSON.stringify({
        phone: '+34 900 123 456',
        bio: 'Administrator account'
      })]
    );
    const adminId = adminResult.insertId;

    // Create sample agent user
    const agentPassword = 'agent123';
    const [agentResult] = await db.execute(
      `INSERT INTO users (name, email, password, role, profile) 
       VALUES (?, ?, ?, ?, ?)`,
      ['Agent Carlos', 'agent@luxe-estate.com', agentPassword, 'agent', JSON.stringify({
        phone: '+34 600 123 456',
        bio: 'Luxury real estate agent',
        company: 'Luxe Estate'
      })]
    );
    const agentId = agentResult.insertId;

    console.log('Created admin and agent users');

    // Create sample properties with agent reference
    for (const property of sampleProperties) {
      // Find or create agent for this property
      let currentAgentId = agentId;
      if (property.agentEmail !== 'agent@luxe-estate.com') {
        // Check if agent exists
        let [agentRows] = await db.execute(
          'SELECT id FROM users WHERE email = ?',
          [property.agentEmail]
        );
        
        if (agentRows.length === 0) {
          // Create new agent
          const [newAgentResult] = await db.execute(
            `INSERT INTO users (name, email, password, role, profile) 
             VALUES (?, ?, ?, ?, ?)`,
            [property.agentName, property.agentEmail, 'agent123', 'agent', JSON.stringify({
              phone: property.agentPhone,
              bio: 'Luxury real estate agent',
              company: 'Luxe Estate'
            })]
          );
          currentAgentId = newAgentResult.insertId;
        } else {
          currentAgentId = agentRows[0].id;
        }
      }

      await db.execute(
        `INSERT INTO properties (title, description, price, currency, location, property_type, features, amenities, images, status, agent_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          property.title,
          property.description,
          property.price,
          property.currency,
          property.location,
          property.propertyType,
          property.features,
          property.amenities,
          property.images,
          property.status,
          currentAgentId
        ]
      );
    }

    console.log(`Created ${sampleProperties.length} properties`);

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