const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: '€'
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: 'España'
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  propertyType: {
    type: String,
    enum: ['Villa', 'Ático', 'Mansión', 'Penthouse', 'Apartamento', 'Finca'],
    required: true
  },
  features: {
    size: {
      type: Number, // in square meters
      required: true
    },
    bedrooms: {
      type: Number,
      required: true
    },
    bathrooms: {
      type: Number,
      required: true
    },
    parkingSpaces: Number,
    yearBuilt: Number,
    furnished: {
      type: Boolean,
      default: false
    }
  },
  amenities: [{
    type: String,
    enum: ['Piscina', 'Gimnasio', 'Bodega', 'Domótica', 'Jardín', 'Terraza', 'Gimnasio', 'Spa', 'Seguridad 24h', 'Cocina Profesional', 'Cine en Casa', 'Vista al Mar', 'Vista a la Montaña', 'Piscina Infinity', 'Sauna', 'Chimenea']
  }],
  images: [{
    url: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  status: {
    type: String,
    enum: ['disponible', 'vendido', 'reservado', 'en construcción'],
    default: 'disponible'
  },
  agent: {
    name: String,
    email: String,
    phone: String,
    photo: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

PropertySchema.index({ location: '2dsphere' });
PropertySchema.index({ price: 1 });
PropertySchema.index({ 'location.city': 1 });
PropertySchema.index({ propertyType: 1 });
PropertySchema.index({ status: 1 });

module.exports = mongoose.model('Property', PropertySchema);