import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Pas dit pad aan naar waar je CSV bestand staat
    const dataPath = path.join(process.cwd(), 'data', 'pokemon.csv');
    const fileContents = await fs.readFile(dataPath, 'utf8');
    
    // Simpele CSV parser (je kunt ook csv-parse gebruiken voor robuustere parsing
    const rows = fileContents.split('\n').slice(1); // Skip header row
    const pokemon = rows.map(row => {
      const columns = row.split(',');
      return {
        pokedex_number: parseInt(columns[0]),
        name: columns[1],
        type: columns[2],
        hp: parseInt(columns[3]),
        attack: parseInt(columns[4]),
        defense: parseInt(columns[5]),
        sp_attack: parseInt(columns[6]),
        sp_defense: parseInt(columns[7]),
        speed: parseInt(columns[8]),
        abilities: columns[9],
        next_evolution: columns[10] || null
      };
    });

    return NextResponse.json(pokemon);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load Pokemon data' },
      { status: 500 }
    );
  }
} 