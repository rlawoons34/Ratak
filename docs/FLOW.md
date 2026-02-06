# TakuRating System Architecture & Logic Flows

이 문서는 **TakuRating(대학 탁구 레이팅 시스템)**의 데이터베이스 구조, 핵심 로직 처리 흐름, 그리고 사용자 경험(UX) 설계를 시각화한 다이어그램 모음입니다.

---

## 1. Entity Relationship Diagram (ERD)
Supabase 데이터베이스의 스키마 구조입니다. `PLAYERS` 테이블을 중심으로 학교, 경기 기록, 레이팅 히스토리가 연결되며, **무결성**을 위해 모든 참조는 Foreign Key로 관리됩니다.

```mermaid
erDiagram
    %% TakuRating Database Schema based on PRD v3.0

    PROFILES ||--o| PLAYERS : "linked via user_id (optional)"
    SCHOOLS ||--|{ PLAYERS : "belongs to"
    EVENTS ||--o{ MATCHES : "includes"
    
    PLAYERS ||--o{ MATCHES : "winner"
    PLAYERS ||--o{ MATCHES : "loser"
    PLAYERS ||--o{ RATING_HISTORY : "tracks history"
    MATCHES ||--|{ RATING_HISTORY : "generates 2 logs"

    PROFILES {
        uuid id PK "FK auth.users"
        string role "player | admin"
        string display_name
        timestamp created_at
    }

    SCHOOLS {
        uuid id PK
        string name
        string code "Unique (SNU, etc)"
    }

    PLAYERS {
        uuid id PK
        string name
        uuid school_id FK
        string uni_division
        string club_division
        int rating "Default 1500"
        uuid user_id "Nullable FK"
    }

    EVENTS {
        uuid id PK
        string name
        string type "tournament | league"
        date start_date
    }

    MATCHES {
        uuid id PK
        uuid event_id FK
        uuid winner_id FK
        uuid loser_id FK
        string score "ex: 3:1"
        int delta_winner "USATT Calc"
        int delta_loser "USATT Calc"
        timestamp played_at
        uuid created_by FK
    }

    RATING_HISTORY {
        uuid id PK
        uuid match_id FK
        uuid player_id FK
        uuid opponent_id FK
        bool is_winner
        int pre_rating
        int post_rating
        int delta
        timestamp created_at
    }
```

<br>

## 2. Match Result Processing (Sequence Diagram)
관리자가 경기 결과를 입력했을 때 발생하는 **트랜잭션 흐름**입니다. 클라이언트는 단순 데이터만 전송하며, 핵심 로직(USATT 점수 계산, 레이팅 갱신)은 **Supabase RPC(Server-side)**에서 원자적(Atomic)으로 처리됩니다.

```mermaid
sequenceDiagram
    autonumber
    actor Admin as 관리자 (Admin)
    participant Client as Next.js Client (/admin/results)
    participant API as API Route (/api/admin/matches)
    participant DB as Supabase DB (RPC)
    participant Tables as DB Tables

    Note over Admin, Client: 경기 결과 입력 (승자, 패자, 스코어 '3:1')
    Admin->>Client: 제출 버튼 클릭
    Client->>API: POST Request (winner_id, loser_id, score)
    
    Note right of Client: Delta값 전송 안함 (보안)

    API->>DB: CALL register_match_result()

    rect rgb(240, 248, 255)
        Note right of DB: [Atomic Transaction Start]
        DB->>Tables: 승자/패자 현재 rating 조회 (Select)
        DB->>DB: USATT Exchange Chart 로직 수행
        Note right of DB: 점수차 기반 Delta 계산\n(강자승리 vs 약자승리 구분)
        
        DB->>Tables: MATCHES 테이블 Insert
        DB->>Tables: PLAYERS 테이블 Update (Rating 변경)
        DB->>Tables: RATING_HISTORY 테이블 Insert (2건)
        
        alt 에러 발생 시
            DB-->>API: Rollback & Error Return
        else 성공 시
            DB-->>API: Commit & Match ID Return
        end
        Note right of DB: [Atomic Transaction End]
    end

    API-->>Client: 200 OK
    Client->>Client: React Query invalidate(['rankings'])
    Client-->>Admin: 성공 메시지 & 랭킹 자동 갱신
```

<br>

## 3. User Experience & Navigation Flow
일반 사용자와 관리자의 웹사이트 이용 흐름도(Sitemap)입니다. 대시보드를 중심으로 전적 비교, 선수 상세 정보 등으로 이동하는 구조를 가집니다.

```mermaid
graph TD
    User((사용자))
    
    subgraph "Public Area (공용)"
        Home[/"🏠 홈 (Dashboard)"/]
        PlayerList[/"👤 선수 목록 (/players)"/]
        PlayerDetail[/"📄 선수 상세 (/players/:id)"/]
        Compare[/"⚔️ 전적 비교 (/compare)"/]
        SchoolList[/"🏫 학교 랭킹 (/schools)"/]
    end

    subgraph "Admin Area (관리자)"
        Login[/"🔐 로그인 (/auth)"/]
        MatchInput[/"📝 경기 결과 입력 (/admin/results)"/]
    end

    User --> Home
    User --> Login

    %% Dashboard Connections
    Home -->|"필터링(학교/부수)"| Home
    Home -->|"이달의 이변/상승세"| PlayerDetail
    Home -->|"랭킹 클릭"| PlayerDetail

    %% Player Connections
    PlayerList --> PlayerDetail
    PlayerDetail -->|"전적 데이터"| PlayerDetail

    %% Compare Connections
    Compare -->|"Player A & B 선택"| CompareResult["분석 결과"]
    CompareResult -->|"Direct H2H"| Direct["직접 전적"]
    CompareResult -->|"Triangle Logic"| Triangle["공통 상대 분석"]
    CompareResult -->|"AI Prediction"| Elo["Elo 승률 예측"]

    %% Admin Connections
    Login --"Admin Role 확인"--> MatchInput
    MatchInput --"RPC 제출"--> Home
```

<br>

## 4. Compare & Triangle Logic Algorithm
TakuRating의 핵심 기능인 **'전적 비교'** 알고리즘입니다. 두 선수의 직접 전적뿐만 아니라, **공통 상대(Triangle Logic)**를 찾아 간접 비교 데이터를 생성하는 과정을 나타냅니다.

```mermaid
flowchart TD
    Start("사용자: 선수 A, B 선택") --> Fetch["Server: 데이터 요청 (Direct + Triangle)"]
    
    subgraph "Triangle Logic Query (SQL)"
        GetA["선수 A의 모든 경기 조회"]
        GetB["선수 B의 모든 경기 조회"]
        Join["INNER JOIN: 상대방 ID가 같은 경우 추출"]
        Filter["공통 상대(C) 리스트 생성"]
    end

    Fetch --> GetA & GetB
    GetA & GetB --> Join
    Join --> Filter

    subgraph "Data Processing"
        CalcDirect["직접 전적 (H2H) 집계"]
        CalcElo["Elo 공식 승률 계산"]
        ProcessTriangle["공통 상대별 승패 집계"]
    end

    Filter --> ProcessTriangle
    Fetch --> CalcDirect
    Fetch --> CalcElo

    subgraph "UI Rendering"
        RenderElo["AI 승률 카드 표시"]
        RenderDirect["H2H 카드 표시"]
        RenderTri["공통 상대 테이블 표시\n(A결과 vs B결과)"]
    end

    CalcElo --> RenderElo
    CalcDirect --> RenderDirect
    ProcessTriangle --> RenderTri
```

## 5. Player Detail Logic Flow (Client-Side Rendering)
이 로직은 `/players/[id]` 페이지 진입 시 실행됩니다.

1. **Data Fetching:**
    * Fetch `Player Info` (Name, Divisions, Current Rating).
    * Fetch `Match History` (Date, Opponent Name, Scores, Result, Rating Change).
    
2. **Graph Data Processing (Bi-weekly):**
    * Raw Match History 데이터를 날짜순 정렬.
    * 데이터를 2주 단위(Bi-weekly)로 그룹화.
    * 각 기간의 **마지막 레이팅**을 추출하여 그래프 데이터 포인트 생성. (점과 점 사이를 선으로 연결)

3. **History List Rendering:**
    * **Condition Check:** Am I the winner?
    * **IF Winner:** Apply Green Style. Display `Me (Score) : (Score) Opponent`.
    * **IF Loser:** Apply Red Style. Display `Me (Score) : (Score) Opponent`.
    * **Link:** Wrap Opponent Name with `<Link href="/players/[opponent_id]">`.
    