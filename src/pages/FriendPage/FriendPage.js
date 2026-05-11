import React from 'react';
import { useMemo, useState } from 'react';
import FriendList from './FriendList';
import FriendSearch from './FriendSearch';
import FriendUnfollowModal from './FriendUnfollowModal';
import '../../styles/FriendPage.css'

//페이지를 처음 열었을 때 보여줄 친구 목록의 초기 데이터
// 아래에서 useState의 초기값으로 사용됨
const initialFollowList = [
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
]

function FriendPage() {
    // 첫번째 useState, 현재 팔로우중인 친구 목록을 나타냄
    // 아래에서 FirendLIst에 props로 내려가 화면에 띄워짐
    // 친구 추가, 삭제 시 setFollowList로 갱신되어 화면이 다시 그려짐
    const [followList, setFollowList] = useState(initialFollowList);
    
    // followList의 id들만 모아둔 Set
    // 아래의 handleFollow에서 이미 팔로우한 친구인지 확인할 때 사용
    // useMemo로 감싸서 followList가 바뀔때만 다시 계산함
    const followIds = useMemo(
        () => new Set(followList.map((x) => x.id)),
    [followList]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);

    const handleFollow = (user) => {
        if (!user?.userId) return;
        if (followIds.has(String(user.userId))) return;

        setFollowList((prev) => [...prev, user]);
    };

    const handleClickRemove = (friend) => {
        setSelectedFriend(friend);
        setIsModalOpen(true);
    }

    const handleConfirmRemove = () => {
        if (!selectedFriend) return;
        setFollowList((prev) => 
            prev.filter((friend) => friend.id !== selectedFriend.id)
        );
        setIsModalOpen(false);
        setSelectedFriend(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedFriend(null);
    };

    return (
        <div className="friend-page">
            <div className="friend-page__inner">
                <div className="friend-page__grid">
                    <FriendList
                        friends={followList}
                        onClickRemove={handleClickRemove}
                        emptyText="팔로우하는 친구가 없습니다."
                    />

                    <FriendSearch
                        onFollow={handleFollow}
                        followingList={followList}
                    />
                </div>
            </div>

            <FriendUnfollowModal
                isOpen={isModalOpen}
                friend={selectedFriend}
                onConfirm={handleConfirmRemove}
                onClose={handleCloseModal}
            />
        </div>
    );
}

export default FriendPage; 