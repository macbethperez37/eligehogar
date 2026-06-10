const express = require('express');
const router = express.Router();
const { getDB } = require('../config/database');

// @desc    Get all properties with filtering and pagination
// @route   GET /api/properties
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      sortBy = 'created_at',
      sortOrder = 'desc',
      location,
      propertyType,
      minPrice,
      maxPrice,
      minBedrooms,
      minBathrooms,
      amenities,
      search
    } = req.query;

    const db = getDB();
    
    // Build WHERE clause
    let whereConditions = ['status = "disponible"'];
    let params = [];

    // Location filter
    if (location) {
      whereConditions.push('JSON_EXTRACT(location, "$.city") LIKE ?');
      params.push(`%${location}%`);
    }

    // Property type filter
    if (propertyType) {
      whereConditions.push('property_type = ?');
      params.push(propertyType);
    }

    // Price range filter
    if (minPrice || maxPrice) {
      if (minPrice && maxPrice) {
        whereConditions.push('price BETWEEN ? AND ?');
        params.push(minPrice, maxPrice);
      } else if (minPrice) {
        whereConditions.push('price >= ?');
        params.push(minPrice);
      } else if (maxPrice) {
        whereConditions.push('price <= ?');
        params.push(maxPrice);
      }
    }

    // Bedrooms filter
    if (minBedrooms) {
      whereConditions.push('JSON_EXTRACT(features, "$.bedrooms") >= ?');
      params.push(minBedrooms);
    }

    // Bathrooms filter
    if (minBathrooms) {
      whereConditions.push('JSON_EXTRACT(features, "$.bathrooms") >= ?');
      params.push(minBathrooms);
    }

    // Amenities filter
    if (amenities) {
      const amenityArray = amenities.split(',').map(a => a.trim());
      const amenityConditions = amenityArray.map(() => 'JSON_CONTAINS(amenities, ?)');
      whereConditions.push(`(${amenityConditions.join(' OR ')})`);
      params = params.concat(amenityArray.map(a => `"${a}"`));
    }

    // Search filter
    if (search) {
      whereConditions.push('(title LIKE ? OR description LIKE ? OR JSON_EXTRACT(location, "$.address") LIKE ? OR JSON_EXTRACT(location, "$.city") LIKE ?)');
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam, searchParam);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const [countResult] = await db.execute(
      `SELECT COUNT(*) as total FROM properties ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Sorting
    let orderBy = '';
    if (sortBy) {
      const direction = sortOrder === 'desc' ? 'DESC' : 'ASC';
      const sortField = sortBy === 'createdAt' ? 'created_at' : sortBy;
      orderBy = `ORDER BY ${sortField} ${direction}`;
    }

    // Pagination
    const offset = (page - 1) * limit;
    const limitClause = `LIMIT ${offset}, ${limit}`;

    // Get properties
    const [properties] = await db.execute(
      `SELECT * FROM properties ${whereClause} ${orderBy} ${limitClause}`,
      params
    );

    // Get property types and amenities for filters
    const [typesResult] = await db.execute('SELECT DISTINCT property_type FROM properties');
    const [amenitiesResult] = await db.execute(
      'SELECT DISTINCT JSON_UNQUOTE(JSON_EXTRACT(amenities, "$[*]")) as amenity FROM properties WHERE amenities IS NOT NULL'
    );

    const propertyTypes = typesResult.map(row => row.property_type);
    const allAmenities = amenitiesResult.flatMap(row => row.amenity).filter(Boolean);

    res.json({
      success: true,
      count: properties.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      propertyTypes,
      amenities: allAmenities,
      properties
    });

  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const [properties] = await db.execute(
      'SELECT * FROM properties WHERE id = ?',
      [req.params.id]
    );

    if (properties.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      });
    }

    res.json({
      success: true,
      data: properties[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Get featured properties
// @route   GET /api/properties/featured/featured
// @access  Public
router.get('/featured/featured', async (req, res) => {
  try {
    const db = getDB();
    
    const [featuredProperties] = await db.execute(
      `SELECT * FROM properties 
       WHERE status = 'disponible' AND 
       (
         JSON_CONTAINS(amenities, '"Piscina"') OR
         JSON_CONTAINS(amenities, '"Vista al Mar"') OR
         price > 2000000 OR
         JSON_EXTRACT(features, "$.bedrooms") >= 5
       )
       ORDER BY created_at DESC
       LIMIT 6`
    );

    res.json({
      success: true,
      count: featuredProperties.length,
      data: featuredProperties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Get property types for filtering
// @route   GET /api/properties/types/list
// @access  Public
router.get('/types/list', async (req, res) => {
  try {
    const db = getDB();
    
    const [propertyTypes] = await db.execute(
      'SELECT DISTINCT property_type FROM properties WHERE property_type IS NOT NULL'
    );
    
    const [amenitiesResult] = await db.execute(
      'SELECT DISTINCT JSON_UNQUOTE(JSON_EXTRACT(amenities, "$[*]")) as amenity FROM properties WHERE amenities IS NOT NULL'
    );

    const allAmenities = amenitiesResult.flatMap(row => row.amenity).filter(Boolean);

    res.json({
      success: true,
      data: {
        propertyTypes: propertyTypes.map(row => row.property_type),
        amenities: allAmenities
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Get price range for filtering
// @route   GET /api/properties/price-range/range
// @access  Public
router.get('/price-range/range', async (req, res) => {
  try {
    const db = getDB();
    
    const [priceRange] = await db.execute(
      'SELECT MIN(price) as minPrice, MAX(price) as maxPrice FROM properties WHERE price IS NOT NULL'
    );

    if (priceRange.length > 0 && priceRange[0].minPrice !== null && priceRange[0].maxPrice !== null) {
      res.json({
        success: true,
        data: priceRange[0]
      });
    } else {
      res.json({
        success: true,
        data: { minPrice: 0, maxPrice: 10000000 }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;