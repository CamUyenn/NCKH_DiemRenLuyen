import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginForm = () => {
  const router = useRouter();
  const [role, setRole] = useState<'sinhvien' | 'giangvien'>('sinhvien');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'sinhvien') {
      window.location.href = '/students';
    } 
    if (role === 'giangvien') {
      window.location.href = '/teacher';
    } else {
        alert('Sai mã người dùng hoặc mật khẩu!');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="input-group">
        <label htmlFor="user-id">Mã người dùng</label>
        <input
          type="text"
          id="user-id"
          placeholder="Nhập mã người dùng"
          required
        />
      </div>
      <div className="input-group">
        <label htmlFor="password">Mật khẩu</label>
        <input
          type="password"
          id="password"
          placeholder="Nhập mật khẩu"
          required
        />
      </div>
      <div className="role-checkbox-group">
        <input
          type="radio"
          id="student"
          name="role"
          value="sinhvien"
          checked={role === 'sinhvien'}
          onChange={() => setRole('sinhvien')}
        />
        <label htmlFor="student">Sinh viên</label>
      </div>
      <div className="role-checkbox-group">
        <input
          type="radio"
          id="teacher"
          name="role"
          value="giangvien"
          checked={role === 'giangvien'}
          onChange={() => setRole('giangvien')}
        />
        <label htmlFor="teacher">Giảng viên</label>
      </div>
      <button type="submit" className="btn-login">
        Đăng nhập
      </button>
    </form>
  );
};

export default LoginForm;