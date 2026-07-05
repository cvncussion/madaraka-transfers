import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed routes for coastal towns
  const routes = [
    { name: 'Mombasa Town → SGR', origin: 'Mombasa CBD', destination: 'Miritini SGR Station', baseFare: 200, doorToDoorFare: 150, doorToDoorEnabled: true, distanceKm: 12, durationMin: 30 },
    { name: 'Nyali → SGR', origin: 'Nyali', destination: 'Miritini SGR Station', baseFare: 250, doorToDoorFare: 150, doorToDoorEnabled: true, distanceKm: 18, durationMin: 35 },
    { name: 'Bamburi → SGR', origin: 'Bamburi', destination: 'Miritini SGR Station', baseFare: 300, doorToDoorFare: 150, doorToDoorEnabled: true, distanceKm: 22, durationMin: 40 },
    { name: 'Shanzu → SGR', origin: 'Shanzu', destination: 'Miritini SGR Station', baseFare: 350, doorToDoorFare: 150, doorToDoorEnabled: true, distanceKm: 28, durationMin: 45 },
    { name: 'Mtwapa → SGR', origin: 'Mtwapa', destination: 'Miritini SGR Station', baseFare: 400, doorToDoorFare: 150, doorToDoorEnabled: true, distanceKm: 32, durationMin: 50 },
    { name: 'Kilifi → SGR', origin: 'Kilifi', destination: 'Miritini SGR Station', baseFare: 500, doorToDoorFare: 150, doorToDoorEnabled: true, distanceKm: 50, durationMin: 70 },
    { name: 'Malindi → SGR', origin: 'Malindi', destination: 'Miritini SGR Station', baseFare: 800, doorToDoorFare: 150, doorToDoorEnabled: true, distanceKm: 120, durationMin: 150 },
    { name: 'Diani → SGR', origin: 'Diani', destination: 'Miritini SGR Station', baseFare: 600, doorToDoorFare: 150, doorToDoorEnabled: true, distanceKm: 45, durationMin: 65 },
    { name: 'Ukunda → SGR', origin: 'Ukunda', destination: 'Miritini SGR Station', baseFare: 550, doorToDoorFare: 150, doorToDoorEnabled: true, distanceKm: 40, durationMin: 60 },
    { name: 'Likoni → SGR', origin: 'Likoni', destination: 'Miritini SGR Station', baseFare: 250, doorToDoorFare: 150, doorToDoorEnabled: true, distanceKm: 15, durationMin: 25 },
    { name: 'Changamwe → SGR', origin: 'Changamwe', destination: 'Miritini SGR Station', baseFare: 150, doorToDoorFare: 150, doorToDoorEnabled: true, distanceKm: 8, durationMin: 15 },
    { name: 'Mariakani → SGR', origin: 'Mariakani', destination: 'Miritini SGR Station', baseFare: 350, doorToDoorFare: 150, doorToDoorEnabled: true, distanceKm: 35, durationMin: 40 },
    { name: 'Voi → SGR', origin: 'Voi', destination: 'Miritini SGR Station', baseFare: 1000, doorToDoorFare: 150, doorToDoorEnabled: true, distanceKm: 180, durationMin: 200 },
    { name: 'Taveta → SGR', origin: 'Taveta', destination: 'Miritini SGR Station', baseFare: 1200, doorToDoorFare: 150, doorToDoorEnabled: true, distanceKm: 220, durationMin: 240 },
    { name: 'Wundanyi → SGR', origin: 'Wundanyi', destination: 'Miritini SGR Station', baseFare: 1100, doorToDoorFare: 150, doorToDoorEnabled: true, distanceKm: 200, durationMin: 220 },
    { name: 'SGR → Mombasa Town', origin: 'Miritini SGR Station', destination: 'Mombasa CBD', baseFare: 200, doorToDoorFare: 150, doorToDoorEnabled: true, distanceKm: 12, durationMin: 30 },
    { name: 'SGR → Nyali', origin: 'Miritini SGR Station', destination: 'Nyali', baseFare: 250, doorToDoorFare: 150, doorToDoorEnabled: true, distanceKm: 18, durationMin: 35 },
    { name: 'SGR → Bamburi', origin: 'Miritini SGR Station', destination: 'Bamburi', baseFare: 300, doorToDoorFare: 150, doorToDoorEnabled: true, distanceKm: 22, durationMin: 40 },
    { name: 'SGR → Diani', origin: 'Miritini SGR Station', destination: 'Diani', baseFare: 600, doorToDoorFare: 150, doorToDoorEnabled: true, distanceKm: 45, durationMin: 65 },
  ];

  for (const route of routes) {
    await prisma.route.upsert({
      where: { name: route.name },
      update: {},
      create: route,
    });
  }

  // Seed schedules
  const allRoutes = await prisma.route.findMany();
  const capacities = [7, 11, 14, 16, 28, 32];

  for (const route of allRoutes) {
    const numSchedules = 3;
    for (let i = 0; i < numSchedules; i++) {
      const hour = 6 + i * 3;
      const depHour = hour.toString().padStart(2, '0');
      const arrHour = (hour + 1).toString().padStart(2, '0');

      await prisma.schedule.create({
        data: {
          routeId: route.id,
          departureTime: `${depHour}:00`,
          arrivalTime: `${arrHour}:00`,
          vehicleCapacity: capacities[Math.floor(Math.random() * capacities.length)],
          daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
          direction: route.destination === 'Miritini SGR Station' ? 'TO_SGR' : 'FROM_SGR',
          active: true,
        },
      });
    }
  }

  // Seed vehicles
  const vehicles = [
    { driverName: 'John Mwangi', driverPhone: '0712345678', plateNumber: 'KCB 123A', capacity: 14, type: 'shuttle' },
    { driverName: 'Ali Hassan', driverPhone: '0723456789', plateNumber: 'KDA 456B', capacity: 11, type: 'van' },
    { driverName: 'Peter Ochieng', driverPhone: '0734567890', plateNumber: 'KBY 789C', capacity: 28, type: 'bus' },
    { driverName: 'Sarah Kimani', driverPhone: '0745678901', plateNumber: 'KDE 012D', capacity: 16, type: 'shuttle' },
    { driverName: 'James Odhiambo', driverPhone: '0756789012', plateNumber: 'KCF 345E', capacity: 32, type: 'bus' },
    { driverName: 'Grace Wanjiku', driverPhone: '0767890123', plateNumber: 'KDG 678F', capacity: 7, type: 'van' },
  ];

  for (const vehicle of vehicles) {
    await prisma.vehicle.upsert({
      where: { plateNumber: vehicle.plateNumber },
      update: {},
      create: vehicle,
    });
  }

  // Seed settings
  const settings = [
    { key: 'business_name', value: 'Madaraka Transfers', label: 'Business Name', type: 'text' },
    { key: 'business_phone', value: '+254712345678', label: 'Business Phone', type: 'text' },
    { key: 'business_email', value: 'info@madarakatransfers.com', label: 'Business Email', type: 'text' },
    { key: 'mpesa_enabled', value: 'true', label: 'M-Pesa Enabled', type: 'boolean' },
    { key: 'sms_enabled', value: 'true', label: 'SMS Enabled', type: 'boolean' },
    { key: 'night_surcharge', value: '100', label: 'Night Surcharge (KES)', type: 'number' },
    { key: 'night_start', value: '22:00', label: 'Night Hours Start', type: 'text' },
    { key: 'night_end', value: '06:00', label: 'Night Hours End', type: 'text' },
    { key: 'booking_cutoff_minutes', value: '30', label: 'Booking Cutoff (minutes before)', type: 'number' },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
