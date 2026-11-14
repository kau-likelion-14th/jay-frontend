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

export default function FriendCalendar({
  initialDate,
  onDateChange,
  onMonthChange,
  remainingByDate = {},
}) {
  const getDayMeta = (date) => {
    const day = remainingByDate[toDateKey(date)];

    return {
      hasTodos: day?.hasTodo === true,
      remaining: day?.remaining ?? 0,
      allDone: day?.hasTodo === true && day.remaining === 0,  
    };
  };

  return (
    <div className="calendar-container">
      <Calendar
        // 사용자가 날짜 클릭하면 handleDateChange 함수 실행
        onChange={(value) => onDateChange?.(value instanceof Date ? value : value?.[0])}
        onActiveStartDateChange={({ activeStartDate}) => onMonthChange?.(activeStartDate)}
        // 현재 선택된 날짜
        value={initialDate}
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
