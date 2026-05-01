// Firebase 設定檔
// 請到 Firebase Console > Project settings > General > Your apps
// 將你的 Firebase config 貼到下方。
// 注意：真正保護資料的是 Firestore Rules 與 Auth 權限，不是隱藏 apiKey。

export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export const firebaseEnabled = false; // 貼好設定後改成 true
