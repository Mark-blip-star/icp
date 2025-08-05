import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const maxDuration = 59; // timeout: 59 seconds

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  
  try {
    // Check user authentication
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Find connections that need follow-up messages
    const now = new Date();
    const { data: connections, error } = await supabase
      .from('linkedin_connections')
      .select(`
        id,
        campaign_id,
        profile_url,
        first_name,
        status,
        requested_at,
        linkedin_campaigns (
          follow_up_message,
          follow_up_days,
          user_id
        )
      `)
      .eq('status', 'accepted')
      .is('follow_up_sent_at', null)
      .filter('linkedin_campaigns.user_id', 'eq', session.user.id);
    
    if (error) {
      console.error('Error fetching connections:', error);
      return NextResponse.json(
        { error: 'Failed to fetch connections' },
        { status: 500 }
      );
    }
    
    const connectionsToFollowUp = connections.filter(connection => {
      const acceptedDate = new Date(connection.requested_at);
      const followUpDays = connection.linkedin_campaigns.follow_up_days;
      
      // Calculate if enough days have passed for follow-up
      const daysSinceAccepted = Math.floor((now.getTime() - acceptedDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysSinceAccepted >= followUpDays;
    });
    
    if (connectionsToFollowUp.length === 0) {
      return NextResponse.json({
        message: 'No connections ready for follow-up',
      });
    }
    
    // Get LinkedIn credentials for the user
    const { data: settings, error: settingsError } = await supabase
      .from('linkedin_settings')
      .select('credentials')
      .eq('user_id', session.user.id)
      .single();
    
    if (settingsError || !settings) {
      return NextResponse.json(
        { error: 'LinkedIn credentials not found' },
        { status: 400 }
      );
    }
    
    // Begin automation to send follow-up messages
    // In production, this should be done in a background job
    setTimeout(() => {
      sendFollowUpMessages(connectionsToFollowUp, settings.credentials);
    }, 0);
    
    return NextResponse.json({
      message: `Started sending follow-up messages to ${connectionsToFollowUp.length} connections`,
      count: connectionsToFollowUp.length,
    });
    
  } catch (error: any) {
    console.error('Error in follow-up automation:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

async function sendFollowUpMessages(connections: any[], credentials: { email: string; password: string }) {
  // const supabase = createClient();
  
  // try {
  //   // Launch browser
  //   const browser = await puppeteer.launch({
  //     headless: false, // For LinkedIn, headless mode is often detected
  //     args: [
  //       '--no-sandbox',
  //       '--disable-setuid-sandbox',
  //       '--disable-dev-shm-usage',
  //       '--disable-accelerated-2d-canvas',
  //       '--disable-gpu',
  //       '--window-size=1920,1080',
  //     ],
  //     defaultViewport: {
  //       width: 1920,
  //       height: 1080,
  //     },
  //   });
    
  //   const page = await browser.newPage();
    
  //   // Set a more realistic user agent
  //   await page.setUserAgent(
  //     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36'
  //   );
    
  //   // Login to LinkedIn
  //   await page.goto('https://www.linkedin.com/login');
  //   await page.waitForSelector('#username');
    
  //   // Add random delay to mimic human behavior
  //   await randomDelay(1000, 3000);
    
  //   // Type email and password with human-like typing
  //   await humanTypeText(page, '#username', credentials.email);
  //   await randomDelay(500, 1500);
  //   await humanTypeText(page, '#password', credentials.password);
  //   await randomDelay(500, 1500);
    
  //   // Click sign in button
  //   await page.click('[type="submit"]');
    
  //   // Wait for navigation and check if there's a security check
  //   await page.waitForNavigation({ waitUntil: 'networkidle2' });
    
  //   // Check if there's a security verification
  //   const securityVerificationSelector = '[data-test-id="verification-code-input"]';
  //   const hasSecurityVerification = await page.$(securityVerificationSelector) !== null;
    
  //   if (hasSecurityVerification) {
  //     console.log('LinkedIn security verification required. Manual login needed.');
  //     // In a real implementation, you would notify the user and provide instructions
  //     // Keep browser open for manual verification
  //     await new Promise(resolve => setTimeout(resolve, 300000)); // 5 minutes
      
  //     // Check if still on verification page
  //     const stillOnVerification = await page.$(securityVerificationSelector) !== null;
  //     if (stillOnVerification) {
  //       throw new Error('LinkedIn security verification timeout');
  //     }
  //   }
    
  //   // Process each connection for follow-up
  //   for (const connection of connections) {
  //     try {
  //       // Navigate to messages page
  //       await page.goto('https://www.linkedin.com/messaging/');
  //       await page.waitForSelector('[aria-label="Compose message"]');
  //       await randomDelay(2000, 4000);
        
  //       // Click on compose message
  //       await page.click('[aria-label="Compose message"]');
  //       await randomDelay(1000, 2000);
        
  //       // Search for the connection by name
  //       const searchSelector = '[placeholder="Type a name or multiple names"]';
  //       await page.waitForSelector(searchSelector);
  //       await humanTypeText(page, searchSelector, connection.first_name);
  //       await randomDelay(2000, 3000);
        
  //       // Click the first search result
  //       const resultSelector = '[role="option"]';
  //       await page.waitForSelector(resultSelector);
  //       await page.click(resultSelector);
  //       await randomDelay(1000, 2000);
        
  //       // Click Done button
  //       await page.click('button:has-text("Done")');
  //       await randomDelay(1000, 2000);
        
  //       // Type the follow-up message
  //       const messageSelector = '[role="textbox"]';
  //       await page.waitForSelector(messageSelector);
        
  //       // Replace placeholder with actual first name
  //       const personalizedMessage = connection.linkedin_campaigns.follow_up_message
  //         .replace('{{firstName}}', connection.first_name);
        
  //       await humanTypeText(page, messageSelector, personalizedMessage);
  //       await randomDelay(1000, 2000);
        
  //       // Send the message
  //       await page.click('button:has-text("Send")');
  //       await randomDelay(3000, 5000);
        
  //       // Update the database
  //       await supabase
  //         .from('linkedin_connections')
  //         .update({
  //           status: 'followed_up',
  //           follow_up_message: personalizedMessage,
  //           follow_up_sent_at: new Date().toISOString(),
  //         })
  //         .eq('id', connection.id);
        
  //       // Add a longer delay between sending messages to avoid detection
  //       await randomDelay(15000, 30000);
  //     } catch (error) {
  //       console.error(`Error sending follow-up to ${connection.first_name}:`, error);
        
  //       // Update the database with error status
  //       await supabase
  //         .from('linkedin_connections')
  //         .update({
  //           status: 'follow_up_failed',
  //           follow_up_error: error instanceof Error ? error.message : 'Unknown error',
  //         })
  //         .eq('id', connection.id);
        
  //       // Continue with next connection
  //       continue;
  //     }
  //   }
    
  //   // Close browser
  //   await browser.close();
    
  // } catch (error) {
  //   console.error('Error in follow-up automation:', error);
  // }
}

// Helper function for random delay
async function randomDelay(min: number, max: number) {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
}

// Helper function for human-like typing
async function humanTypeText(page: any, selector: string, text: string) {
  await page.focus(selector);
  
  // Clear any existing text
  await page.evaluate((selector: string) => {
    (document.querySelector(selector) as HTMLInputElement).value = '';
  }, selector);
  
  // Type text with random delays between keystrokes
  for (const char of text) {
    await page.type(selector, char, { delay: Math.random() * 100 + 30 });
  }
} 