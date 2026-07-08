import fetch from "node-fetch";

export const sendEmail = async ({ to, subject, html, text }) => {
  const url = "https://api.elasticemail.com/v2/email/send";

  const params = new URLSearchParams({
    apikey: process.env.ELASTIC_API_KEY,
    from: process.env.ELASTIC_FROM_EMAIL, 
    fromName: "Ethiopian Voting System",
    to,
    subject,
    bodyHtml: html,   
    bodyText: text,   
    isTransactional: "true"
  });

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString()
  });

  const textRes = await res.text();

  let data;
  try {
    data = JSON.parse(textRes);
  } catch {
    console.error("Elastic returned non-JSON:", textRes);
    throw new Error("Elastic Email returned invalid response");
  }

  if (!data.success) {
    console.error("Elastic Email error:", data.error);
    throw new Error("Failed to send email");
  }

  return data;
};
