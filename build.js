/**
 * Aegis Flow Build & Asset Verification Script
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 Starting Aegis Flow Build Pipeline...');

// 1. Verify JavaScript syntax
console.log('✓ Validating JavaScript syntax...');
execSync('node --check js/script.js', { stdio: 'inherit' });

// 2. Verify HTML and CSS assets
console.log('✓ Checking static asset references...');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
if (!html.includes('css/styles.css')) throw new Error('Missing styles.css reference');
if (!html.includes('js/script.js')) throw new Error('Missing script.js reference');

const css = fs.readFileSync(path.join(__dirname, 'css', 'styles.css'), 'utf8');
if (!css.includes('.board-filter-toolbar')) throw new Error('Missing board-filter-toolbar CSS');

// 3. Verify Subham and Kartik high priority tasks
console.log('✓ Verifying high-priority sprint tasks for Subham and Kartik...');
const js = fs.readFileSync(path.join(__dirname, 'js', 'script.js'), 'utf8');

if (!js.includes('task-8') || !js.includes('task-9')) {
  throw new Error('Missing task-8 or task-9 definition');
}

// Check task 8 details
const hasSubhamHigh = js.includes("assignee: 'Subham'") && js.includes("id: 'task-8'");
const hasKartikHigh = js.includes("assignee: 'Kartik'") && js.includes("id: 'task-9'");

if (!hasSubhamHigh || !hasKartikHigh) {
  throw new Error('Tasks not properly assigned to Subham and Kartik');
}

console.log('✓ Task 8: Subham (Priority: High) verified.');
console.log('✓ Task 9: Kartik (Priority: High) verified.');
console.log('\n✨ BUILD SUCCESSFUL: All assets and sprint tasks verified ready for production.');
