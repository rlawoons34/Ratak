# 🔧 pnpm 버전 고정 (Vercel 배포 수정)

## 📋 문제 상황

Vercel 배포 시 pnpm 버전 불일치로 인한 빌드 실패:
- **로컬 환경**: pnpm 10.28.2 (lockfile version 9)
- **Vercel 환경**: 기본적으로 최신 pnpm 버전 사용 시도
- **결과**: 버전 불일치로 인한 빌드 오류

## ✅ 해결 방법

### 1. `package.json` - packageManager 필드

```json
{
  "packageManager": "pnpm@10.28.2"
}
```

**역할**: Vercel에게 정확한 pnpm 버전을 명시

### 2. `vercel.json` - 빌드 설정

```json
{
  "buildCommand": "pnpm run build",
  "installCommand": "pnpm install --frozen-lockfile"
}
```

**역할**:
- `buildCommand`: 빌드 명령어 명시
- `installCommand`: `--frozen-lockfile` 플래그로 lockfile 버전 엄격하게 고정

### 3. `.npmrc` - pnpm 설정

```
shamefully-hoist=true
strict-peer-dependencies=false
```

**역할**: pnpm의 동작 방식 설정 (Vercel 환경과 로컬 환경 일치)

## 🔍 작동 원리

1. **Vercel이 프로젝트 감지**
   - `pnpm-lock.yaml` 발견 → pnpm 사용 결정

2. **버전 확인**
   - `package.json`의 `packageManager` 필드 확인
   - `pnpm@10.28.2` 설치

3. **의존성 설치**
   - `vercel.json`의 `installCommand` 실행
   - `pnpm install --frozen-lockfile` (lockfile 수정 없이 정확히 설치)

4. **빌드 실행**
   - `vercel.json`의 `buildCommand` 실행
   - `pnpm run build`

## 📊 변경 사항 요약

| 파일 | 변경 내용 | 목적 |
|------|----------|------|
| `package.json` | `"packageManager": "pnpm@10.28.2"` 추가 | pnpm 버전 명시 |
| `vercel.json` | 빌드/설치 명령어 명시 | Vercel 빌드 설정 |
| `.npmrc` | pnpm 설정 추가 | 일관된 동작 보장 |

## 🚀 배포 시 확인사항

### Vercel 빌드 로그에서 확인:
```
Installing dependencies...
pnpm install --frozen-lockfile
Lockfile is up to date, resolution step is skipped
```

✅ **성공 지표**:
- "pnpm install" 명령어 사용
- lockfile 버전 일치
- 의존성 설치 성공

## 💡 추가 정보

### lockfile version 9.0이 정상인 이유
- pnpm 10.x는 하위 호환성을 위해 lockfile version 9 형식 사용
- pnpm 9.x와 10.x 모두 lockfile version 9 사용 가능
- `packageManager` 필드로 정확한 버전 지정이 중요

### --frozen-lockfile 플래그
- lockfile을 절대 수정하지 않음
- 로컬과 정확히 동일한 의존성 버전 설치
- CI/CD 환경에서 권장되는 옵션

## 🔗 관련 문서

- [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) - 전체 배포 가이드
- [PNPM_GUIDE.md](./PNPM_GUIDE.md) - pnpm 사용법
- [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md) - 배포 요약

---

**이제 Vercel 배포가 로컬 환경과 동일한 pnpm 버전으로 실행됩니다! 🎉**
