import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import React, { useState } from "react";
import "../../styles/Calendar.css";

// date 객체를 xxxx-xx-xx 형태의 문자열로 바꿔주는 함수
const toDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// 더미 할일 데이터
const dummyTodosByDate = {
  "2026-05-04": [
    { id: 1, title: "프론트 보충자료 읽기", completed: true },
    { id: 2, title: "FriendCalendar 주석 달기", completed: false },
  ],
  "2026-05-06": [
    { id: 3, title: "친구 페이지 과제 제출", completed: true },
  ],
  "2026-05-10": [
    { id: 4, title: "React 복습하기", completed: false },
    { id: 5, title: "props 정리하기", completed: false },
    { id: 6, title: "useState 정리하기", completed: true },
  ],
};

// 친구의 캘린더를 그리는 컴포넌트
// FriendDetailPage가 props를 보내지만 지금은 받지 않고 더미 데이터 사용
export default function FriendCalendar() {
  // 처음에는 오늘 날짜(new Date())로 시작, 사용자가 날짜를 클릭하면 setSelcetedDate로 갱신
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 사용자가 캘린더에서 날짜를 클릭했을 때 실행되는 함수
  const handleDateChange = (value) => {
    // value가 Date 객체면 그대로 사용, 배열이면 첫번째 요소를 꺼냄
    const next = value instanceof Date ? value : value?.[0];
    if (!next) return; // 날짜 없으면 종료
    setSelectedDate(next); // 날짜 있으면 setSelectedDate state 갱신
  };

  // 특정 날짜에 대한 메타 정보를 계산하는 함수
  const getDayMeta = (date) => {
    const key = toDateKey(date); // Date 객체를 문자열 키로 변환
    const list = dummyTodosByDate[key] ?? []; // 그 날짜의 할 일 배열을 꺼냄, 없으면 빈 배열

    if (list.length === 0) { // 할 일이 하나도 없으면 할 일 없음 반환
      return { hasTodos: false, remaining: 0, allDone: false };
    }
    
    // 완료하지 못한 할 일 개수 계산, completed가 false인 것만 골라냄
    const remaining = list.filter((todo) => !todo.completed).length;

    // 결과 객체 반환
    return {
      hasTodos: true,
      remaining,
      allDone: remaining === 0,
    };
  };

  return (
    <div className="calendar-container">
      <Calendar
        // 사용자가 날짜 클릭하면 handleDateChange 함수 실행
        onChange={handleDateChange}
        // 현재 선택된 날짜
        value={selectedDate}
        calendarType="gregory"
        view="month"
        prev2Label={null}
        next2Label={null}
        showNeighboringMonth={true}
        formatDay={(locale, date) => String(date.getDate())} // 날짜 칸에 표시될 숫자 형식
        tileContent={({ date, view }) => { // 각 날짜 칸 안에 추가로 표시할 내용
          if (view !== "month") return null; 

          const { hasTodos, remaining, allDone } = getDayMeta(date);
          if (!hasTodos) return null;

          // 할 일을 다 끝냈으면 별 표시, 아니면 남은 개수 표시
          return <div className="tile-meta">{allDone ? "★" : remaining}</div>;
        }}
        tileClassName={({ date, view }) => {
          if (view !== "month") return "";

          const { hasTodos, allDone } = getDayMeta(date);
          if (!hasTodos) return "";

          // 다 끝낸 날은 tile-done 클래스, 남았으면 tile-has 클래스 적용
          return allDone ? "tile-done" : "tile-has";
        }}
      />
    </div>
  );
}
