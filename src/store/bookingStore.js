import { create } from "zustand";
import { persist } from "zustand/middleware";

const useBookingStore = create(
  persist(
    (set) => ({
      selectedSeats: [],
      setSelectedSeats: (seats) => set({ selectedSeats: seats }),
      showtimeId: null,
      setShowtimeId: (id) => set({ showtimeId: id }),
      orderId: null,
      setOrderId: (id) => set({ orderId: id }),
      
      // ✅ Thêm hàm resetBooking
      resetBooking: () =>
        set({
          selectedSeats: [],
          showtimeId: null,
          orderId: null,
        }),
    }),
    {
      name: "booking-storage", // key trong localStorage
    }
  )
);

export default useBookingStore;
