"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { processEvolutionData } from "../utils/pokemonData";

// Component voor een enkele Pokémon in de evolutieboom
const PokemonNode = ({ pokemon, onClick }) => {
  const safeLowerCase = (str) => {
    return str?.toLowerCase() || '';
  };

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
      <h3 className="mt-2 font-bold text-lg">{safeLowerCase(pokemon.name)}</h3>
      <div className="flex gap-2 mt-1">
        {pokemon.types.map((type) => (
          <span
            key={type}
            className={`px-2 py-1 rounded text-sm text-white bg-${safeLowerCase(type)}`}
          >
            {safeLowerCase(type)}
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
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/pokemon');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setPokemonData(data);
      } catch (e) {
        console.error('Error fetching pokemon:', e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  if (loading) {
    return <div>Laden...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pokemon Lijst</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pokemonData.map((pokemon, index) => (
          <div key={index} className="border p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold">{pokemon.name}</h2>
            {/* Voeg hier meer Pokemon details toe */}
          </div>
        ))}
      </div>
    </main>
  );
}
