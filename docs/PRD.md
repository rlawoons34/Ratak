# Project Name: TakuRating (University Table Tennis Rating System)

## 1. Project Overview
**TakuRating** is a real-time data analysis and ranking platform for university table tennis clubs.
* **Slogan:** "직감이 아닌 데이터로, 당신의 탁구를 증명하세요." (Prove your skills with data, not intuition.)
* **Core Value:** Eliminate subjective "division" debates by providing objective ratings based on the USATT official algorithm.
* **Target Audience:** University students (Initial target: Hanyang Univ. ERICA 'JARAM' & Table Tennis Club).

## 2. Tech Stack (Strict Constraints)
Cursor must strictly adhere to the following stack. No experimental features unless specified.

* **Framework:** Next.js 14 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS + **shadcn/ui** (Default) + Lucide React
* **State Management:** **TanStack Query (React Query) v5** (Use `useQuery` for reads, `useMutation` for writes. Avoid `useEffect` for data fetching).
* **Backend/Database:** Supabase (PostgreSQL, Auth, RLS, Edge Functions/RPC).
* **Animation:** Framer Motion (for Hero text & interactive elements).
* **Package Manager:** pnpm

## 3. Design Guidelines ("Premium Dark Bento")
* **Theme:** **Black & Red** (Deep Navy/Black background + Intense Red accents). Inspired by the 'JARAM' academic club website.
* **Layout:** **Bento Grid** style. Organized, rounded cards with subtle spotlight/glow effects.
* **Typography:** Bold, clean Sans-serif (Geist or Pretendard).
* **Hero Section:**
    * Background: Deep Navy (`#020817`) with subtle dot pattern.
    * Headline: "직감이 아닌 데이터로,\n당신의 탁구를 증명하세요." (Typewriter effect, highlight "데이터" in Red).

## 4. Database Schema (Supabase)
*All logic must rely on these tables. Do not store sensitive info (Phone, Student ID).*

### 4.1 Tables
1.  **`profiles`**: `id` (PK, ref auth.users), `role` ('player' | 'admin'), `display_name`, `created_at`.
2.  **`schools`**: `id` (PK), `name`, `code` (Unique, e.g., 'HYU'), `created_at`.
3.  **`players`**:
    * `id` (PK), `name`, `school_id` (FK), `uni_division`, `club_division`.
    * `rating` (INT, Default 1500), `user_id` (Nullable FK profiles).
4.  **`matches`**:
    * `id` (PK), `winner_id` (FK), `loser_id` (FK), `event_id` (Nullable).
    * `score` (Text '3:1'), `played_at`.
    * `delta_winner` (INT), `delta_loser` (INT) -> *Calculated via USATT logic*.
5.  **`rating_history`**:
    * `id` (PK), `match_id` (FK), `player_id` (FK), `opponent_id` (FK).
    * `is_winner` (BOOL), `pre_rating`, `post_rating`, `delta`.
    * *Constraint:* 1 Match generates **2 rows** in this table (one for winner, one for loser).

## 5. Key Business Logic (The "Brain")

### 5.1 Rating Update (USATT Exchange Chart)
* **Mechanism:** Updates occur **ONLY** via Supabase **RPC** (`register_match_result`).
* **Client Side:** Never calculates rating changes. Only sends `{ winner_id, loser_id, score }`.
* **Exchange Chart Rules:**
    * Diff 0~12: Delta 8
    * Diff 13~37: Delta 7
    * Diff 38~62: Delta 6
    * Diff 63~87: Delta 5
    * Diff 88~112: Delta 4
    * Diff 113~137: Delta 3
    * Diff 138~162: Delta 2
    * Diff 163~187: Delta 2
    * Diff 188~237: Delta 1
    * **Diff 238+ (Special Rule):**
        * If Higher Rated wins (Expected): **Delta 0**
        * If Lower Rated wins (Upset): **Delta 50**

### 5.2 Triangle Logic (Comparative Analysis)
* **Goal:** Compare Player A and Player B using common opponents (Player C).
* **Logic:**
    1.  Find all opponents `C` who played against `A`.
    2.  Find all opponents `C` who played against `B`.
    3.  Intersect these lists.
    4.  Calculate A vs C stats and B vs C stats.
* **Implementation:** Use a dedicated SQL Function or efficient Join query.

### 5.3 Win Rate Prediction
* Use **standard Elo Formula** for *prediction display only* (do not use for rating updates).
* Formula: `P(A) = 1 / (1 + 10 ^ ((Rb - Ra) / 400))`

## 6. Page Structure & Features
1.  **`/` (Dashboard):**
    * Real-time Ranking Table (Filterable by School/Division).
    * "Monthly Insights" Bento Grid (Biggest Upset, Top Riser).
2.  **`/auth` (Login):**
    * Supabase Email/Password Auth. Redirect to `/` on success.
3.  **`/players/[id]` (Profile):**
    * Rating History Graph (Recharts).
    * Recent 5 Matches (Win/Loss Badges).
4.  **`/compare` (Analysis):**
    * Select Player A & B.
    * Show: Direct H2H + Triangle Analysis + AI Prediction.
5.  **`/admin/results` (Admin Only):**
    * Secure Match Input Form.
    * Triggers RPC `register_match_result`.
6.  **`/schools` (School Ranking):**
    * Aggregated average ratings by school.

## 7. Security (RLS)
* **SELECT:** Public (Anon key allowed).
* **INSERT/UPDATE:** Restricted to users with `profiles.role = 'admin'`.
* **RPC:** Must check the caller's role before execution.