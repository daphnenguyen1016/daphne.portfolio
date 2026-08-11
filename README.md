# Portfolio — Daphne Nguyen

Cấu trúc thư mục:

```
daphne-portfolio/
├── index.html          → khung trang, không cần sửa
├── style.css            → màu sắc, font, bố cục
├── script.js             → hiệu ứng + logic nạp nội dung
├── admin/                → trang quản trị (CMS) — nơi bạn đăng nhập để thêm project
│   ├── index.html
│   └── config.yml
├── content/
│   ├── profile.json      → tên, bio, thông số, liên hệ
│   ├── categories.json   → thứ tự & tên 4 nút lọc (Banner/Reels/...)
│   └── projects.json     → toàn bộ project
└── images/uploads/       → ảnh bạn upload qua trang quản trị sẽ tự lưu ở đây
```

**Từ giờ bạn KHÔNG cần mở `index.html` hay bất kỳ file code nào nữa.** Mọi thứ (thêm project, đổi ảnh, sửa bio, đổi font/logo) đều làm qua trang quản trị ở bước 2. Phần này chỉ cần làm **một lần duy nhất**.

---

## 1. Xem thử trên máy (không bắt buộc)

Vì trang giờ tự nạp nội dung từ file JSON, bạn **không thể** double-click `index.html` để xem như trước (trình duyệt sẽ chặn). Nếu muốn xem thử trước khi đưa lên mạng, cách dễ nhất là bỏ qua bước này và xem trực tiếp trên bản đã deploy ở bước 2 — nhanh hơn nhiều.

---

## 2. Setup trang quản trị (làm 1 lần, khoảng 20-30 phút)

### Bước 1 — Tạo tài khoản GitHub (miễn phí)
Vào **https://github.com/signup**, đăng ký như đăng ký Gmail bình thường.

### Bước 2 — Đưa toàn bộ thư mục này lên GitHub
1. Sau khi đăng nhập GitHub, bấm nút **+** góc trên phải → **New repository**.
2. Đặt tên bất kỳ, ví dụ `daphne-portfolio` → **Create repository**.
3. Ở trang repo vừa tạo, bấm **uploading an existing file** (hoặc **Add file → Upload files**).
4. Kéo **toàn bộ nội dung bên trong** thư mục `daphne-portfolio` (không kéo cả thư mục cha) vào khung upload đó.
5. Cuộn xuống, bấm **Commit changes**.

*(Không cần cài git hay dùng dòng lệnh gì cả — toàn bộ làm qua trình duyệt.)*

### Bước 3 — Deploy site lên Netlify, nối với GitHub
1. Vào **https://app.netlify.com**, đăng ký/đăng nhập (có thể đăng nhập thẳng bằng tài khoản GitHub).
2. Bấm **Add new site → Import an existing project**.
3. Chọn **GitHub**, cho phép Netlify truy cập, rồi chọn đúng repo `daphne-portfolio` vừa tạo.
4. Để nguyên các cài đặt mặc định (không cần build command) → bấm **Deploy site**.
5. Đợi khoảng 30 giây, Netlify cho bạn 1 link dạng `random-name-123.netlify.app`. Muốn đổi tên đẹp hơn: **Site settings → Change site name**.

### Bước 4 — Bật đăng nhập (Identity)
1. Trong site vừa tạo trên Netlify, vào **Site settings → Identity**.
2. Bấm **Enable Identity**.
3. Cuộn xuống mục **Registration**, chọn **Invite only** (để người lạ không tự đăng ký được vào trang quản trị của bạn).

### Bước 5 — Bật Git Gateway (để CMS lưu được nội dung)
Vẫn trong **Identity**, cuộn xuống mục **Services** → bấm **Enable Git Gateway**.

### Bước 6 — Tự mời chính mình vào
1. Vào tab **Identity** (menu bên trái) → bấm **Invite users**.
2. Nhập email của bạn → **Send**.
3. Mở email vừa nhận được, bấm link trong đó → trang web sẽ mở ra và hiện ô đặt mật khẩu. Đặt mật khẩu xong là hoàn tất.

### Bước 7 — Vào trang quản trị
Truy cập **`tenweb.netlify.app/admin`** (thay `tenweb` bằng tên site thật của bạn) → đăng nhập bằng email/mật khẩu vừa đặt.

🎉 Xong — từ giờ mỗi lần muốn thêm/sửa project chỉ cần vào link `/admin` này.

---

## 3. Dùng hàng ngày (sau khi đã setup xong)

Vào `tenweb.netlify.app/admin`, đăng nhập, bạn sẽ thấy 2 mục bên trái:

**📁 Projects** → bấm vào → thấy danh sách project hiện tại → bấm **+ Add "Project"** để thêm mới:
- Điền tên, chọn danh mục (Banner/Reels/Presentation/Branding), loại, năm, mô tả
- Chọn **định dạng khung**: Ngang (cho ảnh graphic design/presentation) hoặc Dọc (cho Reels/TikTok)
- Chọn **loại nội dung**:
  - **Ảnh** → kéo-thả 1 ảnh vào ô **Ảnh project**
  - **Behance** → dán nguyên link project Behance vào ô **Link Behance / ID/Link video** (ví dụ `https://www.behance.net/gallery/12345678/Ten-Project`). Dùng cách này khi project có **nhiều ảnh/GIF** bên trong, vì nó nhúng nguyên trang case study Behance vào — khung hiển thị sẽ tự cao hơn bình thường để vừa. **Lưu ý:** project đó phải đã **Publish** (không phải bản nháp riêng tư) trên Behance thì mới nhúng được; nếu dán sai định dạng link, khung sẽ báo lỗi rõ ràng thay vì trống trơn.
  - **TikTok/Facebook** → dán ID/link vào ô tương tự
- Kéo thả để sắp xếp thứ tự project trong danh sách
- Bấm **Save**, rồi bấm nút **Publish** màu xanh ở góc trên → khoảng 1 phút sau trang chính tự cập nhật

**👤 Hồ sơ (Profile)** → sửa tên, bio, thông số `[EXP]/[FOCUS]/[BRANDS]/[METRICS]`, email, SĐT.
- Đổi **font chữ tên**: chọn trong danh sách có sẵn (Homemade Apple, Caveat, Permanent Marker, hoặc chữ thường).
- Có **logo ảnh** rồi? Upload vào ô **Logo ảnh** — nó sẽ tự thay thế chữ viết tay.

**🔀 Danh mục lọc (Filter)** → đổi **thứ tự** hoặc **tên hiển thị** của 4 nút Banner/Reels/Presentation/Branding — không cần đụng code nữa:
- Kéo-thả vào biểu tượng **⠿** bên trái mỗi dòng để sắp xếp lại thứ tự. Mục nằm **đầu danh sách** sẽ là mục tự động được chọn khi khách vừa vào trang.
- Đổi được cả **tên hiển thị** (ví dụ đổi "Banner" thành "Key Visual") mà không ảnh hưởng gì đến project đã gán — vì project vẫn nhận diện qua "Mã danh mục" phía sau, chỉ có chữ hiển thị ra ngoài là đổi.
- Lưu ý: mục này chỉ **sắp xếp lại** 4 danh mục có sẵn. Muốn thêm hẳn 1 danh mục hoàn toàn mới (ví dụ thêm "Illustration") thì vẫn cần mình chỉnh code một chút — vì lúc đó cần thêm cả lựa chọn mới vào phần chọn danh mục của từng Project. Cứ nhắn mình khi cần.

Mỗi lần sửa xong nhớ bấm **Publish** để lưu thật (Save chỉ là lưu nháp).

---

## 4. Vài lưu ý

- **Ảnh nên nén trước khi upload** (dưới ~1-2MB/ảnh) để trang tải nhanh — có thể dùng squoosh.app (miễn phí) để nén trước.
- Trang quản trị (`/admin`) **không hiện ra ở đâu trên trang chính** — nhà tuyển dụng xem `tenweb.netlify.app` sẽ không thấy hay biết nó tồn tại.
- Nếu quên mật khẩu trang quản trị: vào lại `/admin`, bấm **Forgot password**.
- Muốn mời thêm người khác (vd. đối tác) cùng quản lý: **Identity → Invite users** như bước 6.
- Cursor tùy chỉnh chỉ hiện trên máy tính (chuột), tự ẩn trên điện thoại/tablet.
- Nếu người xem bật "Reduced motion" trong hệ điều hành, site tự tắt bớt hiệu ứng — đây là chủ đích, không phải lỗi.
- Sau này có ngân sách mua domain riêng (vd `daphnenguyen.com`): vào **Domain settings** trong Netlify để trỏ domain vào, không ảnh hưởng gì đến trang quản trị.

---

## 5. Lỡ muốn sửa sâu hơn (đổi màu, bố cục...)

Việc này vẫn cần sửa code (`style.css`) — không làm được qua trang quản trị. Nếu cần, cứ quay lại đây nhờ chỉnh tiếp, gửi mình biết muốn đổi gì.
