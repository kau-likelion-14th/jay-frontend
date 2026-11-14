import React, {useMemo, useState, useEffect} from "react";
import "../../styles/Todo.css";
import TodoModal from "./TodoModal";
import api from "../../Api";
import config from "../../Config";

const uid = () => Date.now() + Math.random();

const CategoryStyles = { // 카테고리별 디자인 설정 (배경색과 글자색)
    공부: { backgroundColor: '#E5F8F1', color: '#333' },
    운동: { backgroundColor: '#FFC8BE', color: '#333' },
    동아리: { backgroundColor: '#B6DAFF', color: '#333' },
};

const DefaultStyle = { backgroundColor: '#EFEFEF', color: '#333' };

    const toDateKey = (date) => {

    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

const Todo = ({ selectedDate, todosByDate, setTodosByDate, onRefresh }) => {
    const dateKey = toDateKey(selectedDate);
    const todos = todosByDate[dateKey] ?? []; // 해당 날짜의 할 일 목록을 가져오되, 데이터가 없으면 빈 배열([])로 처리

    const setTodos = (updater) => {
        setTodosByDate((prev) => {
            const current = prev[dateKey] ?? [];
            const nextTodos = typeof updater === "function" ? updater(current) : updater;
            return { ...prev, [dateKey]: nextTodos };
        });
    };

    const [isModalOpen, setIsModalOpen] = useState(false); // 모달이 열렸는지 여부
    const [editingTodo, setEditingTodo] = useState(null); // 지금 수정 중인 할 일 정보 (새로 만들 때는 null)

    const [categoryList, setCategoryList] = useState([]);

    useEffect(() => {
        const controller = new AbortController();

        const fetchCategories = async () => {
            try {
                const { data } = await api.get(config.CATEGORIES.GET, {
                    signal: controller.signal,
                });
                setCategoryList(data?.result ?? []);
            } catch (error) {
                if (error.code === "ERR_CANCELED") return;
                console.error("카테고리 조회 실패", error);
            }
        };

        fetchCategories();
        return () => controller.abort();
    }, []);

    const categories = useMemo(() => {
        const result = {};
        categoryList.forEach((c) => {
            result[c.categoryName] = CategoryStyles[c.categoryName] ?? DefaultStyle;
        });
        return result;
    }, [categoryList]);

    const openModal = () => { // [+] 버튼 눌렀을 때 (새로 만들기)
        setEditingTodo(null);
        setIsModalOpen(true);
    };

    const openEditModal = (todo) => { // 이미 있는 할 일을 클릭했을 때 (수정하기)
        setEditingTodo(todo);
        setIsModalOpen(true);
    };

        const TodoCompleted = async (id, nextCompleted) => { // 체크박스 클릭 시 완료 상태 토글 (true <-> false)
        setTodos((prev) =>
            prev.map((t) =>
                t.id === id ? { ...t, completed: nextCompleted } : t
            )
        );

        try {
            await api.patch(config.TODOS.TOGGLE_COMPLETE(id, dateKey), {
                completed: nextCompleted,
            });
        } catch (error) {
            console.error("완료 상태 변경 실패", error);
        } finally {
            onRefresh?.();
        }
    };

    const handledSaveTodo = ({text, category}) => { // 저장 버튼 클릭 시 (수정 또는 추가)
        if (editingTodo) { // 1. 수정 모드일 때
            setTodos((prev) =>
                prev.map((t) => 
                    t.id === editingTodo.id 
                        ? { ...t, text, category } 
                        : t
                )
            );
        } else { // 2. 새로 추가 모드일 때
            setTodos((prev) => [
                  ...prev, // ← "기존에 있던 애들 다 데리고 와!" (복사)
                { id: uid(), text, category, completed: false },
            ]);
        }
        setIsModalOpen(false);
    };

    const handledDeleteTodo = () => { // 삭제 버튼 클릭 시
        if (!editingTodo) return;
        setTodos((prev) => prev.filter((t) => t.id !== editingTodo.id));
        setIsModalOpen(false);
    };

    const counts = useMemo(() => { //통계 계산
        const total = todos.length; // 전체 개수
        const done = todos.filter((t) => t.completed).length; // 완료된 개수
        return { total, done };
    }, [todos]);

    return (
        <div className="todo-container">
            <div className="todo-header">
                <div className="todo-title">To do List</div>
                <button className="todo-add" onClick={openModal}>+</button> 
            </div>
            <div className="todo-list">
                {todos.map((t) => (
                    <div 
                        key={t.id} 
                        className={`todo-item ${t.completed ? 'done' : ''}`}
                        onClick={() => openEditModal(t)}
                    >
                        <button 
                            className={`checkbox ${t.completed ? 'checked' : ''}`} 
                            onClick={(e) => {
                                e.stopPropagation();
                                TodoCompleted(t.id, !t.completed);
                            }}
                        >
                        </button>
                        <div className="todo-text">{t.text}</div>
                        <div 
                            className="todo-category"
                            style={CategoryStyles[t.category] ?? DefaultStyle}
                        >
                            {t.category}
                        </div>
                    </div>
                ))}
            </div>
            <TodoModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handledSaveTodo}
                onDelete={handledDeleteTodo}
                initialTodo={editingTodo}
                categories={categories}
            />
        </div>
    );
};

export default Todo;