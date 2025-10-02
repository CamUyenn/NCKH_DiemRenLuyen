import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginForm = () => {
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
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userId,
          password: password,
          type: role, // 'sv' cho sinh viên, 'gv' cho giảng viên
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          setError('Sai mã người dùng hoặc mật khẩu!');
        } else {
          setError('Lỗi máy chủ. Vui lòng thử lại sau.');
        }
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data.success) {
        // Điều hướng dựa vào type trả về từ backend
        if (data.type === 'sinhvien') {
          window.location.href = '/students';
        } else if (data.type === 'giangvien') {
          window.location.href = '/teacher';
        } else {
          window.location.href = '/'; // fallback nếu type không hợp lệ
        }
      } else {
        setError(data.message || 'Sai mã người dùng hoặc mật khẩu!');
      }
    } catch (err) {
      setError('Không thể kết nối tới máy chủ. Vui lòng thử lại sau.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleLogin}>
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
      <div className="role-checkbox-group">
        <input
          type="radio"
          id="student"
          name="role"
          value="sv"
          checked={role === 'sv'}
          onChange={() => setRole('sv')}
        />
        <label htmlFor="student">Sinh viên</label>
      </div>
      <div className="role-checkbox-group">
        <input
          type="radio"
          id="teacher"
          name="role"
          value="gv"
          checked={role === 'gv'}
          onChange={() => setRole('gv')}
        />
        <label htmlFor="teacher">Giảng viên</label>
      </div>
      {error && (
        <div style={{ color: 'red', margin: '8px 0', textAlign: 'center' }}>
          {error}
        </div>
      )}
      <button type="submit" className="btn-login" disabled={loading}>
        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>
    </form>
  );
};

export default LoginForm;