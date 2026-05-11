import React, { useEffect } from "react";
import "../../styles/FriendUnfollowModal.css";

// FriendPage에서 props를 받아 언팔로우 확인 모달을 그리는 컴포넌트
function FriendUnfollowModal({ isOpen, friend, onConfirm, onClose }) {
  // useEffect: 특정 시점에 자동으로 실행되는 코드를 등록함
  useEffect(() => {
    if (!isOpen) return; // 닫혀있으면 아무것도 안함

    const handleKeyDown = (e) => { // ESC 키를 누르면 onClose 함수 실행
      if (e.key === "Escape") onClose?.();
    };

    // document: 브라우저 전체, addEventListener("keydown", handleKeyDown): 키를 누를때마다 handleKeyDown 실행
    document.addEventListener("keydown", handleKeyDown);
    // 모달이 닫힐때, isOPen/onClose가 바뀔 때 감시(키보드를 누르는 것을 보는거)를 멈춤
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null; // 모달이 닫혀있을 때 화면에 아무것도 그리지 않음

  // 부모에서 받은 friend에서 모달에 보여줄 친구 이름, 태그 준비, friend가 null이거나 이름/태그가 없을 수도 있음
  const displayName = friend?.name ?? "";
  const displayTag = friend?.tag ? `#${friend.tag}` : "";

  // 모달 바깥(어두운 배경)을 클릭했을 때 모달을 닫는 함수
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.(); // e.target가 e.currentTarget와 같을 때만 닫음
  };

  return (
    <div className="friend-unfollow-modal__overlay" onClick={handleOverlayClick}>
      <div
        className="friend-unfollow-modal__content"
        role="dialog"
        aria-modal="true"
      >
        {/*진짜 삭제할건지 안내 문구를 띄움*/}
        <p className="friend-unfollow-modal__text">
          <span className="friend-unfollow-modal__name">{displayName}</span>{" "}
          <span className="friend-unfollow-modal__tag">{displayTag}</span>
          님을 팔로우 목록에서
          <br />
          삭제하시겠습니까?
        </p>

        {/*예, 아니오 버튼 영역 */}
        <div className="friend-unfollow-modal__actions">
          {/*"예" 버튼 클릭시 FriendPage의 handleConfirmRemove 실행 -> 친구 삭제됨 */}
          <button
            type="button"
            className="friend-unfollow-modal__btn friend-unfollow-modal__btn--yes"
            onClick={onConfirm}
          >
            예
          </button>

          {/*"아니오" 버튼 클릭시 FriendPage의 handleCloseModal 실행 -> 모달 닫힘 */}
          <button
            type="button"
            className="friend-unfollow-modal__btn friend-unfollow-modal__btn--no"
            onClick={onClose}
          >
            아니오
          </button>
        </div>
      </div>
    </div>
  );
}

export default FriendUnfollowModal;