import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import BookingForm from "../forms/BookingForm/BookingForm";
import { useSearchContext } from "../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BookingDetailsSummary from "../components/BookingDetailsSummary";
import { Elements } from "@stripe/react-stripe-js";
import { useAppContext } from "../contexts/AppContext";

const Booking = () => {
  const { stripePromise } = useAppContext();
  const search = useSearchContext();
  const { hotelId } = useParams();

  const [numberOfNights, setNumberOfNights] = useState<number>(0);

  useEffect(() => {
    if (search.checkIn && search.checkOut) {
      const nights =
        Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) /
        (1000 * 60 * 60 * 24);

      setNumberOfNights(Math.max(1, Math.ceil(nights))); // Ensure minimum 1 night
    }
  }, [search.checkIn, search.checkOut]);

  const { data: paymentIntentData } = useQuery(
    "createPaymentIntent",
    () =>
      apiClient.createPaymentIntent(
        hotelId as string,
        numberOfNights.toString()
      ),
    {
      enabled: !!hotelId && numberOfNights > 0,
    }
  );

  const { data: hotel } = useQuery(
    "fetchHotelByID",
    () => apiClient.fetchHotelById(hotelId as string),
    {
      enabled: !!hotelId,
    }
  );

  const { data: currentUser } = useQuery(
    "fetchCurrentUser",
    apiClient.fetchCurrentUser
  );

  // New availability check
  const { data: availabilityData, isLoading: isAvailabilityLoading } = useQuery(
    ["checkHotelAvailability", hotelId, search.checkIn, search.checkOut],
    () =>
      apiClient.checkHotelAvailability(
        hotelId as string,
        search.checkIn as Date,
        search.checkOut as Date,
        1 // Assuming 1 room for now, will be updated from GuestInfoForm
      ),
    {
      enabled: !!hotelId && !!search.checkIn && !!search.checkOut,
    }
  );

  if (!hotel || isAvailabilityLoading) {
    return <></>;
  }

  return (
    <div className="grid md:grid-cols-[1fr_2fr]">
      <BookingDetailsSummary
        checkIn={search.checkIn}
        checkOut={search.checkOut}
        numberOfNights={numberOfNights}
        hotel={hotel}
      />
      {currentUser && paymentIntentData && availabilityData?.isAvailable ? (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: paymentIntentData.clientSecret,
          }}
        >
          <BookingForm
            currentUser={currentUser}
            paymentIntent={paymentIntentData}
          />
        </Elements>
      ) : ( 
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Oops!</strong>
          <span className="block sm:inline"> {availabilityData?.message || "Hotel is not available for the selected dates."}</span>
        </div>
      )}
    </div>
  );
};

export default Booking;
