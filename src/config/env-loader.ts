import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

 
class EnvLoader {
  private static loaded = false;

   
  static load(): void {
    if (this.loaded) {
      return;
    }

    try {
      // Try to load from project root
      const result = config();
      
      if (result.error) {
        // If failed, try alternative paths
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        
        // Try from config directory
        const envPath1 = path.resolve(__dirname, '../../.env');
        const result1 = config({ path: envPath1 });
        
        if (result1.error) {
          // Try from project root relative to config
          const envPath2 = path.resolve(process.cwd(), '.env');
          const result2 = config({ path: envPath2 });
          
          if (result2.error) {
            console.warn('Warning: Could not load .env file from any location');
          }
        }
      }
      
      this.loaded = true;
    } catch (error) {
      console.error('Error loading environment variables:', error);
    }
  }

   
  static get(key: string, defaultValue?: string): string {
    this.load();
    return process.env[key] || defaultValue || '';
  }

   
  static has(key: string): boolean {
    this.load();
    return !!process.env[key];
  }

   
  static getByPrefix(prefix: string): Record<string, string> {
    this.load();
    const result: Record<string, string> = {};
    
    Object.keys(process.env).forEach(key => {
      if (key.startsWith(prefix)) {
        result[key] = process.env[key] || '';
      }
    });
    
    return result;
  }
}

// Load environment variables immediately when this module is imported
EnvLoader.load();

export { EnvLoader };