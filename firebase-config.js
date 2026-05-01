// firebase-config.js

// ⭐ 判斷 test / prod
const isTestEnv = location.hostname.includes("test");

// ⭐ 正式 Firebase（先不用填）
const firebaseConfigProd = {
  apiKey: "正式KEY",
  authDomain: "正式.firebaseapp.com",
  projectId: "正式ID",
  storageBucket: "正式.appspot.com",
  messagingSenderId: "正式",
  appId: "正式"
};

// ⭐ 測試 Firebase
const firebaseConfigTest = {
  apiKey: "AIzaSyAexaKh3E9WLArIVdY0Wief4hAID9caGMTo",
  authDomain: "handover-system-test.firebaseapp.com",
  projectId: "handover-system-test",
  storageBucket: "handover-system-test.appspot.com",
  messagingSenderId: "912253248594",
  appId: "1:912253248594:web:5741ad86a391e125e1eb8b"
};

// ⭐ 自動切換
export const firebaseConfig = isTestEnv
  ? firebaseConfigTest
  ; firebaseConfigProd;

// ⭐ 開關
export const firebaseEnabled = true;

// ⭐ Debug
console.log("🔥 Firebase Project:", firebaseConfig.projectId);
console.log(isTestEnv ? "🧪 TEST" : "🚀 PROD");