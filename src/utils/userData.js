// userData.js - Dữ liệu mẫu và API functions cho người dùng

export const sampleUsers = [
  {
    kh_id: 1,
    ho_ten: "Nguyễn Thị A",
    email: "user1@gmail.com",
    mat_khau: "user123",
    so_dien_thoai: "0901234567",
        avartar: "https://example.com/avatar2.jpg" // Thêm avatar cho người dùng thứ hai

  },
  {
    kh_id: 2,
    ho_ten: "Trần Văn B",
    email: "user2@gmail.com",
    mat_khau: "user456",
    so_dien_thoai: "0907654321",
    avartar: "https://example.com/avatar2.jpg" // Thêm avatar cho người dùng thứ hai
  },
  {
    kh_id: 3,
    ho_ten: "Lê Thị C",
    email: "user3@gmail.com",
    mat_khau: "user789",
    so_dien_thoai: "0933333333",
        avartar: "https://example.com/avatar2.jpg" // Thêm avatar cho người dùng thứ hai

  }
];

export const userData = {
  // Lấy tất cả người dùng
  getAllUsers: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(sampleUsers), 500);
    });
  },

  // Kiểm tra đăng nhập người dùng
  loginUser: async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = sampleUsers.find(
          u => u.email === email && u.mat_khau === password
        );

        if (!user) {
          reject(new Error("Email hoặc mật khẩu không đúng"));
          return;
        }

        // Trả về thông tin người dùng (ẩn mật khẩu)
        const { mat_khau, ...userInfo } = user;
        resolve(userInfo);
      }, 1000);
    });
  }
};
