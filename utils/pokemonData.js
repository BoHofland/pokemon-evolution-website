export const TYPE_COLORS = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC'
};

export function processEvolutionData(pokemonData) {
  // Maak een map van alle Pokémon voor snelle lookup
  const pokemonMap = new Map(
    pokemonData.map(pokemon => [pokemon.name.toLowerCase(), pokemon])
  );

  // Vind alle evolutieketens
  const evolutionChains = [];
  const processedPokemon = new Set();

  pokemonData.forEach(pokemon => {
    if (processedPokemon.has(pokemon.name.toLowerCase())) return;
    
    const chain = [];
    let currentPokemon = pokemon;
    
    while (currentPokemon) {
      chain.push({
        name: currentPokemon.name,
        types: currentPokemon.type.split(';'),
        stats: {
          HP: currentPokemon.hp,
          Attack: currentPokemon.attack,
          Defense: currentPokemon.defense,
          "Sp. Attack": currentPokemon.sp_attack,
          "Sp. Defense": currentPokemon.sp_defense,
          Speed: currentPokemon.speed
        },
        abilities: currentPokemon.abilities.split(';'),
        imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${currentPokemon.pokedex_number}.png`
      });
      
      processedPokemon.add(currentPokemon.name.toLowerCase());
      
      // Zoek de evolutie
      const nextEvolution = pokemonMap.get(
        currentPokemon.next_evolution?.toLowerCase()
      );
      currentPokemon = nextEvolution;
    }
    
    if (chain.length > 1) {
      evolutionChains.push(chain);
    }
  });

  return evolutionChains;
} 