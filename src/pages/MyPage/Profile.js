import { useState, useRef } from "react";

function Profile() {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [bio, setBio] = useState("");
  const [song, setSong] = useState("");

  const fileInputRef = useRef(null);

  const handleClickEditIcon = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImageFile(file);

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = () => {
    console.log("bio:", bio);
    console.log("song:", song);
  };

  return (
    <div className="profile">
      <div className="profile-top">
        <div className="profile-image-wrapper">
          <img
            src={previewUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23ddd'/%3E%3C/svg%3E"}
            alt="프로필"
            className="profile-img"
          />
          <button className="edit-btn" onClick={handleClickEditIcon}>✎</button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
        <p className="nickname">LIKELION#1253</p>
        <button className="save-btn" onClick={handleSave}>프로필 저장</button>
      </div>

      <div className="profile-inputs">
        <label>한 줄 소개</label>
        <input type="text" placeholder="안녕하세요" value={bio} onChange={(e) => setBio(e.target.value)} />
        <label>좋아하는 노래</label>
        <input type="text" placeholder="노래 입력" value={song} onChange={(e) => setSong(e.target.value)} />
      </div>
    </div>
  );
}

export default Profile;