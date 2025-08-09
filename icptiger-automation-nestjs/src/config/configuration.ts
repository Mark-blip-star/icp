import * as os from 'os';

export interface AppConfig {
  environment: string;
  port: number;
  socketPort: number;
  supabase: {
    url: string;
    key: string;
  };
  redis: {
    url: string;
    host: string;
    port: number;
  };
  browser: {
    executablePath?: string;
    headless: boolean;
    defaultViewport: {
      width: number;
      height: number;
    };
  };
}

function getDefaultChromePath(): string | undefined {
  const platform = os.platform();

  switch (platform) {
    case 'darwin': // macOS
      return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    case 'win32': // Windows
      return 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    case 'linux': // Linux
      return '/usr/bin/google-chrome';
    default:
      return undefined;
  }
}

export default (): AppConfig => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Missing required environment variables: SUPABASE_URL and SUPABASE_KEY',
    );
  }

  return {
    environment: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    socketPort: parseInt(process.env.SOCKET_PORT || '3008', 10),
    supabase: {
      url: supabaseUrl,
      key: supabaseKey,
    },
    redis: {
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
    },
    browser: {
      executablePath:
        process.env.CHROME_EXECUTABLE_PATH || getDefaultChromePath(),
      headless: process.env.HEADLESS !== 'false',
      defaultViewport: {
        width: parseInt(process.env.VIEWPORT_WIDTH || '800', 10),
        height: parseInt(process.env.VIEWPORT_HEIGHT || '1200', 10),
      },
    },
  };
};
