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

const WEEK_ENUM = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

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

    const openEditModal = async (todo) => {
        setEditingTodo(todo);      
        setIsModalOpen(true);

        try {
            const { data } = await api.get(config.TODOS.DETAIL(todo.id));
            const detail = data?.result;
            if (!detail) return;

            setEditingTodo({
                id: detail.todoId,
                text: detail.description,
                category: detail.categoryName,
                completed: todo.completed,
                routine: detail.routineEnabled
                    ? {
                        startDate: detail.startDate || "",
                        endDate: detail.endDate || "",
                        repeatDays:
                            detail.week ? [WEEK_ENUM.indexOf(detail.week)] : [],
                    }
                    : null,
            });
        } catch (error) {
            console.error("투두 상세 조회 실패", error);
        }
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

    const handledSaveTodo = async ({ text, category, routine }) => {
        const payload = {
            categoryName: category,
            description: text,
            routineEnabled: Boolean(routine),
            startDate: routine?.startDate || null,
            endDate: routine?.endDate || null,
            week: routine?.repeatDays?.length
                ? WEEK_ENUM[routine.repeatDays[0]]
                : null,
        };

        try {
            if (editingTodo) {
                await api.put(config.TODOS.UPDATE(editingTodo.id), payload);
            } else {
                await api.post(config.TODOS.CREATE, payload, {
                    params: { date: dateKey },
            });
            }
            setIsModalOpen(false);
            onRefresh?.();
        } catch (error) {
            console.error(editingTodo ? "투두 수정 실패" : "투두 생성 실패", error);
        }
    };

    const handledDeleteTodo = async () => {
        if (!editingTodo) return;

        try {
            await api.delete(config.TODOS.DELETE(editingTodo.id, dateKey));
            setIsModalOpen(false);
            onRefresh?.();
        } catch (error) {
            console.error("투두 삭제 실패", error);
        }
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