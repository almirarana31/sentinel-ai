"use strict";(()=>{var e={};e.id=9351,e.ids=[9351],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},6005:e=>{e.exports=require("node:crypto")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,r){return r in t?t[r]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,r)):"function"==typeof t&&"default"===r?t:void 0}}})},9462:(e,t,r)=>{r.r(t),r.d(t,{config:()=>A,default:()=>T,routeModule:()=>_});var o={};r.r(o),r.d(o,{default:()=>d});var i=r(1802),a=r(7153),n=r(6249),s=r(7936),E=r(4041);async function d(e,t){if("POST"!==e.method)return t.status(405).json({ok:!1,error:"Method not allowed"});let r="string"==typeof e.body?JSON.parse(e.body):e.body,o=(0,E.R)(String(r?.email||"")),i=String(r?.code||"");if(!o.includes("@"))return t.status(400).json({ok:!1,error:"Invalid email"});if(!i)return t.status(400).json({ok:!1,error:"Missing code"});await (0,s.aj)();let a=(await (0,s.$d)("SELECT id FROM app_user WHERE email = ? LIMIT 1;",[o])).rows[0];if(!a)return t.status(404).json({ok:!1,error:"User not found"});let n=(await (0,s.$d)(`
    SELECT id, token_hash, attempts
    FROM email_verification_token
    WHERE user_id = ?
      AND used_at IS NULL
      AND expires_at > NOW()
    ORDER BY created_at DESC
    LIMIT 1;
    `,[a.id])).rows[0];return n?n.attempts>=10?t.status(429).json({ok:!1,error:"Too many attempts. Please resend a new code."}):(0,E.mr)(i)!==n.token_hash?(await (0,s.$d)("UPDATE email_verification_token SET attempts = attempts + 1 WHERE id = ?;",[n.id]),t.status(400).json({ok:!1,error:"Invalid or expired code"})):(await (0,s.$d)("UPDATE app_user SET email_verified_at = NOW() WHERE id = ?;",[a.id]),await (0,s.$d)("UPDATE email_verification_token SET used_at = NOW() WHERE id = ?;",[n.id]),t.status(200).json({ok:!0})):t.status(400).json({ok:!1,error:"Invalid or expired code"})}let T=(0,n.l)(o,"default"),A=(0,n.l)(o,"config"),_=new i.PagesAPIRouteModule({definition:{kind:a.x.PAGES_API,page:"/api/auth/verify-email",pathname:"/api/auth/verify-email",bundlePath:"",filename:""},userland:o})},4041:(e,t,r)=>{r.d(t,{JQ:()=>a,R:()=>s,mr:()=>n});var o=r(6005),i=r.n(o);function a(e=32){return i().randomBytes(e).toString("base64url")}function n(e){return i().createHash("sha256").update(e,"utf8").digest("hex")}function s(e){return e.trim().toLowerCase()}},7936:(e,t,r)=>{r.d(t,{$d:()=>d,aj:()=>T});let o=require("mysql2/promise");var i=r.n(o);let a=`
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
`,n=null,s=null;function E(e){return!!e&&["1","true","yes","on"].includes(e.toLowerCase())}async function d(e,t=[]){let[r]=await (n||(n=i().createPool(function(){let e={charset:"utf8mb4",connectionLimit:10,dateStrings:!0,enableKeepAlive:!0,queueLimit:0,supportBigNumbers:!0,timezone:"Z",waitForConnections:!0},t=process.env.DB_HOST,r=process.env.DB_NAME||process.env.DB_DATABASE,o=process.env.DB_USER||process.env.DB_USERNAME,i=process.env.DB_PASSWORD||"",a=Number(process.env.DB_PORT||"3306");if(t&&r&&o)return{...e,host:t,port:a,user:o,password:i,database:r,ssl:E(process.env.DB_SSL)?{rejectUnauthorized:!1}:void 0};let n=process.env.DATABASE_URL;if(n){let t=new URL(n);if(!["mysql:","mariadb:"].includes(t.protocol))throw Error("DATABASE_URL must use a mysql:// or mariadb:// connection string");let r=t.pathname.replace(/^\/+/,"");if(!r)throw Error("DATABASE_URL is missing the database name");return{...e,host:t.hostname,port:Number(t.port||"3306"),user:decodeURIComponent(t.username),password:decodeURIComponent(t.password),database:r,ssl:E(t.searchParams.get("ssl"))?{rejectUnauthorized:!1}:void 0}}throw Error("Missing database configuration. Set DB_HOST/DB_NAME/DB_USER or DATABASE_URL.")}())),n).query(e,t);return Array.isArray(r)?{rows:r,rowCount:r.length}:{rows:[],rowCount:r.affectedRows??0,insertId:r.insertId}}async function T(){s||(s=(async()=>{for(let e of a.split(";").map(e=>e.trim()).filter(Boolean))await d(e)})().catch(e=>{throw s=null,e})),await s}},7153:(e,t)=>{var r;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return r}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(r||(r={}))},1802:(e,t,r)=>{e.exports=r(145)}};var t=require("../../../webpack-api-runtime.js");t.C(e);var r=t(t.s=9462);module.exports=r})();