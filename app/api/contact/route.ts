import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'arkansasdj@gmail.com', // Replace with your Gmail
    pass: process.env.GMAIL_APP_PASSWORD // Create an app password in Gmail settings
  }
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    const mailOptions = {
      from: email,
      to: 'arkansasdj@gmail.com',
      subject: `New Contact Form Submission from ${name}`,
      text: message,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email error:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
} 