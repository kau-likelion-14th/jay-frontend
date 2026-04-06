import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import React, { useState } from 'react';
import "../../styles/Calendar.css";

const toDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

export default function CustomCalendar({
    initialDate = new Date(),
    onDateChange,
    todosByDate = {},
}) {
    const [selectedDate, setSelectedDate] = useState(initialDate);

    const handledDateChange = (value) => { // hanledDateChange: 날짜를 클릭했을때 실행되는 함수
        // value가 Date 타입이면 value 그래도 사용, 아니면 배열의 첫번째 요소사용
        const next = value instanceof Date ? value : value?.[0];
        setSelectedDate(next);  // setSelectedDate: 위에서 한 상태 변경 함수 호출
        onDateChange?.(next);   // MainPage에서 onDatechange를 안넘겨주면 아무것도 안함
    };

    const getDayMeta = (date) => { // getDayMeta: 날짜를 받아서 그 날의 할일 상태를 반환하는 함수
        const key = toDateKey(date); // date를 toDateKet를 이용해 아까 만든 "y-m-d"형식으로 반환
        const list = todosByDate[key] ?? []; // key 인덱스(문자열)를 넣고 해당 날짜의 할일 목록을 꺼냄, 없으면 []로 처리
        if (list.length === 0) return { hasTodos: false, remaining: 0, allDone: false };
        // list 배열이 비어있으면 함수 끝
        const remaining = list.filter((t) => !t.completed).length; // 
        return { hasTodos: true, remaining, allDone: remaining === 0 };
    };

    return (
        <div className="calendar-container">
            <Calendar
                onChange={handledDateChange} // 날짜 클릭 -> handledDateChange 함수 실행
                value={selectedDate}  // 선택된 날짜를 캘린더에 알려줌
                calendarType='gregory' // 달력이 gregory 체계면 일요일 시작
                view='month' // 한 달치 날짜가 한 화면에 보임
                prev2Label={null} // 연도 단위르 이동하는 << 버튼 없앰
                next2Label={null} // 연도 단위로 이동하는 >> 버튼 없앰
                showNeighboringMonth={true} // 이전 달, 다음 달 날짜를 달력에 표시할지 여부 true면 보여줌
                formatDay={(locale, date) => String(date.getDate())} // date.getDate()는 날짜 숫자만 꺼냄(예: 4) => 날짜 칸에 숫자만 보임
                tileContent={({ date, view }) => {
                    if (view !== 'month') return null;
                    const { hasTodos, remaining, allDone } = getDayMeta(date);
                    if (!hasTodos) return null;

                    return (
                        <div className="tile-meta">
                            {allDone ? "★" : remaining}
                        </div>
                    );
                }}
                tileClassName={({ date, view }) => {
                    if (view !== 'month') return "";
                    const { hasTodos, allDone } = getDayMeta(date);
                    if (!hasTodos) return "";
                    return allDone ? "tile-done" : "tile-has";
                }}
            />
        </div>
    );
}