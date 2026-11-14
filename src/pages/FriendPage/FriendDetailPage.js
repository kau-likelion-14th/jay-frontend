import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../../Api";
import config from "../../Config";
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

function useFriendResource(url, params, validate, retry) {
  const [state, setState] = useState({ loading: true, error: "", value: null});
  const query = JSON.stringify(params);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    setState({ loading: true, error:"", value: null});
    api.get(url, {params: JSON.parse(query), signal: controller.signal})
      .then(({data}) => {
        if(data?.isSucccess === false || !validate(data?.result)) {
          throw new Error("잘못된 응답");
        }
        if(active) {
          setState({loading: false, error: "", value: data.result});
        }
      }) 
      .catch(() => {
        if(active) {
          setState({loading: false, error: "데이터를 불러오지 못 했습니다.", value: null,});
        }
      });
      return () => {
        active = false;
        controller.abort();
      };
  
  }, [url, query, validate, retry]);

  return state;
}

const validProfile = (value) => typeof value?.username === "string";
const validTodos = (value) =>
  Array.isArray(value) 
  && value.every((todo) => 
    todo?.todoId != null &&
    typeof todo.description === "string" &&
    typeof todo.completed === "boolean");
  const validCalendar = (value) =>
    Array.isArray(value?.days) &&
    value.days.every((day) => 
      typeof day?.date === "string" &&
      typeof day?.hasTodo === "boolean" &&
      Number.isFinite(day.remaining)
    );

function ResourceState({ resource, onRetry }) {
  if (resource.loading) {
    return <p role="status">불러오는 중...</p>
  }

  if(resource.error) {
    return (
      <div>
        <p role="alert">{resource.error}</p>
        <button type="button" onClick={onRetry}>다시 시도</button>
      </div>
    );
  }
  return null;
}

function FriendDetailPage() {
  const navigate = useNavigate(); // 페이지 이동을 도와주는 useNavigate를 navgate에 저장

  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [viewDate, setViewDate] = useState(() => new Date());
  const [retries, setRetries] = useState({profile: 0, todo:0, calendar: 0})
  const retry = (key) => setRetries((prev) => ({...prev, [key]: prev[key] + 1}));
  
  const base = config.FOLLOW.PROFILE(id);
  const profile = useFriendResource(base, {}, validProfile, retries.profile);
  const todoResource = useFriendResource(
    config.FOLLOW.TODOS(id),
      { date: toDateKey(selectedDate) },
      validTodos,
      retries.todos
  );
  const calendar = useFriendResource(
    config.FOLLOW.CALENDAR(id),
    { year: viewDate.getFullYear(), month: viewDate.getMonth() + 1},
    validCalendar,
    retries.calendar
  );

  const friend = profile.value ? {
    name: profile.value.username.split("#")[0],
    bio: profile.value.introduction,
    profileImage: profile.value.profileImageUrl,
  } : null;

  const todos = (todoResource.value || []).map((todo) => ({
    id: todo.todoId,
    text: todo.categoryName,
    completed: todo.completed,
  }));

  const remainingByDate = Object.fromEntries(
    (calendar.value?.days || []).map((day) => [day.date, day])
  );
  
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
          <ResourceState resource={profile} onRetry={() => retry("profile")} />
        </div>
        {/*캘린더, 할 일 목록 영역 */}
        <div className="friend-detail-page__grid">
          <div className="friend-detail-page__calendar">
            <ResourceState resource={calendar} onRetry={() => retry("calendar")} />
            <FriendCalendar
              initialDate={selectedDate} // 처음에 선택된 날짜
              onDateChange={(date) => date && setSelectedDate(date)} // 사용자가 날짜를 클릭하면 selectedDate 갱신
              onMonthChange={(date) => { // 사용자가 다음 달로 이동하면 viewDate 갱신
                if (!date) return;
                setViewDate(date);
              }}
              remainingByDate={remainingByDate} // 날짜별 남은 할 일 정보
            />
          </div>

          <div className="friend-detail-page__todo">
            <ResourceState resource={todoResource} onRetry={() => retry("todos")} />
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