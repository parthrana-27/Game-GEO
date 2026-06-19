/**
 * Seed script for StreetSight locations table.
 *
 * Usage: npm run seed
 *        (or: ts-node prisma/seed.ts)
 *
 * Add your own coordinate pairs by extending the arrays below.
 * Each entry needs: region, lat, lng, and an optional streetViewMetadata object.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ──────────────────────────────────────────────────────────────────────────────
// LOCATION DATA
// ──────────────────────────────────────────────────────────────────────────────

const worldLocations = [
  { lat: 48.8584, lng: 2.2945 },    // Eiffel Tower, Paris, France
  { lat: 51.5007, lng: -0.1246 },   // Big Ben, London, UK
  { lat: 40.6892, lng: -74.0445 },  // Statue of Liberty, New York, USA
  { lat: 35.6762, lng: 139.6503 },  // Shinjuku, Tokyo, Japan
  { lat: -33.8568, lng: 151.2153 }, // Opera House, Sydney, Australia
  { lat: 55.7512, lng: 37.6184 },   // Red Square, Moscow, Russia
  { lat: 41.9029, lng: 12.4534 },   // Vatican City, Italy
  { lat: 29.9792, lng: 31.1342 },   // Great Pyramid, Giza, Egypt
  { lat: -22.9068, lng: -43.1729 }, // Christ the Redeemer, Rio, Brazil
  { lat: 27.1751, lng: 78.0421 },   // Taj Mahal, Agra, India
  { lat: 1.2838, lng: 103.8591 },   // Marina Bay Sands, Singapore
  { lat: 25.1972, lng: 55.2744 },   // Burj Khalifa, Dubai, UAE
  { lat: 51.1789, lng: -1.8262 },   // Stonehenge, UK
  { lat: -13.1631, lng: -72.5450 }, // Machu Picchu, Peru
  { lat: 37.8199, lng: -122.4783 }, // Golden Gate Bridge, San Francisco, USA
  { lat: 52.3676, lng: 4.9041 },    // Amsterdam, Netherlands
  { lat: 41.0082, lng: 28.9784 },   // Istanbul, Turkey
  { lat: -4.3246, lng: 15.3222 },   // Kinshasa, DR Congo
  { lat: 59.9139, lng: 10.7522 },   // Oslo, Norway
  { lat: 64.1355, lng: -21.8954 },  // Reykjavik, Iceland
  { lat: 31.2304, lng: 121.4737 },  // Shanghai, China
  { lat: 19.4326, lng: -99.1332 },  // Mexico City, Mexico
  { lat: -34.6037, lng: -58.3816 }, // Buenos Aires, Argentina
  { lat: 6.5244, lng: 3.3792 },     // Lagos, Nigeria
  { lat: 33.8869, lng: 9.5375 },    // Tunisia, North Africa
  { lat: 43.6532, lng: -79.3832 },  // Toronto, Canada
  { lat: 37.5665, lng: 126.9780 },  // Seoul, South Korea
  { lat: -1.2921, lng: 36.8219 },   // Nairobi, Kenya
  { lat: 13.7563, lng: 100.5018 },  // Bangkok, Thailand
  { lat: 55.6761, lng: 12.5683 },   // Copenhagen, Denmark
];

const indiaLocations = [
  { lat: 28.6139, lng: 77.2090 },  // New Delhi
  { lat: 19.0760, lng: 72.8777 },  // Mumbai
  { lat: 13.0827, lng: 80.2707 },  // Chennai
  { lat: 12.9716, lng: 77.5946 },  // Bengaluru
  { lat: 22.5726, lng: 88.3639 },  // Kolkata
  { lat: 17.3850, lng: 78.4867 },  // Hyderabad
  { lat: 26.9124, lng: 75.7873 },  // Jaipur
  { lat: 23.0225, lng: 72.5714 },  // Ahmedabad
  { lat: 18.5204, lng: 73.8567 },  // Pune
  { lat: 26.8467, lng: 80.9462 },  // Lucknow
  { lat: 21.1702, lng: 72.8311 },  // Surat
  { lat: 25.3176, lng: 82.9739 },  // Varanasi (Banaras)
  { lat: 11.1271, lng: 78.6569 },  // Tamil Nadu (interior)
  { lat: 15.2993, lng: 74.1240 },  // Goa
  { lat: 8.5241, lng: 76.9366 },   // Thiruvananthapuram, Kerala
  { lat: 23.2599, lng: 77.4126 },  // Bhopal
  { lat: 21.2514, lng: 81.6296 },  // Raipur
  { lat: 20.9374, lng: 85.0900 },  // Bhubaneswar
  { lat: 34.0837, lng: 74.7973 },  // Srinagar, J&K
  { lat: 32.7266, lng: 74.8570 },  // Jammu
];

const suratCityLocations = [
  { lat: 21.1702, lng: 72.8311 },  // City Center
  { lat: 21.1959, lng: 72.8302 },  // Adajan
  { lat: 21.1644, lng: 72.7987 },  // Vesu
  { lat: 21.2047, lng: 72.8439 },  // Althan
  { lat: 21.1485, lng: 72.7978 },  // Pal
  { lat: 21.1802, lng: 72.7793 },  // Dumas Road
  { lat: 21.2090, lng: 72.8272 },  // Varachha
  { lat: 21.1597, lng: 72.8300 },  // Ghod Dod Road
  { lat: 21.1985, lng: 72.7962 },  // Piplod
  { lat: 21.2200, lng: 72.8467 },  // Surat Railway Station area
];

// ──────────────────────────────────────────────────────────────────────────────
// SEED FUNCTION
// ──────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding locations...");

  // Clear existing locations (idempotent seed)
  await prisma.location.deleteMany();

  const toInsert = [
    ...worldLocations.map((l) => ({ ...l, region: "WORLD" })),
    ...indiaLocations.map((l) => ({ ...l, region: "INDIA" })),
    ...suratCityLocations.map((l) => ({ ...l, region: "CITY_SURAT" })),
  ];

  await prisma.location.createMany({ data: toInsert });

  console.log(`✅ Seeded ${toInsert.length} locations.`);
  console.log(`   - WORLD:      ${worldLocations.length}`);
  console.log(`   - INDIA:      ${indiaLocations.length}`);
  console.log(`   - CITY_SURAT: ${suratCityLocations.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
