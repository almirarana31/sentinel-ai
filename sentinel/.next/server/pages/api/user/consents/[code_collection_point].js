"use strict";(()=>{var e={};e.id=1567,e.ids=[1567],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},6005:e=>{e.exports=require("node:crypto")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,n){return n in t?t[n]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,n)):"function"==typeof t&&"default"===n?t:void 0}}})},6011:(e,t,n)=>{n.r(t),n.d(t,{config:()=>u,default:()=>d,routeModule:()=>c});var o={};n.r(o),n.d(o,{default:()=>_});var r=n(1802),s=n(7153),i=n(6249),a=n(6005),E=n.n(a),A=n(7936),T=n(4041);async function _(e,t){if("POST"!==e.method)return t.status(405).json({ok:!1,error:"Method not allowed"});let n=String(e.query.code_collection_point||"");if(!n)return t.status(400).json({ok:!1,error:"Missing code_collection_point"});let o=function(e){let t=(e.headers.authorization||"").match(/^Bearer\s+(.+)$/i);return t?.[1]||""}(e);if(!o)return t.status(401).json({ok:!1,error:"Missing Authorization Bearer token"});await (0,A.aj)();let r=(0,T.mr)(o),s=(await (0,A.$d)(`
    SELECT user_id
    FROM app_session
    WHERE token_hash = ?
      AND expires_at > NOW()
    ORDER BY created_at DESC
    LIMIT 1;
    `,[r])).rows[0];if(!s)return t.status(401).json({ok:!1,error:"Invalid or expired session"});let i="string"==typeof e.body?JSON.parse(e.body):e.body;return await (0,A.$d)(`INSERT INTO consent_submission(id, user_id, code_collection_point, payload)
     VALUES (?, ?, ?, ?);`,[E().randomUUID(),s.user_id,n,JSON.stringify(i??{})]),t.status(200).json({ok:!0})}let d=(0,i.l)(o,"default"),u=(0,i.l)(o,"config"),c=new r.PagesAPIRouteModule({definition:{kind:s.x.PAGES_API,page:"/api/user/consents/[code_collection_point]",pathname:"/api/user/consents/[code_collection_point]",bundlePath:"",filename:""},userland:o})},4041:(e,t,n)=>{n.d(t,{JQ:()=>s,R:()=>a,mr:()=>i});var o=n(6005),r=n.n(o);function s(e=32){return r().randomBytes(e).toString("base64url")}function i(e){return r().createHash("sha256").update(e,"utf8").digest("hex")}function a(e){return e.trim().toLowerCase()}},7936:(e,t,n)=>{n.d(t,{$d:()=>A,aj:()=>T});let o=require("mysql2/promise");var r=n.n(o);let s=`
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
`,i=null,a=null;function E(e){return!!e&&["1","true","yes","on"].includes(e.toLowerCase())}async function A(e,t=[]){let[n]=await (i||(i=r().createPool(function(){let e={charset:"utf8mb4",connectionLimit:10,dateStrings:!0,enableKeepAlive:!0,queueLimit:0,supportBigNumbers:!0,timezone:"Z",waitForConnections:!0},t=process.env.DB_HOST,n=process.env.DB_NAME||process.env.DB_DATABASE,o=process.env.DB_USER||process.env.DB_USERNAME,r=process.env.DB_PASSWORD||"",s=Number(process.env.DB_PORT||"3306");if(t&&n&&o)return{...e,host:t,port:s,user:o,password:r,database:n,ssl:E(process.env.DB_SSL)?{rejectUnauthorized:!1}:void 0};let i=process.env.DATABASE_URL;if(i){let t=new URL(i);if(!["mysql:","mariadb:"].includes(t.protocol))throw Error("DATABASE_URL must use a mysql:// or mariadb:// connection string");let n=t.pathname.replace(/^\/+/,"");if(!n)throw Error("DATABASE_URL is missing the database name");return{...e,host:t.hostname,port:Number(t.port||"3306"),user:decodeURIComponent(t.username),password:decodeURIComponent(t.password),database:n,ssl:E(t.searchParams.get("ssl"))?{rejectUnauthorized:!1}:void 0}}throw Error("Missing database configuration. Set DB_HOST/DB_NAME/DB_USER or DATABASE_URL.")}())),i).query(e,t);return Array.isArray(n)?{rows:n,rowCount:n.length}:{rows:[],rowCount:n.affectedRows??0,insertId:n.insertId}}async function T(){a||(a=(async()=>{for(let e of s.split(";").map(e=>e.trim()).filter(Boolean))await A(e)})().catch(e=>{throw a=null,e})),await a}},7153:(e,t)=>{var n;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return n}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(n||(n={}))},1802:(e,t,n)=>{e.exports=n(145)}};var t=require("../../../../webpack-api-runtime.js");t.C(e);var n=t(t.s=6011);module.exports=n})();