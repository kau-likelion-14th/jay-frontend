import React, { useRef, useState, useEffect } from "react";

const profileImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Ccircle cx='60' cy='60' r='60' fill='%23ddd'/%3E%3C/svg%3E";

const Profile = () => {
  const fileInputRef = useRef(null);

  const [nickname] = useState("Likelion#1253");
  const [intro, setIntro] = useState("안녕하세요");
  const [favoriteSong, setFavoriteSong] = useState("내꺼하자 - 인피니트");

  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [profileImageUrl] = useState("");

  const handleClickEditIcon = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImageFile(file);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSaveProfile = () => {
    const profileData = {
      nickname,
      intro,
      favoriteSong,
      selectedImageFile,
    };

    console.log("저장된 프로필:", profileData);
    alert("프로필이 저장되었습니다.");
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const displayImageSrc = previewUrl || profileImageUrl || profileImg;

  return (
    <div className="profile-section">
      <div className="profile-left">
        <div className="profile-top">
          <div className="profile-image-box">
            <img src={displayImageSrc} alt="프로필 이미지" className="profile-img" />

            <button
              type="button"
              className="profile-edit-btn"
              onClick={handleClickEditIcon}
            >
              ✎
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="profile-file-input"
              onChange={handleFileChange}
            />
          </div>

          <h2 className="profile-nickname">{nickname}</h2>
        </div>

        <div className="profile-form">
          <label className="profile-label">한 줄 소개</label>
          <input
            className="profile-input"
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            placeholder="한 줄 소개를 입력해주세요"
          />

          <label className="profile-label">좋아하는 노래</label>
          <div className="song-input-box">
            <span className="song-icon">🎵</span>
            <input
              className="song-input"
              value={favoriteSong}
              onChange={(e) => setFavoriteSong(e.target.value)}
              placeholder="좋아하는 노래를 입력해주세요"
            />
            <span className="search-icon">⌕</span>
          </div>
        </div>
      </div>

      <button type="button" className="profile-save-btn" onClick={handleSaveProfile}>
        프로필 저장
      </button>
    </div>
  );
};

export default Profile;