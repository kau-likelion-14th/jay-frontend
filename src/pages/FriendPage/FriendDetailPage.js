import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import FriendCalendar from "./FriendCalendar";
import FriendTodo from "./FriendTodo";

import "../../styles/FriendDetailPage.css";

// 할 일의 카테고리별 배경색, 글자색 설정
// 아래에서 FriendTodo에 props로 전달됨
const Categories = {
  공부: { backgroundColor: "#E5F8F1", color: "#333" },
  일상: { backgroundColor: "#FFC8BE", color: "#333" },
  동아리: { backgroundColor: "#B6DAFF", color: "#333" },
};

// date 객체를 xxxx-xx-xx 형태의 문자열로 바꿔주는 함수
const toDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};
// 페이지를 처음 열었을 때 보여줄 친구 정보
const dummyFriend = {
  followId: "1",
  name: "나나",
  tag: "1234",
  bio: "안녕하세요! 저는 나나입니다.",
  profileImage: null,
};

// 친구가 저장한 노래 목록
const dummySavedSongs = [
  {
    id: 1,
    title: "Ditto",
    artist: "NewJeans",
    imageUrl: null,
  },
];

// 날짜별 할일 목록
const dummyTodosByDate = {
  "2026-05-04": [
    { id: 1, text: "프론트 보충자료 읽기", category: "공부", completed: true },
    { id: 2, text: "FriendDetailPage 주석 달기", category: "공부", completed: false },
  ],
  "2026-05-06": [
    { id: 3, text: "친구 페이지 과제 제출", category: "동아리", completed: true },
  ],
  "2026-05-10": [
    { id: 4, text: "React 복습하기", category: "공부", completed: false },
    { id: 5, text: "동아리 회의", category: "동아리", completed: false },
    { id: 6, text: "산책하기", category: "일상", completed: true },
  ],
};

// 날짜별 남은 할 일 정보
const dummyRemainingByDate = {
  "2026-05-04": { hasTodo: true, remaining: 1 },
  "2026-05-06": { hasTodo: true, remaining: 0 },
  "2026-05-10": { hasTodo: true, remaining: 2 },
};

function FriendDetailPage() {
  const navigate = useNavigate(); // 페이지 이동을 도와주는 useNavigate를 navgate에 저장
  const location = useLocation(); // useLocation()으로 location 객체를 가져옴

  // FriendList나 FriendSearch에서 navigate할 때 넘긴 freind 객체를 꺼냄
  // 만약 못 받았으면 null.
  const passedFriend = location.state?.friend ?? null;

  // 첫번째 useStae, 화면에 보여줄 친구 정보
  // 이전 페이지에서 받은 friend가 있으면 그걸 보여주고 없으면 dummyFriend로 초기화
  const [friend] = useState(passedFriend ?? dummyFriend);
  const [savedSongs] = useState(dummySavedSongs); // 두번째 useState, 친구가 저장한 노래 목록

  const [selectedDate, setSelectedDate] = useState(new Date("2026-05-04")); // 세번째 useState, 캘린더에서 선택한 날짜
  const [viewDate, setViewDate] = useState(new Date("2026-05-04")); // 네번째 useState, 캘린더에서 현재 보고 있는 월

  const [todosByDate] = useState(dummyTodosByDate); // 다섯번째 useState, 날짜별 할일 데이터, 지금은 더미데이터로 고정
  const [remainingByDate] = useState(dummyRemainingByDate); // 여섯번째 useState, 날짜별 남은 할 일 정보

  // 가장 최근에 저장한 노래(배열의 첫번째 곡), saveSongs가 바뀔때만 다시 계산함
  const latestSong = useMemo(() => {
    if (!Array.isArray(savedSongs) || savedSongs.length === 0) return null;
    return savedSongs[0];
  }, [savedSongs]);

  // 선택된 날짜의 할 일 목록을 꺼내 옴,selectedDate가 바뀌면 다시 계산
  // 해당 날자에 할 일이 없으면 빈 배열 리턴
  // toDateKey로 Date 객체를 2026-05-04 문자열로 바꾼 뒤, todosByDate에서 꺼냄
  const todos = useMemo(() => {
    const key = toDateKey(selectedDate);
    return todosByDate[key] ?? [];
  }, [selectedDate, todosByDate]);

  return (
    <div className="friend-detail-page">
      <div className="friend-detail-page__inner">
        <div className="friend-detail-page__top">
          {/*뒤록가기 버튼 클릭 시 이전 페이지로 이동함 */}
          <button
            type="button"
            className="friend-detail-page__back"
            aria-label="뒤로가기"
            onClick={() => navigate(-1)}
          >
            ‹
          </button>
          
          {/*친구 프로필 영역 */}
          <div className="friend-detail-page__profile">
            {/*프로필 사진: 이미지가 있으면 사진으로 없으면 기본 이미지 */}
            <div className="friend-detail-page__avatar" aria-hidden="true">
              {friend?.profileImage ? (
                <img
                  src={friend.profileImage}
                  alt="profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <UserIcon />
              )}
            </div>
            
            {/*친구 이름, 한 줄 소개 영역 */}
            <div className="friend-detail-page__profile-info">
              <div className="friend-detail-page__name-line">
                <span className="friend-detail-page__name">
                  {friend?.name || " "}
                </span>
              </div>
              {/*bio가 있으면 표시하고 없으면 "한 줄 소개"로 표시함 */}
              <div className="friend-detail-page__bio">
                {friend?.bio || "한 줄 소개"}
              </div>
            </div>
          </div>
          {/*최근 저장한 노래 영역 */}
          <div className="friend-detail-page__songs-inline">
            {latestSong ? (
              <div className="friend-detail-page__song-inline-item">
                {/*노래 이미지 영역, 없으면 빈 박스 */}
                <div className="friend-detail-page__song-inline-cover">
                  {latestSong?.imageUrl ? (
                    <img
                      src={latestSong.imageUrl}
                      alt={latestSong.title || "album"}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                  ) : null}
                </div>
                {/*곡 제목 + 아티스트 영역 */}
                <div className="friend-detail-page__song-inline-info">
                  <div className="friend-detail-page__song-inline-title">
                    {latestSong?.title || "제목 없음"}
                  </div>
                  <div className="friend-detail-page__song-inline-artist">
                    {latestSong?.artist || "아티스트 정보 없음"}
                  </div>
                </div>
              </div>
            ) : (
              <div className="friend-detail-page__songs-inline-empty">
                저장한 곡이 없습니다.
              </div>
            )}
          </div>
        </div>
        {/*캘린더, 할 일 목록 영역 */}
        <div className="friend-detail-page__grid">
          <div className="friend-detail-page__calendar">
            <FriendCalendar
              initialDate={selectedDate} // 처음에 선택된 날짜
              onDateChange={(date) => date && setSelectedDate(date)} // 사용자가 날짜를 클릭하면 selectedDate 갱신
              onMonthChange={(date) => { // 사용자가 다음 달로 이동하면 viewDate 갱신
                if (!date) return;
                setViewDate(date);
              }}
              todosByDate={todosByDate} // 날짜별 할 일 데이터
              remainingByDate={remainingByDate} // 날짜별 남은 할 일 정보
            />
          </div>

          <div className="friend-detail-page__todo">
            <FriendTodo
              title="To do List"
              todos={todos}  // 위에서 useMemo로 계산한 선택된 날짜의 할 일 배열
              categories={Categories} // 카테고리별 색깔 정보
            />
          </div> 
        </div>
      </div>
    </div>
  );
}

function UserIcon() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5Z"
        fill="#ffffff"
        opacity="0.9"
      />
      <path
        d="M4 22c0-4.418 3.582-8 8-8s8 3.582 8 8"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default FriendDetailPage;