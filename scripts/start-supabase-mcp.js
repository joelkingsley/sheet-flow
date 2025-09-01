#!/usr/bin/env node

// Script to start Supabase MCP server with environment variable for access token
// This allows us to keep the access token out of the committed mcp.json file

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Read environment variables from .env file
function loadEnvFile() {
  const envPath = path.join(__dirname, '.env');
  
  if (!fs.existsSync(envPath)) {
    console.error('Error: .env file not found. Please copy .env.template to .env and add your tokens.');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...valueParts] = trimmed.split('=');
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  });
  
  return envVars;
}

// Load environment variables
const envVars = loadEnvFile();

// Check if Supabase access token is available
if (!envVars.SUPABASE_ACCESS_TOKEN || envVars.SUPABASE_ACCESS_TOKEN === 'your_supabase_access_token_here') {
  console.error('Error: SUPABASE_ACCESS_TOKEN not found or not set in .env file');
  process.exit(1);
}

// Start the Supabase MCP server with the access token from environment
const args = [
  '-y',
  '@supabase/mcp-server-supabase@latest',
  '--access-token',
  envVars.SUPABASE_ACCESS_TOKEN
];

console.log('Starting Supabase MCP server...');
const child = spawn('npx', args, {
  stdio: 'inherit',
  env: { ...process.env, ...envVars }
});

child.on('error', (error) => {
  console.error('Failed to start Supabase MCP server:', error);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
