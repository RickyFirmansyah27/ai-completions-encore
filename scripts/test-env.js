#!/usr/bin/env node

// Simple script to test environment variable loading
import { config } from 'dotenv';

// Load .env file
config();

console.log('🔍 Environment Variable Test');
console.log('============================');
console.log(`GROQ_API_KEY: ${process.env.GROQ_API_KEY ? '✅ Found' : '❌ Not found'}`);
console.log(`DEFAULT_MODEL: ${process.env.DEFAULT_MODEL || 'Not set'}`);
console.log(`LOG_LEVEL: ${process.env.LOG_LEVEL || 'Not set'}`);
console.log('============================');

if (!process.env.GROQ_API_KEY) {
  console.log('❌ GROQ_API_KEY is missing!');
  console.log('Make sure your .env file exists and contains:');
  console.log('GROQ_API_KEY=your_api_key_here');
} else {
  console.log('✅ Environment variables loaded successfully!');
}