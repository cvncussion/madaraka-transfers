import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generateManifestPDF(
  schedule: any,
  bookings: any[],
  vehicle: any
): jsPDF {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("MADARAKA TRANSFERS", 105, 15, { align: "center" });
  doc.setFontSize(12);
  doc.text("Driver Manifest", 105, 23, { align: "center" });

  doc.setFontSize(10);
  const infoLines = [
    `Route: ${schedule.route.origin} → ${schedule.route.destination}`,
    `Date: ${new Date().toLocaleDateString("en-KE")}`,
    `Departure: ${schedule.departureTime}`,
    `Vehicle: ${vehicle?.plateNumber || "N/A"} (${vehicle?.driverName || "N/A"})`,
    `Capacity: ${schedule.vehicleCapacity} seats`,
    `Bookings: ${bookings.length} passengers`,
  ];

  infoLines.forEach((line, i) => {
    doc.text(line, 14, 35 + i * 6);
  });

  const tableData = bookings.map((b, i) => [
    (i + 1).toString(),
    b.passengerName,
    b.phone,
    b.seats.toString(),
    b.pickupLocation,
    b.dropLocation,
    b.doorToDoor ? "Yes" : "No",
    `KES ${b.totalFare}`,
  ]);

  autoTable(doc, {
    startY: 75,
    head: [["#", "Passenger", "Phone", "Seats", "Pickup", "Drop", "D2D", "Fare"]],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [0, 166, 80] },
    styles: { fontSize: 9 },
  });

  const finalY = (doc as any).lastAutoTable?.finalY || 150;
  doc.setFontSize(10);
  const totalSeats = bookings.reduce((sum, b) => sum + b.seats, 0);
  const totalFare = bookings.reduce((sum, b) => sum + b.totalFare, 0);
  doc.text(`Total Seats: ${totalSeats} / ${schedule.vehicleCapacity}`, 14, finalY + 10);
  doc.text(`Total Revenue: KES ${totalFare}`, 14, finalY + 16);

  return doc;
}
