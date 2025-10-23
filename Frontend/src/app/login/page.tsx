'use client';
import React from 'react';
import './login.css';
import LoginForm from '../components/LoginForm'; // chỉnh đường dẫn nếu cần

const LoginPage = () => {
  return (
    <div className="page-wrapper">
      <div className="background-image" />
      <div className="background-overlay" />

      {/* Logo trường lớn bên trái */}
      <img className="logo-Truong-left" src="/Logo_Truong.png" alt="Logo Trường" />

      <div className="center-wrap">
        <div className="login-container" role="region" aria-label="login-box">
          {/* logo tròn phía trên (chồng lên form) */}
          <div className="logo-top">
            <img src="/Logo.png" alt="Logo nhỏ" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>

          <h2 className="login-title">ĐĂNG NHẬP</h2>

          {/* Form fields */}
          <LoginForm />
        </div>
      </div>

      <footer className="footer-login">
        <div className="footer-content">
          <div>© 2025 Trường Đại học Khoa học Huế</div>
          <div>Địa chỉ: 77 Nguyễn Huệ, TP. Huế, Việt Nam</div>
          <div>Email: support@husc.edu.vn | Điện thoại: (+84) 234 3823290</div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
