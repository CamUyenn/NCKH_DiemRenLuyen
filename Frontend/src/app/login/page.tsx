'use client';
import React from 'react';
import './login.css';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  return (
    <div>
      <div className="background-image">
        <img src="image_Truong.jpg" alt="" />
      </div>
      <div className="logo_Truong">
        <img src="Logo_Truong.png" alt="" />
      </div>
      <div className="login-container">
        <h2 className='login-title'>ĐĂNG NHẬP</h2>
        <div className="login-logo">
          <img src="Logo.png" alt="" />
        </div>
        <LoginForm />
      </div>
      <footer className="footer-login">
        <div className="footer-content">
          <p>&copy; 2025 Trường Đại học Khoa học Huế</p>
          <p>Địa chỉ: 77 Nguyễn Huệ, TP. Huế, Việt Nam</p>
          <p>
            Email: support@husc.edu.vn | Điện thoại: (+84) 234 3823290
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;