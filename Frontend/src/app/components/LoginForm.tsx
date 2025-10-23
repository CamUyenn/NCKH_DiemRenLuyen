"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import './../login/login.css';

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [role, setRole] = useState<'sv' | 'gv'>('sv');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!userId || !password) {
      setError('Vui lòng nhập đầy đủ mã người dùng và mật khẩu.');
      return;
    }

    setLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      const endpoint = role === 'sv' ? '/api/sauloginsinhvien' : '/api/saulogingiangvien';
      const baseUrl = 'http://localhost:8080';

      const payload =
        role === 'sv'
          ? { ma_sinh_vien: userId, mat_khau: password, type: 'sinhvien' }
          : { ma_giang_vien: userId, mat_khau: password, type: 'giangvien' };

      const response = await fetch(baseUrl + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 400) {
        if (role === 'sv') {
          setError('Sai mật khẩu hoặc mã sinh viên');
        } else {
          setError('Sai mật khẩu hoặc mã giảng viên');
        }
        setLoading(false);
        return;
      }

      if (!response.ok) {
        setError('Lỗi máy chủ. Vui lòng thử lại sau.');
        setLoading(false);
        return;
      }

      const data = await response.json();

      try {
        localStorage.setItem('session', JSON.stringify(data));
        if (data.type) localStorage.setItem('session_type', data.type);
      } catch (err) {
        console.warn('Could not write to localStorage', err);
      }

      const t: string = (data.type || '').toLowerCase();
      if (t === 'loptruong' || t === 'sinhvien') {
        router.push('/students');
      } else if (t === 'giangvien' || t === 'truongkhoa' || t === 'chuyenviendaotao') {
        router.push('/teacher');
      } else if (t === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err) {
      if ((err as any)?.name === 'AbortError') {
        setError('Yêu cầu đăng nhập quá thời gian. Vui lòng thử lại.');
      } else {
        setError('Không thể kết nối tới máy chủ. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} aria-label="login-form">
      <div className="input-group">
        <label htmlFor="user-id">Mã người dùng</label>
        <input
          type="text"
          id="user-id"
          placeholder="Nhập mã người dùng"
          value={userId}
          onChange={e => setUserId(e.target.value)}
          required
        />
      </div>

      <div className="input-group">
        <label htmlFor="password">Mật khẩu</label>
        <input
          type="password"
          id="password"
          placeholder="Nhập mật khẩu"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="role-row" role="radiogroup" aria-label="chọn vai trò">
        <label>
          <input
            type="radio"
            id="student"
            name="role"
            value="sv"
            checked={role === 'sv'}
            onChange={() => setRole('sv')}
          />
          Sinh viên
        </label>

        <label>
          <input
            type="radio"
            id="teacher"
            name="role"
            value="gv"
            checked={role === 'gv'}
            onChange={() => setRole('gv')}
          />
          Giảng viên
        </label>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <button type="submit" className="btn-login" disabled={loading}>
        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>
    </form>
  );
};

export default LoginForm;
