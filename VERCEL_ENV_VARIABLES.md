# 🔐 Vercel 환경변수 설정 가이드

## 📋 추가할 환경변수 (3개 권장)

### ✅ 필수 환경변수 (2개)

#### 1. `NEXT_PUBLIC_SUPABASE_URL`
```
https://lrmsxxlwfjsvrkfxwhdt.supabase.co
```
- **용도**: Supabase 프로젝트 URL
- **노출**: 클라이언트에 노출됨 (안전)
- **필수 여부**: ✅ 필수

#### 2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxybXN4eGx3ZmpzdnJrZnh3aGR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNTU0MTQsImV4cCI6MjA4NTgzMTQxNH0.evLhkS7n2H9zvGUNMYRZQ2o_irnNLbubeXXbEaXwigY
```
- **용도**: 공개 API 키 (RLS로 보호됨)
- **노출**: 클라이언트에 노출됨 (RLS로 안전)
- **필수 여부**: ✅ 필수

---

### ⚠️ 권장 환경변수 (1개)

#### 3. `SUPABASE_SERVICE_ROLE` ⭐ 추가 권장
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxybXN4eGx3ZmpzdnJrZnh3aGR0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDI1NTQxNCwiZXhwIjoyMDg1ODMxNDE0fQ.lGJnfjjEENo_gTFNYLUNwHgNmHP_aufCrqOtErtNF3c
```
- **용도**: 관리자 권한 API 키 (RLS 우회)
- **노출**: 서버 사이드 전용 (절대 클라이언트 노출 안 됨)
- **필수 여부**: ⚠️ Admin 기능 사용 시 필수

**추가해야 하는 이유:**
- ✅ 경기 등록 기능 (`register_match_result`)
- ✅ 선수 등록/수정/삭제
- ✅ 토너먼트 관리
- ✅ 서버 사이드 API 라우트에서 사용

**추가하지 않으면:**
- ❌ Admin 페이지 기능 작동 안 함
- ❌ 경기 등록 불가
- ❌ 선수 관리 불가

---

### ❌ 추가 불필요 환경변수

#### `SUPABASE_PROJECT_ID`
```
lrmsxxlwfjsvrkfxwhdt
```
- **이유**: URL에 이미 포함되어 있음
- **현재 코드에서 사용하지 않음**
- **필요시 URL에서 추출 가능**

---

## 🎯 최종 추천

### Vercel에 추가할 환경변수: **3개**

```env
NEXT_PUBLIC_SUPABASE_URL=https://lrmsxxlwfjsvrkfxwhdt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxybXN4eGx3ZmpzdnJrZnh3aGR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNTU0MTQsImV4cCI6MjA4NTgzMTQxNH0.evLhkS7n2H9zvGUNMYRZQ2o_irnNLbubeXXbEaXwigY
SUPABASE_SERVICE_ROLE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxybXN4eGx3ZmpzdnJrZnh3aGR0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDI1NTQxNCwiZXhwIjoyMDg1ODMxNDE0fQ.lGJnfjjEENo_gTFNYLUNwHgNmHP_aufCrqOtErtNF3c
```

---

## 📸 Vercel 입력 화면 예시

### 환경변수 추가 방법

1. **Vercel Dashboard** → Project Settings → Environment Variables

2. **첫 번째 변수 입력**
   ```
   Key:   NEXT_PUBLIC_SUPABASE_URL
   Value: https://lrmsxxlwfjsvrkfxwhdt.supabase.co
   Environments: ✅ Production ✅ Preview ✅ Development
   [Add]
   ```

3. **두 번째 변수 입력**
   ```
   Key:   NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   Environments: ✅ Production ✅ Preview ✅ Development
   [Add]
   ```

4. **세 번째 변수 입력**
   ```
   Key:   SUPABASE_SERVICE_ROLE
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (service_role)
   Environments: ✅ Production ✅ Preview ✅ Development
   [Add]
   ```

---

## 🔒 보안 체크

### ✅ 안전한 설정
- `NEXT_PUBLIC_*` 변수는 클라이언트 노출 OK (RLS로 보호)
- `SUPABASE_SERVICE_ROLE`은 서버 전용 (Vercel이 보호)
- `.env.local`은 Git에 커밋 안 됨 (.gitignore)

### ⚠️ 절대 하지 말 것
- ❌ `SERVICE_ROLE` 키를 클라이언트 코드에 사용
- ❌ 환경변수를 하드코딩
- ❌ `.env.local` 파일을 Git에 커밋

---

## 🧪 테스트 방법

### 배포 후 확인

```typescript
// 브라우저 콘솔에서 확인
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
// ✅ 출력됨: "https://lrmsxxlwfjsvrkfxwhdt.supabase.co"

console.log(process.env.SUPABASE_SERVICE_ROLE)
// ✅ undefined (서버 전용이므로 클라이언트에서 안 보임)
```

### 서버 사이드 확인

```typescript
// app/api/test/route.ts
export async function GET() {
  return Response.json({
    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasServiceRole: !!process.env.SUPABASE_SERVICE_ROLE,
  })
}
// ✅ 모두 true여야 함
```

---

## 💡 요약

| 환경변수 | 추가 여부 | 이유 |
|---------|----------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ 필수 | 기본 연결 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ 필수 | 클라이언트 API |
| `SUPABASE_SERVICE_ROLE` | ✅ 권장 | Admin 기능 |
| `SUPABASE_PROJECT_ID` | ❌ 불필요 | 사용 안 함 |

**결론: 3개 추가하세요!** 🎯

---

*Last Updated: 2026-02-06*
