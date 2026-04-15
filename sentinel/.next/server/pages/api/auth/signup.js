"use strict";(()=>{var e={};e.id=7011,e.ids=[7011],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},6005:e=>{e.exports=require("node:crypto")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,r){return r in t?t[r]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,r)):"function"==typeof t&&"default"===r?t:void 0}}})},2621:(e,t,r)=>{r.r(t),r.d(t,{config:()=>l,default:()=>A,routeModule:()=>_});var n={};r.r(n),r.d(n,{default:()=>d});var o=r(1802),s=r(7153),i=r(6249),a=r(6005),E=r.n(a),u=r(7936),T=r(4041),c=r(2207);async function d(e,t){try{if("POST"!==e.method)return t.status(405).json({ok:!1,error:"Method not allowed"});let r="string"==typeof e.body?JSON.parse(e.body):e.body,n=(0,T.R)(String(r?.email||"")),o=String(r?.password||""),s=String(r?.name||"");if(!n.includes("@"))return t.status(400).json({ok:!1,error:"Invalid email"});if(s.trim().length<2)return t.status(400).json({ok:!1,error:"Name is required"});if(o.length<8)return t.status(400).json({ok:!1,error:"Password must be at least 8 characters"});if(await (0,u.aj)(),(await (0,u.$d)("SELECT id, email_verified_at FROM app_user WHERE email = ? LIMIT 1;",[n])).rows.length>0)return t.status(409).json({ok:!1,error:"Account already exists. Please sign in."});let i=E().randomBytes(16).toString("hex"),a=E().scryptSync(o,i,32).toString("hex"),d=E().randomUUID();await (0,u.$d)(`INSERT INTO app_user(id, email, name, password_salt, password_hash)
       VALUES (?, ?, ?, ?, ?);`,[d,n,s.trim(),i,a]);let A=String(E().randomInt(1e5,1e6)),l=(0,T.mr)(A),_=E().randomUUID();await (0,u.$d)(`INSERT INTO email_verification_token(id, user_id, token_hash, expires_at)
       VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL ? MINUTE));`,[_,d,l,15]);let R=`${function(e){let t="http://localhost:3000";if(t)return t.replace(/\/+$/,"");let r=e.headers["x-forwarded-proto"]||"http",n=e.headers.host||"localhost:3000";return`${r}://${n}`}(e)}/verify-email?email=${encodeURIComponent(n)}`;return await (0,c.C)({to:n,subject:"Verify your email",text:`Your Sentinel verification code is:

${A}

Enter it here:
${R}

This code expires in 15 minutes.`}),t.status(201).json({ok:!1,requiresVerification:!0,message:"Verification code sent. Check your inbox."})}catch(e){return console.error("/api/auth/signup error:",e),t.status(500).json({ok:!1,error:"Internal server error"})}}let A=(0,i.l)(n,"default"),l=(0,i.l)(n,"config"),_=new o.PagesAPIRouteModule({definition:{kind:s.x.PAGES_API,page:"/api/auth/signup",pathname:"/api/auth/signup",bundlePath:"",filename:""},userland:n})},4041:(e,t,r)=>{r.d(t,{JQ:()=>s,R:()=>a,mr:()=>i});var n=r(6005),o=r.n(n);function s(e=32){return o().randomBytes(e).toString("base64url")}function i(e){return o().createHash("sha256").update(e,"utf8").digest("hex")}function a(e){return e.trim().toLowerCase()}},7936:(e,t,r)=>{r.d(t,{$d:()=>u,aj:()=>T});let n=require("mysql2/promise");var o=r.n(n);let s=`
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
`,i=null,a=null;function E(e){return!!e&&["1","true","yes","on"].includes(e.toLowerCase())}async function u(e,t=[]){let[r]=await (i||(i=o().createPool(function(){let e={charset:"utf8mb4",connectionLimit:10,dateStrings:!0,enableKeepAlive:!0,queueLimit:0,supportBigNumbers:!0,timezone:"Z",waitForConnections:!0},t=process.env.DB_HOST,r=process.env.DB_NAME||process.env.DB_DATABASE,n=process.env.DB_USER||process.env.DB_USERNAME,o=process.env.DB_PASSWORD||"",s=Number(process.env.DB_PORT||"3306");if(t&&r&&n)return{...e,host:t,port:s,user:n,password:o,database:r,ssl:E(process.env.DB_SSL)?{rejectUnauthorized:!1}:void 0};let i=process.env.DATABASE_URL;if(i){let t=new URL(i);if(!["mysql:","mariadb:"].includes(t.protocol))throw Error("DATABASE_URL must use a mysql:// or mariadb:// connection string");let r=t.pathname.replace(/^\/+/,"");if(!r)throw Error("DATABASE_URL is missing the database name");return{...e,host:t.hostname,port:Number(t.port||"3306"),user:decodeURIComponent(t.username),password:decodeURIComponent(t.password),database:r,ssl:E(t.searchParams.get("ssl"))?{rejectUnauthorized:!1}:void 0}}throw Error("Missing database configuration. Set DB_HOST/DB_NAME/DB_USER or DATABASE_URL.")}())),i).query(e,t);return Array.isArray(r)?{rows:r,rowCount:r.length}:{rows:[],rowCount:r.affectedRows??0,insertId:r.insertId}}async function T(){a||(a=(async()=>{for(let e of s.split(";").map(e=>e.trim()).filter(Boolean))await u(e)})().catch(e=>{throw a=null,e})),await a}},2207:(e,t,r)=>{r.d(t,{C:()=>i});let n=require("nodemailer");var o=r.n(n);let s=null;async function i(e){let t=e.from??(process.env.SMTP_FROM||"no-reply@sentinel.local");await (function(){if(s)return s;let{host:e,port:t,secure:r,user:n,pass:i}=function(){let e=process.env.SMTP_HOST,t=Number(process.env.SMTP_PORT||"587");return{host:e,port:t,secure:"true"===String(process.env.SMTP_SECURE||"").toLowerCase(),user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}}();if(!e)throw Error("Missing SMTP_HOST");if(!n||!i)throw Error("Missing SMTP_USER/SMTP_PASS");return s=o().createTransport({host:e,port:t,secure:r,auth:n&&i?{user:n,pass:i}:void 0})})().sendMail({from:t,to:e.to,subject:e.subject,text:e.text})}},7153:(e,t)=>{var r;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return r}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(r||(r={}))},1802:(e,t,r)=>{e.exports=r(145)}};var t=require("../../../webpack-api-runtime.js");t.C(e);var r=t(t.s=2621);module.exports=r})();