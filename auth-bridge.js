import { firebaseConfig, firebaseEnabled } from './firebase-config.js?v=7.3.7';
import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';

const $all=(s,r=document)=>Array.from(r.querySelectorAll(s));
const txt=e=>(e?.innerText||e?.textContent||e?.value||'').trim();
const lower=s=>(s||'').toLowerCase();

function findPanel(word){
  const el=$all('h1,h2,h3,h4,div,section,strong,b').find(x=>txt(x).includes(word));
  return el?.closest('form,section,article,.card,div') || el?.parentElement || document;
}
function inputs(root){ return $all('input',root).filter(i=>i.type!=='hidden' && i.type!=='button' && i.type!=='submit'); }
function emailInput(root){ return inputs(root).find(i=>i.type==='email'||lower(i.placeholder).includes('email')) || null; }
function passInputs(root){ return inputs(root).filter(i=>i.type==='password'||lower(i.placeholder).includes('密碼')||lower(i.placeholder).includes('password')); }
function btn(root,word){ return $all('button,input[type=button],input[type=submit]',root).find(b=>txt(b).includes(word)); }
function msg(root,text,ok=false){
  let box=root.querySelector('[data-real-auth-msg]');
  if(!box){ box=document.createElement('div'); box.dataset.realAuthMsg='1'; box.style.cssText='margin-top:10px;padding:10px 12px;border-radius:10px;font-size:14px;line-height:1.45;border:1px solid'; (btn(root,'登入')||btn(root,'申請')||root).insertAdjacentElement('afterend',box); }
  box.textContent=text; box.style.background=ok?'#ecfdf5':'#fff7ed'; box.style.borderColor=ok?'#86efac':'#fed7aa'; box.style.color=ok?'#166534':'#9a3412';
}
function err(e){ const c=e?.code||''; if(c.includes('email-already-in-use'))return '這個 Email 已經申請過，請直接登入。'; if(c.includes('invalid-email'))return 'Email 格式不正確。'; if(c.includes('weak-password'))return '密碼至少需要 6 碼。'; if(c.includes('invalid-credential')||c.includes('user-not-found')||c.includes('wrong-password'))return '帳號或密碼不正確。'; if(c.includes('operation-not-allowed'))return 'Firebase 尚未開啟 Email/Password 登入方式。'; if(c.includes('too-many-requests'))return '嘗試太多次，請稍後再試。'; return '操作失敗，請確認 Email 與密碼。'; }

function statusBar(auth){
  let bar=document.querySelector('[data-real-auth-bar]');
  if(!bar){ bar=document.createElement('div'); bar.dataset.realAuthBar='1'; bar.style.cssText='position:fixed;right:16px;bottom:16px;z-index:999999;background:rgba(15,23,42,.94);color:white;border-radius:999px;padding:10px 14px;font:14px system-ui;box-shadow:0 10px 30px rgba(0,0,0,.25);display:none;gap:10px;align-items:center'; document.body.appendChild(bar); }
  onAuthStateChanged(auth,u=>{ if(!u){bar.style.display='none';return;} bar.style.display='flex'; bar.innerHTML='<span>已登入：'+(u.email||'使用者')+'</span><button type="button" data-logout style="border:0;border-radius:999px;padding:6px 10px;cursor:pointer">登出</button>'; bar.querySelector('[data-logout]').onclick=()=>signOut(auth); });
}

function bind(auth){
  const login=findPanel('登入');
  const reg=findPanel('申請帳號');
  const loginEmail=emailInput(login), loginPass=passInputs(login)[0], loginBtn=btn(login,'登入');
  if(loginBtn && loginEmail && loginPass && !loginBtn.dataset.realAuth){
    loginBtn.dataset.realAuth='1'; loginBtn.type='button';
    loginBtn.addEventListener('click',async e=>{ e.preventDefault(); e.stopImmediatePropagation(); try{ await signInWithEmailAndPassword(auth,loginEmail.value.trim(),loginPass.value); msg(login,'登入成功。',true);}catch(ex){msg(login,err(ex),false);} },true);
  }
  const regEmail=emailInput(reg), ps=passInputs(reg), regBtn=btn(reg,'申請')||btn(reg,'送出');
  const name=inputs(reg).find(i=>lower(i.placeholder).includes('姓名')||lower(i.name).includes('name'));
  if(regBtn && regEmail && ps[0] && !regBtn.dataset.realAuth){
    regBtn.dataset.realAuth='1'; regBtn.type='button';
    regBtn.addEventListener('click',async e=>{ e.preventDefault(); e.stopImmediatePropagation(); if(ps[1] && ps[0].value!==ps[1].value){msg(reg,'兩次密碼不一致。');return;} try{ const cred=await createUserWithEmailAndPassword(auth,regEmail.value.trim(),ps[0].value); if(name?.value) await updateProfile(cred.user,{displayName:name.value.trim()}); msg(reg,'申請成功，已自動登入。',true);}catch(ex){msg(reg,err(ex),false);} },true);
  }
}

function boot(){
  if(!firebaseEnabled) return;
  const app=getApps().length?getApps()[0]:initializeApp(firebaseConfig);
  const auth=getAuth(app);
  statusBar(auth);
  bind(auth);
  new MutationObserver(()=>bind(auth)).observe(document.body,{childList:true,subtree:true});
  console.log('✅ Firebase Auth Bridge 7.3.7 ready');
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
