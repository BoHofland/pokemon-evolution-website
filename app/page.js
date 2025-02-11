"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

// Component voor een enkele Pokémon in de evolutieboom
const PokemonNode = ({ pokemon, onClick }) => {
  return (
    <div 
      onClick={() => onClick(pokemon)}
      className="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-2 border-gray-200 hover:border-blue-400"
    >
      <Image
        src={pokemon.imageUrl || "/pokemon-placeholder.png"}
        alt={pokemon.name}
        width={120}
        height={120}
        className="object-contain"
      />
      <h3 className="mt-2 font-bold text-lg">{pokemon.name}</h3>
      <div className="flex gap-2 mt-1">
        {pokemon.types.map((type) => (
          <span
            key={type}
            className={`px-2 py-1 rounded text-sm text-white bg-${type.toLowerCase()}`}
          >
            {type}
          </span>
        ))}
      </div>
    </div>
  );
};

// Component voor de evolutielijn
const EvolutionChain = ({ chain }) => {
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  return (
    <div className="w-full">
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-8">
          {chain.map((stage, index) => (
            <div key={index} className="flex items-center">
              <PokemonNode
                pokemon={stage}
                onClick={setSelectedPokemon}
              />
              {index < chain.length - 1 && (
                <div className="w-16 h-1 bg-gray-300 mx-4" />
              )}
            </div>
          ))}
        </div>
        
        {selectedPokemon && (
          <div className="mt-8 p-6 bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">{selectedPokemon.name} Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Base Stats</h3>
                {Object.entries(selectedPokemon.stats).map(([stat, value]) => (
                  <div key={stat} className="flex justify-between">
                    <span>{stat}:</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="font-semibold mb-2">Abilities</h3>
                <ul className="list-disc pl-4">
                  {selectedPokemon.abilities.map((ability) => (
                    <li key={ability}>{ability}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function Home() {
  const [pokemonData, setPokemonData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hier zou je de data van de Kaggle dataset moeten laden
    // Voor nu gebruiken we voorbeeld data
    const mockData = [
      [{
        name: "Bulbasaur",
        types: ["Grass", "Poison"],
        stats: {
          HP: 45,
          Attack: 49,
          Defense: 49,
          "Sp. Attack": 65,
          "Sp. Defense": 65,
          Speed: 45
        },
        abilities: ["Overgrow", "Chlorophyll"],
        imageUrl: "/pokemon/1.png"
      }],
      // Voeg hier meer evolutieketens toe
    ];

    setPokemonData(mockData);
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-12">Pokémon Evolution Tree</h1>
      {loading ? (
        <div className="text-center">Laden...</div>
      ) : (
        <div className="space-y-16">
          {pokemonData.map((chain, index) => (
            <EvolutionChain key={index} chain={chain} />
          ))}
        </div>
      )}
    </div>
  );
}