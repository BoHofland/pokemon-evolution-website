import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET() {
  try {
    // Log het volledige pad
    const dataPath = path.join(process.cwd(), 'public', 'pokemon.csv');
    console.log('Volledig pad naar bestand:', dataPath);

    // Controleer of het bestand bestaat
    try {
      await fs.access(dataPath);
      console.log('Bestand bestaat!');
    } catch (error) {
      console.error('Bestand bestaat niet:', error);
      return NextResponse.json(
        { error: 'Pokemon data bestand niet gevonden' },
        { status: 404 }
      );
    }

    // Probeer het bestand te lezen en log de grootte
    const fileContent = await fs.readFile(dataPath, 'utf-8');
    console.log('Bestandsgrootte:', fileContent?.length || 0, 'karakters');
    console.log('Eerste 100 karakters:', fileContent?.substring(0, 100));

    if (!fileContent) {
      console.error('Bestand is leeg');
      return NextResponse.json(
        { error: 'Pokemon data bestand is leeg' },
        { status: 500 }
      );
    }

    // Probeer de eerste regel te splitsen
    const firstLine = fileContent.split('\n')[0];
    console.log('Eerste regel:', firstLine);

    const pokemonData = parseCSV(fileContent);
    console.log('Aantal verwerkte Pokemon:', pokemonData.length);

    return NextResponse.json(pokemonData);
    
  } catch (error) {
    console.error('Gedetailleerde error:', error);
    return NextResponse.json(
      { error: `Fout bij het laden van Pokemon data: ${error.message}` },
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