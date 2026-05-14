import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/FriendSearch.css";
import searchIcon from "../../assets/icon/search.png";

// 검색 대상이 되는 사용자 데이터
// 아래에서 results를 만들 때 이 배열을 filter로 걸러서 사용
const dummyUsers = [
    {
        id: "1",
        userId: 1,
        name: "나나",
        tag: "1234",
        bio: "안녕하세요! 저는 나나입니다.",
        profileImageUrl: null,
    },
    {
        id: "2",
        userId: 2,
        name: "얀",
        tag: "2342",
        bio: "^^",
        profileImageUrl: null,
    },
    {
        id: "3",
        userId: 3,
        name: "지말",
        tag: "1214",
        bio: "ㅎㅎ",
        profileImageUrl: null,
    },
    {
        id: "4",
        userId: 4,
        name: "코다",
        tag: "1223",
        bio: ";ㅁ;",
        profileImageUrl: null,
    },
    {
        id: "5",
        userId: 5,
        name: "딜런",
        tag: "1777",
        bio: ".",
        profileImageUrl: null,
    },
];

// FriendPage로부터 props를 받아 화면에 검색창, 검색 결과 목록을 그려주는 컴포넌트
function FriendSearch({
  title = "팔로우 요청",
  placeholder = "이름/태그로 검색",
  onFollow, // FrienPage로부터 받음
  followingList = [], // FriendPage로부터 받음
}) {
  const navigate = useNavigate(); // 페이지 이동을 도와주는 useNavigate를 navigate에 저장

  // 검색창에 입력된 값을 저장함
  // 입력될때 마다 setQuery로 갱신되고, 그 결과로 results가 다시 계산됨
  const [query, setQuery] = useState(""); 

  // 이미 팔로우 중인 친구들의 id만 모아둔 Set
  // folloingLIst가 바뀔때만 다시 계산함
  // 아래에서 이 사람이 이미 팔로우된 사람인지 판단할때 사용함
  const followingIdSet = useMemo(() => {
    return new Set(followingList.map((x) => x.id));
  }, [followingList]);

  // 검색 결과 배열, query가 바뀔 때만 다시 계산함
  // 검색어가 비어있으면 빈 배열, 있으면 dummyUsers에서 이름, 태그가 일치하는 사용자만 걸러냄
  const results = useMemo(() => {
    const q = query.trim(); // trim은 앞 뒤 공백 제거

    if (!q) return []; // 검색어가 비어있으면 빈 배열 리턴
    
    // 이 부분에서 dummyUsers에서 이름, 태그 또는 이름#태그 형태가 일치하는 사용자만 걸러냄
    return dummyUsers.filter((user) => {
      return (
        user.name.includes(q) ||
        user.tag.includes(q) ||
        `${user.name}#${user.tag}`.includes(q)
      );
    });
  }, [query]);
  
  // 검색 결과의 사용자를 클릭하면, 그 사용자의 상세 페이지로 이동시키는 함수
  const goFriendDetail = (friend) => {
    navigate("/friends/detail", { state: { friend } });
  };

  return (
    <section className="friend-search">
      {/*제목 표시(팔로우 요청) */}
      <h2 className="friend-search__title">{title}</h2>

      {/*검색창 + 돋보기 아이콘이 들어있는 박스 */}
      <div className="friend-search__input-box">
        <span className="friend-search__icon" aria-hidden="true">
          <img
            src={searchIcon}
            alt="검색"
            className="friend-search__icon-img"
          />
        </span>

        {/*검색 input, values는 위에 있는 query state와 연결됨 */}
        {/*사용자가 글자를 입력할때마다 onChange로 setQuery를 호출하고 query를 갱신함*/}
        <input
          className="friend-search__input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
        />
      </div>
      {/*검색어 상태에 따라 다른 화면을 보여줌
        만약 검색어가 비어있으면 아무것도 표시 안함
        검색어가 있는데 결과가 없으면 검색 결과가 없습니다를 띄움
        검색 결과가 있으면 목록을 띄움 */}
      {query.trim() === "" ? null : results.length === 0 ? (
        <div className="friend-search__empty">검색 결과가 없습니다.</div>
      ) : (
        <ul className="friend-search__list">
          {/*results 배열을 map으로 돌면서 각 사용자를 li로 그림 */}
          {results.map((user) => {
            {/*이 사람이 이미 팔로우 중인지 확인 */}
            const isFollowing = followingIdSet.has(user.id);

            return (
              <li key={user.id} className="friend-search__item">
                {/*클릭히면 그 사용자의 상세 페이지로 이동하는 영역*/}
                <div
                  className="friend-search__left"
                  role="button"
                  tabIndex={0}
                  onClick={() => goFriendDetail(user)}
                  onKeyDown={(e) => { // Enter 또는 스페이스바를 누르면 상세페이지로 이동
                    if (e.key === "Enter" || e.key === " ") goFriendDetail(user);
                  }}
                >
                  {/*프로필 사진 영역, 이미지가 있으면 사진을 띄우고, 없으면 기본 아이콘을 띄움 */}
                  <div className="friend-avatar" aria-hidden="true">
                    {user.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt=""
                        className="friend-avatar__img"
                      />
                    ) : (
                      <UserIcon />
                    )}
                  </div>
                  {/*사용자 이름, 태그, 소개글 영역 */}
                  <div className="friend-info">
                    <div className="friend-info__top">
                      <span className="friend-info__name">{user.name}</span>
                      <span className="friend-info__tag">#{user.tag}</span>
                    </div>
                    {/*소개글이 있으면 보여주고, 없으면 "한 줄 소개를 보여줌" */}
                    <div className="friend-info__bio">
                      {user.bio || "한 줄 소개"}
                    </div>
                  </div>
                </div>

                {/*팔로우 버튼, 클릭하면 FriendPage에게 팔로우 해달라고 요청 */}    
                {/*이미 팔로우 중이면 비활성화되고, 글자도 "팔로잉"으로 바뀜 */}    
                <button
                  type="button"
                  className={`friend-follow-btn ${
                    isFollowing ? "is-disabled" : ""
                  }`}
                  onClick={(e) => { 
                    e.stopPropagation(); // 위에 있는 div의 onClick(상세 페이지 이동)이 같이 실행되지 않게 막음 
                    onFollow?.(user); // FriendPage의 handleFollow 함수 호출하면서 user도 넘김
                  }}
                  disabled={isFollowing}
                > {/*이미 팔로우 중이면 팔로잉, 아니면 팔로우 */}
                  {isFollowing ? "팔로잉" : "팔로우"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

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

export default FriendSearch;