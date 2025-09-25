import { useQuery } from "react-query";
import * as apiClient from "../api-client";

const MyHotelBookings = () => {
  const { data: hotelBookings, isLoading } = useQuery(
    "fetchMyHotelBookings",
    apiClient.fetchMyHotelBookings
  );

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (!hotelBookings || hotelBookings.length === 0) {
    return <span>No bookings found for your hotels</span>;
  }

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">My Hotel Bookings</h1>
      {hotelBookings.map((booking) => (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr_1fr] border border-slate-300 rounded-lg p-8 gap-5">
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px]">
            <div className="text-2xl font-bold">
              {booking.hotelName}
            </div>
            <div>
              <span className="font-bold mr-2">Dates:</span>
              <span>
                {new Date(booking.checkIn).toDateString()} -{" "}
                {new Date(booking.checkOut).toDateString()}
              </span>
            </div>
            <div>
              <span className="font-bold mr-2">Rooms:</span>
              <span>
                {booking.roomsBooked} rooms
              </span>
            </div>
            <div>
              <span className="font-bold mr-2">Total Cost:</span>
              <span>${booking.totalCost}</span>
            </div>
            <div>
              <span className="font-bold mr-2">Booked By:</span>
              <span>
                {booking.firstName} {booking.lastName} ({booking.email})
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyHotelBookings;
