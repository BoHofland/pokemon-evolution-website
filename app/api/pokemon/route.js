import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET() {
  try {
    // Log het volledige pad voor debugging
    const dataPath = path.join(process.cwd(), 'public', 'pokemon.csv');
    console.log('Probeer bestand te lezen van:', dataPath);

    // Controleer of het bestand bestaat
    try {
      await fs.access(dataPath);
    } catch (error) {
      console.error('Bestand bestaat niet:', error);
      return NextResponse.json(
        { error: 'Pokemon data bestand niet gevonden' },
        { status: 404 }
      );
    }

    // Lees het bestand
    const fileContent = await fs.readFile(dataPath, 'utf-8');
    
    if (!fileContent) {
      console.error('Leeg bestand gelezen');
      return NextResponse.json(
        { error: 'Pokemon data bestand is leeg' },
        { status: 500 }
      );
    }

    // Parse de data
    const pokemonData = parseCSV(fileContent);
    
    if (!pokemonData || pokemonData.length === 0) {
      console.error('Geen Pokemon data geparsed');
      return NextResponse.json(
        { error: 'Kon Pokemon data niet verwerken' },
        { status: 500 }
      );
    }

    return NextResponse.json(pokemonData);
    
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Fout bij het laden van Pokemon data: ' + error.message },
      { status: 500 }
    );
  }
}

// Helper functie om CSV te parsen
function parseCSV(csvContent) {
  if (!csvContent) {
    console.error('Geen CSV content om te parsen');
    return [];
  }

  try {
    // Split op nieuwe regels, filter lege regels
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      console.error('Geen regels gevonden in CSV');
      return [];
    }

    // Haal headers op en verwijder witruimte
    const headers = lines[0].split(',').map(header => header.trim());
    
    // Parse de data regels
    return lines.slice(1)
      .filter(line => line.trim()) // Filter lege regels
      .map(line => {
        // Split de regel, maar houd rekening met komma's binnen aanhalingstekens
        const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
        
        return headers.reduce((obj, header, index) => {
          // Verwijder aanhalingstekens en maak waarden netjes
          let value = values[index] || '';
          value = value.replace(/^"|"$/g, '').trim();
          
          // Zet arrays om naar echte arrays
          if (value.startsWith('[') && value.endsWith(']')) {
            try {
              value = JSON.parse(value.replace(/'/g, '"'));
            } catch {
              value = value.slice(1, -1).split(',').map(v => v.trim());
            }
          }
          
          obj[header] = value;
          return obj;
        }, {});
      })
      .filter(pokemon => pokemon.name); // Filter ongeldige entries
  } catch (error) {
    console.error('Error parsing CSV:', error);
    return [];
  }
} 