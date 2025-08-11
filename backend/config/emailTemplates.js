// utils/emailTemplates.js
export const incompleteQuizTemplate = (audienceName, quizTitle, completionLink) => `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
    <h2>Hi ${audienceName || 'there'},</h2>
    <p>We noticed you haven’t completed the quiz <strong>"${quizTitle}"</strong>.</p>
    <p>Your input is important! Please take a few minutes to complete it.</p>
    <a href="${completionLink}" style="
      display: inline-block;
      background-color: #007BFF;
      color: white;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 4px;
    ">
      Complete the Quiz
    </a>
    <p style="margin-top: 20px;">Thank you,<br>The Aneuro Team</p>
  </div>
`;
