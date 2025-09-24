import { FormEvent, useState } from "react";
import { useSearchContext } from "../contexts/SearchContext";
import { MdTravelExplore } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const navigate = useNavigate();
  const search = useSearchContext();

  const [destination, setDestination] = useState<string>(search.destination);
  const [checkIn, setCheckIn] = useState<Date>(search.checkIn);
  const [checkOut, setCheckOut] = useState<Date>(search.checkOut);
  const [adultCount, setAdultCount] = useState<number>(search.adultCount);
  const [childCount, setChildCount] = useState<number>(search.childCount);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    search.saveSearchValues(
      destination,
      checkIn,
      checkOut,
      adultCount,
      childCount
    );
    navigate("/search");
  };
  
  const handleClear = () => {
    setDestination("");
    setCheckIn(new Date());
    setCheckOut(new Date());
    setAdultCount(1);
    setChildCount(0);
  };

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  return (
    <form 
      onSubmit={handleSubmit}
      className="-mt-8 p-4 bg-white rounded-lg shadow-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 items-center gap-4"
    >
      <div className="flex items-center bg-gray-100 p-2 rounded-lg col-span-1 sm:col-span-2 lg:col-span-1">
        <MdTravelExplore size={25} className="mr-2 text-gray-500" />
        <input
          placeholder="Where are you going?"
          className="text-md w-full focus:outline-none bg-transparent"
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
        />
      </div>

      <div className="flex items-center bg-gray-100 p-2 rounded-lg col-span-1">
        <label className="items-center flex w-1/2">
          Adults:
          <input
            className="w-full p-1 focus:outline-none font-bold bg-transparent"
            type="number"
            min={1}
            max={20}
            value={adultCount}
            onChange={(event) => setAdultCount(parseInt(event.target.value))}
          />
        </label>
        <label className="items-center flex w-1/2">
          Children:
          <input
            className="w-full p-1 focus:outline-none font-bold bg-transparent"
            type="number"
            min={0}
            max={20}
            value={childCount}
            onChange={(event) => setChildCount(parseInt(event.target.value))}
          />
        </label>
      </div>
      <div className="col-span-1 sm:col-span-2 lg:col-span-1">
        <DatePicker
          selected={checkIn}
          onChange={(dates) => {
            const [start, end] = dates as [Date, Date];
            setCheckIn(start);
            setCheckOut(end);
          }}
          selectsRange
          startDate={checkIn}
          endDate={checkOut}
          minDate={minDate}
          maxDate={maxDate}
          placeholderText="Check-in - Check-out"
          className="w-full bg-gray-100 p-2 focus:outline-none rounded-lg"
          wrapperClassName="w-full"
        />
      </div>
      <div className="flex gap-2 col-span-1">
        <button className="w-1/2 bg-secondary text-white h-full p-2 font-bold text-xl rounded-lg hover:bg-opacity-90 transition-colors duration-300">
          Search
        </button>
        <button type="button" onClick={handleClear} className="w-1/2 bg-red-600 text-white h-full p-2 font-bold text-xl rounded-lg hover:bg-opacity-90 transition-colors duration-300">
          Clear
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
