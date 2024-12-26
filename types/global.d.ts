// Move this interface declaration to a separate types file (e.g., types/global.d.ts)
interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
      };
    }
  }
  
  // Or if you prefer to keep it in the same file, use module augmentation:
  declare global {
    interface Window {
      Telegram?: {
        WebApp?: {
          initData: string;
        };
      }
    }
  }
  
  export {}  // This makes the file a module