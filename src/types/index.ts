export interface Route {
  id: string;
  name: string;
  origin: string;
  destination: string;
  baseFare: number;
  doorToDoorFare: number;
  doorToDoorEnabled: boolean;
  distanceKm: number | null;
  durationMin: number | null;
  active: boolean;
}

export interface Schedule {
  id: string;
  routeId: string;
  route: Route;
  departureTime: string;
  arrivalTime: string;
  vehicleCapacity: number;
  daysOfWeek: number[];
  direction: 'TO_SGR' | 'FROM_SGR';
  active: boolean;
  availableSeats?: number;
}

export interface Booking {
  id: string;
  ref: string;
  passengerName: string;
  phone: string;
  routeId: string;
  scheduleId: string;
  schedule: Schedule;
  direction: 'TO_SGR' | 'FROM_SGR';
  pickupLocation: string;
  dropLocation: string;
  seats: number;
  doorToDoor: boolean;
  baseFare: number;
  doorToDoorCharge: number;
  totalFare: number;
  travelDate: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  mpesaCheckoutId?: string;
  mpesaReceipt?: string;
}

export interface Vehicle {
  id: string;
  driverName: string;
  driverPhone?: string;
  plateNumber: string;
  capacity: number;
  type: string;
  active: boolean;
}

export interface Setting {
  id: string;
  key: string;
  value: string;
  label: string;
  description?: string;
  type: string;
}
