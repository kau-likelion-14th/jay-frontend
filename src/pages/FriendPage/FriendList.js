import { useNavigate } from "react-router-dom";
import deleteIcon from "../../assets/icon/delete.png";
import "../../styles/FriendList.css";

// FriendPage에서 친구 배열(friends)을 받아서 화면에 목록으로 그려줌

// FriendPage로부터 props를 받아 친구 목록 UI를 그리는 함수
function FriendList(
  {
    title = "팔로우 목록",
    friends = [],
    onClickRemove, // 친구 삭제 버튼 클릭 시 호출할 함수 (부모의 habdlecClickRemove)
    emptyText = "팔로우하는 친구가 없습니다.",
  }
) {
  // 페이지 이동을 위해 useNavigate()를 navigate에 저장
  const navigate = useNavigate(); 

  // 친구를 클릭했을때 그 친구의 상세 페이지로 이동시키는 함수
  // navigate를 이용해 URL을 바꿔서 상세페이지를 열고, 해당 친구 정보(friend)도 같이 가져감
  const goFriendDetail = (friend) => {
    navigate(`/friends/${friend.id}`, { state: { friend } });
  };

  return (
    <section className="friend-list">
      <h2 className="friend-list__title">{title}</h2>

      {/* 친구가 한명도 없으면 안내 문구 emptyText만 보여주고, 있으면 아래 목록을 보여줌*/} 
      {friends.length === 0 ? (
        <div className="friend-list__empty">{emptyText}</div>
      ) : (
        <ul className="friend-list__items">
          {/*friends 배열에 들어있는 친구들을 하나씩 꺼내서 li 한줄씩 만들어줌 */}
          {/*key를 friend.id로 설정해서 react가 어떤 친구가 추가, 삭제 됐는지 구분할 수 있게 함  */}
          {friends.map((friend) => (
            <li key={friend.id} className="friend-list__item">
              {/*클릭하면 그 친구의 상세 페이지로 이동하는 영역 */}
              <div
                className="friend-list__left"
                role="button"
                tabIndex={0}
                onClick={() => {
                  goFriendDetail(friend); // 클릭시 위에서 만든 goFriendDetail 함수 실행, 상세 페이지로 이동
                }}
                >

                {/*프로필 사진 영역, 이미지가 있으면 사진을 보여주고 없으면 기본 이미지를 보여줌 */}
                <div className="friend-avatar" aria-hidden="true">
                  {friend.profileImageUrl ? (
                    <img
                      className="friend-avatar__img"
                      src={friend.profileImageUrl}
                      alt="프로필 사진"
                      />
                  ) : (
                    <UserIcon/>
                  )}
                </div>
 
                {/*친구 이름, 태그, 소개글이 들어가는 부분 */}
                <div className="friend-info">
                  <div className = "friend-info__top">
                    <span className="friend-info__name">{friend.name}</span>
                    <span className="friend-info__tag">#{friend.tag}</span>
                  </div>
                  {/*소개글이 없으면 "소개글이 없습니다"를 표시함*/}
                  {friend.bio ?(
                    <div className="friend-info__bio">{friend.bio}</div>
                  ) : (
                    <div className="friend-info__empty">소개글이 없습니다.</div>
                  )}
                </div>
              </div>
              {/*친구 목록의 삭제 버튼, 클릭하면 부모(FriendPage)에 삭제 버튼을 눌렀다고 알려줌*/}
              <button
                className="friend-remove-btn"
                type="button"
                aria-label="삭제"
                onClick={(e)=>{
                  e.stopPropagation(); // 위쪽 친구의 onClick이 같이 실행되지 않도록 막음
                  onClickRemove?.(friend); // 부모에게서 받은 onClickRemov 함수를 실행하면서 friend 정보를 넘겨줌
                }}
                >
                  <img className="friend-remove-icon" src={deleteIcon} alt="삭제 아이콘" />
                </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// 프로필 사진이 없을 때 보여주는 기본 이미지 
function UserIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

export default FriendList;