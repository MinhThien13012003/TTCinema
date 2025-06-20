// seatData.js
const seatData = [];
let ghe_id_counter = 1;

// Tạo ghế cho Phòng 1 (phong_id: 1)
const createSeatsForRoom1 = () => {
  const phong_id = 1;
  
  // Ghế thường - hàng A & B (20 ghế)
  ['A', 'B'].forEach(hang => {
    for (let i = 1; i <= 10; i++) {
      seatData.push({
        ghe_id: ghe_id_counter++,
        so_ghe: `${hang}${i}`,
        hang: hang,
        phong_id: phong_id,
        loai_ghe_id: 1,
        loai: 'Thuong',
        trang_thai: 'available' // available, booked, selected
      });
    }
  });

  // Ghế VIP - hàng C & D (10 ghế)
  ['C', 'D'].forEach(hang => {
    for (let i = 3; i <= 7; i++) {
      seatData.push({
        ghe_id: ghe_id_counter++,
        so_ghe: `${hang}${i}`,
        hang: hang,
        phong_id: phong_id,
        loai_ghe_id: 2,
        loai: 'VIP',
        trang_thai: 'available'
      });
    }
  });

  // Ghế Sweetbox - hàng E (4 ghế)
  ['E'].forEach(hang => {
    for (let i = 1; i <= 4; i++) {
      seatData.push({
        ghe_id: ghe_id_counter++,
        so_ghe: `${hang}${i}`,
        hang: hang,
        phong_id: phong_id,
        loai_ghe_id: 3,
        loai: 'Sweetbox',
        trang_thai: 'available'
      });
    }
  });
};

// Tạo ghế cho Phòng 2 (phong_id: 2) - 80 ghế
const createSeatsForRoom2 = () => {
  const phong_id = 2;
  
  // Ghế thường - hàng A, B, C, D (40 ghế)
  ['A', 'B', 'C', 'D'].forEach(hang => {
    for (let i = 1; i <= 10; i++) {
      seatData.push({
        ghe_id: ghe_id_counter++,
        so_ghe: `${hang}${i}`,
        hang: hang,
        phong_id: phong_id,
        loai_ghe_id: 1,
        loai: 'Thuong',
        trang_thai: 'available'
      });
    }
  });

  // Ghế VIP - hàng E, F (20 ghế)
  ['E', 'F'].forEach(hang => {
    for (let i = 1; i <= 10; i++) {
      seatData.push({
        ghe_id: ghe_id_counter++,
        so_ghe: `${hang}${i}`,
        hang: hang,
        phong_id: phong_id,
        loai_ghe_id: 2,
        loai: 'VIP',
        trang_thai: 'available'
      });
    }
  });

  // Ghế Sweetbox - hàng G, H (20 ghế)
  ['H'].forEach(hang => {
    for (let i = 1; i <= 7; i++) {
      seatData.push({
        ghe_id: ghe_id_counter++,
        so_ghe: `${hang}${i}`,
        hang: hang,
        phong_id: phong_id,
        loai_ghe_id: 3,
        loai: 'Sweetbox',
        trang_thai: 'available'
      });
    }
  });
};

// Tạo ghế cho cả 2 phòng
createSeatsForRoom1(); // 34 ghế
createSeatsForRoom2(); // 80 ghế

export default seatData;