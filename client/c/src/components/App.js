import React, { useState, useEffect } from "react";
import "../styles/App.css";
import "../styles/bootstrap.min.css";
import { movies, slots, seats } from "./data";

const App = () => {
  // State variables
  const [selectedMovie, setSelectedMovie] = useState(
    localStorage.getItem("selectedMovie") || null
  );
  const [selectedSlot, setSelectedSlot] = useState(
    localStorage.getItem("selectedSlot") || null
  );
  const [selectedSeats, setSelectedSeats] = useState(
    JSON.parse(localStorage.getItem("selectedSeats")) || []
  );
  const [totalSeat, setTotalSeat] = useState({
    A1: 0,
    A2: 0,
    A3: 0,
    A4: 0,
    D1: 0,
    D2: 0,
  });
  const [bookingData, setBookingData] = useState({
    movie: "",
    slot: "",
    seats: {
      A1: 0,
      A2: 0,
      A3: 0,
      A4: 0,
      D1: 0,
      D2: 0,
    },
  });

  // useEffect to handle initial setup and retrieval of previous booking data
  useEffect(() => {
    const lastBookingData = JSON.parse(localStorage.getItem("lastBookingData"));
    if (lastBookingData) {
      setBookingData(lastBookingData);
    } else {
      setSelectedMovie(localStorage.getItem("selectedMovie") || null);
      setSelectedSlot(localStorage.getItem("selectedSlot") || null);
      setSelectedSeats(JSON.parse(localStorage.getItem("selectedSeats")) || []);
    }
  }, []);
  
   // Event handler for movie selection
  const handleMovieSelect = (movie) => {
    setSelectedMovie((prevMovie) => (prevMovie === movie ? null : movie));
    localStorage.setItem("selectedMovie", selectedMovie === movie ? null : movie);
  };

   // Event handler for slot selection
  const handleSlotSelect = (slot) => {
    setSelectedSlot((prevSlot) => (prevSlot === slot ? null : slot));
    localStorage.setItem("selectedSlot", selectedSlot === slot ? null : slot);
  };

   // Event handler for seat selection
  const handleSeatSelect = (seat, quantity) => {
    const existingSeatIndex = selectedSeats.findIndex(
      (selectedSeat) => selectedSeat.seat === seat
    );

    if (existingSeatIndex === -1) {
      setSelectedSeats([...selectedSeats, { seat, quantity }]);
    } else {
      const updatedSeats = selectedSeats.map((selectedSeat) =>
        selectedSeat.seat === seat ? { ...selectedSeat, quantity } : selectedSeat
      );
      setSelectedSeats(updatedSeats);
    }

    localStorage.setItem(
      "selectedSeats",
      JSON.stringify([...selectedSeats, { seat, quantity }])
    );
  };
  
   // Event handler for booking
  const handleBookNow = async () => {
    try {
    
      if (selectedMovie && selectedSlot && selectedSeats.length > 0) {
        // Calculate updated total seats
        const updatedTotalSeat = { A1: 0, A2: 0, A3: 0, A4: 0, D1: 0, D2: 0 };

        selectedSeats.forEach(({ seat, quantity }) => {
          const seatType = seat.toUpperCase();
          updatedTotalSeat[seatType] += quantity;
        });
      
         // Prepare booking data
        const bookingData = {
          movie: selectedMovie,
          slot: selectedSlot,
          seats: updatedTotalSeat,
        };

        // Send booking data to the server
        const response = await fetch("https://bookshow-n99d.onrender.com/api/booking", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        });
      
           // Process the server response
        if (response.ok) {
          // Retrieve the last booking data from the server
          const lastBookingResponse = await fetch("https://bookshow-n99d.onrender.com/api/booking");
          const lastBookingData = await lastBookingResponse.json();

          // Update state with the last booking data
          setBookingData(lastBookingData);

          localStorage.setItem("lastBookingData", JSON.stringify(lastBookingData));
          
          // Reset selected seats and total seats
          setSelectedSeats([]);
          setTotalSeat({
            A1: 0,
            A2: 0,
            A3: 0,
            A4: 0,
            D1: 0,
            D2: 0,
          });

          // Reset selected movie and slot
          setSelectedMovie(null);
          setSelectedSlot(null);

           // Clear local storage for selected data
          localStorage.setItem("selectedMovie", null);
          localStorage.setItem("selectedSlot", null);
          localStorage.setItem("selectedSeats", JSON.stringify([]));
          alert("Booking Success"); // Show success alert
        } else {
         
          alert("Booking failed");  // Show failure alert
        }
      } else {
        alert("Please select a movie, slot, and at least one seat."); // Show alert for missing selection
      }
    } catch (error) {
       // Log and show error alert
      console.error("An error occurred while booking:", error);
      
      alert("Booking failed.Error: ${error.message}.");
    }
  };

  return (
    <>
      <div className="container">
        <h2 className="mt-5 mb-3">Book Your Show Now!!</h2>
        <div className="d-flex justify-content-between mflex">
          <div className="">
            <div className="movie-row">
              <h3>Select A movie</h3>
                {/* Render movie buttons */}
              {movies.map((data, i) => (
                <button
                  key={i}
                  className={`movie-column ${
                    selectedMovie === data ? "movie-column-selected" : ""
                  }`}
                  onClick={() => handleMovieSelect(data)}
                >
                  <h6>{data} </h6>
                </button>
              ))}
            </div>
            <div className="slot-row">
              <h3>Select a Time slot</h3>
                {/* Render slot buttons */}
              {slots.map((data, i) => (
                <button
                  key={i}
                  className={`slot-column ${
                    selectedSlot === data ? "slot-column-selected" : ""
                  }`}
                  onClick={() => handleSlotSelect(data)}
                >
                  <h6>{data}</h6>
                </button>
              ))}
            </div>
            <div className="seat-row">
              <h3>Select the seats</h3>
              {/* Render seat buttons with quantity input */}
              {seats.map((data, i) => (
                <button
                  key={i}
                  className={`seat-column ${
                    selectedSeats.some((selectedSeat) => selectedSeat.seat === data)
                      ? "seat-column-selected"
                      : ""
                  }`}
                  
                onClick={(e) => handleSeatSelect(data, parseInt(e.target.value))}
                >
                  <h6> Type {data} </h6>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    onChange={(e) => handleSeatSelect(data, parseInt(e.target.value))}
                  />
                </button>
              ))}
            </div>
            
            {/* Button to trigger the booking process */}
            <button onClick={handleBookNow} className="book-button mt-3 blue-button">
             Book Now
            </button>
          </div>

               {/* Display last booking details */}
          <div className="last-order booking">
            {bookingData.movie ? (
              <div className="">
                <h5>Last Booking Details</h5>
                  {/* Display last booking information */}
                <p>
                  <strong>seats:-</strong>
                </p>

                <p>
                  <strong>A1:</strong>
                  {bookingData.seats.A1}
                </p>
                <p>
                  <strong>A2:</strong>
                  {bookingData.seats.A2}
                </p>
                <p>
                  <strong>A3:</strong>
                  {bookingData.seats.A3}
                </p>
                <p>
                  <strong>A4:</strong>
                  {bookingData.seats.A4}
                </p>
                <p>
                  <strong>D1:</strong>
                  {bookingData.seats.D1}
                </p>
                <p>
                  <strong>D2:</strong>
                  {bookingData.seats.D2}
                </p>
                <p>
                  <strong>slot:</strong>
                  {bookingData.slot}
                </p>
                <p>
                  <strong>movie:</strong>
                  {bookingData.movie}
                </p>
              </div>
            ) : (
               // Display message when no previous booking is found
              <h4>No previous booking found</h4>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;



