import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const execPromise = promisify(exec);

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to run a script and log its output
const runScript = async (scriptName) => {
  console.log(`\n=== Running ${scriptName} ===\n`);
  
  try {
    const scriptPath = path.join(__dirname, scriptName);
    const { stdout, stderr } = await execPromise(`node ${scriptPath}`);
    
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    
    console.log(`\n=== Completed ${scriptName} ===\n`);
    return true;
  } catch (error) {
    console.error(`Error running ${scriptName}:`, error.message);
    return false;
  }
};

// Main function to run all setup scripts
const setupDemoEnvironment = async () => {
  console.log('Setting up demo environment...\n');
  
  // First ensure admin account exists
  const adminSetupSuccess = await runScript('ensure-admin-account.js');
  
  if (!adminSetupSuccess) {
    console.error('Failed to set up admin account. Aborting setup.');
    return;
  }
  
  // Then create demo shops and products
  const shopsSetupSuccess = await runScript('create-demo-shops.js');
  
  if (!shopsSetupSuccess) {
    console.error('Failed to set up demo shops. Setup incomplete.');
    return;
  }
  
  console.log('\n=== Demo Environment Setup Complete ===');
  console.log('\nAdmin Account:');
  console.log('Email: admin@example.com');
  console.log('Password: password123');
  
  console.log('\nDemo Shop Accounts:');
  console.log('1. Raj Grocery Store');
  console.log('   Email: raj@grocery.com');
  console.log('   Password: password123');
  
  console.log('\n2. Priya Fashion Boutique');
  console.log('   Email: priya@fashion.com');
  console.log('   Password: password123');
  
  console.log('\n3. Sharma Electronics');
  console.log('   Email: sharma@electronics.com');
  console.log('   Password: password123');
  
  console.log('\n4. Patel Bakery & Confectionery');
  console.log('   Email: patel@bakery.com');
  console.log('   Password: password123');
  
  console.log('\nAll shops are approved and have products added.');
  console.log('You can log in with any of these accounts to access their respective dashboards.');
  console.log('All shops will be visible in the admin panel.');
};

// Run the setup
setupDemoEnvironment();
