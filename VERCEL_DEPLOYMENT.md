# 🚀 Vercel 배포 가이드

## 📋 사전 준비

### 1. GitHub Repository 준비
- ✅ 코드가 GitHub에 push 되어 있어야 함
- ✅ `.env.local`은 `.gitignore`에 포함되어 있음 (보안)
- ✅ `.env.example` 파일로 필요한 환경변수 문서화

### 2. Supabase 프로젝트 준비
- ✅ Supabase 프로젝트 생성 완료
- ✅ 데이터베이스 마이그레이션 실행 완료
- ✅ API 키 확인 완료

---

## 🎯 Vercel 배포 단계

### Step 1: Vercel 계정 연결

1. **Vercel 웹사이트 접속**
   - https://vercel.com
   - GitHub 계정으로 로그인

2. **New Project 클릭**
   - Dashboard → "Add New..." → "Project"

3. **Repository Import**
   - GitHub repository 선택
   - `ratak` (또는 프로젝트 이름) 선택
   - "Import" 클릭

---

### Step 2: 프로젝트 설정

#### Framework Preset
```
Framework: Next.js
자동 감지됨 ✅
```

#### Build & Output Settings
```
Build Command: pnpm run build
Output Directory: .next
Install Command: pnpm install
```

**⚠️ 그대로 두면 됩니다!** (자동 설정됨)

---

### Step 3: 환경변수 설정 ⭐ 중요!

**Environment Variables** 섹션에서 다음 변수들을 추가:

#### 필수 환경변수

| Variable Name | Value | Where to find |
|---------------|-------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://lrmsxxlwfjsvrkfxwhdt.supabase.co` | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` | Supabase Dashboard → Settings → API → anon public |

#### 선택 환경변수 (Admin 기능용)

| Variable Name | Value |
|---------------|-------|
| `SUPABASE_SERVICE_ROLE` | `eyJhbGci...` (service_role key) |
| `SUPABASE_PROJECT_ID` | `lrmsxxlwfjsvrkfxwhdt` |

**입력 방법:**
1. Key 입력: `NEXT_PUBLIC_SUPABASE_URL`
2. Value 입력: `https://lrmsxxlwfjsvrkfxwhdt.supabase.co`
3. "Add" 클릭
4. 모든 환경변수 반복

**⚠️ 주의사항:**
- `NEXT_PUBLIC_` prefix가 있는 변수만 클라이언트에서 접근 가능
- `SUPABASE_SERVICE_ROLE`은 서버 사이드에서만 사용 (보안)

---

### Step 4: 배포 시작

1. **"Deploy" 버튼 클릭**
2. 빌드 과정 확인 (약 2-3분 소요)
3. 배포 완료 대기

---

## ✅ 배포 성공 확인

### 1. 배포 URL 확인
```
https://your-project.vercel.app
```

### 2. 기능 테스트
- [ ] 홈 페이지 로드 확인
- [ ] 랭킹 페이지 확인
- [ ] Supabase 연결 확인 (데이터 로드)
- [ ] 로그인 기능 테스트

### 3. 도메인 설정 (선택사항)
- Vercel Dashboard → Settings → Domains
- 커스텀 도메인 추가 가능

---

## 🔧 자주 발생하는 문제

### 문제 1: 빌드 실패 (Module not found)

**원인:** 의존성 패키지 누락

**해결:**
```bash
# 로컬에서 확인
pnpm install
pnpm run build

# 성공하면 package.json 변경사항 commit & push
```

### 문제 2: 환경변수 오류

**증상:** 
- "Supabase client failed to initialize"
- 빈 화면 또는 에러 페이지

**해결:**
1. Vercel Dashboard → Settings → Environment Variables
2. 모든 환경변수가 정확히 입력되었는지 확인
3. 특히 `NEXT_PUBLIC_` prefix 확인
4. 재배포: Deployments → 최근 배포 → "Redeploy"

### 문제 3: Supabase RLS 오류

**증상:** "Row Level Security policy violation"

**해결:**
1. Supabase Dashboard에서 RLS 정책 확인
2. `FIX_RLS_QUICK.sql` 실행
3. Public 읽기 권한 확인

### 문제 4: TypeScript 빌드 오류

**원인:** 타입 에러

**해결:**
```bash
# 로컬에서 확인
pnpm run build

# 에러 수정 후 push
```

---

## 🚀 자동 배포 설정

GitHub에 push할 때마다 자동으로 배포되도록 설정됨!

```
git add .
git commit -m "Update feature"
git push origin main
↓
Vercel이 자동으로 감지하여 빌드 & 배포
```

### Branch 별 배포
- `main` branch → Production (your-project.vercel.app)
- 다른 branch → Preview (branch-name.vercel.app)

---

## 📊 배포 후 모니터링

### Vercel Analytics (무료)
- Dashboard → Analytics
- 방문자 수, 성능 지표 확인

### Vercel Logs
- Dashboard → Deployments → 특정 배포 선택
- Build Logs, Function Logs 확인

---

## 🔄 재배포 방법

### 방법 1: Git Push (자동)
```bash
git add .
git commit -m "Changes"
git push
```

### 방법 2: Vercel Dashboard (수동)
- Deployments → 최근 배포 → "Redeploy"

### 방법 3: Vercel CLI
```bash
pnpm add -g vercel
vercel --prod
```

---

## 🌐 커스텀 도메인 연결

### 1. 도메인 구매
- Namecheap, GoDaddy 등에서 구매

### 2. Vercel에서 도메인 추가
1. Settings → Domains
2. "Add Domain" 클릭
3. 도메인 입력 (예: takurating.com)

### 3. DNS 설정
Vercel이 제공하는 DNS 레코드를 도메인 제공자에 추가:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## 📝 체크리스트

배포 전:
- [ ] GitHub에 코드 push 완료
- [ ] `.env.example` 파일 생성
- [ ] `package.json`의 scripts 확인
- [ ] 로컬에서 `npm run build` 성공 확인
- [ ] Supabase 마이그레이션 완료

배포 중:
- [ ] Vercel 계정 생성/로그인
- [ ] Repository import
- [ ] 환경변수 모두 입력
- [ ] Deploy 클릭

배포 후:
- [ ] 배포 URL 접속 확인
- [ ] 기능 테스트 완료
- [ ] 에러 로그 확인
- [ ] 자동 배포 테스트 (push)

---

## 💡 추가 팁

### 성능 최적화
- Vercel은 자동으로 Edge CDN 적용
- 이미지 최적화 자동 처리
- Static Generation 활용

### 비용
- **Hobby 플랜 (무료)**
  - 개인 프로젝트
  - 무제한 배포
  - 100GB 대역폭/월
  
- **Pro 플랜 ($20/월)**
  - 상용 프로젝트
  - 팀 협업 기능
  - 1TB 대역폭/월

### 보안
- 환경변수는 절대 Git에 커밋하지 않기
- `NEXT_PUBLIC_` 없는 변수는 서버에서만 사용
- Supabase RLS 정책 항상 활성화

---

## 🎉 완료!

배포가 성공적으로 완료되면:
1. 배포 URL을 팀원들과 공유
2. 도메인 연결 (선택)
3. Analytics 모니터링 시작

**배포 URL 예시:**
```
https://ratak.vercel.app
또는
https://takurating.vercel.app
```

---

*Last Updated: 2026-02-06*  
*Version: 1.0.0*
