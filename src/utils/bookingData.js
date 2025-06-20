// bookingData.js
const bookingData = [
  {
    booking_id: 1,
    suat_id: 1,
    ghe_id: 1, // A1
    khach_hang_id: 2001,
    ngay_dat: "2025-06-17",
    gio_dat: "14:30:00",
    trang_thai: "confirmed",
    gia_ve: 80000
  },
  {
    booking_id: 2,
    suat_id: 1,
    ghe_id: 2, // A2
    khach_hang_id: 2001,
    ngay_dat: "2025-06-17",
    gio_dat: "14:30:00",
    trang_thai: "confirmed",
    gia_ve: 80000
  },
  {
    booking_id: 3,
    suat_id: 3,
    ghe_id: 45, // E1 (VIP trong phòng 2)
    khach_hang_id: 2002,
    ngay_dat: "2025-06-18",
    gio_dat: "10:15:00",
    trang_thai: "confirmed",
    gia_ve: 210000 // 90000 + 120000
  }
];

export default bookingData;