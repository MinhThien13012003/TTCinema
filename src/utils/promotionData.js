const promotionData =[
    
  {
    "promo_id": 1,
    "promo_name": "Giảm 50% Thứ Tư",
    "description": "Giảm 50% giá vé khi đặt vào thứ Tư hàng tuần.",
    "discount_percentage": 50,
    "start_date": "2025-06-05",
    "end_date": "2025-12-31",
    "applicable_days": ["Wednesday"],
    "min_purchase": 1,
    "max_discount": 100000,
    "promo_code": "WED50",
    'image': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEaVSxdbkrmLs_vqc1K7qv0PlMpZzlkHXXjg&s'
  },
  {
    "promo_id": 2,
    "promo_name": "Combo Cặp Đôi",
    "description": "Giảm 20% khi mua vé cho 2 người kèm combo bắp nước.",
    "discount_percentage": 20,
    "start_date": "2025-06-05",
    "end_date": "2025-08-31",
    "applicable_days": ["Friday", "Saturday", "Sunday"],
    "min_purchase": 2,
    "max_discount": 50000,
    "promo_code": "LOVE20"
  },
  {
    "promo_id": 3,
    "promo_name": "Sinh Nhật Vui Vẻ",
    "description": "Giảm 30% cho khách hàng sinh nhật trong tháng.",
    "discount_percentage": 30,
    "start_date": "2025-06-01",
    "end_date": "2025-06-30",
    "applicable_days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    "min_purchase": 1,
    "max_discount": 75000,
    "promo_code": "BDAY30"
  }
]
export default promotionData;