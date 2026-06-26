const { spawn } = require('child_process');
const path = require('path');

// Projenin kök dizini
const rootDir = __dirname;

// Backend klasörünün yolu
const backendDir = path.join(rootDir, 'backend');
// Frontend klasörünün yolu
const frontendDir = path.join(rootDir, 'frontend');

console.log('🚀 SubTracker Uygulaması Başlatılıyor...\n');

// Prefix ekleyerek çıktıları renklendiren yardımcı fonksiyon
function logWithPrefix(prefix, color, data) {
  const lines = data.toString().split('\n').filter(line => line.trim() !== '');
  for (const line of lines) {
    console.log(`${color}[${prefix}]\x1b[0m ${line}`);
  }
}

// Komut çalıştıran fonksiyon
function runCommand(command, args, cwd, prefix, color) {
  const process = spawn(command, args, { cwd, shell: true });

  process.stdout.on('data', (data) => {
    logWithPrefix(prefix, color, data);
  });

  process.stderr.on('data', (data) => {
    logWithPrefix(prefix, '\x1b[31m', data); // Kırmızı
  });

  process.on('close', (code) => {
    console.log(`${color}[${prefix}]\x1b[0m kapandı (Kod: ${code})`);
  });

  return process;
}

// Backend sunucusunu başlat (Mavi prefix)
const backend = runCommand('npm', ['run', 'dev'], backendDir, 'BACKEND', '\x1b[34m');

// Frontend sunucusunu başlat (Yeşil prefix)
const frontend = runCommand('npm', ['run', 'dev'], frontendDir, 'FRONTEND', '\x1b[32m');

// Uygulama sonlandırıldığında alt işlemleri de kapat
process.on('SIGINT', () => {
  console.log('\n🛑 Kapatılıyor...');
  backend.kill('SIGINT');
  frontend.kill('SIGINT');
  process.exit();
});

process.on('SIGTERM', () => {
  backend.kill('SIGTERM');
  frontend.kill('SIGTERM');
  process.exit();
});
