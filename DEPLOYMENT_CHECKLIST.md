# Git 커밋 & Vercel 배포 체크리스트

## ✅ 배포 전 최종 확인

### 1. 파일 확인
- [x] `.env.example` 생성 완료
- [x] `.gitignore`에 `.env*.local` 포함
- [x] `vercel.json` 설정 파일 생성
- [x] `README.md` 업데이트 (배포 가이드 포함)
- [x] `VERCEL_DEPLOYMENT.md` 상세 가이드
- [x] `DEPLOY_QUICK_START.md` 빠른 시작 가이드

### 2. 환경변수 확인
- [x] `.env.local`은 Git에 포함되지 않음
- [x] `.env.example`에 필요한 변수 문서화

### 3. 빌드 테스트
```bash
pnpm run build
```
- [ ] 로컬 빌드 성공 확인 필요

### 4. 의존성 확인
```bash
pnpm install
```
- [x] `package.json`에 모든 의존성 포함

---

## 🚀 Git 커밋 & Push

### Step 1: 변경사항 확인
```bash
git status
```

### Step 2: 파일 추가
```bash
git add .
```

### Step 3: 커밋
```bash
git commit -m "chore: prepare for Vercel deployment

- Add .env.example for environment variables template
- Add vercel.json for deployment configuration
- Add VERCEL_DEPLOYMENT.md with detailed deployment guide
- Add DEPLOY_QUICK_START.md for quick start
- Update README.md with deployment section
- Add club division migration files
- Update all documentation
"
```

### Step 4: Push
```bash
git push origin main
```

---

## 🌐 Vercel에서 배포

### Step 1: Vercel 접속
1. https://vercel.com 접속
2. GitHub 계정으로 로그인

### Step 2: New Project
1. "Add New..." → "Project" 클릭
2. GitHub repository 선택 (ratak)
3. "Import" 클릭

### Step 3: 프로젝트 설정
- **Framework Preset**: Next.js (자동 감지)
- **Root Directory**: `./` (기본값)
- **Build Command**: `pnpm run build` (자동 설정)
- **Output Directory**: `.next` (자동 설정)
- **Install Command**: `pnpm install` (자동 감지)

### Step 4: 환경변수 입력 ⭐
```
NEXT_PUBLIC_SUPABASE_URL = https://lrmsxxlwfjsvrkfxwhdt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxybXN4eGx3ZmpzdnJrZnh3aGR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNTU0MTQsImV4cCI6MjA4NTgzMTQxNH0.evLhkS7n2H9zvGUNMYRZQ2o_irnNLbubeXXbEaXwigY
```

선택사항 (Admin 기능):
```
SUPABASE_SERVICE_ROLE = [service-role-key]
SUPABASE_PROJECT_ID = lrmsxxlwfjsvrkfxwhdt
```

### Step 5: Deploy
"Deploy" 버튼 클릭 → 빌드 완료 대기 (2-3분)

---

## ✅ 배포 후 확인

### 1. URL 확인
```
https://[project-name].vercel.app
```

### 2. 기능 테스트
- [ ] 홈 페이지 로드
- [ ] 랭킹 페이지 확인
- [ ] Supabase 연결 (데이터 로드)
- [ ] 로그인 기능 (있는 경우)

### 3. 문제 발생 시
- Vercel Dashboard → Deployments → 최근 배포 → Build Logs 확인
- Function Logs 확인
- 환경변수 재확인

---

## 🔄 자동 배포 확인

이제부터 Git push할 때마다 자동 배포됩니다!

```bash
# 코드 수정
git add .
git commit -m "feat: add new feature"
git push origin main
# → Vercel이 자동으로 빌드 & 배포
```

---

## 📝 다음 단계

1. [ ] 로컬 빌드 테스트
2. [ ] Git commit & push
3. [ ] Vercel에서 import
4. [ ] 환경변수 입력
5. [ ] 배포 시작
6. [ ] 배포 URL 확인
7. [ ] 기능 테스트
8. [ ] 팀원에게 URL 공유

---

## 💡 팁

### Vercel CLI (선택사항)
```bash
npm i -g vercel
vercel login
vercel
```

### Preview 배포
- 다른 branch push → 자동 Preview URL 생성
- PR마다 고유 URL 제공

### Analytics
- Vercel Dashboard → Analytics
- 무료로 방문자 통계 확인

---

*준비 완료! 이제 배포를 시작하세요! 🚀*
