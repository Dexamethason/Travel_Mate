import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { swaggerSpec } from './swagger';

// Obsługa __dirname w ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Skrypt generujący plik openapi.json z dokumentacji Swagger
 */
const generateOpenApiJson = () => {
  try {
    const outputPath = path.join(__dirname, '../../openapi.json');
    
    // Konwersja specyfikacji Swagger do JSON
    const openApiJson = JSON.stringify(swaggerSpec, null, 2);
    
    // Zapis do pliku
    fs.writeFileSync(outputPath, openApiJson, 'utf-8');
    
    console.log('✅ Plik openapi.json został wygenerowany pomyślnie!');
    console.log(`📁 Lokalizacja: ${outputPath}`);
    console.log(`📊 Rozmiar: ${(Buffer.byteLength(openApiJson) / 1024).toFixed(2)} KB`);
    
    // Statystyki
    const endpoints = Object.keys(swaggerSpec.paths || {}).length;
    const schemas = Object.keys(swaggerSpec.components?.schemas || {}).length;
    const tags = (swaggerSpec.tags || []).length;
    
    console.log('\n📈 Statystyki dokumentacji:');
    console.log(`   - Endpointy: ${endpoints}`);
    console.log(`   - Schematy: ${schemas}`);
    console.log(`   - Tagi: ${tags}`);
    
  } catch (error) {
    console.error('❌ Błąd podczas generowania openapi.json:', error);
    process.exit(1);
  }
};

// Uruchomienie skryptu
generateOpenApiJson();
