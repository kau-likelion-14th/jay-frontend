import React, { useMemo } from "react";

import "../../styles/Todo.css";
import "../../styles/FriendTodo.css";

// 더미 할일 데이터
const dummyTodos = [
  { id: 1, text: "프론트 보충자료 읽기", category: "공부", completed: true },
  { id: 2, text: "FriendTodo 구현하기", category: "공부", completed: false },
  { id: 3, text: "동아리 회의", category: "동아리", completed: false },
];

// 더미 카테고리별 색상
const dummyCategories = {
  공부: { backgroundColor: "#E5F8F1", color: "#333" },
  일상: { backgroundColor: "#FFC8BE", color: "#333" },
  동아리: { backgroundColor: "#B6DAFF", color: "#333" },
};

// FriendDetailPage로부터 props를 받지만 현재는 더미 데이터로 동작 중
const FriendTodo = ({ title = "To do List" }) => {
  const todos = dummyTodos;
  const categories = dummyCategories;

  // 할 일의 전체 개수 + 완료된 개수 계산
  // todos가 바뀔 때만 다시 계산
  const counts = useMemo(() => {
    const total = todos.length;
    const done = todos.filter((t) => t.completed).length;
    return { total, done };
  }, [todos]);

  return (
    <div className="friend-todo">
      <div className="todo-container">
        {/*제목 표시 */}
        <div className="todo-header">
          <div className="todo-title">{title}</div>
        </div>

        {/*할 일 목록 영역 */}
        <div className="todo-list">
          {/*할 일이 없으면 "등록된 투두가 없습니다"를 띄우고, 있으면 todos를 map을 이용해 한 줄씩 띄움 */}
          {todos.length === 0 ? (
            <div className="friend-todo__empty">등록된 투두가 없습니다.</div>
          ) : (
            todos.map((t) => (
              // 각 할일 완료 여부에 따라 'done' 클래스 추가
              <div key={t.id} className={`todo-item ${t.completed ? "done" : ""}`}>
                {/*체크 박스: 완료 상태면 'checked' 클래스 추가, 체크 표시는 css로 */}
                <div className={`checkbox ${t.completed ? "checked" : ""}`} />
                {/*할 일 내용 텍스트 */}
                <div className="todo-text">{t.text}</div> 
                {/*categories 객체에서 해당 카테고리의 색상을 꺼내 적용 */}
                <div
                  className="todo-category"
                  style={categories[t.category] ?? undefined}
                >
                  {t.category}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendTodo;