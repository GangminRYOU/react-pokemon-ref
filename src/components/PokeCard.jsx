import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LazyImage from './LazyImage';

const PokeCard = ({ url, name }) => {
  /* 진짜 중요한 발견: useState에 초기값을 넣어준대로 type을 인식한다.
        그래서 useState([]); 배열로 넣고서 계속 null type checking을 하고 있으니, 조건부 렌더링이 안되고
        렌더링에 오류가 나니 useEffect()가 호출되기 전에 애초에 뻑나서 useEffect도 호출 안됨
    */
  const [pokemon, setPokemon] = useState();
  // console.log(name);
  useEffect(() => {
    fetchPokeDetailData();
  }, []);

  async function fetchPokeDetailData() {
    try {
      const response = await axios.get(url);
      console.log(response.data);
      const pokemonData = formatPokemonData(response.data);
      setPokemon(pokemonData);
    } catch (error) {
      console.log(error);
    }
  }

  function formatPokemonData(params) {
    const { id, types, name } = params;
    const PokeData = {
      id,
      name,
      type: types[0].type.name,
    };
    return PokeData;
  }
  //console.log(pokemon.id);
  const bg = `bg-${pokemon?.type}`;
  const border = `border-${pokemon?.type}`;
  const text = `text-${pokemon?.type}`;
  const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`;

  //console.log(text);
  return (
    <>
      {pokemon && (
        // a태그를 Link로 변경
        <Link
          to={`/pokemon/${name}`}
          className={`box-border rounded-lg ${border} w-[8.5rem] h-[8.5rem] z-0 bg-slate-800 justify-between items-center`}
        >
          <div
            className={`${text} h-[1.5rem] text-xs w-full pt-1 px-2 text-right rounded-t-lg`}
          >
            #{pokemon.id.toString().padStart(3, '00')}
          </div>
          <div className={'w-full f-6 flex items-center justify-center'}>
            <div
              className={
                'box-border relative flex w-full h-[5.5rem] basis justify-center items-center'
              }
            >
              <LazyImage src={img} alt={name} />
            </div>
          </div>
          <div
            className={`${bg} text-center text-xs text-zinc-100 h-[1.5rem] rounded-b-lg uppercase font-medium pt-1`}
          >
            {pokemon.name}
          </div>
        </Link>
      )}
    </>
  );
};

export default PokeCard;
