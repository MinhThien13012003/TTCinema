// adminData.js - Dữ liệu mẫu và API functions cho Admin

// Dữ liệu mẫu cho admin
export const sampleAdmins = [
  {
    admin_id: 1,
    ho_ten: "Nguyễn Văn An",
    email: "admin1@gmail.com",
    mat_khau: "123456",
    created_at: "2024-01-15"
  },
  {
    admin_id: 2,
    ho_ten: "Trần Thị Bình",
    email: "admin2@movieticket.com", 
    mat_khau: "admin456",
    created_at: "2024-02-20"
  },
  {
    admin_id: 3,
    ho_ten: "Lê Hoàng Công",
    email: "admin3@movieticket.com",
    mat_khau: "admin789",
    created_at: "2024-03-10"
  }
];

// API functions để thao tác với admin data
export const adminData = {
  // Lấy tất cả admin
  getAllAdmins: async () => {
    // Simulation API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(sampleAdmins);
      }, 500);
    });
  },

  // Thêm admin mới
  createAdmin: async (adminData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!adminData.ho_ten || !adminData.email || !adminData.mat_khau) {
          reject(new Error("Vui lòng điền đầy đủ thông tin"));
          return;
        }
        
        const newAdmin = {
          admin_id: Date.now(),
          ...adminData,
          created_at: new Date().toISOString().split('T')[0]
        };
        
        sampleAdmins.push(newAdmin);
        resolve(newAdmin);
      }, 500);
    });
  },

  // Cập nhật thông tin admin
  updateAdmin: async (adminId, adminData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = sampleAdmins.findIndex(admin => admin.admin_id === adminId);
        if (index === -1) {
          reject(new Error("Không tìm thấy admin"));
          return;
        }

        sampleAdmins[index] = { ...sampleAdmins[index], ...adminData };
        resolve(sampleAdmins[index]);
      }, 500);
    });
  },

  // Xóa admin
  deleteAdmin: async (adminId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = sampleAdmins.findIndex(admin => admin.admin_id === adminId);
        if (index === -1) {
          reject(new Error("Không tìm thấy admin"));
          return;
        }

        sampleAdmins.splice(index, 1);
        resolve(true);
      }, 500);
    });
  },

  // Tìm admin theo ID
  getAdminById: async (adminId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const admin = sampleAdmins.find(admin => admin.admin_id === adminId);
        if (!admin) {
          reject(new Error("Không tìm thấy admin"));
          return;
        }
        resolve(admin);
      }, 500);
    });
  },

  // Kiểm tra đăng nhập admin
  loginAdmin: async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const admin = sampleAdmins.find(
          admin => admin.email === email && admin.mat_khau === password
        );
        
        if (!admin) {
          reject(new Error("Email hoặc mật khẩu không đúng"));
          return;
        }

        // Trả về thông tin admin (không bao gồm mật khẩu)
        const { mat_khau, ...adminInfo } = admin;
        resolve(adminInfo);
      }, 1000);
    });
  },

  // Thay đổi mật khẩu
  changePassword: async (adminId, oldPassword, newPassword) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const admin = sampleAdmins.find(admin => admin.admin_id === adminId);
        
        if (!admin) {
          reject(new Error("Không tìm thấy admin"));
          return;
        }

        if (admin.mat_khau !== oldPassword) {
          reject(new Error("Mật khẩu cũ không đúng"));
          return;
        }

        admin.mat_khau = newPassword;
        resolve(true);
      }, 500);
    });
  }
};

// Validation functions
export const validateAdmin = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  password: (password) => {
    return password && password.length >= 6;
  },

  name: (name) => {
    return name && name.trim().length >= 2;
  }
};

// Constants
export const ADMIN_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
};

export const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MODERATOR: 'moderator'
};