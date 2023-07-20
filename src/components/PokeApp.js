import React, { useState, useEffect } from 'react';
import './PokeApp.css';

const PokeApp = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Loading Pokémon');

  const itemsPerPage = 10;
  const totalPokemons = 1010;

  useEffect(() => {
    const getPokemonDetails = async (id) => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch Pokémon with ID: ${id}`);
        }
        const pokemonData = await response.json();
        return {
          id: pokemonData.id,
          name: pokemonData.name,
          image: pokemonData.sprites.front_default,
          cp: Math.floor(Math.random() * 1000) + 500, // Random CP for demonstration
          attack: pokemonData.stats.find((stat) => stat.stat.name === 'attack').base_stat,
          defense: pokemonData.stats.find((stat) => stat.stat.name === 'defense').base_stat,
          type: pokemonData.types[0].type.name,
        };
      } catch (error) {
        console.error(error);
        return null;
      }
    };

    const fetchAllPokemonData = async () => {
      const allPokemonData = [];
      for (let id = 1; id <= totalPokemons; id++) {
        const pokemon = await getPokemonDetails(id);
        if (pokemon) {
          allPokemonData.push(pokemon);
        }
      }
      setPokemonList(allPokemonData);
      setTotalPages(Math.ceil(allPokemonData.length / itemsPerPage));
      setIsLoading(false);
    };

    fetchAllPokemonData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText((prevText) => {
        if (prevText.endsWith('...')) {
          return 'Loading Pokémon';
        } else {
          return prevText + '.';
        }
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = (event) => {
    const inputValue = event.target.value.toLowerCase();
    setSearchTerm(inputValue);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const filteredPokemonList = pokemonList.filter(
    (pokemon) => pokemon.name.toLowerCase().includes(searchTerm) || String(pokemon.id) === searchTerm
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedPokemonList = filteredPokemonList.slice(startIndex, endIndex);

  return (
    <div className="pokemon-app">
      <div className="pokemon-header">
        <h1 className="pokemon-title">Pokedex</h1>
      </div>
      <div className="pokemon-search">
        <input
          id="search"
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search Pokemon"
          className="pokemon-input"
        />
        <button onClick={handleSearch} className="pokemon-button">⌫</button>
      </div>
      {isLoading ? (
        <p>{loadingText}</p>
      ) : (
        <ul className="pokemon-list">
          {displayedPokemonList.map((pokemon) => (
            <li key={pokemon.id} className="pokemon-card">
              <h2 className="pokemon-name">{pokemon.name}</h2>
              <img src={pokemon.image} alt={pokemon.name} className="pokemon-image" />
              <p className="pokemon-info">
                <strong>CP:</strong> {pokemon.cp}
              </p>
              <p className="pokemon-info">
                <strong>Attack:</strong> {pokemon.attack}
              </p>
              <p className="pokemon-info">
                <strong>Defense:</strong> {pokemon.defense}
              </p>
              <p className="pokemon-info">
                <strong>Type:</strong> {pokemon.type}
              </p>
            </li>
          ))}
        </ul>
      )}
      <div className="pokemon-pagination">
        <button id="pokemon-pagination-previous" disabled={currentPage === 1} onClick={handlePreviousPage}>
          Previous
        </button>
        <span className="pokemon-pagination-text">
          Page {currentPage} of {totalPages}
        </span>
        <button id="pokemon-pagination-next" disabled={currentPage === totalPages} onClick={handleNextPage}>
          Next
        </button>
      </div>
    </div>
  );
};

export default PokeApp;
