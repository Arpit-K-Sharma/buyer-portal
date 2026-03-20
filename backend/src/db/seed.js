require('dotenv').config();
const pool = require('./pool');

const properties = [
  {
    title: 'Modern Downtown Apartment',
    description: 'A sleek, fully furnished 2-bedroom apartment in the heart of the city with stunning skyline views, modern kitchen, and high-speed internet included.',
    location: 'Kathmandu, Thamel',
    price: 25000000,
    type: 'apartment',
    image_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
  },
  {
    title: 'Spacious Family Villa',
    description: 'Elegant 4-bedroom villa with a private garden, rooftop terrace, and panoramic mountain views. Perfect for families seeking comfort and privacy.',
    location: 'Lalitpur, Patan',
    price: 85000000,
    type: 'villa',
    image_url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
  },
  {
    title: 'Cozy Studio in Lakeside',
    description: 'Charming studio apartment just 200 metres from Phewa Lake. Ideal for young professionals or couples looking for a peaceful retreat.',
    location: 'Pokhara, Lakeside',
    price: 12000000,
    type: 'apartment',
    image_url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
  },
  {
    title: 'Heritage Rana-style House',
    description: 'Beautifully restored Rana-era property featuring original architectural details, a grand courtyard, and 5 spacious bedrooms.',
    location: 'Kathmandu, Durbarmarg',
    price: 120000000,
    type: 'house',
    image_url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
  },
  {
    title: 'Luxury Penthouse Suite',
    description: 'Exclusive penthouse on the 12th floor with a private pool, 360-degree city views, 3 bedrooms, and a state-of-the-art home automation system.',
    location: 'Kathmandu, Jhamsikhel',
    price: 65000000,
    type: 'apartment',
    image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
  },
  {
    title: 'Mountain View Bungalow',
    description: 'Serene 3-bedroom bungalow nestled in the foothills with unobstructed Himalayan views, a lush garden, and a wrap-around porch.',
    location: 'Bhaktapur, Nagarkot',
    price: 45000000,
    type: 'house',
    image_url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
  },
  {
    title: 'Contemporary Office-cum-Home',
    description: 'Purpose-built live-work space with a dedicated office on the ground floor and a stylish 2-bedroom residence above. Fibre optic internet ready.',
    location: 'Lalitpur, Kupondole',
    price: 38000000,
    type: 'house',
    image_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
  },
  {
    title: 'Riverfront Villa',
    description: 'Stunning 5-bedroom villa on the banks of the Bagmati river with a private jetty, infinity pool, and landscaped gardens.',
    location: 'Kathmandu, Sankhamul',
    price: 95000000,
    type: 'villa',
    image_url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
  },
  {
    title: 'Budget-Friendly Studio',
    description: 'Smart 1-bedroom studio apartment in a well-connected neighbourhood. Ideal for first-time buyers. Close to markets, schools, and public transport.',
    location: 'Kathmandu, Baneshwor',
    price: 9500000,
    type: 'apartment',
    image_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
  },
  {
    title: 'Eco-Friendly Hilltop Retreat',
    description: 'Sustainable 4-bedroom home built with natural materials, solar panels, and rainwater harvesting. Surrounded by pine forest with breathtaking views.',
    location: 'Pokhara, Sarangkot',
    price: 55000000,
    type: 'house',
    image_url: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800',
  },
  {
    title: 'City Centre Commercial Apartment',
    description: 'Premium 2-bedroom apartment in a prime commercial district. 24/7 security, covered parking, and access to a shared gym and rooftop lounge.',
    location: 'Kathmandu, New Road',
    price: 32000000,
    type: 'apartment',
    image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
  },
  {
    title: 'Traditional Newari Courtyard Home',
    description: 'Authentic Newari architecture meets modern comfort. 6-bedroom historic home centred around a traditional courtyard — a cultural treasure.',
    location: 'Bhaktapur, Dattatreya',
    price: 78000000,
    type: 'house',
    image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
  },
];

async function seed(closePool = false) {
  const client = await pool.connect();
  try {
    console.log('🌱 Seeding properties...');
    await client.query('DELETE FROM favourites');
    await client.query('DELETE FROM properties');
    await client.query('ALTER SEQUENCE properties_id_seq RESTART WITH 1');

    for (const prop of properties) {
      await client.query(
        `INSERT INTO properties (title, description, location, price, type, image_url)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [prop.title, prop.description, prop.location, prop.price, prop.type, prop.image_url]
      );
    }

    console.log(`✅ Seeded ${properties.length} properties successfully!`);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    client.release();
    if (closePool) {
      await pool.end();
    }
  }
}

if (require.main === module) {
  seed(true);
}

module.exports = { seed };
