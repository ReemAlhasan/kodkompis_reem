/**
 * Google Apps Script for AI Chatbot API Proxy
 * This script acts as a secure proxy between your website and OpenAI API
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://script.google.com
 * 2. Create a new project
 * 3. Paste this code
 * 4. Replace YOUR_OPENAI_API_KEY with your actual OpenAI API key
 * 5. Deploy as web app with:
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy the web app URL and set it as CHATBOT_API_ENDPOINT in index.html
 */

// ⚠️ REPLACE THIS WITH YOUR OPENAI API KEY
const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY';

// OpenAI API endpoint
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Model to use (you can change to gpt-4, gpt-4-turbo, etc.)
const MODEL = 'gpt-3.5-turbo'; // or 'gpt-4' for better responses

/**
 * Handle POST requests from the chatbot
 */
function doPost(e) {
  try {
    // Parse request
    const requestData = JSON.parse(e.postData.contents);
    const messages = requestData.messages || [];
    const language = requestData.language || 'svenska';

    // Validate messages
    if (!messages || messages.length === 0) {
      return ContentService.createTextOutput(JSON.stringify({
        error: 'No messages provided'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Call OpenAI API
    const response = callOpenAI(messages, language);

    // Return response
    return ContentService.createTextOutput(JSON.stringify({
      response: response,
      success: true
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Chatbot API error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      error: error.toString(),
      success: false
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'Chatbot API is running',
    message: 'Use POST method to send messages'
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Call OpenAI API
 */
function callOpenAI(messages, language) {
  try {
    // Prepare request
    const payload = {
      model: MODEL,
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
      stream: false
    };

    // Make API call
    const options = {
      method: 'post',
      headers: {
        'Authorization': 'Bearer ' + OPENAI_API_KEY,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(OPENAI_API_URL, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();

    if (responseCode !== 200) {
      Logger.log('OpenAI API error: ' + responseText);
      throw new Error('OpenAI API returned error: ' + responseCode);
    }

    const data = JSON.parse(responseText);
    
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content.trim();
    } else {
      throw new Error('No response from OpenAI');
    }

  } catch (error) {
    Logger.log('OpenAI call error: ' + error.toString());
    throw error;
  }
}

/**
 * Test function - run this to verify your setup
 */
function testChatbot() {
  const testMessages = [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Hello, how are you?' }
  ];
  
  try {
    const response = callOpenAI(testMessages, 'svenska');
    Logger.log('Test successful! Response: ' + response);
    return response;
  } catch (error) {
    Logger.log('Test failed: ' + error.toString());
    return 'Test failed: ' + error.toString();
  }
}

