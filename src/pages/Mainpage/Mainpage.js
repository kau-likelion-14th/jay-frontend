import React, {useState, useEffect} from "react";
import CustomCalendar from "./Calendar";
import Todo from "./Todo";
import api from "../../Api";         
import config from "../../Config";    
import "../../styles/MainPage.css";

const toDateKey = (date) => { // 날짜 객체를 "YYYY-MM-DD" 문자열로 바꾸는 함수 (달력과 Todo가 같은 키를 쓰기 위함)
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const uid = () => Date.now() + Math.random(); // 고유한 ID를 생성하는 함수 (할 일 항목 각각을 구분하기 위함)


const MainPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date()); // 1. 현재 어떤 날짜가 선택되었는지 관리 (기본값: 오늘)
  
  const [todosByDate, setTodosByDate] = useState({}); // 2. 전체 할 일 데이터를 관리하는 객체 상태

  const [activeMonth, setActiveMonth] = useState(new Date());

  const [calendarByDate, setCalendarByDate] = useState({});

  const [refreshKey, setRefreshKey] = useState(0);

  const year = activeMonth.getFullYear();  

  const month = activeMonth.getMonth() + 1;   
  
  useEffect(() => {
    const controller = new AbortController(); 

    const fetchCalendar = async () => {
      try {
        const { data } = await api.get(config.TODOS.CALENDAR, {
          params: { year, month },           
          signal: controller.signal,
        });

        const days = data?.result?.days ?? []; 
        const map = {};
        days.forEach((day) => {
          map[day.date] = {                  
            remaining: day.remaining,
            hasTodo: day.hasTodo,
          };
        });
        setCalendarByDate(map);
      } catch (error) {
        if (error.code === "ERR_CANCELED") return; 
        console.error("캘린더 조회 실패", error);
      }
    };

    fetchCalendar();
    return () => controller.abort(); 
  }, [year, month, refreshKey]);

    useEffect(() => {
    const controller = new AbortController();
    const dateKey = toDateKey(selectedDate);

    const fetchTodos = async () => {
      try {
        const { data } = await api.get(config.TODOS.LIST, {
          params: { date: dateKey },
          signal: controller.signal,
        });

        const list = data?.result ?? [];

        const mapped = list.map((item) => ({
          id: item.todoId,
          text: item.description,
          category: item.categoryName,
          completed: item.completed ?? item.isCompleted ?? false,
        }));

        setTodosByDate((prev) => ({ ...prev, [dateKey]: mapped }));
      } catch (error) {
        if (error.code === "ERR_CANCELED") return;
        console.error("할 일 목록 조회 실패", error);
      }
    };

    fetchTodos();
    return () => controller.abort();
  }, [selectedDate, refreshKey]);

  return (
    <div className="mainpage-container">
      <CustomCalendar 
        initialDate={selectedDate} 
        onDateChange={setSelectedDate} 
        calendarByDate={calendarByDate} 
        onMonthChange={setActiveMonth} 
      />
      <Todo 
        selectedDate={selectedDate} 
        todosByDate={todosByDate} 
        setTodosByDate={setTodosByDate} 
        onRefresh={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  );
};

export default MainPage; //MainPage라는 컴포넌트를 다른 파일에서도 가져다 쓸 수 있도록 "밖으로 내보내는" 명령어