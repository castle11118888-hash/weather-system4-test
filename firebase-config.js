// Firebase 設定檔
// 請到 Firebase Console > Project settings > General > Your apps
// 將你的 Firebase config 貼到下方。
// 注意：真正保護資料的是 Firestore Rules 與 Auth 權限，不是隱藏 apiKey。

export const firebaseConfig = {
  apiKey: "AIzaSyAehk39wLArVIdYOWief4haID9caGMTo",
  authDomain: "handover-system-test.firebaseapp.com",
  projectId: "handover-system-test",
  storageBucket: "handover-system-test.firebasestorage.app",
  messagingSenderId: "912253248594",
  appId: "1:912253248594:web:5741ad86a391e125e1eb86b",
  measurementId: "G-ZYS8BD6TNN"
};

export const firebaseEnabled = true; // 貼好設定後改成 true
