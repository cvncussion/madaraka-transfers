import axios from "axios";

const AT_API_KEY = process.env.AT_API_KEY || "";
const AT_USERNAME = process.env.AT_USERNAME || "sandbox";
const AT_SENDER_ID = process.env.AT_SENDER_ID || "MADARAKA";

export async function sendSMS(to: string, message: string): Promise<any> {
  try {
    const response = await axios.post(
      "https://api.africastalking.com/version1/messaging",
      new URLSearchParams({
        username: AT_USERNAME,
        to: to,
        message: message,
        from: AT_SENDER_ID,
      }),
      {
        headers: {
          apiKey: AT_API_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("SMS error:", error.response?.data || error.message);
    return null;
  }
}

export function buildConfirmationSMS(
  ref: string,
  routeName: string,
  direction: string,
  departureTime: string,
  travelDate: string,
  seats: number,
  totalFare: number,
  pickupLocation: string,
  dropLocation: string,
  businessPhone: string
): string {
  const dirText = direction === "TO_SGR" ? "to" : "from";
  return `Madaraka Transfers\nBooking: ${ref}\n${routeName} ${dirText} SGR\nDate: ${travelDate}\nTime: ${departureTime}\nSeats: ${seats}\nPickup: ${pickupLocation}\nDrop: ${dropLocation}\nPaid: KES ${totalFare}\nQuestions? ${businessPhone}`;
}
