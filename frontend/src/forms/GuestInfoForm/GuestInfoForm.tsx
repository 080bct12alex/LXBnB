import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { useSearchContext } from "../../contexts/SearchContext";
import { useAppContext } from "../../contexts/AppContext";
import { useLocation, useNavigate } from "react-router-dom";
import { AvailabilityResponse } from "../../api-client";

type Props = {
  hotelId: string;
  pricePerNight: number;
  availabilityData?: AvailabilityResponse;
};

type GuestInfoFormData = {
  checkIn: Date;
  checkOut: Date;
  rooms: number;
};

const GuestInfoForm = ({ hotelId, pricePerNight, availabilityData }: Props) => {
  const search = useSearchContext();
  const { isLoggedIn } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    watch,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<GuestInfoFormData>({
    defaultValues: {
      checkIn: search.checkIn,
      checkOut: search.checkOut,
      rooms: 1,
    },
  });

  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");
  const rooms = watch("rooms");

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  const onSignInClick = (data: GuestInfoFormData) => {
    search.saveSearchValues(
      "",
      data.checkIn,
      data.checkOut,
      data.rooms,
      hotelId
    );
    navigate("/sign-in", { state: { from: location } });
  };

  const onSubmit = (data: GuestInfoFormData) => {
    search.saveSearchValues(
      "",
      data.checkIn,
      data.checkOut,
      data.rooms,
      hotelId
    );
    navigate(`/hotel/${hotelId}/booking`);
  };

  const isBookButtonDisabled = availabilityData && (
    !availabilityData.isAvailable || rooms > availabilityData.remainingRooms
  );

  return (
    <div className="flex flex-col p-4 bg-blue-200 gap-4">
      <h3 className="text-md font-bold">£{pricePerNight}</h3>
      <form
        onSubmit={
          isLoggedIn ? handleSubmit(onSubmit) : handleSubmit(onSignInClick)
        }
      >
        <div className="grid grid-cols-1 gap-4 items-center">
          <div>
            <DatePicker
              required
              selected={checkIn}
              onChange={(date) => {
                setValue("checkIn", date as Date);
                if (checkOut && date && checkOut.getTime() === date.getTime()) {
                  const nextDay = new Date(date);
                  nextDay.setDate(date.getDate() + 1);
                  setValue("checkOut", nextDay);
                }
              }}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              minDate={minDate}
              maxDate={maxDate}
              placeholderText="Check-in Date"
              className="min-w-full bg-white p-2 focus:outline-none"
              wrapperClassName="min-w-full"
            />
          </div>
          <div>
            <DatePicker
              required
              selected={checkOut}
              onChange={(date) => setValue("checkOut", date as Date)}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              minDate={minDate}
              maxDate={maxDate}
              placeholderText="Check-out Date"
              className="min-w-full bg-white p-2 focus:outline-none"
              wrapperClassName="min-w-full"
            />
          </div>
          <div className="flex bg-white px-2 py-1 gap-2">
            <label className="items-center flex">
              Rooms:
              <input
                className="w-full p-1 focus:outline-none font-bold"
                type="number"
                min={1}
                max={20}
                {...register("rooms", {
                  required: "This field is required",
                  min: {
                    value: 1,
                    message: "There must be at least one room",
                  },
                  valueAsNumber: true,
                })}
              />
            </label>
            {errors.rooms && (
              <span className="text-red-500 font-semibold text-sm">
                {errors.rooms.message}
              </span>
            )}
          </div>
          {availabilityData && (
            <div className="text-md font-bold">
              Rooms available: {availabilityData.remainingRooms}
            </div>
          )}
          {isLoggedIn ? (
            <button
              disabled={isBookButtonDisabled}
              className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl disabled:bg-gray-500"
            >
              Book Now
            </button>
          ) : (
            <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl">
              Sign in to Book
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default GuestInfoForm;
