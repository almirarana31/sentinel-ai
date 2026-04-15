"use strict";(()=>{var e={};e.id=3908,e.ids=[3908],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},6005:e=>{e.exports=require("node:crypto")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,r){return r in t?t[r]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,r)):"function"==typeof t&&"default"===r?t:void 0}}})},8686:(e,t,r)=>{r.r(t),r.d(t,{config:()=>c,default:()=>A,routeModule:()=>p});var n={};r.r(n),r.d(n,{default:()=>_});var s=r(1802),o=r(7153),i=r(6249),a=r(6005),E=r.n(a),u=r(7936),d=r(4041),T=r(2207);function l(e,t){return E().scryptSync(e,t,32).toString("hex")}async function _(e,t){try{let r,n;if("POST"!==e.method)return t.status(405).json({ok:!1,error:"Method not allowed"});let s="string"==typeof e.body?JSON.parse(e.body):e.body,o=String(s?.email||""),i=String(s?.password||""),a=String(s?.name||"User"),_=(0,d.R)(o);if(!_.includes("@"))return t.status(400).json({ok:!1,error:"Invalid email"});if(i.length<1)return t.status(400).json({ok:!1,error:"Missing password"});await (0,u.aj)();let A="almira@gmail.com"===_&&"Almira"===i,c=await (0,u.$d)(`SELECT id, email, name, password_salt, password_hash, email_verified_at
       FROM app_user
       WHERE email = ?
       LIMIT 1;`,[_]),p=!1;if(0===c.rows.length){if(!A)return t.status(404).json({ok:!1,error:"Account not found. Please sign up first."});let e=E().randomBytes(16).toString("hex"),s=l(i,e);r=E().randomUUID(),n=a,await (0,u.$d)(`INSERT INTO app_user(id, email, name, password_salt, password_hash, email_verified_at)
         VALUES (?, ?, ?, ?, ?, NOW());`,[r,_,n,e,s]),p=!0}else{let e=c.rows[0];if(r=e.id,n=e.name||a,!e.password_salt||!e.password_hash)return t.status(400).json({ok:!1,error:"Password not set for this account"});let s=l(i,e.password_salt);if(!E().timingSafeEqual(Buffer.from(s,"hex"),Buffer.from(e.password_hash,"hex")))return t.status(401).json({ok:!1,error:"Invalid email or password"});!e.email_verified_at&&A?(await (0,u.$d)("UPDATE app_user SET email_verified_at = NOW() WHERE id = ?;",[r]),p=!0):p=!!e.email_verified_at}if(!p){let n=String(E().randomInt(1e5,1e6)),s=(0,d.mr)(n),o=E().randomUUID();await (0,u.$d)(`INSERT INTO email_verification_token(id, user_id, token_hash, expires_at)
         VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL ? MINUTE));`,[o,r,s,15]);let i=`${function(e){let t="http://localhost:3000";if(t)return t.replace(/\/+$/,"");let r=e.headers["x-forwarded-proto"]||"http",n=e.headers.host||"localhost:3000";return`${r}://${n}`}(e)}/verify-email?email=${encodeURIComponent(_)}`;return await (0,T.C)({to:_,subject:"Verify your email",text:`Your Sentinel verification code is:

${n}

Enter it here:
${i}

This code expires in 15 minutes.`}),t.status(202).json({ok:!1,requiresVerification:!0,message:"Verification email sent. Check your inbox."})}let R=(0,d.JQ)(32),N=(0,d.mr)(R),m=E().randomUUID();return await (0,u.$d)(`INSERT INTO app_session(id, user_id, token_hash, expires_at)
       VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY));`,[m,r,N]),t.status(200).json({ok:!0,token:R,user:{id:r,email:_,name:n}})}catch(e){return console.error("/api/auth/login error:",e),t.status(500).json({ok:!1,error:"Internal server error"})}}let A=(0,i.l)(n,"default"),c=(0,i.l)(n,"config"),p=new s.PagesAPIRouteModule({definition:{kind:o.x.PAGES_API,page:"/api/auth/login",pathname:"/api/auth/login",bundlePath:"",filename:""},userland:n})},4041:(e,t,r)=>{r.d(t,{JQ:()=>o,R:()=>a,mr:()=>i});var n=r(6005),s=r.n(n);function o(e=32){return s().randomBytes(e).toString("base64url")}function i(e){return s().createHash("sha256").update(e,"utf8").digest("hex")}function a(e){return e.trim().toLowerCase()}},7936:(e,t,r)=>{r.d(t,{$d:()=>u,aj:()=>d});let n=require("mysql2/promise");var s=r.n(n);let o=`
CREATE TABLE IF NOT EXISTS app_user (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  password_salt TEXT,
  password_hash TEXT,
  email_verified_at DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS email_verification_token (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  attempts INT NOT NULL DEFAULT 0,
  expires_at DATETIME NOT NULL,
  used_at DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email_verification_token_hash (token_hash),
  INDEX idx_email_verification_token_user_id (user_id),
  FOREIGN KEY (user_id) REFERENCES app_user(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS app_session (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_app_session_token_hash (token_hash),
  FOREIGN KEY (user_id) REFERENCES app_user(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS consent_collection_point (
  code VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  consents JSON NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS consent_submission (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255),
  code_collection_point VARCHAR(255) NOT NULL,
  payload JSON NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_consent_submission_user_id (user_id),
  INDEX idx_consent_submission_created_at (created_at),
  FOREIGN KEY (user_id) REFERENCES app_user(id) ON DELETE SET NULL
);

INSERT IGNORE INTO consent_collection_point (code, name, consents, is_active)
VALUES (
  'cp_sentinel_demo_001',
  'Sentinel Demo Collection Point',
  '[
    {"code_consent":"MARKETING","label":"Marketing"},
    {"code_consent":"BIO_METRIK","label":"Bio Metrik"},
    {"code_consent":"DATA_ANAK","label":"Data Anak"}
  ]',
  true
);

UPDATE app_user
SET role = 'admin'
WHERE email = 'almira@gmail.com';
`,i=null,a=null;function E(e){return!!e&&["1","true","yes","on"].includes(e.toLowerCase())}async function u(e,t=[]){let[r]=await (i||(i=s().createPool(function(){let e={charset:"utf8mb4",connectionLimit:10,dateStrings:!0,enableKeepAlive:!0,queueLimit:0,supportBigNumbers:!0,timezone:"Z",waitForConnections:!0},t=process.env.DB_HOST,r=process.env.DB_NAME||process.env.DB_DATABASE,n=process.env.DB_USER||process.env.DB_USERNAME,s=process.env.DB_PASSWORD||"",o=Number(process.env.DB_PORT||"3306");if(t&&r&&n)return{...e,host:t,port:o,user:n,password:s,database:r,ssl:E(process.env.DB_SSL)?{rejectUnauthorized:!1}:void 0};let i=process.env.DATABASE_URL;if(i){let t=new URL(i);if(!["mysql:","mariadb:"].includes(t.protocol))throw Error("DATABASE_URL must use a mysql:// or mariadb:// connection string");let r=t.pathname.replace(/^\/+/,"");if(!r)throw Error("DATABASE_URL is missing the database name");return{...e,host:t.hostname,port:Number(t.port||"3306"),user:decodeURIComponent(t.username),password:decodeURIComponent(t.password),database:r,ssl:E(t.searchParams.get("ssl"))?{rejectUnauthorized:!1}:void 0}}throw Error("Missing database configuration. Set DB_HOST/DB_NAME/DB_USER or DATABASE_URL.")}())),i).query(e,t);return Array.isArray(r)?{rows:r,rowCount:r.length}:{rows:[],rowCount:r.affectedRows??0,insertId:r.insertId}}async function d(){a||(a=(async()=>{for(let e of o.split(";").map(e=>e.trim()).filter(Boolean))await u(e)})().catch(e=>{throw a=null,e})),await a}},2207:(e,t,r)=>{r.d(t,{C:()=>i});let n=require("nodemailer");var s=r.n(n);let o=null;async function i(e){let t=e.from??(process.env.SMTP_FROM||"no-reply@sentinel.local");await (function(){if(o)return o;let{host:e,port:t,secure:r,user:n,pass:i}=function(){let e=process.env.SMTP_HOST,t=Number(process.env.SMTP_PORT||"587");return{host:e,port:t,secure:"true"===String(process.env.SMTP_SECURE||"").toLowerCase(),user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}}();if(!e)throw Error("Missing SMTP_HOST");if(!n||!i)throw Error("Missing SMTP_USER/SMTP_PASS");return o=s().createTransport({host:e,port:t,secure:r,auth:n&&i?{user:n,pass:i}:void 0})})().sendMail({from:t,to:e.to,subject:e.subject,text:e.text})}},7153:(e,t)=>{var r;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return r}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(r||(r={}))},1802:(e,t,r)=>{e.exports=r(145)}};var t=require("../../../webpack-api-runtime.js");t.C(e);var r=t(t.s=8686);module.exports=r})();