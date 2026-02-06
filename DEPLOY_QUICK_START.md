# 🚀 Vercel 배포 빠른 시작

## 1단계: 환경변수 준비

Vercel Dashboard에서 다음 환경변수를 입력하세요:

### 필수 (2개)
```
NEXT_PUBLIC_SUPABASE_URL=https://lrmsxxlwfjsvrkfxwhdt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxybXN4eGx3ZmpzdnJrZnh3aGR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNTU0MTQsImV4cCI6MjA4NTgzMTQxNH0.evLhkS7n2H9zvGUNMYRZQ2o_irnNLbubeXXbEaXwigY
```

### 권장 (1개) - Admin 기능용
```
SUPABASE_SERVICE_ROLE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxybXN4eGx3ZmpzdnJrZnh3aGR0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDI1NTQxNCwiZXhwIjoyMDg1ODMxNDE0fQ.lGJnfjjEENo_gTFNYLUNwHgNmHP_aufCrqOtErtNF3c
```

> 💡 상세 설명: [VERCEL_ENV_VARIABLES.md](./VERCEL_ENV_VARIABLES.md)

## 2단계: Vercel에서 Import

1. https://vercel.com 접속
2. "New Project" 클릭
3. GitHub repository 선택
4. 환경변수 입력
5. "Deploy" 클릭

## 3단계: 배포 확인

- 빌드 완료 대기 (2-3분)
- 배포 URL 확인: `https://your-project.vercel.app`
- 사이트 접속 테스트

## 문제 발생 시

상세 가이드 참조: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
