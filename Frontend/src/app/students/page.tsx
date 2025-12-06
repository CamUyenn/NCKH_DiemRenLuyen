import React from 'react';
import '../styles/students/student-home.css';

export default function StudentHome() {
  return (
    <div className="student-home-container">
      <div className="content-panel">
        <h1>THÔNG BÁO</h1>
        <hr />

        <div className="reminder-box">
          <strong>Nhắc nhở:</strong>
          <ul>
            <li>
              Nhà trường hiện đang tiến hành khảo sát ý kiến sinh viên về hoạt động giảng dạy. Xin bạn vui lòng bỏ ít thời gian <a href="#">vào đây</a> để trả lời khảo sát giúp. Cảm ơn!
            </li>
          </ul>
        </div>

        <div className="announcements-list">
          <div className="announcement-item">
            <p className="announcement-title">
              <a href="#">Thông báo về việc tổ chức Lễ kỷ niệm Ngày Nhà giáo Việt Nam 20/11/2025</a>
            </p>
            <p className="announcement-meta">[19/11/2025 16:17]</p>
            <p className="announcement-body">
              Nhà trường thông báo đến giảng viên và sinh viên được biết về việc tổ chức Lễ kỷ niệm Ngày Nhà giáo Việt Nam 20/11/2025. Cụ thể theo link đính kèm.
            </p>
          </div>

          <div className="announcement-item">
            <p className="announcement-title">
              <a href="#">[THÔNG BÁO] Chuyển sang hình thức dạy và học trực tuyến chiều và tối ngày 17/11/2025</a>
            </p>
            <p className="announcement-meta">[17/11/2025 11:12]</p>
            <p className="announcement-body">
              Do tình hình nước các sông lên cao và diễn biến mưa lũ còn phức tạp, nhiều khu vực của thành phố đang bị ngập sâu và chia cắt, Nhà trường thông báo cho giảng viên, sinh viên chuyển sang giảng dạy và học tập trực tuyến vào chiều và tối ngày 17/11/2025.
            </p>
          </div>

          <div className="announcement-item">
            <p className="announcement-title">
              <a href="#">Thông báo về việc nhận Bằng tốt nghiệp hệ chính quy đợt 3 năm 2025</a>
            </p>
            <p className="announcement-meta">[16/11/2025 09:18]</p>
            <p className="announcement-body">
              Nhà trường thông báo đến các sinh viên tốt nghiệp hệ chính quy đợt 3 năm 2025 đến nhận bằng tốt nghiệp tại Phòng Đào tạo Đại học và Công tác sinh viên (Phòng E106, gặp cô Ty). Danh sách sinh viên tốt nghiệp đợt 3 theo quyết định đính kèm.
            </p>
          </div>

          <div className="announcement-item">
            <p className="announcement-title">
              <a href="#">Thông báo về việc nhận học bổng VESAF, NFP năm học 2025-2026.</a>
            </p>
            <p className="announcement-meta">[13/11/2025 13:38]</p>
            <p className="announcement-body">
              Nhà trường thông báo đến toàn thể sinh viên về việc nhận học bổng VESAF, NFP năm học 2025-2026. Nội dung chi tiết ở file đính kèm
            </p>
          </div>

          <div className="announcement-item">
            <p className="announcement-title">
              <a href="#">Thông báo về việc nộp ảnh thẻ để bổ sung vào dữ liệu hồ sơ điện tử sinh viên K49</a>
            </p>
            <p className="announcement-meta">[11/11/2025 09:01]</p>
            <p className="announcement-body">
              Nhà trường thông báo đến các bạn sinh viên K49: Nhằm hoàn thiện hồ sơ điện tử sinh viên K49, các em sinh viên K49 nộp cho Nhà trường 1 file ảnh thẻ 3x4. Sinh viên nộp ảnh tái file lên Google driver bằng đường link sau:
            </p>
          </div>

          <div className="announcement-item">
            <p className="announcement-title">
              <a href="#">Thông báo về việc sắp xếp lịch dạy và học bù do mưa lũ trong học kỳ 1, năm học 2025-2026</a>
            </p>
            <p className="announcement-meta">[10/11/2025 08:10]</p>
            <p className="announcement-body">
              Nhà trường thông báo đến toàn thể giảng viên và sinh viên được biết việc sắp xếp lịch dạy và học bù do mưa lũ trong học kỳ 1, năm học 2025-2026. Cụ thể theo link chi tiết đính kèm
            </p>
          </div>

          <div className="announcement-item">
            <p className="announcement-title">
              <a href="#">Thông báo về việc nhận bổ sung Thẻ sinh viên Khóa 49</a>
            </p>
            <p className="announcement-meta">[10/11/2025 07:50]</p>
            <p className="announcement-body">
              Nhà trường thông báo đến các bạn sinh viên K49 chưa nhận thẻ sinh viên. Sinh viên liên hệ nhận thẻ tại phòng Tài liệu Tiếng Việt, K306, tầng 3 nhà K, Trung tâm Thông tin Thư viện.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}