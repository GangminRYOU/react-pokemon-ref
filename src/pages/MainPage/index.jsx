import { useState, useEffect } from 'react';
import axios from 'axios';
import PokeCard from '../../components/PokeCard';
import AutoComplete from '../../components/AutoComplete';

function MainPage() {
  //모든 pokemon데이터를 가지고 있는 state
  const [allPokemons, setAllPokemons] = useState([]);
  //실제로 리스트로 보여주는 포켓몬 데이터를 가지고 있는 state
  const [displayedPokemons, setDisplayedPokemons] = useState([]);
  //한번에 보여주는 포켓몬 수
  const limitNum = 20;
  const url = `https://pokeapi.co/api/v2/pokemon?limit=1008&offset=0`;

  /* Component가 마운트가 되고, state 초기화 되고, html이 렌더링 된 다음에 호출된다. 
  그리고, useEffect에서 state를 변경해주면 화면이 rerendering이 된다.
  */
  useEffect(() => {
    fetchPokeData();
  }, []);
  /* 배열에 아무것도 없다면, component가 마운트되고 나서 한번만 호출된다. */

  /* 이 함수가 호출되어야 하는 상황
  1. 처음에 20개 이미지 렌더링
  2. 
  */
  const filterDisplayedPokemonData = (
    allPokemonsData,
    displayedPokemons = [],
  ) => {
    const limit = displayedPokemons.length + limitNum;
    //모든 포켓몬 데이터에서 limitNum만큼 더 가져오기
    const array = allPokemonsData.filter(
      (pokemon, index) => index + 1 <= limit,
    );
    return array;
  };

  const fetchPokeData = async () => {
    try {
      //1008개 포켓몬 데이터 받아오기
      const response = await axios.get(url);
      //console.log(response.data.results);
      //모든 포켓몬 데이터 기억하기
      setAllPokemons(response.data.results);
      //실제로 화면에 보여줄 포켓몬 리스트 기억하는 state
      setDisplayedPokemons(filterDisplayedPokemonData(response.data.results));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <article className="pt-6">
      <header className="flex flex-col gap-2 w-full px-4 z-50">
        <AutoComplete
          allPokemons={allPokemons}
          setDisplayedPokemons={setDisplayedPokemons}
        />
      </header>
      <section className="pt-6 flex flex-col justify-content items-center overflow-auto z-0">
        <div className="flex flex-row flex-wrap gap-[16px] items-center justify-center px-2 max-w-4xl">
          {displayedPokemons.length > 0 ? (
            displayedPokemons.map(({ url, name }, index) => (
              <PokeCard key={url} url={url} name={name} />
            ))
          ) : (
            <h2 className="font-medium text-lg text-slate-900 mb-1">
              포켓몬이 없습니다.
            </h2>
          )}
        </div>
      </section>
      {/* 더보기 버튼 */}
      <div className="textCenter">
        {allPokemons.length > displayedPokemons.length &&
          displayedPokemons.length !== 1 && (
            <button
              className="bg-slate-800 px-6 py-2 my-4 text-base rounded-lg fond-bold text-white"
              onClick={() =>
                setDisplayedPokemons(
                  filterDisplayedPokemonData(allPokemons, displayedPokemons),
                )
              }
            >
              더보기
            </button>
          )}
      </div>
    </article>
  );
}

export default MainPage;
