# 部署文檔

## 環境架構

本專案使用兩個 Vercel Projects 來區分 UAT 和 Production 環境：

| 環境 | Vercel Project | Git 分支 | 用途 |
|------|---------------|----------|------|
| UAT | lorem-ipsum-uat | develop | 測試環境 |
| Production | lorem-ipsum | main | 正式環境 |

## 開發流程

### 1. 開發新功能

```bash
# 從 develop 分支創建功能分支
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# 開發並提交
git add .
git commit -m "Add: your feature description"
git push origin feature/your-feature-name
```

### 2. 提交 Pull Request

- 在 GitHub 創建 PR，target 分支選擇 `develop`
- Vercel 會自動生成 Preview URL 供測試
- Code Review 通過後 merge 到 `develop`

### 3. UAT 測試

```bash
# PR merge 後，develop 分支自動部署到 UAT 環境
# UAT URL: https://lorem-ipsum-uat.vercel.app (或 Vercel 分配的 URL)
```

在 UAT 環境進行完整測試：
- 功能測試
- UI/UX 測試
- 跨瀏覽器測試
- 效能測試

### 4. 部署到 Production

測試通過後：

```bash
# 將 develop merge 到 main
git checkout main
git pull origin main
git merge develop
git push origin main

# 自動部署到 Production 環境
```

## Vercel 設置指引

### 創建兩個 Vercel Projects

#### 1. UAT Project (lorem-ipsum-uat)
1. 訪問 https://vercel.com/new
2. Import 你的 GitHub repository
3. 配置：
   - **Project Name**: `lorem-ipsum-uat`
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
4. Git 設置：
   - **Production Branch**: `develop`
5. 環境變數：
   - `OPENAI_API_KEY`: 你的測試用 API Key

#### 2. Production Project (lorem-ipsum)
1. 訪問 https://vercel.com/new
2. Import 同一個 GitHub repository
3. 配置：
   - **Project Name**: `lorem-ipsum`
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
4. Git 設置：
   - **Production Branch**: `main`
5. 環境變數：
   - `OPENAI_API_KEY`: 你的正式環境 API Key

### 環境變數設置

在每個 Vercel Project 的設置中：

**Settings → Environment Variables**

| 變數名 | 說明 |
|--------|------|
| `OPENAI_API_KEY` | OpenAI API Key（UAT 和 Production 使用不同的 Key） |

## GitHub 分支保護（建議設置）

### 保護 main 分支

在 GitHub Repository Settings:

**Settings → Branches → Add branch protection rule**

- **Branch name pattern**: `main`
- 啟用：
  - ✅ Require a pull request before merging
  - ✅ Require approvals (至少 1 個)
  - ✅ Require status checks to pass before merging
  - ✅ Require branches to be up to date before merging

### 保護 develop 分支

- **Branch name pattern**: `develop`
- 啟用：
  - ✅ Require a pull request before merging
  - ✅ Require status checks to pass before merging

## 緊急修復流程 (Hotfix)

如果 Production 發現嚴重 Bug：

```bash
# 從 main 創建 hotfix 分支
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug-fix

# 修復並測試
git add .
git commit -m "Fix: critical bug description"
git push origin hotfix/critical-bug-fix

# 創建 PR 到 main（緊急情況可直接 merge）
# 部署到 Production 後，記得也 merge 回 develop
git checkout develop
git merge main
git push origin develop
```

## 回滾策略

如果 Production 部署後出現問題：

1. 在 Vercel Dashboard 找到該 Project
2. **Deployments** 頁面找到上一個穩定版本
3. 點擊 **⋯** → **Promote to Production**
4. 同時在 Git 回滾代碼並修復問題

## 常見問題

### Q: Preview URL 是什麼？
A: 每個 PR 都會自動生成一個臨時 URL，供測試該 PR 的變更。

### Q: 如何查看部署狀態？
A: 在 Vercel Dashboard 或 GitHub PR 頁面查看部署狀態。

### Q: 如何使用不同的 API Key？
A: 在 Vercel 的環境變數設置中，為 UAT 和 Production 設置不同的值。

### Q: 能不能跳過 UAT 直接部署到 Production？
A: 技術上可以，但不建議。建議總是先在 UAT 測試。
