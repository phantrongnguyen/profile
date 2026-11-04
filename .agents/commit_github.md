# GitHub Commit Convention

## 1. Quy định áp dụng cho dự án này

- Chỉ tạo commit cục bộ trên nhánh `master`; kiểm tra nhánh hiện tại trước khi commit.
- Chỉ stage và commit các thay đổi thuộc phạm vi người dùng yêu cầu; không sửa các nội dung khác.
- Không tạo nhánh mới, không tạo Pull Request, không merge và tuyệt đối không chạy `git push`.
- Ghi rõ các lệnh đã dùng và mã commit sau khi hoàn tất.
- Quy định này được ưu tiên áp dụng; các hướng dẫn về nhánh khác, push, Pull Request và merge bên dưới chỉ là tài liệu tham khảo.

## 2. Mục đích

Tài liệu này quy định các nguyên tắc sử dụng Git và GitHub trong quá trình phát triển phần mềm nhằm:

* Chuẩn hóa nội dung commit giữa các thành viên.
* Giúp lịch sử Git dễ đọc, dễ tìm kiếm và dễ kiểm tra.
* Hỗ trợ Code Review và quản lý Pull Request.
* Dễ dàng xác định nguyên nhân khi xảy ra lỗi.
* Hỗ trợ tự động hóa CI/CD và Semantic Versioning.
* Giảm xung đột và hạn chế các commit không có ý nghĩa.

---

# 3. Nguyên tắc chung

Mỗi commit phải:

1. Có nội dung mô tả rõ ràng.
2. Chỉ tập trung vào **một mục đích chính**.
3. Không chứa các thay đổi không liên quan.
4. Không commit dữ liệu nhạy cảm.
5. Không commit file tạm, file build hoặc file môi trường.
6. Không sử dụng message chung chung như:

   * `update`
   * `fix`
   * `test`
   * `change`
   * `abc`
   * `final`
   * `final final`
7. Ưu tiên commit nhỏ, có ý nghĩa và dễ review.

### Không nên

```text
git commit -m "update"
```

### Nên

```text
git commit -m "feat(auth): add JWT authentication"
```

---

# 4. Quy ước Commit Message

Dự án sử dụng **Conventional Commits**.

Cú pháp:

```text
<type>(<scope>): <description>
```

Ví dụ:

```text
feat(auth): add JWT authentication
```

Trong đó:

| Thành phần    | Ý nghĩa                  |
| ------------- | ------------------------ |
| `type`        | Loại thay đổi            |
| `scope`       | Phạm vi module/chức năng |
| `description` | Mô tả ngắn gọn thay đổi  |

`scope` có thể được bỏ qua nếu không cần thiết:

```text
docs: update installation guide
```

---

# 5. Các loại Commit

## 5.1. feat

Sử dụng khi bổ sung **chức năng mới**.

```text
feat(user): add user registration API
```

```text
feat(recommendation): add learning recommendation endpoint
```

---

## 5.2. fix

Sử dụng khi sửa **bug/lỗi**.

```text
fix(auth): resolve expired token validation
```

```text
fix(model): handle missing prediction features
```

---

## 5.3. refactor

Sử dụng khi thay đổi cấu trúc hoặc cách triển khai nhưng **không thay đổi hành vi bên ngoài**.

```text
refactor(api): reorganize FastAPI routers
```

```text
refactor(model): separate model loading service
```

---

## 5.4. docs

Sử dụng khi thay đổi tài liệu.

```text
docs: update README installation guide
```

```text
docs(api): add prediction API documentation
```

---

## 5.5. test

Sử dụng khi thêm hoặc sửa test.

```text
test(model): add prediction service tests
```

```text
test(api): add health check endpoint tests
```

---

## 5.6. chore

Sử dụng cho các thay đổi bảo trì không liên quan trực tiếp đến source code.

Ví dụ:

* cập nhật dependency
* cấu hình IDE
* cấu hình project
* cập nhật tool

```text
chore: update project dependencies
```

```text
chore: configure pre-commit hooks
```

---

## 5.7. build

Sử dụng khi thay đổi hệ thống build hoặc dependency.

```text
build: update Docker image
```

```text
build: upgrade FastAPI dependency
```

---

## 5.8. ci

Sử dụng khi thay đổi CI/CD.

```text
ci: add GitHub Actions workflow
```

```text
ci: add automated test pipeline
```

---

## 5.9. perf

Sử dụng khi tối ưu hiệu năng.

```text
perf(api): reduce prediction response latency
```

```text
perf(data): optimize Spark transformation
```

---

## 5.10. revert

Sử dụng khi hoàn tác một commit trước đó.

```text
revert: revert feat(auth): add JWT authentication
```

---

# 6. Scope

`scope` nên thể hiện module hoặc thành phần bị ảnh hưởng.

Ví dụ:

```text
feat(auth): add login endpoint
feat(user): add user profile API
feat(model): add LightGBM prediction service
feat(recommendation): add recommendation endpoint
fix(database): handle connection timeout
docs(readme): update project structure
test(api): add prediction endpoint tests
```

Một số scope có thể sử dụng:

```text
auth
user
model
api
database
recommendation
frontend
backend
data
pipeline
config
docker
test
readme
```

Không nên tạo scope quá chi tiết nếu không cần thiết.

---

# 7. Quy tắc viết Description

Description phải:

* Viết ngắn gọn.
* Mô tả **hành động đã thực hiện**.
* Không viết hoa chữ đầu tiên một cách tùy tiện.
* Không kết thúc bằng dấu `.`.
* Không vượt quá khoảng 72 ký tự nếu có thể.
* Không sử dụng các từ mô tả mơ hồ.

### Không nên

```text
feat: New API
```

```text
fix: fixed bug
```

```text
update: update model
```

### Nên

```text
feat(api): add prediction endpoint
```

```text
fix(model): handle missing input features
```

```text
refactor(service): separate prediction logic
```

---

# 8. Breaking Changes

Nếu thay đổi làm **phá vỡ API hoặc hành vi tương thích ngược**, phải đánh dấu Breaking Change.

Có thể sử dụng `!`:

```text
feat(api)!: change prediction request schema
```

Hoặc sử dụng footer:

```text
feat(api): change prediction request schema

BREAKING CHANGE: prediction endpoint now requires user_id
```

Breaking Change phải được thông báo rõ ràng trong Pull Request.

---

# 9. Commit Body

Đối với thay đổi phức tạp, có thể sử dụng body để giải thích:

```text
feat(model): add personalized learning prediction

Load the trained LightGBM model and expose prediction
through the recommendation service.

The service validates input features before inference.
```

Không bắt buộc sử dụng body đối với commit đơn giản.

---

# 10. Atomic Commit

Mỗi commit nên thực hiện **một thay đổi logic chính**.

### Không nên

```text
feat: add API + fix database + update README + change UI
```

### Nên

```text
feat(api): add prediction endpoint
fix(database): handle connection timeout
docs(readme): update API documentation
```

Điều này giúp:

* Review dễ hơn.
* Revert dễ hơn.
* Debug dễ hơn.
* Cherry-pick dễ hơn.
* Theo dõi lịch sử phát triển tốt hơn.

---
# 11. Pull Request

Pull Request phải chứa:

### Title

Sử dụng Conventional Commit:

```text
feat(recommendation): add personalized learning API
```

### Description

PR nên bao gồm:

```text
## Summary

- Add recommendation service
- Add prediction endpoint
- Load trained LightGBM model

## Changes

- Add model service
- Add recommendation router
- Add request/response schemas

## Testing

- Unit tests passed
- API endpoint tested locally

## Related Issue

Closes #123
```

---

# 12. Code Review

Pull Request cần được review trước khi merge.

Reviewer cần kiểm tra:

* Logic nghiệp vụ.
* Kiến trúc.
* Coding convention.
* Error handling.
* Security.
* Performance.
* Test coverage.
* Documentation.
* Không có secret hoặc dữ liệu nhạy cảm.

Không nên merge khi:

* CI/CD đang fail.
* Có conflict chưa xử lý.
* Có review comment quan trọng chưa giải quyết.
* Có secret trong source code.
* Có test quan trọng bị lỗi.

---

# 13. Quy định về Secret và Environment

Tuyệt đối không commit:

```text
.env
.env.local
.env.production
```

API key:

```text
API_KEY=xxxxxxxx
```

Password:

```text
DB_PASSWORD=xxxxxxxx
```

Token:

```text
ACCESS_TOKEN=xxxxxxxx
```

Private key:

```text
*.pem
*.key
```

Thông tin kết nối database production.

Thay vào đó sử dụng:

```text
.env.example
```

Ví dụ:

```env
DATABASE_URL=
SECRET_KEY=
API_KEY=
MODEL_PATH=
```

---

# 14. Quy định về Model và Data

Đối với dự án Data Science / Machine Learning:

Không commit trực tiếp dữ liệu lớn hoặc dữ liệu nhạy cảm.

Không commit:

```text
*.csv
*.parquet
*.json
*.pkl
*.joblib
*.h5
*.pt
*.pth
```

nếu các file này là dữ liệu/model lớn hoặc không được yêu cầu quản lý trực tiếp bằng Git.

Có thể sử dụng:

* Git LFS
* Object Storage
* MinIO
* S3
* DVC
* Model Registry
* Artifact Registry

Ví dụ:

```text
data/
models/
artifacts/
```

nên được quản lý theo chính sách riêng của project.

---

# 15. Quy định về File tạm

Không commit các file:

```text
__pycache__/
*.pyc
.venv/
venv/
.env
.vscode/
.idea/
.DS_Store
dist/
build/
coverage/
.pytest_cache/
```

Các file này phải được khai báo trong `.gitignore`.

---

# 16. Quy trình Commit chuẩn

Quy trình đề xuất:

```bash
# 1. Kiểm tra branch
git branch

# 2. Kiểm tra thay đổi
git status

# 3. Kiểm tra diff
git diff

# 4. Add file cần commit
git add <file>

# hoặc
git add .

# 5. Commit
git commit -m "feat(api): add prediction endpoint"

# 6. Kiểm tra lịch sử
git log --oneline -5

# 7. Push
git push origin <branch-name>
```

---

# 17. Không sử dụng git add . một cách mù quáng

Trước khi commit:

```bash
git status
```

Sau đó kiểm tra:

```bash
git diff --cached
```

Chỉ commit những file thực sự thuộc về task.

---

# 18. Commit trước khi Push

Trước khi push, cần kiểm tra:

```bash
git status
git diff
git log --oneline -5
```

Nếu dự án có test:

```bash
pytest
```

Nếu có lint:

```bash
ruff check .
```

Nếu có format:

```bash
ruff format --check .
```

Chỉ push khi project đạt trạng thái hợp lệ.

---

# 19. Quy tắc Squash

Đối với feature branch có nhiều commit nhỏ:

```text
fix
fix again
test
update
final
final2
```

nên squash trước khi merge thành các commit có ý nghĩa.

Ví dụ lịch sử cuối cùng:

```text
feat(recommendation): add personalized learning API
test(recommendation): add API tests
docs(api): document recommendation endpoint
```

Mục tiêu là lịch sử `main` phải **sạch, rõ ràng và có ý nghĩa**.

---

# 20. Quy tắc Merge

Ưu tiên:

```text
Pull Request
      ↓
Code Review
      ↓
CI/CD
      ↓
Resolve conflicts
      ↓
Approve
      ↓
Merge
```

Không tự ý force push vào branch dùng chung.

Đặc biệt không sử dụng:

```bash
git push --force
```

trên:

```text
main
develop
release/*
```

Nếu bắt buộc phải rewrite history trên branch cá nhân, ưu tiên:

```bash
git push --force-with-lease
```

---

# 21. Checklist trước khi Commit

* [ ] Code đã được kiểm tra.
* [ ] Không có file nhạy cảm.
* [ ] Không có API key/password/token.
* [ ] Không commit `.env`.
* [ ] Không commit dữ liệu không cần thiết.
* [ ] Không commit model lớn nếu project không yêu cầu.
* [ ] Không có file tạm.
* [ ] Commit chỉ chứa một mục đích chính.
* [ ] Commit message đúng Conventional Commits.
* [ ] Test đã chạy nếu có.
* [ ] Code đã được format/lint nếu project yêu cầu.

---

# 22. Checklist trước khi tạo Pull Request

* [ ] Branch đúng convention.
* [ ] Branch đã cập nhật với `main`.
* [ ] Conflict đã được xử lý.
* [ ] Test pass.
* [ ] CI/CD pass.
* [ ] PR title đúng convention.
* [ ] PR description đầy đủ.
* [ ] Có liên kết Issue/Task nếu có.
* [ ] Không chứa secret.
* [ ] Không chứa thay đổi ngoài phạm vi task.

---

# 23. Commit Message Quick Reference

| Type       | Sử dụng          | Ví dụ                                 |
| ---------- | ---------------- | ------------------------------------- |
| `feat`     | Chức năng mới    | `feat(api): add prediction endpoint`  |
| `fix`      | Sửa lỗi          | `fix(model): handle missing features` |
| `refactor` | Tái cấu trúc     | `refactor(api): reorganize routers`   |
| `docs`     | Tài liệu         | `docs(readme): update setup guide`    |
| `test`     | Test             | `test(api): add prediction tests`     |
| `chore`    | Bảo trì          | `chore: update dependencies`          |
| `build`    | Build/dependency | `build: update Docker image`          |
| `ci`       | CI/CD            | `ci: add GitHub Actions workflow`     |
| `perf`     | Hiệu năng        | `perf(api): optimize inference`       |
| `revert`   | Hoàn tác         | `revert: revert previous change`      |

---

# 24. Quy tắc vàng

> **Một commit = một mục đích rõ ràng.**

Commit phải trả lời được ba câu hỏi:

```text
What?
    Tôi đã thay đổi gì?

Why?
    Tại sao cần thay đổi?

Scope?
    Thay đổi ảnh hưởng đến module nào?
```

Ví dụ tốt:

```text
feat(model): add LightGBM prediction service
```

Ví dụ không tốt:

```text
update
```

---

# 25. Recommended Project Workflow

Đối với dự án phát triển phần mềm doanh nghiệp:

```text
Issue / Task
     ↓
Create Branch
     ↓
Development
     ↓
Local Test
     ↓
Commit
     ↓
Push
     ↓
Pull Request
     ↓
Code Review
     ↓
CI/CD
     ↓
Approval
     ↓
Merge
     ↓
Deploy
```
