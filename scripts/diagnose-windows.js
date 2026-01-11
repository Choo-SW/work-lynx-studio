/**
 * Windows 파일 시스템 문제 진단 스크립트
 * .next 디렉토리의 파일 락 상태를 모니터링
 */

const fs = require('fs');
const path = require('path');

const nextDir = path.join(__dirname, '..', '.next');
const targetFile = path.join(nextDir, 'static', 'chunks', 'app', 'layout.js');

console.log('=== Windows File System Diagnostics ===\n');
console.log('Target Directory:', nextDir);
console.log('Problem File:', targetFile);
console.log('\n--- Checking File System ---\n');

// .next 디렉토리 존재 확인
if (fs.existsSync(nextDir)) {
  console.log('✓ .next directory exists');
  
  // 디렉토리 구조 출력
  try {
    const staticDir = path.join(nextDir, 'static');
    if (fs.existsSync(staticDir)) {
      console.log('✓ static directory exists');
      
      const chunksDir = path.join(staticDir, 'chunks');
      if (fs.existsSync(chunksDir)) {
        console.log('✓ chunks directory exists');
        
        const appDir = path.join(chunksDir, 'app');
        if (fs.existsSync(appDir)) {
          console.log('✓ app directory exists');
          
          // 파일 목록 출력
          const files = fs.readdirSync(appDir);
          console.log(`\nFiles in app directory (${files.length}):`);
          files.forEach(file => {
            const filePath = path.join(appDir, file);
            const stats = fs.statSync(filePath);
            console.log(`  - ${file} (${stats.size} bytes, modified: ${stats.mtime})`);
          });
          
          // 문제 파일 확인
          if (fs.existsSync(targetFile)) {
            console.log('\n✓ layout.js exists');
            
            // 파일 읽기 테스트
            try {
              const fd = fs.openSync(targetFile, 'r');
              console.log('✓ Can open file for reading');
              fs.closeSync(fd);
              console.log('✓ File handle released successfully');
            } catch (err) {
              console.error('✗ Cannot open file:', err.message);
              console.error('  Error code:', err.code);
              console.error('  Error number:', err.errno);
            }
          } else {
            console.log('\n✗ layout.js does NOT exist');
          }
        } else {
          console.log('✗ app directory does NOT exist');
        }
      } else {
        console.log('✗ chunks directory does NOT exist');
      }
    } else {
      console.log('✗ static directory does NOT exist');
    }
  } catch (err) {
    console.error('Error during diagnosis:', err.message);
  }
} else {
  console.log('✗ .next directory does NOT exist');
  console.log('\nRun "npm run dev" first to generate .next directory');
}

console.log('\n=== Diagnosis Complete ===');

// 파일 감시 시작
console.log('\n--- Starting File Watcher ---');
console.log('Watching for changes... (Press Ctrl+C to stop)\n');

let watchTimeout = null;

if (fs.existsSync(targetFile)) {
  fs.watch(targetFile, (eventType, filename) => {
    clearTimeout(watchTimeout);
    watchTimeout = setTimeout(() => {
      console.log(`[${new Date().toISOString()}] Event: ${eventType}, File: ${filename || 'layout.js'}`);
      
      // 파일 상태 확인
      try {
        if (fs.existsSync(targetFile)) {
          const stats = fs.statSync(targetFile);
          console.log(`  File size: ${stats.size} bytes`);
          console.log(`  Modified: ${stats.mtime}`);
        } else {
          console.log('  File was deleted or moved');
        }
      } catch (err) {
        console.error(`  Error checking file: ${err.message}`);
      }
    }, 100);
  });
  
  console.log('File watcher active on layout.js');
} else {
  console.log('Cannot start watcher - file does not exist yet');
}
