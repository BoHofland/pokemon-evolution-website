import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET() {
  try {
    // Lees het CSV bestand uit de public directory
    const dataPath = path.join(process.cwd(), 'public', 'pokemon.csv');
    const fileContent = await fs.readFile(dataPath, 'utf-8');
    
    // Converteer CSV naar JSON
    const pokemonData = parseCSV(fileContent);
    
    return NextResponse.json(pokemonData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Fout bij het laden van Pokemon data' },
      { status: 500 }
    );
  }
}

// Helper functie om CSV te parsen
function parseCSV(csvContent) {
  // Implementeer hier je CSV parsing logica
  // Dit is een voorbeeld; je moet dit aanpassen aan je specifieke CSV structuur
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return headers.reduce((obj, header, index) => {
      obj[header.trim()] = values[index]?.trim();
      return obj;
    }, {});
  });
} 