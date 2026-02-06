# 📦 pnpm 사용 안내

이 프로젝트는 **pnpm**을 패키지 매니저로 사용합니다.

## 설치

```bash
# pnpm 전역 설치
npm install -g pnpm

# 또는 (Windows PowerShell)
iwr https://get.pnpm.io/install.ps1 -useb | iex

# macOS/Linux
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

## 기본 명령어

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm run dev

# 프로덕션 빌드
pnpm run build

# 프로덕션 서버 실행
pnpm run start

# 린트 실행
pnpm run lint

# 패키지 추가
pnpm add package-name

# Dev 의존성 추가
pnpm add -D package-name

# 전역 패키지 추가
pnpm add -g package-name
```

## pnpm 장점

- ✅ **빠른 속도**: npm/yarn보다 최대 2배 빠름
- ✅ **디스크 효율성**: 하드링크 사용으로 디스크 공간 절약
- ✅ **엄격한 의존성**: phantom dependencies 방지
- ✅ **Monorepo 지원**: 워크스페이스 기능 내장

## Vercel 배포

Vercel은 `pnpm-lock.yaml` 파일을 감지하여 자동으로 pnpm을 사용합니다.

- `package.json`에 `"packageManager": "pnpm@9.0.0"` 명시
- `.npmrc` 파일로 pnpm 설정 관리
- `vercel.json`에서 명시적으로 `pnpm` 커맨드 사용

## 참고

- 공식 문서: https://pnpm.io
- 마이그레이션 가이드: https://pnpm.io/installation
