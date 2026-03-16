import nodemailer from "nodemailer"

type SendEmailParams = {
  to: string
  subject: string
  text: string
  from?: string
}

function smtpConfig() {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || "587")
  const secure = String(process.env.SMTP_SECURE || "").toLowerCase() === "true"
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  return { host, port, secure, user, pass }
}

function defaultFrom() {
  return process.env.SMTP_FROM || "no-reply@sentinel.local"
}

let transporter: nodemailer.Transporter | null = null

function getTransporter() {
  if (transporter) return transporter
  const { host, port, secure, user, pass } = smtpConfig()
  if (!host) throw new Error("Missing SMTP_HOST")
  if (!user || !pass) throw new Error("Missing SMTP_USER/SMTP_PASS")
  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined,
  })
  return transporter
}

export async function sendEmail(params: SendEmailParams) {
  const from = params.from ?? defaultFrom()
  await getTransporter().sendMail({
    from,
    to: params.to,
    subject: params.subject,
    text: params.text,
  })
}
