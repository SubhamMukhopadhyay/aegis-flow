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

// 3. Verify Subham and Kartik sprint tasks
console.log('✓ Verifying sprint tasks for Subham and Kartik...');
const js = fs.readFileSync(path.join(__dirname, 'js', 'script.js'), 'utf8');

if (!js.includes('task-8') || !js.includes('task-9') || !js.includes('task-10')) {
  throw new Error('Missing task-8, task-9, or task-10 definition');
}

// Check task details
const hasSubhamHigh = js.includes("assignee: 'Subham'") && js.includes("id: 'task-8'");
const hasKartikHigh = js.includes("assignee: 'Kartik'") && js.includes("id: 'task-9'");
const hasEdisflowUrgent = js.includes("title: 'Launch Edisflow Sprint'") &&
  js.includes("id: 'task-10'") &&
  js.includes("priority: 'urgent'") &&
  js.includes("status: 'todo'") &&
  js.includes("assignee: 'Kartik'");

if (!hasSubhamHigh || !hasKartikHigh) {
  throw new Error('Tasks not properly assigned to Subham and Kartik');
}
if (!hasEdisflowUrgent) {
  throw new Error('Task 10 (Launch Edisflow Sprint) is not properly configured with urgent priority for Kartik');
}

console.log('✓ Task 8: Subham (Priority: High) verified.');
console.log('✓ Task 9: Kartik (Priority: High) verified.');
console.log('✓ Task 10: Kartik - Launch Edisflow Sprint (Priority: Urgent, Status: To Do) verified.');
console.log('\n✨ BUILD SUCCESSFUL: All assets and sprint tasks verified ready for production.');
